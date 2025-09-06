require("dotenv").config();
require("module-alias/register");
const express = require("express");
const cookieParser = require("cookie-parser");
const { exec } = require("child_process");
const os = require("os");
const path = require("path");
const Logs = require("./middlewares/Logs");
const errorHandler = require("./middlewares/errorHandlers");
const port = process.env.PORT || 5000;
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, process.env.ROOT_VIEWS));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(Logs("POST"));

app.use(express.static(path.join(__dirname, "public")));
app.use(
  "/bootstrap",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist"))
);
app.use(
  "/ionicons",
  express.static(path.join(__dirname, "node_modules/ionicons"))
);

// Routes
const routes = require("@routes/web.js");
app.use("/", routes);

// Error handling
app.use((req, res, next) => {
  next({ status: 404, message: "❌ Halaman tidak ditemukan" });
});
app.use(errorHandler);

// Start App
const startApp = () => {
  const server = app.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(
        `❌ Port ${port} is already in use. Please choose another port.`
      );
      if (os.platform() === "win32") {
        exec(`netstat -a -n -o | find "${port}"`, (error, stdout) => {
          if (error) {
            console.error(
              `Gagal menemukan proses di port ${port}: ${error.message}`
            );
            process.exit(1);
          } else if (stdout) {
            const pidMatch = stdout.match(/LISTENING\s+(\d+)/);
            if (pidMatch && pidMatch[1]) {
              const pid = pidMatch[1];
              console.log(`Menemukan proses dengan PID ${pid} di port ${port}`);
              exec(`taskkill /PID ${pid} /F`, (killError) => {
                if (killError) {
                  console.error(
                    `Gagal menghentikan proses di port ${port}: ${killError.message}`
                  );
                  process.exit(1);
                } else {
                  console.log(`Proses di port ${port} telah dihentikan`);
                  setTimeout(startServer, 1000);
                }
              });
            } else {
              console.error(`Tidak ada proses ditemukan di port ${port}`);
              process.exit(1);
            }
          } else {
            exec(`fuser -k ${port}/tcp`, (error) => {
              if (error) {
                console.error(
                  `Gagal menghentikan proses di port ${port}: ${error.message}`
                );
                process.exit(1);
              } else {
                console.log(`⛔Proses di port ${port} telah dihentikan`);
                setTimeout(startServer, 1000);
              }
            });
          }
        });
      }
    } else {
      console.error(`⭕Kesalahan server: ${err.message}`);
      process.exit(1);
    }
  });
};

startApp();

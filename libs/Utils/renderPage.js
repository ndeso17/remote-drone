const path = require("path");
const ejs = require("ejs");

const renderPage = (req, res, css, js, view, data = {}) => {
  try {
    const pathView = req.app.get("views");
    const tipeDevice = "desktop";

    const contentPath = path.join(pathView, view, "page.ejs");
    // const layoutPath = path.join(
    //   __dirname,
    //   "../../Web/Layouts",
    //   `${tipeDevice}.ejs`
    // );
    const layoutPath = path.join(__dirname, "../../Web/Layouts", `index.ejs`);

    ejs.renderFile(contentPath, { ...data, req }, (err, content) => {
      if (err) {
        console.error("Error rendering content:", err);
        return res.status(500).send("Internal Server Error");
      }

      // 🔧 FIX: Kirim semua variabel ke layout (title, description, dll)
      ejs.renderFile(layoutPath, { ...data, content, css, js }, (err, html) => {
        // ejs.renderFile(layoutPath, { ...data, content }, (err, html) => {
        if (err) {
          console.error("Error rendering layout:", err);
          return res.status(500).send("Internal Server Error");
        }

        res.send(html);
      });
    });
  } catch (error) {
    const status = error.status || 500;
    const datas = {
      title: `${status} ${error.message || "Internal Server Error"}`,
      message: error.message || "Internal Server Error",
      description: "An error occurred while rendering the page.",
      keywords: status.toString(),
      errorCode: status.toString(),
    };
    res.status(status).render("error/page", datas);
  }
};

module.exports = renderPage;

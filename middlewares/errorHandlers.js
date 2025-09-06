const path = require("path");

const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || 500;
  const message =
    err.message ||
    (statusCode === 404
      ? "Halaman tidak ditemukan"
      : "Terjadi kesalahan pada server");

  console.error(`[${statusCode}] ${message}`);

  res.status(statusCode).render(path.join("error", "page"), {
    title: "Error " + statusCode,
    success: false,
    errorCode: statusCode,
    description: "Status Code " + statusCode,
    message,
  });
};

module.exports = errorHandler;

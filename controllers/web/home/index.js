const renderPage = require("@utils/renderPage");
const home = async (req, res) => {
  try {
    const data = {
      title: "Home",
      description: "Home Page",
      keywords: "home, index, home page",
    };

    renderPage(req, res, "home.css", "home.js", "home", data);
  } catch (error) {
    const status = error.status || 500;
    const message = error.message || "Internal Server Error";
    const title = `${status} ${message}`;

    const datas = {
      title,
      description: message,
      message,
      errorCode: status.toString(),
    };

    res.status(status).render("error/page", datas);
  }
};

module.exports = home;

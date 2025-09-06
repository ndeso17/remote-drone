const renderPage = require("@utils/renderPage");
const remote = async (req, res) => {
  try {
    const data = {
      title: "Remote",
      description: "Remote Page",
      keywords: "Remote, index, Remote page",
    };

    renderPage(req, res, "remote.css", "remote.js", "remote", data);
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

module.exports = remote;

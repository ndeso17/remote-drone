const homePage = require("@controllers/web/home");
const home = (req, res) => {
  return homePage(req, res);
};

const remotePage = require("@controllers/web/remote");
const remote = (req, res) => {
  return remotePage(req, res);
};

module.exports = { home, remote };

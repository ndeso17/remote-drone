const express = require("express");
const router = express.Router();
const app = require("@controllers/web.js");

router.get("/", app.home);
router.get("/remote", app.remote);

// Export the router
module.exports = router;

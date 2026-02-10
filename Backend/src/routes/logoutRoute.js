const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "../Frontend")));

const logoutRoute = app.post("/logout", (req, res) => {
  res.json({ success: true, message: "Logout successful" });
});

module.exports = logoutRoute;
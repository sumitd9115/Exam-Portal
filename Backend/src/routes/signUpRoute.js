const express = require("express");
const path = require("path");
const pool = require("../config/db.js");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "../Frontend")));

const signUpRoute = app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4);",
      [name, email, password, "user"],
    );

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND password = $2;",
      [email, password],
    );

    if (result.rows.length > 0) {
      res.status(200).json({ success: true, message: "Signup Successful!!" });
    } else {
      res.status(401).json({ success: false, message: "Signup Unsuccessful" });
    }
  } catch (err) {
    console.error("Error verifying user: ", err);
    res.status(501).json({ success: false, message: "Server Error" });
  }
});

module.exports = signUpRoute;

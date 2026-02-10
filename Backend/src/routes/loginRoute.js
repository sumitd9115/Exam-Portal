const express = require("express");
const path = require("path");
const pool = require("../config/db.js");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const SECRET_KEY = process.env.JWT_SECRET;

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "../Frontend")));


const loginRoute = app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND password = $2;",
      [email, password]
    );

    if (result.rows.length > 0) {
      const user = result.rows[0];

      const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
        expiresIn: "1h",
      });

      res.status(200).json({
        success: true,
        message: "Login Successful!!",
        token: token,
        id: result.rows[0].id,
        name: result.rows[0].name,
        role: result.rows[0].role,
      });
    } else {
      res.status(401).json({ success: false, message: "Login Unsuccessful!!" });
    }
  } catch (err) {
    console.error("Error verifying user: ", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = loginRoute;
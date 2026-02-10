require("dotenv").config();
const express = require("express");
const path = require("path");
const loginRoute = require("./src/routes/loginRoute.js");
const signUpRoute = require("./src/routes/signUpRoute.js");
const logoutRoute = require("./src/routes/logoutRoute.js");
const storeRoute = require("./src/routes/storeRoute.js");
const testDataRoute = require("./src/routes/testDataRoute.js");

const app = express();
app.use(express.json());

app.use("/api", storeRoute);
app.use("/api", testDataRoute);
app.use("/", loginRoute);
app.use("/", signUpRoute);
app.use("/", logoutRoute);

app.use(express.static(path.join(__dirname, "../Frontend")));

app.get("/Home", (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/Pages/user/index.html"));
});

app.get("/adminHome", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../Frontend/Pages/admin/admin_index.html"),
  );
});

app.get("/AttemptedTests", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../Frontend/Pages/user/AttemptedTests.html"),
  );
});

app.get("/MCQ_Exampage", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../Frontend/Pages/user/MCQ_Exampage.html"),
  );
});

app.get("/viewResults", (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/Pages/user/viewResults.html"));
});

// Admin Side Routes
app.get("/Test_basic_info", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../Frontend/Pages/admin/Test_basic_info.html"),
  );
});

app.get("/MCQ_Test_Ques_Ans", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../Frontend/Pages/admin/MCQ_Test_Ques_Ans.html"),
  );
});

// Both Admin and User Side Routes
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/Pages/auth/login.html"));
});

app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/Pages/auth/SignUp.html"));
});

app.listen(3000, () =>
  console.log("Server running on http://localhost:3000/login"),
);

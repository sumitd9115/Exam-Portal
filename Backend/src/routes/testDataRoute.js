const express = require("express");
const testRouter = express.Router();
const testDataController = require("../controllers/testDataControllers.js");

testRouter.post("/getTestsData", testDataController.getTestsData);
testRouter.post("/getAllTests", testDataController.getAllTests);
testRouter.post("/getQuesAns", testDataController.getQuesAns);
testRouter.post("/getAttemptedTestsData", testDataController.getAttemptedTestsData);
testRouter.post("/getTestResults", testDataController.getTestResults);

module.exports = testRouter;

const express = require("express");
const storeRouter = express.Router();
const storeController = require("../controllers/storeControllers.js");

storeRouter.post("/storeTestBasicInfo", storeController.storeTestBasicInfo);
storeRouter.post("/storeQuesAnsInfo", storeController.storeQuesAnsInfo);
storeRouter.post("/storeQuesCount", storeController.storeQuesCount);
storeRouter.post("/submitMCQs", storeController.submitMCQs);

module.exports = storeRouter;
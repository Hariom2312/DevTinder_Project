const express = require('express');
const chatRouter = express.Router();

const { getHistory , postMessage} = require("../controller/chat");

chatRouter.get("/chat/history/:userId/:targetUserId",getHistory);
chatRouter.post("/chat/message",postMessage);

module.exports = chatRouter;
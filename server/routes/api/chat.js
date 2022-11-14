const express = require("express");
const router = express.Router();
const chatController = require("../../controllers/chatController");

router.route("/")
.get(chatController.fetchChats)
.post(chatController.accessChat);

module.exports = router;

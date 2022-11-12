const express = require("express");
const router = express.Router();
// const chatController = require("../../controllers/chatController");

router.route("/").get((req, res) => {
    console.log("agdasgasdfg".red);
    res.json({ olA: "gasdgas" });
});
// .get(chatController.getAllChat)

module.exports = router;

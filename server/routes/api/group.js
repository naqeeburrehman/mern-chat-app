const express = require("express");
const router = express.Router();
const groupController = require("../../controllers/groupController");

router.route("/")
.post(groupController.createGroupChat)
.patch(groupController.renameGroup)
.put(groupController.addToGroup)
.delete(groupController.removeFromGroup)

module.exports = router;

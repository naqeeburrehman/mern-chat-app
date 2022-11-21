const express = require("express");
const router = express.Router();
const groupController = require("../../controllers/groupController");

router.route("/")
    .post(groupController.createGroupChat);

router
    .route("/:id")
    .patch(groupController.updateGroup)
    .put(groupController.addToGroup)
    .delete(groupController.removeFromGroup);

module.exports = router;

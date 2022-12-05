const express = require("express");
const router = express.Router();
const searchController = require("../../controllers/searchController");
const verifyJWT = require("../../middleware/verifyJWT");

router.route("/")
    .get(verifyJWT,searchController.search)
    .post(verifyJWT,searchController.searchPost);

module.exports = router;

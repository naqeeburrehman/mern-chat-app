const express = require('express');
const router = express.Router();
const registerController = require('../../controllers/registerController');
const reqRateLimit = require('../../middleware/reqRateLimiter');

router.post('/',reqRateLimit(10, 60), registerController.handleNewUser);

module.exports = router;
const express = require('express');
const { getAnswer } = require('../controllers/queryControllers');
const router = express.Router();

router.post('/' , getAnswer);

module.exports = router;
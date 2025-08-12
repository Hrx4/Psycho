const express = require('express');
const { addFile } = require('../controllers/fileControllers');
const { getAnswer } = require('../controllers/queryControllers');
const router = express.Router();

router.get('/' , getAnswer);

module.exports = router;
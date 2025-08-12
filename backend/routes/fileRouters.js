const express = require('express');
const { addFile } = require('../controllers/fileControllers');
const router = express.Router();

router.post('/add-file' , addFile);

module.exports = router;
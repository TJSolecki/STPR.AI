const express = require('express');
const { generateResponse } = require('../controllers/openaiController')
const router = express.Router();

router.post('/generateResponse', generateResponse);

module.exports = router;
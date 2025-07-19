const express = require('express');
const { getApiEndpoints } = require('../controllers/api');
const router = express.Router();

router.get('/', getApiEndpoints);

module.exports = router;

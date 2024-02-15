"use strict"
const express = require('express');
const router = express.Router();
const userDataController = require('../controllers/userDataController');

router.post('/data', userDataController.inputUserData);

module.exports = router;

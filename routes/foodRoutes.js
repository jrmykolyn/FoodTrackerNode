"use strict"
const express = require('express');
const router = express.Router();
const foodController = require('../controllers/foodController');

// GET all food 
router.get('/food', foodController.getFood);

// get all the stores
router.get('/stores', foodController.getStores);

router.get('/stores/:id', foodController.getStoreByID);


router.get('/prices/:id', foodController.getStorePrices);

router.get('/prices/:id/:foodname', foodController.getStorePriceByName);

module.exports = router;
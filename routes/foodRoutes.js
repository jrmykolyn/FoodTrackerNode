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

router.get('/pricehistory/:storeID/:foodID', foodController.getPriceHistory);

router.get('/pricecompare/:id/:foodname', foodController.getPriceCompare);

router.get('/latestprice/:storeID/:foodCatID', foodController.getLatestPriceByCat);

router.get('/similarfood/:foodID/:storeID', foodController.getSimilarFoods);

router.get('/storecats/:storeID', foodController.getStoreCatList);

module.exports = router;
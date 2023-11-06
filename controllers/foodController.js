const foodModel = require('../models/foodModel')

async function getFood(req, res) {
    try {
        const food = await foodModel.getAllFood();
        res.json(food);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
async function getStores(req, res) {
    try {
        const food = await foodModel.getAllStores();
        res.json(food);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
async function getStoreByID(req, res) {
    const{ id } = req.params;
    try {
        const food = await foodModel.getStoreByID(id);
        res.json(food);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
async function getStorePrices(req, res) {
    const{ id } = req.params;
    try {
        const food = await foodModel.getStorePrices(id);
        res.json(food);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
async function getPriceHistory(req, res) {
    let data = {
        storeID: req.params.storeID,
        foodID: req.params.foodID
    }
    try {
        const food = await foodModel.getPriceHistory(data['storeID'],data['foodID']);
        res.json(food);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
async function getStorePriceByName(req, res) {
    let data = {
        id: req.params.id,
        foodname: req.params.foodname
    }
    try {
        const food = await foodModel.getStorePriceByName(data['id'],data['foodname']);
        res.json(food);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
async function getPriceCompare(req, res) {
    let data = {
        id: req.params.id,
        foodname: req.params.foodname
    }
    try {
        const food = await foodModel.getPriceCompare(data['id'],data['foodname']);
        res.json(food);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
async function getLatestPriceByCat(req, res) {
    let data = {
        storeID: req.params.storeID,
        foodCatID: req.params.foodCatID
    }
    try {
        const food = await foodModel.getLatestPriceByCat(data['storeID'],data['foodCatID']);
        res.json(food);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function getSimilarFoods(req, res) {
    let data = {
        foodID: req.params.foodID,
        storeID: req.params.storeID
    }
    try {
        const food = await foodModel.getSimilarFoods(data['foodID'],data['storeID']);
        res.json(food);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    getFood,
    getStores,
    getStoreByID,
    getStorePrices,
    getStorePriceByName,
    getPriceCompare,
    getPriceHistory,
    getLatestPriceByCat,
    getSimilarFoods,
};
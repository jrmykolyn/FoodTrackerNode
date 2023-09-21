const mysql = require('mysql2/promise');
require('dotenv').config();

const db = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  };

const pool = mysql.createPool(db);

async function getAllStores() {
    const [rows] = await pool.query('SELECT * FROM store');
    return rows;
}
async function getStoreByID(id) {
    const [rows] = await pool.query('SELECT * FROM store where storeId = ?', [id]);
    return rows;
}
async function getAllFood() {
    const [rows] = await pool.query('SELECT * FROM food');
    return rows;
}

async function getStorePrices(id) {
    const [rows] = await pool.query('SELECT * FROM price p join food f on p.foodID = f.foodID where storeID = ? LIMIT 100', [id]);
    return rows;
}
async function getStorePriceByName(id,foodname) {
    const [rows] = await pool.query('SELECT * FROM price p join food f on p.foodID = f.foodID where storeID = ? and f.foodname like ? order by priceListing asc', [id, `%${foodname}%`]);
    return rows;
}

module.exports = {
    getAllStores,
    getAllFood,
    getStorePrices,
    getStoreByID,
    getStorePriceByName
}
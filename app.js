"use strict"


//https://github.com/renelikestacos/Web-Mapping-Leaflet-NodeJS-Tutorials
const express = require('express');
const mysql = require('mysql2/promise');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const foodRoutes = require('./routes/foodRoutes')
const app = express();

// Middleware
//app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.json());

// Create a MySQL connection pool
//const pool = mysql.createPool(db);

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));


// API routes

// Routes
app.use('/api', foodRoutes);

// Define a route to fetch and display data from the database
app.get('/', (req, res) => {
    res.render('index');
  //});
});

app.get('/map', (req, res) => {
      res.render('map')
  });

app.get('/news', (req, res) => {
    res.render('news')
})

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
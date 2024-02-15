"use strict"


const express = require('express');
const mysql = require('mysql2/promise');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const foodRoutes = require('./routes/foodRoutes')
const userRoutes = require('./routes/userRoutes')
const app = express();

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

// API routes

// Routes
app.use('/api', foodRoutes);
app.use('/submit', userRoutes);

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

app.get('/pricehist', (req, res) => {
    res.render('pricehist')
})

app.get('/trends', (req, res) => {
    res.render('trends', {
      sidebar: 'Trends' 
    });
})
app.get('/submitprices', (req, res) => {
    res.render('userSubmit')
})

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
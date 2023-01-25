const xlsx = require('xlsx');
const cheerio = require('cheerio');
const axios = require('axios');
const request = require('request');
const fs = require('fs');
const json2csv = require('json2csv').parse;

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

const readExcel = require('./functions/readExcel');
const separateExcel = require('./functions/separateExcel');


// Create a folder called data
if (!fs.existsSync('data')) {
  fs.mkdirSync('data');
}

// Express Options
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('tiny'));

// Express Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/separate', (req, res) => {
  separateExcel();
  res.send("Excel file is separated...");
})


app.get('/read', (req, res) => {
  readExcel();
  res.send("Program is running...");
})


app.get('/remove', (req, res) => {
  fs.rmdirSync('data', { recursive: true });
  res.send("Data folder is removed...");
})

// Start server
var port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`🚀 Server started on port ${port}`);
}).on('error', err => {
  console.log(err);
});

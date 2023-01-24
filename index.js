const xlsx = require('xlsx');
const cheerio = require('cheerio');
const axios = require('axios');
const request = require('request');
const fs = require('fs');
const json2csv = require('json2csv').parse;

const readExcel = require('./functions/readExcel');
const separateExcel = require('./functions/separateExcel');


// Create a folder called data
if (!fs.existsSync('data')) {
  fs.mkdirSync('data');
}

if (!fs.existsSync('generated')) {
  fs.mkdirSync('generated');
}


function removeData() {
  console.log("Removing the data folder...")
  fs.rmdirSync('data', { recursive: true });
  fs.rmdirSync('generated', { recursive: true });
}


function programRun() {
  console.log("Running the program...")
  separateExcel();
  readExcel();
}

//programRun();
removeData();

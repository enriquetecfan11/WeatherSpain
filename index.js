const xlsx = require('xlsx');
const cheerio = require('cheerio');
const axios = require('axios');
const request = require('request');
const fs = require('fs');


// Read Town_index.csv
const workbook = xlsx.readFile('general.csv');

// Get the first worksheet
const worksheet = workbook.Sheets[workbook.SheetNames[0]];


// Convert the worksheet to an array of arrays
const data = xlsx.utils.sheet_to_json(worksheet);

// Get the lenght of data
const dataLength = data.length;
console.log(dataLength)

//take the data 100 by 100 and create several excel files and save them called "excel-x" in a folder called data, x = the file number.

// Create a folder called data
if (!fs.existsSync('data')) {
  fs.mkdirSync('data');
}

function separateExcel() {
  for (let i = 0; i < dataLength; i += 100) {
    const dataSlice = data.slice(i, i + 100);
    const newWorkBook = xlsx.utils.book_new();
    const newWorkSheet = xlsx.utils.json_to_sheet(dataSlice);
    xlsx.utils.book_append_sheet(newWorkBook, newWorkSheet, 'Sheet 1');
    xlsx.writeFile(newWorkBook, `data/excel-${i}.xlsx`);
  }
}


function readExcel() {
  for (let i = 0; i < dataLength; i += 100) {
    const workbook = xlsx.readFile(`data/excel-${i}.xlsx`);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(worksheet);
    const dataLength = data.length;

    for (let j = 0; j < dataLength; j++) {
      const url = data[j].url;
      request(url, (error, response, html) => {
        if (!error && response.statusCode == 200) {
          const $ = cheerio.load(html);
          const temp = $('.c-tib-text').text();
          const title = $('.-itl').text();
          const titleTrim = title.trim();
          const date = new Date();
          const today = date.toLocaleDateString();
          const timestamp = date.getTime();
          fs.appendFile('data.json', `
          {
            "timestamp": "${timestamp}"
            "title": "${titleTrim}",
            "temp": "${temp}",
            "url": "${url}",
          },
          `, (err) => {
            if (err) throw err;
            if (i === dataLength - 1 && j === dataLength - 1) {
              console.log('Data saved!');
            }
          });
        }
      });
    }
  }
}

// Create a multithreding system to run all
async function run() {
  await separateExcel();
  await readExcel();
}

run();

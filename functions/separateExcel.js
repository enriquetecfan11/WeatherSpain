const xlsx = require('xlsx');
const cheerio = require('cheerio');
const axios = require('axios');
const request = require('request');
const fs = require('fs');
const json2csv = require('json2csv').parse;

// Read Town_index.csv
const workbook = xlsx.readFile('general.csv');
// Get the first worksheet
const worksheet = workbook.Sheets[workbook.SheetNames[0]];
// Convert the worksheet to an array of arrays
const data = xlsx.utils.sheet_to_json(worksheet);
// Get the lenght of data
const dataLength = data.length;


function separateExcel() {
  for (let i = 0; i < dataLength; i += 100) {
    const dataSlice = data.slice(i, i + 100);
    const newWorkBook = xlsx.utils.book_new();
    const newWorkSheet = xlsx.utils.json_to_sheet(dataSlice);
    xlsx.utils.book_append_sheet(newWorkBook, newWorkSheet, 'Sheet 1');
    xlsx.writeFile(newWorkBook, `data/excel-${i}.xlsx`);
    console.log(
      `Excel file ${i} has been created with ${dataSlice.length} rows`
    )
  }
}

module.exports = separateExcel;

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

let counter = 0;

function generateId() {
  return counter++;
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
          const id = generateId()
          const date = new Date();
          const today = date.toLocaleDateString();
          const timestamp = date.getTime();

          const $ = cheerio.load(html);
          const temp = $('.c-tib-text').text();
          const title = $('.-itl').text();
          const titleTrim = title.trim();

          const data = {
            id,
            timestamp,
            today,
            title: titleTrim,
            temp,
            url,
          };

          const day = date.getDate().toString().padStart(2, '0');
          const filename = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + day;


          //replace : to - in filename
          // const filenameTrim = filename.replace(/:/g, "-");
          // const filenameTrim2 = filenameTrim.replace(/ /g, "-");

          const dataJson = JSON.stringify(data);

          fs.appendFile(`generatedData/${filename}.json`, dataJson + '\n', (err) => {
            if (err) throw err;
            console.log('The data has been appended to file!');
            console.log("ID: " + id);
            if (id >= 1892) {
              console.log("The program has finished!")
              process.exit();
            }
          });
        }
      });
    }
  }
}

module.exports = readExcel;

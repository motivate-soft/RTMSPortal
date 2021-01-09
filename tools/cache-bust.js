const cheerio = require('cheerio')
const fs = require('fs');
const indexFilePath = 'dist/rtms-portal/index.html'

console.log('POST build script started...')

// read our index file
console.log(`Updating ${indexFilePath}`);
fs.readFile(indexFilePath, 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }

    const $ = cheerio.load(data)

    const envJsSource = $('#envJs').attr('src');
    $('#envJs').attr('src', `${envJsSource}?_=${new Date().getTime()}`);

    fs.writeFile(indexFilePath, $.html(), function (err) {
        if (err) return console.log(err);
        console.log(`Updated ${indexFilePath}`);
    });
  });

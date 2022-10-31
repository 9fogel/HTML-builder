const path = require('path');
const fs = require('fs');

// console.log(path.join(__dirname, 'text.txt'));
const readableStream = fs.createReadStream(path.join(__dirname, 'text.txt'));
readableStream.on('data', data => console.log(data.toString()));


const fs = require('fs');
const path = require('path');
const { copyFile, readdir } = require('node:fs/promises');

fs.mkdir(path.join(__dirname, 'files-copy'), err => {
  if (err) throw err;//если папка уже существует, то выдает ошибку
  console.log('Папка была создана');
})
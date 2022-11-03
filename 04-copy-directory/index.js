const fs = require('fs');
const path = require('path');
const { copyFile, readdir } = require('node:fs/promises');

fs.mkdir(path.join(__dirname, 'files-copy'), err => {
  if (err) {
    // throw err;//если папка уже существует, то выдает ошибку
    fs.rmdir(path.join(__dirname, 'files-copy'), err => {
      if(err) throw err; // не удалось удалить папку
      console.log('Папка успешно удалена');
    });
  }
  console.log('Папка была создана');
});

async function readFiles() {
  try {
    const files = await readdir(path.join(__dirname, 'files'));
    console.log(files);
    return files;
    // for (const file of files) {

    // }
  } catch (err) {
    console.error(err);
  }
}

// readFiles();
console.log(readFiles());
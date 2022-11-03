const path = require('path');
const { readdir } = require('fs/promises');
const fs = require('fs');

async function readFilesInfo() {
  try {
    const files = await readdir(path.join(__dirname, 'secret-folder'));
    for (const file of files) {
      fs.stat(path.join(__dirname, 'secret-folder', `${file}`), (err, stats) => {
        if (err) {
          console.error(err)
          return
        }
        if (stats.isFile()) {
          let name = path.basename(file).split('.')[0];
          let ext = path.extname(file).slice(1);
          let size = stats.size;
          console.log(`${name} - ${ext} - ${size}b`);
          }
        });
      };
  } catch (err) {
    console.error(err);
  }
}

readFilesInfo();
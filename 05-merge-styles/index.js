const fs = require('fs');
const path = require('path');
const { readdir, stat } = require('node:fs/promises');

fs.writeFile(
  path.join(__dirname, 'project-dist', 'bundle.css'),
  '',
  (err) => {
    if (err) throw err;
  }
);

async function mergeStyles() {
  const files = await readdir(path.join(__dirname, 'styles'));
  // console.log('files', files);

  for (const file of files) {
    let ext = path.extname(file).slice(1);
    const stats = await stat (path.join(__dirname, 'styles', `${file}`));

    if (stats.isFile() && ext === 'css') {
      const readableStream = fs.createReadStream(path.join(__dirname, 'styles', `${file}`));
      readableStream.on('data', data => {
        fs.appendFile(
          path.join(__dirname, 'project-dist', 'bundle.css'),
          `${data}\n`,
          err => {
            if (err) throw err;
          }
        );
    });
    }
  }
  console.log('merge completed successfully');
}

mergeStyles();
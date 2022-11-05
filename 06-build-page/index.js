const fs = require('fs');
const path = require('path');
const { copyFile, readdir, stat } = require('node:fs/promises');

async function addFolder(pathName) {
  await fs.promises.mkdir(pathName, { recursive: true });//,
  // (err) => console.error(err));
  console.log('Папка была создана');
}

async function deleteFolder(pathName) {
  await fs.promises.rm(pathName, { recursive: true, force: true, maxRetries: 100 });//,
  // (err) => console.error('err', err));
  console.log('Папка успешно удалена');
}

function createStylesFile() {
  fs.writeFile(
  path.join(__dirname, 'project-dist', 'style.css'),
  '',
  (err) => {
    if (err) throw err;
  }
  );
}

function createHTMLFile() {
  fs.writeFile(
  path.join(__dirname, 'project-dist', 'index.html'),
  '',
  (err) => {
    if (err) throw err;
  }
  );
}

async function hasCopyDir(pathName, folderName) {
  try {
    const folders = await readdir(pathName);
    console.log('folders', folders);
    if (folders.includes(`${folderName}`)) {
      console.log(`${folderName} существует - удаляем - проверяем заново`);
      const insideFolder = await readdir(path.join(__dirname, `${folderName}`));
      console.log('inside', insideFolder);
        await deleteFolder(path.join(__dirname, `${folderName}`));
        hasCopyDir(pathName, folderName);
    } else {
      console.log(`${folderName} не существует - создаем`);
      console.log(path.join(__dirname, `${folderName}`));
      addFolder(path.join(__dirname, `${folderName}`));
      createHTMLFile();
      getComponents();
      createStylesFile();
      mergeStyles();
      addFolder(path.join(__dirname, `${folderName}`, 'assets'));
      copyFiles(path.join(__dirname, 'assets'));
    }
  } catch (err) {
    console.error('error', err);
  }
}

async function copyFiles(pathName) {
  try {
    // addFolder();
    const files = await readdir(pathName);
    // console.log('files', files);
    for (const file of files) {
      const stats = await stat (path.join(__dirname, 'assets', `${file}`));
      if (stats.isDirectory()) {
        // console.log('dir', file);
        const copy = addFolder(path.join(__dirname, 'project-dist', 'assets', `${file}`));
        const filesInFolder = await readdir(path.join(__dirname, 'assets', `${file}`));
        // console.log('filesInFolder', filesInFolder);
        for (const fileIF of filesInFolder) {
          // console.log(path.join(__dirname, 'project-dist', 'assets', `${file}`, `${fileIF}`));
          const copy = await copyFile(path.join(__dirname, 'assets', `${file}`, `${fileIF}`), path.join(__dirname, 'project-dist', 'assets', `${file}`, `${fileIF}`));
        }
      } else {
        const copy = await copyFile(path.join(__dirname, 'assets', `${file}`), path.join(__dirname, 'project-dist', 'assets', `${file}`));
      }
    }
    console.log('assets copied successfully')
  } catch (err) {
    console.error(err);
  }
}

async function mergeStyles() {
  const files = await readdir(path.join(__dirname, 'styles'));
  // console.log('style-files', files);

  for (const file of files) {
    let ext = path.extname(file).slice(1);
    const stats = await stat (path.join(__dirname, 'styles', `${file}`));

    if (stats.isFile() && ext === 'css') {
      const readableStream = fs.createReadStream(path.join(__dirname, 'styles', `${file}`));
      readableStream.on('data', data => {
        fs.appendFile(
          path.join(__dirname, 'project-dist', 'style.css'),
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

async function getComponents() {
  const components = await readdir(path.join(__dirname, 'components'));
  let HTMLcode = '';

  const rs = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
  rs.on('data', data => {
    HTMLcode = data;
    for (let component of components) {
      const rsComp = fs.createReadStream(path.join(__dirname, 'components', `${component}`), 'utf-8');
      let tempHTML = '';
      rsComp.on('data', data => {
        tempHTML = data;
        while (HTMLcode.toString().includes(`{{${component.split('.')[0]}}}`)) {
          HTMLcode = HTMLcode.toString().replace(`{{${component.split('.')[0]}}}`, `${tempHTML}`);
          fs.writeFile(
              path.join(__dirname, 'project-dist', 'index.html'),
              `${HTMLcode}`,
              err => {
                if (err) throw err;
                // console.log('Файл был изменен');
              }
            );
        }
      });
      }
  });
}

hasCopyDir(path.dirname(__filename), 'project-dist');

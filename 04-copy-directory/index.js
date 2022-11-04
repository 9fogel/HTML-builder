const fs = require('fs');
const path = require('path');
const { copyFile, readdir, stat } = require('node:fs/promises');

async function addFolder() {
  await fs.promises.mkdir(path.join(__dirname, 'files-copy'));//,
  // (err) => console.error(err));
  // console.log('Папка была создана');
}

async function deleteFolder() {
  await fs.promises.rm(path.join(__dirname,'files-copy'), { recursive:true, force: true });//,
  // (err) => console.error('err', err));
  // console.log('Папка успешно удалена');
}

async function hasCopyDir() {
  try {
    const folders = await readdir(path.dirname(__filename));
    // console.log('folders', folders);
    if (folders.includes('files-copy')) {
      // console.log('files-copy существует - удаляем - проверяем заново');
      await deleteFolder();
      hasCopyDir();
    } else {
      // console.log('files-copy не существует - создаем');
      // addFolder();
      copyFiles();
    }
  } catch (err) {
    console.error('error', err);
  }
}

async function copyFiles() {
  try {
    addFolder();
    const files = await readdir(path.join(__dirname, 'files'));
    // console.log('files', files);

    for (const file of files) {
      const copy = await copyFile(path.join(__dirname, 'files', `${file}`), path.join(__dirname, 'files-copy', `${file}`));
      // console.log('copied successfully');
    }
    console.log('copied successfully')
  } catch (err) {
    console.error(err);
  }
}

// deleteFolder();
// addFolder();
hasCopyDir();
// copyFiles();
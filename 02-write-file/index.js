const fs = require('fs');
const path = require('path');

fs.writeFile(
  path.join(__dirname, 'task2.txt'),
  '',
  (err) => {
    if (err) throw err;
    // console.log('Файл был создан');
  }
);

const { stdin, stdout, stderr } = process;
stdout.write('Пожалуйста введите любой текст \n');
stdin.on('data', data => {
  if (data.toString() == 'exit\r\n') {
    stdout.write('Bye-bye');
    process.exit();
  }//обрабатывает выход через .exit+enter
  fs.appendFile(
    path.join(__dirname, 'task2.txt'),
    `${data}`,
    err => {
      if (err) throw err;
      // console.log('Файл был изменен');
    }
  );
});

process.on('SIGINT', () => {
  stdout.write('Bye-bye');
  process.exit();
});//обрабатывает выход через ctrl+c
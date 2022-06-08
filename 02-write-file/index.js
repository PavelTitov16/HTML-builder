const fs = require('fs');
const path = require('path');
const pathToFile = path.join(__dirname, 'answer.txt');

fs.writeFile(pathToFile, '', (error) => {
    if (error) {
      return console.log(error.message);
    } else {
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    process.stdout.write('Tell about your favourite book, please?');
    readline.on('line', (answer) => {
      if (answer === 'exit') {
        readline.close();
      } else {
      fs.appendFile(pathToFile, `${answer}\n`, (error) => {
          if (error) return console.error(error.message);
        });
      }
    });
    readline.on('close', () => process.stdout.write('Thank you! Have a nice day!'));
  }
});
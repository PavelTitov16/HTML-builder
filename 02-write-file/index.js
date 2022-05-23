const fs = require('fs');
const path = require('path');

fs.writeFile(path.join(__dirname, 'answer.txt'), '', (error) => {
    if (error) {
      return console.log(error.message);
    } else {
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    process.stdout.write('What is your favourite book?');
    readline.on('line', (answer) => {
      if (answer === 'exit') {
        readline.close();
      } else {
      fs.appendFile(path.join(__dirname, 'answer.txt'), `${answer}\n`, (error) => {
          if (error) return console.error(error.message);
        });
      }
    });
    readline.on('close', () => process.stdout.write('Have a nice day!'));
  }
});
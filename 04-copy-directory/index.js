const fs = require('fs');
const path = require('path');
const folderPath = path.join(__dirname, 'files');
const copyPath = path.join(__dirname, 'files-copy');

fs.rm(copyPath, {force: true, recursive: true }, (error) => {
  if (error) {
    return console.error(error.message);
  } 
  fs.mkdir(copyPath, {recursive: true}, (error) => {
    if (error) {
      return console.error(error.message);
    } else {
      fs.readdir(folderPath, {withFileTypes: true}, function (error, files) {
        if (error) {
          return console.error(error.message);
        }
        files.forEach((file) => {
          if (file.isFile()) {
            fs.copyFile(path.join(folderPath, file.name), path.join(copyPath, file.name), (error) => {
              if (error) {
                return console.error(error.message);
              }
            });
          }
        });
      });
    }
  });
});
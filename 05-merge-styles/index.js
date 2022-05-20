const fs = require('fs');
const path = require('path');
const folderPath = path.join(__dirname, 'styles');
const bundlePath = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));

fs.readdir(folderPath, {withFileTypes: true}, function (error, styles) {
    if (error) {
      return console.error(error.message);
    }
    styles.forEach((style) => {
      if (style.isFile() && path.extname(style.name) === '.css') {
        const inputPath = fs.createReadStream(path.join(folderPath, style.name), 'utf-8');
        inputPath.pipe(bundlePath, { end: false });
      }
    });
});

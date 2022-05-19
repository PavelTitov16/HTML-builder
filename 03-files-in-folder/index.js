const fs = require('fs');

const path = require('path');

fs.readdir(path.join(__dirname, 'secret-folder'), function (err, files) {
    if (err) {
        return console.error(error.message);
    }
    files.forEach((file) => {
        const filePath = path.join(__dirname, 'secret-folder', file);
        fs.stat(filePath, (err, file) => {
            if (err) {
                return console.error(error.message);
            }
            if (file.isFile()) {
                console.log(`${path.parse(filePath).name} - ${path.extname(filePath).slice(1)} - ${file.size / 1024}kb`)
            }
        });
    });
});
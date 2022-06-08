const fs = require('fs');
const path = require('path');
const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, function (err, files) {
    if (err) {
        return console.error(err.message);
    }
    files.forEach((file) => {
        const filePath = path.join(folderPath, file);
        
        fs.stat(filePath, (err, file) => {
            if (err) {
                return console.error(err.message);
            }
            if (file.isFile()) {
                console.log(`${path.parse(filePath).name} - ${path.extname(filePath).slice(1)} - ${file.size / 1024}kb`)
            }
        });
    });
});
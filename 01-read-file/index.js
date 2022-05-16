let fs = require('fs');

const path = require('path');
let stream = new fs.ReadStream(path.join(__dirname, 'text.txt'), 'utf-8');

stream.on('readable', () => {
    let data = stream.read();
    if (data != null) console.log(data);
});

stream.on('error', (err) =>  {
    if (err.code === 'ENOENT') {
        console.log("File not found");
    } else {
        console.error(err);
    }
});

stream.on('end', () => {
    console.log("THE END");
});


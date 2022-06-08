const {
    readdir,
    stat,
} = require('fs/promises');
const path = require('path');

const getBaseName = (filePath, ext) => {
    return path.basename(filePath, ext);
}

const getExtension = (filePath) => {
    const extension = path.extname(filePath);
    return extension.slice(1);
}

const getSize = (itemStats) => {
    return itemStats.size;
}

const readFolder = async () => {
    const folderPath = path.join(__dirname, 'secret-folder');

    try {
        const content = await readdir(folderPath);

        content.forEach(async (item) => {
            const filePath = path.join(folderPath, item);
            const itemStats = await stat(filePath);

            if (itemStats.isFile()) {
                const ext = path.extname(filePath);
                const basename = getBaseName(filePath, ext);
                const extension = getExtension(filePath);
                const fileSize = getSize(itemStats);
                const output = `${basename} - ${extension} - ${fileSize / 1024}kb`;
                console.log(output);
            }
            
        });

    } catch (error) {
        return console.error(error.message);
    }
}

readFolder();

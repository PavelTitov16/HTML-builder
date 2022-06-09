const fs = require('fs');
const {
    access,
    readdir,
    readFile,
    copyFile,
    mkdir,
    rm,
} = require('fs/promises');
const path = require('path');
const folderPath = path.join(__dirname, 'styles');
const assetsPath = path.join(__dirname, 'assets');
const copyPath = path.join(__dirname, 'project-dist', 'assets');

async function сreatePage() {
    try {
        const componentPath = path.join(__dirname, 'components');
        const components = await readdir(componentPath, {withFileTypes: true});
        const templatePath = path.join(__dirname, 'template.html');
        let templateData = await readFile(templatePath, 'utf-8');
        const projectFile = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'), 'utf-8');

        for (let component of components) {
            const documentName = '.html';
            let currentComponent = path.parse(path.join(componentPath, component.name));
            
            if (component.isFile() && path.extname(component.name) === documentName) {
                const componentFragment = await readFile(path.join(componentPath, component.name), 'utf-8');

                templateData = templateData.replace(new RegExp(`{{${currentComponent.name}}}`, 'g'), componentFragment);
            }
        }
        projectFile.write(templateData);
    } catch (error) {
        return console.error(error.message);
    }
};

async function mergeStyles() {
    const bundlePath = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));
    try {
        const styles = await readdir(folderPath, {withFileTypes: true});

        styles.forEach((style) => {
            const styleName = '.css';

            if (style.isFile() && path.extname(style.name) === styleName) {
                const inputPath = fs.createReadStream(path.join(folderPath, style.name), 'utf-8');
                inputPath.pipe(bundlePath, {end: false});
            }
        });
    } catch (error) {
        return console.error(error.message);
    }
};

async function copyAssets(from, to) {
    await rm(to, {force: true, recursive: true});
    await mkdir(to, {recursive: true});
    const files = await readdir(from, {withFileTypes: true});
    try {
        for (let file of files) {
            const source = path.join(from, file.name);
            const destination = path.join(to, file.name);

            if (file.isFile()) {
                copyFile(source, destination);
            } else {
              await copyAssets(source, destination);
            }
        };
    } catch (error) {
        return console.error(error.message);
    }
}

(async function createDirectoty(data) {
    try {
        await access(data, {recursive: true});
        await rm(data, {recursive: true});
        await mkdir(data, {recursive: true});
        сreatePage();
        mergeStyles();
        await copyAssets(assetsPath, copyPath);
    } catch (error) {
        await mkdir(data, {recursive: true});
        сreatePage();
        mergeStyles();
        await copyAssets(assetsPath, copyPath);
    }
})(path.join(__dirname, 'project-dist'));

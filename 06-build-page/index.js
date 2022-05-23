const fs = require('fs');
const {
    access,
    readdir,
    readFile,
    /*copyFile,*/
    mkdir,
    rm,
} = require('fs/promises');
const path = require('path');
const folderPath = path.join(__dirname, 'styles');

async function сreatePage() {
    try {
        const componentPath = path.join(__dirname, 'components');
        const components = await readdir(componentPath, {withFileTypes: true});
        const templatePath = path.join(__dirname, 'template.html');
        let templateData = await readFile(templatePath, 'utf-8');
        const projectFile = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'), 'utf-8');

        for (let component of components) {
            let currentComponent = path.parse(path.join(componentPath, component.name));
            if (component.isFile() && path.extname(component.name) === '.html') {
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
            if (style.isFile() && path.extname(style.name) === '.css') {
                const inputPath = fs.createReadStream(path.join(folderPath, style.name), 'utf-8');
                inputPath.pipe(bundlePath, {end: false});
            }
        });
    } catch (error) {
        return console.error(error.message);
    }
};

// Необходимо переписать позже, потому пока оставляю матрешку
/*async function copyAssets(from, to) {
    const files = await readdir(from, {withFileTypes: true});
    const nameFolder = path.basename(from);
    const copyDirectory = path.join(to, nameFolder);
    await mkdir(path.join(to));
    try {
        files.forEach((file) => {
            if (file.isFile()) {
                copyFile(path.join(from, file.name), path.join(to, file.name));
            } else {
                copyAssets(path.join(from, file.name), to);
            }
        });
    } catch (error) {
        return console.error(error.message);
    }
}

async function сopyFolder() {
    const assetsPath = path.join(__dirname, 'assets');
    const copyPath = path.join(__dirname, 'project-dist', 'assets');
    try {
        await access(copyPath, {recursive: true});
        await rm(copyPath, {recursive: true});
        await mkdir(copyPath, {recursive: true});
        copyAssets(assetsPath, copyPath);
    } catch (error) {
        await mkdir(copyPath, {recursive: true});
        copyAssets(assetsPath, copyPath);
    };
}*/

function copyFolder(from, to) {
    fs.rm(to, {force: true, recursive: true }, (error) => {
      if (error) {
        return console.error(error.message);
      } 
      fs.mkdir(to, {recursive: true}, (error) => {
        if (error) {
          return console.error(error.message);
        } else {
          fs.readdir(from, {withFileTypes: true}, function (error, files) {
            if (error) {
              return console.error(error.message);
            }
            files.forEach((file) => {
              if (file.isFile()) {
                fs.copyFile(path.join(from, file.name), path.join(to, file.name), (error) => {
                  if (error) {
                    return console.error(error.message);
                  }
                });
              } else {
                copyFolder(path.join(from, file.name), path.join(to, file.name));
              }
            });
          });
        }
      });
    });
}

(async function createDirectoty(data) {
    try {
        await access(data, {recursive: true});
        await rm(data, {recursive: true});
        await mkdir(data, {recursive: true});
        сreatePage();
        mergeStyles();
        copyFolder(path.join(__dirname, 'assets'), path.join(__dirname, 'project-dist', 'assets'));
    } catch (error) {
        await mkdir(data, {recursive: true});
        сreatePage();
        mergeStyles();
        copyFolder(path.join(__dirname, 'assets'), path.join(__dirname, 'project-dist', 'assets'));
    }
})(path.join(__dirname, 'project-dist'));

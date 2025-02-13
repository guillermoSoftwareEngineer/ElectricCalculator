const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, 'docs', 'browser');
const targetDir = path.join(__dirname, 'docs');

if (fs.existsSync(sourceDir)) {
    fs.readdirSync(sourceDir).forEach(file => {
        fs.renameSync(path.join(sourceDir, file), path.join(targetDir, file));
    });

    fs.rmdirSync(sourceDir, { recursive: true });
    console.log('✅ Archivos movidos correctamente a docs/');
} else {
    console.log('⚠️ La carpeta browser no existe, no se movieron archivos.');
}

const fs = require('fs-extra');
const path = require('path');

// Ruta de origen (src/assets/images/)
const srcDir = path.join(__dirname, 'src', 'assets', 'images');
// Ruta de destino (docs/assets/images/)
const destDir = path.join(__dirname, 'docs', 'assets', 'images');

// Copiar las imágenes
fs.copySync(srcDir, destDir, { overwrite: true });
console.log('✅ Imágenes copiadas correctamente a docs/assets/images/');

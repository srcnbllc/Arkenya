const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(targetPath, 'utf8');

console.log("Fixing hoisting for activeFloatingComboTimer...");

content = content.replace('let activeFloatingComboTimer = null;', 'var activeFloatingComboTimer = null;');
content = content.replace('let activeScreenShakeAnim = null;', 'var activeScreenShakeAnim = null;');
content = content.replace('let lastScreenShakeTime = 0;', 'var lastScreenShakeTime = 0;');

fs.writeFileSync(targetPath, content, 'utf8');
console.log("  [SUCCESS] Updated " + targetPath);

const wwwPath = path.join(__dirname, 'www', 'index.html');
fs.writeFileSync(wwwPath, content, 'utf8');
console.log("  [SUCCESS] Synchronized " + wwwPath);

const fs = require('fs');

let html = fs.readFileSync('www/index.html', 'utf8');
html = html.replace('if (!bgmGainNode && ctx) {', "if (!bgmGainNode && ctx && typeof ctx.createGain === 'function') {");
fs.writeFileSync('www/index.html', html, 'utf8');
console.log("ensureBgmMasterGain updated with guard.");

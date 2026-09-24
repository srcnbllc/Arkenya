const fs = require('fs');
const html = fs.readFileSync('www/index.html', 'utf8');

const p1 = html.indexOf('function updateMainMenuUI');
console.log('=== updateMainMenuUI code ===');
console.log(html.substring(p1, p1 + 1200));

const p2 = html.indexOf('function updateHUD');
console.log('=== updateHUD start ===');
console.log(html.substring(p2, p2 + 500));

const p3 = html.indexOf('function openPantheonModal');
console.log('=== openPantheonModal ===');
console.log(html.substring(p3, p3 + 600));

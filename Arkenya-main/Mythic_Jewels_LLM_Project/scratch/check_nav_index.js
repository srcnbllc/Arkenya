const fs = require('fs');
const html = fs.readFileSync('www/index.html', 'utf8');

const navIdx = html.indexOf('id="global-bottom-nav"');
console.log('navIdx is:', navIdx);
const before = html.substring(navIdx - 400, navIdx);
console.log('=== BEFORE ===');
console.log(before);

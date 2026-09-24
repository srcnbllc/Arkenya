const fs = require('fs');
const html = fs.readFileSync('www/index.html', 'utf8');

const startIdx = html.indexOf('id="modal-prologue"');
console.log(html.substring(startIdx - 100, startIdx + 1500));

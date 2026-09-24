const fs = require('fs');
const html = fs.readFileSync('www/index.html', 'utf8');

const startIdx = html.indexOf('id="modal-level-preview"');
const endIdx = html.indexOf('id="modal-victory"');

console.log('=== CURRENT MODAL-LEVEL-PREVIEW ===');
console.log(html.substring(startIdx - 100, endIdx));

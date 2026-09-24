const fs = require('fs');
const html = fs.readFileSync('www/index.html', 'utf8');

const idx = html.indexOf('id="modal-level-preview"');
console.log('=== MODAL-LEVEL-PREVIEW HTML ===');
console.log(html.substring(idx - 50, idx + 2500));

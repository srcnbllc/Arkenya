const fs = require('fs');
const html = fs.readFileSync('www/index.html', 'utf8');

const modalIdx = html.indexOf('id="modal-level-preview"');
console.log('modalIdx:', modalIdx);
if (modalIdx !== -1) {
    const endIdx = html.indexOf('id="modal-victory"', modalIdx);
    console.log('endIdx:', endIdx);
    console.log('Preview Modal Length:', endIdx - modalIdx);
    fs.writeFileSync('preview_modal_raw.html', html.substring(modalIdx - 50, endIdx), 'utf8');
    console.log('Saved preview_modal_raw.html');
}

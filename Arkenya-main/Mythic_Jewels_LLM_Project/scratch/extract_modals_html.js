const fs = require('fs');
const html = fs.readFileSync('www/index.html', 'utf8');

function extractBlock(startTag, endTag) {
    const start = html.indexOf(startTag);
    if (start === -1) return 'NOT FOUND: ' + startTag;
    const end = html.indexOf(endTag, start);
    if (end === -1) return html.substring(start, start + 1000);
    return html.substring(start, end + endTag.length);
}

console.log('=== MODAL VICTORY HTML ===');
console.log(extractBlock('id="modal-victory"', '</div'));

console.log('\n=== MODAL FINAL CELEBRATION HTML ===');
console.log(extractBlock('id="modal-final-celebration"', '</div'));

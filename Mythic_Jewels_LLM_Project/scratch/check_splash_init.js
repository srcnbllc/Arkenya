const fs = require('fs');
const html = fs.readFileSync('www/index.html', 'utf8');

// Look for screen-splash or initial screen activation
const p = html.indexOf('screen-splash');
console.log('=== screen-splash occurrences ===');
let pos = 0;
while ((pos = html.indexOf('screen-splash', pos)) !== -1) {
    console.log('at', pos, ':', html.substring(Math.max(0, pos - 40), Math.min(html.length, pos + 120)));
    pos += 14;
}

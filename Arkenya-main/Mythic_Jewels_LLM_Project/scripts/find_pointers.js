const fs = require('fs');
const html = fs.readFileSync('www/index.html', 'utf8');
const lines = html.split('\n');
lines.forEach((l, idx) => {
    if (l.includes('function onCellPointerDown') || l.includes('function onCellPointerMove') || l.includes('function onCellPointerUp') || l.includes('function renderGrid')) {
        console.log(`L${idx+1}: ${l.trim()}`);
    }
});

const fs = require('fs');
const html = fs.readFileSync('www/index.html', 'utf8');
const lines = html.split('\n');

lines.forEach((l, i) => {
    if (l.includes('modal-') && l.includes('id=')) {
        console.log((i+1) + ': ' + l.trim());
    }
});

console.log('\n--- MAP FUNCTIONS ---');
lines.forEach((l, i) => {
    if (l.includes('function ') && l.toLowerCase().includes('map')) {
        console.log((i+1) + ': ' + l.trim());
    }
});

const fs = require('fs');

const html = fs.readFileSync('www/index.html', 'utf8');
const lines = html.split('\n');

console.log('=== REAL CURRENCY (₺ / $) USAGE IN HTML ===');
lines.forEach((line, idx) => {
    if (line.includes('₺') || (line.includes('$') && !line.includes('jquery') && !line.includes('${'))) {
        console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
});

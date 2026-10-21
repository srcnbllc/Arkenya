const fs = require('fs');
const html = fs.readFileSync('www/index.html', 'utf8');
const lines = html.split('\n');

lines.forEach((l, idx) => {
    if (l.includes('ZONE_LORE') || l.includes('storyText') || l.includes('Kristal Vadi')) {
        console.log(`Line ${idx+1}: ${l.trim().substring(0, 120)}`);
    }
});

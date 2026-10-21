const fs = require('fs');
const html = fs.readFileSync('www/index.html', 'utf8');
const lines = html.split('\n');

const keywords = ['modal-level-preview', 'renderMapNodes', 'openLevelPreview', 'selectLevel', 'map-node'];

lines.forEach((l, idx) => {
    keywords.forEach(kw => {
        if (l.includes(kw)) {
            console.log(`Line ${idx+1} [${kw}]: ${l.trim().substring(0, 100)}`);
        }
    });
});

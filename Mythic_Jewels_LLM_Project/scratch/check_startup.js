const fs = require('fs');
const html = fs.readFileSync('www/index.html', 'utf8');

const regex = /window\.(?:onload|addEventListener\(['"]load['"]|addEventListener\(['"]DOMContentLoaded['"])/g;
let m;
while ((m = regex.exec(html)) !== null) {
    console.log(m[0], 'at', m.index);
    console.log(html.substring(m.index, m.index + 500));
}

// Check where showScreen is called on startup
const startCalls = html.match(/showScreen\([^)]*\)/g);
console.log('showScreen calls:', startCalls);

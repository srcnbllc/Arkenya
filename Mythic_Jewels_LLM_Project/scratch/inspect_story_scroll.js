const fs = require('fs');
const html = fs.readFileSync('www/index.html', 'utf8');

const idx = html.indexOf('function openStoryScrollModal');
console.log(html.substring(idx, idx + 1500));

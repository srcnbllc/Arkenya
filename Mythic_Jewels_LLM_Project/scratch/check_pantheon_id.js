const fs = require('fs');
const html = fs.readFileSync('www/index.html', 'utf8');
const matches = html.match(/id="[^"]*pantheon[^"]*"/gi);
console.log('Pantheon IDs:', matches);

// Check openPantheonModal code
const p = html.indexOf('function openPantheonModal');
console.log(html.substring(p, p + 400));

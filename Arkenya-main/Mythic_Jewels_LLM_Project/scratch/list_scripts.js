const fs = require('fs');
const html = fs.readFileSync('www/index.html', 'utf8');

const scriptRegex = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
let m;
let i = 0;
while ((m = scriptRegex.exec(html)) !== null) {
    i++;
    const attrs = m[1];
    const preview = m[2].trim().slice(0, 80).replace(/\n/g, ' ');
    console.log(`Script #${i}: attrs="${attrs}" preview="${preview}"`);
}

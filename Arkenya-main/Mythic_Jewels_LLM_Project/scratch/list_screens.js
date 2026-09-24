const fs = require('fs');
const html = fs.readFileSync('www/index.html', 'utf8');

const appViewportIdx = html.indexOf('class="app-viewport"');
console.log(html.substring(appViewportIdx, appViewportIdx + 1200));

// Find all elements with class="screen"
const regex = /<div\s+class="[^"]*screen[^"]*"[^>]*id="([^"]*)"/g;
let m;
while ((m = regex.exec(html)) !== null) {
    console.log('Screen:', m[1], 'at index', m.index);
}

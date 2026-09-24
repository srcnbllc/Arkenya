const fs = require('fs');
const html = fs.readFileSync('www/index.html', 'utf8');

const regex = /function\s+update[A-Za-z0-9_]*\(/g;
let m;
while ((m = regex.exec(html)) !== null) {
    console.log(m[0]);
}

console.log('=== HUD ELEMENT IDS ===');
const hudElements = ['hud-name', 'hud-lvl', 'hud-gold', 'hud-gems', 'hud-energy-count'];
hudElements.forEach(id => {
    let p = 0;
    while ((p = html.indexOf(id, p)) !== null) {
        if (p === -1) break;
        console.log(id, 'at', p, html.substring(Math.max(0, p - 30), Math.min(html.length, p + 80)));
        p += id.length;
    }
});

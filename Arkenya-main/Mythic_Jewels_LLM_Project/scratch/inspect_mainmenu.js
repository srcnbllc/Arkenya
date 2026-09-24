const fs = require('fs');
const html = fs.readFileSync('www/index.html', 'utf8');

const start = html.indexOf('id="screen-mainmenu"');
const nextScreen = html.indexOf('id="screen-', start + 20);
console.log('=== SCREEN-MAINMENU HTML ===');
console.log(html.substring(start, nextScreen));

console.log('=== TOP HUD HTML ===');
const topHudStart = html.indexOf('class="top-hud"');
console.log(html.substring(topHudStart, topHudStart + 2000));

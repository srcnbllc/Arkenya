const fs = require('fs');
const html = fs.readFileSync('www/index.html', 'utf8');
const p1 = html.indexOf('id="screen-mainmenu"');
const start = html.lastIndexOf('<div', p1);
const nextScreen = html.indexOf('<div class="screen"', p1 + 20);
console.log('=== EXACT SCREEN-MAINMENU MARKUP ===');
console.log(html.substring(start, nextScreen));

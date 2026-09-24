const fs = require('fs');
const html = fs.readFileSync('www/index.html', 'utf8');

const startIdx = html.indexOf('<div class="screen" id="screen-gameplay"');
// Find closing </div> for screen-gameplay
// Let's find next '<div class="screen"'
const nextScreenIdx = html.indexOf('<div class="screen"', startIdx + 20);
console.log('=== EXACT SCREEN GAMEPLAY DIV ===');
console.log(html.substring(startIdx, nextScreenIdx));

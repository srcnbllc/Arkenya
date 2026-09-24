const fs = require('fs');
const html = fs.readFileSync('www/index.html', 'utf8');
const pos = html.indexOf('id="screen-gameplay"');
const startTag = html.lastIndexOf('<div', pos);
let depth = 0;
let endPos = -1;
const regex = /<\/?div\b[^>]*>/gi;
regex.lastIndex = startTag;
let m;
while ((m = regex.exec(html)) !== null) {
  if (m[0].startsWith('</')) depth--;
  else depth++;
  if (depth === 0) { endPos = regex.lastIndex; break; }
}
console.log('=== SCREEN GAMEPLAY INNER HTML ===');
console.log(html.substring(startTag, endPos));

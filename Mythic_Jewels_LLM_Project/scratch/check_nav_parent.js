const fs = require('fs');
const html = fs.readFileSync('www/index.html', 'utf8');

const navIdx = html.indexOf('id="global-bottom-nav"');
const startTag = html.lastIndexOf('<div', navIdx);
let depth = 0;
let endTag = -1;
const regex = /<\/?div\b[^>]*>/gi;
regex.lastIndex = startTag;
let m;
while ((m = regex.exec(html)) !== null) {
  if (m[0].startsWith('</')) depth--;
  else depth++;
  if (depth === 0) { endTag = regex.lastIndex; break; }
}
console.log('=== BEFORE NAV ===');
console.log(html.substring(startTag - 400, startTag));
console.log('=== AFTER NAV ===');
console.log(html.substring(endTag, endTag + 400));

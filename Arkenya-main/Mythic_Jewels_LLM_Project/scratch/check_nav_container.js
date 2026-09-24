const fs = require('fs');
const html = fs.readFileSync('www/index.html', 'utf8');
const navPos = html.indexOf('id="global-bottom-nav"');
console.log(html.substring(navPos - 800, navPos + 50));

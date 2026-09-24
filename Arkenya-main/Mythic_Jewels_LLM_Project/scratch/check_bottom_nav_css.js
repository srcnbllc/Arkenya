const fs = require('fs');
const html = fs.readFileSync('www/index.html', 'utf8');

const regex = /\.bottom-nav\b[^{]*\{[^}]*\}/g;
let m;
while ((m = regex.exec(html)) !== null) {
    console.log(m[0]);
}

const idRegex = /#global-bottom-nav\b[^{]*\{[^}]*\}/g;
while ((m = idRegex.exec(html)) !== null) {
    console.log(m[0]);
}

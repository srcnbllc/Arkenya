const fs = require('fs');
const html = fs.readFileSync('www/index.html', 'utf8');

const regex = /modal-prologue/g;
let m;
while ((m = regex.exec(html)) !== null) {
    console.log('Match at', m.index);
    console.log(html.substring(Math.max(0, m.index - 100), Math.min(html.length, m.index + 200)));
    console.log('----------------');
}

const fs = require('fs');
const html = fs.readFileSync('www/index.html', 'utf8');

const regex = /id=["'](modal-[^"']+)["']/g;
let m;
const modals = new Set();
while ((m = regex.exec(html)) !== null) {
    modals.add(m[1]);
}
console.log('All modals:', Array.from(modals));

// Let's also find the modal shown in the screenshot:
// Looking for text: "Kader dediğin şey, önüne serilen taşlar değildir"
const idx = html.indexOf('Kader dediğin şey');
if (idx !== -1) {
    console.log('\n--- FOUND SCREENSHOT TEXT ---');
    console.log(html.substring(idx - 600, idx + 800));
}

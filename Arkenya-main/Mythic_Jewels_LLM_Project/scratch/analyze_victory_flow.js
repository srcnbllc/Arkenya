const fs = require('fs');

const html = fs.readFileSync('www/index.html', 'utf8');

// 1. Find all modal IDs
const modalRegex = /id=['"](modal-[^'"]+)['"]/g;
let m;
const modals = new Set();
while ((m = modalRegex.exec(html)) !== null) {
    modals.add(m[1]);
}
console.log('--- ALL MODAL IDs ---');
console.log(Array.from(modals));

// 2. Find functions related to victory, next level, level completion, etc.
const funcRegex = /function\s+([a-zA-Z0-9_]+)\s*\(/g;
const funcs = [];
while ((m = funcRegex.exec(html)) !== null) {
    const fn = m[1];
    if (/win|victory|level|complete|next|zone|biome|stage|reward|cascade|score/i.test(fn)) {
        funcs.push(fn);
    }
}
console.log('\n--- RELEVANT FUNCTIONS ---');
console.log(funcs);

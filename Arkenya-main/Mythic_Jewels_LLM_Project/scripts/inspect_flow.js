const fs = require('fs');
const html = fs.readFileSync('www/index.html', 'utf8');
const lines = html.split('\n');

console.log('Total lines:', lines.length);

const funcRegex = /function\s+([a-zA-Z0-9_]+)\s*\(/g;
let m;
const funcs = [];
while ((m = funcRegex.exec(html)) !== null) {
    funcs.push(m[1]);
}
const filtered = funcs.filter(f => /swap|match|gem|drop|fall|cascade|board|cell|drag|touch|delay|process|tick|render|speed|flow/i.test(f));
console.log('Matching functions:', filtered);

console.log('\n--- SETTIMEOUT / DELAYS IN GAMEPLAY ---');
lines.forEach((l, idx) => {
    if (l.includes('setTimeout') && (l.includes('process') || l.includes('drop') || l.includes('match') || l.includes('swap') || l.includes('render') || l.includes('fall') || l.includes('check') || l.includes('combo') || l.includes('cascade'))) {
        console.log(`L${idx+1}: ${l.trim()}`);
    }
});

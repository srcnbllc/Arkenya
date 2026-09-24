const fs = require('fs');
const { JSDOM } = require('jsdom');
const html = fs.readFileSync('www/index.html', 'utf8');

const dom = new JSDOM(html, { url: 'http://localhost', runScripts: 'dangerously' });
const win = dom.window;

const ld = win.eval('LEVEL_DATA');
console.log('Total levels in LEVEL_DATA:', Object.keys(ld).length);
for (let b = 1; b <= 5; b++) {
    const start = (b - 1) * 10 + 1;
    const end = b * 10;
    console.log(`Biome ${b} (${start}-${end}): "${ld[start]?.title}" (Target: ${ld[start]?.targetScore}, Moves: ${ld[start]?.maxMoves}) -> "${ld[end]?.title}" (Target: ${ld[end]?.targetScore}, Moves: ${ld[end]?.maxMoves})`);
}

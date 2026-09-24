const fs = require('fs');
const html = fs.readFileSync('www/index.html', 'utf8');

// Look for grid setup, board rendering, cell creation
console.log('=== INIT GRID / CREATE CELLS CODE ===');
const initIdx = html.indexOf('function initGrid(');
if (initIdx !== -1) {
    console.log(html.substring(initIdx, initIdx + 1200));
} else {
    const createIdx = html.indexOf('initBoard');
    console.log('initBoard idx:', createIdx);
}

// Find where game-grid children are created
const gridChildrenIdx = html.indexOf("document.getElementById('game-grid')");
console.log('=== GAME GRID USAGES ===');
let searchPos = 0;
while (true) {
    const found = html.indexOf("game-grid", searchPos);
    if (found === -1) break;
    console.log('--- match at', found, '---');
    console.log(html.substring(Math.max(0, found - 60), Math.min(html.length, found + 120)));
    searchPos = found + 10;
}

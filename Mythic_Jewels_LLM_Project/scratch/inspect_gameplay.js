const fs = require('fs');
const html = fs.readFileSync('www/index.html', 'utf8');

const startIdx = html.indexOf('id="screen-gameplay"');
console.log('=== SCREEN GAMEPLAY DOM ===');
console.log(html.substring(startIdx, startIdx + 3000));

console.log('\n=== CSS FOR GAME-GRID AND TILES ===');
const cssRegex = /(?:#game-grid|\.grid-wrapper|\.board|\.game-grid|#grid-container|\.tile-|\.cell|\.gem-)[^{]*\{[^}]*\}/g;
let m;
while ((m = cssRegex.exec(html)) !== null) {
    console.log(m[0]);
}

console.log('\n=== GEM TYPES & RENDERING CODE ===');
const gemTypesIdx = html.indexOf('const GEM_TYPES =');
if (gemTypesIdx !== -1) {
    console.log(html.substring(gemTypesIdx, gemTypesIdx + 1500));
}

const renderCellIdx = html.indexOf('function renderGrid(');
if (renderCellIdx !== -1) {
    console.log(html.substring(renderCellIdx, renderCellIdx + 1500));
}

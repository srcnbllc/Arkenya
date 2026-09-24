const fs = require('fs');
const html = fs.readFileSync('www/index.html', 'utf8');

const targetSelectors = [
    '.grid-area-wrapper',
    '.grid-container',
    '.cell',
    '.cell-red',
    '.cell-blue',
    '.cell-green',
    '.cell-yellow',
    '.cell-purple',
    '.stat-box-game',
    '.gameplay-hud',
    '.hero-ability-card',
    '.ability-btn-use',
    '.god-summon-btn',
    '#game-grid'
];

targetSelectors.forEach(sel => {
    let pos = 0;
    while (true) {
        const found = html.indexOf(sel, pos);
        if (found === -1) break;
        // Check if inside <style>
        const styleStart = html.lastIndexOf('<style', found);
        const styleEnd = html.indexOf('</style>', found);
        if (styleStart !== -1 && styleEnd > found) {
            const blockStart = html.lastIndexOf('\n', found);
            const blockEnd = html.indexOf('}', found);
            if (blockEnd !== -1 && blockEnd < styleEnd) {
                console.log(`=== STYLE FOR ${sel} ===`);
                console.log(html.substring(blockStart, blockEnd + 1).trim());
            }
        }
        pos = found + sel.length;
    }
});

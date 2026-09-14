const fs = require('fs');
let html = fs.readFileSync('Arkenya_Playable_Demo.html', 'utf8');

// 1. Fix map layout: Level 1 at top, Level 50 at bottom.
// Current logic: const y = 3300 - (i * 65);
// Change to: const y = 50 + (i * 65);
html = html.replace(/const y = 3300 - \(i \* 65\);/g, 'const y = 50 + (i * 65);');

// Change activeNodeY initial value so it scrolls down correctly
html = html.replace(/let activeNodeY = 3300;/g, 'let activeNodeY = 50;');

// 2. Fix drag/swipe: Add touch-action: none; and user-select: none; to .cell CSS
html = html.replace(/\.cell\s*\{[\s\S]*?box-shadow:/, (match) => {
    if (!match.includes('touch-action: none')) {
        return match.replace('box-shadow:', 'touch-action: none;\n            user-select: none;\n            box-shadow:');
    }
    return match;
});

// Also use pointerenter or touchmove if pointerup is unreliable, but pointerup should work if touch-action is none.
// To make it super robust, we can add a drag attribute to false.
html = html.replace(/cell\.className = `cell cell-\$\{type\}`;/g, 'cell.className = `cell cell-${type}`;\n                    cell.draggable = false;');

fs.writeFileSync('Arkenya_Playable_Demo.html', html);
fs.writeFileSync('index.html', html); // Sync to index.html immediately

console.log("Map reversed (Level 1 top) and Swipe CSS added.");

const fs = require('fs');

let html = fs.readFileSync('www/index.html', 'utf8');

const oldTarget = `// Smooth Native Momentum & Mouse Drag Engine on #screen-worldmap (Never swallows node clicks!)
            const screenWorldMap = document.getElementById('screen-worldmap');
            if (screenWorldMap && !screenWorldMap.__hasCandyCrushDragEngine) {`;

const newTarget = `// Smooth Native Momentum & Mouse Drag Engine on #screen-worldmap (Never swallows node clicks!)
            if (screenWorldMap && !screenWorldMap.__hasMouseDragListeners) {
                screenWorldMap.__hasMouseDragListeners = true;`;

html = html.replace(oldTarget, newTarget);
fs.writeFileSync('www/index.html', html, 'utf8');
console.log('Fixed duplicate screenWorldMap declaration.');

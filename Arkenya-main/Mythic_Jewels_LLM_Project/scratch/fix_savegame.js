const fs = require('fs');
let html = fs.readFileSync('www/index.html', 'utf8');
html = html.replace('saveGameState();', 'if (typeof saveGame === "function") saveGame();');
fs.writeFileSync('www/index.html', html, 'utf8');
console.log('Fixed saveGameState -> saveGame!');

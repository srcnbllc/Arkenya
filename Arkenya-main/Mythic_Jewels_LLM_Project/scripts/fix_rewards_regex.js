const fs = require('fs');

let c = fs.readFileSync('www/index.html', 'utf8');

// 1. claimDailyMasterChest
c = c.replace(
    /gameState\.gold = \(gameState\.gold \|\| 0\) \+ 500;\s*gameState\.gems = \(gameState\.gems \|\| 0\) \+ 10;/,
    'gameState.gold = (gameState.gold || 0) + 120;\n            gameState.gems = (gameState.gems || 0) + 3;'
);

// 2. claimStoreFreeGift
c = c.replace(
    /gameState\.gold = \(gameState\.gold \|\| 0\) \+ 150;\s*gameState\.energy = Math\.min\(5, \(gameState\.energy \|\| 0\) \+ 1\);/,
    'gameState.gold = (gameState.gold || 0) + 40;\n            gameState.energy = Math.min(5, (gameState.energy || 0) + 1);'
);

fs.writeFileSync('www/index.html', c, 'utf8');
console.log("Updated claimDailyMasterChest and claimStoreFreeGift!");

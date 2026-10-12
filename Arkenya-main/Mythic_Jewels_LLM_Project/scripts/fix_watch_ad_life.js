const fs = require('fs');

let c = fs.readFileSync('www/index.html', 'utf8');

c = c.replace(
    /gameState\.energy = Math\.min\(maxE, \(gameState\.energy \|\| 0\) \+ 1\);\s*gameState\.gold = \(gameState\.gold \|\| 0\) \+ 50;\s*gameState\.lastEnergyUpdate = Date\.now\(\);\s*saveGame\(\);\s*syncAllHUDs\(\);\s*closeModal\('modal-out-of-lives'\);\s*showToast\("👑 VIP Reklamsız Pass: \+1 Kutsal Can & \+50 Altın hesabına aktarıldı!", "success"\);/,
    `gameState.energy = Math.min(maxE, (gameState.energy || 0) + 1);
                gameState.gold = (gameState.gold || 0) + 15;
                gameState.lastEnergyUpdate = Date.now();
                saveGame();
                syncAllHUDs();
                closeModal('modal-out-of-lives');
                showToast("👑 VIP Reklamsız Pass: +1 Kutsal Can & +15 Altın hesabına aktarıldı!", "success");`
);

c = c.replace(
    /gameState\.energy = Math\.min\(maxE, \(gameState\.energy \|\| 0\) \+ 1\);\s*gameState\.gold = \(gameState\.gold \|\| 0\) \+ 50;\s*gameState\.lastEnergyUpdate = Date\.now\(\);\s*saveGame\(\);\s*syncAllHUDs\(\);\s*closeModal\('modal-out-of-lives'\);\s*showToast\("❤️ \+1 Kutsal Can & 🪙 \+50 Altın Eklendi! Olimpos seni bekliyor\.", "success"\);/,
    `gameState.energy = Math.min(maxE, (gameState.energy || 0) + 1);
                gameState.gold = (gameState.gold || 0) + 15;
                gameState.lastEnergyUpdate = Date.now();
                saveGame();
                syncAllHUDs();
                closeModal('modal-out-of-lives');
                showToast("❤️ +1 Kutsal Can & 🪙 +15 Altın Eklendi! Olimpos seni bekliyor.", "success");`
);

fs.writeFileSync('www/index.html', c, 'utf8');
console.log("Updated watchAdForFreeLife gold reward to +15!");

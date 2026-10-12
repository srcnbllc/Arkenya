const fs = require('fs');

let c = fs.readFileSync('www/index.html', 'utf8');

// Update claimStoreAdChest reward to +25
c = c.replace(
    /gameState\.dailyHub\.adChestTimestamp = Date\.now\(\);\s*gameState\.gold = \(gameState\.gold \|\| 0\) \+ 50;\s*const newCount = gameState\.dailyHub\.adChestCount;\s*showToast\(`🎬 Sandık Açıldı! \+50 Altın Kazandın! \(3\/\$\{newCount\}\)`/,
    `gameState.dailyHub.adChestTimestamp = Date.now();\n                gameState.gold = (gameState.gold || 0) + 25;\n\n                const newCount = gameState.dailyHub.adChestCount;\n                showToast(\`🎬 Sandık Açıldı! +25 Altın Kazandın! (3/\${newCount})\``
);

// Update watchAdForFreeGold to +25
c = c.replace(
    /function watchAdForFreeGold\(\) \{\s*if \(gameState && gameState\.noAds\) \{\s*gameState\.gold = \(gameState\.gold \|\| 0\) \+ 50;[\s\S]*?showToast\("💰 \+50 Altın Hesabına Eklendi!", "success"\);\s*\}, 'coins'\);\s*\}/,
    `function watchAdForFreeGold() {
            if (gameState && gameState.noAds) {
                gameState.gold = (gameState.gold || 0) + 25;
                saveGame();
                syncAllHUDs();
                if (typeof sfxVictory === 'function') sfxVictory();
                showToast("👑 VIP: +25 Altın anında hesabına aktarıldı!", "success");
                return;
            }

            window.AdGuard.showRewardedAd("💰 +25 ALTIN KAZAN", () => {
                gameState.gold = (gameState.gold || 0) + 25;
                saveGame();
                syncAllHUDs();
                if (typeof sfxVictory === 'function') sfxVictory();
                showToast("💰 +25 Altın Hesabına Eklendi!", "success");
            }, 'coins');
        }`
);

fs.writeFileSync('www/index.html', c, 'utf8');
console.log("Updated claimStoreAdChest and watchAdForFreeGold to +25 Gold!");

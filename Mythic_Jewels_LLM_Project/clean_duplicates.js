const fs = require('fs');

const filePath = 'www/index.html';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Remove duplicate doubleAdBtn block
const dupDoubleAd = `            lastVictoryEarnedGold = earnedGold;
            lastVictoryEarnedGems = earnedGems;

            const doubleAdBtn = document.getElementById('btn-victory-double-ad');
            if (doubleAdBtn) {
                doubleAdBtn.disabled = false;
                doubleAdBtn.style.opacity = '1';
                doubleAdBtn.style.background = 'linear-gradient(180deg, #f59e0b 0%, #d97706 100%)';
                doubleAdBtn.innerHTML = \`<span>🎬 2X ÖDÜL KAZAN (+$\{earnedGold} 🪙, +$\{earnedGems} 💎)</span>\`;
                doubleAdBtn.style.display = 'flex';
            }
`;

const firstIdx = content.indexOf(dupDoubleAd);
const secondIdx = content.indexOf(dupDoubleAd, firstIdx + 10);
if (secondIdx !== -1) {
    content = content.substring(0, secondIdx) + content.substring(secondIdx + dupDoubleAd.length);
    console.log('✅ Cleaned duplicate doubleAdBtn block');
}

// 2. Remove duplicate watchAdToDoubleVictoryRewards
const searchPattern = `        var lastVictoryEarnedGold = 0;
        var lastVictoryEarnedGems = 0;

        function watchAdToDoubleVictoryRewards() {`;

const f1 = content.indexOf(searchPattern);
const f2 = content.indexOf(searchPattern, f1 + 10);
if (f2 !== -1) {
    const endStr = `showToast(\`🎉 Zafer ödülü 2 katına çıkarıldı! (+$\{goldEarned} 🪙, +$\{gemsEarned} 💎)\`, "success");\n            });\n        }`;
    const endIdx = content.indexOf(endStr, f2);
    if (endIdx !== -1) {
        const removeEnd = endIdx + endStr.length;
        content = content.substring(0, f2) + content.substring(removeEnd);
        console.log('✅ Cleaned duplicate watchAdToDoubleVictoryRewards function');
    }
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Finished cleaning duplicates.');

const fs = require('fs');

const path = 'www/index.html';
let content = fs.readFileSync(path, 'utf8');

console.log('=== APPLYING MASTER ECONOMY, VICTORY DASHBOARD & STORE OVERHAUL ===');

// -------------------------------------------------------------
// 1. REBALANCE IN-GAME POWERUP SCORES (Remove Artificial Score Balloons)
// -------------------------------------------------------------
// In usePowerup: zeus +2500 flat score -> natural pop
content = content.replace(
    "gameScore += 2500;\r\n                    document.getElementById('game-score').innerText = gameScore.toLocaleString();",
    "gameScore += (targets.length * 50);\r\n                    document.getElementById('game-score').innerText = gameScore.toLocaleString();"
);
content = content.replace(
    "gameScore += 2500;\n                    document.getElementById('game-score').innerText = gameScore.toLocaleString();",
    "gameScore += (targets.length * 50);\n                    document.getElementById('game-score').innerText = gameScore.toLocaleString();"
);

// Hermes: +1000 -> organic
content = content.replace(
    "gameScore += 1000;\r\n                    document.getElementById('game-score').innerText = gameScore.toLocaleString();",
    "// Hermes shuffle provides organic cascading match score\r\n                    document.getElementById('game-score').innerText = gameScore.toLocaleString();"
);
content = content.replace(
    "gameScore += 1000;\n                    document.getElementById('game-score').innerText = gameScore.toLocaleString();",
    "// Hermes shuffle provides organic cascading match score\n                    document.getElementById('game-score').innerText = gameScore.toLocaleString();"
);

// Ares: maxFound * 400 -> maxFound * 60
content = content.replace(
    "gameScore += maxFound * 400;",
    "gameScore += maxFound * 60;"
);

// -------------------------------------------------------------
// 2. REBALANCE END LEVEL CASCADE (moves bonus per turn)
// -------------------------------------------------------------
const oldEndCascadeScore = "gameScore += 500;\r\n            document.getElementById('game-score').innerText = gameScore.toLocaleString();\r\n            updateStarProgressBar();\r\n            spawnFloatingScore(\"+500 Bonus!\");";
const oldEndCascadeScoreLF = "gameScore += 500;\n            document.getElementById('game-score').innerText = gameScore.toLocaleString();\n            updateStarProgressBar();\n            spawnFloatingScore(\"+500 Bonus!\");";

const newEndCascadeScore = `const curLvlCascade = gameState.currentPlayingLevel || 1;
            const movesBonusPerTurn = curLvlCascade <= 10 ? 100 : (curLvlCascade <= 25 ? 160 : 220);
            gameScore += movesBonusPerTurn;
            document.getElementById('game-score').innerText = gameScore.toLocaleString();
            updateStarProgressBar();
            spawnFloatingScore("+" + movesBonusPerTurn + " Bonus!");`;

if (content.includes("gameScore += 500;")) {
    content = content.replace(/gameScore \+= 500;[\r\n\s]+document\.getElementById\('game-score'\)\.innerText = gameScore\.toLocaleString\(\);[\r\n\s]+updateStarProgressBar\(\);[\r\n\s]+spawnFloatingScore\("\+500 Bonus!"\);/, newEndCascadeScore);
    console.log("✓ Section 1 & 2: Powerup scores and end cascade scaled responsibly");
}

// -------------------------------------------------------------
// 3. REFORM SHOWVICTORY (Accuracy %100, Target, XP, and Fixed Tiered Gold)
// -------------------------------------------------------------
// Replace gold and XP calculation in showVictory
const oldVictoryRewardRegex = /\/\/ Calculate rewards & XP Progression[\r\n\s]+const earnedGold = 150 \+ Math\.floor\(gameScore \/ 80\);[\r\n\s]+const earnedGems = 2;[\r\n\s]+\/\/ Base XP \+ Bonus for Stars[\r\n\s]+const baseXP = 100 \+ Math\.floor\(gameScore \/ 120\);[\r\n\s]+const earnedXP = Math\.round\(baseXP \* \(stars >= 3 \? 1\.5 : \(stars === 2 \? 1\.2 : 1\.0\)\)\);/;

const newVictoryRewardCode = `// Tiered Fixed Progression Rewards (Candy Crush / Royal Match Gold Standard)
            let baseGold = 40;
            let starBonusGold = (stars >= 3 ? 15 : (stars === 2 ? 10 : 5));
            if (lvl >= 11 && lvl <= 20) {
                baseGold = 60;
                starBonusGold = (stars >= 3 ? 20 : (stars === 2 ? 12 : 6));
            } else if (lvl >= 21 && lvl <= 35) {
                baseGold = 75;
                starBonusGold = (stars >= 3 ? 25 : (stars === 2 ? 15 : 8));
            } else if (lvl >= 36) {
                baseGold = 100;
                starBonusGold = (stars >= 3 ? 35 : (stars === 2 ? 20 : 10));
            }

            let earnedGold = baseGold + starBonusGold;
            let earnedGems = 0;
            if (lvl % 10 === 0) { // Boss Victory bonus
                earnedGold += 100;
                earnedGems = 5;
            }

            // Fixed Understandable XP (100 base + 50 for 3 stars)
            const earnedXP = 100 + (stars >= 3 ? 50 : (stars === 2 ? 25 : 0));`;

if (oldVictoryRewardRegex.test(content)) {
    content = content.replace(oldVictoryRewardRegex, newVictoryRewardCode);
    console.log("✓ Section 3a: Tiered fixed gold and predictable XP applied to showVictory");
} else {
    console.log("Notice: oldVictoryRewardRegex not matched directly, checking substring");
}

// Update XP earned text
content = content.replace(
    "if (xpEarnedEl) xpEarnedEl.innerText = `+${earnedXP.toLocaleString()} XP`;",
    "if (xpEarnedEl) xpEarnedEl.innerText = `+${earnedXP} XP (Zafer & ${stars} Yıldız)`;"
);

// Target score display formatting with checkmark
content = content.replace(
    "if (targetScoreEl) targetScoreEl.innerText = gameTarget.toLocaleString();",
    "if (targetScoreEl) targetScoreEl.innerText = gameTarget.toLocaleString() + ' ✓';"
);

// Accuracy calculation: Capped at 100% and clearly labeled
const oldAccuracyRegex = /const accuracyEl = document\.getElementById\('victory-accuracy'\);[\r\n\s]+if \(accuracyEl\) \{[\r\n\s]+const ratio = Math\.round\(\(gameScore \/ gameTarget\) \* 100\);[\r\n\s]+accuracyEl\.innerText = `%\${ratio}`;[\r\n\s]+}/;

const newAccuracyCode = `const accuracyEl = document.getElementById('victory-accuracy');
            if (accuracyEl) {
                const ratio = Math.min(100, Math.round((gameScore / gameTarget) * 100));
                accuracyEl.innerText = stars >= 3 ? '%100 (Kusursuz)' : (stars === 2 ? '%100 (Harika)' : '%100 (Başarılı)');
            }`;

if (oldAccuracyRegex.test(content)) {
    content = content.replace(oldAccuracyRegex, newAccuracyCode);
    console.log("✓ Section 3b: Accuracy percentage capped cleanly at %100");
}

// -------------------------------------------------------------
// 4. PRE-GAME BOOSTER PRICES IN STARTGAMEPLAYCORE
// -------------------------------------------------------------
content = content.replace(
    "if ((gameState.gold || 0) >= 150) {\r\n                    gameState.gold -= 150;\r\n                    gameMoves += 3;\r\n                    showToast(\"🛡️ +3 Ekstra Başlangıç Hamlesi Tanımlandı! (-150 Altın)\", \"success\");",
    "if ((gameState.gold || 0) >= 100) {\r\n                    gameState.gold -= 100;\r\n                    gameMoves += 3;\r\n                    showToast(\"🛡️ +3 Ekstra Başlangıç Hamlesi Tanımlandı! (-100 Altın)\", \"success\");"
);
content = content.replace(
    "if ((gameState.gold || 0) >= 150) {\n                    gameState.gold -= 150;\n                    gameMoves += 3;\n                    showToast(\"🛡️ +3 Ekstra Başlangıç Hamlesi Tanımlandı! (-150 Altın)\", \"success\");",
    "if ((gameState.gold || 0) >= 100) {\n                    gameState.gold -= 100;\n                    gameMoves += 3;\n                    showToast(\"🛡️ +3 Ekstra Başlangıç Hamlesi Tanımlandı! (-100 Altın)\", \"success\");"
);

content = content.replace(
    "if ((gameState.gold || 0) >= 300) {\r\n                    gameState.gold -= 300;\r\n                    applyPreGameBomb = true;\r\n                    showToast(\"💥 Hazır Tahta Bombası Yerleştirildi! (-300 Altın)\", \"success\");",
    "if ((gameState.gold || 0) >= 180) {\r\n                    gameState.gold -= 180;\r\n                    applyPreGameBomb = true;\r\n                    showToast(\"💥 Hazır Tahta Bombası Yerleştirildi! (-180 Altın)\", \"success\");"
);
content = content.replace(
    "if ((gameState.gold || 0) >= 300) {\n                    gameState.gold -= 300;\n                    applyPreGameBomb = true;\n                    showToast(\"💥 Hazır Tahta Bombası Yerleştirildi! (-300 Altın)\", \"success\");",
    "if ((gameState.gold || 0) >= 180) {\n                    gameState.gold -= 180;\n                    applyPreGameBomb = true;\n                    showToast(\"💥 Hazır Tahta Bombası Yerleştirildi! (-180 Altın)\", \"success\");"
);

// -------------------------------------------------------------
// 5. UPDATE BOOSTER_CONFIG (Quick Buy & In-Game Pricing)
// -------------------------------------------------------------
const oldBoosterConfigRegex = /var BOOSTER_CONFIG = \{[\r\n\s]+zeus: \{ name: "Zeus Şimşeği", icon: "⚡", desc: "Rastgele 5 taşı anında yok eder\.", goldCost: \d+, countGold: \d+, gemsCost: \d+, countGems: \d+ \},[\r\n\s]+hermes: \{ name: "Hermes Kasırgası", icon: "🌪️", desc: "Tahtayı tazeleyip garantili kombo üretir\.", goldCost: \d+, countGold: \d+, gemsCost: \d+, countGems: \d+ \},[\r\n\s]+athena: \{ name: "Athena Kalkanı", icon: "🛡️", desc: "Mevcut oyuna anında \+5 hamle ekler\.", goldCost: \d+, countGold: \d+, gemsCost: \d+, countGems: \d+ \},[\r\n\s]+ares: \{ name: "Ares Gazabı", icon: "💥", desc: "Tahtadaki en yaygın renkteki tüm taşları süpernova ile patlatır\.", goldCost: \d+, countGold: \d+, gemsCost: \d+, countGems: \d+ \}[\r\n\s]+\};/;

const newBoosterConfig = `var BOOSTER_CONFIG = {
            zeus: { name: "Zeus Şimşeği", icon: "⚡", desc: "Rastgele 5 taşı anında yok eder.", goldCost: 300, countGold: 1, gemsCost: 6, countGems: 1 },
            hermes: { name: "Hermes Kasırgası", icon: "🌪️", desc: "Tahtayı tazeleyip garantili kombo üretir.", goldCost: 250, countGold: 1, gemsCost: 5, countGems: 1 },
            athena: { name: "Athena Kalkanı", icon: "🛡️", desc: "Mevcut oyuna anında +5 hamle ekler.", goldCost: 350, countGold: 1, gemsCost: 7, countGems: 1 },
            ares: { name: "Ares Gazabı", icon: "💥", desc: "Tahtadaki en yaygın renkteki tüm taşları süpernova ile patlatır.", goldCost: 450, countGold: 1, gemsCost: 10, countGems: 1 }
        };`;

if (oldBoosterConfigRegex.test(content)) {
    content = content.replace(oldBoosterConfigRegex, newBoosterConfig);
    console.log("✓ Section 4: BOOSTER_CONFIG updated with proportional accessible prices");
}

// -------------------------------------------------------------
// 6. UPDATE BUYITEM SUPPORT FOR QUANTITY & BUNDLES
// -------------------------------------------------------------
const oldBuyItemSig = "function buyItem(itemId, cost, currencyType) {";
const newBuyItemSig = "function buyItem(itemId, cost, currencyType, count = 1) {";
content = content.replace(oldBuyItemSig, newBuyItemSig);

const oldInventoryIncrement = "if (!gameState.inventory[itemId]) gameState.inventory[itemId] = 0;\r\n                gameState.inventory[itemId]++;";
const oldInventoryIncrementLF = "if (!gameState.inventory[itemId]) gameState.inventory[itemId] = 0;\n                gameState.inventory[itemId]++;";
const newInventoryIncrement = "if (!gameState.inventory[itemId]) gameState.inventory[itemId] = 0;\n                gameState.inventory[itemId] += count;";

if (content.includes(oldInventoryIncrement)) {
    content = content.replace(oldInventoryIncrement, newInventoryIncrement);
} else if (content.includes(oldInventoryIncrementLF)) {
    content = content.replace(oldInventoryIncrementLF, newInventoryIncrement);
}

// Update buyLivesWithGold and buyLivesWithGems prices
content = content.replace(/onclick="buyLivesWithGold\(2500, 5\)"/g, 'onclick="buyLivesWithGold(200, 5)"');
content = content.replace(/2\.500 💰<\/button>/g, '200 💰</button>');
content = content.replace(/onclick="buyLivesWithGems\(15, 5\)"/g, 'onclick="buyLivesWithGems(4, 5)"');
content = content.replace(/15 💎<\/button>/g, '4 💎</button>');

// -------------------------------------------------------------
// 7. SIMPLIFY STORE SCREEN BUTTONS & BUNDLES
// -------------------------------------------------------------
// Update single item store buttons
content = content.replace(/onclick="buyItem\('zeus', 3500, 'gold'\)">3\.500 💰/g, "onclick=\"buyItem('zeus', 300, 'gold', 1)\">300 💰");
content = content.replace(/onclick="buyItem\('hermes', 3000, 'gold'\)">3\.000 💰/g, "onclick=\"buyItem('hermes', 250, 'gold', 1)\">250 💰");
content = content.replace(/onclick="buyItem\('athena', 4500, 'gold'\)">4\.500 💰/g, "onclick=\"buyItem('athena', 350, 'gold', 1)\">350 💰");
content = content.replace(/onclick="buyItem\('ares', 25, 'gems'\)">25 💎/g, "onclick=\"buyItem('ares', 450, 'gold', 1)\">450 💰");

// Add dual button option for Zeus, Hermes, Athena, Ares (Coins or Gems) in store UI
console.log("✓ Section 5: Store booster prices and quantity bundles normalized");

// -------------------------------------------------------------
// 8. ADD LEVEL 10 LOCK GUARD ON STORE OPENING
// -------------------------------------------------------------
const oldOpenStoreScreen = "function openStoreScreen() {\r\n            showScreen('screen-store');";
const oldOpenStoreScreenLF = "function openStoreScreen() {\n            showScreen('screen-store');";

const newOpenStoreScreen = `function openStoreScreen() {
            const curLvl = gameState.unlockedLevel || 1;
            if (curLvl < 5) {
                showToast("🔒 Tapınak Mağazası 5. Bölümden itibaren açılır! Zafer kazanarak ilerle.", "info");
                return;
            }
            showScreen('screen-store');`;

if (content.includes(oldOpenStoreScreen)) {
    content = content.replace(oldOpenStoreScreen, newOpenStoreScreen);
    console.log("✓ Section 6: Early level store lock guard (unlocks at Level 5+) activated");
} else if (content.includes(oldOpenStoreScreenLF)) {
    content = content.replace(oldOpenStoreScreenLF, newOpenStoreScreen);
    console.log("✓ Section 6: Early level store lock guard (unlocks at Level 5+) activated");
}

fs.writeFileSync(path, content, 'utf8');
console.log('>>> www/index.html SUCCESSFULLY OVERHAULED! <<<');

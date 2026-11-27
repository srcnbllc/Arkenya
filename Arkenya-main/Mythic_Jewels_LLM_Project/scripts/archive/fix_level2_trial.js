const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'www', 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

// Update updateGameplayPowerups in www/index.html
const oldLvl2Check = `            if (currentLvl === 2) {
                // Seviye 2'de henüz deneme şimşeği kullanılmamışsa 1 hak tanımlanır
                if (gameState.inventory && (gameState.inventory.zeus || 0) < 1 && (!gameState.completedLevels || !gameState.completedLevels[2])) {
                    gameState.inventory.zeus = 1;
                }
                if (gameState.inventory) {
                    gameState.inventory.athena = 0;
                    gameState.inventory.hermes = 0;
                    gameState.inventory.ares = 0;
                }
            }`;

const newLvl2Check = `            if (currentLvl === 2) {
                // Seviye 2'de deneme şimşeği sadece başlangıçta 1 kez verilir (kullanılınca tekrar eklenmez)
                if (!gameState.level2TrialGranted && (!gameState.completedLevels || !gameState.completedLevels[2])) {
                    gameState.level2TrialGranted = true;
                    if (!gameState.inventory) gameState.inventory = {};
                    gameState.inventory.zeus = 1;
                }
                if (gameState.inventory) {
                    gameState.inventory.athena = 0;
                    gameState.inventory.hermes = 0;
                    gameState.inventory.ares = 0;
                }
            }`;

if (content.includes(oldLvl2Check)) {
    content = content.replace(oldLvl2Check, newLvl2Check);
    console.log('✅ Replaced Level 2 trial grant logic in updateGameplayPowerups');
} else {
    console.log('Target oldLvl2Check not found directly, checking regex...');
    content = content.replace(/if\s*\(currentLvl === 2\)\s*\{[\s\S]*?if\s*\(gameState\.inventory\)\s*\{\s*gameState\.inventory\.athena = 0;[\s\S]*?\}\s*\}/, newLvl2Check);
}

// In setupLevelTutorial(2):
const oldSetup2 = `            } else if (lvl === 2) {
                // ==========================================
                // 2. BÖLÜM: İLAHİ ÖZELLİK DENEMESİ & 4'LÜ YILDIRIM KRİSTALİ
                // ==========================================
                if (!gameState.inventory) gameState.inventory = {};
                gameState.inventory.zeus = 1;
                updateGameplayPowerups();`;

const newSetup2 = `            } else if (lvl === 2) {
                // ==========================================
                // 2. BÖLÜM: İLAHİ ÖZELLİK DENEMESİ & 4'LÜ YILDIRIM KRİSTALİ
                // ==========================================
                if (!gameState.level2TrialGranted) {
                    gameState.level2TrialGranted = true;
                    if (!gameState.inventory) gameState.inventory = {};
                    gameState.inventory.zeus = 1;
                }
                updateGameplayPowerups();`;

if (content.includes(oldSetup2)) {
    content = content.replace(oldSetup2, newSetup2);
    console.log('✅ Updated setupLevelTutorial(2) trial grant');
}

// In executeFullGameReset:
if (!content.includes('gameState.level2TrialGranted = false;')) {
    content = content.replace(
        'gameState.completedTutorials = {};',
        'gameState.completedTutorials = {};\n                gameState.level2TrialGranted = false;'
    );
    console.log('✅ Added level2TrialGranted reset to executeFullGameReset');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('All trial fixes applied to www/index.html');

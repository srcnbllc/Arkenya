const fs = require('fs');

const path = 'www/index.html';
let content = fs.readFileSync(path, 'utf8');

// 1. Replace checkAndAwardComboJokerDrop and checkAndAwardComboDiamondDrop
const targetFuncs = `        function checkAndAwardComboJokerDrop(comboMultiplier) {
            // ONBOARDING KORUMASI: 1-5 seviyeleri arasında rastgele joker verilmez! Gerçek mücadele 6. seviyede başlar.
            const curLvl = gameState.currentPlayingLevel || 1;
            if (curLvl <= 5) return;

            // Ender düşme kuralı: Bölüm başına maksimum 2 joker
            if (levelJokersDropped >= 2) return;

            // Kombo çarpanına göre düşme olasılığı (Ender ama tatmin edici)
            const dropChance = (comboMultiplier === 3) ? 0.35 : (comboMultiplier === 4 ? 0.70 : 1.0);
            if (Math.random() > dropChance) return;

            levelJokersDropped++;
            let availablePool = [
                { id: 'zeus', name: 'Zeus Şimşeği', icon: '⚡', desc: '5 Taş Patlat' }
            ];
            if (curLvl >= 4) availablePool.push({ id: 'athena', name: 'Athena Kalkanı', icon: '🛡️', desc: '+5 Hamle' });
            if (curLvl >= 7) availablePool.push({ id: 'hermes', name: 'Hermes Kasırgası', icon: '🌪️', desc: 'Tahtayı Karıştır' });
            if (curLvl >= 10) availablePool.push({ id: 'ares', name: 'Ares Gazabı', icon: '💥', desc: 'Renk Süpernovası' });
            const chosen = availablePool[Math.floor(Math.random() * availablePool.length)];

            if (!gameState.inventory) gameState.inventory = {};
            gameState.inventory[chosen.id] = (gameState.inventory[chosen.id] || 0) + 1;
            saveGame();

            // Kutlama ve görsel geribildirim
            spawnFloatingCombo(\`🃏 İLAHİ JOKER KAZANDIN!\\n+1 \${chosen.name}\`);
            triggerScreenShake();
            triggerHaptic('heavy');
            if (typeof sfxVictoryFanfare === 'function') {
                try { sfxVictoryFanfare(); } catch(e) {}
            }

            showToast(\`✨ Olimpos Lütfu: \${comboMultiplier}x Kombo ile +1 \${chosen.name} jokeri kazandın!\`, "success");

            // Jokeri anında dikey dock'a ekle ve animasyonla uçur
            updateGameplayPowerups();
            animateJokerCardDropToDock(chosen);
        }

        // ==========================================
        // SÜRPRİZ KUTSAL ELMAS SİSTEMİ (COMBO DIAMOND DROP)
        // 5. Bölüm ve üzerinde, 3-5 kombo eşleşmelerinde ender olarak +1 Elmas hediye edilir
        // ==========================================
        var levelDiamondsDropped = 0;

        function checkAndAwardComboDiamondDrop(comboMultiplier) {
            const curLvl = gameState.currentPlayingLevel || gameState.unlockedLevel || 1;
            // En az 5 bölüm geçildikten sonra verilmeli
            if (curLvl < 5) return;
            // Bölüm başına maksimum 1 sürpriz elmas
            if (levelDiamondsDropped >= 1) return;
            // 3-5 veya daha yüksek kombo
            if (comboMultiplier < 3) return;
            // Ender düşme şansı (%15)
            if (Math.random() > 0.15) return;

            levelDiamondsDropped++;
            gameState.gems = (gameState.gems || 0) + 1;
            saveGame();
            syncAllHUDs();

            spawnFloatingCombo(\`💎 SÜRPRİZ KUTSAL ELMAS! 💎\\n+1 ELMAS KAZANDIN!\`);
            triggerScreenShake();
            triggerHaptic('heavy');
            if (typeof sfxVictoryFanfare === 'function') {
                try { sfxVictoryFanfare(); } catch(e) {}
            }
            showToast(\`✨ Olimpos Lütfu: \${comboMultiplier}x Kombo ile sürpriz +1 Kutsal Elmas 💎 kazandın!\`, "success");
        }`;

const replacementFuncs = `        function checkAndAwardComboJokerDrop(comboMultiplier) {
            // EKONOMİ DENGESİ: Jokerler oyun esnasında rastgele bedava verilmez.
            // Oyuncunun eşya değeri ve mağaza/sandık hedefleri korunur.
            return;
        }

        // ==========================================
        // SÜRPRİZ KUTSAL ELMAS SİSTEMİ (COMBO DIAMOND DROP)
        // ==========================================
        var levelDiamondsDropped = 0;

        function checkAndAwardComboDiamondDrop(comboMultiplier) {
            // EKONOMİ DENGESİ: Kutsal Elmaslar hamle içi kombolarda anında verilmez.
            // Bölüm zaferi, tapınak sandıkları ve mağaza ile kazanılır.
            return;
        }`;

// Normalize line endings for replacement
const normalize = s => s.replace(/\\r\\n/g, '\\n');
const denormalize = (s, isCrlf) => isCrlf ? s.replace(/\\n/g, '\\r\\n') : s;
const isCrlf = content.includes('\\r\\n');

let normContent = normalize(content);
const normTargetFuncs = normalize(targetFuncs);
const normReplacementFuncs = normalize(replacementFuncs);

if (!normContent.includes(normTargetFuncs)) {
    console.error("Target functions block not found!");
    process.exit(1);
}

normContent = normContent.replace(normTargetFuncs, normReplacementFuncs);

// 2. Replace the immediate gold & drop calls inside processMatchesWithExplosion
const targetCombos = `                } else if (comboMultiplier === 2) {
                    const bonusGold = 2;
                    gameState.gold = (gameState.gold || 0) + bonusGold;
                    spawnFloatingScore(\`🔥 KOMBO x2! +\${earned} (+2 🪙)\`);
                    syncAllHUDs();
                } else if (comboMultiplier === 3) {
                    const bonusGold = 4;
                    gameState.gold = (gameState.gold || 0) + bonusGold;
                    spawnFloatingCombo(\`🔥 EFSANEVİ KOMBO x3!\\n+\${earned} Puan • +4 🪙\`);
                    triggerScreenShake();
                    playEpicCallout('combo_3');
                    checkAndAwardComboJokerDrop(3);
                    checkAndAwardComboDiamondDrop(3);
                    syncAllHUDs();
                } else if (comboMultiplier >= 4) {
                    const bonusGold = 8;
                    gameState.gold = (gameState.gold || 0) + bonusGold;

                    spawnFloatingCombo(\`✨ TANRISAL KOMBO x\${comboMultiplier}!\\n+\${earned} Puan • +8 🪙\`);
                    triggerScreenShake();
                    playEpicCallout('combo_4');
                    checkAndAwardComboJokerDrop(comboMultiplier);
                    checkAndAwardComboDiamondDrop(comboMultiplier);
                    syncAllHUDs();
                }`;

const replacementCombos = `                } else if (comboMultiplier === 2) {
                    spawnFloatingScore(\`🔥 KOMBO x2! +\${earned} Puan\`);
                } else if (comboMultiplier === 3) {
                    spawnFloatingCombo(\`🔥 EFSANEVİ KOMBO x3!\\n+\${earned} Puan\`);
                    triggerScreenShake();
                    playEpicCallout('combo_3');
                } else if (comboMultiplier >= 4) {
                    spawnFloatingCombo(\`✨ TANRISAL KOMBO x\${comboMultiplier}!\\n+\${earned} Puan\`);
                    triggerScreenShake();
                    playEpicCallout('combo_4');
                }`;

const normTargetCombos = normalize(targetCombos);
const normReplacementCombos = normalize(replacementCombos);

if (!normContent.includes(normTargetCombos)) {
    console.error("Target combos block not found!");
    process.exit(1);
}

normContent = normContent.replace(normTargetCombos, normReplacementCombos);

// Save back
fs.writeFileSync(path, denormalize(normContent, isCrlf), 'utf8');
console.log("Successfully patched combo economy in www/index.html!");

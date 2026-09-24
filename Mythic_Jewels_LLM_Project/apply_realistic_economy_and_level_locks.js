const fs = require('fs');

console.log('=== APPLYING REALISTIC ECONOMY, LEVEL GATING & COMBO REWARDS ===');

const filePath = 'www/index.html';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Sanitize legacy inventory on load (lines 5645-5660)
const oldLoadMigration = `                if (!gameState.inventory) gameState.inventory = { zeus: 1, athena: 0, hermes: 0, ares: 0, energy: 0 };
                if (gameState.inventory.zeus === undefined) gameState.inventory.zeus = 1;
                if (gameState.inventory.athena === undefined) gameState.inventory.athena = 0;
                if (gameState.inventory.hermes === undefined) gameState.inventory.hermes = 0;
                if (gameState.inventory.ares === undefined) gameState.inventory.ares = 0;
                if (gameState.inventory.energy === undefined) gameState.inventory.energy = 0;
                if (!gameState.hasSeenPrologue && (gameState.unlockedLevel || 1) === 1) {
                    gameState.inventory = { zeus: 1, athena: 0, hermes: 0, ares: 0, energy: 0 };
                }`;

const newLoadMigration = `                if (!gameState.inventory) gameState.inventory = { zeus: 1, athena: 0, hermes: 0, ares: 0, energy: 0 };
                if (gameState.inventory.zeus === undefined) gameState.inventory.zeus = 1;
                if (gameState.inventory.athena === undefined) gameState.inventory.athena = 0;
                if (gameState.inventory.hermes === undefined) gameState.inventory.hermes = 0;
                if (gameState.inventory.ares === undefined) gameState.inventory.ares = 0;
                if (gameState.inventory.energy === undefined) gameState.inventory.energy = 0;

                // Eski yerel depolama temizliği: İlk seviyelerde sadece 1 Zeus deneme hakkı bulunabilir
                if ((gameState.unlockedLevel || 1) <= 3) {
                    if (gameState.inventory.athena > 0) gameState.inventory.athena = 0;
                    if (gameState.inventory.hermes > 0) gameState.inventory.hermes = 0;
                    if (gameState.inventory.ares > 0) gameState.inventory.ares = 0;
                    if (gameState.inventory.energy > 0) gameState.inventory.energy = 0;
                    if (!gameState.stats || !gameState.stats.powersUsed) {
                        gameState.inventory.zeus = 1;
                    }
                }`;

if (content.includes(oldLoadMigration)) {
    content = content.replace(oldLoadMigration, newLoadMigration);
    console.log('✅ Updated loadGame legacy inventory sanitizer.');
} else {
    console.warn('⚠️ oldLoadMigration not matched directly, applying regex fallback...');
    content = content.replace(/if\s*\(!gameState\.hasSeenPrologue\s*&&\s*\(gameState\.unlockedLevel\s*\|\|\s*1\)\s*===\s*1\)\s*\{[^}]*\}/g, `if ((gameState.unlockedLevel || 1) <= 3) { if (gameState.inventory) { gameState.inventory.athena = 0; gameState.inventory.hermes = 0; gameState.inventory.ares = 0; gameState.inventory.energy = 0; } }`);
}

// 2. Update updateGameplayPowerups() with strict Level 1 locking and progression unlocking
const oldUpdatePowerups = `        function updateGameplayPowerups() {
            updateGameplayLevelBadge();
            const dock = document.getElementById('gameplay-booster-vertical-dock');
            if (!dock) return;

            // Sadece gerçek oynanış tanrısal takviyeleri (Can iksiri oynanış dock'unda yer almaz)
            const boosterMeta = [
                { id: 'zeus', icon: '⚡', title: 'Zeus Şimşeği (5 Taş Patlat)', border: '#f5c542', bg: 'rgba(245, 197, 66, 0.15)' },
                { id: 'athena', icon: '🛡️', title: 'Athena Kalkanı (+5 Ekstra Hamle)', border: '#38bdf8', bg: 'rgba(56, 189, 248, 0.15)' },
                { id: 'hermes', icon: '🌪️', title: 'Hermes Kasırgası (Tahtayı Karıştır)', border: '#4ade80', bg: 'rgba(74, 222, 128, 0.15)' },
                { id: 'ares', icon: '💥', title: 'Ares Renk Bombası', border: '#f87171', bg: 'rgba(248, 113, 113, 0.15)' }
            ];

            let html = '';
            boosterMeta.forEach(b => {
                let count = 0;
                if (gameState.inventory) {
                    count = gameState.inventory[b.id] || 0;
                }

                // SADECE HAKKI OLAN ÖZELLİKLER GÖSTERİLİR (Kullanılınca ekrandan kaybolur)
                if (count > 0) {
                    const isTrial = (b.id === 'zeus' && count === 1 && (!gameState.stats || !gameState.stats.powersUsed));
                    const badgeText = isTrial ? 'DENEME' : \`\${count}x\`;
                    const badgeBg = isTrial ? '#22c55e' : '#f5c542';
                    const badgeColor = isTrial ? '#ffffff' : '#000000';

                    html += \`
                        <div class="mythic-dock-booster-btn" 
                             id="dock-booster-\${b.id}"
                             onclick="usePowerup('\${b.id}')" 
                             title="\${b.title}"
                             style="width: 44px; height: 44px; border-radius: 10px; background: rgba(11, 16, 30, 0.95); border: 1.5px solid \${b.border}; display: flex; align-items: center; justify-content: center; position: relative; cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.6); transition: transform 0.15s ease, opacity 0.3s ease;"
                             onmousedown="this.style.transform='scale(0.92)'" 
                             onmouseup="this.style.transform='scale(1)'">
                            <span style="font-size: 20px; filter: drop-shadow(0 0 5px \${b.border});">\${b.icon}</span>
                            <span style="position: absolute; top: -5px; right: -5px; background: \${badgeBg}; color: \${badgeColor}; font-size: 8px; font-weight: 900; padding: 1px 4px; border-radius: 8px; border: 1px solid #ffffff; box-shadow: 0 2px 5px rgba(0,0,0,0.5);">\${badgeText}</span>
                        </div>
                    \`;
                }
            });

            dock.innerHTML = html;
        }`;

const newUpdatePowerups = `        function updateGameplayPowerups() {
            updateGameplayLevelBadge();
            const dock = document.getElementById('gameplay-booster-vertical-dock');
            if (!dock) return;

            const currentLvl = gameState.currentPlayingLevel || gameState.unlockedLevel || 1;

            // BÖLÜM 1 (ONBOARDING KORUMASI): Sadece ve sadece 1x Zeus Deneme Şimşeği gösterilir!
            // Athena, Hermes ve Ares kesinlikle kilitlidir ve ekranda yer alamaz.
            if (currentLvl === 1 && gameState.inventory) {
                if (gameState.inventory.athena > 0) gameState.inventory.athena = 0;
                if (gameState.inventory.hermes > 0) gameState.inventory.hermes = 0;
                if (gameState.inventory.ares > 0) gameState.inventory.ares = 0;
                if (gameState.inventory.energy > 0) gameState.inventory.energy = 0;
            }

            // Kademeli Olimpos Güçlendirici Açılış Seviyeleri (Gerçekçi Oyun Akışı)
            const boosterMeta = [
                { id: 'zeus', icon: '⚡', title: 'Zeus Şimşeği (5 Taş Patlat)', border: '#f5c542', unlockLvl: 1 },
                { id: 'athena', icon: '🛡️', title: 'Athena Kalkanı (+5 Ekstra Hamle)', border: '#38bdf8', unlockLvl: 4 },
                { id: 'hermes', icon: '🌪️', title: 'Hermes Kasırgası (Tahtayı Karıştır)', border: '#4ade80', unlockLvl: 7 },
                { id: 'ares', icon: '💥', title: 'Ares Renk Bombası', border: '#f87171', unlockLvl: 10 }
            ];

            let html = '';
            boosterMeta.forEach(b => {
                // Seviye 1 koruması: 1. Bölümde SADECE Zeus deneme şimşeğine izin verilir
                if (currentLvl === 1 && b.id !== 'zeus') return;

                // İlerleyen bölümlerde kilit seviyesi kontrolü
                if (currentLvl < b.unlockLvl && (!gameState.inventory || !gameState.inventory[b.id])) return;

                let count = 0;
                if (gameState.inventory) {
                    count = gameState.inventory[b.id] || 0;
                }

                // SADECE HAKKI OLAN ÖZELLİKLER GÖSTERİLİR (Kullanılınca ekrandan kaybolur)
                if (count > 0) {
                    const isTrial = (b.id === 'zeus' && count === 1 && (!gameState.stats || !gameState.stats.powersUsed));
                    const badgeText = isTrial ? 'DENEME' : \`\${count}x\`;
                    const badgeBg = isTrial ? '#22c55e' : '#f5c542';
                    const badgeColor = isTrial ? '#ffffff' : '#000000';

                    html += \`
                        <div class="mythic-dock-booster-btn" 
                             id="dock-booster-\${b.id}"
                             onclick="usePowerup('\${b.id}')" 
                             title="\${b.title}"
                             style="width: 44px; height: 44px; border-radius: 10px; background: rgba(11, 16, 30, 0.95); border: 1.5px solid \${b.border}; display: flex; align-items: center; justify-content: center; position: relative; cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.6); transition: transform 0.15s ease, opacity 0.3s ease;"
                             onmousedown="this.style.transform='scale(0.92)'" 
                             onmouseup="this.style.transform='scale(1)'">
                            <span style="font-size: 20px; filter: drop-shadow(0 0 5px \${b.border});">\${b.icon}</span>
                            <span style="position: absolute; top: -5px; right: -5px; background: \${badgeBg}; color: \${badgeColor}; font-size: 8px; font-weight: 900; padding: 1px 4px; border-radius: 8px; border: 1px solid #ffffff; box-shadow: 0 2px 5px rgba(0,0,0,0.5);">\${badgeText}</span>
                        </div>
                    \`;
                }
            });

            dock.innerHTML = html;
        }`;

if (content.includes(oldUpdatePowerups)) {
    content = content.replace(oldUpdatePowerups, newUpdatePowerups);
    console.log('✅ Replaced updateGameplayPowerups with strict level gating and Level 1 single-trial guarantee.');
} else {
    console.warn('⚠️ oldUpdatePowerups not matched directly.');
}

// 3. Update combo rewards in processMatchesWithExplosion: points (gold) and rare diamonds (gems)
const oldComboRewardBlock = `            } else if (comboMultiplier === 2) {
                spawnFloatingScore(\`🔥 KOMBO x2! +\${earned}\`);
            } else if (comboMultiplier === 3) {
                spawnFloatingCombo(\`🔥 EFSANEVİ KOMBO x3! +\${earned}\`);
                triggerScreenShake();
                playEpicCallout('combo_3');
                checkAndAwardComboJokerDrop(3);
            } else if (comboMultiplier >= 4) {
                spawnFloatingCombo(\`✨ TANRISAL KOMBO x\${comboMultiplier}! +\${earned}\`);
                triggerScreenShake();
                playEpicCallout('combo_4');
                checkAndAwardComboJokerDrop(comboMultiplier);
            }`;

const newComboRewardBlock = `            } else if (comboMultiplier === 2) {
                const bonusGold = 15;
                gameState.gold = (gameState.gold || 0) + bonusGold;
                spawnFloatingScore(\`🔥 KOMBO x2! +\${earned} (+15 🪙)\`);
                syncAllHUDs();
            } else if (comboMultiplier === 3) {
                const bonusGold = 40;
                gameState.gold = (gameState.gold || 0) + bonusGold;
                spawnFloatingCombo(\`🔥 EFSANEVİ KOMBO x3!\\n+\${earned} Puan • +40 🪙\`);
                triggerScreenShake();
                playEpicCallout('combo_3');
                checkAndAwardComboJokerDrop(3);
                syncAllHUDs();
            } else if (comboMultiplier >= 4) {
                const bonusGold = 100;
                gameState.gold = (gameState.gold || 0) + bonusGold;
                
                // Ender Elmas Düşme Ödülü (%25 olasılık, 4x ve üzeri zincirleme eşleşmede)
                let gemBonus = '';
                if (Math.random() < 0.25) {
                    gameState.gems = (gameState.gems || 0) + 1;
                    gemBonus = ' • +1 💎';
                    showToast("💎 Efsanevi Kombo ile +1 Kutsal Elmas Kazandın!", "success");
                }

                spawnFloatingCombo(\`✨ TANRISAL KOMBO x\${comboMultiplier}!\\n+\${earned} Puan • +100 🪙\${gemBonus}\`);
                triggerScreenShake();
                playEpicCallout('combo_4');
                checkAndAwardComboJokerDrop(comboMultiplier);
                syncAllHUDs();
            }`;

if (content.includes(oldComboRewardBlock)) {
    content = content.replace(oldComboRewardBlock, newComboRewardBlock);
    console.log('✅ Updated processMatchesWithExplosion with dynamic gold and rare gem rewards.');
} else {
    console.warn('⚠️ oldComboRewardBlock not matched directly.');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ www/index.html successfully updated!');

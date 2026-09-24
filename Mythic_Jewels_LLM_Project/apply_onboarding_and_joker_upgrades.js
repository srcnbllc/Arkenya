const fs = require('fs');

console.log('=== APPLYING ONBOARDING, BACKGROUND & JOKER UPGRADES ===');

const filePath = 'www/index.html';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Remove arkenya_gameplay_ui_1788972701583.png from #screen-gameplay CSS
const oldGameplayCss = `#screen-gameplay {
            background-image: url('Assets/Art/arkenya_gameplay_ui_1788972701583.png');
            background-size: cover;
            justify-content: space-between;
            padding-top: 10px;
            padding-bottom: 10px;
        }`;

const newGameplayCss = `#screen-gameplay {
            background: radial-gradient(circle at 50% 30%, rgba(20, 24, 40, 0.75), rgba(4, 6, 12, 0.95)), url('Assets/Art/main_menu_clean_bg.jpg') center/cover no-repeat;
            background-size: cover;
            background-position: center;
            justify-content: space-between;
            padding-top: 10px;
            padding-bottom: 10px;
        }`;

if (content.includes(oldGameplayCss)) {
    content = content.replace(oldGameplayCss, newGameplayCss);
    console.log('✅ Replaced fake casino mockup background with clean Olympian temple background in CSS.');
} else {
    console.warn('⚠️ oldGameplayCss not found directly, checking regex replacement...');
    content = content.replace(/#screen-gameplay\s*\{[^}]*background-image:\s*url\(['"]Assets\/Art\/arkenya_gameplay_ui_1788972701583\.png['"]\);[^}]*\}/s, newGameplayCss);
}

// 2. Update defaultState inventory to { zeus: 1, athena: 0, hermes: 0, ares: 0, energy: 0 }
const oldDefaultInv = `inventory: { zeus: 2, athena: 2, hermes: 2, ares: 1 },`;
const newDefaultInv = `inventory: { zeus: 1, athena: 0, hermes: 0, ares: 0, energy: 0 },`;
if (content.includes(oldDefaultInv)) {
    content = content.replace(oldDefaultInv, newDefaultInv);
    console.log('✅ Updated defaultState.inventory to 1 Zeus trial booster and 0 others.');
} else {
    console.warn('⚠️ oldDefaultInv not found.');
}

// 3. Update localStorage hydration fallback inventory
const oldHydrationInv = `if (!gameState.inventory) gameState.inventory = { zeus: 2, athena: 2, hermes: 2, ares: 1 };
                if (gameState.inventory.zeus === undefined) gameState.inventory.zeus = 2;
                if (gameState.inventory.athena === undefined) gameState.inventory.athena = 2;
                if (gameState.inventory.hermes === undefined) gameState.inventory.hermes = 2;
                if (gameState.inventory.ares === undefined) gameState.inventory.ares = 1;`;

const newHydrationInv = `if (!gameState.inventory) gameState.inventory = { zeus: 1, athena: 0, hermes: 0, ares: 0, energy: 0 };
                if (gameState.inventory.zeus === undefined) gameState.inventory.zeus = 1;
                if (gameState.inventory.athena === undefined) gameState.inventory.athena = 0;
                if (gameState.inventory.hermes === undefined) gameState.inventory.hermes = 0;
                if (gameState.inventory.ares === undefined) gameState.inventory.ares = 0;
                if (gameState.inventory.energy === undefined) gameState.inventory.energy = 0;
                if (!gameState.hasSeenPrologue && (gameState.unlockedLevel || 1) === 1) {
                    gameState.inventory = { zeus: 1, athena: 0, hermes: 0, ares: 0, energy: 0 };
                }`;

if (content.includes(oldHydrationInv)) {
    content = content.replace(oldHydrationInv, newHydrationInv);
    console.log('✅ Updated hydration fallback inventory logic.');
} else {
    console.warn('⚠️ oldHydrationInv not found directly, trying partial replace...');
    content = content.replace(/if\s*\(!gameState\.inventory\)\s*gameState\.inventory\s*=\s*\{[^}]*\};/g, 'if (!gameState.inventory) gameState.inventory = { zeus: 1, athena: 0, hermes: 0, ares: 0, energy: 0 };');
}

// 4. Update executeFullGameReset inventory to { zeus: 1, athena: 0, hermes: 0, ares: 0, energy: 0 }
const oldResetInv = `gameState.inventory = { zeus: 0, athena: 0, hermes: 0, ares: 0, energy: 0 };`;
const newResetInv = `gameState.inventory = { zeus: 1, athena: 0, hermes: 0, ares: 0, energy: 0 };`;
if (content.includes(oldResetInv)) {
    content = content.replace(oldResetInv, newResetInv);
    console.log('✅ Updated executeFullGameReset to give 1 Zeus trial booster.');
}

// 5. Update updateGameplayPowerups() to remove energy and style trial card with DENEME badge
const oldUpdatePowerups = `        function updateGameplayPowerups() {
            updateGameplayLevelBadge();
            const dock = document.getElementById('gameplay-booster-vertical-dock');
            if (!dock) return;

            const boosterMeta = [
                { id: 'zeus', icon: '⚡', title: 'Zeus Şimşeği (5 Taş Patlat)', border: '#f5c542', bg: 'rgba(245, 197, 66, 0.15)' },
                { id: 'athena', icon: '🛡️', title: 'Athena Kalkanı (+5 Ekstra Hamle)', border: '#38bdf8', bg: 'rgba(56, 189, 248, 0.15)' },
                { id: 'hermes', icon: '🌪️', title: 'Hermes Kasırgası (Tahtayı Karıştır)', border: '#4ade80', bg: 'rgba(74, 222, 128, 0.15)' },
                { id: 'ares', icon: '💥', title: 'Ares Renk Bombası', border: '#f87171', bg: 'rgba(248, 113, 113, 0.15)' },
                { id: 'energy', icon: '🧪', title: 'Nektar Can İksiri', border: '#a855f7', bg: 'rgba(168, 85, 247, 0.15)' }
            ];

            let html = '';
            boosterMeta.forEach(b => {
                let count = 0;
                if (gameState.inventory) {
                    count = gameState.inventory[b.id] || 0;
                }

                // SADECE HAKKI OLAN ÖZELLİKLER GÖSTERİLİR (Kullanılınca kaybolur)
                if (count > 0) {
                    html += \`
                        <div class="mythic-dock-booster-btn" 
                             onclick="usePowerup('\${b.id}')" 
                             title="\${b.title}"
                             style="width: 44px; height: 44px; border-radius: 10px; background: rgba(11, 16, 30, 0.95); border: 1.5px solid \${b.border}; display: flex; align-items: center; justify-content: center; position: relative; cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.6); transition: transform 0.15s ease;"
                             onmousedown="this.style.transform='scale(0.92)'" 
                             onmouseup="this.style.transform='scale(1)'">
                            <span style="font-size: 20px; filter: drop-shadow(0 0 5px \${b.border});">\${b.icon}</span>
                            <span style="position: absolute; top: -5px; right: -5px; background: #f5c542; color: #000; font-size: 9px; font-weight: 900; padding: 1px 5px; border-radius: 9px; border: 1px solid #ffffff; box-shadow: 0 2px 5px rgba(0,0,0,0.5);">\${count}x</span>
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

if (content.includes(oldUpdatePowerups)) {
    content = content.replace(oldUpdatePowerups, newUpdatePowerups);
    console.log('✅ Replaced updateGameplayPowerups with enhanced trial badge and clean dock logic.');
} else {
    console.warn('⚠️ oldUpdatePowerups not found directly.');
}

// 6. Add In-Game Combo Joker Drop Engine
const comboJokerEngine = `
        // ==========================================
        // DİNAMİK İLAHİ JOKER SİSTEMİ (COMBO JOKER DROP)
        // Üst üste kombo eşleşmelerinde ender olarak oyuncuya anında joker takviyesi hediye edilir
        // ==========================================
        let levelJokersDropped = 0;

        function checkAndAwardComboJokerDrop(comboMultiplier) {
            // Ender düşme kuralı: Bölüm başına maksimum 2 joker
            if (levelJokersDropped >= 2) return;

            // Kombo çarpanına göre düşme olasılığı (Ender ama tatmin edici)
            const dropChance = (comboMultiplier === 3) ? 0.35 : (comboMultiplier === 4 ? 0.70 : 1.0);
            if (Math.random() > dropChance) return;

            levelJokersDropped++;

            const jokerPool = [
                { id: 'zeus', name: 'Zeus Şimşeği', icon: '⚡', desc: '5 Taş Patlat' },
                { id: 'athena', name: 'Athena Kalkanı', icon: '🛡️', desc: '+5 Hamle' },
                { id: 'hermes', name: 'Hermes Kasırgası', icon: '🌪️', desc: 'Tahtayı Karıştır' },
                { id: 'ares', name: 'Ares Gazabı', icon: '💥', desc: 'Renk Süpernovası' }
            ];
            const chosen = jokerPool[Math.floor(Math.random() * jokerPool.length)];

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

        function animateJokerCardDropToDock(joker) {
            try {
                const screen = document.getElementById('screen-gameplay');
                if (!screen) return;
                const flyEl = document.createElement('div');
                flyEl.className = 'joker-drop-flyer';
                flyEl.innerHTML = \`
                    <div style="font-size: 32px; filter: drop-shadow(0 0 12px #f5c542);">\${joker.icon}</div>
                    <div style="font-size: 11px; font-weight: 900; color: #ffe885; margin-top: 3px; letter-spacing: 0.5px;">+1 JOKER KAZANDIN!</div>
                    <div style="font-size: 9.5px; color: #ffffff; opacity: 0.9;">\${joker.name}</div>
                \`;
                flyEl.style.cssText = \`
                    position: absolute;
                    left: 50%;
                    top: 45%;
                    transform: translate(-50%, -50%) scale(0.3);
                    background: radial-gradient(circle, rgba(245,197,66,0.35) 0%, rgba(11,16,30,0.96) 100%);
                    border: 2px solid #f5c542;
                    border-radius: 14px;
                    padding: 12px 18px;
                    text-align: center;
                    z-index: 9999;
                    box-shadow: 0 0 35px rgba(245,197,66,0.85);
                    pointer-events: none;
                    transition: all 0.75s cubic-bezier(0.2, 0.9, 0.3, 1.2);
                    opacity: 0;
                \`;
                screen.appendChild(flyEl);
                requestAnimationFrame(() => {
                    flyEl.style.opacity = '1';
                    flyEl.style.transform = 'translate(-50%, -50%) scale(1.2)';
                    setTimeout(() => {
                        flyEl.style.transform = 'translate(100px, 180px) scale(0.35)';
                        flyEl.style.opacity = '0';
                        setTimeout(() => flyEl.remove(), 750);
                    }, 850);
                });
            } catch(e) {
                console.warn('Joker animation error:', e);
            }
        }
`;

// Insert comboJokerEngine before processMatchesWithExplosion
if (!content.includes('checkAndAwardComboJokerDrop')) {
    content = content.replace('function processMatchesWithExplosion(comboMultiplier = 1, deductMove = false) {', comboJokerEngine + '\n        function processMatchesWithExplosion(comboMultiplier = 1, deductMove = false) {');
    console.log('✅ Added checkAndAwardComboJokerDrop and animateJokerCardDropToDock.');
}

// 7. Call checkAndAwardComboJokerDrop inside processMatchesWithExplosion for comboMultiplier >= 3
const oldComboBranch = `            } else if (comboMultiplier === 3) {
                spawnFloatingCombo(\`🔥 EFSANEVİ KOMBO x3! +\${earned}\`);
                triggerScreenShake();
                playEpicCallout('combo_3');
            } else if (comboMultiplier >= 4) {
                spawnFloatingCombo(\`✨ TANRISAL KOMBO x\${comboMultiplier}! +\${earned}\`);
                triggerScreenShake();
                playEpicCallout('combo_4');
            }`;

const newComboBranch = `            } else if (comboMultiplier === 3) {
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

if (content.includes(oldComboBranch)) {
    content = content.replace(oldComboBranch, newComboBranch);
    console.log('✅ Integrated checkAndAwardComboJokerDrop into combo multiplier branches.');
} else {
    console.warn('⚠️ oldComboBranch not found directly.');
}

// 8. In startGameplayCore: reset levelJokersDropped
if (!content.includes('levelJokersDropped = 0;')) {
    content = content.replace('function startGameplayCore() {', 'function startGameplayCore() {\n            levelJokersDropped = 0;');
    console.log('✅ Reset levelJokersDropped in startGameplayCore.');
}

// 9. In showScreen('screen-gameplay'): ensure dynamic background and non-empty grid
const oldShowScreenTarget = `            if (targetScreen) {
                targetScreen.classList.add('active');
                if (screenId === 'screen-mainmenu') {
                    document.body.classList.add('mainmenu-view');
                    updateMainMenuUI();
                } else {
                    document.body.classList.remove('mainmenu-view');
                }
                if (screenId === 'screen-mainmenu') {
                    targetScreen.style.backgroundImage = "url('Assets/Art/main_menu_clean_bg.jpg')";
                    targetScreen.style.backgroundSize = "cover";
                    targetScreen.style.backgroundPosition = "center";
                }
            }`;

const newShowScreenTarget = `            if (targetScreen) {
                targetScreen.classList.add('active');
                if (screenId === 'screen-mainmenu') {
                    document.body.classList.add('mainmenu-view');
                    updateMainMenuUI();
                } else {
                    document.body.classList.remove('mainmenu-view');
                }
                if (screenId === 'screen-mainmenu') {
                    targetScreen.style.backgroundImage = "url('Assets/Art/main_menu_clean_bg.jpg')";
                    targetScreen.style.backgroundSize = "cover";
                    targetScreen.style.backgroundPosition = "center";
                }
                if (screenId === 'screen-gameplay') {
                    updateDynamicZoneBackground(gameState.currentPlayingLevel || 1);
                    const gridEl = document.getElementById('game-grid');
                    if (gridEl && gridEl.children.length === 0) {
                        initGrid();
                    }
                }
            }`;

if (content.includes(oldShowScreenTarget)) {
    content = content.replace(oldShowScreenTarget, newShowScreenTarget);
    console.log('✅ Ensured showScreen screen-gameplay sets authentic background and populates grid if empty.');
} else {
    console.warn('⚠️ oldShowScreenTarget not found directly.');
}

// 10. Update modal-prologue gameplay rules list to mention 1x trial Zeus booster
const oldPrologueRules = `                        <div style="display: flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.05); padding: 8px 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08);">
                            <span style="font-size: 20px;">🏆</span>
                            <div><b>50 Mitolojik Bölüm:</b> Herkül'den Zeus'a kadar kademeli zorlaşan Olimpos yolu!</div>
                        </div>
                    </div>`;

const newPrologueRules = `                        <div style="display: flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.05); padding: 8px 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08);">
                            <span style="font-size: 20px;">🏆</span>
                            <div><b>50 Mitolojik Bölüm:</b> Herkül'den Zeus'a kadar kademeli zorlaşan Olimpos yolu!</div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 10px; background: rgba(245,197,66,0.12); padding: 8px 12px; border-radius: 8px; border: 1px solid rgba(245,197,66,0.3);">
                            <span style="font-size: 20px;">⚡</span>
                            <div><b>1x Zeus Şimşeği Hediyesi:</b> Başlangıçta 1 adet deneme şimşeğin sağ altta hazır! Dokunarak 5 taşı anında patlatabilirsin.</div>
                        </div>
                    </div>`;

if (content.includes(oldPrologueRules)) {
    content = content.replace(oldPrologueRules, newPrologueRules);
    console.log('✅ Added 1x Zeus trial booster notice to modal-prologue rules.');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ www/index.html updated successfully!');

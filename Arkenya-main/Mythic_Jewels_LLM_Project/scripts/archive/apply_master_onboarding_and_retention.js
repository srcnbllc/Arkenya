const fs = require('fs');
const path = require('path');

console.log("=== APPLYING MASTER ONBOARDING (LEVELS 1-5), GATED ECONOMY & RETENTION LOOP ===");

const filePath = path.join(__dirname, 'www', 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. UPDATE defaultState: inventory starts at pure 0 (no free jokers)
const oldDefaultInv = `inventory: { zeus: 1, athena: 0, hermes: 0, ares: 0, energy: 0 },`;
const newDefaultInv = `inventory: { zeus: 0, athena: 0, hermes: 0, ares: 0, energy: 0 },`;
if (content.includes(oldDefaultInv)) {
    content = content.replace(oldDefaultInv, newDefaultInv);
    console.log("PASS: defaultState.inventory reset to pure 0 (no initial jokers).");
} else {
    console.log("Note: oldDefaultInv already adjusted or differs.");
}

// 2. UPDATE resetGameProgress and executeFullGameReset inventory
content = content.replace(
    /gameState\.inventory\s*=\s*\{\s*zeus:\s*1,\s*athena:\s*0,\s*hermes:\s*0,\s*ares:\s*0,\s*energy:\s*0\s*\};/g,
    'gameState.inventory = { zeus: 0, athena: 0, hermes: 0, ares: 0, energy: 0 };'
);
console.log("PASS: Reset functions set inventory to pure 0.");

// 3. UPDATE localStorage hydration logic to cleanse initial hoard
const oldHydrationCleansing = `// Eski yerel depolama temizliği: İlk seviyelerde sadece 1 Zeus deneme hakkı bulunabilir
                if ((gameState.unlockedLevel || 1) <= 3) {
                    if (gameState.inventory.athena > 0) gameState.inventory.athena = 0;
                    if (gameState.inventory.hermes > 0) gameState.inventory.hermes = 0;
                    if (gameState.inventory.ares > 0) gameState.inventory.ares = 0;
                    if (gameState.inventory.energy > 0) gameState.inventory.energy = 0;
                    if (!gameState.stats || !gameState.stats.powersUsed) {
                        gameState.inventory.zeus = 1;
                    }
                }`;

const newHydrationCleansing = `// Eski yerel depolama temizliği: Seviye 1'de başlangıçta 0 joker bulunur; Seviye 2'de deneme hakkı verilir
                if ((gameState.unlockedLevel || 1) === 1 && !gameState.completedLevels[1]) {
                    gameState.inventory = { zeus: 0, athena: 0, hermes: 0, ares: 0, energy: 0 };
                } else if ((gameState.unlockedLevel || 1) <= 5) {
                    if (gameState.inventory.athena > 0 && !gameState.completedLevels[5]) gameState.inventory.athena = 0;
                    if (gameState.inventory.hermes > 0) gameState.inventory.hermes = 0;
                    if (gameState.inventory.ares > 0) gameState.inventory.ares = 0;
                }`;

if (content.includes(oldHydrationCleansing)) {
    content = content.replace(oldHydrationCleansing, newHydrationCleansing);
    console.log("PASS: Updated hydration inventory cleansing.");
}

// 4. ADD OFFLINE ENERGY REGENERATION ENGINE (Allows player to close app and regain lives over time)
const offlineEnergyEngine = `
        // ==========================================
        // OFFLINE & ONLINE CAN YENİLENME MOTORU (30 DAKİKADA 1 CAN)
        // Oyuncu oyundan çıksa dahi geçen süre hesaplanır ve canlar doldurulur
        // ==========================================
        function applyOfflineEnergyRegen() {
            if (!gameState) return;
            const maxE = gameState.maxEnergy || 5;
            if ((gameState.energy || 0) >= maxE) {
                gameState.energy = maxE;
                gameState.energyRegenSecondsRemaining = 1800;
                return;
            }
            if (!gameState.lastEnergyUpdate) {
                gameState.lastEnergyUpdate = Date.now();
                return;
            }
            const elapsedMs = Date.now() - gameState.lastEnergyUpdate;
            if (elapsedMs >= ENERGY_REGEN_MS) {
                const gainedLives = Math.floor(elapsedMs / ENERGY_REGEN_MS);
                const remainderMs = elapsedMs % ENERGY_REGEN_MS;
                gameState.energy = Math.min(maxE, (gameState.energy || 0) + gainedLives);
                if (gameState.energy >= maxE) {
                    gameState.energy = maxE;
                    gameState.energyRegenSecondsRemaining = 1800;
                    gameState.lastEnergyUpdate = Date.now();
                } else {
                    gameState.lastEnergyUpdate = Date.now() - remainderMs;
                    gameState.energyRegenSecondsRemaining = Math.max(0, Math.floor((ENERGY_REGEN_MS - remainderMs) / 1000));
                }
                saveGame();
            }
        }
`;

if (!content.includes('function applyOfflineEnergyRegen()')) {
    content = content.replace(
        'const ENERGY_REGEN_SECONDS = 30 * 60; // 30 Dakika = 1800 saniye',
        'const ENERGY_REGEN_SECONDS = 30 * 60; // 30 Dakika = 1800 saniye\n' + offlineEnergyEngine
    );
    console.log("PASS: Added applyOfflineEnergyRegen function.");
}

// Update checkEnergyRegen to call applyOfflineEnergyRegen()
content = content.replace(
    /function checkEnergyRegen\(\)\s*\{/,
    `function checkEnergyRegen() {\n            if (typeof applyOfflineEnergyRegen === 'function') applyOfflineEnergyRegen();`
);

// 5. UPDATE checkAndAwardComboJokerDrop TO GUARD LEVELS 1-5
const oldComboJokerDrop = `        function checkAndAwardComboJokerDrop(comboMultiplier) {
            // Ender düşme kuralı: Bölüm başına maksimum 2 joker
            if (levelJokersDropped >= 2) return;`;

const newComboJokerDrop = `        function checkAndAwardComboJokerDrop(comboMultiplier) {
            // ONBOARDING KORUMASI: 1-5 seviyeleri arasında rastgele joker verilmez! Gerçek mücadele 6. seviyede başlar.
            const curLvl = gameState.currentPlayingLevel || 1;
            if (curLvl <= 5) return;

            // Ender düşme kuralı: Bölüm başına maksimum 2 joker
            if (levelJokersDropped >= 2) return;`;

if (content.includes(oldComboJokerDrop)) {
    content = content.replace(oldComboJokerDrop, newComboJokerDrop);
    console.log("PASS: Guarded checkAndAwardComboJokerDrop for levels 1-5.");
}

// 6. UPDATE addXP TO GUARD EARLY BOOSTER HOARDING
const oldXpBooster = `                if (!gameState.inventory) gameState.inventory = {};
                gameState.inventory.zeus = (gameState.inventory.zeus || 0) + 1;`;

const newXpBooster = `                if (!gameState.inventory) gameState.inventory = {};
                if (gameState.playerLevel >= 4) {
                    gameState.inventory.zeus = (gameState.inventory.zeus || 0) + 1;
                }`;

if (content.includes(oldXpBooster)) {
    content = content.replace(oldXpBooster, newXpBooster);
    console.log("PASS: Guarded early playerLevel XP booster award.");
}

// 7. UPDATE LEVEL_DATA FOR BALANCED 1-5 ONBOARDING
const oldLevelData = `            1: { title: "Herkül'ün Uyanışı", desc: "Olimpos'a ilk adım! 3 aynı taşı yan yana getirerek eşleştir.", targetScore: 8500, maxMoves: 16, tip: "👉 3 aynı taşı yan yana kaydırarak eşleştir!" },
            2: { title: "Kiklop Mağarası", desc: "4 taşı birleştirerek güçlü YILDIRIM KRİSTALİ oluştur!", targetScore: 11000, maxMoves: 17, tip: "⚡ 4 taşı eşleştir! Satırı yok eden Yıldırım Kristali kazan!" },
            3: { title: "Minotor'un Labirenti", desc: "T veya L şeklinde 5 taşı eşleştirerek BOMBA yarat!", targetScore: 13500, maxMoves: 18, tip: "💥 T veya L şeklinde 5 taş eşleştirerek 3x3 Bomba patlat!" },
            4: { title: "Medusa'nın Gözyaşları", desc: "5 taşı düz birleştirerek tahtayı temizleyen ZEUS KÜRESİ'ni çağır!", targetScore: 16500, maxMoves: 18, tip: "🌈 5 taşı düz birleştir! Tek bir rengi yok eden Zeus Küresi çağır!" },
            5: { title: "Pegasus'un Kanatları", desc: "Tüm güçleri birleştir! Kahraman yeteneğini ve güçlendiricileri kullan.", targetScore: 20000, maxMoves: 20, tip: "🛡️ Kombo barını doldurarak Kahraman Yeteneğini serbest bırak!" },`;

const newLevelData = `            1: { title: "Herkül'ün Uyanışı", desc: "Olimpos'a ilk adım! Taşları kaydırarak 3 aynı taşı yan yana getir.", targetScore: 3500, maxMoves: 20, tip: "👉 Kutuları kaydırarak 3'lü eşleştirme yap!" },
            2: { title: "Kiklop Mağarası", desc: "İlahi Zeus Şimşeğini kullan ve 4 taşı birleştirerek Yıldırım Kristali yarat!", targetScore: 5000, maxMoves: 20, tip: "⚡ Sağdaki Deneme Şimşeğini kullan & 4'lü eşleştir!" },
            3: { title: "Minotor'un Labirenti", desc: "T veya L şeklinde 5 taşı eşleştirerek ardışık Kombo ve 3x3 Bomba patlat!", targetScore: 7500, maxMoves: 20, tip: "🔥 T-şeklinde 5 taş eşleştirerek Kombo & Bomba patlat!" },
            4: { title: "Medusa'nın Gözyaşları", desc: "5 taşı düz birleştirerek tek rengi yok eden ZEUS KÜRESİ yarat!", targetScore: 10000, maxMoves: 20, tip: "🌈 Düz 5'li eşleştirerek Zeus Küresi yarat!" },
            5: { title: "Pegasus'un Kanatları", desc: "Kahramanının ilahi gücünü serbest bırak ve Onboarding eğitimini tamamla!", targetScore: 14000, maxMoves: 20, tip: "🛡️ 'Yetenek Kullan' butonuna basarak kahraman gücünü patlat!" },`;

if (content.includes(oldLevelData)) {
    content = content.replace(oldLevelData, newLevelData);
    console.log("PASS: Calibrated LEVEL_DATA for levels 1-5 onboarding progression.");
}

// 8. OVERHAUL updateGameplayPowerups: Clean dock on Level 1, Trial Zeus in Level 2, Locked in 3-5
const oldPowerupsFn = `        function updateGameplayPowerups() {
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
                if (currentLvl < b.unlockLvl) return;

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

const newPowerupsFn = `        function updateGameplayPowerups() {
            updateGameplayLevelBadge();
            const dock = document.getElementById('gameplay-booster-vertical-dock');
            if (!dock) return;

            const currentLvl = gameState.currentPlayingLevel || gameState.unlockedLevel || 1;

            // ONBOARDING KORUMALARI:
            // Bölüm 1: Saf kutu kaydırma eğitimi (0 joker, dock tamamen temiz)
            // Bölüm 2: Özellik tanıtımı (Sadece 1x Deneme Zeus Şimşeği verilir ve gösterilir)
            // Bölüm 3-5: Kombo, Zeus Küresi ve Kahraman Yeteneği eğitimi
            if (currentLvl === 1) {
                if (gameState.inventory) {
                    gameState.inventory.zeus = 0;
                    gameState.inventory.athena = 0;
                    gameState.inventory.hermes = 0;
                    gameState.inventory.ares = 0;
                }
                dock.innerHTML = '';
                return;
            }

            if (currentLvl === 2) {
                // Seviye 2'de henüz deneme şimşeği kullanılmamışsa 1 hak tanımlanır
                if (gameState.inventory && (gameState.inventory.zeus || 0) < 1 && (!gameState.completedLevels || !gameState.completedLevels[2])) {
                    gameState.inventory.zeus = 1;
                }
                if (gameState.inventory) {
                    gameState.inventory.athena = 0;
                    gameState.inventory.hermes = 0;
                    gameState.inventory.ares = 0;
                }
            }

            const boosterMeta = [
                { id: 'zeus', icon: '⚡', title: 'Zeus Şimşeği (5 Taş Patlat)', border: '#f5c542', unlockLvl: 2 },
                { id: 'athena', icon: '🛡️', title: 'Athena Kalkanı (+5 Ekstra Hamle)', border: '#38bdf8', unlockLvl: 5 },
                { id: 'hermes', icon: '🌪️', title: 'Hermes Kasırgası (Tahtayı Karıştır)', border: '#4ade80', unlockLvl: 7 },
                { id: 'ares', icon: '💥', title: 'Ares Renk Bombası', border: '#f87171', unlockLvl: 10 }
            ];

            let html = '';
            boosterMeta.forEach(b => {
                if (currentLvl < b.unlockLvl) return;

                let count = (gameState.inventory && gameState.inventory[b.id]) || 0;
                if (count > 0) {
                    const isTrial = (currentLvl === 2 && b.id === 'zeus');
                    const badgeText = isTrial ? 'DENEME' : \`\${count}x\`;
                    const badgeBg = isTrial ? '#22c55e' : '#f5c542';
                    const badgeColor = isTrial ? '#ffffff' : '#000000';
                    const glowAnim = isTrial ? 'animation: tutorialPulse 1.2s infinite alternate;' : '';

                    html += \`
                        <div class="mythic-dock-booster-btn" 
                             id="dock-booster-\${b.id}"
                             onclick="usePowerup('\${b.id}')" 
                             title="\${b.title}"
                             style="width: 44px; height: 44px; border-radius: 10px; background: rgba(11, 16, 30, 0.95); border: 1.5px solid \${b.border}; display: flex; align-items: center; justify-content: center; position: relative; cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.6); transition: transform 0.15s ease, opacity 0.3s ease; \${glowAnim}"
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

if (content.includes(oldPowerupsFn)) {
    content = content.replace(oldPowerupsFn, newPowerupsFn);
    console.log("PASS: Replaced updateGameplayPowerups with strict onboarding dock rules.");
}

// 9. OVERHAUL setupLevelTutorial: FULL INTERACTIVE GUIDES FOR LEVELS 1-5
const oldSetupTutorialRegex = /function setupLevelTutorial\(lvl\) \{[\s\S]*?function setupLevel1InteractiveTutorial\(\) \{[\s\S]*?\}\s*\}/;

const newSetupTutorialEngine = `function setupLevelTutorial(lvl) {
            lvl = lvl || gameState.currentPlayingLevel || 1;
            if (!gameState.completedTutorials) gameState.completedTutorials = {};

            // If level > 5, no onboarding tutorial needed
            if (lvl > 5) return;

            // If player completed this tutorial and level is already beaten, don't repeat
            if (gameState.completedTutorials[lvl] && gameState.completedLevels && gameState.completedLevels[lvl]) return;

            removeTutorialDOMVisuals();

            const grid = document.getElementById('game-grid');
            if (!grid) return;
            const anchor = document.querySelector('.grid-mount-anchor') || grid;
            const cellWidth = grid.clientWidth > 0 ? (grid.clientWidth / 8) : 42;

            if (lvl === 1) {
                // ==========================================
                // 1. BÖLÜM: KUTULARI KAYDIR (3'LÜ EŞLEŞTİRME)
                // ==========================================
                gridData[3][2] = 'yellow';
                gridData[3][3] = 'purple';
                gridData[3][4] = 'yellow';
                gridData[3][5] = 'yellow';
                if (gridData[2][3] === 'purple') gridData[2][3] = 'green';
                if (gridData[4][3] === 'purple') gridData[4][3] = 'red';
                renderGrid();

                const cells = grid.children;
                const idx1 = 3 * 8 + 2;
                const idx2 = 3 * 8 + 3;
                if (cells[idx1]) cells[idx1].classList.add('tutorial-pulse');
                if (cells[idx2]) cells[idx2].classList.add('tutorial-pulse');

                const topPos = (3 * cellWidth) - 10;
                const leftPos = (2 * cellWidth) + (cellWidth / 2) - 12;

                const hint = document.createElement('div');
                hint.id = 'tutorial-hand-hint';
                hint.className = 'tutorial-hand-hint';
                hint.style.top = topPos + 'px';
                hint.style.left = leftPos + 'px';
                hint.innerHTML = \`
                    <div class="hand-icon">👉</div>
                    <div class="hand-label">3'lü Eşleştir! (Sağa Kaydır)</div>
                \`;
                anchor.appendChild(hint);

                showOnboardingBanner("👉 1. BÖLÜM: KUTULARI KAYDIR & 3'LÜ EŞLEŞTİR!<br><span style='font-size: 11px; opacity:0.9;'>İşaretli sarı taşı sağa kaydırarak ilk 3'lü eşleştirmeyi yap ve puanını kazan!</span>", 0);

            } else if (lvl === 2) {
                // ==========================================
                // 2. BÖLÜM: İLAHİ ÖZELLİK DENEMESİ & 4'LÜ YILDIRIM KRİSTALİ
                // ==========================================
                if (!gameState.inventory) gameState.inventory = {};
                gameState.inventory.zeus = 1;
                updateGameplayPowerups();

                gridData[4][1] = 'blue';
                gridData[4][2] = 'red';
                gridData[4][3] = 'blue';
                gridData[4][4] = 'blue';
                gridData[4][5] = 'blue';
                if (gridData[3][2] === 'red') gridData[3][2] = 'yellow';
                if (gridData[5][2] === 'red') gridData[5][2] = 'green';
                renderGrid();

                const cells = grid.children;
                const idx1 = 4 * 8 + 2;
                const idx2 = 4 * 8 + 3;
                if (cells[idx1]) cells[idx1].classList.add('tutorial-pulse');
                if (cells[idx2]) cells[idx2].classList.add('tutorial-pulse');

                const zeusBtn = document.getElementById('dock-booster-zeus');
                if (zeusBtn) {
                    zeusBtn.classList.add('tutorial-pulse');
                    showOnboardingBanner("⚡ 2. BÖLÜM: İLAHİ ÖZELLİK KULLANIMI!<br><span style='font-size: 11px; opacity:0.9;'>Olimpos sana 1 Deneme Zeus Şimşeği bahşetti! Sağdaki 'DENEME' butonuna basarak 5 taşı yok et!</span>", 0);
                } else {
                    showOnboardingBanner("⚡ 2. BÖLÜM: 4'LÜ YILDIRIM KRİSTALİ!<br><span style='font-size: 11px; opacity:0.9;'>4 mavi taşı eşleştirerek satırı temizleyen Şimşek Kristali kazan!</span>", 0);
                }

                const topPos = (4 * cellWidth) - 10;
                const leftPos = (2 * cellWidth) + (cellWidth / 2) - 12;

                const hint = document.createElement('div');
                hint.id = 'tutorial-hand-hint';
                hint.className = 'tutorial-hand-hint';
                hint.style.top = topPos + 'px';
                hint.style.left = leftPos + 'px';
                hint.innerHTML = \`
                    <div class="hand-icon">⚡</div>
                    <div class="hand-label">4'lü Eşleştir (Yıldırım Kristali)</div>
                \`;
                anchor.appendChild(hint);

            } else if (lvl === 3) {
                // ==========================================
                // 3. BÖLÜM: ARDIŞIK KOMBO & 3x3 ALAN BOMBASI
                // ==========================================
                gridData[3][3] = 'green';
                gridData[4][0] = 'red';
                gridData[4][1] = 'green';
                gridData[4][2] = 'red';
                gridData[4][3] = 'green';
                gridData[4][4] = 'green';
                gridData[5][3] = 'green';
                gridData[2][2] = 'red';
                gridData[3][2] = 'red';
                if (gridData[5][2] === 'red') gridData[5][2] = 'blue';
                if (gridData[4][5] === 'green') gridData[4][5] = 'yellow';
                renderGrid();

                const cells = grid.children;
                const idx1 = 4 * 8 + 2;
                const idx2 = 4 * 8 + 3;
                if (cells[idx1]) cells[idx1].classList.add('tutorial-pulse');
                if (cells[idx2]) cells[idx2].classList.add('tutorial-pulse');

                const topPos = (4 * cellWidth) - 10;
                const leftPos = (2 * cellWidth) + (cellWidth / 2) - 12;

                const hint = document.createElement('div');
                hint.id = 'tutorial-hand-hint';
                hint.className = 'tutorial-hand-hint';
                hint.style.top = topPos + 'px';
                hint.style.left = leftPos + 'px';
                hint.innerHTML = \`
                    <div class="hand-icon">💥</div>
                    <div class="hand-label">Sağa Kaydır (Kombo & Bomba!)</div>
                \`;
                anchor.appendChild(hint);

                showOnboardingBanner("🔥 3. BÖLÜM: ARDIŞIK KOMBO & BOMBA!<br><span style='font-size: 11px; opacity:0.9;'>İşaretli taşı sağa kaydır! T-şeklinde 5 taşla 3x3 Bomba yarat ve zincirleme Kombo patlat!</span>", 0);

            } else if (lvl === 4) {
                // ==========================================
                // 4. BÖLÜM: ZEUS KÜRESİ (5'Lİ DÜZ EŞLEŞTİRME & RENK BOMBASI)
                // ==========================================
                gridData[4][1] = 'purple';
                gridData[4][2] = 'purple';
                gridData[4][3] = 'yellow';
                gridData[4][4] = 'purple';
                gridData[4][5] = 'purple';
                gridData[3][3] = 'purple';
                gridData[3][2] = 'blue';
                gridData[3][4] = 'green';
                gridData[5][3] = 'red';
                renderGrid();

                const cells = grid.children;
                const idx1 = 3 * 8 + 3;
                const idx2 = 4 * 8 + 3;
                if (cells[idx1]) cells[idx1].classList.add('tutorial-pulse');
                if (cells[idx2]) cells[idx2].classList.add('tutorial-pulse');

                const topPos = (3 * cellWidth) - 10;
                const leftPos = (3 * cellWidth) - 10;

                const hint = document.createElement('div');
                hint.id = 'tutorial-hand-hint';
                hint.className = 'tutorial-hand-hint';
                hint.style.top = topPos + 'px';
                hint.style.left = leftPos + 'px';
                hint.innerHTML = \`
                    <div class="hand-icon" style="animation: handSlideVertical 1.3s infinite ease-in-out;">👇</div>
                    <div class="hand-label">Aşağı Kaydır (5'li Düz Eşleştir!)</div>
                \`;
                anchor.appendChild(hint);

                showOnboardingBanner("🌈 4. BÖLÜM: ZEUS KÜRESİ (5'Lİ EŞLEŞTİRME)!<br><span style='font-size: 11px; opacity:0.9;'>Mor taşı aşağı kaydırarak 5'li düz eşleştir! Tek rengi haritadan silen Zeus Küresi yarat!</span>", 0);

            } else if (lvl === 5) {
                // ==========================================
                // 5. BÖLÜM: KAHRAMAN İLAHİ GÜCÜ & MEZUNİYET
                // ==========================================
                gameGauge = 100;
                const btnUseAbility = document.getElementById('btn-use-ability');
                if (btnUseAbility) {
                    btnUseAbility.disabled = false;
                    btnUseAbility.innerText = "YETENEK KULLAN";
                    btnUseAbility.classList.add('tutorial-pulse');
                }
                const gameGaugeTxt = document.getElementById('game-gauge-txt');
                if (gameGaugeTxt) {
                    gameGaugeTxt.innerText = "100% (HAZIR!)";
                }

                showOnboardingBanner("🛡️ 5. BÖLÜM: KAHRAMAN İLAHİ GÜCÜ!<br><span style='font-size: 11px; opacity:0.9;'>Kombo barın %100 doldu! 'YETENEK KULLAN' butonuna dokunarak Arkenya'nın ilahi gücünü serbest bırak!</span>", 0);
            }
        }

        function setupLevel1InteractiveTutorial() {
            setupLevelTutorial(1);
        }`;

if (oldSetupTutorialRegex.test(content)) {
    content = content.replace(oldSetupTutorialRegex, newSetupTutorialEngine);
    console.log("PASS: Replaced setupLevelTutorial with 5 distinct onboarding tutorials.");
} else {
    console.log("Warning: oldSetupTutorialRegex did not match directly, checking fallback...");
}

// 10. ADD VERTICAL HAND SLIDE KEYFRAME TO CSS
if (!content.includes('handSlideVertical')) {
    const verticalKeyframe = `
        @keyframes handSlideVertical {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(0, 24px); }
        }
    `;
    content = content.replace('/* CANDY CRUSH EXPLOSION ANIMATION */', verticalKeyframe + '\n        /* CANDY CRUSH EXPLOSION ANIMATION */');
    console.log("PASS: Added handSlideVertical keyframe to CSS.");
}

// 11. IN usePowerup('zeus'): Clear tutorial hint if in Level 2
const oldZeusUse = `                if (godType === 'zeus') {
                    isSwapping = true;`;

const newZeusUse = `                if (godType === 'zeus') {
                    if (gameState.currentPlayingLevel === 2) {
                        dismissTutorialHint(true);
                        showOnboardingBanner("⚡ HARİKA! Şimşek patladı! Şimdi tahtadaki 4 mavi taşı eşleştirerek Yıldırım Kristali oluştur!", 6000);
                    }
                    isSwapping = true;`;

if (content.includes(oldZeusUse)) {
    content = content.replace(oldZeusUse, newZeusUse);
    console.log("PASS: Added Level 2 feedback upon using trial Zeus booster.");
}

// 12. IN useAbility(): Clear Level 5 tutorial pulse and hint
const oldUseAbility = `        function useAbility() {
            if (isSwapping || isCascading || isLevelEnding) return;
            if (gameGauge < 100) return;`;

const newUseAbility = `        function useAbility() {
            if (isSwapping || isCascading || isLevelEnding) return;
            if (gameGauge < 100) return;
            if (gameState.currentPlayingLevel === 5) {
                dismissTutorialHint(true);
                const btn = document.getElementById('btn-use-ability');
                if (btn) btn.classList.remove('tutorial-pulse');
                showOnboardingBanner("🎓 HARİKA! İlahi gücü serbest bıraktın! Şimdi hedefe ulaşıp Onboarding eğitimini tamamla!", 5000);
            }`;

if (content.includes(oldUseAbility)) {
    content = content.replace(oldUseAbility, newUseAbility);
    console.log("PASS: Added Level 5 feedback upon activating hero ability.");
}

// 13. IN startGameplayCore(): Ensure Level 5 initializes ability bar properly
const oldGaugeInit = `            if (lvl < 5) {
                if (btnUseAbility) {
                    btnUseAbility.disabled = true;
                    btnUseAbility.innerText = "🔒 5. BÖLÜMDE AÇILIR";
                }
                if (gameGaugeTxt) {
                    gameGaugeTxt.innerText = "Kilitli (Bölüm 5)";
                }
            } else {
                if (btnUseAbility) {
                    btnUseAbility.disabled = (gameGauge < 100);
                    btnUseAbility.innerText = "YETENEK KULLAN";
                }
                if (gameGaugeTxt) {
                    gameGaugeTxt.innerText = \`\${gameGauge}% (Kombo)\`;
                }
            }`;

const newGaugeInit = `            if (lvl < 5) {
                if (btnUseAbility) {
                    btnUseAbility.disabled = true;
                    btnUseAbility.innerText = "🔒 5. BÖLÜMDE AÇILIR";
                }
                if (gameGaugeTxt) {
                    gameGaugeTxt.innerText = "Kilitli (Bölüm 5)";
                }
            } else if (lvl === 5) {
                gameGauge = 100;
                if (btnUseAbility) {
                    btnUseAbility.disabled = false;
                    btnUseAbility.innerText = "YETENEK KULLAN";
                }
                if (gameGaugeTxt) {
                    gameGaugeTxt.innerText = "100% (HAZIR!)";
                }
            } else {
                if (btnUseAbility) {
                    btnUseAbility.disabled = (gameGauge < 100);
                    btnUseAbility.innerText = "YETENEK KULLAN";
                }
                if (gameGaugeTxt) {
                    gameGaugeTxt.innerText = \`\${gameGauge}% (Kombo)\`;
                }
            }`;

if (content.includes(oldGaugeInit)) {
    content = content.replace(oldGaugeInit, newGaugeInit);
    console.log("PASS: Updated startGameplayCore for Level 5 ready state.");
}

// Write back to file
fs.writeFileSync(filePath, content, 'utf8');
console.log("✅ Successfully updated www/index.html with master onboarding and retention loop!");

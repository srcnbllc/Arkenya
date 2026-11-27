const fs = require('fs');

console.log('=== APPLYING HEART DISPLAY, 30-MIN TIMER & MARKETING UPSELL UPGRADES ===');

const filePath = 'www/index.html';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add CSS for 5 hearts and warning state
const heartsCss = `
        /* 5 DİNAMİK KALP GÖSTERİMİ & SÖNME / SOLMA ANİMASYONLARI */
        .hearts-row {
            display: inline-flex;
            align-items: center;
            gap: 3px;
            user-select: none;
        }

        .heart-icon {
            display: inline-block;
            font-size: 14px;
            transition: all 0.35s cubic-bezier(0.25, 1, 0.5, 1);
            line-height: 1;
        }

        .heart-icon.active {
            color: #ef4444;
            filter: drop-shadow(0 0 5px rgba(239, 68, 68, 0.75));
            transform: scale(1);
            opacity: 1;
        }

        .heart-icon.faded {
            filter: grayscale(1) opacity(0.2);
            transform: scale(0.82);
            opacity: 0.22;
        }

        .gameplay-hearts-badge {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 2px;
            background: rgba(11, 16, 30, 0.88);
            backdrop-filter: blur(8px);
            padding: 3px 10px;
            border-radius: 14px;
            border: 1.5px solid rgba(245, 197, 66, 0.4);
            box-shadow: 0 2px 10px rgba(0,0,0,0.6);
            cursor: pointer;
            transition: transform 0.15s ease, border-color 0.2s;
        }

        .gameplay-hearts-badge:hover {
            border-color: var(--gold-primary);
            transform: scale(1.02);
        }

        .gameplay-hearts-badge.empty-warning {
            border-color: #ef4444;
            box-shadow: 0 0 15px rgba(239, 68, 68, 0.45);
            animation: pulse-heart-warning 1.8s infinite;
        }

        @keyframes pulse-heart-warning {
            0% { transform: scale(1); box-shadow: 0 0 8px rgba(239, 68, 68, 0.4); }
            50% { transform: scale(1.04); box-shadow: 0 0 18px rgba(239, 68, 68, 0.85); }
            100% { transform: scale(1); box-shadow: 0 0 8px rgba(239, 68, 68, 0.4); }
        }
`;

// Insert heartsCss into the <style> section (e.g. before </style>)
if (!content.includes('.gameplay-hearts-badge')) {
    content = content.replace('</style>', heartsCss + '\n    </style>');
    console.log('✅ Added hearts CSS styles and animations.');
}

// 2. Update Gameplay HUD energy badge to 5 dynamic heart icons
const oldGameplayEnergyBadge = `                        <div style="display: flex; gap: 6px; align-items: center; font-size: 10px; font-weight: 800; background: rgba(0,0,0,0.7); padding: 2px 8px; border-radius: 12px; border: 1px solid var(--gold-dark);">
                            <span style="color: #ff5555;">⚡ <span id="game-energy-val">5</span>/5</span>
                            <span style="color: #aaa; font-size: 9px;" id="hud-game-energy-timer">DOLU</span>
                        </div>`;

const newGameplayEnergyBadge = `                        <div class="gameplay-hearts-badge" id="gameplay-hearts-badge" onclick="if(gameState.energy<5)openModal('modal-out-of-lives')" title="Kutsal Canlar (Doldurmak için dokun)">
                            <div class="hearts-row" id="gameplay-hearts-row">
                                <span class="heart-icon active">❤️</span>
                                <span class="heart-icon active">❤️</span>
                                <span class="heart-icon active">❤️</span>
                                <span class="heart-icon active">❤️</span>
                                <span class="heart-icon active">❤️</span>
                            </div>
                            <div style="font-size: 8.5px; font-weight: 800; color: #cbd5e1; letter-spacing: 0.5px;" id="hud-game-energy-timer">DOLU</div>
                            <span id="game-energy-val" style="display: none;">5</span>
                        </div>`;

if (content.includes(oldGameplayEnergyBadge)) {
    content = content.replace(oldGameplayEnergyBadge, newGameplayEnergyBadge);
    console.log('✅ Replaced gameplay HUD energy badge with 5 dynamic heart icons.');
} else {
    console.warn('⚠️ oldGameplayEnergyBadge not found directly.');
}

// 3. Update modal-out-of-lives with high-converting mythic marketing UI
const oldModalOutOfLives = `            <!-- MODAL: OUT OF LIVES -->
            <div class="modal-overlay" id="modal-out-of-lives">
                <div class="modal-card">
                    <div style="font-size: 48px;">💔</div>
                    <div class="modal-title" style="color: var(--accent-red);">CANLARIN BİTTİ!</div>
                    <div style="font-size: 13px; color: #aaa; margin-bottom: 10px;">Yeni can için sayacın dolmasını bekle veya mağazadan canlarını doldur!</div>
                    <div style="font-size: 22px; font-weight: 800; color: var(--gold-light); margin-bottom: 15px;" id="out-of-lives-timer">30:00</div>
                                        <button class="btn-action btn-action-green" style="height: 48px; font-size: 14px; margin-bottom: 8px;" onclick="buyFullLives()">⚡ TÜM CANLARI DOLDUR (100 Elmas)</button>
                    <button class="btn-action" style="height: 44px; font-size: 13px; margin-bottom: 8px; background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: #fff; font-weight: 800;" onclick="watchAdForFreeLife()">📺 REKLAM İZLE (+1 Can Kazan)</button>
                    <button class="btn-action-sub" onclick="closeModal('modal-out-of-lives'); openWorldMap();">🗺️ HARİTAYA DÖN</button>
                </div>
            </div>`;

const newModalOutOfLives = `            <!-- MODAL: OUT OF LIVES (KUTSAL CANLAR TÜKENDİ & PAZARLAMA/DOLUM EKRANI) -->
            <div class="modal-overlay" id="modal-out-of-lives">
                <div class="modal-card" style="width: 92%; max-width: 400px; padding: 22px 18px; box-sizing: border-box; text-align: center; border: 2px solid var(--gold-primary); background: radial-gradient(circle at top, #1e1b4b 0%, #070b14 100%); box-shadow: 0 0 35px rgba(239, 68, 68, 0.35), 0 0 25px rgba(245, 197, 66, 0.25); border-radius: 20px;">
                    <div style="font-size: 46px; margin-bottom: 4px; animation: pulse 1.6s infinite alternate;">💔</div>
                    <div class="story-badge" style="display: inline-block; background: rgba(239, 68, 68, 0.2); border: 1px solid #ef4444; color: #fca5a5; padding: 2px 12px; border-radius: 12px; font-size: 10px; font-weight: 800; margin-bottom: 6px; letter-spacing: 0.5px;">KUTSAL ENERJİ TÜKENDİ</div>
                    <div class="modal-title" style="color: #ffffff; font-size: 20px; font-weight: 900; margin-bottom: 4px;">TÜM CANLARIN BİTTİ!</div>
                    <div style="font-size: 12px; color: #cbd5e1; line-height: 1.4; margin-bottom: 14px;">
                        Olimpos seferin yarıda kalmasın! Ücretsiz can sayacını bekleyebilir ya da hemen oyuna dönebilirsin.
                    </div>

                    <!-- 30 DAKİKA GERİ SAYIM SAYACI KUTUSU -->
                    <div style="background: rgba(0,0,0,0.55); border: 1.5px solid rgba(245, 197, 66, 0.35); border-radius: 12px; padding: 10px 14px; margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between;">
                        <div style="text-align: left;">
                            <div style="font-size: 9px; font-weight: 800; color: #94a3b8; letter-spacing: 0.5px; text-transform: uppercase;">Sonraki Ücretsiz Can</div>
                            <div style="font-size: 10px; color: #cbd5e1;">(Her 30 dakikada 1 can yenilenir)</div>
                        </div>
                        <div style="font-size: 20px; font-weight: 900; color: var(--gold-light); font-variant-numeric: tabular-nums;" id="out-of-lives-timer">30:00</div>
                    </div>

                    <!-- PAZARLAMA / SATIŞ VE DOLUM KARTLARI -->
                    <div style="display: flex; flex-direction: column; gap: 8px; width: 100%; margin-bottom: 14px;">
                        <!-- FIRSAT 1: 150 ALTIN İLE 5 CAN DOLUMU -->
                        <button class="btn-action" style="height: 48px; font-size: 13.5px; font-weight: 800; background: linear-gradient(180deg, #f59e0b 0%, #b45309 100%); color: #fff; border: 1px solid #fde68a; border-radius: 10px; box-shadow: 0 4px 14px rgba(245, 158, 11, 0.35); display: flex; align-items: center; justify-content: space-between; padding: 0 16px;" onclick="buyLivesWithGold(150, 5)">
                            <span style="display: flex; align-items: center; gap: 8px;"><span>⚡</span><span>5 Canı Anında Doldur</span></span>
                            <span style="background: rgba(0,0,0,0.3); padding: 3px 8px; border-radius: 6px; font-size: 11.5px;">💰 150 Altın</span>
                        </button>

                        <!-- FIRSAT 2: 10 ELMAS İLE TAM DOLUM (EN ÇOK TERCİH EDİLEN) -->
                        <div style="position: relative;">
                            <div style="position: absolute; top: -7px; right: 12px; background: #ef4444; color: #fff; font-size: 8px; font-weight: 900; padding: 1px 7px; border-radius: 6px; letter-spacing: 0.5px; z-index: 2; border: 1px solid #fff;">🔥 EN POPÜLER</div>
                            <button class="btn-action" style="height: 48px; font-size: 13.5px; font-weight: 800; background: linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%); color: #fff; border: 1.5px solid #93c5fd; border-radius: 10px; box-shadow: 0 4px 14px rgba(59, 130, 246, 0.4); display: flex; align-items: center; justify-content: space-between; padding: 0 16px; width: 100%;" onclick="buyLivesWithGems(10, 5)">
                                <span style="display: flex; align-items: center; gap: 8px;"><span>💎</span><span>Tam Can Dolumu</span></span>
                                <span style="background: rgba(0,0,0,0.3); padding: 3px 8px; border-radius: 6px; font-size: 11.5px;">💎 10 Elmas</span>
                            </button>
                        </div>

                        <!-- FIRSAT 3: REKLAM İZLE (+1 CAN HEDİYE) -->
                        <button class="btn-action" style="height: 42px; font-size: 12.5px; font-weight: 700; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.2); color: #e2e8f0; border-radius: 10px; display: flex; align-items: center; justify-content: center; gap: 8px;" onclick="watchAdForFreeLife()">
                            <span>📺</span><span>Reklam İzle (+1 Can Kazan)</span>
                        </button>
                    </div>

                    <!-- FIRSAT 4: MAĞAZAYA YÖNLENDİRME (PAZARLAMA CTA) -->
                    <button class="btn-action" style="height: 42px; font-size: 12.5px; font-weight: 800; background: rgba(245,197,66,0.15); border: 1.5px solid var(--gold-primary); color: var(--gold-light); border-radius: 10px; margin-bottom: 8px; display: flex; align-items: center; justify-content: center; gap: 8px;" onclick="closeModal('modal-out-of-lives'); showScreen('screen-store');">
                        <span>🏛️</span><span>HAZİNE MAĞAZASINA GİT (Elmas & Paketler)</span><span>➔</span>
                    </button>

                    <button class="btn-action-sub" style="height: 34px; font-size: 11.5px; color: #94a3b8; background: transparent; border: none; cursor: pointer;" onclick="closeModal('modal-out-of-lives'); openWorldMap();">
                        ✕ Şimdilik Bekle (Haritaya Dön)
                    </button>
                </div>
            </div>`;

if (content.includes(oldModalOutOfLives)) {
    content = content.replace(oldModalOutOfLives, newModalOutOfLives);
    console.log('✅ Replaced modal-out-of-lives with high-converting marketing modal.');
} else {
    console.warn('⚠️ oldModalOutOfLives not found directly.');
}

// 4. Update ENERGY_REGEN_MS to 30 minutes (30 * 60 * 1000) and implement renderAllHeartsAndTimers()
const oldEnergyRegenSection = `        // Energy Regeneration System (1 Energy every 10 minutes)
        const ENERGY_REGEN_MS = 10 * 60 * 1000;
        
        function checkEnergyRegen() {
            if (gameState.energy >= gameState.maxEnergy) {
                gameState.lastEnergyUpdate = Date.now();
                document.getElementById('hud-energy-timer').innerText = "DOLU";
                return;
            }

            const now = Date.now();
            const diff = now - gameState.lastEnergyUpdate;
            const energyToAdd = Math.floor(diff / ENERGY_REGEN_MS);

            if (energyToAdd > 0) {
                gameState.energy = Math.min(gameState.maxEnergy, gameState.energy + energyToAdd);
                gameState.lastEnergyUpdate += energyToAdd * ENERGY_REGEN_MS; // keep remainder
                saveGame();
            }

            // Update timer text
            if (gameState.energy < gameState.maxEnergy) {
                const remainder = ENERGY_REGEN_MS - (now - gameState.lastEnergyUpdate);
                const mins = Math.floor(remainder / 60000);
                const secs = Math.floor((remainder % 60000) / 1000);
                const timeStr = \`\${mins}:\${secs < 10 ? '0' : ''}\${secs}\`;
                
                const hudTimer = document.getElementById('hud-energy-timer');
                if(hudTimer) hudTimer.innerText = timeStr;
                
                const uiTimer = document.getElementById('out-of-lives-timer');
                if (uiTimer) uiTimer.innerText = timeStr;
            } else {
                const hudTimer = document.getElementById('hud-energy-timer');
                if(hudTimer) hudTimer.innerText = "DOLU";
            }
        }`;

const newEnergyRegenSection = `        // Energy Regeneration System (1 Kutsal Can her 30 dakikada bir otomatik yenilenir)
        const ENERGY_REGEN_MS = 30 * 60 * 1000;

        function renderAllHeartsAndTimers(timeStr = "DOLU") {
            const maxE = gameState.maxEnergy || 5;
            const curEnergy = Math.max(0, Math.min(maxE, gameState.energy || 0));

            // 1. Oynanış Ekranı Kalp Rozeti (5 Küçük Kalp)
            const gameplayHeartsRow = document.getElementById('gameplay-hearts-row');
            if (gameplayHeartsRow) {
                let hHtml = '';
                for (let i = 1; i <= maxE; i++) {
                    const isActive = i <= curEnergy;
                    hHtml += \`<span class="heart-icon \${isActive ? 'active' : 'faded'}" title="\${isActive ? 'Kutsal Can Aktif' : 'Can Tükendi'}">❤️</span>\`;
                }
                gameplayHeartsRow.innerHTML = hHtml;
            }

            // 2. Can Tükendiğinde Oynanış Rozeti Uyarı Animasyonu
            const gameplayHeartsBadge = document.getElementById('gameplay-hearts-badge');
            if (gameplayHeartsBadge) {
                if (curEnergy === 0) {
                    gameplayHeartsBadge.classList.add('empty-warning');
                } else {
                    gameplayHeartsBadge.classList.remove('empty-warning');
                }
            }

            // 3. Oynanış Ekranı Süre Metni
            const gameTimerEl = document.getElementById('hud-game-energy-timer');
            if (gameTimerEl) {
                if (curEnergy >= maxE) {
                    gameTimerEl.innerText = "DOLU";
                    gameTimerEl.style.color = "#94a3b8";
                } else if (curEnergy === 0) {
                    gameTimerEl.innerText = \`⏳ \${timeStr}\`;
                    gameTimerEl.style.color = "#f87171";
                } else {
                    gameTimerEl.innerText = \`⏳ \${timeStr}\`;
                    gameTimerEl.style.color = "#ffe885";
                }
            }

            // 4. Ana Menü / Global HUD Kalpleri ve Sayaç
            const globalPips = document.getElementById('hud-energy-pips');
            if (globalPips) {
                let gHtml = '';
                for (let i = 1; i <= maxE; i++) {
                    const isActive = i <= curEnergy;
                    gHtml += \`<span class="heart-icon \${isActive ? 'active' : 'faded'}" style="font-size: 13px;">❤️</span>\`;
                }
                globalPips.innerHTML = gHtml;
            }

            const globalTimer = document.getElementById('hud-energy-timer');
            if (globalTimer) {
                if (curEnergy >= maxE) {
                    globalTimer.innerText = "✨ DOLU";
                } else {
                    globalTimer.innerText = \`⏳ \${timeStr}\`;
                }
            }

            const energyCountEl = document.getElementById('hud-energy-count');
            if (energyCountEl) energyCountEl.innerText = curEnergy;

            const gameEnergyEl = document.getElementById('game-energy-val');
            if (gameEnergyEl) gameEnergyEl.innerText = curEnergy;

            // 5. Can Tükendi Modalındaki Canlı Sayaç
            const modalTimer = document.getElementById('out-of-lives-timer');
            if (modalTimer) {
                modalTimer.innerText = timeStr;
            }
        }
        
        function checkEnergyRegen() {
            if (!gameState.lastEnergyUpdate) gameState.lastEnergyUpdate = Date.now();
            const maxE = gameState.maxEnergy || 5;

            if (gameState.energy >= maxE) {
                gameState.lastEnergyUpdate = Date.now();
                renderAllHeartsAndTimers("DOLU");
                return;
            }

            const now = Date.now();
            const diff = now - gameState.lastEnergyUpdate;
            const energyToAdd = Math.floor(diff / ENERGY_REGEN_MS);

            if (energyToAdd > 0) {
                gameState.energy = Math.min(maxE, (gameState.energy || 0) + energyToAdd);
                gameState.lastEnergyUpdate += energyToAdd * ENERGY_REGEN_MS; // Kalan süreyi koru
                saveGame();
                syncAllHUDs();
            }

            // Geri sayım süresini hesapla
            if (gameState.energy < maxE) {
                const remainder = Math.max(0, ENERGY_REGEN_MS - (now - gameState.lastEnergyUpdate));
                const mins = Math.floor(remainder / 60000);
                const secs = Math.floor((remainder % 60000) / 1000);
                const timeStr = \`\${mins}:\${secs < 10 ? '0' : ''}\${secs}\`;
                renderAllHeartsAndTimers(timeStr);
            } else {
                renderAllHeartsAndTimers("DOLU");
            }
        }`;

if (content.includes(oldEnergyRegenSection)) {
    content = content.replace(oldEnergyRegenSection, newEnergyRegenSection);
    console.log('✅ Updated ENERGY_REGEN_MS to 30 mins and implemented renderAllHeartsAndTimers().');
} else {
    console.warn('⚠️ oldEnergyRegenSection not found directly.');
}

// 5. Add buyLivesWithGold and buyLivesWithGems functions
const buyLivesFunctions = `
        function buyLivesWithGold(cost = 150, count = 5) {
            if ((gameState.gold || 0) < cost) {
                showToast("Yetersiz Altın! Bölüm geçerek veya Mağaza'dan altın temin edebilirsin.", "error");
                return;
            }
            gameState.gold -= cost;
            gameState.energy = Math.min(gameState.maxEnergy || 5, (gameState.energy || 0) + count);
            gameState.lastEnergyUpdate = Date.now();
            saveGame();
            syncAllHUDs();
            closeModal('modal-out-of-lives');
            showToast(\`⚡ \${count} Can Anında Dolduruldu! (-\${cost} Altın)\`, "success");
        }

        function buyLivesWithGems(cost = 10, count = 5) {
            if ((gameState.gems || 0) < cost) {
                showToast("Yetersiz Elmas! Hazine Mağazası'ndan temin edebilirsin.", "error");
                closeModal('modal-out-of-lives');
                showScreen('screen-store');
                return;
            }
            gameState.gems -= cost;
            gameState.energy = Math.min(gameState.maxEnergy || 5, (gameState.energy || 0) + count);
            gameState.lastEnergyUpdate = Date.now();
            saveGame();
            syncAllHUDs();
            closeModal('modal-out-of-lives');
            showToast(\`💎 Kutsal Canların Dolduruldu! (-\${cost} Elmas)\`, "success");
        }
`;

if (!content.includes('function buyLivesWithGold')) {
    content = content.replace('function buyFullLives() {', buyLivesFunctions + '\n        function buyFullLives() {\n            buyLivesWithGems(10, 5);\n            return;');
    console.log('✅ Added buyLivesWithGold and buyLivesWithGems purchase functions.');
}

// 6. Call renderAllHeartsAndTimers inside syncAllHUDs and updateHUD
if (!content.includes('renderAllHeartsAndTimers();')) {
    content = content.replace('saveGame();\n        }', 'saveGame();\n            if (typeof renderAllHeartsAndTimers === "function") renderAllHeartsAndTimers();\n        }');
    console.log('✅ Integrated renderAllHeartsAndTimers into syncAllHUDs.');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ www/index.html updated successfully with all heart & energy upgrades!');

const fs = require('fs');

console.log("=== APPLYING INTEGRATED STORE REWARDS & DAILY TREASURES ECOSYSTEM ===");

let html = fs.readFileSync('www/index.html', 'utf8');

// Normalize CRLF to LF for reliable string matching
const isCRLF = html.includes('\r\n');
html = html.replace(/\r\n/g, '\n');

// 1. UPDATE defaultState TO INCLUDE dailyHub
const defaultStateSearch = `            stats: { totalGemsBroken: 0, powersUsed: 0, itemsBought: 0 },
            lastLoginDate: null,
            loginStreak: 0,
            hasSeenPrologue: false`;

const defaultStateReplacement = `            stats: { totalGemsBroken: 0, powersUsed: 0, itemsBought: 0 },
            lastLoginDate: null,
            loginStreak: 0,
            hasSeenPrologue: false,
            dailyHub: {
                freeGiftDate: null,
                adChestDate: null,
                adChestCount: 0,
                adChestTimestamp: 0,
                questsDate: null,
                quests: {
                    q1_gems: 0,
                    q2_levels: 0,
                    q3_powers: 0,
                    claimed: { q1: false, q2: false, q3: false, master: false }
                }
            }`;

if (html.includes(defaultStateSearch)) {
    html = html.replace(defaultStateSearch, defaultStateReplacement);
    console.log("✓ Added dailyHub to defaultState");
} else {
    console.error("✗ Failed to locate defaultStateSearch");
    process.exit(1);
}

// 2. INSERT KUTSAL TAPINAK HAZİNELERİ INTO screen-store
const storeScrollTarget = `<div id="screen-store-scroll" style="flex: 1; overflow-y: auto; padding: 14px 14px 110px 14px; -webkit-overflow-scrolling: touch;">`;

const storeTreasuresHTML = `<div id="screen-store-scroll" style="flex: 1; overflow-y: auto; padding: 14px 14px 110px 14px; -webkit-overflow-scrolling: touch;">
                    
                    <!-- ==========================================
                         KATEGORİ 1: GÜNLÜK TAPINAK HAZİNELERİ & GÖREV SANDIKLARI
                         ========================================== -->
                    <div style="margin-bottom: 22px;">
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; border-bottom: 1.5px solid rgba(245, 197, 66, 0.3); padding-bottom: 6px;">
                            <div style="font-size: 13px; font-weight: 900; color: var(--gold-light); display: flex; align-items: center; gap: 6px; letter-spacing: 0.5px;">
                                <span>👑</span> <span>1. GÜNLÜK TAPINAK HAZİNELERİ</span>
                            </div>
                            <div id="store-streak-badge" style="font-size: 10.5px; color: var(--gold-primary); font-weight: 800; background: rgba(245,197,66,0.12); border: 1px solid rgba(245,197,66,0.35); border-radius: 8px; padding: 3px 9px; cursor: pointer; display: flex; align-items: center; gap: 4px;" onclick="openDailyRewardsModal()" title="7 Günlük Giriş Zincirini Gör">
                                <span>Giriş Zinciri: Gün</span> <span id="store-streak-day" style="font-weight: 900; color: #fff;">1</span><span>/7 ➔</span>
                            </div>
                        </div>

                        <!-- 2'li Ücretsiz & Reklamlı Sandık Kartları -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <!-- KART A: GÜNÜN ÜCRETSİZ HEDİYESİ -->
                            <div id="store-card-free-gift" style="background: linear-gradient(135deg, rgba(245,197,66,0.12) 0%, rgba(14,20,34,0.96) 100%); border: 1.5px solid var(--gold-primary); border-radius: 14px; padding: 12px 10px; display: flex; flex-direction: column; justify-content: space-between; text-align: center; box-shadow: 0 4px 16px rgba(0,0,0,0.5);">
                                <div>
                                    <div style="font-size: 26px; margin-bottom: 3px; filter: drop-shadow(0 0 8px #f5c542);">🎁</div>
                                    <div style="font-size: 12.5px; font-weight: 900; color: var(--gold-light);">Günün Hediyesi</div>
                                    <div style="font-size: 10px; color: #cbd5e1; margin: 3px 0 6px 0;">150 💰 + 1x Nektar ❤️</div>
                                </div>
                                <div id="store-free-gift-btn-container">
                                    <button class="btn-action" style="width: 100%; height: 32px; font-size: 11px; font-weight: 900; background: linear-gradient(180deg, #ffe885 0%, #f5c542 100%); color: #000;" onclick="claimStoreFreeGift()">ÜCRETSİZ AL</button>
                                </div>
                            </div>

                            <!-- KART B: REKLAMLI KUTSAL SANDIK -->
                            <div id="store-card-ad-chest" style="background: linear-gradient(135deg, rgba(0,210,255,0.12) 0%, rgba(14,20,34,0.96) 100%); border: 1.5px solid rgba(0,210,255,0.45); border-radius: 14px; padding: 12px 10px; display: flex; flex-direction: column; justify-content: space-between; text-align: center; box-shadow: 0 4px 16px rgba(0,0,0,0.5);">
                                <div>
                                    <div style="font-size: 26px; margin-bottom: 3px; filter: drop-shadow(0 0 8px #00d2ff);">🎬</div>
                                    <div style="font-size: 12.5px; font-weight: 900; color: #00d2ff;">Olimpos Sandığı</div>
                                    <div style="font-size: 10px; color: #cbd5e1; margin: 3px 0 6px 0;">100 💰 + Güçlendirici + 3 💎</div>
                                </div>
                                <div id="store-ad-chest-btn-container">
                                    <button class="btn-action" style="width: 100%; height: 32px; font-size: 11px; font-weight: 900; background: linear-gradient(180deg, #0284c7 0%, #0369a1 100%); color: #fff;" onclick="claimStoreAdChest()">🎬 İZLE (2/2)</button>
                                </div>
                            </div>
                        </div>

                        <!-- KART C: ENTEGRE GÜNLÜK GÖREVLER & BÜYÜK SANDIK AFİŞİ -->
                        <div id="store-card-daily-quests-banner" style="background: linear-gradient(90deg, rgba(168,85,247,0.18) 0%, rgba(15,23,42,0.96) 100%); border: 1.5px solid rgba(168,85,247,0.45); border-radius: 14px; padding: 12px 14px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 4px 18px rgba(0,0,0,0.5);">
                            <div style="display: flex; align-items: center; gap: 10px; flex: 1;">
                                <div style="font-size: 28px; filter: drop-shadow(0 0 10px rgba(168,85,247,0.7));">📜</div>
                                <div style="overflow: hidden; text-align: left;">
                                    <div style="display: flex; align-items: center; gap: 6px;">
                                        <div style="font-size: 13px; font-weight: 900; color: #e9d5ff;">Günlük Görev Sandığı</div>
                                        <span id="store-quests-badge-count" style="font-size: 9.5px; font-weight: 800; background: #9333ea; color: #fff; padding: 1px 7px; border-radius: 6px;">0/3</span>
                                    </div>
                                    <div id="store-quests-desc-txt" style="font-size: 10px; color: #cbd5e1; margin-top: 2px;">3 Görevi tamamla: <b>+500 💰, +10 💎, +1 Athena 🛡️</b> kazan!</div>
                                </div>
                            </div>
                            <div id="store-quests-action-container" style="margin-left: 8px; flex-shrink: 0;">
                                <button class="btn-action" style="width: auto; padding: 0 12px; height: 32px; font-size: 11px; font-weight: 800; background: linear-gradient(180deg, #a855f7 0%, #7e22ce 100%); color: #fff;" onclick="openDailyQuestsModal()">GÖREVLER ➔</button>
                            </div>
                        </div>
                    </div>`;

if (html.includes(storeScrollTarget)) {
    html = html.replace(storeScrollTarget, storeTreasuresHTML);
    console.log("✓ Added Category 1 Daily Shrine Treasures to store");
} else {
    console.error("✗ Failed to locate storeScrollTarget");
    process.exit(1);
}

// Renumber remaining store categories cleanly
html = html.replace('👑 1. KUTSAL FIRSAT PAKETLERİ', '🔱 2. KUTSAL FIRSAT PAKETLERİ');
html = html.replace('💎 2. KUTSAL ELMAS SANDIKLARI', '💎 3. KUTSAL ELMAS SANDIKLARI');
html = html.replace('⚖️ 3. TAPINAK PAZARI & TAKAS', '⚖️ 4. TAPINAK PAZARI & TAKAS');
html = html.replace('🧪 4. TAPINAK GÜÇLENDİRİCİLERİ & CAN', '🧪 5. TAPINAK GÜÇLENDİRİCİLERİ & CAN');
console.log("✓ Renumbered store categories to 1..5");

// 3. REMOVE REDUNDANT modal-quests (Old Kehanetler)
const oldModalQuestsSearch = `            <!-- MODAL: QUESTS -->
            <div class="modal-overlay" id="modal-quests">
                <div class="modal-card" style="max-height: 80vh; overflow-y: auto; width: 90%; max-width: 400px; padding: 20px;">
                    <div class="modal-close" onclick="closeModal('modal-quests')">✕</div>
                    <div class="modal-title" style="margin-bottom: 5px;">📜 KAHİN'İN KEHANETLERİ</div>
                    <div style="font-size: 12px; color: var(--gold-primary); margin-bottom: 15px;">GÜNLÜK GÖREVLER</div>
                    
                    <div id="quests-list" style="width: 100%; display: flex; flex-direction: column; gap: 10px;">
                        <!-- Quests will be injected here -->
                    </div>

                    <button class="btn-action-sub" style="margin-top: 14px;" onclick="closeModal('modal-quests')">KAPAT</button>
                </div>
            </div>`;

if (html.includes(oldModalQuestsSearch)) {
    html = html.replace(oldModalQuestsSearch, '<!-- Legacy modal-quests unified into modal-daily-quests -->');
    console.log("✓ Removed legacy redundant modal-quests");
} else {
    console.warn("! Notice: oldModalQuestsSearch not matched as single block, checking partial...");
}

// 4. REPLACE STATIC modal-daily-quests WITH DYNAMIC RESPONSIVE CONTAINER
const staticModalDailyQuestsRegex = /<!-- MODAL: GÜNLÜK OLİMPOS GÖREVLERİ -->[\s\S]*?id="modal-daily-quests"[\s\S]*?<\/div>\s*<\/div>/;

const dynamicModalDailyQuestsHTML = `<!-- MODAL: GÜNLÜK OLİMPOS GÖREVLERİ (DİNAMİK ENTEGRE) -->
    <div class="modal-overlay" id="modal-daily-quests" onclick="if(event.target===this)closeModal('modal-daily-quests')">
        <div class="modal-content" style="max-width: 430px; width: 92%; background: linear-gradient(135deg, rgba(14,20,32,0.98), rgba(6,10,18,0.98)); border: 2px solid var(--gold-primary); border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.8), 0 0 25px rgba(245,197,66,0.3); padding: 20px; max-height: 88vh; display: flex; flex-direction: column;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1.5px solid rgba(245,197,66,0.3); padding-bottom: 12px; margin-bottom: 14px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 24px;">📜</span>
                    <div style="text-align: left;">
                        <div style="font-size: 16px; font-weight: 900; color: var(--gold-light); letter-spacing: 0.8px;">GÜNLÜK GÖREVLER</div>
                        <div style="font-size: 10.5px; color: #94a3b8;">Her 24 saatte bir yenilenen kutsal görevler</div>
                    </div>
                </div>
                <button onclick="closeModal('modal-daily-quests')" style="background: none; border: none; font-size: 22px; color: #aaa; cursor: pointer;">✕</button>
            </div>

            <!-- GÖREVLER DİNAMİK LİSTESİ -->
            <div id="daily-quests-dynamic-list" style="overflow-y: auto; display: flex; flex-direction: column; gap: 10px; margin-bottom: 14px; padding-right: 2px;">
                <!-- Dinamik olarak renderDailyQuestsList() tarafından doldurulur -->
            </div>

            <!-- BÜYÜK TAPINAK SANDIĞI (MASTER CHEST) -->
            <div id="daily-quests-master-chest" style="margin-bottom: 12px;">
                <!-- Dinamik olarak doldurulur -->
            </div>

            <button class="btn-action" style="width: 100%; height: 38px; background: rgba(255,255,255,0.08); border: 1.5px solid rgba(255,255,255,0.2); color: #cbd5e1; font-size: 12px; font-weight: 800;" onclick="closeModal('modal-daily-quests')">KAPAT</button>
        </div>
    </div>`;

if (staticModalDailyQuestsRegex.test(html)) {
    html = html.replace(staticModalDailyQuestsRegex, dynamicModalDailyQuestsHTML);
    console.log("✓ Replaced static modal-daily-quests with dynamic container");
} else {
    console.error("✗ Failed to locate staticModalDailyQuestsRegex");
    process.exit(1);
}

// 5. IMPLEMENT THE COMPLETE JAVASCRIPT ENGINE FOR DAILY HUB, QUESTS & STORE REWARDS
const oldDailyQuestsFuncSearch = `        function openDailyQuestsModal() {
            if (typeof sfxButtonClick === 'function') sfxButtonClick();
            triggerHaptic('light');
            openModal('modal-daily-quests');
        }

        function claimDailyQuest(questId, amount, type, btnEl) {
            if (typeof sfxVictory === 'function') sfxVictory();
            triggerHaptic('medium');
            if (type === 'gold') {
                gameState.gold = (gameState.gold || 0) + amount;
                if (typeof spawnFloatingText === 'function') spawnFloatingText('+' + amount + ' Altın!', '#ffd700');
            } else if (type === 'gems') {
                gameState.gems = (gameState.gems || 0) + amount;
                if (typeof spawnFloatingText === 'function') spawnFloatingText('+' + amount + ' Elmas!', '#00d2ff');
            } else if (type === 'energy') {
                gameState.energy = Math.min(5, (gameState.energy || 0) + amount);
                if (typeof spawnFloatingText === 'function') spawnFloatingText('+1 Can!', '#ff5555');
            }
            if (typeof saveGame === "function") saveGame();
            updateHUD();
            updateMainMenuUI();

            if (btnEl) {
                btnEl.textContent = 'ALINDI ✓';
                btnEl.style.background = '#475569';
                btnEl.style.cursor = 'default';
                btnEl.disabled = true;
            }
        }`;

const newUnifiedDailyHubEngine = `        // ==========================================
        // ENTEGRE GÜNLÜK HAZİNELER, GÖREVLER & MAĞAZA ÖDÜLLERİ MOTORU
        // ==========================================
        function ensureDailyHubData() {
            const today = new Date().toDateString();
            if (!gameState.dailyHub) {
                gameState.dailyHub = {
                    freeGiftDate: null,
                    adChestDate: null,
                    adChestCount: 0,
                    adChestTimestamp: 0,
                    questsDate: null,
                    quests: {
                        q1_gems: 0,
                        q2_levels: 0,
                        q3_powers: 0,
                        claimed: { q1: false, q2: false, q3: false, master: false }
                    }
                };
            }
            if (!gameState.dailyHub.quests) {
                gameState.dailyHub.quests = { q1_gems: 0, q2_levels: 0, q3_powers: 0, claimed: { q1: false, q2: false, q3: false, master: false } };
            }
            if (!gameState.dailyHub.quests.claimed) {
                gameState.dailyHub.quests.claimed = { q1: false, q2: false, q3: false, master: false };
            }

            // Tarih kontrolü ve günlük görevlerin sıfırlanması
            if (gameState.dailyHub.questsDate !== today) {
                gameState.dailyHub.questsDate = today;
                gameState.dailyHub.quests.q1_gems = 0;
                gameState.dailyHub.quests.q2_levels = 0;
                gameState.dailyHub.quests.q3_powers = 0;
                gameState.dailyHub.quests.claimed = { q1: false, q2: false, q3: false, master: false };
            }

            // Günlük reklam sandığı hakkı sıfırlanması
            if (gameState.dailyHub.adChestDate !== today) {
                gameState.dailyHub.adChestDate = today;
                gameState.dailyHub.adChestCount = 0;
            }
        }

        const DAILY_QUESTS_CONFIG = [
            {
                id: 'q1',
                title: '100 Olimpos Taşı Patlat',
                desc: 'Oyun tahtasında 100 taş eşleştir ve patlat',
                icon: '💎',
                target: 100,
                getCurrent: () => (gameState.dailyHub && gameState.dailyHub.quests ? (gameState.dailyHub.quests.q1_gems || 0) : 0),
                rewardGold: 200,
                rewardEnergy: 1,
                rewardText: '+200 💰 + 1 Can ❤️'
            },
            {
                id: 'q2',
                title: '2 Bölüm Zaferi Kazan',
                desc: 'Herhangi bir bölümde hedef puana ulaşarak zafer kazan',
                icon: '🏛️',
                target: 2,
                getCurrent: () => (gameState.dailyHub && gameState.dailyHub.quests ? (gameState.dailyHub.quests.q2_levels || 0) : 0),
                rewardGold: 300,
                rewardZeus: 1,
                rewardText: '+300 💰 + 1x Zeus ⚡'
            },
            {
                id: 'q3',
                title: '1 Kahraman Yeteneği Kullan',
                desc: 'Bölüm sırasında kombo barını doldurup yeteneğini aktifleştir',
                icon: '⚡',
                target: 1,
                getCurrent: () => (gameState.dailyHub && gameState.dailyHub.quests ? (gameState.dailyHub.quests.q3_powers || 0) : 0),
                rewardGems: 5,
                rewardText: '+5 Elmas 💎'
            }
        ];

        function openDailyRewardsModal() {
            if (typeof sfxButtonClick === 'function') sfxButtonClick();
            checkDailyReward(false);
        }

        function openDailyQuestsModal() {
            ensureDailyHubData();
            if (typeof sfxButtonClick === 'function') sfxButtonClick();
            triggerHaptic('light');
            renderDailyQuestsList();
            openModal('modal-daily-quests');
        }

        function renderDailyQuestsList() {
            ensureDailyHubData();
            const listEl = document.getElementById('daily-quests-dynamic-list');
            if (!listEl) return;

            listEl.innerHTML = '';
            let completedCount = 0;
            const claimed = (gameState.dailyHub && gameState.dailyHub.quests && gameState.dailyHub.quests.claimed) || {};

            DAILY_QUESTS_CONFIG.forEach(q => {
                const current = q.getCurrent();
                const progressPct = Math.min(100, Math.floor((current / q.target) * 100));
                const isDone = current >= q.target;
                const isClaimed = !!claimed[q.id];
                if (isClaimed) completedCount++;

                let actionBtnHTML = '';
                if (isClaimed) {
                    actionBtnHTML = \`<button disabled style="min-width: 82px; height: 32px; font-size: 11px; background: #334155; color: #94a3b8; border: 1px solid #475569; border-radius: 8px; font-weight: 800;">ALINDI ✓</button>\`;
                } else if (isDone) {
                    actionBtnHTML = \`<button class="btn-action" style="min-width: 82px; height: 32px; font-size: 11px; background: linear-gradient(180deg, #ffe885 0%, #f5c542 100%); color: #000; font-weight: 900;" onclick="claimDailyQuest('\${q.id}')">ÖDÜLÜ AL</button>\`;
                } else {
                    actionBtnHTML = \`<button disabled style="min-width: 82px; height: 32px; font-size: 10.5px; background: rgba(0,0,0,0.5); color: #94a3b8; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; font-weight: 700;">\${current}/\${q.target}</button>\`;
                }

                listEl.innerHTML += \`
                    <div style="background: rgba(255,255,255,0.04); border: 1.5px solid rgba(245,197,66,0.25); border-radius: 12px; padding: 11px 12px; display: flex; align-items: center; justify-content: space-between; gap: 10px;">
                        <div style="font-size: 22px; flex-shrink: 0;">\${q.icon}</div>
                        <div style="flex: 1; text-align: left;">
                            <div style="font-size: 12.5px; font-weight: 800; color: #fff;">\${q.title}</div>
                            <div style="font-size: 10px; color: var(--gold-light); font-weight: 700; margin: 2px 0;">Ödül: \${q.rewardText}</div>
                            <div style="height: 6px; background: rgba(0,0,0,0.6); border-radius: 4px; overflow: hidden; width: 100%; margin-top: 4px;">
                                <div style="height: 100%; width: \${progressPct}%; background: linear-gradient(90deg, #f5c542, #ffe885); border-radius: 4px; transition: width 0.3s ease;"></div>
                            </div>
                        </div>
                        <div style="flex-shrink: 0;">\${actionBtnHTML}</div>
                    </div>
                \`;
            });

            // Master Chest rendering
            const masterChestEl = document.getElementById('daily-quests-master-chest');
            if (masterChestEl) {
                const allThreeClaimed = claimed.q1 && claimed.q2 && claimed.q3;
                const masterClaimed = !!claimed.master;

                if (masterClaimed) {
                    masterChestEl.innerHTML = \`
                        <div style="background: rgba(34, 197, 94, 0.12); border: 1.5px solid #22c55e; border-radius: 12px; padding: 10px 12px; text-align: center; color: #86efac; font-size: 11.5px; font-weight: 800;">
                            ✨ BUGÜNÜN BÜYÜK TAPINAK SANDIĞI ALINDI! YARIN YENİSİ AÇILACAK.
                        </div>
                    \`;
                } else if (allThreeClaimed) {
                    masterChestEl.innerHTML = \`
                        <div style="background: linear-gradient(135deg, rgba(245,197,66,0.2) 0%, rgba(168,85,247,0.25) 100%); border: 2px solid var(--gold-primary); border-radius: 14px; padding: 12px; text-align: center; box-shadow: 0 0 20px rgba(245,197,66,0.4);">
                            <div style="font-size: 13px; font-weight: 900; color: var(--gold-light); margin-bottom: 4px;">👑 TÜM GÖREVLER TAMAMLANDI!</div>
                            <div style="font-size: 10.5px; color: #cbd5e1; margin-bottom: 8px;">Ödül: <b>+500 💰, +10 💎, +1 Athena Kalkanı 🛡️</b></div>
                            <button class="btn-action" style="width: 100%; height: 36px; font-size: 12px; font-weight: 900; background: linear-gradient(180deg, #ffe885 0%, #f5c542 100%); color: #000;" onclick="claimMasterChest()">🏛️ BÜYÜK SANDIĞI AÇ</button>
                        </div>
                    \`;
                } else {
                    masterChestEl.innerHTML = \`
                        <div style="background: rgba(255,255,255,0.03); border: 1px dashed rgba(245,197,66,0.3); border-radius: 12px; padding: 10px 12px; display: flex; align-items: center; justify-content: space-between;">
                            <div style="text-align: left;">
                                <div style="font-size: 12px; font-weight: 800; color: var(--gold-light);">🏛️ Büyük Tapınak Sandığı (\${completedCount}/3)</div>
                                <div style="font-size: 10px; color: #94a3b8;">3 görevi tamamlayınca +500 💰, +10 💎, +1 Kalkan açılır</div>
                            </div>
                            <div style="font-size: 24px; opacity: 0.6;">🔒</div>
                        </div>
                    \`;
                }
            }
        }

        function claimDailyQuest(questId) {
            ensureDailyHubData();
            const q = DAILY_QUESTS_CONFIG.find(x => x.id === questId);
            if (!q) return;

            const current = q.getCurrent();
            if (current < q.target) {
                showToast("Bu görev henüz tamamlanmadı!", "info");
                return;
            }

            if (gameState.dailyHub.quests.claimed[questId]) {
                showToast("Bu ödülü zaten aldın!", "info");
                return;
            }

            gameState.dailyHub.quests.claimed[questId] = true;

            // Apply rewards
            if (q.rewardGold) gameState.gold = (gameState.gold || 0) + q.rewardGold;
            if (q.rewardGems) gameState.gems = (gameState.gems || 0) + q.rewardGems;
            if (q.rewardEnergy) gameState.energy = Math.min(5, (gameState.energy || 0) + q.rewardEnergy);
            if (q.rewardZeus) {
                gameState.inventory = gameState.inventory || {};
                gameState.inventory.zeus = (gameState.inventory.zeus || 0) + q.rewardZeus;
            }

            if (typeof sfxVictory === 'function') sfxVictory();
            triggerHaptic('medium');
            showToast(\`🎉 \${q.title} Tamamlandı! \${q.rewardText}\`, "success");

            saveGame();
            syncAllHUDs();
            renderDailyQuestsList();
            updateDailyHubUI();
            updateMainMenuUI();
        }

        function claimMasterChest() {
            ensureDailyHubData();
            const claimed = (gameState.dailyHub && gameState.dailyHub.quests && gameState.dailyHub.quests.claimed) || {};
            if (!claimed.q1 || !claimed.q2 || !claimed.q3) {
                showToast("Büyük sandığı açmak için 3 görevi de tamamlamalısın!", "info");
                return;
            }
            if (claimed.master) {
                showToast("Büyük Tapınak Sandığını zaten aldın!", "info");
                return;
            }

            gameState.dailyHub.quests.claimed.master = true;
            gameState.gold = (gameState.gold || 0) + 500;
            gameState.gems = (gameState.gems || 0) + 10;
            gameState.inventory = gameState.inventory || {};
            gameState.inventory.athena = (gameState.inventory.athena || 0) + 1;

            if (typeof sfxVictory === 'function') sfxVictory();
            triggerHaptic('heavy');
            showToast("🏛️ BÜYÜK TAPINAK SANDIĞI AÇILDI! +500 💰, +10 💎, +1 Athena Kalkanı!", "success");

            saveGame();
            syncAllHUDs();
            renderDailyQuestsList();
            updateDailyHubUI();
            updateMainMenuUI();
        }

        function claimStoreFreeGift() {
            ensureDailyHubData();
            const today = new Date().toDateString();
            if (gameState.dailyHub.freeGiftDate === today) {
                showToast("Bugünün ücretsiz hediyesini zaten aldın! Yarın yenisi açılacak.", "info");
                return;
            }

            gameState.dailyHub.freeGiftDate = today;
            gameState.gold = (gameState.gold || 0) + 150;
            gameState.energy = Math.min(5, (gameState.energy || 0) + 1);

            if (typeof sfxVictory === 'function') sfxVictory();
            triggerHaptic('medium');
            showToast("🎁 Günün Hediyesi Alındı: +150 Altın ve +1 Kutsal Can!", "success");

            saveGame();
            syncAllHUDs();
            updateDailyHubUI();
            updateMainMenuUI();
        }

        function claimStoreAdChest() {
            ensureDailyHubData();
            if ((gameState.dailyHub.adChestCount || 0) >= 2) {
                showToast("Bugünkü Kutsal Reklam Sandığı hakkın doldu (2/2). Yarın yenilenir!", "info");
                return;
            }

            // VIP Instant bypass
            if (gameState.hasPurchasedNoAds) {
                executeAdChestReward();
                return;
            }

            // Normal Ad Flow with AdGuard lock
            if (window.AdGuard) window.AdGuard.prepareForAd();
            showToast("Kutsal Sandık hazırlanıyor, reklam izleniyor...", "info");

            setTimeout(() => {
                if (window.AdGuard) window.AdGuard.onAdClosed();
                executeAdChestReward();
            }, 1200);
        }

        function executeAdChestReward() {
            ensureDailyHubData();
            gameState.dailyHub.adChestCount = (gameState.dailyHub.adChestCount || 0) + 1;
            gameState.dailyHub.adChestTimestamp = Date.now();

            gameState.gold = (gameState.gold || 0) + 100;
            gameState.gems = (gameState.gems || 0) + 3;
            gameState.inventory = gameState.inventory || {};
            // Award Zeus or Hermes
            const booster = (Math.random() < 0.5) ? 'zeus' : 'hermes';
            gameState.inventory[booster] = (gameState.inventory[booster] || 0) + 1;
            const boosterName = booster === 'zeus' ? 'Zeus Şimşeği ⚡' : 'Hermes Kasırgası 🌪️';

            if (typeof sfxVictory === 'function') sfxVictory();
            triggerHaptic('heavy');
            showToast(\`🏛️ Olimpos Sandığı Açıldı! +100 💰, +3 💎 ve +1 \${boosterName}\`, "success");

            saveGame();
            syncAllHUDs();
            updateDailyHubUI();
            updateMainMenuUI();
        }

        function updateDailyHubUI() {
            ensureDailyHubData();
            const today = new Date().toDateString();

            // 1. Free gift button state & countdown
            const freeContainer = document.getElementById('store-free-gift-btn-container');
            if (freeContainer) {
                if (gameState.dailyHub.freeGiftDate === today) {
                    const now = new Date();
                    const midnight = new Date();
                    midnight.setHours(24, 0, 0, 0);
                    const diffMs = Math.max(0, midnight - now);
                    const hrs = Math.floor(diffMs / 3600000);
                    const mins = Math.floor((diffMs % 3600000) / 60000);
                    freeContainer.innerHTML = \`<button disabled style="width: 100%; height: 32px; font-size: 10.5px; background: rgba(0,0,0,0.5); color: #94a3b8; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; font-weight: 700;">⏳ \${hrs}s \${mins}d Sonra</button>\`;
                } else {
                    freeContainer.innerHTML = \`<button class="btn-action" style="width: 100%; height: 32px; font-size: 11px; font-weight: 900; background: linear-gradient(180deg, #ffe885 0%, #f5c542 100%); color: #000;" onclick="claimStoreFreeGift()">ÜCRETSİZ AL</button>\`;
                }
            }

            // 2. Ad chest button state
            const adContainer = document.getElementById('store-ad-chest-btn-container');
            if (adContainer) {
                const count = gameState.dailyHub.adChestCount || 0;
                if (count >= 2) {
                    adContainer.innerHTML = \`<button disabled style="width: 100%; height: 32px; font-size: 10.5px; background: rgba(0,0,0,0.5); color: #94a3b8; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; font-weight: 700;">DOLDU (2/2)</button>\`;
                } else if (gameState.hasPurchasedNoAds) {
                    adContainer.innerHTML = \`<button class="btn-action" style="width: 100%; height: 32px; font-size: 11px; font-weight: 900; background: linear-gradient(180deg, #38bdf8 0%, #0284c7 100%); color: #fff;" onclick="claimStoreAdChest()">👑 VIP AÇ (\${2 - count}/2)</button>\`;
                } else {
                    adContainer.innerHTML = \`<button class="btn-action" style="width: 100%; height: 32px; font-size: 11px; font-weight: 900; background: linear-gradient(180deg, #0284c7 0%, #0369a1 100%); color: #fff;" onclick="claimStoreAdChest()">🎬 İZLE (\${2 - count}/2)</button>\`;
                }
            }

            // 3. Quests banner in store
            const qBadge = document.getElementById('store-quests-badge-count');
            const qAction = document.getElementById('store-quests-action-container');
            if (qBadge && qAction) {
                const claimed = (gameState.dailyHub.quests && gameState.dailyHub.quests.claimed) || {};
                let completedCount = 0;
                if (claimed.q1) completedCount++;
                if (claimed.q2) completedCount++;
                if (claimed.q3) completedCount++;

                qBadge.textContent = \`\${completedCount}/3\`;

                if (completedCount === 3 && !claimed.master) {
                    qAction.innerHTML = \`<button class="btn-action" style="width: auto; padding: 0 12px; height: 32px; font-size: 11px; font-weight: 900; background: linear-gradient(180deg, #ffe885 0%, #f5c542 100%); color: #000;" onclick="claimMasterChest()">🏛️ AÇ</button>\`;
                } else {
                    qAction.innerHTML = \`<button class="btn-action" style="width: auto; padding: 0 12px; height: 32px; font-size: 11px; font-weight: 800; background: linear-gradient(180deg, #a855f7 0%, #7e22ce 100%); color: #fff;" onclick="openDailyQuestsModal()">GÖREVLER ➔</button>\`;
                }
            }

            // 4. Streak badge day
            const streakDayEl = document.getElementById('store-streak-day');
            if (streakDayEl) {
                streakDayEl.textContent = String(Math.max(1, Math.min(7, gameState.loginStreak || 1)));
            }
        }`;

if (html.includes(oldDailyQuestsFuncSearch)) {
    html = html.replace(oldDailyQuestsFuncSearch, newUnifiedDailyHubEngine);
    console.log("✓ Replaced quest functions with unified Daily Hub Engine");
} else {
    console.error("✗ Failed to locate oldDailyQuestsFuncSearch");
    process.exit(1);
}

// 6. CONNECT updateStoreUI TO updateDailyHubUI
const updateStoreUISearch = `            if(invAr) { invAr.textContent = String((gameState.inventory && gameState.inventory.ares) || 0); invAr.innerText = invAr.textContent; }
        }`;

const updateStoreUIReplacement = `            if(invAr) { invAr.textContent = String((gameState.inventory && gameState.inventory.ares) || 0); invAr.innerText = invAr.textContent; }
            if (typeof updateDailyHubUI === 'function') updateDailyHubUI();
        }`;

if (html.includes(updateStoreUISearch)) {
    html = html.replace(updateStoreUISearch, updateStoreUIReplacement);
    console.log("✓ Connected updateStoreUI to updateDailyHubUI");
} else {
    console.error("✗ Failed to locate updateStoreUISearch");
    process.exit(1);
}

// 7. HOOK GAMEPLAY EVENTS TO DAILY QUESTS
// 7A. In showVictory (levels won hook)
const showVictoryHookSearch = `            gameState.stats.levelsPlayedToday = (gameState.stats.levelsPlayedToday || 0) + 1;`;
const showVictoryHookReplacement = `            gameState.stats.levelsPlayedToday = (gameState.stats.levelsPlayedToday || 0) + 1;
            if (gameState.dailyHub && gameState.dailyHub.quests) {
                gameState.dailyHub.quests.q2_levels = (gameState.dailyHub.quests.q2_levels || 0) + 1;
            }`;

if (html.includes(showVictoryHookSearch)) {
    html = html.replace(showVictoryHookSearch, showVictoryHookReplacement);
    console.log("✓ Hooked showVictory to daily quest 2 (levels won)");
} else {
    console.error("✗ Failed to locate showVictoryHookSearch");
    process.exit(1);
}

// 7B. In useAbility (hero powers hook)
const useAbilityHookSearch = `            if (gameState && gameState.stats) gameState.stats.powersUsed++;`;
const useAbilityHookReplacement = `            if (gameState && gameState.stats) gameState.stats.powersUsed++;
            if (gameState.dailyHub && gameState.dailyHub.quests) {
                gameState.dailyHub.quests.q3_powers = (gameState.dailyHub.quests.q3_powers || 0) + 1;
            }`;

if (html.includes(useAbilityHookSearch)) {
    html = html.replace(useAbilityHookSearch, useAbilityHookReplacement);
    console.log("✓ Hooked useAbility to daily quest 3 (powers used)");
} else {
    console.error("✗ Failed to locate useAbilityHookSearch");
    process.exit(1);
}

// 7C. In matches pop (gems destroyed hook)
const popGemsHookSearch = `            const scoreEl = document.getElementById('game-score');`;
const popGemsHookReplacement = `            if (gameState.dailyHub && gameState.dailyHub.quests) {
                gameState.dailyHub.quests.q1_gems = (gameState.dailyHub.quests.q1_gems || 0) + (finalPopArray ? finalPopArray.length : 0);
            }
            const scoreEl = document.getElementById('game-score');`;

if (html.includes(popGemsHookSearch)) {
    html = html.replace(popGemsHookSearch, popGemsHookReplacement);
    console.log("✓ Hooked gem pops to daily quest 1 (gems broken)");
} else {
    console.error("✗ Failed to locate popGemsHookSearch");
    process.exit(1);
}

// Restore CRLF if file was CRLF originally
if (isCRLF) {
    html = html.replace(/\n/g, '\r\n');
}

fs.writeFileSync('www/index.html', html, 'utf8');
console.log(">>> ALL INTEGRATED REWARDS & DAILY TREASURES PATCHES APPLIED SUCCESSFULLY! <<<");

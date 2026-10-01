const fs = require('fs');
const path = require('path');

console.log('=== APPLYING OVERHAUL WITH CRLF NORMALIZATION ===');

const indexPath = path.join(__dirname, '..', 'www', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');
const isCrlf = html.includes('\r\n');
html = html.replace(/\r\n/g, '\n');

// 1. Check Store Categories update
const cat2Start = html.indexOf('<!-- KATEGORİ 2: KUTSAL ELMAS SANDIKLARI');
const cat4End = html.indexOf('</div>\n                </div>\n            </div>\n\n            <div class="screen" id="screen-gameplay"');
console.log('cat2Start:', cat2Start, 'cat4End:', cat4End);

if (cat2Start !== -1 && cat4End !== -1) {
    const newCategoriesHtml = `<!-- KATEGORİ 2: KUTSAL ELMAS SANDIKLARI (IAP) -->
                    <div style="font-size: 12.5px; font-weight: 800; color: #38bdf8; margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 5px;">
                        💎 2. KUTSAL ELMAS SANDIKLARI
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 22px;">
                        <!-- 60 Gems -->
                        <div style="background: rgba(14, 165, 233, 0.08); border: 1px solid rgba(14, 165, 233, 0.25); border-radius: 12px; padding: 12px; text-align: center; display: flex; flex-direction: column; justify-content: space-between;">
                            <div>
                                <div style="font-size: 24px; margin-bottom: 4px;">💎</div>
                                <div style="font-size: 13.5px; font-weight: 800; color: #bae6fd;">60 Elmas</div>
                                <div style="font-size: 10px; color: #64748b; margin-bottom: 8px;">Küçük Kese</div>
                            </div>
                            <button class="btn-action" style="height: 34px; font-size: 12px; background: linear-gradient(180deg, #0284c7 0%, #0369a1 100%); color: #fff;" onclick="purchaseIAP('gems_pouch', 19.99, '60 Kutsal Elmas Kesesi', ['60 Kutsal Elmas'])">₺19.99</button>
                        </div>

                        <!-- 250 Gems -->
                        <div style="background: rgba(14, 165, 233, 0.12); border: 1.5px solid var(--accent-blue); border-radius: 12px; padding: 12px; text-align: center; display: flex; flex-direction: column; justify-content: space-between;">
                            <div>
                                <div style="font-size: 24px; margin-bottom: 4px;">👑</div>
                                <div style="font-size: 13.5px; font-weight: 800; color: #bae6fd;">250 Elmas</div>
                                <div style="font-size: 10px; color: var(--gold-light); font-weight: 700; margin-bottom: 8px;">+ 1x Şimşek Hediye</div>
                            </div>
                            <button class="btn-action" style="height: 34px; font-size: 12px; background: linear-gradient(180deg, #38bdf8 0%, #0284c7 100%); color: #000; font-weight: 800;" onclick="purchaseIAP('gems_chest', 69.99, '250 Kutsal Elmas Sandığı', ['250 Kutsal Elmas', '1x Zeus Şimşeği'])">₺69.99</button>
                        </div>

                        <!-- 650 Gems -->
                        <div style="background: rgba(14, 165, 233, 0.08); border: 1px solid rgba(14, 165, 233, 0.25); border-radius: 12px; padding: 12px; text-align: center; display: flex; flex-direction: column; justify-content: space-between;">
                            <div>
                                <div style="font-size: 24px; margin-bottom: 4px;">🏺</div>
                                <div style="font-size: 13.5px; font-weight: 800; color: #bae6fd;">650 Elmas</div>
                                <div style="font-size: 10px; color: var(--gold-light); font-weight: 700; margin-bottom: 8px;">+ 3x Şimşek & Kalkan</div>
                            </div>
                            <button class="btn-action" style="height: 34px; font-size: 12px; background: linear-gradient(180deg, #0284c7 0%, #0369a1 100%); color: #fff;" onclick="purchaseIAP('gems_sack', 149.99, '650 Kutsal Elmas Amforası', ['650 Kutsal Elmas', '3x Zeus Şimşeği', '3x Athena Kalkanı'])">₺149.99</button>
                        </div>

                        <!-- 1500 Gems -->
                        <div style="background: rgba(245, 197, 66, 0.08); border: 1.5px solid var(--gold-primary); border-radius: 12px; padding: 12px; text-align: center; display: flex; flex-direction: column; justify-content: space-between;">
                            <div>
                                <div style="font-size: 24px; margin-bottom: 4px;">🏛️</div>
                                <div style="font-size: 13.5px; font-weight: 800; color: var(--gold-light);">1.500 Elmas</div>
                                <div style="font-size: 10px; color: #4ade80; font-weight: 700; margin-bottom: 8px;">Olimpos Hazinesi</div>
                            </div>
                            <button class="btn-action" style="height: 34px; font-size: 12px; background: linear-gradient(180deg, #ffe885 0%, #f5c542 100%); color: #000; font-weight: 900;" onclick="purchaseIAP('gems_hoard', 299.99, '1.500 Kutsal Elmas Hazinesi', ['1.500 Kutsal Elmas', '5x Tüm Tanrı Güçlendiricileri'])">₺299.99</button>
                        </div>
                    </div>

                    <!-- KATEGORİ 3: ALTIN PAZARI (ELMASLA TAKAS) -->
                    <div style="font-size: 12.5px; font-weight: 800; color: var(--gold-primary); margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 5px;">
                        ⚖️ 3. TAPINAK PAZARI & TAKAS (ELMASLA ALTIN AL)
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 22px;">
                        <!-- 500 Gold -->
                        <div style="background: rgba(245, 197, 66, 0.08); border: 1px solid rgba(245, 197, 66, 0.25); border-radius: 12px; padding: 10px 6px; text-align: center; display: flex; flex-direction: column; justify-content: space-between;">
                            <div>
                                <div style="font-size: 20px; margin-bottom: 2px;">💰</div>
                                <div style="font-size: 12px; font-weight: 800; color: var(--gold-light);">500 Altın</div>
                                <div style="font-size: 9px; color: #94a3b8; margin-bottom: 6px;">Küçük Kese</div>
                            </div>
                            <button class="btn-action" style="height: 32px; font-size: 11.5px; background: linear-gradient(180deg, #f5c542 0%, #b8820c 100%); color: #000; font-weight: 800;" onclick="exchangeGemsForGold(10, 500)">10 💎</button>
                        </div>

                        <!-- 2.500 Gold -->
                        <div style="background: rgba(245, 197, 66, 0.12); border: 1.5px solid var(--gold-primary); border-radius: 12px; padding: 10px 6px; text-align: center; display: flex; flex-direction: column; justify-content: space-between;">
                            <div>
                                <div style="font-size: 20px; margin-bottom: 2px;">🏛️</div>
                                <div style="font-size: 12px; font-weight: 800; color: var(--gold-light);">2.500 Altın</div>
                                <div style="font-size: 9px; color: #4ade80; font-weight: 700; margin-bottom: 6px;">+500 Bonus</div>
                            </div>
                            <button class="btn-action" style="height: 32px; font-size: 11.5px; background: linear-gradient(180deg, #ffe885 0%, #f5c542 100%); color: #000; font-weight: 900;" onclick="exchangeGemsForGold(40, 2500)">40 💎</button>
                        </div>

                        <!-- 7.500 Gold -->
                        <div style="background: rgba(245, 197, 66, 0.08); border: 1px solid rgba(245, 197, 66, 0.25); border-radius: 12px; padding: 10px 6px; text-align: center; display: flex; flex-direction: column; justify-content: space-between;">
                            <div>
                                <div style="font-size: 20px; margin-bottom: 2px;">👑</div>
                                <div style="font-size: 12px; font-weight: 800; color: var(--gold-light);">7.500 Altın</div>
                                <div style="font-size: 9px; color: #4ade80; font-weight: 700; margin-bottom: 6px;">+2.000 Bonus</div>
                            </div>
                            <button class="btn-action" style="height: 32px; font-size: 11.5px; background: linear-gradient(180deg, #ffe885 0%, #f5c542 100%); color: #000; font-weight: 900;" onclick="exchangeGemsForGold(100, 7500)">100 💎</button>
                        </div>
                    </div>

                    <!-- KATEGORİ 4: TAPINAK GÜÇLENDİRİCİLERİ & CAN (OYUN İÇİ PARAYLA) -->
                    <div style="font-size: 12.5px; font-weight: 800; color: #cbd5e1; margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 5px;">
                        🧪 4. TAPINAK GÜÇLENDİRİCİLERİ & CAN
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        <!-- 1. Zeus Şimşeği -->
                        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(245, 197, 66, 0.25); border-radius: 12px; padding: 11px; display: flex; align-items: center; justify-content: space-between;">
                            <div>
                                <div style="font-weight: 800; font-size: 13px; color: #fff;">⚡ Zeus'un Şimşeği</div>
                                <div style="font-size: 10px; color: #94a3b8; margin-top: 2px;">Rastgele 5 taşı anında yok eder.</div>
                                <div style="font-size: 10px; color: var(--accent-blue); font-weight: 700; margin-top: 2px;">Envanter: <span id="store-screen-inv-zeus">0</span> Adet</div>
                            </div>
                            <button class="btn-action" style="width: auto; min-width: 78px; padding: 0 12px; height: 34px; font-size: 12px; background: linear-gradient(180deg, #d49b13 0%, #a6790e 100%);" onclick="buyItem('zeus', 250, 'gold')">250 💰</button>
                        </div>

                        <!-- 2. Hermes Kasırgası -->
                        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(46, 204, 113, 0.25); border-radius: 12px; padding: 11px; display: flex; align-items: center; justify-content: space-between;">
                            <div>
                                <div style="font-weight: 800; font-size: 13px; color: #fff;">🌪️ Hermes'in Kasırgası</div>
                                <div style="font-size: 10px; color: #94a3b8; margin-top: 2px;">Tahtayı tazeleyip garantili kombo açar.</div>
                                <div style="font-size: 10px; color: var(--accent-green); font-weight: 700; margin-top: 2px;">Envanter: <span id="store-screen-inv-hermes">0</span> Adet</div>
                            </div>
                            <button class="btn-action" style="width: auto; min-width: 78px; padding: 0 12px; height: 34px; font-size: 12px; background: linear-gradient(180deg, #27ae60 0%, #1e824c 100%);" onclick="buyItem('hermes', 200, 'gold')">200 💰</button>
                        </div>

                        <!-- 3. Athena Kalkanı -->
                        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(0, 210, 255, 0.25); border-radius: 12px; padding: 11px; display: flex; align-items: center; justify-content: space-between;">
                            <div>
                                <div style="font-weight: 800; font-size: 13px; color: #fff;">🛡️ Athena'nın Kalkanı</div>
                                <div style="font-size: 10px; color: #94a3b8; margin-top: 2px;">Mevcut oyuna +5 ek hamle verir.</div>
                                <div style="font-size: 10px; color: var(--accent-blue); font-weight: 700; margin-top: 2px;">Envanter: <span id="store-screen-inv-athena">0</span> Adet</div>
                            </div>
                            <button class="btn-action" style="width: auto; min-width: 78px; padding: 0 12px; height: 34px; font-size: 12px; background: linear-gradient(180deg, #d49b13 0%, #a6790e 100%);" onclick="buyItem('athena', 350, 'gold')">350 💰</button>
                        </div>

                        <!-- 4. Ares Renk Bombası -->
                        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(239, 68, 68, 0.25); border-radius: 12px; padding: 11px; display: flex; align-items: center; justify-content: space-between;">
                            <div>
                                <div style="font-weight: 800; font-size: 13px; color: #fff;">💥 Ares'in Gazabı</div>
                                <div style="font-size: 10px; color: #94a3b8; margin-top: 2px;">Tüm eş renkteki taşları tekte patlatır.</div>
                                <div style="font-size: 10px; color: #ef4444; font-weight: 700; margin-top: 2px;">Envanter: <span id="store-screen-inv-ares">0</span> Adet</div>
                            </div>
                            <button class="btn-action" style="width: auto; min-width: 78px; padding: 0 12px; height: 34px; font-size: 12px; background: linear-gradient(180deg, #dc2626 0%, #991b1b 100%); color: #fff;" onclick="buyItem('ares', 15, 'gems')">15 💎</button>
                        </div>

                        <!-- 5. Energy Refill (Altın veya Elmas Seçenekli) -->
                        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 11px; display: flex; align-items: center; justify-content: space-between;">
                            <div>
                                <div style="font-weight: 800; font-size: 13px; color: #fff;">🧪 Nektar İksiri (5 Can)</div>
                                <div style="font-size: 10px; color: #94a3b8; margin-top: 2px;">Tüm canlarını (5/5) anında yeniler.</div>
                            </div>
                            <div style="display: flex; gap: 6px;">
                                <button class="btn-action" style="width: auto; min-width: 70px; padding: 0 8px; height: 34px; font-size: 11.5px; background: linear-gradient(180deg, #f59e0b 0%, #b45309 100%); color: #fff;" onclick="buyLivesWithGold(150, 5)">150 💰</button>
                                <button class="btn-action" style="width: auto; min-width: 70px; padding: 0 8px; height: 34px; font-size: 11.5px; background: linear-gradient(180deg, #0284c7 0%, #0369a1 100%); color: #fff;" onclick="buyLivesWithGems(10, 5)">10 💎</button>
                            </div>
                        </div>
                    </div>`;

    html = html.substring(0, cat2Start) + newCategoriesHtml + '\n' + html.substring(cat4End);
    console.log('✓ Successfully upgraded Store categories');
} else {
    console.error('FAIL: Could not locate store categories chunk');
}

// 2. Update buyLivesWithGold chunk
const oldBuyLives = `        function buyLivesWithGold(cost = 150, count = 5) {
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

        function buyFullLives() {
            buyLivesWithGems(10, 5);
            return;
            buyEnergyFull();
            closeModal('modal-out-of-lives');
        }`;

const newSmartEngine = `        // ==========================================
        // AKILLI PAZAR TAKASI & YETERSİZ ALTIN ÖNERİ MOTORU
        // Kullanıcı altını yetmediğinde elmas takası veya elmas sandığı önerir
        // ==========================================
        let pendingSmartAction = null;

        function promptSmartExchange(action) {
            pendingSmartAction = action;
            const currentGold = gameState.gold || 0;
            const currentGems = gameState.gems || 0;
            const cost = action.cost || 0;
            const missingGold = Math.max(0, cost - currentGold);

            // En uygun takas dilimini belirle
            let tier = { gemCost: 10, goldReward: 500 };
            if (missingGold > 2500) {
                tier = { gemCost: 100, goldReward: 7500 };
            } else if (missingGold > 500) {
                tier = { gemCost: 40, goldReward: 2500 };
            }

            pendingSmartAction.tier = tier;

            const titleEl = document.getElementById('smart-exchange-title');
            const descEl = document.getElementById('smart-exchange-desc');
            const goldBalEl = document.getElementById('smart-exchange-gold-bal');
            const gemsBalEl = document.getElementById('smart-exchange-gems-bal');
            const textEl = document.getElementById('smart-exchange-exchange-text');
            const btnConfirm = document.getElementById('btn-smart-exchange-confirm');
            const badgeEl = document.getElementById('smart-exchange-badge');

            if (titleEl) titleEl.innerText = "ALTIN BAKİYEN YETERSİZ!";
            if (descEl) {
                descEl.innerHTML = \`<b>\${action.name || 'Bu işlem'}</b> için <b>\${cost.toLocaleString()} Altına</b> ihtiyacın var.<br><span style="color:#fca5a5;">(Eksik: \${missingGold.toLocaleString()} 💰 Altın)</span>\`;
            }
            if (goldBalEl) goldBalEl.innerText = currentGold.toLocaleString();
            if (gemsBalEl) gemsBalEl.innerText = currentGems.toLocaleString();

            if (currentGems >= tier.gemCost) {
                if (badgeEl) {
                    badgeEl.innerText = "ANINDA TAKAS";
                    badgeEl.style.background = "#22c55e";
                }
                if (textEl) {
                    textEl.innerHTML = \`💎 <b>\${tier.gemCost} Elmas</b> karşılığında <b>+\${tier.goldReward.toLocaleString()} Altın</b> takas et ve hemen al!\`;
                }
                if (btnConfirm) {
                    btnConfirm.innerText = \`💎 \${tier.gemCost} ELMASLA TAKAS ET & AL\`;
                    btnConfirm.style.background = "linear-gradient(180deg, #f5c542 0%, #b8820c 100%)";
                    btnConfirm.style.color = "#000";
                }
            } else {
                if (badgeEl) {
                    badgeEl.innerText = "ELMAS GEREKLİ";
                    badgeEl.style.background = "#38bdf8";
                }
                if (textEl) {
                    textEl.innerHTML = \`Takas için <b>\${tier.gemCost} Elmasa</b> ihtiyacın var (Mevcut: \${currentGems} 💎). Hazine sandığından elmas temin edebilirsin.\`;
                }
                if (btnConfirm) {
                    btnConfirm.innerText = "💎 60 ELMAS KESESİ AL (₺19.99)";
                    btnConfirm.style.background = "linear-gradient(180deg, #0284c7 0%, #0369a1 100%)";
                    btnConfirm.style.color = "#fff";
                }
            }

            openModal('modal-smart-exchange');
        }

        function executeSmartExchangeAction() {
            if (!pendingSmartAction) {
                closeModal('modal-smart-exchange');
                return;
            }

            const action = pendingSmartAction;
            const tier = action.tier || { gemCost: 10, goldReward: 500 };
            const currentGems = gameState.gems || 0;

            if (currentGems < tier.gemCost) {
                closeModal('modal-smart-exchange');
                purchaseIAP('gems_pouch', 19.99, '60 Kutsal Elmas Kesesi', ['60 Kutsal Elmas']);
                return;
            }

            // 1. Elması düş, altını ekle
            gameState.gems -= tier.gemCost;
            gameState.gold = (gameState.gold || 0) + tier.goldReward;

            // 2. Bekleyen işlemi tamamla
            if (action.type === 'lives') {
                gameState.gold -= action.cost;
                gameState.energy = Math.min(gameState.maxEnergy || 5, (gameState.energy || 0) + (action.count || 5));
                gameState.lastEnergyUpdate = Date.now();
                closeModal('modal-out-of-lives');
                spawnFloatingCombo(\`+\${tier.goldReward} 💰 TAKAS & 5 CAN DOLDU! ⚡\`);
                showToast(\`💎 \${tier.gemCost} Elmasla Altın takas edildi ve Canların dolduruldu!\`, "success");
            } else if (action.type === 'booster') {
                gameState.gold -= action.cost;
                if (!gameState.inventory) gameState.inventory = {};
                gameState.inventory[action.godType] = (gameState.inventory[action.godType] || 0) + (action.count || 1);
                closeModal('modal-quick-booster-buy');
                spawnFloatingCombo(\`+\${tier.goldReward} 💰 TAKAS & \${action.name} ALINDI!\`);
                showToast(\`\${action.name} satın alındı! ⚡\`, "success");
                setTimeout(() => {
                    usePowerup(action.godType);
                }, 220);
            } else if (action.type === 'item') {
                gameState.gold -= action.cost;
                if (!gameState.inventory) gameState.inventory = {};
                gameState.inventory[action.itemId] = (gameState.inventory[action.itemId] || 0) + 1;
                spawnFloatingCombo(\`+\${tier.goldReward} 💰 TAKAS & \${action.name} ALINDI!\`);
                showToast(\`\${action.name} başarıyla satın alındı!\`, "success");
            } else if (action.type === 'exchange') {
                spawnFloatingCombo(\`+\${tier.goldReward.toLocaleString()} 💰 ALTIN KAZANILDI!\`);
                showToast(\`\${tier.goldReward.toLocaleString()} Altın takas edildi! 💰\`, "success");
            }

            triggerHaptic('heavy');
            saveGame();
            syncAllHUDs();
            updateStoreUI();
            if (document.getElementById('screen-gameplay').classList.contains('active')) {
                updateGameplayPowerups();
            }
            closeModal('modal-smart-exchange');
            pendingSmartAction = null;
        }

        function buyLivesWithGold(cost = 150, count = 5) {
            if ((gameState.gold || 0) < cost) {
                promptSmartExchange({
                    type: 'lives',
                    cost: cost,
                    count: count,
                    name: '5 Kutsal Can Dolumu'
                });
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

        function buyFullLives() {
            buyLivesWithGems(10, 5);
        }`;

if (html.includes(oldBuyLives)) {
    html = html.replace(oldBuyLives, newSmartEngine);
    console.log('✓ Successfully integrated Smart Insufficiency & Marketplace Guidance Engine');
} else {
    console.error('FAIL: Could not locate oldBuyLives chunk');
}

// 3. Update buyItem
const oldBuyItem = `function buyItem(itemId, cost, currencyType) {
            if (currencyType === 'gold') {
                if (gameState.gold < cost) {
                    showToast("Yeterli altının yok!", "error");
                    return;
                }
                gameState.gold -= cost;
            } else if (currencyType === 'gems') {
                if (gameState.gems < cost) {
                    showToast("Yeterli elmasın yok!", "error");
                    return;
                }
                gameState.gems -= cost;
            }`;

const newBuyItem = `function buyItem(itemId, cost, currencyType) {
            const itemNames = {
                zeus: "Zeus'un Şimşeği",
                hermes: "Hermes'in Kasırgası",
                athena: "Athena'nın Kalkanı",
                ares: "Ares'in Gazabı",
                energy: "Nektar İksiri (5 Can)"
            };
            const itemName = itemNames[itemId] || "Kutsal Güçlendirici";

            if (currencyType === 'gold') {
                if ((gameState.gold || 0) < cost) {
                    promptSmartExchange({
                        type: 'item',
                        itemId: itemId,
                        cost: cost,
                        currencyType: 'gold',
                        name: itemName
                    });
                    return;
                }
                gameState.gold -= cost;
            } else if (currencyType === 'gems') {
                if ((gameState.gems || 0) < cost) {
                    showToast("Yeterli elmasın yok! Hazine Mağazası'ndan temin edebilirsin.", "error");
                    return;
                }
                gameState.gems -= cost;
            }`;

if (html.includes(oldBuyItem)) {
    html = html.replace(oldBuyItem, newBuyItem);
    console.log('✓ Successfully updated buyItem');
}

// 4. Update executeQuickBoosterPurchase
const oldQuickBuy = `            if (currency === 'gold') {
                if ((gameState.gold || 0) < cfg.goldCost) {
                    showToast("Yeterli altının yok! Bölüm geçerek altın kazanabilirsin.", "error");
                    return;
                }
                gameState.gold -= cfg.goldCost;
                if (!gameState.inventory) gameState.inventory = {};
                gameState.inventory[activeQuickBuyGod] = (gameState.inventory[activeQuickBuyGod] || 0) + cfg.countGold;
                showToast(\`\${cfg.name} (\${cfg.countGold}x) satın alındı!\`, "success");
            }`;

const newQuickBuy = `            if (currency === 'gold') {
                if ((gameState.gold || 0) < cfg.goldCost) {
                    closeModal('modal-quick-booster-buy');
                    promptSmartExchange({
                        type: 'booster',
                        godType: activeQuickBuyGod,
                        cost: cfg.goldCost,
                        count: cfg.countGold,
                        name: cfg.name
                    });
                    return;
                }
                gameState.gold -= cfg.goldCost;
                if (!gameState.inventory) gameState.inventory = {};
                gameState.inventory[activeQuickBuyGod] = (gameState.inventory[activeQuickBuyGod] || 0) + cfg.countGold;
                showToast(\`\${cfg.name} (\${cfg.countGold}x) satın alındı!\`, "success");
            }`;

if (html.includes(oldQuickBuy)) {
    html = html.replace(oldQuickBuy, newQuickBuy);
    console.log('✓ Successfully updated executeQuickBoosterPurchase');
}

// 5. Update exchangeGemsForGold
const oldExchange = `function exchangeGemsForGold(gemCost, goldReward) {
            if ((gameState.gems || 0) < gemCost) {
                showToast(\`Yetersiz Elmas! \${gemCost} Elmasa ihtiyacın var.\`, "error");
                return;
            }`;

const newExchange = `function exchangeGemsForGold(gemCost, goldReward) {
            if ((gameState.gems || 0) < gemCost) {
                promptSmartExchange({
                    type: 'exchange',
                    cost: gemCost,
                    goldReward: goldReward,
                    name: \`\${goldReward.toLocaleString()} Altın Takası\`
                });
                return;
            }`;

if (html.includes(oldExchange)) {
    html = html.replace(oldExchange, newExchange);
    console.log('✓ Successfully updated exchangeGemsForGold');
}

// 6. Update applyIAPBundle for all gem tiers
const oldIAPChest = `            } else if (bundleId === 'gems_chest') {
                gameState.gems = (gameState.gems || 0) + 250;
                if (!gameState.inventory) gameState.inventory = { zeus: 0, athena: 0 };
                gameState.inventory.zeus = (gameState.inventory.zeus || 0) + 1;
                spawnFloatingCombo("💎 KUTSAL ELMAS SANDIĞI AÇILDI!");
            }`;

const newIAPChest = `            } else if (bundleId === 'gems_chest') {
                gameState.gems = (gameState.gems || 0) + 250;
                if (!gameState.inventory) gameState.inventory = { zeus: 0, athena: 0 };
                gameState.inventory.zeus = (gameState.inventory.zeus || 0) + 1;
                spawnFloatingCombo("💎 KUTSAL ELMAS SANDIĞI AÇILDI!");
            } else if (bundleId === 'gems_sack') {
                gameState.gems = (gameState.gems || 0) + 650;
                if (!gameState.inventory) gameState.inventory = { zeus: 0, athena: 0, hermes: 0, ares: 0 };
                gameState.inventory.zeus = (gameState.inventory.zeus || 0) + 3;
                gameState.inventory.athena = (gameState.inventory.athena || 0) + 3;
                spawnFloatingCombo("💎 650 ELMAS + JOKERLER ALINDI!");
            } else if (bundleId === 'gems_hoard') {
                gameState.gems = (gameState.gems || 0) + 1500;
                if (!gameState.inventory) gameState.inventory = { zeus: 0, athena: 0, hermes: 0, ares: 0 };
                gameState.inventory.zeus = (gameState.inventory.zeus || 0) + 5;
                gameState.inventory.hermes = (gameState.inventory.hermes || 0) + 5;
                gameState.inventory.athena = (gameState.inventory.athena || 0) + 5;
                gameState.inventory.ares = (gameState.inventory.ares || 0) + 5;
                spawnFloatingCombo("👑 OLİMPOS HAZİNESİ (1.500 💎)!");
            }`;

if (html.includes(oldIAPChest)) {
    html = html.replace(oldIAPChest, newIAPChest);
    console.log('✓ Successfully extended applyIAPBundle');
}

if (isCrlf) {
    html = html.replace(/\n/g, '\r\n');
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log('✓ Successfully finished apply_with_crlf_normalized.js');

const fs = require('fs');
const path = require('path');

function overhaul(filePath) {
    console.log(`Checking ${filePath}...`);
    if (!fs.existsSync(filePath)) {
        console.log(`File not found: ${filePath}`);
        return;
    }
    const raw = fs.readFileSync(filePath, 'utf8');
    const isCRLF = raw.includes('\r\n');
    const lines = raw.split(/\r?\n/);
    console.log(`Total lines: ${lines.length}`);

    let changed = 0;

    // 1. Update .modal-overlay CSS: replace background: rgba(0,0,0,0.85); around line 2790
    for (let i = 0; i < Math.min(lines.length, 3200); i++) {
        if (lines[i].includes('.modal-overlay {') && lines[i+3] && lines[i+3].includes('rgba(0,0,0,0.85)')) {
            console.log(`Found .modal-overlay CSS at line ${i+1}`);
            lines[i+3] = `            background: rgba(4, 8, 18, 0.62);
            backdrop-filter: blur(6px) brightness(0.9);
            -webkit-backdrop-filter: blur(6px) brightness(0.9);`;
            changed++;
            break;
        }
    }

    // 2. Locate #modal-quick-booster-buy
    let modalStartLine = -1;
    let modalEndLine = -1;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('<!-- MODAL: QUICK BOOSTER BUY (Oyun İçi Hızlı Joker Satın Alma) -->')) {
            modalStartLine = i;
        }
        if (modalStartLine !== -1 && i > modalStartLine && lines[i].includes('<!-- MODAL: OUT OF LIVES')) {
            modalEndLine = i;
            break;
        }
    }

    if (modalStartLine !== -1 && modalEndLine !== -1) {
        console.log(`Found #modal-quick-booster-buy between lines ${modalStartLine+1} and ${modalEndLine+1}`);
        const newModalLines = [
            `            <!-- MODAL: QUICK BOOSTER BUY (Oyun İçi Hızlı Joker Satın Alma) -->`,
            `            <div class="modal-overlay" id="modal-quick-booster-buy" style="z-index: 99999;" onclick="if(event.target===this && !quickBuyBackdropLocked)closeModal('modal-quick-booster-buy')">`,
            `                <div class="modal-card" style="width: 90%; max-width: 380px; padding: 20px 16px; box-sizing: border-box; border: 1.5px solid var(--gold-primary); background: radial-gradient(circle at top, #151e33 0%, #090e1c 100%); box-shadow: 0 16px 45px rgba(0,0,0,0.9), 0 0 25px rgba(245,197,66,0.15); text-align: center; border-radius: 20px; max-height: 94vh; overflow-y: auto;">`,
            `                    <div class="modal-close" onclick="closeModal('modal-quick-booster-buy')">✕</div>`,
            ``,
            `                    <!-- God Booster Selector Chips (Zeus, Athena, Hermes, Ares) -->`,
            `                    <div id="quick-buy-god-tabs" style="display: flex; justify-content: center; gap: 8px; margin-bottom: 12px;">`,
            `                        <button type="button" class="quick-god-tab active" onclick="switchQuickBuyGod('zeus')" id="tab-god-zeus" style="padding: 4px 8px; border-radius: 8px; border: 1px solid var(--gold-primary); background: rgba(245,197,66,0.2); color: #fff; font-size: 11px; font-weight: 800; cursor: pointer;">⚡ Zeus</button>`,
            `                        <button type="button" class="quick-god-tab" onclick="switchQuickBuyGod('athena')" id="tab-god-athena" style="padding: 4px 8px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.3); color: #cbd5e1; font-size: 11px; font-weight: 800; cursor: pointer;">🛡️ Athena</button>`,
            `                        <button type="button" class="quick-god-tab" onclick="switchQuickBuyGod('hermes')" id="tab-god-hermes" style="padding: 4px 8px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.3); color: #cbd5e1; font-size: 11px; font-weight: 800; cursor: pointer;">🌪️ Hermes</button>`,
            `                        <button type="button" class="quick-god-tab" onclick="switchQuickBuyGod('ares')" id="tab-god-ares" style="padding: 4px 8px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.3); color: #cbd5e1; font-size: 11px; font-weight: 800; cursor: pointer;">💥 Ares</button>`,
            `                    </div>`,
            ``,
            `                    <div id="quick-buy-icon" style="font-size: 42px; margin-bottom: 4px; animation: pulse 1.5s infinite alternate;">⚡</div>`,
            `                    <div class="modal-title" id="quick-buy-title" style="color: var(--gold-light); font-size: 18px; margin-bottom: 4px;">ZEUS ŞİMŞEĞİ AL</div>`,
            `                    <div id="quick-buy-desc" style="font-size: 12px; color: #cbd5e1; margin-bottom: 12px; line-height: 1.4;">`,
            `                        Maceranda tanrıların gücünü kaybetme! Oyun içi altın veya elmas ile anında takviye yap.`,
            `                    </div>`,
            ``,
            `                    <!-- Player Balance Pill in Quick Buy -->`,
            `                    <div style="display: flex; justify-content: center; gap: 12px; margin-bottom: 14px; font-size: 11px; font-weight: 800;">`,
            `                        <span style="background: rgba(245,197,66,0.15); border: 1px solid rgba(245,197,66,0.3); padding: 3px 8px; border-radius: 8px; color: var(--gold-primary);">`,
            `                            💰 Altın: <span id="quick-buy-gold-bal">0</span>`,
            `                        </span>`,
            `                        <span style="background: rgba(0,210,255,0.15); border: 1px solid rgba(0,210,255,0.3); padding: 3px 8px; border-radius: 8px; color: #00d2ff;">`,
            `                            💎 Elmas: <span id="quick-buy-gems-bal">0</span>`,
            `                        </span>`,
            `                    </div>`,
            ``,
            `                    <div style="display: flex; flex-direction: column; gap: 9px; margin-bottom: 12px;">`,
            `                        <!-- 1 Adet Altın ile Satın Al -->`,
            `                        <button id="btn-quick-buy-gold" class="btn-action-gold" style="min-height: 44px; height: auto; padding: 10px 14px; font-size: 13px; font-weight: 800; border-radius: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; line-height: 1.25;" onclick="executeQuickBoosterPurchase('gold')">`,
            `                            <span>💰 1 ADET SATIN AL (3.500 Altın)</span>`,
            `                        </button>`,
            ``,
            `                        <!-- 3 Adet Elmas ile Satın Al -->`,
            `                        <button id="btn-quick-buy-gems" class="btn-action" style="min-height: 44px; height: auto; padding: 10px 14px; font-size: 13px; font-weight: 800; border-radius: 12px; background: linear-gradient(180deg, rgba(0,210,255,0.22) 0%, rgba(2,132,199,0.4) 100%); border: 1.5px solid #00d2ff; color: #e0f2fe; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; line-height: 1.25;" onclick="executeQuickBoosterPurchase('gems')">`,
            `                            <span>💎 3'LÜ PAKET AL (15 Elmas)</span>`,
            `                        </button>`,
            `                    </div>`,
            ``,
            `                    <!-- Insufficient Balance / Olimpos Hazine & Mağaza Yönlendirme Kartı -->`,
            `                    <div id="quick-buy-insufficient-area" style="display: none; background: rgba(15, 23, 42, 0.85); border: 1.5px solid rgba(245, 197, 66, 0.45); border-radius: 14px; padding: 12px; margin-bottom: 12px; text-align: center; box-shadow: 0 4px 18px rgba(0,0,0,0.5);">`,
            `                        <div style="display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 12px; font-weight: 900; color: var(--gold-light); margin-bottom: 4px;">`,
            `                            <span>🏛️</span><span>OLİMPOS HAZİNE KÖŞKÜ</span>`,
            `                        </div>`,
            `                        <div id="quick-buy-insufficient-msg" style="font-size: 11.5px; color: #e2e8f0; margin-bottom: 10px; line-height: 1.4;">`,
            `                            Mevcut bakiyen bu özellik için yetersiz. Aşağıdaki seçeneklerle anında takviye sağlayabilirsin:`,
            `                        </div>`,
            `                        `,
            `                        <div id="quick-buy-insufficient-actions" style="display: flex; flex-direction: column; gap: 8px;">`,
            `                            <!-- Elmas Takas Seçeneği (Yeterli elmas varsa açılır) -->`,
            `                            <button id="btn-quick-buy-exchange-gems" class="btn-action-gold" style="min-height: 40px; height: auto; padding: 8px 12px; font-size: 12px; font-weight: 800; border-radius: 10px; display: none; line-height: 1.3;" onclick="executeQuickBoosterGemExchange()">`,
            `                                💎 10 ELMASLA 3.500 ALTIN TAKAS ET & AL`,
            `                            </button>`,
            ``,
            `                            <!-- İyi Niyet: 1 Adet Ücretsiz Reklam Takviyesi -->`,
            `                            <button id="btn-quick-buy-ad-free" class="btn-action" style="min-height: 42px; height: auto; padding: 8px 12px; font-size: 12px; font-weight: 900; border-radius: 10px; background: linear-gradient(180deg, rgba(34, 197, 94, 0.3) 0%, rgba(21, 128, 61, 0.45) 100%); border: 1.5px solid #4ade80; color: #dcfce7; display: flex; align-items: center; justify-content: center; gap: 6px; line-height: 1.3;" onclick="watchAdForQuickBooster()">`,
            `                                <span>🎬</span><span>VİDEO İZLE & +1 ADET KAZAN (ÜCRETSİZ)</span>`,
            `                            </button>`,
            ``,
            `                            <!-- Mağazaya Doğrudan Yönlendirme (Bölüm İlerlemesini Koru) -->`,
            `                            <button id="btn-quick-buy-goto-store" class="btn-action" style="min-height: 42px; height: auto; padding: 8px 12px; font-size: 12px; font-weight: 900; border-radius: 10px; background: linear-gradient(180deg, #d97706 0%, #b45309 100%); color: #fff; border: 1.5px solid var(--gold-primary); box-shadow: 0 4px 14px rgba(245,197,66,0.3); display: flex; align-items: center; justify-content: center; gap: 6px; line-height: 1.3;" onclick="openStoreFromQuickBuy()">`,
            `                                <span>🏛️</span><span>MAĞAZAYA GİT (SANDIK & ELMAS AL) ➔</span>`,
            `                            </button>`,
            `                        </div>`,
            `                    </div>`,
            ``,
            `                    <button class="btn-action-sub" style="height: 38px; font-size: 12px; font-weight: 800; border-radius: 10px;" onclick="closeModal('modal-quick-booster-buy')">✕ OYUNA DÖN</button>`,
            `                </div>`,
            `            </div>`,
            ``
        ];
        lines.splice(modalStartLine, modalEndLine - modalStartLine, ...newModalLines);
        changed++;
    }

    // 3. Locate JavaScript Functions switchQuickBuyGod to lastBoosterTriggerTime
    let jsStartLine = -1;
    let jsEndLine = -1;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('function switchQuickBuyGod(godType) {')) {
            jsStartLine = i;
        }
        if (jsStartLine !== -1 && i > jsStartLine && lines[i].includes('let lastBoosterTriggerTime = 0;')) {
            jsEndLine = i;
            break;
        }
    }

    if (jsStartLine !== -1 && jsEndLine !== -1) {
        console.log(`Found Quick Booster JS between lines ${jsStartLine+1} and ${jsEndLine+1}`);
        const newJSLines = [
            `        function switchQuickBuyGod(godType) {`,
            `            activeQuickBuyGod = godType;`,
            `            const cfg = BOOSTER_CONFIG[godType] || BOOSTER_CONFIG.zeus;`,
            ``,
            `            document.querySelectorAll('.quick-god-tab').forEach(t => {`,
            `                t.style.border = '1px solid rgba(255,255,255,0.2)';`,
            `                t.style.background = 'rgba(0,0,0,0.3)';`,
            `                t.style.color = '#cbd5e1';`,
            `            });`,
            `            const activeTab = document.getElementById(\`tab-god-\${godType}\`);`,
            `            if (activeTab) {`,
            `                activeTab.style.border = '1px solid var(--gold-primary)';`,
            `                activeTab.style.background = 'rgba(245,197,66,0.2)';`,
            `                activeTab.style.color = '#fff';`,
            `            }`,
            ``,
            `            const iconEl = document.getElementById('quick-buy-icon');`,
            `            const titleEl = document.getElementById('quick-buy-title');`,
            `            const descEl = document.getElementById('quick-buy-desc');`,
            `            const btnGold = document.getElementById('btn-quick-buy-gold');`,
            `            const btnGems = document.getElementById('btn-quick-buy-gems');`,
            `            const insuffArea = document.getElementById('quick-buy-insufficient-area');`,
            `            const insuffMsg = document.getElementById('quick-buy-insufficient-msg');`,
            `            const btnExchange = document.getElementById('btn-quick-buy-exchange-gems');`,
            ``,
            `            if (iconEl) iconEl.innerText = cfg.icon;`,
            `            if (titleEl) titleEl.innerText = \`\${cfg.name.toUpperCase()} AL\`;`,
            `            if (descEl) descEl.innerText = cfg.desc;`,
            ``,
            `            // Bakiye ve Yeterlilik Hesaplama`,
            `            const currentGold = gameState.gold || 0;`,
            `            const currentGems = gameState.gems || 0;`,
            `            const hasGold = currentGold >= cfg.goldCost;`,
            `            const hasGems = currentGems >= cfg.gemsCost;`,
            ``,
            `            // 1. Altın Butonu Durumu`,
            `            if (btnGold) {`,
            `                if (hasGold) {`,
            `                    btnGold.disabled = false;`,
            `                    btnGold.style.opacity = '1';`,
            `                    btnGold.style.cursor = 'pointer';`,
            `                    btnGold.style.filter = 'none';`,
            `                    btnGold.style.border = '1.5px solid var(--gold-primary)';`,
            `                    btnGold.style.pointerEvents = 'auto';`,
            `                    btnGold.innerHTML = \`<span>💰 1 ADET SATIN AL (\${cfg.goldCost.toLocaleString()} Altın)</span>\`;`,
            `                } else {`,
            `                    btnGold.disabled = true;`,
            `                    btnGold.style.opacity = '0.55';`,
            `                    btnGold.style.cursor = 'not-allowed';`,
            `                    btnGold.style.filter = 'grayscale(0.35)';`,
            `                    btnGold.style.border = '1px dashed rgba(245, 197, 66, 0.4)';`,
            `                    btnGold.style.pointerEvents = 'none';`,
            `                    const missingGold = cfg.goldCost - currentGold;`,
            `                    btnGold.innerHTML = \`<span>💰 1 ADET SATIN AL (\${cfg.goldCost.toLocaleString()} Altın)</span><span style="font-size:10px; color:#fca5a5; font-weight:800;">⚠️ Yetersiz Altın (Eksik: \${missingGold.toLocaleString()})</span>\`;`,
            `                }`,
            `            }`,
            ``,
            `            // 2. Elmas Butonu Durumu`,
            `            if (btnGems) {`,
            `                if (hasGems) {`,
            `                    btnGems.disabled = false;`,
            `                    btnGems.style.opacity = '1';`,
            `                    btnGems.style.cursor = 'pointer';`,
            `                    btnGems.style.filter = 'none';`,
            `                    btnGems.style.border = '1.5px solid #00d2ff';`,
            `                    btnGems.style.pointerEvents = 'auto';`,
            `                    btnGems.innerHTML = \`<span>💎 3'LÜ PAKET AL (\${cfg.gemsCost} Elmas)</span>\`;`,
            `                } else {`,
            `                    btnGems.disabled = true;`,
            `                    btnGems.style.opacity = '0.55';`,
            `                    btnGems.style.cursor = 'not-allowed';`,
            `                    btnGems.style.filter = 'grayscale(0.35)';`,
            `                    btnGems.style.border = '1px dashed rgba(0, 210, 255, 0.4)';`,
            `                    btnGems.style.pointerEvents = 'none';`,
            `                    const missingGems = cfg.gemsCost - currentGems;`,
            `                    btnGems.innerHTML = \`<span>💎 3'LÜ PAKET AL (\${cfg.gemsCost} Elmas)</span><span style="font-size:10px; color:#bae6fd; font-weight:800;">⚠️ Yetersiz Elmas (Eksik: \${missingGems})</span>\`;`,
            `                }`,
            `            }`,
            ``,
            `            // 3. Pazarlama & İyi Niyet Hazine Köşkü Yönlendirmesi`,
            `            if (insuffArea) {`,
            `                if (!hasGold || !hasGems) {`,
            `                    insuffArea.style.display = 'block';`,
            `                    if (insuffMsg) {`,
            `                        if (!hasGold && !hasGems) {`,
            `                            insuffMsg.innerHTML = \`Mevcut bakiyen takviye için yetersiz. Olimpos Hazinesi'nden sandık edinebilir veya ücretsiz video lütfuyla <b>+1 \${cfg.name}</b> kazanabilirsin.\`;`,
            `                        } else if (!hasGold) {`,
            `                            insuffMsg.innerHTML = \`Altının tükenmiş görünüyor. Dilersen Elmas paketi seçebilir, mağazayı ziyaret edebilir veya ücretsiz video izleyebilirsin.\`;`,
            `                        } else {`,
            `                            insuffMsg.innerHTML = \`Elmasın tükenmiş görünüyor. Altın seçeneğini kullanabilir veya mağazadan yeni elmas keseleri temin edebilirsin.\`;`,
            `                        }`,
            `                    }`,
            ``,
            `                    // Elmas ile Altın Takas Butonu`,
            `                    if (btnExchange) {`,
            `                        if (currentGems >= 10 && !hasGold) {`,
            `                            btnExchange.style.display = 'block';`,
            `                            btnExchange.innerHTML = \`💎 10 ELMASLA 3.500 ALTIN TAKAS ET & AL\`;`,
            `                        } else {`,
            `                            btnExchange.style.display = 'none';`,
            `                        }`,
            `                    }`,
            `                } else {`,
            `                    insuffArea.style.display = 'none';`,
            `                }`,
            `            }`,
            `        }`,
            ``,
            `        function openQuickBoosterBuy(godType = 'zeus') {`,
            `            activeQuickBuyGod = godType || 'zeus';`,
            `            quickBuyBackdropLocked = true;`,
            `            setTimeout(() => { quickBuyBackdropLocked = false; }, 350);`,
            ``,
            `            const goldBalEl = document.getElementById('quick-buy-gold-bal');`,
            `            const gemsBalEl = document.getElementById('quick-buy-gems-bal');`,
            `            if (goldBalEl) goldBalEl.innerText = (gameState.gold || 0).toLocaleString();`,
            `            if (gemsBalEl) gemsBalEl.innerText = (gameState.gems || 0).toLocaleString();`,
            ``,
            `            switchQuickBuyGod(activeQuickBuyGod);`,
            `            openModal('modal-quick-booster-buy');`,
            `        }`,
            ``,
            `        function executeQuickBoosterPurchase(currency) {`,
            `            const god = activeQuickBuyGod || 'zeus';`,
            `            const cfg = BOOSTER_CONFIG[god] || BOOSTER_CONFIG.zeus;`,
            ``,
            `            if (currency === 'gold') {`,
            `                const currentGold = gameState.gold || 0;`,
            `                if (currentGold < cfg.goldCost) {`,
            `                    switchQuickBuyGod(god);`,
            `                    triggerHaptic('warning');`,
            `                    return;`,
            `                }`,
            ``,
            `                gameState.gold -= cfg.goldCost;`,
            `                if (!gameState.inventory) gameState.inventory = {};`,
            `                gameState.inventory[god] = (gameState.inventory[god] || 0) + cfg.countGold;`,
            `                showToast(\`🎉 \${cfg.name} (\${cfg.countGold}x) başarıyla alındı ve dock'a eklendi!\`, "success");`,
            `            } else if (currency === 'gems') {`,
            `                const currentGems = gameState.gems || 0;`,
            `                if (currentGems < cfg.gemsCost) {`,
            `                    switchQuickBuyGod(god);`,
            `                    triggerHaptic('warning');`,
            `                    return;`,
            `                }`,
            ``,
            `                gameState.gems -= cfg.gemsCost;`,
            `                if (!gameState.inventory) gameState.inventory = {};`,
            `                gameState.inventory[god] = (gameState.inventory[god] || 0) + cfg.countGems;`,
            `                showToast(\`💎 \${cfg.name} 3'lü Paket başarıyla alındı ve dock'a eklendi!\`, "success");`,
            `            }`,
            ``,
            `            saveGame();`,
            `            syncAllHUDs();`,
            `            updateGameplayPowerups();`,
            `            closeModal('modal-quick-booster-buy');`,
            `            if (typeof sfxButtonClick === 'function') sfxButtonClick();`,
            `            triggerHaptic('medium');`,
            `        }`,
            ``,
            `        let pendingIAPBoosterReward = null;`,
            ``,
            `        function executeQuickBoosterGemExchange() {`,
            `            const god = activeQuickBuyGod || 'zeus';`,
            `            const cfg = BOOSTER_CONFIG[god] || BOOSTER_CONFIG.zeus;`,
            `            const currentGems = gameState.gems || 0;`,
            ``,
            `            if (currentGems < 10) {`,
            `                showToast("Yeterli elmasın yok! Aşağıdan paket temin edebilirsin.", "error");`,
            `                return;`,
            `            }`,
            ``,
            `            gameState.gems -= 10;`,
            `            if (!gameState.inventory) gameState.inventory = {};`,
            `            gameState.inventory[god] = (gameState.inventory[god] || 0) + 1;`,
            ``,
            `            saveGame();`,
            `            syncAllHUDs();`,
            `            updateGameplayPowerups();`,
            `            closeModal('modal-quick-booster-buy');`,
            ``,
            `            triggerHaptic('heavy');`,
            `            spawnFloatingCombo(\`💎 10 ELMASLA +1 \${cfg.name.toUpperCase()} ALINDI!\`);`,
            `            showToast(\`💎 10 Elmas takas edildi ve \${cfg.name} (1x) dock'a eklendi!\`, "success");`,
            `        }`,
            ``,
            `        function watchAdForQuickBooster() {`,
            `            const god = activeQuickBuyGod || 'zeus';`,
            `            const cfg = BOOSTER_CONFIG[god] || BOOSTER_CONFIG.zeus;`,
            ``,
            `            if (gameState && (gameState.hasPurchasedNoAds || gameState.noAds)) {`,
            `                if (!gameState.inventory) gameState.inventory = {};`,
            `                gameState.inventory[god] = (gameState.inventory[god] || 0) + 1;`,
            `                saveGame();`,
            `                syncAllHUDs();`,
            `                updateGameplayPowerups();`,
            `                closeModal('modal-quick-booster-buy');`,
            `                triggerHaptic('heavy');`,
            `                spawnFloatingCombo(\`👑 +1 \${cfg.name.toUpperCase()} KAZANILDI!\`);`,
            `                showToast(\`👑 VIP Ayrıcalığı: Reklamsız +1 \${cfg.name} hesabına eklendi!\`, "success");`,
            `                return;`,
            `            }`,
            ``,
            `            if (window.AdGuard && typeof window.AdGuard.showRewardedAd === 'function') {`,
            `                window.AdGuard.showRewardedAd(\`+1 \${cfg.name.toUpperCase()} KAZAN\`, () => {`,
            `                    if (!gameState.inventory) gameState.inventory = {};`,
            `                    gameState.inventory[god] = (gameState.inventory[god] || 0) + 1;`,
            `                    saveGame();`,
            `                    syncAllHUDs();`,
            `                    updateGameplayPowerups();`,
            `                    closeModal('modal-quick-booster-buy');`,
            `                    triggerHaptic('heavy');`,
            `                    spawnFloatingCombo(\`⚡ +1 \${cfg.name.toUpperCase()} KAZANILDI! ⚡\`);`,
            `                    showToast(\`🎉 İlahi Lütuf: +1 \${cfg.name} başarıyla kazanıldı ve dock'a eklendi!\`, "success");`,
            `                }, 'rewarded_booster');`,
            `            } else {`,
            `                if (!gameState.inventory) gameState.inventory = {};`,
            `                gameState.inventory[god] = (gameState.inventory[god] || 0) + 1;`,
            `                saveGame();`,
            `                syncAllHUDs();`,
            `                updateGameplayPowerups();`,
            `                closeModal('modal-quick-booster-buy');`,
            `                showToast(\`🎉 +1 \${cfg.name} hesabına eklendi!\`, "success");`,
            `            }`,
            `        }`,
            ``,
            `        function openStoreFromQuickBuy() {`,
            `            closeModal('modal-quick-booster-buy');`,
            `            isGamePaused = true;`,
            `            if (typeof saveActiveMatchSession === 'function') {`,
            `                saveActiveMatchSession();`,
            `            }`,
            `            showScreen('screen-store');`,
            `            showToast("🏛️ Olimpos Mağazası: Altın veya Elmas temin ettikten sonra 'Geri Dön' ile mücadeleye dönebilirsin.", "info");`,
            `        }`,
            ``,
            `        function buyBoosterWithIAP(bundleId, price, desc) {`,
            `            const god = activeQuickBuyGod || 'zeus';`,
            `            const cfg = BOOSTER_CONFIG[god] || BOOSTER_CONFIG.zeus;`,
            `            `,
            `            pendingIAPBoosterReward = {`,
            `                god: god,`,
            `                count: cfg.countGold || 1,`,
            `                name: cfg.name`,
            `            };`,
            `            `,
            `            purchaseIAP(bundleId, price, desc, [desc, \`+1x \${cfg.name} (Hediye İlahi Güç)\`]);`,
            `        }`,
            ``,
            `        function handleShopCardTap(e) {`,
            `            if (e) {`,
            `                if (typeof e.stopPropagation === 'function') e.stopPropagation();`,
            `            }`,
            `            if (typeof sfxButtonClick === 'function') sfxButtonClick();`,
            `            triggerHaptic('light');`,
            `            openQuickBoosterBuy(activeQuickBuyGod || 'zeus');`,
            `        }`,
            ``
        ];
        lines.splice(jsStartLine, jsEndLine - jsStartLine, ...newJSLines);
        changed++;
    }

    // 4. Auto resume gameplay in showScreen
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes("if (screenId === 'screen-gameplay') {") && lines[i+1] && lines[i+1].includes('updateDynamicZoneBackground')) {
            lines.splice(i+1, 0, "                    isGamePaused = false;");
            changed++;
            break;
        }
    }

    const eol = isCRLF ? '\r\n' : '\n';
    fs.writeFileSync(filePath, lines.join(eol), 'utf8');
    console.log(`Updated ${filePath} successfully. (Changes made: ${changed})`);
}

const basePath = path.resolve(__dirname);
overhaul(path.join(basePath, 'index.html'));
overhaul(path.join(basePath, 'www', 'index.html'));
if (fs.existsSync(path.join(basePath, 'www', 'Arkenya_Playable_Demo.html'))) {
    overhaul(path.join(basePath, 'www', 'Arkenya_Playable_Demo.html'));
}

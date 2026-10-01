const fs = require('fs');
const path = require('path');

console.log('=== APPLYING EXACT NORMALIZED STORE & MOBILE OVERHAUL ===');

const indexPath = path.join(__dirname, '..', 'www', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');
const isCrlf = html.includes('\r\n');
html = html.replace(/\r\n/g, '\n');

// 1. Check if smartEngineJs is already defined
if (!html.includes('function promptSmartExchange(')) {
    const oldBuyLivesChunk = `        function buyLivesWithGold(cost = 150, count = 5) {
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

    const newBuyLivesChunk = `        // ==========================================
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

    if (html.includes(oldBuyLivesChunk)) {
        html = html.replace(oldBuyLivesChunk, newBuyLivesChunk);
        console.log('✓ Successfully integrated Smart Insufficiency & Marketplace Guidance Engine');
    } else {
        console.error('FAIL: oldBuyLivesChunk still not found in normalized text');
    }
}

// 2. Update buyItem
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
    console.log('✓ Successfully updated buyItem to trigger promptSmartExchange');
}

// 3. Update executeQuickBoosterPurchase
const oldQuickBuyExec = `            if (currency === 'gold') {
                if ((gameState.gold || 0) < cfg.goldCost) {
                    showToast("Yeterli altının yok! Bölüm geçerek altın kazanabilirsin.", "error");
                    return;
                }
                gameState.gold -= cfg.goldCost;
                if (!gameState.inventory) gameState.inventory = {};
                gameState.inventory[activeQuickBuyGod] = (gameState.inventory[activeQuickBuyGod] || 0) + cfg.countGold;
                showToast(\`\${cfg.name} (\${cfg.countGold}x) satın alındı!\`, "success");
            }`;

const newQuickBuyExec = `            if (currency === 'gold') {
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

if (html.includes(oldQuickBuyExec)) {
    html = html.replace(oldQuickBuyExec, newQuickBuyExec);
    console.log('✓ Successfully updated executeQuickBoosterPurchase to trigger promptSmartExchange');
}

// 4. Update applyIAPBundle
const oldIAPBundleEnd = `            } else if (bundleId === 'gems_chest') {
                gameState.gems = (gameState.gems || 0) + 250;
                if (!gameState.inventory) gameState.inventory = { zeus: 0, athena: 0 };
                gameState.inventory.zeus = (gameState.inventory.zeus || 0) + 1;
                spawnFloatingCombo("💎 KUTSAL ELMAS SANDIĞI AÇILDI!");
            }`;

const newIAPBundleEnd = `            } else if (bundleId === 'gems_chest') {
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

if (html.includes(oldIAPBundleEnd)) {
    html = html.replace(oldIAPBundleEnd, newIAPBundleEnd);
    console.log('✓ Successfully extended applyIAPBundle for 650 and 1500 gem tiers');
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

// Convert back to CRLF if needed
if (isCrlf) {
    html = html.replace(/\n/g, '\r\n');
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log('✓ All changes written cleanly to www/index.html');

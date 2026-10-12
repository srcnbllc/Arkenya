const fs = require('fs');

const indexPath = 'www/index.html';
let content = fs.readFileSync(indexPath, 'utf8');

// 1. New Simplified Store HTML
const oldStoreRegex = /<!-- Thematic Subtitle Banner \(Sade & Zarif\) -->[\s\S]*?<!-- 5\. Energy Refill \(Altın veya Elmas Seçenekli\) -->[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;

const newStoreHtml = `<!-- Thematic Subtitle Banner & Early Level Guidance -->
                    <div id="store-early-level-guidance" style="background: rgba(56, 189, 248, 0.08); border: 1px solid rgba(56, 189, 248, 0.25); border-radius: 10px; padding: 8px 12px; margin-bottom: 14px; display: flex; align-items: center; gap: 8px;">
                        <span style="font-size: 16px;">🏛️</span>
                        <div style="font-size: 10.5px; color: #bae6fd; font-weight: 600; line-height: 1.3;">
                            Bölümleri tamamlayarak kazandığın <b>Altın</b> ve <b>Elmaslar</b> ile güçlendirici kuşanabilirsin.
                        </div>
                    </div>

                    <!-- ==========================================
                         KATEGORİ 1: TAPINAK GÜÇLENDİRİCİLERİ & CAN (OYUN İÇİ ALTIN İLE)
                         ========================================== -->
                    <div style="font-size: 12.5px; font-weight: 800; color: #cbd5e1; margin-bottom: 10px; border-bottom: 1.5px solid rgba(245, 197, 66, 0.3); padding-bottom: 5px; display: flex; align-items: center; justify-content: space-between;">
                        <span>🧪 1. GÜÇLENDİRİCİLER & CAN (ALTIN İLE)</span>
                        <span style="font-size: 10px; color: var(--gold-primary); font-weight: 700;">Temel Envanter</span>
                    </div>

                    <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 22px;">
                        <!-- 1. Zeus Şimşeği -->
                        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(245, 197, 66, 0.25); border-radius: 12px; padding: 11px; display: flex; align-items: center; justify-content: space-between;">
                            <div>
                                <div style="font-weight: 800; font-size: 13px; color: #fff;">⚡ Zeus'un Şimşeği</div>
                                <div style="font-size: 10px; color: #94a3b8; margin-top: 2px;">Rastgele 5 taşı anında yok eder.</div>
                                <div style="font-size: 10px; color: var(--accent-blue); font-weight: 700; margin-top: 2px;">Envanter: <span id="store-screen-inv-zeus">0</span> Adet</div>
                            </div>
                            <button class="btn-action" style="width: auto; min-width: 84px; padding: 0 12px; height: 34px; font-size: 12px; background: linear-gradient(180deg, #d49b13 0%, #a6790e 100%); font-weight: 800;" onclick="buyItem('zeus', 300, 'gold', 1)">300 💰</button>
                        </div>

                        <!-- 2. Hermes Kasırgası -->
                        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(46, 204, 113, 0.25); border-radius: 12px; padding: 11px; display: flex; align-items: center; justify-content: space-between;">
                            <div>
                                <div style="font-weight: 800; font-size: 13px; color: #fff;">🌪️ Hermes'in Kasırgası</div>
                                <div style="font-size: 10px; color: #94a3b8; margin-top: 2px;">Tahtayı tazeleyip garantili kombo açar.</div>
                                <div style="font-size: 10px; color: var(--accent-green); font-weight: 700; margin-top: 2px;">Envanter: <span id="store-screen-inv-hermes">0</span> Adet</div>
                            </div>
                            <button class="btn-action" style="width: auto; min-width: 84px; padding: 0 12px; height: 34px; font-size: 12px; background: linear-gradient(180deg, #27ae60 0%, #1e824c 100%); font-weight: 800;" onclick="buyItem('hermes', 250, 'gold', 1)">250 💰</button>
                        </div>

                        <!-- 3. Athena Kalkanı -->
                        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(0, 210, 255, 0.25); border-radius: 12px; padding: 11px; display: flex; align-items: center; justify-content: space-between;">
                            <div>
                                <div style="font-weight: 800; font-size: 13px; color: #fff;">🛡️ Athena'nın Kalkanı</div>
                                <div style="font-size: 10px; color: #94a3b8; margin-top: 2px;">Mevcut oyuna +5 ek hamle verir.</div>
                                <div style="font-size: 10px; color: var(--accent-blue); font-weight: 700; margin-top: 2px;">Envanter: <span id="store-screen-inv-athena">0</span> Adet</div>
                            </div>
                            <button class="btn-action" style="width: auto; min-width: 84px; padding: 0 12px; height: 34px; font-size: 12px; background: linear-gradient(180deg, #d49b13 0%, #a6790e 100%); font-weight: 800;" onclick="buyItem('athena', 350, 'gold', 1)">350 💰</button>
                        </div>

                        <!-- 4. Ares Renk Bombası -->
                        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(239, 68, 68, 0.25); border-radius: 12px; padding: 11px; display: flex; align-items: center; justify-content: space-between;">
                            <div>
                                <div style="font-weight: 800; font-size: 13px; color: #fff;">💥 Ares'in Gazabı (Süpernova)</div>
                                <div style="font-size: 10px; color: #94a3b8; margin-top: 2px;">Tüm eş renkteki taşları tekte patlatır.</div>
                                <div style="font-size: 10px; color: #ef4444; font-weight: 700; margin-top: 2px;">Envanter: <span id="store-screen-inv-ares">0</span> Adet</div>
                            </div>
                            <button class="btn-action" style="width: auto; min-width: 84px; padding: 0 12px; height: 34px; font-size: 12px; background: linear-gradient(180deg, #dc2626 0%, #991b1b 100%); color: #fff; font-weight: 800;" onclick="buyItem('ares', 450, 'gold', 1)">450 💰</button>
                        </div>

                        <!-- 5. Energy Refill -->
                        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 11px; display: flex; align-items: center; justify-content: space-between;">
                            <div>
                                <div style="font-weight: 800; font-size: 13px; color: #fff;">🧪 Nektar İksiri (5 Can)</div>
                                <div style="font-size: 10px; color: #94a3b8; margin-top: 2px;">Tüm canlarını (5/5) anında yeniler.</div>
                            </div>
                            <div style="display: flex; gap: 6px;">
                                <button class="btn-action" style="width: auto; min-width: 76px; padding: 0 8px; height: 34px; font-size: 11.5px; background: linear-gradient(180deg, #f59e0b 0%, #b45309 100%); color: #fff; font-weight: 800;" onclick="buyLivesWithGold(200, 5)">200 💰</button>
                                <button class="btn-action" style="width: auto; min-width: 66px; padding: 0 8px; height: 34px; font-size: 11.5px; background: linear-gradient(180deg, #0284c7 0%, #0369a1 100%); color: #fff; font-weight: 800;" onclick="buyLivesWithGems(4, 5)">4 💎</button>
                            </div>
                        </div>
                    </div>

                    <!-- ==========================================
                         KATEGORİ 2: KUTSAL ELMAS PAZARI (KAZANILAN ELMASLARLA)
                         ========================================== -->
                    <div style="font-size: 12.5px; font-weight: 800; color: var(--gold-primary); margin-bottom: 10px; border-bottom: 1.5px solid rgba(245, 197, 66, 0.3); padding-bottom: 5px; display: flex; align-items: center; justify-content: space-between;">
                        <span>💎 2. KUTSAL ELMAS PAZARI (ELMASLA TAKAS)</span>
                        <span style="font-size: 10px; color: #38bdf8; font-weight: 700;">Zafer Ödülleri</span>
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

                        <!-- 1.200 Gold -->
                        <div style="background: rgba(245, 197, 66, 0.12); border: 1.5px solid var(--gold-primary); border-radius: 12px; padding: 10px 6px; text-align: center; display: flex; flex-direction: column; justify-content: space-between;">
                            <div>
                                <div style="font-size: 20px; margin-bottom: 2px;">🏛️</div>
                                <div style="font-size: 12px; font-weight: 800; color: var(--gold-light);">1.200 Altın</div>
                                <div style="font-size: 9px; color: #4ade80; font-weight: 700; margin-bottom: 6px;">+200 Bonus</div>
                            </div>
                            <button class="btn-action" style="height: 32px; font-size: 11.5px; background: linear-gradient(180deg, #ffe885 0%, #f5c542 100%); color: #000; font-weight: 900;" onclick="exchangeGemsForGold(20, 1200)">20 💎</button>
                        </div>

                        <!-- Tanrılar Üçlüsü Paketi -->
                        <div style="background: rgba(168, 85, 247, 0.1); border: 1.5px solid #a855f7; border-radius: 12px; padding: 10px 6px; text-align: center; display: flex; flex-direction: column; justify-content: space-between;">
                            <div>
                                <div style="font-size: 20px; margin-bottom: 2px;">👑</div>
                                <div style="font-size: 12px; font-weight: 800; color: #e9d5ff;">Tanrılar Üçlüsü</div>
                                <div style="font-size: 9px; color: #cbd5e1; margin-bottom: 6px;">1x Şimşek, Kasırga, Kalkan</div>
                            </div>
                            <button class="btn-action" style="height: 32px; font-size: 11.5px; background: linear-gradient(180deg, #a855f7 0%, #7e22ce 100%); color: #fff; font-weight: 900;" onclick="buyItem('bundle_trio', 15, 'gems', 1)">15 💎</button>
                        </div>
                    </div>

                    <!-- ==========================================
                         KATEGORİ 3: ÖZEL AVANTAJLAR & PREMIUM (IAP / GERÇEK PARA)
                         ========================================== -->
                    <div style="font-size: 12.5px; font-weight: 800; color: var(--gold-light); margin-bottom: 10px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1.5px solid rgba(245, 197, 66, 0.3); padding-bottom: 5px;">
                        <span>⚡ 3. ÖZEL AVANTAJLAR & PREMIUM</span>
                        <button onclick="restorePurchases()" style="background: transparent; border: 1px solid rgba(255,255,255,0.2); color: #cbd5e1; font-size: 10px; padding: 2px 7px; border-radius: 6px; cursor: pointer;">Geri Yükle</button>
                    </div>

                    <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
                        <!-- STARTER BUNDLE -->
                        <div style="background: linear-gradient(135deg, rgba(245, 197, 66, 0.12) 0%, rgba(15, 22, 38, 0.95) 100%); border: 1.5px solid var(--gold-primary); border-radius: 12px; padding: 12px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 4px 15px rgba(0,0,0,0.4);">
                            <div style="flex: 1; padding-right: 10px;">
                                <div style="display: inline-block; background: rgba(245, 197, 66, 0.2); color: var(--gold-light); border: 1px solid var(--gold-primary); font-size: 8.5px; font-weight: 800; padding: 1px 5px; border-radius: 4px; margin-bottom: 3px;">ÖZEL TEKLİF</div>
                                <div style="font-weight: 800; font-size: 13.5px; color: var(--gold-primary);">⚡ Başlangıç Destek Paketi</div>
                                <div style="font-size: 11px; color: #cbd5e1; margin-top: 2px;">250 💎 + 2.500 💰 + 2x Şimşek + 2x Kalkan</div>
                                <div style="font-size: 10px; color: #4ade80; font-weight: 700; margin-top: 2px;">+ 2 Saat Sınırsız Can</div>
                            </div>
                            <button class="btn-action" style="width: auto; min-width: 78px; padding: 0 12px; height: 36px; font-size: 12.5px; font-weight: 800; background: linear-gradient(180deg, #ffe885 0%, #f5c542 100%); color: #000;" onclick="purchaseIAP('starter_bundle', 39.99, 'Başlangıç Destek Paketi', ['250 Kutsal Elmas', '2.500 Altın', '2x Zeus Şimşeği', '2x Athena Hamlesi', '2 Saat Sınırsız Can'])">₺39.99</button>
                        </div>

                        <!-- NO ADS PASS -->
                        <div style="background: linear-gradient(135deg, rgba(155, 89, 182, 0.12) 0%, rgba(15, 22, 38, 0.95) 100%); border: 1px solid rgba(155, 89, 182, 0.4); border-radius: 12px; padding: 12px; display: flex; align-items: center; justify-content: space-between;">
                            <div style="flex: 1; padding-right: 10px;">
                                <div style="font-weight: 800; font-size: 13.5px; color: #d8b4fe;">🚫 Reklamsız Macera Pass</div>
                                <div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">Kalıcı kesintisiz oyun deneyimi</div>
                                <div style="font-size: 10px; color: var(--gold-light); font-weight: 700; margin-top: 2px;">+50 💎 Elmas Hediye</div>
                            </div>
                            <button class="btn-action" style="width: auto; min-width: 78px; padding: 0 12px; height: 36px; font-size: 12.5px; font-weight: 800; background: linear-gradient(180deg, #a855f7 0%, #7e22ce 100%); color: #fff;" onclick="purchaseIAP('no_ads', 49.99, 'Reklamsız Macera Pass', ['Kalıcı Reklamsız Deneyim', '50 Kutsal Elmas'])">₺49.99</button>
                        </div>

                        <!-- GEMS CHEST -->
                        <div style="background: linear-gradient(135deg, rgba(14, 165, 233, 0.12) 0%, rgba(15, 22, 38, 0.95) 100%); border: 1px solid rgba(14, 165, 233, 0.4); border-radius: 12px; padding: 12px; display: flex; align-items: center; justify-content: space-between;">
                            <div style="flex: 1; padding-right: 10px;">
                                <div style="font-weight: 800; font-size: 13.5px; color: #7dd3fc;">💎 Kutsal Elmas Sandığı</div>
                                <div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">250 Kutsal Elmas + 1x Zeus Şimşeği</div>
                            </div>
                            <button class="btn-action" style="width: auto; min-width: 78px; padding: 0 12px; height: 36px; font-size: 12.5px; font-weight: 800; background: linear-gradient(180deg, #38bdf8 0%, #0284c7 100%); color: #000;" onclick="purchaseIAP('gems_chest', 69.99, '250 Kutsal Elmas Sandığı', ['250 Kutsal Elmas', '1x Zeus Şimşeği'])">₺69.99</button>
                        </div>
                    </div>
                </div>
            </div>`;

if (!oldStoreRegex.test(content)) {
    console.error("Could not find oldStoreRegex in index.html!");
    process.exit(1);
}

content = content.replace(oldStoreRegex, newStoreHtml);
console.log("Successfully replaced Store HTML with simplified, clean structure!");

// 2. Add 'bundle_trio' support to buyItem
const oldBuyItemStart = `function buyItem(itemId, cost, currencyType, count = 1) {
            const itemNames = {
                zeus: "Zeus'un Şimşeği",
                hermes: "Hermes'in Kasırgası",
                athena: "Athena'nın Kalkanı",
                ares: "Ares'in Gazabı",
                energy: "Nektar İksiri (5 Can)"
            };`;

const newBuyItemStart = `function buyItem(itemId, cost, currencyType, count = 1) {
            const itemNames = {
                zeus: "Zeus'un Şimşeği",
                hermes: "Hermes'in Kasırgası",
                athena: "Athena'nın Kalkanı",
                ares: "Ares'in Gazabı",
                energy: "Nektar İksiri (5 Can)",
                bundle_trio: "Tanrılar Üçlüsü Paketi"
            };`;

if (content.includes(oldBuyItemStart)) {
    content = content.replace(oldBuyItemStart, newBuyItemStart);
    console.log("Updated itemNames in buyItem!");
}

const oldBuyItemLogic = `if (itemId === 'energy') {
                if (gameState.energy >= gameState.maxEnergy) {
                    showToast("Canın zaten dolu!", "info");
                    // refund
                    if (currencyType === 'gold') gameState.gold += cost;
                    if (currencyType === 'gems') gameState.gems += cost;
                    return;
                }
                gameState.energy = gameState.maxEnergy;
                showToast("Can tamamen dolduruldu! ⚡", "success");
            } else {
                if (!gameState.inventory[itemId]) gameState.inventory[itemId] = 0;
                gameState.inventory[itemId] += count;
                showToast("Satın alma başarılı!", "success");
            }`;

const newBuyItemLogic = `if (itemId === 'energy') {
                if (gameState.energy >= gameState.maxEnergy) {
                    showToast("Canın zaten dolu!", "info");
                    // refund
                    if (currencyType === 'gold') gameState.gold += cost;
                    if (currencyType === 'gems') gameState.gems += cost;
                    return;
                }
                gameState.energy = gameState.maxEnergy;
                showToast("Can tamamen dolduruldu! ⚡", "success");
            } else if (itemId === 'bundle_trio') {
                if (!gameState.inventory) gameState.inventory = { zeus: 0, athena: 0, hermes: 0, ares: 0, energy: 0 };
                gameState.inventory.zeus = (gameState.inventory.zeus || 0) + 1;
                gameState.inventory.hermes = (gameState.inventory.hermes || 0) + 1;
                gameState.inventory.athena = (gameState.inventory.athena || 0) + 1;
                showToast("Tanrılar Üçlüsü Paketi hesabına eklendi! ⚡🌪️🛡️", "success");
            } else {
                if (!gameState.inventory) gameState.inventory = { zeus: 0, athena: 0, hermes: 0, ares: 0, energy: 0 };
                if (!gameState.inventory[itemId]) gameState.inventory[itemId] = 0;
                gameState.inventory[itemId] += count;
                showToast("Satın alma başarılı!", "success");
            }`;

if (content.includes(oldBuyItemLogic)) {
    content = content.replace(oldBuyItemLogic, newBuyItemLogic);
    console.log("Updated buyItem handling for bundle_trio!");
}

// 3. Update leftover moves bonus label in showVictory
const oldMovesLeftLabel = `movesLeftEl.innerText = movesLeftAtWin > 0 ? \`+\${movesLeftAtWin} Hamle (+\${(movesLeftAtWin * 500).toLocaleString()})\` : "Tam Zamanında";`;
const newMovesLeftLabel = `const movesBonusPerTurn = lvl <= 10 ? 100 : (lvl <= 25 ? 160 : 220);
                const totalMovesBonus = movesLeftAtWin * movesBonusPerTurn;
                movesLeftEl.innerText = movesLeftAtWin > 0 ? \`+\${movesLeftAtWin} Hamle (+\${totalMovesBonus.toLocaleString()})\` : "Tam Zamanında";`;

if (content.includes(oldMovesLeftLabel)) {
    content = content.replace(oldMovesLeftLabel, newMovesLeftLabel);
    console.log("Updated movesLeftEl formatting in showVictory!");
}

fs.writeFileSync(indexPath, content, 'utf8');
console.log("www/index.html successfully updated!");

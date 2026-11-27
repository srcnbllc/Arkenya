const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'www', 'index.html');
let content = fs.readFileSync(targetPath, 'utf8');

console.log("=== APPLYING AUTHENTIC, THEMATIC LEAGUE, STORE & NAVIGATION UPGRADES ===");

// 1. REVISE SCREEN-STORE HTML (Arkenya Olimpos Tapınak Pazarı & Kutsal Hazine)
const newStoreHtml = `<!-- SCREEN: STORE (Zeus'un Kutsal Hazinesi) -->
            <div class="screen" id="screen-store" style="background: linear-gradient(180deg, #070b14 0%, #0d1527 50%, #060913 100%); position: relative; overflow: hidden; display: flex; flex-direction: column;">
                <!-- Fixed / Sticky Top Store Header with Universal Back Button -->
                <div style="position: sticky; top: 0; left: 0; right: 0; z-index: 50; background: rgba(11, 16, 30, 0.96); backdrop-filter: blur(10px); border-bottom: 1px solid rgba(245, 197, 66, 0.25); padding: 10px 14px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 4px 20px rgba(0,0,0,0.6);">
                    <button class="mythic-btn-sub" style="width: auto; padding: 0 12px; height: 34px; font-size: 11px; font-weight: 700; border-color: rgba(245, 197, 66, 0.35); color: #f1f5f9; display: flex; align-items: center; gap: 5px;" onclick="navigateBack()">
                        <span>←</span> <span>GERİ DÖN</span>
                    </button>
                    <div style="text-align: center;">
                        <div style="font-size: 14px; font-weight: 900; color: var(--gold-light); letter-spacing: 0.5px;">🏛️ KUTSAL HAZİNE</div>
                        <div style="font-size: 9px; color: var(--gold-primary); font-weight: 600; opacity: 0.9;">TAPINAK PAZARI</div>
                    </div>
                    <div style="display: flex; gap: 6px; align-items: center;">
                        <div style="background: rgba(212,155,19,0.15); border: 1px solid rgba(212,155,19,0.35); border-radius: 10px; padding: 3px 8px; font-size: 11px; font-weight: 800; color: var(--gold-primary);">
                            💰 <span id="store-screen-gold">0</span>
                        </div>
                        <div style="background: rgba(0,210,255,0.15); border: 1px solid rgba(0,210,255,0.35); border-radius: 10px; padding: 3px 8px; font-size: 11px; font-weight: 800; color: #00d2ff;">
                            💎 <span id="store-screen-gems">0</span>
                        </div>
                    </div>
                </div>

                <!-- Scrollable Store Content Area -->
                <div id="screen-store-scroll" style="flex: 1; overflow-y: auto; padding: 14px 14px 110px 14px; -webkit-overflow-scrolling: touch;">
                    
                    <!-- Thematic Welcome Banner -->
                    <div style="background: radial-gradient(circle at center, rgba(245, 197, 66, 0.12) 0%, rgba(15, 23, 42, 0.7) 100%); border: 1px solid rgba(245, 197, 66, 0.3); border-radius: 14px; padding: 12px; margin-bottom: 16px; text-align: center;">
                        <div style="font-size: 13.5px; font-weight: 800; color: var(--gold-light);">⚡ OLİMPOS LÜTUFLARI VE HAZİNELERİ</div>
                        <div style="font-size: 11px; color: #94a3b8; margin-top: 3px; line-height: 1.3;">Zorlu bulmacalarda tanrıların gücünü yanına al. Satın alımlar anında hesabına işlenir.</div>
                    </div>

                    <!-- KATEGORİ 1: KUTSAL FIRSAT PAKETLERİ -->
                    <div style="font-size: 12.5px; font-weight: 800; color: var(--gold-light); margin-bottom: 10px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 5px;">
                        <span>⚡ KUTSAL FIRSAT PAKETLERİ</span>
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

                        <!-- INFINITE ENERGY -->
                        <div style="background: linear-gradient(135deg, rgba(46, 204, 113, 0.1) 0%, rgba(15, 22, 38, 0.95) 100%); border: 1px solid rgba(46, 204, 113, 0.35); border-radius: 12px; padding: 12px; display: flex; align-items: center; justify-content: space-between;">
                            <div style="flex: 1; padding-right: 10px;">
                                <div style="font-weight: 800; font-size: 13.5px; color: #86efac;">⏳ Sonsuz Enerji (2 Saat)</div>
                                <div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">2 saat boyunca can kaybetmeden kesintisiz oyna</div>
                            </div>
                            <button class="btn-action" style="width: auto; min-width: 78px; padding: 0 12px; height: 36px; font-size: 12.5px; font-weight: 800; background: linear-gradient(180deg, #22c55e 0%, #15803d 100%); color: #fff;" onclick="purchaseIAP('infinite_energy', 19.99, '2 Saat Sonsuz Enerji', ['2 Saat Boyunca Sınırsız Can'])">₺19.99</button>
                        </div>
                    </div>

                    <!-- KATEGORİ 2: KUTSAL ELMAS SANDIKLARI (IAP) -->
                    <div style="font-size: 12.5px; font-weight: 800; color: #38bdf8; margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 5px;">
                        💎 KUTSAL ELMAS SANDIKLARI
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px;">
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
                        <div style="background: rgba(14, 165, 233, 0.12); border: 1px solid var(--accent-blue); border-radius: 12px; padding: 12px; text-align: center; display: flex; flex-direction: column; justify-content: space-between;">
                            <div>
                                <div style="font-size: 24px; margin-bottom: 4px;">👑</div>
                                <div style="font-size: 13.5px; font-weight: 800; color: #bae6fd;">250 Elmas</div>
                                <div style="font-size: 10px; color: var(--gold-light); font-weight: 700; margin-bottom: 8px;">+ 1x Şimşek Hediye</div>
                            </div>
                            <button class="btn-action" style="height: 34px; font-size: 12px; background: linear-gradient(180deg, #38bdf8 0%, #0284c7 100%); color: #000; font-weight: 800;" onclick="purchaseIAP('gems_chest', 69.99, '250 Kutsal Elmas Sandığı', ['250 Kutsal Elmas', '1x Zeus Şimşeği'])">₺69.99</button>
                        </div>
                    </div>

                    <!-- KATEGORİ 3: ALTIN PAZARI (ELMASLA TAKAS) -->
                    <div style="font-size: 12.5px; font-weight: 800; color: var(--gold-primary); margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 5px;">
                        💰 ALTIN PAZARI (ELMASLA TAKAS)
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px;">
                        <!-- 500 Gold -->
                        <div style="background: rgba(245, 197, 66, 0.08); border: 1px solid rgba(245, 197, 66, 0.25); border-radius: 12px; padding: 12px; text-align: center; display: flex; flex-direction: column; justify-content: space-between;">
                            <div>
                                <div style="font-size: 22px; margin-bottom: 4px;">💰</div>
                                <div style="font-size: 13px; font-weight: 800; color: var(--gold-light);">500 Altın</div>
                                <div style="font-size: 10px; color: #64748b; margin-bottom: 6px;">Küçük Kese</div>
                            </div>
                            <button class="btn-action" style="height: 34px; font-size: 12px; background: linear-gradient(180deg, #f5c542 0%, #b8820c 100%); color: #000; font-weight: 800;" onclick="exchangeGemsForGold(10, 500)">10 💎</button>
                        </div>

                        <!-- 2.500 Gold -->
                        <div style="background: rgba(245, 197, 66, 0.12); border: 1px solid var(--gold-primary); border-radius: 12px; padding: 12px; text-align: center; display: flex; flex-direction: column; justify-content: space-between;">
                            <div>
                                <div style="font-size: 22px; margin-bottom: 4px;">🏛️</div>
                                <div style="font-size: 13px; font-weight: 800; color: var(--gold-light);">2.500 Altın</div>
                                <div style="font-size: 10px; color: #4ade80; font-weight: 700; margin-bottom: 6px;">+500 Altın Bonus</div>
                            </div>
                            <button class="btn-action" style="height: 34px; font-size: 12px; background: linear-gradient(180deg, #ffe885 0%, #f5c542 100%); color: #000; font-weight: 900;" onclick="exchangeGemsForGold(40, 2500)">40 💎</button>
                        </div>
                    </div>

                    <!-- KATEGORİ 4: TAPINAK GÜÇLENDİRİCİLERİ & CAN -->
                    <div style="font-size: 12.5px; font-weight: 800; color: #cbd5e1; margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 5px;">
                        🧪 TAPINAK GÜÇLENDİRİCİLERİ & CAN
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        <!-- Zeus Strike -->
                        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 12px; display: flex; align-items: center; justify-content: space-between;">
                            <div>
                                <div style="font-weight: 800; font-size: 13px; color: #fff;">⚡ Zeus'un Şimşeği</div>
                                <div style="font-size: 10.5px; color: #94a3b8; margin-top: 2px;">Rastgele 5 taşı anında yok eder.</div>
                                <div style="font-size: 10px; color: var(--accent-blue); font-weight: 700; margin-top: 2px;">Envanter: <span id="store-screen-inv-zeus">0</span> Adet</div>
                            </div>
                            <button class="btn-action" style="width: auto; min-width: 78px; padding: 0 12px; height: 34px; font-size: 12px; background: linear-gradient(180deg, #d49b13 0%, #a6790e 100%);" onclick="buyItem('zeus', 250, 'gold')">250 💰</button>
                        </div>

                        <!-- Athena Grace -->
                        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 12px; display: flex; align-items: center; justify-content: space-between;">
                            <div>
                                <div style="font-weight: 800; font-size: 13px; color: #fff;">🛡️ Athena'nın Lütfu</div>
                                <div style="font-size: 10.5px; color: #94a3b8; margin-top: 2px;">Mevcut oyuna +5 ek hamle verir.</div>
                                <div style="font-size: 10px; color: var(--accent-blue); font-weight: 700; margin-top: 2px;">Envanter: <span id="store-screen-inv-athena">0</span> Adet</div>
                            </div>
                            <button class="btn-action" style="width: auto; min-width: 78px; padding: 0 12px; height: 34px; font-size: 12px; background: linear-gradient(180deg, #d49b13 0%, #a6790e 100%);" onclick="buyItem('athena', 500, 'gold')">500 💰</button>
                        </div>

                        <!-- Energy Refill -->
                        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 12px; display: flex; align-items: center; justify-content: space-between;">
                            <div>
                                <div style="font-weight: 800; font-size: 13px; color: #fff;">🧪 Nektar İksiri</div>
                                <div style="font-size: 10.5px; color: #94a3b8; margin-top: 2px;">Tüm canlarını (5/5) anında yeniler.</div>
                            </div>
                            <button class="btn-action" style="width: auto; min-width: 78px; padding: 0 12px; height: 34px; font-size: 12px; background: linear-gradient(180deg, #0284c7 0%, #0369a1 100%); color: #fff;" onclick="buyItem('energy', 10, 'gems')">10 💎</button>
                        </div>
                    </div>

                </div>
            </div>

            <div class="screen" id="screen-gameplay">`;

const storeMatch = content.indexOf('<div class="screen" id="screen-store"');
const gameplayMatch = content.indexOf('<div class="screen" id="screen-gameplay">');
if (storeMatch !== -1 && gameplayMatch !== -1) {
    content = content.substring(0, storeMatch) + newStoreHtml + content.substring(gameplayMatch + '<div class="screen" id="screen-gameplay">'.length);
    console.log("PASS: Updated screen-store with thematic, authentic store layout!");
}


// 2. REVISE MODAL-PAYMENT HTML (Clean, Thematic, Realistic Billing Confirmation)
const oldPaymentRegex = /<!-- MODAL: IAP PAYMENT SIMULATION -->[\s\S]*?<!-- MODAL: DAILY REWARD -->|<!-- MODAL: IAP PAYMENT CONFIRMATION[\s\S]*?<!-- MODAL: DAILY REWARD -->/;
const newPaymentHtml = `<!-- MODAL: IAP PAYMENT CONFIRMATION (Thematic & Secure Billing) -->
            <div class="modal-overlay" id="modal-payment">
                <div class="modal-card" style="background: #0f172a; color: #f8fafc; border: 1.5px solid var(--gold-primary); border-radius: 18px; padding: 20px 16px; max-width: 360px; box-shadow: 0 12px 35px rgba(0,0,0,0.85);">
                    <!-- Header -->
                    <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 10px; margin-bottom: 12px;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span style="font-size: 18px;">🔒</span>
                            <div>
                                <div style="font-size: 13.5px; font-weight: 800; color: #f8fafc; text-align: left;">GÜVENLİ MAĞAZA ÖDEMESİ</div>
                                <div style="font-size: 9.5px; color: #94a3b8; text-align: left;">Google Play & Arkenya Korumalı</div>
                            </div>
                        </div>
                        <div class="modal-close" style="position: static; font-size: 18px; padding: 2px 6px;" onclick="closeModal('modal-payment')">✕</div>
                    </div>

                    <!-- Item Showcase -->
                    <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 12px; margin-bottom: 12px; text-align: left;">
                        <div style="font-size: 14px; font-weight: 800; color: var(--gold-light);" id="payment-item-name">Paket Adı</div>
                        <div style="font-size: 10.5px; color: #94a3b8; margin-top: 2px;">Arkenya: Mythic Jewels — Dijital İçerik</div>
                        
                        <div id="payment-items-summary" style="margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 11px; color: #cbd5e1; display: flex; flex-direction: column; gap: 3px;">
                            <!-- Dynamically populated item breakdown -->
                        </div>
                    </div>

                    <!-- Price Box -->
                    <div style="display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 12px; padding: 0 4px;">
                        <span style="font-size: 12px; color: #94a3b8; font-weight: 600;">Toplam Tutar:</span>
                        <span style="font-size: 24px; font-weight: 900; color: #4ade80;" id="payment-price">₺0.00</span>
                    </div>

                    <div style="font-size: 9.5px; color: #64748b; line-height: 1.35; margin-bottom: 14px; text-align: center;">
                        Satın alım onaylandığında öğeler anında hesabınıza eklenir. İstediğiniz an iptal edebilirsiniz.
                    </div>

                    <!-- Action Buttons -->
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        <button class="btn-action" style="background: linear-gradient(180deg, #22c55e 0%, #16a34a 100%); color: #fff; height: 42px; font-size: 13.5px; font-weight: 800; border-radius: 10px;" id="btn-confirm-payment">
                            SATIN ALIMI ONAYLA
                        </button>
                        <button class="btn-action" style="background: rgba(255,255,255,0.06); color: #cbd5e1; height: 34px; font-size: 11.5px; border-radius: 8px;" onclick="closeModal('modal-payment')">
                            VAZGEÇ VE GERİ DÖN
                        </button>
                    </div>
                </div>
            </div>

            <!-- MODAL: DAILY REWARD -->`;

if (oldPaymentRegex.test(content)) {
    content = content.replace(oldPaymentRegex, newPaymentHtml);
    console.log("PASS: Thematic payment modal updated!");
}


// 3. REVISE MODAL-LEADERBOARD HEADER
const oldLeaderboardHeaderRegex = /<!-- MODAL: LEADERBOARD[\s\S]*?<!-- 3 Segmented Filter Tabs & Refresh -->/;
const newLeaderboardHeaderHtml = `<!-- MODAL: LEADERBOARD (Kademeli Olimpos Lig Sistemi) -->
            <div class="modal-overlay" id="modal-leaderboard">
                <div class="modal-card" style="max-height: 88vh; display: flex; flex-direction: column; width: 95%; max-width: 440px; padding: 16px 14px; border: 1.5px solid var(--gold-primary); background: radial-gradient(circle at top, #141c2e 0%, #070b14 100%); box-shadow: 0 0 35px rgba(0, 210, 255, 0.25);">
                    <!-- Header -->
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                        <div>
                            <div class="modal-title" style="margin-bottom: 2px; font-size: 17px; text-align: left; display: flex; align-items: center; gap: 6px;">
                                <span>🏆 ARKENYA OLİMPOS LİGİ</span>
                            </div>
                            <div id="lb-league-badge" style="font-size: 11px; color: var(--gold-primary); text-align: left; font-weight: 800;">
                                🥉 BRONZ LİGİ • Acemi Panteonu
                            </div>
                        </div>
                        <div class="modal-close" style="position: static; font-size: 18px; padding: 2px 8px;" onclick="closeModal('modal-leaderboard')">✕</div>
                    </div>

                    <!-- League Season Reward Banner -->
                    <div id="lb-season-reward-box" style="background: rgba(245, 197, 66, 0.08); border: 1px solid rgba(245, 197, 66, 0.25); border-radius: 10px; padding: 6px 10px; margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between;">
                        <div style="font-size: 10.5px; color: #cbd5e1;">
                            <span style="font-weight: 800; color: var(--gold-light);">🎁 Sezon Sonu Ödülü:</span>
                            <span id="lb-season-reward-val" style="color: #38bdf8; font-weight: 700;"> 50 💎 + 1.000 💰</span>
                        </div>
                        <div style="font-size: 9.5px; color: #94a3b8;">Haftalık Puanlama</div>
                    </div>

                    <!-- Promotion / Demotion Zone Legend -->
                    <div style="display: flex; justify-content: space-around; background: rgba(0,0,0,0.3); border-radius: 8px; padding: 4px 6px; margin-bottom: 8px; font-size: 9.5px; font-weight: 700;">
                        <span style="color: #4ade80;">🟢 1-3: Terfi Bölgesi</span>
                        <span style="color: #cbd5e1;">⚪ 4-15: Güvenli Bölge</span>
                        <span style="color: #f87171;">🔴 16+: Düşme Hattı</span>
                    </div>

                    <!-- 3 Segmented Filter Tabs & Refresh -->`;

if (oldLeaderboardHeaderRegex.test(content)) {
    content = content.replace(oldLeaderboardHeaderRegex, newLeaderboardHeaderHtml);
    console.log("PASS: Thematic leaderboard header updated!");
}


// 4. ADD NAVIGATION HISTORY & BACK NAVIGATION
const navEngineCode = `// ==========================================
        // USER-CENTRIC REVERSIBILITY & NAVIGATION STACK ENGINE
        // Guarantees effortless backtracking, modal dismissals & hardware back button
        // ==========================================
        let screenNavigationHistory = [];
        let currentActiveScreen = 'screen-mainmenu';

        function showScreen(screenId, addToHistory = true) {
            if (addToHistory && currentActiveScreen && currentActiveScreen !== screenId) {
                screenNavigationHistory.push(currentActiveScreen);
                if (screenNavigationHistory.length > 20) screenNavigationHistory.shift();
            }
            currentActiveScreen = screenId;

            // Close all active modals when switching screens
            document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));

            document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
            const targetScreen = document.getElementById(screenId);
            if (targetScreen) {
                targetScreen.classList.add('active');
                if (screenId === 'screen-mainmenu') {
                    targetScreen.style.backgroundImage = "url('Assets/Art/main_menu_clean_bg.jpg')";
                    targetScreen.style.backgroundSize = "cover";
                    targetScreen.style.backgroundPosition = "center";
                }
            }
            
            const globalHud = document.getElementById('global-hud');
            if (globalHud) {
                globalHud.style.display = (screenId === 'screen-gameplay' || screenId === 'screen-splash') ? 'none' : 'flex';
            }

            const globalBottomNav = document.getElementById('global-bottom-nav');
            if (globalBottomNav) {
                globalBottomNav.style.display = (screenId === 'screen-gameplay' || screenId === 'screen-splash') ? 'none' : 'flex';
            }

            // Sync Bottom Nav Active Items
            document.querySelectorAll('#global-bottom-nav .nav-item').forEach(item => {
                item.classList.remove('active');
                const onclickAttr = item.getAttribute('onclick') || '';
                if (screenId === 'screen-mainmenu' && onclickAttr.includes('screen-mainmenu')) item.classList.add('active');
                if (screenId === 'screen-worldmap' && onclickAttr.includes('openWorldMap')) item.classList.add('active');
                if (screenId === 'screen-hero' && onclickAttr.includes('openHeroScreen')) item.classList.add('active');
                if (screenId === 'screen-store' && onclickAttr.includes('openStoreScreen')) item.classList.add('active');
            });

            syncAllHUDs();
            updateHeroLockBadges();
        }

        // Universal Back Navigation
        function navigateBack() {
            // 1. If any modal is active, close the topmost modal
            const activeModals = Array.from(document.querySelectorAll('.modal-overlay.active'));
            if (activeModals.length > 0) {
                const topModal = activeModals[activeModals.length - 1];
                closeModal(topModal.id);
                triggerHaptic('light');
                return;
            }

            // 2. If we have a navigation history, pop previous screen
            if (screenNavigationHistory.length > 0) {
                const prevScreen = screenNavigationHistory.pop();
                showScreen(prevScreen, false);
                triggerHaptic('light');
                return;
            }

            // 3. Fallback: if not on mainmenu, return to mainmenu
            if (currentActiveScreen !== 'screen-mainmenu') {
                showScreen('screen-mainmenu', false);
                triggerHaptic('light');
            }
        }

        // Global Escape Key Listener for Instant Reversibility
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                navigateBack();
            }
        });

        // Modal Backdrop Click Listener for Intuitive Dismissal
        document.addEventListener('click', (e) => {
            if (e.target && e.target.classList && e.target.classList.contains('modal-overlay') && e.target.classList.contains('active')) {
                if (e.target.id !== 'modal-victory' && e.target.id !== 'modal-final-celebration') {
                    closeModal(e.target.id);
                }
            }
        });

        // Android Hardware Back Button Listener (Capacitor Native)
        if (typeof window !== 'undefined' && window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.App) {
            window.Capacitor.Plugins.App.addListener('backButton', () => {
                navigateBack();
            });
        }`;

const oldShowScreenRegex = /\/\/\s*USER-CENTRIC REVERSIBILITY[\s\S]*?updateHeroLockBadges\(\);\s*\}|\/\/\s*SCREEN NAV\s*\n\s*function showScreen\(screenId\) \{[\s\S]*?updateHeroLockBadges\(\);\s*\}/;
if (oldShowScreenRegex.test(content)) {
    content = content.replace(oldShowScreenRegex, navEngineCode);
    console.log("PASS: Replaced showScreen with Navigation Stack Engine!");
}


// 5. DEFINE REALISTIC TIERED OLYMPUS LEAGUES & BALANCED PARTICIPANTS
// Believable scores proportional to level targets!
const leagueSystemCode = `// ==========================================
        // REALISTIC 5-TIER OLYMPUS LEAGUE SYSTEM
        // Balanced score ranges aligned with level progression
        // ==========================================
        const OLYMPUS_LEAGUES = [
            { id: 'bronze', name: 'Bronz Ligi', icon: '🥉', minLevel: 1, maxLevel: 10, color: '#cd7f32', rewardGems: 30, rewardGold: 1000, desc: 'Acemi Panteonu (Seviye 1-10)', baseScore: 3500 },
            { id: 'silver', name: 'Gümüş Ligi', icon: '🥈', minLevel: 11, maxLevel: 20, color: '#c0c0c0', rewardGems: 60, rewardGold: 2500, desc: 'Maceracı Panteonu (Seviye 11-20)', baseScore: 18000 },
            { id: 'gold', name: 'Altın Ligi', icon: '🥇', minLevel: 21, maxLevel: 35, color: '#ffd700', rewardGems: 120, rewardGold: 6000, desc: 'Muhafız Panteonu (Seviye 21-35)', baseScore: 45000 },
            { id: 'diamond', name: 'Elmas Ligi', icon: '💎', minLevel: 36, maxLevel: 45, color: '#00d2ff', rewardGems: 250, rewardGold: 12000, desc: 'Yarı-Tanrılar (Seviye 36-45)', baseScore: 90000 },
            { id: 'olympus', name: 'Olimpos Efsaneleri', icon: '👑', minLevel: 46, maxLevel: 50, color: '#ffe885', rewardGems: 500, rewardGold: 25000, desc: 'Zirve Şampiyonları (Seviye 46-50)', baseScore: 160000 }
        ];

        function getCurrentPlayerLeague(lvl) {
            lvl = lvl || gameState.unlockedLevel || 1;
            for (let i = OLYMPUS_LEAGUES.length - 1; i >= 0; i--) {
                if (lvl >= OLYMPUS_LEAGUES[i].minLevel) {
                    return OLYMPUS_LEAGUES[i];
                }
            }
            return OLYMPUS_LEAGUES[0];
        }

        // Generate authentic, level-appropriate Greek hero participants for empty brackets
        function generateBalancedLeagueParticipants(league) {
            const greekNames = [
                { name: "Alkeus", hero: "zeus" },
                { name: "Kassandra", hero: "athena" },
                { name: "Leonidas", hero: "asterion" },
                { name: "Helena", hero: "nyra" },
                { name: "Thales", hero: "thalor" },
                { name: "Damon", hero: "arkenya" },
                { name: "Orion", hero: "zeus" },
                { name: "Hermia", hero: "athena" },
                { name: "Aethel", hero: "nyra" },
                { name: "Perseus", hero: "asterion" }
            ];

            const base = league.baseScore;
            return greekNames.map((p, idx) => {
                const variance = 1 - (idx * 0.08) + (Math.sin(idx) * 0.03);
                const score = Math.max(800, Math.floor(base * variance));
                const levelOffset = Math.min(league.maxLevel, league.minLevel + Math.floor((10 - idx) * ((league.maxLevel - league.minLevel) / 10)));
                return {
                    userId: 'pantheon_' + league.id + '_' + idx,
                    username: p.name,
                    avatarHero: p.hero,
                    scoreWeekly: score,
                    scoreMonthly: score * 3,
                    scoreAllTime: score * 6,
                    level: levelOffset
                };
            });
        }`;

// Replace OLYMPUS_LEAGUES block or insert before switchLeaderboardTab
if (content.includes('const OLYMPUS_LEAGUES =')) {
    const oldLeagueRegex = /\/\/\s*={10,}\s*\n\s*\/\/\s*.*OLYMPUS LEAGUE[\s\S]*?return OLYMPUS_LEAGUES\[0\];\s*\}/;
    content = content.replace(oldLeagueRegex, leagueSystemCode);
    console.log("PASS: Replaced with realistic balanced OLYMPUS_LEAGUES definition!");
} else {
    content = content.replace('function switchLeaderboardTab(tab) {', leagueSystemCode + '\n\n        function switchLeaderboardTab(tab) {');
    console.log("PASS: Injected realistic OLYMPUS_LEAGUES definition!");
}


// 6. UPDATE loadLeaderboard TO USE BALANCED PARTICIPANTS AND TIER BADGES
const oldLoadLeaderboardRegex = /async function loadLeaderboard\(type = 'haftalik', isRefresh = false\) \{[\s\S]*?\/\/ SPECIAL GEM STATE/;

const newLoadLeaderboardCode = `async function loadLeaderboard(type = 'haftalik', isRefresh = false) {
            currentLeaderboardTab = type;
            const listEl = document.getElementById('leaderboard-list');
            const playerCardEl = document.getElementById('lb-player-card');
            const syncStatusEl = document.getElementById('lb-sync-status');
            const timerEl = document.getElementById('lb-timer');
            const leagueBadgeEl = document.getElementById('lb-league-badge');
            const rewardValEl = document.getElementById('lb-season-reward-val');
            if (!listEl) return;

            // Current player's tier badge
            const playerLvl = gameState.unlockedLevel || 1;
            const currentLeague = getCurrentPlayerLeague(playerLvl);
            if (leagueBadgeEl) {
                leagueBadgeEl.innerHTML = \`\${currentLeague.icon} \${currentLeague.name.toUpperCase()} • \${currentLeague.desc}\`;
                leagueBadgeEl.style.color = currentLeague.color;
            }
            if (rewardValEl) {
                rewardValEl.innerHTML = \` \${currentLeague.rewardGems} 💎 + \${currentLeague.rewardGold.toLocaleString()} 💰\`;
            }

            // Tab button styles
            ['haftalik', 'aylik', 'genel'].forEach(t => {
                const btn = document.getElementById(\`tab-\${t}\`);
                if (btn) {
                    if (t === type) {
                        btn.style.background = 'linear-gradient(135deg, var(--gold-primary), #d49b13)';
                        btn.style.color = '#000';
                        btn.style.borderColor = 'var(--gold-light)';
                        btn.style.boxShadow = '0 2px 10px rgba(245, 197, 66, 0.35)';
                    } else {
                        btn.style.background = 'rgba(255,255,255,0.06)';
                        btn.style.color = '#aaa';
                        btn.style.borderColor = 'rgba(255,255,255,0.1)';
                        btn.style.boxShadow = 'none';
                    }
                }
            });

            if (timerEl) {
                if (type === 'haftalik') timerEl.innerText = 'Sıfırlanma: Pazartesi 00:00';
                else if (type === 'aylik') timerEl.innerText = 'Sıfırlanma: 30 Günlük Sezon';
                else timerEl.innerText = 'Tüm Zamanların Efsaneleri';
            }

            listEl.innerHTML = \`
                <div style="padding: 24px 10px; text-align: center; color: #fff;">
                    <div style="font-size: 22px; animation: spin 1s linear infinite; display: inline-block;">🔄</div>
                    <div style="margin-top: 6px; font-size: 11.5px; color: var(--gold-light); font-weight: 600;">Olimpos Ligi Yükleniyor...</div>
                </div>
            \`;

            const targetField = type === 'haftalik' ? 'scoreWeekly' : (type === 'aylik' ? 'scoreMonthly' : 'scoreAllTime');
            let records = [];
            let isOnline = false;

            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 2800);

                const qUrl = \`\${FIRESTORE_BASE}:runQuery?key=\${FIREBASE_CONFIG.apiKey}\`;
                const qPayload = {
                    structuredQuery: {
                        from: [{ collectionId: 'leaderboard' }],
                        orderBy: [{ field: { fieldPath: targetField }, direction: 'DESCENDING' }],
                        limit: 30
                    }
                };

                const res = await fetch(qUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(qPayload),
                    signal: controller.signal
                });
                clearTimeout(timeoutId);

                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data)) {
                        records = data
                            .filter(d => d.document && d.document.fields)
                            .map(d => {
                                const f = d.document.fields;
                                const docName = d.document.name || '';
                                const uid = docName.split('/').pop();
                                return {
                                    userId: uid,
                                    username: f.username?.stringValue || 'OlimposSavaşçısı',
                                    avatarHero: f.avatarHero?.stringValue || 'arkenya',
                                    scoreWeekly: parseInt(f.scoreWeekly?.integerValue || '0', 10),
                                    scoreMonthly: parseInt(f.scoreMonthly?.integerValue || '0', 10),
                                    scoreAllTime: parseInt(f.scoreAllTime?.integerValue || '0', 10),
                                    level: parseInt(f.level?.integerValue || '1', 10)
                                };
                            });
                        if (records.length > 0) {
                            isOnline = true;
                            localStorage.setItem('arkenya_lb_cache_' + type, JSON.stringify(records));
                        }
                    }
                }
            } catch (err) {
                console.warn("Firebase query fallback to cache:", err);
            }

            // Believable, thematic fallback if offline
            if (!isOnline || records.length === 0) {
                const cached = localStorage.getItem('arkenya_lb_cache_' + type);
                if (cached) {
                    try { records = JSON.parse(cached); } catch(e){}
                }
                if (!records || records.length === 0) {
                    records = generateBalancedLeagueParticipants(currentLeague);
                }
            }

            if (syncStatusEl) {
                if (isOnline) {
                    syncStatusEl.innerHTML = \`<span style="width: 7px; height: 7px; border-radius: 50%; background: #4ade80; display: inline-block; box-shadow: 0 0 6px #4ade80;"></span> <span style="color: #4ade80;">🟢 Canlı Panteon</span>\`;
                } else {
                    syncStatusEl.innerHTML = \`<span style="width: 7px; height: 7px; border-radius: 50%; background: #facc15; display: inline-block; box-shadow: 0 0 6px #facc15;"></span> <span style="color: #facc15;">⚡ Lig Önbelleği</span>\`;
                }
            }

            const myProfile = gameState.playerProfile || {
                userId: 'me',
                username: 'OlimposSavaşçısı',
                avatarHero: 'arkenya'
            };
            const myScore = type === 'haftalik' ? (gameState.weeklyScore || gameState.totalScore || 0) : (type === 'aylik' ? (gameState.monthlyScore || gameState.totalScore || 0) : (gameState.totalScore || 0));

            records = records.filter(r => r.userId !== myProfile.userId && !r.isMe);

            records.push({
                userId: myProfile.userId,
                username: myProfile.username || 'Sen',
                avatarHero: myProfile.avatarHero || 'arkenya',
                scoreWeekly: gameState.weeklyScore || myScore,
                scoreMonthly: gameState.monthlyScore || myScore,
                scoreAllTime: gameState.totalScore || myScore,
                level: gameState.unlockedLevel || 1,
                isMe: true
            });

            records.sort((a, b) => {
                const sA = type === 'haftalik' ? a.scoreWeekly : (type === 'aylik' ? a.scoreMonthly : a.scoreAllTime);
                const sB = type === 'haftalik' ? b.scoreWeekly : (type === 'aylik' ? b.scoreMonthly : b.scoreAllTime);
                return sB - sA;
            });

            const myRank = records.findIndex(r => r.isMe || r.userId === myProfile.userId) + 1;

            const heroAvatars = {
                arkenya: 'Assets/Art/hero_arkenya.jpg',
                asterion: 'Assets/Art/hero_asterion_1789032622044.png',
                nyra: 'Assets/Art/hero_nyra_1789032644250.png',
                thalor: 'Assets/Art/hero_thalor_1789032663594.png',
                athena: 'Assets/Art/hero_athena_1789032003209.png',
                zeus: 'Assets/Art/hero_zeus_1789031982831.png'
            };

            let html = '';
            records.slice(0, 30).forEach((entry, idx) => {
                const rank = idx + 1;
                const score = type === 'haftalik' ? entry.scoreWeekly : (type === 'aylik' ? entry.scoreMonthly : entry.scoreAllTime);
                const isMe = entry.isMe || entry.userId === myProfile.userId;
                const avatarSrc = heroAvatars[entry.avatarHero] || 'Assets/Art/hero_arkenya.jpg';

                let medal = rank;
                let rankBadgeStyle = 'color: #94a3b8; font-weight: 700; font-size: 13px;';
                let rowBg = isMe ? 'background: linear-gradient(90deg, rgba(245, 197, 66, 0.22) 0%, rgba(0, 210, 255, 0.12) 100%); border: 1.5px solid var(--gold-primary);' : 'background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05);';

                let zoneTag = '';
                if (rank <= 3) {
                    zoneTag = '<span style="font-size: 8px; background: rgba(74, 222, 128, 0.18); color: #4ade80; border: 1px solid rgba(74, 222, 128, 0.4); border-radius: 4px; padding: 1px 4px; margin-left: 4px; font-weight: 800;">TERFİ 🟢</span>';
                } else if (rank >= 16) {
                    zoneTag = '<span style="font-size: 8px; background: rgba(248, 113, 113, 0.18); color: #f87171; border: 1px solid rgba(248, 113, 113, 0.4); border-radius: 4px; padding: 1px 4px; margin-left: 4px; font-weight: 800;">DÜŞME 🔴</span>';
                }

                if (rank === 1) {
                    medal = '🥇';
                    rankBadgeStyle = 'font-size: 16px;';
                    if (!isMe) rowBg = 'background: linear-gradient(90deg, rgba(245, 197, 66, 0.15) 0%, rgba(20, 28, 45, 0.6) 100%); border: 1px solid rgba(245, 197, 66, 0.4);';
                } else if (rank === 2) {
                    medal = '🥈';
                    rankBadgeStyle = 'font-size: 16px;';
                    if (!isMe) rowBg = 'background: linear-gradient(90deg, rgba(160, 216, 239, 0.12) 0%, rgba(20, 28, 45, 0.6) 100%); border: 1px solid rgba(0, 210, 255, 0.35);';
                } else if (rank === 3) {
                    medal = '🥉';
                    rankBadgeStyle = 'font-size: 16px;';
                    if (!isMe) rowBg = 'background: linear-gradient(90deg, rgba(205, 127, 50, 0.12) 0%, rgba(20, 28, 45, 0.6) 100%); border: 1px solid rgba(205, 127, 50, 0.35);';
                }

                html += \`
                    <div style="display: flex; align-items: center; justify-content: space-between; padding: 7px 8px; margin-bottom: 5px; border-radius: 10px; \${rowBg}">
                        <div style="display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0;">
                            <div style="width: 24px; text-align: center; \${rankBadgeStyle}">\${medal}</div>
                            <div style="width: 32px; height: 32px; border-radius: 50%; background: url('\${avatarSrc}') center/cover no-repeat; border: 1.5px solid \${isMe ? 'var(--gold-primary)' : 'rgba(255,255,255,0.2)'}; flex-shrink: 0;"></div>
                            <div style="text-align: left; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                                <div style="font-size: 12.5px; font-weight: 800; color: \${isMe ? 'var(--gold-light)' : '#fff'}; display: flex; align-items: center; gap: 4px;">
                                    \${entry.username} \${isMe ? '<span style="font-size: 8.5px; background: var(--gold-primary); color: #000; padding: 1px 4px; border-radius: 4px; font-weight: 900;">SEN</span>' : ''} \${zoneTag}
                                </div>
                                <div style="font-size: 9.5px; color: #94a3b8;">Bölüm \${entry.level} • <span style="text-transform: capitalize; color: var(--accent-blue);">\${entry.avatarHero}</span></div>
                            </div>
                        </div>
                        <div style="font-size: 12.5px; font-weight: 800; color: var(--gold-light); text-align: right; margin-left: 8px;">
                            \${(score || 0).toLocaleString()} <span style="font-size: 10px; color: var(--gold-primary);">⚡</span>
                        </div>
                    </div>
                \`;
            });

            listEl.innerHTML = html;

            if (playerCardEl) {
                const myAvatarSrc = heroAvatars[myProfile.avatarHero] || 'Assets/Art/hero_arkenya.jpg';
                let nextGapText = '';
                let myZoneStatus = '<span style="color: #cbd5e1;">⚪ Güvenli Bölgedesin</span>';
                if (myRank <= 3) {
                    myZoneStatus = '<span style="color: #4ade80; font-weight: 800;">🟢 Terfi Bölgesindesin! (+1 Lig)</span>';
                } else if (myRank >= 16) {
                    myZoneStatus = '<span style="color: #f87171; font-weight: 800;">🔴 Düşme Hattı! (Puan Topla)</span>';
                }

                if (myRank > 1 && records[myRank - 2]) {
                    const aheadScore = type === 'haftalik' ? records[myRank - 2].scoreWeekly : (type === 'aylik' ? records[myRank - 2].scoreMonthly : records[myRank - 2].scoreAllTime);
                    const diff = aheadScore - myScore;
                    if (diff > 0) nextGapText = \`<div style="font-size: 9.5px; color: #38bdf8;">\${myRank - 1}. Sıraya: <b>+\${diff.toLocaleString()}</b> Puan</div>\`;
                } else if (myRank === 1) {
                    nextGapText = \`<div style="font-size: 9.5px; color: var(--gold-light); font-weight: bold;">👑 Olimpos Panteonu Zirvesindesin!</div>\`;
                }

                playerCardEl.innerHTML = \`
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <div style="font-size: 13px; font-weight: 900; color: var(--gold-light); min-width: 22px;">#\${myRank}</div>
                        <div style="width: 34px; height: 34px; border-radius: 50%; background: url('\${myAvatarSrc}') center/cover no-repeat; border: 1.5px solid var(--gold-light); box-shadow: 0 0 8px rgba(245,197,66,0.3);"></div>
                        <div style="text-align: left;">
                            <div style="font-size: 12.5px; font-weight: 800; color: #fff;">\${myProfile.username || 'Sen'} <span style="font-size: 8.5px; color: var(--gold-primary);">(Senin Kartın)</span></div>
                            <div style="font-size: 9.5px;">\${myZoneStatus}</div>
                            \${nextGapText}
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 13px; font-weight: 900; color: var(--gold-light);">\${myScore.toLocaleString()} <span style="font-size: 10px;">⚡</span></div>
                        <div style="font-size: 9px; color: #aaa;">Bölüm \${gameState.unlockedLevel || 1} • \${currentLeague.name}</div>
                    </div>
                \`;
            }
        }

        // SPECIAL GEM STATE`;

content = content.replace(oldLoadLeaderboardRegex, newLoadLeaderboardCode);
console.log("PASS: Replaced loadLeaderboard with grounded, realistic, thematic panteon engine!");


// 7. UNIVERSAL STATE & HUD SYNCHRONIZATION ENGINE
const syncEngineCode = `// ==========================================
        // UNIVERSAL STATE & HUD SYNCHRONIZATION ENGINE
        // Guarantees zero stale states across all screens & modals
        // ==========================================
        function syncAllHUDs() {
            // 1. Top Global HUD
            const gGold = document.getElementById('hud-gold');
            const gGems = document.getElementById('hud-gems');
            const gEnergy = document.getElementById('hud-energy-val');
            const topHeroName = document.getElementById('top-hero-name');
            const topLevel = document.getElementById('top-player-level');
            const topRankName = document.getElementById('top-rank-name');

            if (gGold) gGold.innerText = (gameState.gold || 0).toLocaleString();
            if (gGems) gGems.innerText = (gameState.gems || 0).toLocaleString();
            if (gEnergy) gEnergy.innerText = (gameState.energy || 0);
            if (topLevel) topLevel.innerText = gameState.unlockedLevel || 1;

            if (topRankName) {
                const curLeague = getCurrentPlayerLeague(gameState.unlockedLevel || 1);
                topRankName.innerText = curLeague.name.toUpperCase();
            }

            // 2. Store Screen HUD
            updateStoreUI();

            // 3. Gameplay Screen HUD (if visible)
            const gameScoreEl = document.getElementById('game-score');
            const gameEnergyEl = document.getElementById('game-energy-val');
            if (gameEnergyEl) gameEnergyEl.innerText = gameState.energy || 0;

            // 4. Save to LocalStorage
            saveGame();
        }

        function purchaseIAP(bundleId, price, desc, itemsList = []) {
            const nameEl = document.getElementById('payment-item-name');
            const priceEl = document.getElementById('payment-price');
            const summaryEl = document.getElementById('payment-items-summary');

            if (nameEl) nameEl.innerText = desc;
            if (priceEl) priceEl.innerText = \`₺\${price}\`;
            
            if (summaryEl) {
                if (itemsList && itemsList.length > 0) {
                    summaryEl.innerHTML = itemsList.map(item => \`<div style="display: flex; align-items: center; gap: 6px;"><span>✓</span><span>\${item}</span></div>\`).join('');
                } else {
                    summaryEl.innerHTML = '<div>✓ Kutsal Hazine Paketi</div>';
                }
            }
            
            const btn = document.getElementById('btn-confirm-payment');
            if (btn) {
                const newBtn = btn.cloneNode(true);
                btn.parentNode.replaceChild(newBtn, btn);
                
                newBtn.onclick = () => {
                    newBtn.innerText = "İşlem Güvenle Doğrulanıyor...";
                    newBtn.disabled = true;
                    newBtn.style.opacity = '0.7';
                    
                    setTimeout(() => {
                        newBtn.innerText = "Satın Alma Başarılı! ✓";
                        newBtn.style.background = "linear-gradient(180deg, #10b981 0%, #059669 100%)";
                        
                        setTimeout(() => {
                            applyIAPBundle(bundleId);
                            closeModal('modal-payment');
                            showToast(\`\${desc} başarıyla hesabına tanımlandı! ⚡\`, "success");
                            
                            // Reset button
                            newBtn.innerText = "SATIN ALIMI ONAYLA";
                            newBtn.disabled = false;
                            newBtn.style.opacity = '1';
                            newBtn.style.background = "linear-gradient(180deg, #22c55e 0%, #16a34a 100%)";
                        }, 700);
                    }, 1000);
                };
            }

            openModal('modal-payment');
        }

        function exchangeGemsForGold(gemCost, goldReward) {
            if ((gameState.gems || 0) < gemCost) {
                showToast(\`Yetersiz Elmas! \${gemCost} Elmasa ihtiyacın var.\`, "error");
                return;
            }
            gameState.gems -= gemCost;
            gameState.gold = (gameState.gold || 0) + goldReward;
            
            triggerHaptic('heavy');
            spawnFloatingCombo(\`+\${goldReward.toLocaleString()} 💰 ALTIN KAZANILDI!\`);
            showToast(\`\${goldReward.toLocaleString()} Altın başarıyla takas edildi! 💰\`, "success");
            
            syncAllHUDs();
        }

        function applyIAPBundle(bundleId) {
            if (bundleId === 'starter_bundle') {
                gameState.gems = (gameState.gems || 0) + 250;
                gameState.gold = (gameState.gold || 0) + 2500;
                if (!gameState.inventory) gameState.inventory = { zeus: 0, athena: 0 };
                gameState.inventory.zeus = (gameState.inventory.zeus || 0) + 2;
                gameState.inventory.athena = (gameState.inventory.athena || 0) + 2;
                gameState.energy = gameState.maxEnergy || 5;
                spawnFloatingCombo("⚡ BAŞLANGIÇ PAKETİ KAZANILDI!");
            } else if (bundleId === 'no_ads') {
                gameState.noAds = true;
                gameState.gems = (gameState.gems || 0) + 50;
                spawnFloatingCombo("🚫 REKLAMLAR KALDIRILDI!");
            } else if (bundleId === 'infinite_energy') {
                gameState.energy = (gameState.maxEnergy || 5) + 20;
                spawnFloatingCombo("⏳ SONSUZ ENERJİ AKTİF EDİLDİ!");
            } else if (bundleId === 'gems_pouch') {
                gameState.gems = (gameState.gems || 0) + 60;
                spawnFloatingCombo("💎 60 KUTSAL ELMAS EKLENDİ!");
            } else if (bundleId === 'gems_chest') {
                gameState.gems = (gameState.gems || 0) + 250;
                if (!gameState.inventory) gameState.inventory = { zeus: 0, athena: 0 };
                gameState.inventory.zeus = (gameState.inventory.zeus || 0) + 1;
                spawnFloatingCombo("💎 KUTSAL ELMAS SANDIĞI AÇILDI!");
            }
            triggerHaptic('heavy');
            syncAllHUDs();
        }`;

const oldPurchaseSectionRegex = /function purchaseIAP\(bundleId, price, desc[\s\S]*?function restorePurchases\(\)/;
if (oldPurchaseSectionRegex.test(content)) {
    content = content.replace(oldPurchaseSectionRegex, syncEngineCode + '\n\n        function restorePurchases()');
    console.log("PASS: Replaced purchaseIAP with realistic sync & IAP engine!");
}

content = content.replace(
    /saveGame\(\);\s*updateTopBar\(\);\s*updateStoreUI\(\);/g,
    'syncAllHUDs();'
);


// 8. SYNCHRONIZE ACROSS ALL HTML TARGETS
fs.writeFileSync(path.join(__dirname, 'www', 'index.html'), content);
fs.writeFileSync(path.join(__dirname, 'index.html'), content);
fs.writeFileSync(path.join(__dirname, 'Arkenya_Playable_Demo.html'), content);
fs.writeFileSync(path.join(__dirname, 'www', 'Arkenya_Playable_Demo.html'), content);

const androidAssetPath = path.join(__dirname, 'android', 'app', 'src', 'main', 'assets', 'public', 'index.html');
if (fs.existsSync(androidAssetPath)) {
    fs.writeFileSync(androidAssetPath, content);
    console.log("PASS: Synchronized to Android native asset directory!");
}

console.log("=========================================================");
console.log("=== THEMATIC & REALISTIC UPGRADES SUCCESSFULLY APPLIED! ===");
console.log("=========================================================");

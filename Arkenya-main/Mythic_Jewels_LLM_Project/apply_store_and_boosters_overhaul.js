const fs = require('fs');

console.log('=== APPLYING STORE, CURRENCY & 4 MYTHIC BOOSTERS OVERHAUL ===');

let html = fs.readFileSync('www/index.html', 'utf8');
const isCrlf = html.includes('\r\n');

function clean(str) {
    return str.replace(/\r\n/g, '\n');
}

function restore(str) {
    return isCrlf ? str.replace(/\n/g, '\r\n') : str;
}

html = clean(html);

// -------------------------------------------------------------
// 1. CSS ENHANCEMENTS: 4 GOD BUTTONS & PRE-GAME BOOSTER CHIPS
// -------------------------------------------------------------
const oldSummonsCss = `        .gameplay-god-summons {
            max-width: 440px;
            width: 100%;
            margin: 6px auto;
            padding: 6px 12px;
            display: flex;
            gap: 10px;
            justify-content: center;
            background: rgba(10, 14, 26, 0.65);
            border-radius: 18px;
            border: 1px solid rgba(255, 215, 0, 0.2);
            box-sizing: border-box;
            backdrop-filter: blur(8px);
        }

        .god-summon-btn {
            flex: 1;
            background: linear-gradient(135deg, rgba(28, 22, 10, 0.95), rgba(12, 9, 4, 0.95));
            border: 1.5px solid var(--gold-primary);
            border-radius: 20px;
            padding: 6px 12px;
            color: #fff;
            font-size: 11px;
            font-weight: 800;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: space-between;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            transition: all 0.25s ease;
            position: relative;
            overflow: hidden;
        }

        .god-summon-btn#btn-powerup-athena {
            background: linear-gradient(135deg, rgba(10, 24, 34, 0.95), rgba(4, 10, 16, 0.95));
            border-color: #00e5ff;
        }

        .god-summon-btn.glow {
            animation: boosterReadyPulse 1.6s infinite ease-in-out;
        }

        @keyframes boosterReadyPulse {
            0% { box-shadow: 0 0 6px rgba(255, 215, 0, 0.4), inset 0 0 4px rgba(255, 215, 0, 0.2); }
            50% { box-shadow: 0 0 16px rgba(255, 215, 0, 0.8), inset 0 0 10px rgba(255, 215, 0, 0.4); transform: scale(1.02); }
            100% { box-shadow: 0 0 6px rgba(255, 215, 0, 0.4), inset 0 0 4px rgba(255, 215, 0, 0.2); }
        }

        .god-summon-btn#btn-powerup-athena.glow {
            animation: boosterAthenaPulse 1.6s infinite ease-in-out;
        }

        @keyframes boosterAthenaPulse {
            0% { box-shadow: 0 0 6px rgba(0, 229, 255, 0.4), inset 0 0 4px rgba(0, 229, 255, 0.2); }
            50% { box-shadow: 0 0 16px rgba(0, 229, 255, 0.8), inset 0 0 10px rgba(0, 229, 255, 0.4); transform: scale(1.02); }
            100% { box-shadow: 0 0 6px rgba(0, 229, 255, 0.4), inset 0 0 4px rgba(0, 229, 255, 0.2); }
        }

        .god-summon-btn:disabled {
            opacity: 0.5;
            filter: grayscale(0.7);
            cursor: pointer;
            animation: none !important;
        }`;

const newSummonsCss = `        .gameplay-god-summons {
            max-width: 440px;
            width: 100%;
            margin: 5px auto;
            padding: 5px 8px;
            display: flex;
            gap: 6px;
            justify-content: center;
            background: rgba(10, 14, 26, 0.75);
            border-radius: 16px;
            border: 1px solid rgba(255, 215, 0, 0.25);
            box-sizing: border-box;
            backdrop-filter: blur(8px);
        }

        .god-summon-btn {
            flex: 1;
            min-width: 0;
            background: linear-gradient(135deg, rgba(28, 22, 10, 0.95), rgba(12, 9, 4, 0.95));
            border: 1.5px solid var(--gold-primary);
            border-radius: 13px;
            padding: 5px 6px;
            color: #fff;
            font-size: 10px;
            font-weight: 800;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: space-between;
            box-shadow: 0 3px 10px rgba(0,0,0,0.5);
            transition: all 0.22s ease;
            position: relative;
            overflow: hidden;
        }

        .god-summon-btn#btn-powerup-hermes {
            background: linear-gradient(135deg, rgba(8, 30, 20, 0.95), rgba(4, 16, 10, 0.95));
            border-color: #2ecc71;
        }

        .god-summon-btn#btn-powerup-athena {
            background: linear-gradient(135deg, rgba(10, 24, 34, 0.95), rgba(4, 10, 16, 0.95));
            border-color: #00e5ff;
        }

        .god-summon-btn#btn-powerup-ares {
            background: linear-gradient(135deg, rgba(34, 10, 10, 0.95), rgba(18, 4, 4, 0.95));
            border-color: #ef4444;
        }

        .god-summon-btn.glow {
            animation: boosterReadyPulse 1.6s infinite ease-in-out;
        }

        @keyframes boosterReadyPulse {
            0% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.4), inset 0 0 3px rgba(255, 215, 0, 0.2); }
            50% { box-shadow: 0 0 14px rgba(255, 215, 0, 0.8), inset 0 0 8px rgba(255, 215, 0, 0.4); transform: scale(1.02); }
            100% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.4), inset 0 0 3px rgba(255, 215, 0, 0.2); }
        }

        .god-summon-btn#btn-powerup-hermes.glow {
            animation: boosterHermesPulse 1.6s infinite ease-in-out;
        }
        @keyframes boosterHermesPulse {
            0% { box-shadow: 0 0 5px rgba(46, 204, 113, 0.4); }
            50% { box-shadow: 0 0 14px rgba(46, 204, 113, 0.8); transform: scale(1.02); }
            100% { box-shadow: 0 0 5px rgba(46, 204, 113, 0.4); }
        }

        .god-summon-btn#btn-powerup-athena.glow {
            animation: boosterAthenaPulse 1.6s infinite ease-in-out;
        }
        @keyframes boosterAthenaPulse {
            0% { box-shadow: 0 0 5px rgba(0, 229, 255, 0.4); }
            50% { box-shadow: 0 0 14px rgba(0, 229, 255, 0.8); transform: scale(1.02); }
            100% { box-shadow: 0 0 5px rgba(0, 229, 255, 0.4); }
        }

        .god-summon-btn#btn-powerup-ares.glow {
            animation: boosterAresPulse 1.6s infinite ease-in-out;
        }
        @keyframes boosterAresPulse {
            0% { box-shadow: 0 0 5px rgba(239, 68, 68, 0.4); }
            50% { box-shadow: 0 0 14px rgba(239, 68, 68, 0.8); transform: scale(1.02); }
            100% { box-shadow: 0 0 5px rgba(239, 68, 68, 0.4); }
        }

        .god-summon-btn.locked {
            opacity: 0.55;
            filter: grayscale(0.8);
            cursor: pointer;
            border-color: rgba(255,255,255,0.2) !important;
            animation: none !important;
        }

        .prebooster-chip.selected {
            border-color: var(--gold-primary) !important;
            background: rgba(245, 197, 66, 0.16) !important;
            box-shadow: 0 0 12px rgba(245, 197, 66, 0.35) !important;
        }`;

if (!html.includes(oldSummonsCss)) {
    console.error('FAIL: oldSummonsCss not found');
    process.exit(1);
}
html = html.replace(oldSummonsCss, newSummonsCss);
console.log('✓ 1. CSS updated for 4 mythic god booster buttons and pre-game booster chips');

// -------------------------------------------------------------
// 2. HTML: 4 DIVINE GOD SUMMON BUTTONS IN GAMEPLAY
// -------------------------------------------------------------
const oldSummonsHtml = `                <!-- DIVINE GOD SUMMON BUTTONS -->
                <div class="gameplay-god-summons">
                    <button class="god-summon-btn" id="btn-powerup-zeus" onclick="usePowerup('zeus')" title="Zeus Şimşek Saldırısı">
                        <span style="display:flex; align-items:center; gap:6px;">
                            <svg viewBox="0 0 24 24" style="width:18px; height:18px; fill:url(#mythicGoldGrad); filter:drop-shadow(0 0 4px rgba(255,215,0,0.8));">
                                <polygon points="13,2 3,14 12,14 11,22 21,10 12,10" />
                            </svg>
                            <b>ZEUS</b>
                        </span>
                        <span class="booster-badge-count" id="lbl-powerup-zeus">2x</span>
                    </button>
                    <button class="god-summon-btn" id="btn-powerup-athena" onclick="usePowerup('athena')" title="Athena Aegis Kalkanı">
                        <span style="display:flex; align-items:center; gap:6px;">
                            <svg viewBox="0 0 24 24" style="width:18px; height:18px; stroke:url(#mythicCyanGrad); fill:rgba(0,210,255,0.25); stroke-width:1.8; filter:drop-shadow(0 0 4px rgba(0,210,255,0.8));">
                                <path d="M12 2L4 5v6.5C4 16.5 7.5 21 12 22c4.5-1 8-5.5 8-10.5V5L12 2z" />
                                <circle cx="12" cy="11" r="3" fill="url(#mythicCyanGrad)" />
                            </svg>
                            <b>ATHENA</b>
                        </span>
                        <span class="booster-badge-count" id="lbl-powerup-athena">2x</span>
                    </button>
                </div>`;

const newSummonsHtml = `                <!-- 4 KUTSAL OLİMPOS JOKERİ (ZEUS, HERMES, ATHENA, ARES) -->
                <div class="gameplay-god-summons">
                    <!-- 1. ZEUS: Şimşek / Çekiç (5 Taş Patlatır) -->
                    <button class="god-summon-btn" id="btn-powerup-zeus" onclick="usePowerup('zeus')" title="Zeus Şimşeği (5 Taş Patlatır)">
                        <span style="display:flex; align-items:center; gap:4px;">
                            <span style="font-size:12px;">⚡</span>
                            <b>ZEUS</b>
                        </span>
                        <span class="booster-badge-count" id="lbl-powerup-zeus">2x</span>
                    </button>

                    <!-- 2. HERMES: Kasırga / Karıştırıcı (Garantili Kombo Eşleşmesi) -->
                    <button class="god-summon-btn" id="btn-powerup-hermes" onclick="usePowerup('hermes')" title="Hermes Kasırgası (Tahtayı Karıştır)">
                        <span style="display:flex; align-items:center; gap:4px;">
                            <span style="font-size:12px;">🌪️</span>
                            <b>HERMES</b>
                        </span>
                        <span class="booster-badge-count" id="lbl-powerup-hermes">2x</span>
                    </button>

                    <!-- 3. ATHENA: Aegis Kalkanı (+5 Ekstra Hamle) -->
                    <button class="god-summon-btn" id="btn-powerup-athena" onclick="usePowerup('athena')" title="Athena Kalkanı (+5 Ekstra Hamle)">
                        <span style="display:flex; align-items:center; gap:4px;">
                            <span style="font-size:12px;">🛡️</span>
                            <b>ATHENA</b>
                        </span>
                        <span class="booster-badge-count" id="lbl-powerup-athena">2x</span>
                    </button>

                    <!-- 4. ARES: Süpernova Renk Bombası (Tüm Eş Renkleri Patlatır) -->
                    <button class="god-summon-btn" id="btn-powerup-ares" onclick="usePowerup('ares')" title="Ares Gazabı (Süpernova Renk Bombası)">
                        <span style="display:flex; align-items:center; gap:4px;">
                            <span style="font-size:12px;">💥</span>
                            <b>ARES</b>
                        </span>
                        <span class="booster-badge-count" id="lbl-powerup-ares">1x</span>
                    </button>
                </div>`;

if (!html.includes(oldSummonsHtml)) {
    console.error('FAIL: oldSummonsHtml not found');
    process.exit(1);
}
html = html.replace(oldSummonsHtml, newSummonsHtml);
console.log('✓ 2. HTML: 4 curated mythic booster buttons integrated into gameplay HUD');

// -------------------------------------------------------------
// 3. HTML: QUICK BOOSTER BUY MODAL
// -------------------------------------------------------------
const quickBuyModalHtml = `
            <!-- MODAL: QUICK BOOSTER BUY (Oyun İçi Hızlı Joker Satın Alma) -->
            <div class="modal-overlay" id="modal-quick-booster-buy" style="z-index: 99999;">
                <div class="modal-card" style="width: 90%; max-width: 380px; padding: 20px 16px; border: 1.5px solid var(--gold-primary); background: radial-gradient(circle at top, #182238 0%, #080d18 100%); box-shadow: 0 10px 40px rgba(0,0,0,0.85); text-align: center;">
                    <div class="modal-close" onclick="closeModal('modal-quick-booster-buy')">✕</div>
                    <div id="quick-buy-icon" style="font-size: 42px; margin-bottom: 6px; animation: pulse 1.5s infinite alternate;">⚡</div>
                    <div class="modal-title" id="quick-buy-title" style="color: var(--gold-light); font-size: 18px; margin-bottom: 4px;">ZEUS ŞİMŞEĞİ TÜKENDİ!</div>
                    <div id="quick-buy-desc" style="font-size: 12px; color: #cbd5e1; margin-bottom: 14px; line-height: 1.4;">
                        Maceranda tanrıların gücünü kaybetme! Oyun içi altın veya elmas ile anında takviye yap.
                    </div>

                    <!-- Player Balance Pill in Quick Buy -->
                    <div style="display: flex; justify-content: center; gap: 12px; margin-bottom: 14px; font-size: 11px; font-weight: 800;">
                        <span style="background: rgba(245,197,66,0.15); border: 1px solid rgba(245,197,66,0.3); padding: 3px 8px; border-radius: 8px; color: var(--gold-primary);">
                            💰 Altın: <span id="quick-buy-gold-bal">0</span>
                        </span>
                        <span style="background: rgba(0,210,255,0.15); border: 1px solid rgba(0,210,255,0.3); padding: 3px 8px; border-radius: 8px; color: #00d2ff;">
                            💎 Elmas: <span id="quick-buy-gems-bal">0</span>
                        </span>
                    </div>

                    <div style="display: flex; flex-direction: column; gap: 9px; margin-bottom: 12px;">
                        <!-- 1 Adet Altın ile Satın Al -->
                        <button id="btn-quick-buy-gold" class="btn-action" style="height: 44px; font-size: 13px; background: linear-gradient(180deg, #f5c542 0%, #b8820c 100%); color: #000; font-weight: 800;" onclick="executeQuickBoosterPurchase('gold')">
                            💰 1 ADET SATIN AL (250 Altın)
                        </button>

                        <!-- 3 Adet Elmas ile Satın Al -->
                        <button id="btn-quick-buy-gems" class="btn-action btn-action-blue" style="height: 44px; font-size: 13px; font-weight: 800;" onclick="executeQuickBoosterPurchase('gems')">
                            💎 3'LÜ PAKET AL (10 Elmas)
                        </button>
                    </div>

                    <button class="btn-action-sub" style="height: 36px; font-size: 12px;" onclick="closeModal('modal-quick-booster-buy')">✕ OYUNA DÖN</button>
                </div>
            </div>`;

if (!html.includes('id="modal-quick-booster-buy"')) {
    html = html.replace('<!-- MODAL: OUT OF LIVES -->', quickBuyModalHtml + '\n\n            <!-- MODAL: OUT OF LIVES -->');
    console.log('✓ 3. HTML: Quick booster buy modal inserted');
}

// -------------------------------------------------------------
// 4. HTML: PRE-LEVEL BOOSTERS IN LEVEL PREVIEW MODAL
// -------------------------------------------------------------
const oldPreviewChips = `                    <!-- Target & Moves Info Chips -->
                    <div style="display: flex; gap: 10px; margin-bottom: 14px; justify-content: space-between;">
                        <div style="flex: 1; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 8px 10px; text-align: center;">
                            <div style="font-size: 10px; color: #94a3b8; font-weight: 700; text-transform: uppercase;">🎯 HEDEF SKOR</div>
                            <div style="font-size: 15px; font-weight: 900; color: var(--gold-light); margin-top: 2px;" id="preview-target">4,000</div>
                        </div>
                        <div style="flex: 1; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 8px 10px; text-align: center;">
                            <div style="font-size: 10px; color: #94a3b8; font-weight: 700; text-transform: uppercase;">🦶 TOPLAM HAMLE</div>
                            <div style="font-size: 15px; font-weight: 900; color: var(--accent-blue); margin-top: 2px;" id="preview-moves">25</div>
                        </div>
                    </div>`;

const newPreviewChips = `                    <!-- Target & Moves Info Chips -->
                    <div style="display: flex; gap: 10px; margin-bottom: 12px; justify-content: space-between;">
                        <div style="flex: 1; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 8px 10px; text-align: center;">
                            <div style="font-size: 10px; color: #94a3b8; font-weight: 700; text-transform: uppercase;">🎯 HEDEF SKOR</div>
                            <div style="font-size: 15px; font-weight: 900; color: var(--gold-light); margin-top: 2px;" id="preview-target">4,000</div>
                        </div>
                        <div style="flex: 1; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 8px 10px; text-align: center;">
                            <div style="font-size: 10px; color: #94a3b8; font-weight: 700; text-transform: uppercase;">🦶 TOPLAM HAMLE</div>
                            <div style="font-size: 15px; font-weight: 900; color: var(--accent-blue); margin-top: 2px;" id="preview-moves">25</div>
                        </div>
                    </div>

                    <!-- Pre-Game Optional Boosters (Bölüm Öncesi İsteğe Bağlı Takviyeler) -->
                    <div id="preview-preboosters-wrap" style="margin-bottom: 14px; background: rgba(0,0,0,0.3); border: 1px solid rgba(245, 197, 66, 0.2); border-radius: 12px; padding: 8px 10px;">
                        <div style="font-size: 10px; font-weight: 800; color: var(--gold-primary); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; display: flex; justify-content: space-between; align-items: center;">
                            <span>⚡ BÖLÜM TAKVİYELERİ</span>
                            <span style="font-size: 9px; color: #94a3b8; font-weight: 600;">İsteğe Bağlı</span>
                        </div>
                        <div style="display: flex; gap: 8px;">
                            <div id="chip-prebooster-moves" class="prebooster-chip" onclick="togglePreBooster('moves')" style="flex: 1; padding: 6px 6px; border-radius: 9px; border: 1px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.04); cursor: pointer; text-align: center; transition: all 0.2s;">
                                <div style="font-size: 11px; font-weight: 700; color: #cbd5e1;">🛡️ +3 Hamle</div>
                                <div style="font-size: 9.5px; color: var(--gold-light); font-weight: 800; margin-top: 2px;">150 💰 Altın</div>
                            </div>
                            <div id="chip-prebooster-bomb" class="prebooster-chip" onclick="togglePreBooster('bomb')" style="flex: 1; padding: 6px 6px; border-radius: 9px; border: 1px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.04); cursor: pointer; text-align: center; transition: all 0.2s;">
                                <div style="font-size: 11px; font-weight: 700; color: #cbd5e1;">💥 Hazır Bomba</div>
                                <div style="font-size: 9.5px; color: var(--gold-light); font-weight: 800; margin-top: 2px;">300 💰 Altın</div>
                            </div>
                        </div>
                    </div>`;

if (!html.includes(oldPreviewChips)) {
    console.error('FAIL: oldPreviewChips not found');
    process.exit(1);
}
html = html.replace(oldPreviewChips, newPreviewChips);
console.log('✓ 4. HTML: Pre-game booster chips integrated into level preview modal');

// -------------------------------------------------------------
// 5. HTML: SCREEN-STORE 4TH CATEGORY (4 MYTHIC BOOSTERS + CAN)
// -------------------------------------------------------------
const oldStoreBoosters = `                    <!-- KATEGORİ 4: TAPINAK GÜÇLENDİRİCİLERİ & CAN -->
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
                    </div>`;

const newStoreBoosters = `                    <!-- KATEGORİ 4: TAPINAK GÜÇLENDİRİCİLERİ & CAN (OYUN İÇİ PARAYLA) -->
                    <div style="font-size: 12.5px; font-weight: 800; color: #cbd5e1; margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 5px;">
                        🧪 TAPINAK GÜÇLENDİRİCİLERİ & CAN
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

                        <!-- 5. Energy Refill -->
                        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 11px; display: flex; align-items: center; justify-content: space-between;">
                            <div>
                                <div style="font-weight: 800; font-size: 13px; color: #fff;">🧪 Nektar İksiri</div>
                                <div style="font-size: 10px; color: #94a3b8; margin-top: 2px;">Tüm canlarını (5/5) anında yeniler.</div>
                            </div>
                            <button class="btn-action" style="width: auto; min-width: 78px; padding: 0 12px; height: 34px; font-size: 12px; background: linear-gradient(180deg, #0284c7 0%, #0369a1 100%); color: #fff;" onclick="buyItem('energy', 10, 'gems')">10 💎</button>
                        </div>
                    </div>`;

if (!html.includes(oldStoreBoosters)) {
    console.error('FAIL: oldStoreBoosters not found');
    process.exit(1);
}
html = html.replace(oldStoreBoosters, newStoreBoosters);
console.log('✓ 5. HTML: Screen store category 4 updated with 4 mythic boosters and inventory counts');

// -------------------------------------------------------------
// 6. JAVASCRIPT: DEFAULTSTATE INVENTORY & PERSISTENCE
// -------------------------------------------------------------
html = html.replace(
    'inventory: { zeus: 1, athena: 1, poseidon: 0 },',
    'inventory: { zeus: 2, athena: 2, hermes: 2, ares: 1 },'
);

const oldLoadInv = `                if (!gameState.inventory) gameState.inventory = { zeus: 2, athena: 2, poseidon: 1 };
                if (gameState.inventory.zeus === undefined || gameState.inventory.zeus === 0) gameState.inventory.zeus = 2;
                if (gameState.inventory.athena === undefined || gameState.inventory.athena === 0) gameState.inventory.athena = 2;`;

const newLoadInv = `                if (!gameState.inventory) gameState.inventory = { zeus: 2, athena: 2, hermes: 2, ares: 1 };
                if (gameState.inventory.zeus === undefined) gameState.inventory.zeus = 2;
                if (gameState.inventory.athena === undefined) gameState.inventory.athena = 2;
                if (gameState.inventory.hermes === undefined) gameState.inventory.hermes = 2;
                if (gameState.inventory.ares === undefined) gameState.inventory.ares = 1;`;

if (!html.includes(oldLoadInv)) {
    console.error('FAIL: oldLoadInv not found');
    process.exit(1);
}
html = html.replace(oldLoadInv, newLoadInv);
console.log('✓ 6. JS: defaultState inventory & loadGame fallback extended for hermes & ares');

// -------------------------------------------------------------
// 7. JAVASCRIPT: BOOSTER UNLOCKS, USEPOWERUP, QUICK BUY & PRE-GAME BOOSTERS
// -------------------------------------------------------------
const oldUsePowerupChunk = `        function usePowerup(godType) {
            if (!gameState.inventory[godType] || gameState.inventory[godType] <= 0) {
                showToast("Bu güçlendirmeye sahip değilsin. Pazar'dan satın alabilirsin!", "error");
                return;
            }
            
            gameState.inventory[godType]--;
            saveGame();
            updateGameplayPowerups();

            if (godType === 'zeus') {
                spawnFloatingCombo("⚡ ZEUS YILDIRIMI! ⚡");
                triggerScreenShake();
                const cells = document.getElementById('game-grid').children;
                const validCells = [];
                for(let r=0; r<8; r++) {
                    for(let c=0; c<8; c++) {
                        if (gridData[r][c] !== null) validCells.push({r,c});
                    }
                }
                validCells.sort(() => Math.random() - 0.5);
                const targets = validCells.slice(0, 5);
                targets.forEach(t => {
                    const idx = t.r * 8 + t.c;
                    if (cells[idx]) cells[idx].classList.add('exploding');
                    gridData[t.r][t.c] = null;
                });
                gameScore += 2500;
                document.getElementById('game-score').innerText = gameScore.toLocaleString();
            } else if (godType === 'athena') {
                gameMoves += 5;
                document.getElementById('game-moves').innerText = gameMoves;
                spawnFloatingCombo("🛡️ ATHENA LÜTFU! +5 HAMLE 🛡️");
                triggerScreenShake();
            }

            setTimeout(() => {
                applyGravityAndRefill(1);
            }, 240);
        }

        function updateGameplayPowerups() {
            const btnZeus = document.getElementById('btn-powerup-zeus');
            const lblZeus = document.getElementById('lbl-powerup-zeus');
            const btnAthena = document.getElementById('btn-powerup-athena');
            const lblAthena = document.getElementById('lbl-powerup-athena');

            const zCount = (gameState.inventory && gameState.inventory.zeus) || 0;
            const aCount = (gameState.inventory && gameState.inventory.athena) || 0;

            if(btnZeus && lblZeus) {
                lblZeus.innerText = \`\${zCount}x\`;
                if(zCount > 0) {
                    btnZeus.classList.add('glow');
                    lblZeus.classList.remove('empty');
                    btnZeus.disabled = false;
                } else {
                    btnZeus.classList.remove('glow');
                    lblZeus.classList.add('empty');
                    btnZeus.disabled = false; // keep clickable so toast message informs player
                }
            }

            if(btnAthena && lblAthena) {
                lblAthena.innerText = \`\${aCount}x\`;
                if(aCount > 0) {
                    btnAthena.classList.add('glow');
                    lblAthena.classList.remove('empty');
                    btnAthena.disabled = false;
                } else {
                    btnAthena.classList.remove('glow');
                    lblAthena.classList.add('empty');
                    btnAthena.disabled = false;
                }
            }
        }`;

const newUsePowerupChunk = `        // KUTSAL JOKER KİLİTLERİ (Kademeli Açılma: Seviye 5 Zeus, Seviye 7 Hermes, Seviye 10 Athena, Seviye 15 Ares)
        const BOOSTER_UNLOCKS = {
            zeus: 5,
            hermes: 7,
            athena: 10,
            ares: 15
        };

        const BOOSTER_CONFIG = {
            zeus: { name: "Zeus Şimşeği", icon: "⚡", desc: "Rastgele 5 taşı anında yok eder.", goldCost: 250, countGold: 1, gemsCost: 10, countGems: 3 },
            hermes: { name: "Hermes Kasırgası", icon: "🌪️", desc: "Tahtayı tazeleyip garantili kombo eşleşmesi üretir.", goldCost: 200, countGold: 1, gemsCost: 8, countGems: 3 },
            athena: { name: "Athena Kalkanı", icon: "🛡️", desc: "Mevcut oyuna anında +5 hamle ekler.", goldCost: 350, countGold: 1, gemsCost: 12, countGems: 3 },
            ares: { name: "Ares Gazabı", icon: "💥", desc: "Tahtadaki en yaygın renkteki tüm taşları süpernova ile patlatır.", goldCost: 500, countGold: 1, gemsCost: 15, countGems: 3 }
        };

        let activeQuickBuyGod = null;

        function openQuickBoosterBuy(godType) {
            activeQuickBuyGod = godType;
            const cfg = BOOSTER_CONFIG[godType] || BOOSTER_CONFIG.zeus;
            
            const iconEl = document.getElementById('quick-buy-icon');
            const titleEl = document.getElementById('quick-buy-title');
            const descEl = document.getElementById('quick-buy-desc');
            const goldBalEl = document.getElementById('quick-buy-gold-bal');
            const gemsBalEl = document.getElementById('quick-buy-gems-bal');
            const btnGold = document.getElementById('btn-quick-buy-gold');
            const btnGems = document.getElementById('btn-quick-buy-gems');

            if (iconEl) iconEl.innerText = cfg.icon;
            if (titleEl) titleEl.innerText = \`\${cfg.name.toUpperCase()} TÜKENDİ!\`;
            if (descEl) descEl.innerText = cfg.desc;
            if (goldBalEl) goldBalEl.innerText = (gameState.gold || 0).toLocaleString();
            if (gemsBalEl) gemsBalEl.innerText = (gameState.gems || 0).toLocaleString();
            if (btnGold) btnGold.innerText = \`💰 \${cfg.countGold} ADET SATIN AL (\${cfg.goldCost} Altın)\`;
            if (btnGems) btnGems.innerText = \`💎 \${cfg.countGems}'LÜ PAKET AL (\${cfg.gemsCost} Elmas)\`;

            openModal('modal-quick-booster-buy');
        }

        function executeQuickBoosterPurchase(currency) {
            if (!activeQuickBuyGod) return;
            const cfg = BOOSTER_CONFIG[activeQuickBuyGod];
            if (!cfg) return;

            if (currency === 'gold') {
                if ((gameState.gold || 0) < cfg.goldCost) {
                    showToast("Yeterli altının yok! Bölüm geçerek altın kazanabilirsin.", "error");
                    return;
                }
                gameState.gold -= cfg.goldCost;
                if (!gameState.inventory) gameState.inventory = {};
                gameState.inventory[activeQuickBuyGod] = (gameState.inventory[activeQuickBuyGod] || 0) + cfg.countGold;
                showToast(\`\${cfg.name} (\${cfg.countGold}x) satın alındı!\`, "success");
            } else if (currency === 'gems') {
                if ((gameState.gems || 0) < cfg.gemsCost) {
                    showToast("Yeterli elmasın yok! Mağaza'dan temin edebilirsin.", "error");
                    return;
                }
                gameState.gems -= cfg.gemsCost;
                if (!gameState.inventory) gameState.inventory = {};
                gameState.inventory[activeQuickBuyGod] = (gameState.inventory[activeQuickBuyGod] || 0) + cfg.countGems;
                showToast(\`\${cfg.name} 3'lü Paket satın alındı! 💎\`, "success");
            }

            saveGame();
            syncAllHUDs();
            updateGameplayPowerups();
            closeModal('modal-quick-booster-buy');

            // Hemen kullan
            const targetGod = activeQuickBuyGod;
            activeQuickBuyGod = null;
            setTimeout(() => {
                usePowerup(targetGod);
            }, 180);
        }

        function usePowerup(godType) {
            const currentLvl = gameState.currentPlayingLevel || gameState.unlockedLevel || 1;
            const reqLvl = BOOSTER_UNLOCKS[godType] || 1;

            if (currentLvl < reqLvl) {
                showToast(\`🔒 Bu güçlendirme \${reqLvl}. Bölümde açılacak!\`, "info");
                return;
            }

            if (!gameState.inventory || !gameState.inventory[godType] || gameState.inventory[godType] <= 0) {
                openQuickBoosterBuy(godType);
                return;
            }
            
            gameState.inventory[godType]--;
            saveGame();
            updateGameplayPowerups();
            syncAllHUDs();

            if (godType === 'zeus') {
                spawnFloatingCombo("⚡ ZEUS YILDIRIMI! ⚡");
                triggerScreenShake();
                triggerHaptic('heavy');
                if (typeof sfxBomb === 'function') sfxBomb();
                const cells = document.getElementById('game-grid').children;
                const validCells = [];
                for(let r=0; r<8; r++) {
                    for(let c=0; c<8; c++) {
                        if (gridData[r][c] !== null) validCells.push({r,c});
                    }
                }
                validCells.sort(() => Math.random() - 0.5);
                const targets = validCells.slice(0, 5);
                targets.forEach(t => {
                    const idx = t.r * 8 + t.c;
                    if (cells[idx]) cells[idx].classList.add('exploding');
                    gridData[t.r][t.c] = null;
                });
                gameScore += 2500;
                document.getElementById('game-score').innerText = gameScore.toLocaleString();
                setTimeout(() => { applyGravityAndRefill(1); }, 220);
            } else if (godType === 'hermes') {
                spawnFloatingCombo("🌪️ HERMES KASIRGASI! 🌪️");
                triggerScreenShake();
                triggerHaptic('medium');
                if (typeof sfxMatchCascade === 'function') sfxMatchCascade(3);
                shuffleGrid();
                renderGrid();
                gameScore += 1000;
                document.getElementById('game-score').innerText = gameScore.toLocaleString();
            } else if (godType === 'athena') {
                gameMoves += 5;
                document.getElementById('game-moves').innerText = gameMoves;
                spawnFloatingCombo("🛡️ ATHENA LÜTFU! +5 HAMLE 🛡️");
                triggerScreenShake();
                triggerHaptic('light');
                if (typeof sfxLaser === 'function') sfxLaser();
            } else if (godType === 'ares') {
                spawnFloatingCombo("💥 ARES GAZABI! SÜPERNOVA 💥");
                triggerScreenShake();
                triggerHaptic('heavy');
                if (typeof sfxBomb === 'function') sfxBomb();

                // Tahtadaki en yaygın rengi bul ve hepsini patlat
                const colorCounts = {};
                for(let r=0; r<8; r++) {
                    for(let c=0; c<8; c++) {
                        const t = gridData[r][c];
                        if (t) colorCounts[t] = (colorCounts[t] || 0) + 1;
                    }
                }
                let dominantColor = null;
                let maxFound = 0;
                for(const col in colorCounts) {
                    if (colorCounts[col] > maxFound) {
                        maxFound = colorCounts[col];
                        dominantColor = col;
                    }
                }

                if (dominantColor) {
                    const cells = document.getElementById('game-grid').children;
                    for(let r=0; r<8; r++) {
                        for(let c=0; c<8; c++) {
                            if (gridData[r][c] === dominantColor) {
                                const idx = r * 8 + c;
                                if (cells[idx]) cells[idx].classList.add('exploding');
                                gridData[r][c] = null;
                            }
                        }
                    }
                    gameScore += maxFound * 400;
                    document.getElementById('game-score').innerText = gameScore.toLocaleString();
                }
                setTimeout(() => { applyGravityAndRefill(2); }, 240);
            }
        }

        function updateGameplayPowerups() {
            const currentLvl = gameState.currentPlayingLevel || gameState.unlockedLevel || 1;
            const gods = ['zeus', 'hermes', 'athena', 'ares'];

            gods.forEach(god => {
                const btn = document.getElementById(\`btn-powerup-\${god}\`);
                const lbl = document.getElementById(\`lbl-powerup-\${god}\`);
                if (!btn || !lbl) return;

                const reqLvl = BOOSTER_UNLOCKS[god] || 1;
                const count = (gameState.inventory && gameState.inventory[god]) || 0;

                if (currentLvl < reqLvl) {
                    btn.classList.add('locked');
                    btn.classList.remove('glow');
                    lbl.innerText = \`🔒 \${reqLvl}B\`;
                    lbl.classList.add('empty');
                } else {
                    btn.classList.remove('locked');
                    lbl.innerText = \`\${count}x\`;
                    if (count > 0) {
                        btn.classList.add('glow');
                        lbl.classList.remove('empty');
                    } else {
                        btn.classList.remove('glow');
                        lbl.classList.add('empty');
                    }
                }
            });
        }

        // BÖLÜM ÖNCESİ TAKVİYE (PRE-GAME BOOSTERS) SİSTEMİ
        let preLevelBoosters = { moves: false, bomb: false };

        function togglePreBooster(type) {
            preLevelBoosters[type] = !preLevelBoosters[type];
            const chip = document.getElementById(\`chip-prebooster-\${type}\`);
            if (chip) {
                if (preLevelBoosters[type]) {
                    chip.classList.add('selected');
                } else {
                    chip.classList.remove('selected');
                }
            }
        }`;

if (!html.includes(oldUsePowerupChunk)) {
    console.error('FAIL: oldUsePowerupChunk not found');
    process.exit(1);
}
html = html.replace(oldUsePowerupChunk, newUsePowerupChunk);
console.log('✓ 7. JS: usePowerup, updateGameplayPowerups, quick buy and pre-level booster systems integrated');

// -------------------------------------------------------------
// 8. JAVASCRIPT: CONNECT PRE-LEVEL BOOSTERS IN STARTGAMEPLAYCORE
// -------------------------------------------------------------
const oldStartCoreCheck = `            isLevelEnding = false;
            isSwapping = false;
            isCascading = false;
            gameMoves = (LEVEL_DATA[lvl] || {maxMoves: 30}).maxMoves;`;

const newStartCoreCheck = `            isLevelEnding = false;
            isSwapping = false;
            isCascading = false;
            gameMoves = (LEVEL_DATA[lvl] || {maxMoves: 30}).maxMoves;

            // Apply selected pre-game boosters if player has sufficient gold
            if (preLevelBoosters.moves) {
                if ((gameState.gold || 0) >= 150) {
                    gameState.gold -= 150;
                    gameMoves += 3;
                    showToast("🛡️ +3 Ekstra Başlangıç Hamlesi Tanımlandı! (-150 Altın)", "success");
                } else {
                    showToast("Yetersiz Altın: +3 Hamle takviyesi uygulanamadı.", "info");
                }
                preLevelBoosters.moves = false;
            }

            let applyPreGameBomb = false;
            if (preLevelBoosters.bomb) {
                if ((gameState.gold || 0) >= 300) {
                    gameState.gold -= 300;
                    applyPreGameBomb = true;
                    showToast("💥 Hazır Tahta Bombası Yerleştirildi! (-300 Altın)", "success");
                } else {
                    showToast("Yetersiz Altın: Hazır bomba takviyesi uygulanamadı.", "info");
                }
                preLevelBoosters.bomb = false;
            }
            saveGame();
            syncAllHUDs();`;

if (!html.includes(oldStartCoreCheck)) {
    console.error('FAIL: oldStartCoreCheck not found');
    process.exit(1);
}
html = html.replace(oldStartCoreCheck, newStartCoreCheck);

// Inject bomb into grid if applyPreGameBomb was activated
html = html.replace(
    'buildInitialGrid();\n            renderGrid();',
    `buildInitialGrid();
            if (applyPreGameBomb && gridData && gridData[3] && gridData[3][3]) {
                gridData[3][3] = 'color_bomb';
            }
            renderGrid();`
);
console.log('✓ 8. JS: Pre-level boosters successfully hooked into startGameplayCore');

// -------------------------------------------------------------
// 9. JAVASCRIPT: UPDATE STORE UI WITH HERMES & ARES COUNTERS
// -------------------------------------------------------------
const oldStoreUi = `            if(invZ) invZ.innerText = gameState.inventory.zeus || 0;
            if(invA) invA.innerText = gameState.inventory.athena || 0;`;

const newStoreUi = `            const invH = document.getElementById('store-screen-inv-hermes');
            const invAr = document.getElementById('store-screen-inv-ares');
            if(invZ) invZ.innerText = (gameState.inventory && gameState.inventory.zeus) || 0;
            if(invH) invH.innerText = (gameState.inventory && gameState.inventory.hermes) || 0;
            if(invA) invA.innerText = (gameState.inventory && gameState.inventory.athena) || 0;
            if(invAr) invAr.innerText = (gameState.inventory && gameState.inventory.ares) || 0;`;

if (!html.includes(oldStoreUi)) {
    console.error('FAIL: oldStoreUi not found');
    process.exit(1);
}
html = html.replace(oldStoreUi, newStoreUi);
console.log('✓ 9. JS: updateStoreUI connected with Hermes and Ares live inventory counters');

// -------------------------------------------------------------
// 10. JAVASCRIPT: APPLYIAPBUNDLE EXTENSION
// -------------------------------------------------------------
html = html.replace(
    "gameState.inventory.athena = (gameState.inventory.athena || 0) + 2;\n                gameState.energy = gameState.maxEnergy || 5;",
    "gameState.inventory.athena = (gameState.inventory.athena || 0) + 2;\n                gameState.inventory.hermes = (gameState.inventory.hermes || 0) + 2;\n                gameState.inventory.ares = (gameState.inventory.ares || 0) + 1;\n                gameState.energy = gameState.maxEnergy || 5;"
);
console.log('✓ 10. JS: applyIAPBundle Starter Bundle awards all 4 boosters');

// -------------------------------------------------------------
// 11. JAVASCRIPT: RESET FULL GAME RESETS INVENTORY PROPERLY
// -------------------------------------------------------------
html = html.replace(
    "gameState.hasSeenPrologue = false;\n\n            saveGame();",
    "gameState.hasSeenPrologue = false;\n            gameState.inventory = JSON.parse(JSON.stringify(defaultState.inventory));\n\n            saveGame();"
);
console.log('✓ 11. JS: executeFullGameReset restores clean defaultState.inventory');

html = restore(html);
fs.writeFileSync('www/index.html', html, 'utf8');
console.log('\n=== ALL OVERHAUL ENHANCEMENTS APPLIED TO www/index.html! ===');

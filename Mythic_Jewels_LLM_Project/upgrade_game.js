const fs = require('fs');
const path = require('path');

let html = fs.readFileSync('index.html', 'utf8');

console.log("Upgrading Arkenya: Mythic Jewels for Mobile Play Store & Cross-Platform Release...");

// -------------------------------------------------------------
// 1. FIX BROKEN IMAGE REFERENCES
// -------------------------------------------------------------
html = html.replace(/url\(['"]hero_arkenya\.jpg['"]\)/g, "url('Assets/Art/hero_arkenya.jpg')");
html = html.replace(/bg:\s*["']hero_arkenya\.jpg["']/g, 'bg: "Assets/Art/hero_arkenya.jpg"');

// -------------------------------------------------------------
// 2. MOBILE RESPONSIVE EDGE-TO-EDGE & NOTCH SAFE AREA CSS
// -------------------------------------------------------------
const oldContainerCSS = `/* Mobile Emulator Device Frame & Responsive Mobile Layout */
        .emulator-container {
            position: relative;
            width: 420px;
            height: 860px;
            background: #000;
            border-radius: 50px;
            box-shadow: 0 0 60px rgba(0, 210, 255, 0.25), 0 20px 40px rgba(0, 0, 0, 0.9), inset 0 0 3px #333;
            border: 12px solid #1c2433;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }

        @media screen and (max-width: 768px) {
            body {
                padding: 0;
                margin: 0;
                background: #090e1a;
            }
            .emulator-container {
                width: 100vw;
                max-width: 500px;
                height: 100vh;
                height: 100dvh;
                border: none;
                border-radius: 0;
                box-shadow: none;
                padding-top: env(safe-area-inset-top);
                padding-bottom: env(safe-area-inset-bottom);
                padding-left: env(safe-area-inset-left);
                padding-right: env(safe-area-inset-right);
            }
        }`;

const newContainerCSS = `/* Mobile Native Edge-to-Edge & Responsive Shell */
        body {
            background: #04060a;
            color: #ffffff;
            width: 100vw;
            height: 100vh;
            height: 100dvh;
            margin: 0;
            padding: 0;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .emulator-container {
            position: relative;
            width: 100vw;
            max-width: 480px;
            height: 100vh;
            height: 100dvh;
            background: #090e1a;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            padding-top: env(safe-area-inset-top, 0px);
            padding-bottom: env(safe-area-inset-bottom, 0px);
            padding-left: env(safe-area-inset-left, 0px);
            padding-right: env(safe-area-inset-right, 0px);
        }

        @media (min-width: 560px) and (min-height: 850px) {
            /* Desktop / Tablet showcase frame */
            .emulator-container {
                height: 92vh;
                max-height: 900px;
                border-radius: 36px;
                box-shadow: 0 0 50px rgba(0, 210, 255, 0.25), 0 25px 60px rgba(0, 0, 0, 0.95);
                border: 4px solid #1c2433;
            }
        }`;

if (html.includes(oldContainerCSS)) {
    html = html.replace(oldContainerCSS, newContainerCSS);
} else {
    // Replace with regex fallback
    html = html.replace(/\/\* Mobile Emulator Device Frame[\s\S]*?@media screen and \(max-width: 768px\) \{[\s\S]*?\}\s*\}/, newContainerCSS);
}

// -------------------------------------------------------------
// 3. RESPONSIVE GRID CSS & CANDY CRUSH SPECIAL GEMS STYLES
// -------------------------------------------------------------
const oldGridCSS = `.grid-container {
            display: grid;
            grid-template-columns: repeat(8, 46px);
            grid-template-rows: repeat(8, 46px);
            gap: 4px;
            background: rgba(10, 15, 26, 0.94);
            border: 3px solid var(--gold-primary);
            border-radius: 14px;
            padding: 6px;
            box-shadow: 0 0 35px rgba(0,210,255,0.3);
            position: relative;
            margin: 0 auto;
        }

        .cell {
            width: 46px;
            height: 46px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 26px;
            cursor: pointer;
            touch-action: none;
            user-select: none;
            box-shadow: inset 0 2px 4px rgba(255,255,255,0.4), 0 3px 6px rgba(0,0,0,0.4);
            transition: transform 0.25s ease-in-out, opacity 0.2s, filter 0.2s;
            z-index: 10;
        }`;

const newGridCSS = `.grid-container {
            display: grid;
            grid-template-columns: repeat(8, min(44px, calc((100vw - 44px) / 8)));
            grid-template-rows: repeat(8, min(44px, calc((100vw - 44px) / 8)));
            gap: 4px;
            background: rgba(10, 15, 26, 0.96);
            border: 3px solid var(--gold-primary);
            border-radius: 16px;
            padding: 6px;
            box-shadow: 0 0 35px rgba(0,210,255,0.35), inset 0 0 20px rgba(0,0,0,0.8);
            position: relative;
            margin: 0 auto;
        }

        .cell {
            width: 100%;
            height: 100%;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            cursor: pointer;
            touch-action: none;
            user-select: none;
            position: relative;
            box-shadow: inset 0 3px 6px rgba(255,255,255,0.5), inset 0 -3px 6px rgba(0,0,0,0.4), 0 4px 8px rgba(0,0,0,0.5);
            transition: transform 0.22s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.2s, filter 0.2s;
            z-index: 10;
        }

        /* CANDY CRUSH SPECIAL GEMS AESTHETICS */
        .cell.special-line-h {
            box-shadow: inset 0 0 12px #fff, 0 0 18px #ffeb3b !important;
            animation: pulseGlow 1.2s infinite alternate;
        }
        .cell.special-line-h::after {
            content: '';
            position: absolute;
            left: 5%;
            right: 5%;
            height: 4px;
            background: #fff;
            box-shadow: 0 0 8px #fff, 0 0 14px #ffe885;
            border-radius: 2px;
            z-index: 2;
        }

        .cell.special-line-v {
            box-shadow: inset 0 0 12px #fff, 0 0 18px #00d2ff !important;
            animation: pulseGlow 1.2s infinite alternate;
        }
        .cell.special-line-v::after {
            content: '';
            position: absolute;
            top: 5%;
            bottom: 5%;
            width: 4px;
            background: #fff;
            box-shadow: 0 0 8px #fff, 0 0 14px #00d2ff;
            border-radius: 2px;
            z-index: 2;
        }

        .cell.special-bomb {
            box-shadow: inset 0 0 15px #ff5722, 0 0 22px #ff3d00 !important;
            animation: bombPulse 1s infinite alternate;
        }
        .cell.special-bomb::before {
            content: '💥';
            position: absolute;
            top: -2px;
            right: -2px;
            font-size: 14px;
            filter: drop-shadow(0 0 6px #ffeb3b);
            z-index: 3;
        }

        .cell.special-color-bomb {
            background: radial-gradient(circle, #fff 15%, #ffd700 35%, #ff007f 65%, #7928ca 100%) !important;
            box-shadow: 0 0 25px #ffe885, 0 0 45px #00d2ff !important;
            animation: rainbowSpin 3.5s linear infinite !important;
        }
        .cell.special-color-bomb::after {
            content: '⚡';
            font-size: 22px;
            color: #fff;
            text-shadow: 0 0 10px #ffe885, 0 0 20px #ff007f;
            z-index: 3;
        }

        @keyframes pulseGlow {
            0% { filter: brightness(1) drop-shadow(0 0 4px #ffe885); }
            100% { filter: brightness(1.4) drop-shadow(0 0 12px #ffe885); }
        }
        @keyframes bombPulse {
            0% { transform: scale(1); filter: brightness(1.1); }
            100% { transform: scale(1.06); filter: brightness(1.5) drop-shadow(0 0 10px #ff3d00); }
        }
        @keyframes rainbowSpin {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }

        /* LASER BEAM VFX */
        .laser-beam-h {
            position: absolute;
            left: 0;
            right: 0;
            height: 12px;
            background: linear-gradient(180deg, #fff 0%, #ffe885 50%, transparent 100%);
            box-shadow: 0 0 25px #ffe885, 0 0 50px #ff9800;
            pointer-events: none;
            z-index: 100;
            animation: beamFade 0.4s ease-out forwards;
        }
        .laser-beam-v {
            position: absolute;
            top: 0;
            bottom: 0;
            width: 12px;
            background: linear-gradient(90deg, #fff 0%, #00d2ff 50%, transparent 100%);
            box-shadow: 0 0 25px #00d2ff, 0 0 50px #0088ff;
            pointer-events: none;
            z-index: 100;
            animation: beamFade 0.4s ease-out forwards;
        }
        @keyframes beamFade {
            0% { opacity: 1; transform: scale(1); }
            100% { opacity: 0; transform: scale(1.8); }
        }

        /* ONBOARDING TUTORIAL BADGE */
        .onboarding-tutorial-banner {
            position: absolute;
            top: 95px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, rgba(15, 22, 38, 0.98), rgba(28, 36, 51, 0.98));
            border: 2px solid var(--gold-primary);
            border-radius: 16px;
            padding: 10px 18px;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.8), 0 0 20px rgba(245, 197, 66, 0.4);
            z-index: 400;
            width: 90%;
            max-width: 360px;
            animation: bannerPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes bannerPop {
            0% { opacity: 0; transform: translate(-50%, -20px) scale(0.9); }
            100% { opacity: 1; transform: translate(-50%, 0) scale(1); }
        }`;

if (html.includes(oldGridCSS)) {
    html = html.replace(oldGridCSS, newGridCSS);
} else {
    html = html.replace(/\.grid-container\s*\{[\s\S]*?\.cell\s*\{[\s\S]*?z-index:\s*10;\s*\}/, newGridCSS);
}

// -------------------------------------------------------------
// 4. LEVEL 1-5 BALANCING & ONBOARDING PROMPTS
// -------------------------------------------------------------
const oldLevelDataSnippet = `        const LEVEL_DATA = {
            1: { title: "Herkül'ün Uyanışı", desc: "Olimpos'a giden yolda ilk adımını at, taşları eşleştirerek gücünü kanıtla!", targetScore: 7500, maxMoves: 35 },
            2: { title: "Kiklop Mağarası", desc: "Tek gözlü devin dikkatini dağıtmak için hızlıca mücevherleri patlat.", targetScore: 8250, maxMoves: 32 },
            3: { title: "Minotor'un Labirenti", desc: "Karanlık dehlizlerde yolunu bulmak için zekanı kullan ve engelleri aş.", targetScore: 8500, maxMoves: 34 },
            4: { title: "Medusa'nın Gözyaşları", desc: "Taşa dönmemek için sihirli yakutları toplayarak kalkanını güçlendir.", targetScore: 10750, maxMoves: 36 },
            5: { title: "Pegasus'un Kanatları", desc: "Gökyüzüne yükselmek için aynı renkteki rüzgar taşlarını bir araya getir.", targetScore: 13500, maxMoves: 34 },`;

const newLevelDataSnippet = `        const LEVEL_DATA = {
            1: { title: "Herkül'ün Uyanışı", desc: "Olimpos'a ilk adım! 3 aynı taşı yan yana getirerek eşleştir.", targetScore: 2500, maxMoves: 35, tip: "👉 3 aynı taşı yan yana kaydırarak eşleştir!" },
            2: { title: "Kiklop Mağarası", desc: "4 taşı birleştirerek güçlü YILDIRIM KRİSTALİ oluştur!", targetScore: 4200, maxMoves: 32, tip: "⚡ 4 taşı eşleştir! Satırı yok eden Yıldırım Kristali kazan!" },
            3: { title: "Minotor'un Labirenti", desc: "T veya L şeklinde 5 taşı eşleştirerek BOMBA yarat!", targetScore: 5800, maxMoves: 30, tip: "💥 T veya L şeklinde 5 taş eşleştirerek 3x3 Bomba patlat!" },
            4: { title: "Medusa'nın Gözyaşları", desc: "5 taşı düz birleştirerek tahtayı temizleyen ZEUS KÜRESİ'ni çağır!", targetScore: 7500, maxMoves: 28, tip: "🌈 5 taşı düz birleştir! Tek bir rengi yok eden Zeus Küresi çağır!" },
            5: { title: "Pegasus'un Kanatları", desc: "Tüm güçleri birleştir! Kahraman yeteneğini ve güçlendiricileri kullan.", targetScore: 9800, maxMoves: 26, tip: "🛡️ Kombo barını doldurarak Kahraman Yeteneğini serbest bırak!" },`;

html = html.replace(oldLevelDataSnippet, newLevelDataSnippet);

// -------------------------------------------------------------
// 5. IN-APP PURCHASES & RICH STORE SCREEN UPGRADE
// -------------------------------------------------------------
const oldStoreCards = `<div style="font-size: 16px; font-weight: bold; color: #fff; margin-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 5px;">Kutsal Paketler</div>
                    <div style="display: grid; grid-template-columns: 1fr; gap: 15px;">
                        
                        <div style="background: linear-gradient(135deg, rgba(255,215,0,0.15) 0%, rgba(218,165,32,0.05) 100%); border: 1px solid var(--gold-primary); border-radius: 12px; padding: 15px; display: flex; align-items: center; justify-content: space-between;">
                            <div>
                                <div style="font-weight: 800; font-size: 15px; color: var(--gold-primary);">🎁 Zeus'un Bereket Paketi</div>
                                <div style="font-size: 12px; color: #ddd; margin-top: 5px;">15,000 💰 + 250 💎</div>
                                <div style="font-size: 10px; color: #aaa; margin-top: 2px;">En iyi başlangıç!</div>
                            </div>
                            <button class="btn-action" style="width: auto; padding: 0 20px; height: 40px; font-size: 14px; background: #fff; color: #000;" onclick="purchaseIAP('zeus_bundle', 34.99, '15,000 Altın + 250 Elmas')">₺34.99</button>
                        </div>

                        <div style="background: linear-gradient(135deg, rgba(255,0,0,0.15) 0%, rgba(139,0,0,0.05) 100%); border: 1px solid #ff4444; border-radius: 12px; padding: 15px; display: flex; align-items: center; justify-content: space-between;">
                            <div>
                                <div style="font-weight: 800; font-size: 15px; color: #ff6666;">⚔️ Ares'in Öfke Paketi</div>
                                <div style="font-size: 12px; color: #ddd; margin-top: 5px;">25x ⚡ Şimşek + 25x 🛡️ Lütuf</div>
                                <div style="font-size: 10px; color: #aaa; margin-top: 2px;">Savaşta sınır tanıma.</div>
                            </div>
                            <button class="btn-action" style="width: auto; padding: 0 20px; height: 40px; font-size: 14px; background: #fff; color: #000;" onclick="purchaseIAP('ares_bundle', 89.99, '25x Zeus Şimşek + 25x Athena Lütuf')">₺89.99</button>
                        </div>

                        <div style="background: linear-gradient(135deg, rgba(0,191,255,0.15) 0%, rgba(0,0,139,0.05) 100%); border: 1px solid #00bfff; border-radius: 12px; padding: 15px; display: flex; align-items: center; justify-content: space-between;">
                            <div>
                                <div style="font-weight: 800; font-size: 15px; color: #66ccff;">🌊 Poseidon'un İksir Çantası</div>
                                <div style="font-size: 12px; color: #ddd; margin-top: 5px;">30x 🧪 Nektar İksiri</div>
                                <div style="font-size: 10px; color: #aaa; margin-top: 2px;">Maceran hiç bitmesin.</div>
                            </div>
                            <button class="btn-action" style="width: auto; padding: 0 20px; height: 40px; font-size: 14px; background: #fff; color: #000;" onclick="purchaseIAP('poseidon_bundle', 19.99, '30x Nektar İksiri (Can)')">₺19.99</button>
                        </div>`;

const newStoreCards = `<div style="font-size: 16px; font-weight: bold; color: #fff; margin-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 5px; display: flex; justify-content: space-between; align-items: center;">
                        <span>Kutsal Paketler & Teklifler</span>
                        <button onclick="restorePurchases()" style="background: transparent; border: 1px solid rgba(255,255,255,0.3); color: #ccc; font-size: 11px; padding: 4px 10px; border-radius: 8px;">Geri Yükle</button>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr; gap: 12px;">
                        
                        <!-- STARTER BUNDLE -->
                        <div style="background: linear-gradient(135deg, rgba(255,215,0,0.22) 0%, rgba(218,165,32,0.1) 100%); border: 2px solid var(--gold-primary); border-radius: 14px; padding: 14px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 0 20px rgba(245, 197, 66, 0.25);">
                            <div>
                                <div style="display: inline-block; background: #e74c3c; color: #fff; font-size: 9px; font-weight: 900; padding: 2px 6px; border-radius: 4px; margin-bottom: 4px;">%70 İNDİRİM</div>
                                <div style="font-weight: 800; font-size: 15px; color: var(--gold-primary);">⚡ Başlangıç Efsane Paketi</div>
                                <div style="font-size: 12px; color: #eee; margin-top: 3px;">500 💎 + 5.000 💰 + 5x Şimşek + 5x Kalkan</div>
                                <div style="font-size: 11px; color: var(--accent-green); margin-top: 2px;">+ 2 Saat Sınırsız Enerji!</div>
                            </div>
                            <button class="btn-action" style="width: auto; padding: 0 16px; height: 42px; font-size: 14px; font-weight: bold; background: linear-gradient(180deg, #ffe885 0%, #f5c542 100%); color: #000; box-shadow: 0 4px 12px rgba(245, 197, 66, 0.4);" onclick="purchaseIAP('starter_bundle', 59.99, 'Başlangıç Efsane Paketi (500 💎 + 5000 💰 + Güçlendiriciler)')">₺59.99</button>
                        </div>

                        <!-- NO ADS PASS -->
                        <div style="background: linear-gradient(135deg, rgba(155, 89, 182, 0.2) 0%, rgba(142, 68, 173, 0.08) 100%); border: 1.5px solid #9b59b6; border-radius: 14px; padding: 14px; display: flex; align-items: center; justify-content: space-between;">
                            <div>
                                <div style="font-weight: 800; font-size: 15px; color: #d7bde2;">🚫 Reklamları Kaldır (Kalıcı)</div>
                                <div style="font-size: 12px; color: #ccc; margin-top: 3px;">Kesintisiz ve akıcı oyun deneyimi</div>
                                <div style="font-size: 11px; color: var(--gold-light); margin-top: 2px;">Bonus: +100 💎 Hediye!</div>
                            </div>
                            <button class="btn-action" style="width: auto; padding: 0 16px; height: 40px; font-size: 14px; font-weight: bold; background: linear-gradient(180deg, #9b59b6 0%, #8e44ad 100%); color: #fff;" onclick="purchaseIAP('no_ads', 49.99, 'Reklamları Kaldır (Kalıcı Pass + 100 💎)')">₺49.99</button>
                        </div>

                        <!-- INFINITE ENERGY -->
                        <div style="background: linear-gradient(135deg, rgba(46, 204, 113, 0.18) 0%, rgba(39, 174, 96, 0.08) 100%); border: 1.5px solid #2ecc71; border-radius: 14px; padding: 14px; display: flex; align-items: center; justify-content: space-between;">
                            <div>
                                <div style="font-weight: 800; font-size: 15px; color: #a9dfbf;">⏳ Sonsuz Enerji (2 Saat)</div>
                                <div style="font-size: 12px; color: #ccc; margin-top: 3px;">2 saat boyunca canın hiç tükenmez!</div>
                            </div>
                            <button class="btn-action" style="width: auto; padding: 0 16px; height: 40px; font-size: 14px; font-weight: bold; background: linear-gradient(180deg, #2ecc71 0%, #27ae60 100%); color: #fff;" onclick="purchaseIAP('infinite_energy', 29.99, '2 Saat Sınırsız Enerji')">₺29.99</button>
                        </div>

                        <!-- CHEST OF GEMS -->
                        <div style="background: linear-gradient(135deg, rgba(0, 210, 255, 0.2) 0%, rgba(0, 136, 255, 0.08) 100%); border: 1.5px solid #00d2ff; border-radius: 14px; padding: 14px; display: flex; align-items: center; justify-content: space-between;">
                            <div>
                                <div style="font-weight: 800; font-size: 15px; color: #80e5ff;">💎 Kutsal Elmas Sandığı</div>
                                <div style="font-size: 12px; color: #ccc; margin-top: 3px;">600 Kutsal Elmas + 2x Zeus Şimşeği</div>
                            </div>
                            <button class="btn-action" style="width: auto; padding: 0 16px; height: 40px; font-size: 14px; font-weight: bold; background: linear-gradient(180deg, #00d2ff 0%, #0088ff 100%); color: #000;" onclick="purchaseIAP('gems_chest', 129.99, 'Kutsal Elmas Sandığı (600 💎 + 2x Şimşek)')">₺129.99</button>
                        </div>

                        <!-- VAULT OF OLYMPUS -->
                        <div style="background: linear-gradient(135deg, rgba(231, 76, 60, 0.2) 0%, rgba(192, 57, 43, 0.08) 100%); border: 1.5px solid #e74c3c; border-radius: 14px; padding: 14px; display: flex; align-items: center; justify-content: space-between;">
                            <div>
                                <div style="font-weight: 800; font-size: 15px; color: #f1948a;">🏛️ Olimpos Hazine Kasası</div>
                                <div style="font-size: 12px; color: #ccc; margin-top: 3px;">2000 💎 + 20.000 💰 + 10x Tüm Güçler</div>
                            </div>
                            <button class="btn-action" style="width: auto; padding: 0 16px; height: 40px; font-size: 14px; font-weight: bold; background: linear-gradient(180deg, #e74c3c 0%, #c0392b 100%); color: #fff;" onclick="purchaseIAP('olympus_vault', 349.99, 'Olimpos Hazine Kasası (2000 💎 + 20.000 💰)')">₺349.99</button>
                        </div>`;

html = html.replace(oldStoreCards, newStoreCards);

fs.writeFileSync('index.html', html);
console.log("HTML and CSS upgraded successfully.");

const fs = require('fs');

console.log("=== APPLYING MYTHIC BOARD & GEMS UPGRADES ===");

let html = fs.readFileSync('www/index.html', 'utf8');

// 1. Check existing .grid-area-wrapper
const oldGridAreaWrapper = `<div class="grid-area-wrapper">
                    <!-- 8x8 Candy Match Grid -->
                    <div class="grid-container" id="game-grid"></div>
                </div>`;

const newGridAreaWrapper = `<div class="grid-area-wrapper mythic-shrine-altar">
                    <!-- Antik Olimpos Tapınak Alınlığı / Sunağı Üst Başlığı -->
                    <div class="mythic-altar-pediment">
                        <div class="altar-meander-frieze">
                            <span class="meander-glyph">☲☲☲</span>
                        </div>
                        <div class="altar-pediment-emblem">
                            <span class="altar-rune-sigil">✦</span>
                            <span class="altar-title-txt">ARKENYA KADİM SUNAĞI</span>
                            <span class="altar-rune-sigil">✦</span>
                        </div>
                        <div class="altar-meander-frieze">
                            <span class="meander-glyph">☲☲☲</span>
                        </div>
                    </div>

                    <!-- 4 Köşe Olimpos Altın Dirsekleri (Absolute positioned outside #game-grid) -->
                    <div class="shrine-corner shrine-corner-tl" aria-hidden="true"></div>
                    <div class="shrine-corner shrine-corner-tr" aria-hidden="true"></div>
                    <div class="shrine-corner shrine-corner-bl" aria-hidden="true"></div>
                    <div class="shrine-corner shrine-corner-br" aria-hidden="true"></div>

                    <!-- 8x8 Candy Match Grid (Sadece 64 hücre içerir, script & index uyumlu) -->
                    <div class="grid-container" id="game-grid"></div>

                    <!-- Antik Olimpos Tapınak Kaidesi (Plinth) -->
                    <div class="mythic-altar-plinth">
                        <div class="plinth-fluting"></div>
                        <div class="plinth-sigil-badge">
                            <span class="plinth-star">★</span>
                            <span class="plinth-txt">OLİMPOS MÜHÜRLERİ</span>
                            <span class="plinth-star">★</span>
                        </div>
                        <div class="plinth-fluting"></div>
                    </div>
                </div>`;

if (html.includes(oldGridAreaWrapper)) {
    html = html.replace(oldGridAreaWrapper, newGridAreaWrapper);
    console.log("  [SUCCESS] Replaced grid-area-wrapper with mythic-shrine-altar structure!");
} else {
    console.warn("  [WARN] exact oldGridAreaWrapper not matched directly, looking for partial match...");
    const regex = /<div class="grid-area-wrapper">[\s\S]*?<div class="grid-container" id="game-grid"><\/div>\s*<\/div>/;
    if (regex.test(html)) {
        html = html.replace(regex, newGridAreaWrapper);
        console.log("  [SUCCESS] Replaced grid-area-wrapper via regex!");
    } else {
        console.error("  [FAIL] Could not match grid-area-wrapper!");
        process.exit(1);
    }
}

// 2. Add New CSS for Altar, Faceted Jewels, Specular Highlights, Sockets and HUD
const mythicBoardAndGemsCss = `
        /* ========================================================= */
        /* --- KADİM OLİMPOS TAPINAK SUNAĞI & MİTOLOJİK TAŞ STİLLERİ --- */
        /* ========================================================= */
        .mythic-shrine-altar {
            position: relative;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 2px;
        }

        /* Tapınak Üst Alınlığı (Pediment / Architrave) */
        .mythic-altar-pediment {
            width: calc(100% - 12px);
            max-width: 366px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: linear-gradient(180deg, rgba(32, 24, 10, 0.96) 0%, rgba(14, 10, 4, 0.94) 100%);
            border: 1.5px solid var(--gold-primary);
            border-bottom: none;
            border-radius: 10px 10px 0 0;
            padding: 3px 10px;
            box-sizing: border-box;
            box-shadow: 0 -3px 10px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 232, 133, 0.4);
            position: relative;
            z-index: 2;
        }

        .altar-meander-frieze {
            font-size: 9px;
            color: var(--gold-dark);
            letter-spacing: 2px;
            opacity: 0.75;
            user-select: none;
        }

        .altar-pediment-emblem {
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .altar-rune-sigil {
            font-size: 9px;
            color: var(--gold-light);
            text-shadow: 0 0 6px rgba(255, 215, 0, 0.8);
            animation: runeSigilPulse 2s infinite alternate ease-in-out;
        }

        @keyframes runeSigilPulse {
            0% { transform: scale(0.9); opacity: 0.7; filter: drop-shadow(0 0 2px #ffd700); }
            100% { transform: scale(1.15); opacity: 1; filter: drop-shadow(0 0 7px #fff); }
        }

        .altar-title-txt {
            font-size: 9.5px;
            font-weight: 900;
            letter-spacing: 1.2px;
            color: var(--gold-light);
            text-transform: uppercase;
            text-shadow: 0 1px 3px rgba(0, 0, 0, 0.9), 0 0 8px rgba(245, 197, 66, 0.5);
        }

        /* 4 Köşe Altın Dirsekleri (Acanthus Corner Filigrees) */
        .shrine-corner {
            position: absolute;
            width: 16px;
            height: 16px;
            pointer-events: none;
            z-index: 15;
            filter: drop-shadow(0 0 4px rgba(255, 215, 0, 0.7));
        }

        .shrine-corner-tl {
            top: 22px;
            left: 2px;
            border-top: 2.5px solid #ffe885;
            border-left: 2.5px solid #ffe885;
            border-top-left-radius: 6px;
        }

        .shrine-corner-tr {
            top: 22px;
            right: 2px;
            border-top: 2.5px solid #ffe885;
            border-right: 2.5px solid #ffe885;
            border-top-right-radius: 6px;
        }

        .shrine-corner-bl {
            bottom: 22px;
            left: 2px;
            border-bottom: 2.5px solid #ffe885;
            border-left: 2.5px solid #ffe885;
            border-top-left-radius: 0;
            border-bottom-left-radius: 6px;
        }

        .shrine-corner-br {
            bottom: 22px;
            right: 2px;
            border-bottom: 2.5px solid #ffe885;
            border-right: 2.5px solid #ffe885;
            border-bottom-right-radius: 6px;
        }

        /* Tapınak Kaidesi (Plinth / Base) */
        .mythic-altar-plinth {
            width: calc(100% - 12px);
            max-width: 366px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: linear-gradient(180deg, rgba(14, 10, 4, 0.94) 0%, rgba(32, 24, 10, 0.96) 100%);
            border: 1.5px solid var(--gold-primary);
            border-top: none;
            border-radius: 0 0 10px 10px;
            padding: 3px 12px;
            box-sizing: border-box;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.7), inset 0 -1px 1px rgba(255, 232, 133, 0.3);
            position: relative;
            z-index: 2;
        }

        .plinth-fluting {
            flex: 1;
            height: 2px;
            background: linear-gradient(90deg, transparent, var(--gold-dark), transparent);
        }

        .plinth-sigil-badge {
            display: flex;
            align-items: center;
            gap: 5px;
            padding: 0 8px;
        }

        .plinth-star {
            font-size: 8px;
            color: var(--gold-light);
        }

        .plinth-txt {
            font-size: 8.5px;
            font-weight: 800;
            letter-spacing: 1.5px;
            color: #d1d5db;
            text-transform: uppercase;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
        }

        /* Yenilenmiş Izgara Kutusu (Altar Cell Matrix Frame) */
        .grid-container {
            display: grid;
            grid-template-columns: repeat(8, min(44px, calc((100vw - 44px) / 8)));
            grid-template-rows: repeat(8, min(44px, calc((100vw - 44px) / 8)));
            gap: 4px;
            background: radial-gradient(circle at 50% 50%, rgba(20, 26, 44, 0.97) 0%, rgba(6, 9, 16, 0.99) 100%);
            border: 2.5px solid var(--gold-primary);
            border-radius: 14px;
            padding: 6px;
            box-shadow: 0 0 35px rgba(0, 210, 255, 0.35), inset 0 0 25px rgba(0, 0, 0, 0.9), 0 8px 30px rgba(0, 0, 0, 0.8);
            position: relative;
            margin: 0 auto;
            contain: layout style;
            outline: 1.5px solid rgba(255, 215, 0, 0.35);
            outline-offset: -5px;
        }

        /* ========================================================= */
        /* --- KADİM OLİMPOS MÜCEVHERLERİ & YÖNLÜ KRİSTAL KESİMLERİ --- */
        /* ========================================================= */
        .cell {
            width: 100%;
            height: 100%;
            border-radius: 11px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 22px;
            cursor: pointer;
            touch-action: none;
            user-select: none;
            position: relative;
            border: 1.5px solid rgba(255, 255, 255, 0.4);
            box-shadow: inset 0 2px 4px rgba(255,255,255,0.7), inset 0 -3px 6px rgba(0,0,0,0.75), 0 4px 10px rgba(0,0,0,0.6);
            transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.2s, filter 0.2s;
            will-change: transform;
            contain: layout style;
            z-index: 10;
            overflow: hidden;
        }

        /* Kristal Üst Faset Parıltısı (Specular Facet Highlight) */
        .cell::before {
            content: '';
            position: absolute;
            top: 2px;
            left: 3px;
            right: 3px;
            height: 36%;
            background: linear-gradient(180deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.08) 100%);
            border-radius: 7px 7px 11px 11px;
            pointer-events: none;
            z-index: 1;
        }

        /* İkon Mitolojik Kabartma */
        .cell span, .cell {
            text-shadow: 0 1px 3px rgba(0, 0, 0, 0.9), 0 0 6px rgba(255, 215, 0, 0.5);
        }

        /* 1. KIZIL YAKUT: ARES'İN SAVAŞ MÜHRÜ */
        .cell-red { 
            background: radial-gradient(circle at 30% 25%, #ff7675 0%, #d63031 35%, #961214 70%, #4a0305 100%);
            border-color: rgba(255, 160, 160, 0.8);
            box-shadow: inset 0 2px 5px rgba(255,255,255,0.85), inset 0 -4px 7px rgba(0,0,0,0.85), inset 0 0 10px rgba(255,50,50,0.5), 0 4px 12px rgba(180, 20, 20, 0.5);
        }

        /* 2. DERİN SAFİR: POSEIDON'UN OKYANUS MÜHRÜ */
        .cell-blue { 
            background: radial-gradient(circle at 30% 25%, #74b9ff 0%, #0984e3 35%, #055099 70%, #031d45 100%);
            border-color: rgba(145, 205, 255, 0.8);
            box-shadow: inset 0 2px 5px rgba(255,255,255,0.85), inset 0 -4px 7px rgba(0,0,0,0.85), inset 0 0 10px rgba(0,210,255,0.5), 0 4px 12px rgba(9, 132, 227, 0.5);
        }

        /* 3. PARLAK ZÜMRÜT: DEMETER'İN YAŞAM MÜHRÜ */
        .cell-green { 
            background: radial-gradient(circle at 30% 25%, #55efc4 0%, #00b894 35%, #00735c 70%, #003328 100%);
            border-color: rgba(135, 245, 215, 0.8);
            box-shadow: inset 0 2px 5px rgba(255,255,255,0.85), inset 0 -4px 7px rgba(0,0,0,0.85), inset 0 0 10px rgba(0,245,160,0.5), 0 4px 12px rgba(0, 184, 148, 0.5);
        }

        /* 4. GÜNEŞ TOPAZI: ZEUS'UN ŞİMŞEK MÜHRÜ */
        .cell-yellow { 
            background: radial-gradient(circle at 30% 25%, #fff6cc 0%, #f9ca24 35%, #e19d00 70%, #6b4700 100%);
            border-color: rgba(255, 235, 150, 0.95);
            box-shadow: inset 0 2px 5px rgba(255,255,255,0.95), inset 0 -4px 7px rgba(0,0,0,0.85), inset 0 0 12px rgba(255,230,100,0.65), 0 4px 14px rgba(245, 197, 66, 0.6);
        }

        /* 5. GÖLGE AMETİSTİ: HADES'İN YERALTI MÜHRÜ */
        .cell-purple { 
            background: radial-gradient(circle at 30% 25%, #d1c4e9 0%, #8e44ad 35%, #5b1e77 70%, #280838 100%);
            border-color: rgba(215, 185, 255, 0.8);
            box-shadow: inset 0 2px 5px rgba(255,255,255,0.85), inset 0 -4px 7px rgba(0,0,0,0.85), inset 0 0 10px rgba(186,104,200,0.5), 0 4px 12px rgba(142, 68, 173, 0.5);
        }

        /* Seçili Taş İlahi Altın Halesi */
        .cell.selected {
            outline: 3px solid #ffe885 !important;
            box-shadow: 0 0 25px #ffe885, inset 0 0 12px rgba(255,255,255,0.9) !important;
            transform: scale(1.14) !important;
            z-index: 50 !important;
            animation: selectedGlow 0.8s infinite alternate !important;
        }

        /* ========================================================= */
        /* --- MİTOLOJİK HUD & BİLGİ TABLETLERİ GELİŞTİRMELERİ --- */
        /* ========================================================= */
        .stat-box-game {
            background: linear-gradient(135deg, rgba(22, 28, 44, 0.95) 0%, rgba(10, 14, 24, 0.98) 100%);
            border: 1.8px solid var(--gold-primary);
            border-radius: 11px;
            padding: 4px 10px;
            text-align: center;
            box-shadow: 0 4px 15px rgba(0,0,0,0.7), inset 0 1px 2px rgba(255,232,133,0.35), 0 0 10px rgba(245, 197, 66, 0.25);
            min-width: 66px;
            position: relative;
        }

        .stat-box-game::before {
            content: '✦';
            position: absolute;
            top: -6px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 8px;
            color: var(--gold-light);
            text-shadow: 0 0 4px rgba(255,215,0,0.8);
        }

        .stat-lbl {
            font-size: 8.5px;
            color: #cbd5e1;
            font-weight: 800;
            letter-spacing: 0.8px;
            text-transform: uppercase;
        }

        .stat-num {
            font-size: 17px;
            font-weight: 900;
            color: var(--gold-light);
            text-shadow: 0 0 10px rgba(245, 197, 66, 0.6), 0 2px 4px rgba(0,0,0,0.9);
        }

        .hero-ability-card {
            display: flex;
            align-items: center;
            gap: 10px;
            background: linear-gradient(135deg, rgba(20, 26, 40, 0.95) 0%, rgba(8, 12, 22, 0.95) 100%);
            border: 1.5px solid var(--gold-primary);
            border-radius: 14px;
            padding: 6px 14px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.25);
        }

        .ability-btn-use {
            padding: 10px 18px;
            background: linear-gradient(180deg, #00d2ff 0%, #0066cc 100%);
            border: 1.5px solid rgba(255,255,255,0.4);
            border-radius: 12px;
            color: #fff;
            font-weight: 900;
            font-size: 12px;
            cursor: pointer;
            letter-spacing: 0.5px;
            box-shadow: 0 4px 15px rgba(0, 102, 204, 0.5), inset 0 1px 2px rgba(255,255,255,0.6);
            transition: all 0.25s ease;
        }
`;

// Insert the CSS before </style>
const styleClosingTag = '</style>';
const lastStyleIdx = html.lastIndexOf(styleClosingTag);
if (lastStyleIdx !== -1) {
    html = html.substring(0, lastStyleIdx) + '\n' + mythicBoardAndGemsCss + '\n' + html.substring(lastStyleIdx);
    console.log("  [SUCCESS] Injected Mythic Board & Gems CSS into index.html!");
} else {
    console.error("  [FAIL] Could not find </style> tag!");
    process.exit(1);
}

// Write back to www/index.html
fs.writeFileSync('www/index.html', html, 'utf8');
console.log("  [SUCCESS] www/index.html updated successfully!");
console.log("  New File Size:", fs.statSync('www/index.html').size, "bytes");

const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log("=== ARKENYA: REDESIGNING TOP HUD (ELEGANT ENERGY, STAGE, SCORE & CURRENCIES) ===");

const filePath = path.join(__dirname, 'www', 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. NEW TOP HUD CSS
const newTopHudCSS = `
        /* --- AAA LUXURY MITOLOJİK TOP HUD STYLING --- */
        .top-hud {
            min-height: 72px;
            padding-top: max(38px, env(safe-area-inset-top));
            padding-left: 10px;
            padding-right: 10px;
            padding-bottom: 6px;
            background: linear-gradient(180deg, rgba(4, 6, 12, 0.98) 0%, rgba(4, 6, 12, 0.85) 65%, rgba(4, 6, 12, 0) 100%);
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 6px;
            z-index: 200;
            box-sizing: border-box;
            width: 100%;
        }

        /* 1. HERO PROFILE PILL (SOL) */
        .hud-profile-card {
            display: flex;
            align-items: center;
            gap: 6px;
            background: linear-gradient(135deg, rgba(20, 26, 40, 0.95), rgba(8, 12, 20, 0.95));
            border: 1.5px solid var(--gold-primary);
            padding: 3px 8px 3px 3px;
            border-radius: 20px;
            cursor: pointer;
            box-shadow: 0 0 10px rgba(245, 197, 66, 0.35);
            transition: transform 0.15s ease;
        }
        .hud-profile-card:active {
            transform: scale(0.96);
        }
        .hud-avatar-wrapper {
            position: relative;
        }
        .avatar-img-real {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            border: 1.5px solid var(--gold-primary);
            background-size: cover;
            background-position: center top;
            box-shadow: 0 0 8px rgba(245, 197, 66, 0.6);
        }
        .avatar-crest {
            position: absolute;
            bottom: -3px;
            right: -3px;
            font-size: 10px;
            filter: drop-shadow(0 1px 2px #000);
        }
        .hud-profile-text {
            display: flex;
            flex-direction: column;
            line-height: 1.1;
        }
        .player-name {
            font-size: 10.5px;
            font-weight: 900;
            color: var(--gold-light);
            letter-spacing: 0.4px;
        }
        .player-level-badge {
            font-size: 9px;
            font-weight: 800;
            color: var(--accent-blue);
        }

        /* 2. STAGE & SCORE VAULT (ORTA) */
        .hud-center-pill {
            background: linear-gradient(135deg, rgba(28, 22, 10, 0.95), rgba(12, 9, 4, 0.95));
            border: 1.5px solid var(--gold-primary);
            border-radius: 14px;
            padding: 3px 10px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 12px rgba(245, 197, 66, 0.3);
            cursor: pointer;
            min-width: 82px;
            transition: transform 0.15s ease;
        }
        .hud-center-pill:active {
            transform: scale(0.96);
        }
        .hud-stage-row {
            display: flex;
            align-items: center;
            gap: 4px;
            line-height: 1;
        }
        .hud-stage-chip {
            font-size: 9.5px;
            font-weight: 900;
            color: var(--gold-light);
            letter-spacing: 0.5px;
        }
        .hud-biome-chip {
            font-size: 8px;
            color: #8bb3f8;
            font-weight: 700;
        }
        .hud-score-row {
            display: flex;
            align-items: center;
            gap: 3px;
            margin-top: 2px;
            line-height: 1;
        }
        .hud-score-icon {
            font-size: 10px;
        }
        .hud-score-value {
            font-size: 11px;
            font-weight: 900;
            color: #fff;
        }
        .hud-score-label {
            font-size: 7.5px;
            color: #aaa;
            font-weight: 800;
        }

        /* 3. STATS & CURRENCIES (SAĞ) */
        .hud-stats-group {
            display: flex;
            align-items: center;
            gap: 5px;
        }

        /* ENERJİ / CAN ŞIK ROZETİ (CANDY CRUSH / ROYAL MATCH STİLİ) */
        .hud-energy-shield {
            background: linear-gradient(135deg, rgba(16, 24, 40, 0.96), rgba(8, 14, 24, 0.96));
            border: 1.5px solid #00d2ff;
            border-radius: 12px;
            padding: 3px 6px;
            display: flex;
            flex-direction: column;
            align-items: center;
            box-shadow: 0 0 10px rgba(0, 210, 255, 0.35);
            cursor: pointer;
            min-width: 50px;
        }
        .energy-top-row {
            display: flex;
            align-items: center;
            gap: 3px;
            line-height: 1;
        }
        .energy-lightning-icon {
            font-size: 13px;
            color: #ffe885;
            filter: drop-shadow(0 0 4px #ffd32a);
            animation: lightningGlow 2s infinite alternate;
        }
        @keyframes lightningGlow {
            0% { filter: drop-shadow(0 0 2px #ffe885); }
            100% { filter: drop-shadow(0 0 6px #00d2ff); }
        }
        .energy-numeric-count {
            font-size: 12px;
            font-weight: 900;
            color: #fff;
        }
        .energy-pips-container {
            display: flex;
            gap: 2px;
            margin-left: 2px;
        }
        .energy-pip {
            width: 4px;
            height: 7px;
            border-radius: 1.5px;
            background: rgba(255, 255, 255, 0.18);
            transition: all 0.3s ease;
        }
        .energy-pip.active {
            background: linear-gradient(180deg, #ffe885, #00d2ff);
            box-shadow: 0 0 4px #00d2ff;
        }
        .energy-timer-pill {
            font-size: 8px;
            font-weight: 800;
            color: #a0d8ef;
            letter-spacing: 0.2px;
            line-height: 1;
            margin-top: 2px;
        }

        /* CURRENCY PILLS */
        .hud-currency-pill {
            background: linear-gradient(135deg, rgba(22, 18, 10, 0.9), rgba(12, 9, 4, 0.9));
            border: 1px solid var(--gold-primary);
            border-radius: 11px;
            padding: 3px 6px;
            font-size: 10.5px;
            font-weight: 800;
            display: flex;
            align-items: center;
            gap: 3px;
            cursor: pointer;
            box-shadow: 0 2px 6px rgba(0,0,0,0.5);
            color: #fff;
        }
        .hud-currency-pill.gems-pill {
            border-color: #00d2ff;
            background: linear-gradient(135deg, rgba(10, 20, 32, 0.9), rgba(4, 10, 18, 0.9));
            box-shadow: 0 0 8px rgba(0, 210, 255, 0.25);
        }
        .btn-hud-home {
            background: rgba(245, 197, 66, 0.18);
            border: 1.5px solid var(--gold-primary);
            color: var(--gold-light);
            font-size: 12px;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 6px rgba(245, 197, 66, 0.3);
            transition: transform 0.15s ease;
        }
        .btn-hud-home:active {
            transform: scale(0.90);
        }
`;

// Replace old .top-hud CSS block
const oldTopHudCSSRegex = /\.top-hud\s*\{[\s\S]*?\.btn-header-home\s*\{[\s\S]*?\n\s*\}/;
if (oldTopHudCSSRegex.test(content)) {
    content = content.replace(oldTopHudCSSRegex, newTopHudCSS);
    console.log("✔ Replaced old top-hud CSS with AAA luxury design");
} else {
    content = content.replace('</style>', newTopHudCSS + '\n    </style>');
    console.log("✔ Appended new AAA top-hud CSS");
}

// 2. NEW TOP HUD HTML
const newTopHudHTML = `            <!-- Global Top HUD (AAA Luxury Design) -->
            <div class="top-hud" id="global-hud" style="display: flex;">
                <!-- SOL: KAHRAMAN PROFİLİ -->
                <div class="hud-profile-card" onclick="openHeroScreen()" title="Kahraman Detayları">
                    <div class="hud-avatar-wrapper">
                        <div class="avatar-img-real" id="hud-avatar"></div>
                        <div class="avatar-crest">👑</div>
                    </div>
                    <div class="hud-profile-text">
                        <span class="player-name" id="hud-name">ASTERION</span>
                        <span class="player-level-badge" id="hud-lvl">Lv. 1</span>
                    </div>
                </div>
                
                <!-- ORTA: BÖLÜM VE PUAN ROZETİ -->
                <div class="hud-center-pill" onclick="openWorldMap()" title="Haritayı Aç & İlerleme">
                    <div class="hud-stage-row">
                        <span class="hud-stage-chip" id="hud-stage-text">BÖLÜM 1</span>
                        <span class="hud-biome-chip" id="hud-biome-name">Kristal Vadi</span>
                    </div>
                    <div class="hud-score-row">
                        <span class="hud-score-icon">🏆</span>
                        <span class="hud-score-value" id="hud-total-score">0</span>
                        <span class="hud-score-label">PUAN</span>
                    </div>
                </div>

                <!-- SAĞ: CAN / ENERJİ, ALTIN, ELMAS & EV BUTONU -->
                <div class="hud-stats-group">
                    <!-- CAN / ENERJİ ŞIK GÖSTERGESİ -->
                    <div class="hud-energy-shield" id="hud-energy-shield" onclick="openDailyRewardsModal()" title="Kutsal Can">
                        <div class="energy-top-row">
                            <span class="energy-lightning-icon">⚡</span>
                            <span class="energy-numeric-count" id="hud-energy-count">5</span>
                            <div class="energy-pips-container" id="hud-energy-pips">
                                <span class="energy-pip active"></span>
                                <span class="energy-pip active"></span>
                                <span class="energy-pip active"></span>
                                <span class="energy-pip active"></span>
                                <span class="energy-pip active"></span>
                            </div>
                        </div>
                        <div class="energy-timer-pill" id="hud-energy-timer">✨ DOLU</div>
                        <span id="hud-energy" style="display:none;">5/5</span>
                    </div>

                    <!-- ALTIN -->
                    <div class="hud-currency-pill" onclick="showScreen('screen-store')" title="Altın">
                        <span>🪙</span>
                        <span id="hud-gold">0</span>
                    </div>

                    <!-- ELMAS -->
                    <div class="hud-currency-pill gems-pill" onclick="showScreen('screen-store')" title="Elmas">
                        <span>💎</span>
                        <span id="hud-gems">0</span>
                    </div>

                    <!-- HIZLI ANA MENÜ İKONU -->
                    <button class="btn-hud-home" onclick="showScreen('screen-mainmenu')" title="Ana Menü">🏛️</button>
                </div>
            </div>`;

const oldTopHudHTMLRegex = /<div class="top-hud" id="global-hud"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;
if (oldTopHudHTMLRegex.test(content)) {
    content = content.replace(oldTopHudHTMLRegex, newTopHudHTML);
    console.log("✔ Replaced old global-hud HTML with luxury 3-column layout");
} else {
    // Fallback search
    const startIdx = content.indexOf('<div class="top-hud" id="global-hud"');
    const endIdx = content.indexOf('<!-- Global Fixed Bottom Navigation Bar -->');
    if (startIdx !== -1 && endIdx !== -1) {
        content = content.substring(0, startIdx) + newTopHudHTML + '\n\n            ' + content.substring(endIdx);
        console.log("✔ Substring replacement for global-hud HTML succeeded");
    }
}

// 3. UPDATE updateHUD() FUNCTION TO POPULATE ALL NEW ELEMENTS
const newUpdateHUD = `function updateHUD() {
            const heroKey = (gameState && gameState.selectedHero && HEROES[gameState.selectedHero]) ? gameState.selectedHero : 'asterion';
            const hero = HEROES[heroKey];
            if (hero) {
                const goldEl = document.getElementById('hud-gold');
                const gemsEl = document.getElementById('hud-gems');
                const energyEl = document.getElementById('hud-energy');
                const energyCountEl = document.getElementById('hud-energy-count');
                const avatarEl = document.getElementById('hud-avatar');
                const nameEl = document.getElementById('hud-name');
                const lvlEl = document.getElementById('hud-lvl');
                const stageTextEl = document.getElementById('hud-stage-text');
                const biomeNameEl = document.getElementById('hud-biome-name');
                const totalScoreEl = document.getElementById('hud-total-score');

                if (goldEl) goldEl.innerText = (gameState.gold >= 1000 ? (gameState.gold/1000).toFixed(1) + 'K' : (gameState.gold || 0));
                if (gemsEl) gemsEl.innerText = (gameState.gems >= 1000 ? (gameState.gems/1000).toFixed(1) + 'K' : (gameState.gems || 0));
                if (energyEl) energyEl.innerText = \`\${gameState.energy}/\${gameState.maxEnergy || 5}\`;
                if (energyCountEl) energyCountEl.innerText = \`\${gameState.energy}\`;
                if (avatarEl) avatarEl.style.backgroundImage = \`url('\${hero.bg}')\`;
                if (nameEl) nameEl.innerText = hero.name;
                if (lvlEl) lvlEl.innerText = \`Lv. \${gameState.playerLevel || 1}\`;

                // Stage & Score Updates
                const currentLvl = gameState.currentPlayingLevel || gameState.unlockedLevel || 1;
                if (stageTextEl) stageTextEl.innerText = \`BÖLÜM \${currentLvl}\`;
                const biomeId = getZoneForLevel(currentLvl);
                if (biomeNameEl && typeof BIOME_LORE !== 'undefined' && BIOME_LORE[biomeId]) {
                    biomeNameEl.innerText = BIOME_LORE[biomeId].name;
                }
                if (totalScoreEl) {
                    const sc = gameState.totalScore || 0;
                    totalScoreEl.innerText = (sc >= 10000 ? (sc/1000).toFixed(1) + 'K' : sc.toLocaleString());
                }

                // Update Energy 5-pips
                const pipsContainer = document.getElementById('hud-energy-pips');
                if (pipsContainer) {
                    const maxE = gameState.maxEnergy || 5;
                    const curE = Math.max(0, Math.min(maxE, gameState.energy || 0));
                    let pipsHTML = '';
                    for (let i = 1; i <= maxE; i++) {
                        pipsHTML += \`<span class="energy-pip \${i <= curE ? 'active' : ''}"></span>\`;
                    }
                    pipsContainer.innerHTML = pipsHTML;
                }
            }
        }`;

const oldUpdateHUDRegex = /function updateHUD\(\) \{[\s\S]*?\n\s*\}\s*\n\s*function updateHeroLockBadges/;
if (oldUpdateHUDRegex.test(content)) {
    content = content.replace(oldUpdateHUDRegex, newUpdateHUD + '\n\n        function updateHeroLockBadges');
    console.log("✔ Updated updateHUD() to drive energy pips, stage text, score, and gems");
}

// 4. SYNTAX VALIDATION VIA VM
const scriptMatch = content.match(/<script>([\s\S]*?)<\/script>/);
if (!scriptMatch) {
    throw new Error("Could not find <script> block in HTML!");
}

try {
    new vm.Script(scriptMatch[1], { filename: 'index.html' });
    console.log("✔ SUCCESS: JavaScript parsed with 0 syntax errors!");
} catch (err) {
    console.error("❌ SYNTAX ERROR DETECTED:", err.stack);
    process.exit(1);
}

// 5. WRITE TO ALL TARGETS
const targets = [
    path.join(__dirname, 'www', 'index.html'),
    path.join(__dirname, 'index.html'),
    path.join(__dirname, 'Arkenya_Playable_Demo.html'),
    path.join(__dirname, 'www', 'Arkenya_Playable_Demo.html'),
    path.join(__dirname, 'android', 'app', 'src', 'main', 'assets', 'public', 'index.html'),
    path.join(__dirname, 'android', 'app', 'src', 'main', 'assets', 'public', 'Arkenya_Playable_Demo.html'),
    path.join(__dirname, 'ios', 'App', 'App', 'public', 'index.html'),
    path.join(__dirname, 'ios', 'App', 'App', 'public', 'Arkenya_Playable_Demo.html')
];

targets.forEach(target => {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content, 'utf8');
    console.log(`✔ Synced to: ${target}`);
});

console.log("=== HUD REDESIGN APPLIED AND SYNCHRONIZED SUCCESSFULLY ===");

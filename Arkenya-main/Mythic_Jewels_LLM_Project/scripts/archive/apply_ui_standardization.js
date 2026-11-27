const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'www', 'index.html');
let content = fs.readFileSync(targetPath, 'utf8');

console.log("=== STANDARDIZING UI/UX ACTION BUTTONS FOR THEMATIC HARMONY ===");

// 1. ADD / ENHANCE CSS FOR ACTION BUTTONS (.btn-action, .btn-action-gold, .btn-action-green, .btn-action-sub)
const buttonStyles = `
        /* ==========================================
           STANDARDIZED THEMATIC ACTION BUTTON SYSTEM
           ========================================== */
        .btn-action-gold {
            background: linear-gradient(180deg, #fff3a3 0%, #f5c542 35%, #b8820c 80%, #684500 100%) !important;
            border: 2px solid #ffe885 !important;
            color: #1a0800 !important;
            font-weight: 900 !important;
            text-shadow: 0 1px 2px rgba(255, 255, 255, 0.4) !important;
            box-shadow: 0 4px 18px rgba(245, 197, 66, 0.45), inset 0 2px 4px #ffffff !important;
            cursor: pointer;
            transition: all 0.18s ease;
        }
        .btn-action-gold:active {
            transform: scale(0.97) translateY(1px) !important;
            box-shadow: 0 2px 8px rgba(245, 197, 66, 0.6) !important;
        }

        .btn-action-green {
            background: linear-gradient(180deg, #22c55e 0%, #16a34a 55%, #15803d 100%) !important;
            border: 2px solid #86efac !important;
            color: #ffffff !important;
            font-weight: 800 !important;
            text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6) !important;
            box-shadow: 0 4px 16px rgba(34, 197, 94, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.3) !important;
            cursor: pointer;
            transition: all 0.18s ease;
        }
        .btn-action-green:active {
            transform: scale(0.97) translateY(1px) !important;
            box-shadow: 0 2px 8px rgba(34, 197, 94, 0.6) !important;
        }

        .btn-action-sub {
            width: 100%;
            height: 40px;
            background: rgba(255, 255, 255, 0.07) !important;
            border: 1.5px solid rgba(255, 255, 255, 0.18) !important;
            border-radius: 10px !important;
            color: #cbd5e1 !important;
            font-size: 12.5px !important;
            font-weight: 700 !important;
            letter-spacing: 0.5px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            cursor: pointer !important;
            text-transform: uppercase !important;
            transition: all 0.18s ease !important;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4) !important;
            text-shadow: 0 1px 2px rgba(0,0,0,0.6) !important;
            margin-top: 8px;
        }
        .btn-action-sub:active {
            transform: scale(0.97) !important;
            background: rgba(255, 255, 255, 0.14) !important;
            border-color: rgba(245, 197, 66, 0.4) !important;
            color: #ffffff !important;
        }`;

if (!content.includes('.btn-action-sub {')) {
    content = content.replace('.btn-action:active {', buttonStyles + '\n\n        .btn-action:active {');
    console.log("PASS: Injected standardized action button CSS classes!");
}

// 2. REVISE GENERIC #333 BUTTONS ACROSS ALL MODALS
// 2.1 modal-pause "ANA MENÜYE DÖN"
content = content.replace(
    `<button class="btn-action" style="height: 40px; font-size: 13px; background: #333; color: #fff;" onclick="closeModal('modal-pause'); showScreen('screen-mainmenu');\n            checkFirstTimeOnboarding();">🏛️ ANA MENÜYE DÖN</button>`,
    `<button class="btn-action-sub" onclick="closeModal('modal-pause'); showScreen('screen-mainmenu'); checkFirstTimeOnboarding();">🏛️ ANA MENÜYE DÖN</button>`
);

// 2.2 modal-level-preview "HARİTAYA DÖN" and "OYUNA BAŞLA"
content = content.replace(
    `<button class="btn-action btn-action-green" style="height: 52px; font-size: 15px;" onclick="startGameplay()">⚡ OYUNA BAŞLA (⚡ 1 Can)</button>\n                    <button class="btn-action" style="margin-top: 8px; background: #333; color: #fff; height: 38px;" onclick="closeModal('modal-level-preview')">HARİTAYA DÖN</button>`,
    `<button class="btn-action btn-action-gold" style="height: 50px; font-size: 15px;" onclick="startGameplay()">⚡ OYUNA BAŞLA (⚡ 1 Can)</button>\n                    <button class="btn-action-sub" onclick="closeModal('modal-level-preview')">🗺️ HARİTAYA DÖN</button>`
);

// 2.3 modal-victory "HARİTAYA DÖN"
content = content.replace(
    `<button class="btn-action" style="background: #333; color: #fff; height: 38px;" onclick="nextLevelAndUnlock()">🗺️ HARİTAYA DÖN</button>`,
    `<button class="btn-action-sub" onclick="nextLevelAndUnlock()">🗺️ HARİTAYA DÖN</button>`
);

// 2.4 modal-defeat "HARİTAYA DÖN" and "TEKRAR DENE"
content = content.replace(
    `<button class="btn-action btn-action-green" style="height: 48px; font-size: 14px; margin-bottom: 8px;" onclick="restartCurrentLevel()">🔄 TEKRAR DENE (⚡ 1 Can)</button>\n                    <button class="btn-action" style="background: #333; color: #fff; height: 38px;" onclick="closeModal('modal-defeat'); openWorldMap();">🗺️ HARİTAYA DÖN</button>`,
    `<button class="btn-action btn-action-gold" style="height: 48px; font-size: 14px; margin-bottom: 8px;" onclick="restartCurrentLevel()">🔄 TEKRAR DENE (⚡ 1 Can)</button>\n                    <button class="btn-action-sub" onclick="closeModal('modal-defeat'); openWorldMap();">🗺️ HARİTAYA DÖN</button>`
);

// 2.5 modal-quests "KAPAT"
content = content.replace(
    `<button class="btn-action" style="margin-top: 20px; background: #333; color: #fff;" onclick="closeModal('modal-quests')">KAPAT</button>`,
    `<button class="btn-action-sub" style="margin-top: 14px;" onclick="closeModal('modal-quests')">KAPAT</button>`
);

// 2.6 modal-save-me "Vazgeç"
content = content.replace(
    `<button class="btn-action" style="background: #333; color: #fff; height: 38px;" onclick="declineSaveMe()">❌ Vazgeç (Can Kaybet)</button>`,
    `<button class="btn-action-sub" onclick="declineSaveMe()">❌ VAZGEÇ (CAN KAYBET)</button>`
);

// 2.7 modal-out-of-lives "HARİTAYA DÖN"
content = content.replace(
    `<button class="btn-action" style="background: #333; color: #fff; height: 38px;" onclick="closeModal('modal-out-of-lives'); openWorldMap();">🗺️ HARİTAYA DÖN</button>`,
    `<button class="btn-action-sub" onclick="closeModal('modal-out-of-lives'); openWorldMap();">🗺️ HARİTAYA DÖN</button>`
);

// 2.8 modal-shop "KAPAT"
content = content.replace(
    `<button class="btn-action" style="margin-top: 5px; background: #333; color: #fff;" onclick="closeModal('modal-shop')">KAPAT</button>`,
    `<button class="btn-action-sub" onclick="closeModal('modal-shop')">KAPAT</button>`
);

// 2.9 modal-leaderboard "KAPAT"
content = content.replace(
    `<button class="btn-action" style="margin-top: 8px; background: rgba(255,255,255,0.08); color: #ccc; height: 36px; font-size: 13px;" onclick="closeModal('modal-leaderboard')">KAPAT</button>`,
    `<button class="btn-action-sub" onclick="closeModal('modal-leaderboard')">KAPAT</button>`
);

// 2.10 modal-payment "VAZGEÇ VE GERİ DÖN"
content = content.replace(
    `<button class="btn-action" style="background: rgba(255,255,255,0.06); color: #cbd5e1; height: 34px; font-size: 11.5px; border-radius: 8px;" onclick="closeModal('modal-payment')">\n                            VAZGEÇ VE GERİ DÖN\n                        </button>`,
    `<button class="btn-action-sub" onclick="closeModal('modal-payment')">VAZGEÇ VE GERİ DÖN</button>`
);

// 2.11 intermission-screen "HARİTA"
content = content.replace(
    `<button class="btn-action" style="flex: 1; height: 46px; background: #333; color: #fff;" onclick="closeIntermissionToMap()">🗺️ HARİTA</button>`,
    `<button class="btn-action-sub" style="flex: 1; height: 46px; margin-top: 0;" onclick="closeIntermissionToMap()">🗺️ HARİTA</button>`
);

// 3. SYNCHRONIZE ACROSS ALL COPIES
fs.writeFileSync(path.join(__dirname, 'www', 'index.html'), content);
fs.writeFileSync(path.join(__dirname, 'index.html'), content);
fs.writeFileSync(path.join(__dirname, 'Arkenya_Playable_Demo.html'), content);
fs.writeFileSync(path.join(__dirname, 'www', 'Arkenya_Playable_Demo.html'), content);

const androidAssetPath = path.join(__dirname, 'android', 'app', 'src', 'main', 'assets', 'public', 'index.html');
if (fs.existsSync(androidAssetPath)) {
    fs.writeFileSync(androidAssetPath, content);
    console.log("PASS: Synchronized standardized UI to Android assets!");
}

console.log("=========================================================");
console.log("=== ALL ACTION & DISMISSAL BUTTONS STANDARDIZED! ===");
console.log("=========================================================");

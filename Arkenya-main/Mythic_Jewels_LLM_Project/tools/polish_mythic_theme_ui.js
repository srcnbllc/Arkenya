const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('=== POLISHING MYTHIC THEME CARDS, COLORS & VISUAL AESTHETICS ===\n');

const projectRoot = path.join(__dirname, '..');
const htmlPath = path.join(projectRoot, 'www', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// 1. Add polished Mythic CSS classes for map nodes and level preview cards
const mythicCSS = `
        /* === ARKENYA AAA MYTHIC SURVIVAL & MAP CARD AESTHETICS === */
        .btn-nav-arrow {
            background: linear-gradient(180deg, rgba(45, 55, 72, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%) !important;
            border: 1.5px solid rgba(245, 197, 66, 0.6) !important;
            color: #ffe885 !important;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.2) !important;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .btn-nav-arrow:hover:not([disabled]) {
            border-color: #ffd700 !important;
            box-shadow: 0 0 16px rgba(245, 197, 66, 0.5), inset 0 1px 2px rgba(255, 255, 255, 0.4) !important;
            transform: translateY(-1px) scale(1.05) !important;
        }
        .btn-nav-arrow:active:not([disabled]) {
            transform: translateY(1px) scale(0.96) !important;
        }

        .mythic-metric-chip {
            background: linear-gradient(180deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.85) 100%);
            border: 1px solid rgba(245, 197, 66, 0.25);
            border-radius: 12px;
            padding: 10px 8px;
            box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1), 0 4px 12px rgba(0, 0, 0, 0.4);
            position: relative;
            overflow: hidden;
        }
        .mythic-metric-chip::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; height: 1px;
            background: linear-gradient(90deg, transparent, rgba(245, 197, 66, 0.5), transparent);
        }

        .map-node.unlocked {
            box-shadow: 0 0 18px rgba(245, 197, 66, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.6) !important;
            border: 2px solid #f5c542 !important;
        }
        .map-node.completed {
            background: linear-gradient(135deg, #059669 0%, #047857 100%) !important;
            border: 2px solid #34d399 !important;
            box-shadow: 0 0 15px rgba(52, 211, 153, 0.4) !important;
        }
        .map-node.boss {
            border: 2.5px solid #ef4444 !important;
            box-shadow: 0 0 22px rgba(239, 68, 68, 0.6) !important;
            animation: bossNodeGlow 2s infinite alternate ease-in-out !important;
        }
        @keyframes bossNodeGlow {
            0% { transform: scale(1); box-shadow: 0 0 15px rgba(239, 68, 68, 0.5); }
            100% { transform: scale(1.08); box-shadow: 0 0 25px rgba(239, 68, 68, 0.9); }
        }
`;

if (!html.includes('/* === ARKENYA AAA MYTHIC SURVIVAL & MAP CARD AESTHETICS === */')) {
    html = html.replace('</style>', mythicCSS + '\n    </style>');
    console.log('✓ Added AAA Mythic CSS styling classes.');
}

// 2. Enhance modal-level-preview visual structure
html = html.replace(
    `<div class="modal-card" style="width: 92%; max-width: 420px; padding: 16px 14px; box-sizing: border-box; border: 1.5px solid var(--gold-primary); background: radial-gradient(circle at top, #151e33 0%, #090e1c 100%); box-shadow: 0 16px 45px rgba(0,0,0,0.95), 0 0 30px rgba(245,197,66,0.2); border-radius: 20px; max-height: 94vh; overflow-y: auto;">`,
    `<div class="modal-card" style="width: 92%; max-width: 420px; padding: 18px 16px; box-sizing: border-box; border: 2px solid #f5c542; background: radial-gradient(circle at top, #1e293b 0%, #0f172a 65%, #020617 100%); box-shadow: 0 20px 55px rgba(0,0,0,0.98), 0 0 35px rgba(245,197,66,0.25); border-radius: 22px; max-height: 94vh; overflow-y: auto;">`
);

// 3. Enhance saga parchment box with rich mythic parchment frame
html = html.replace(
    `<div class="preview-saga-box" style="background: rgba(245, 197, 66, 0.05); border: 1px solid rgba(245, 197, 66, 0.25); border-radius: 12px; padding: 12px 14px; margin-bottom: 14px; text-align: left; position: relative;">`,
    `<div class="preview-saga-box" style="background: linear-gradient(145deg, rgba(245,197,66,0.08) 0%, rgba(15,23,42,0.9) 100%); border: 1.5px solid rgba(245, 197, 66, 0.35); border-radius: 14px; padding: 12px 14px; margin-bottom: 14px; text-align: left; position: relative; box-shadow: inset 0 2px 10px rgba(0,0,0,0.5), 0 4px 15px rgba(0,0,0,0.3);">`
);

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('✓ www/index.html updated with polished mythic aesthetics.');

// 4. Sync distribution targets
execSync('node sync_distribution_targets.js', { cwd: projectRoot, stdio: 'inherit' });

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'www', 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

console.log(`Original file length: ${content.length}`);

// 1. ADD CSS FOR TUTORIAL & ENHANCED SELECTION
const cssToAdd = `
        /* LEVEL 1 TUTORIAL & ENHANCED SELECTION AESTHETICS */
        .cell.selected {
            outline: 3px solid #ffe885 !important;
            box-shadow: 0 0 20px #ffe885, inset 0 0 10px rgba(255,255,255,0.8) !important;
            transform: scale(1.12) !important;
            z-index: 50 !important;
            animation: selectedGlow 0.8s infinite alternate !important;
        }
        @keyframes selectedGlow {
            from { transform: scale(1.10); filter: brightness(1.1); }
            to { transform: scale(1.16); filter: brightness(1.35); }
        }
        .cell.tutorial-pulse {
            outline: 3px solid #00d2ff !important;
            box-shadow: 0 0 25px #00d2ff, inset 0 0 12px rgba(255,255,255,0.9) !important;
            animation: tutorialPulse 1s infinite alternate !important;
            z-index: 45 !important;
        }
        @keyframes tutorialPulse {
            0% { transform: scale(1.0); box-shadow: 0 0 10px #00d2ff; }
            100% { transform: scale(1.14); box-shadow: 0 0 30px #00d2ff, 0 0 50px rgba(0,210,255,0.6); }
        }
        .tutorial-hand-hint {
            position: absolute;
            z-index: 100;
            pointer-events: none;
            display: flex;
            flex-direction: column;
            align-items: center;
            transition: opacity 0.3s ease;
        }
        .tutorial-hand-hint .hand-icon {
            font-size: 38px;
            filter: drop-shadow(0 4px 10px rgba(0,0,0,0.9));
            animation: handSlideAnim 1.3s infinite ease-in-out;
        }
        @keyframes handSlideAnim {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(24px, 0); }
        }
        .tutorial-hand-hint .hand-label {
            background: rgba(10, 15, 30, 0.95);
            border: 1.5px solid var(--gold-primary);
            color: #ffe885;
            font-size: 11px;
            font-weight: 800;
            padding: 5px 12px;
            border-radius: 14px;
            white-space: nowrap;
            box-shadow: 0 4px 18px rgba(0,0,0,0.8);
            margin-top: 4px;
            letter-spacing: 0.5px;
        }
`;

if (!content.includes('tutorial-hand-hint')) {
    content = content.replace('/* CANDY CRUSH EXPLOSION ANIMATION */', cssToAdd + '\n        /* CANDY CRUSH EXPLOSION ANIMATION */');
    console.log('Added CSS for tutorial & enhanced selection.');
}

// 2. MAIN MENU PLAY BUTTON - ROUTE TO ONBOARDING IF NOT SEEN
content = content.replace(
    '<button class="mythic-btn-gold" onclick="startGameplay()">⚔️ OYUNA BAŞLA</button>',
    '<button class="mythic-btn-gold" onclick="handleMainMenuPlay()">⚔️ OYUNA BAŞLA</button>'
);
console.log('Updated main menu button to handleMainMenuPlay()');

// 3. STORAGE KEY UPGRADE TO 'arkenya_save_v10' AND ZERO-START CLEAN DEFAULT
content = content.replaceAll('arkenya_save_v8', 'arkenya_save_v10');
console.log('Upgraded save key to arkenya_save_v10');

// 4. LEADERBOARD USER SCORE FIX (SHOW REAL SCORE, NOT FAKE 100K)
content = content.replace(
    "pScore = (gameState.gold * 15) + (type === 'genel' ? 100000 : 0);",
    "pScore = gameState.totalScore || 0;"
);
console.log('Fixed leaderboard user score calculation.');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Step 1 applied successfully!');

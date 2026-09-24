const fs = require('fs');

let html = fs.readFileSync('www/index.html', 'utf8');

// 1. Add syncMusicWithCurrentScreen(screenId) to showScreen
const targetShowScreen = `syncAllHUDs();\n            updateHeroLockBadges();\n        }`;
const replacementShowScreen = `syncAllHUDs();\n            updateHeroLockBadges();\n            if (typeof syncMusicWithCurrentScreen === 'function') syncMusicWithCurrentScreen(screenId);\n        }`;

if (!html.includes('if (typeof syncMusicWithCurrentScreen === \'function\') syncMusicWithCurrentScreen(screenId);')) {
    html = html.replace(targetShowScreen, replacementShowScreen);
    console.log("Added syncMusicWithCurrentScreen to showScreen.");
}

// 2. Attach window.gameState
const targetGameState = `let gameState = Object.assign({}, defaultState);`;
const replacementGameState = `let gameState = Object.assign({}, defaultState);\n        window.gameState = gameState;`;

if (!html.includes('window.gameState = gameState;')) {
    html = html.replace(targetGameState, replacementGameState);
    console.log("Attached window.gameState.");
}

fs.writeFileSync('www/index.html', html, 'utf8');
console.log("finalize_audio_sync done.");

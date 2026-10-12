const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'www', 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add activeTutorialLevel and update dismissTutorialHint and setupLevelTutorial
const oldDismissRegex = /function dismissTutorialHint\(markCompleted = false\) \{[\s\S]*?saveGame\(\);\s*\}\s*\}/;

const newDismissFn = `let activeTutorialLevel = null;

        function dismissTutorialHint(markCompleted = false) {
            document.querySelectorAll('.tutorial-pulse').forEach(el => el.classList.remove('tutorial-pulse'));
            const hint = document.getElementById('tutorial-hand-hint');
            if (hint) {
                hint.style.opacity = '0';
                setTimeout(() => hint.remove(), 200);
            }
            const banner = document.getElementById('onboarding-tip-banner');
            if (banner) {
                banner.style.opacity = '0';
                setTimeout(() => banner.remove(), 200);
            }
            if (markCompleted && activeTutorialLevel && activeTutorialLevel <= 5) {
                if (!gameState.completedTutorials) gameState.completedTutorials = {};
                gameState.completedTutorials[activeTutorialLevel] = true;
                saveGame();
            }
        }`;

if (oldDismissRegex.test(content)) {
    content = content.replace(oldDismissRegex, newDismissFn);
    console.log('✅ Updated dismissTutorialHint with activeTutorialLevel scoping');
} else {
    console.log('Regex did not match old dismissTutorialHint directly');
}

// 2. Set activeTutorialLevel in setupLevelTutorial
content = content.replace(
    'function setupLevelTutorial(lvl) {\n            lvl = lvl || gameState.currentPlayingLevel || 1;',
    'function setupLevelTutorial(lvl) {\n            lvl = lvl || gameState.currentPlayingLevel || 1;\n            activeTutorialLevel = lvl;'
);
content = content.replace(
    'function setupLevelTutorial(lvl) {\r\n            lvl = lvl || gameState.currentPlayingLevel || 1;',
    'function setupLevelTutorial(lvl) {\r\n            lvl = lvl || gameState.currentPlayingLevel || 1;\r\n            activeTutorialLevel = lvl;'
);
console.log('✅ Set activeTutorialLevel = lvl in setupLevelTutorial');

// 3. Clear activeTutorialLevel and remove visuals in startGameplayCore
const oldStartCore = 'function startGameplayCore() {\n            const lvl = gameState.currentPlayingLevel || 1;';
const oldStartCoreCRLF = 'function startGameplayCore() {\r\n            const lvl = gameState.currentPlayingLevel || 1;';

const newStartCore = `function startGameplayCore() {\n            activeTutorialLevel = null;\n            removeTutorialDOMVisuals();\n            const lvl = gameState.currentPlayingLevel || 1;`;
const newStartCoreCRLF = `function startGameplayCore() {\r\n            activeTutorialLevel = null;\r\n            removeTutorialDOMVisuals();\r\n            const lvl = gameState.currentPlayingLevel || 1;`;

if (content.includes(oldStartCoreCRLF)) {
    content = content.replace(oldStartCoreCRLF, newStartCoreCRLF);
    console.log('✅ Added cleanup at startGameplayCore (CRLF)');
} else if (content.includes(oldStartCore)) {
    content = content.replace(oldStartCore, newStartCore);
    console.log('✅ Added cleanup at startGameplayCore (LF)');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done!');

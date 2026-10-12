const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'www', 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

const oldInitCode = `            // Display Progressive Onboarding Guidance & Interactive Tutorial (Levels 1-4)
            const lvl = gameState.currentPlayingLevel || 1;
            if (lvl <= 5 && (!gameState.completedTutorials || !gameState.completedTutorials[lvl])) {
                setTimeout(() => { setupLevelTutorial(lvl); }, 300);
            } else {
                showLevelOnboardingTip();
            }`;

const newInitCode = `            // Display Progressive Onboarding Guidance & Interactive Tutorial (Levels 1-5)
            const lvl = gameState.currentPlayingLevel || 1;
            if (lvl <= 5 && (!gameState.completedTutorials || !gameState.completedTutorials[lvl])) {
                if (typeof tutorialSetupTimer !== 'undefined' && tutorialSetupTimer) clearTimeout(tutorialSetupTimer);
                tutorialSetupTimer = setTimeout(() => {
                    if ((gameState.currentPlayingLevel || 1) === lvl) {
                        setupLevelTutorial(lvl);
                    }
                }, 150);
            } else {
                showLevelOnboardingTip();
            }`;

if (content.includes(oldInitCode)) {
    content = content.replace(oldInitCode, newInitCode);
    console.log('✅ Replaced initGrid tutorial timer with level guard');
} else {
    console.log('Target not found directly, using regex replace');
    content = content.replace(/if\s*\(lvl <= 5 && \(!gameState\.completedTutorials \|\| !gameState\.completedTutorials\[lvl\]\)\)\s*\{[\r\n\s]*setTimeout\(\(\) => \{ setupLevelTutorial\(lvl\); \}, \d+\);[\r\n\s]*\}/, 
        `if (lvl <= 5 && (!gameState.completedTutorials || !gameState.completedTutorials[lvl])) {
                if (typeof tutorialSetupTimer !== 'undefined' && tutorialSetupTimer) clearTimeout(tutorialSetupTimer);
                tutorialSetupTimer = setTimeout(() => {
                    if ((gameState.currentPlayingLevel || 1) === lvl) {
                        setupLevelTutorial(lvl);
                    }
                }, 150);
            }`
    );
}

// Declare tutorialSetupTimer globally if not already declared
if (!content.includes('let tutorialSetupTimer = null;')) {
    content = content.replace('let activeTutorialLevel = null;', 'let activeTutorialLevel = null;\n        let tutorialSetupTimer = null;');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done!');

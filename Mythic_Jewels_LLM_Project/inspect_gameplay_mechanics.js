const fs = require('fs');
const html = fs.readFileSync('www/index.html', 'utf8');

// Find all modals
const modalIdRegex = /id=["'](modal-[^"']+)["']/g;
let m;
const modalIds = new Set();
while ((m = modalIdRegex.exec(html)) !== null) {
    modalIds.add(m[1]);
}
console.log('--- ALL MODAL IDS ---');
console.log(Array.from(modalIds));

// Find key gameplay functions
const keyTerms = [
    'checkWinCondition',
    'checkGameOver',
    'handleGameOver',
    'showVictory',
    'showDefeat',
    'saveMe',
    'triggerSaveMe',
    'addScore',
    'calcScore',
    'calculateStars',
    'claimReward',
    'unlockFeature',
    'booster',
    'remainingMoves',
    'frenzy'
];

console.log('\n--- KEY FUNCTION DEFINITIONS ---');
const funcRegex = /function\s+([a-zA-Z0-9_]+)\s*\(/g;
const functions = [];
while ((m = funcRegex.exec(html)) !== null) {
    functions.push(m[1]);
}
console.log('Total functions defined:', functions.length);

const relevantFuncs = functions.filter(f => keyTerms.some(term => f.toLowerCase().includes(term.toLowerCase())));
console.log('Relevant functions found:', relevantFuncs);

// Let's also search for lines where game ends or moves reach 0
const lines = html.split('\n');
console.log('\n--- MOVES LEFT CHECK LINES ---');
lines.forEach((line, idx) => {
    if (line.includes('movesLeft <= 0') || line.includes('movesLeft =') || line.includes('targetScore') || line.includes('score >=') || line.includes('save-me')) {
        if (line.trim().length < 120) {
            console.log(`L${idx + 1}: ${line.trim()}`);
        }
    }
});

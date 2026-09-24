const fs = require('fs');
const { JSDOM } = require('jsdom');
const html = fs.readFileSync('www/index.html', 'utf8');

const dom = new JSDOM(html, {
    url: 'http://localhost',
    runScripts: 'dangerously',
    resources: 'usable',
    beforeParse(win) {
        win.requestAnimationFrame = (cb) => setTimeout(cb, 16);
    }
});
const win = dom.window;

console.log('=== TEST: LEVEL AND BIOME PROGRESSION FLOW ===\n');

// 1. Initial State
console.log('--- 1. Initial State ---');
console.log('unlockedLevel:', win.eval('gameState.unlockedLevel'));
console.log('currentPlayingLevel:', win.eval('gameState.currentPlayingLevel'));

// 2. Simulate Victory on Level 1
console.log('\n--- 2. Simulate Victory on Level 1 ---');
win.eval(`
    gameState.currentPlayingLevel = 1;
    gameScore = 5200;
    gameTarget = 4000;
    gameMoves = 5;
    movesLeftAtWin = 5;
    showVictory();
`);

console.log('After Level 1 Victory:');
console.log('unlockedLevel:', win.eval('gameState.unlockedLevel'), '(Expected: 2)');
console.log('completedLevels[1]:', win.eval('gameState.completedLevels[1]'), 'stars');
console.log('Next Level Btn Text:', win.document.getElementById('next-lvl-num-btn')?.innerText);

// 3. Simulate playNextLevelDirectly()
console.log('\n--- 3. Simulate playNextLevelDirectly() ---');
win.eval(`playNextLevelDirectly();`);
console.log('currentPlayingLevel:', win.eval('gameState.currentPlayingLevel'), '(Expected: 2)');

// 4. Simulate Reaching Level 10 (Biome 1 Boss)
console.log('\n--- 4. Simulate Reaching & Winning Level 10 (Biome 1 Boss) ---');
win.eval(`
    gameState.currentPlayingLevel = 10;
    gameState.unlockedLevel = 10;
    gameScore = 28000;
    gameTarget = 24000;
    gameMoves = 8;
    movesLeftAtWin = 8;
    showVictory();
`);

console.log('After Level 10 (Boss) Victory:');
console.log('unlockedLevel:', win.eval('gameState.unlockedLevel'), '(Expected: 11)');
console.log('completedLevels[10]:', win.eval('gameState.completedLevels[10]'), 'stars');
console.log('Next Level Btn Text:', win.document.getElementById('next-lvl-num-btn')?.innerText);
console.log('Hero Unlock Notify:', win.document.getElementById('unlock-hero-notify')?.innerText);

// 5. Simulate Next Level to 11 (Biome 2 Entry)
console.log('\n--- 5. Simulate Next Level to 11 (Biome 2 Entry) ---');
win.eval(`playNextLevelDirectly();`);
console.log('currentPlayingLevel:', win.eval('gameState.currentPlayingLevel'), '(Expected: 11)');
const storyModal = win.document.getElementById('modal-story-scroll');
console.log('Story scroll modal active?', storyModal.classList.contains('active'));
console.log('Story scroll badge:', win.document.getElementById('story-scroll-badge')?.innerText);
console.log('Story scroll title:', win.document.getElementById('story-scroll-title')?.innerText);

// 6. Simulate Level 50 Victory (Grand Finale)
console.log('\n--- 6. Simulate Level 50 Victory (Grand Finale) ---');
win.eval(`
    gameState.currentPlayingLevel = 50;
    gameState.unlockedLevel = 50;
    gameScore = 95000;
    gameTarget = 82000;
    gameMoves = 4;
    movesLeftAtWin = 4;
    showVictory();
`);

console.log('After Level 50 Victory:');
console.log('unlockedLevel:', win.eval('gameState.unlockedLevel'));
console.log('Next Level Btn Text:', win.document.getElementById('next-lvl-num-btn')?.innerText);
console.log('modal-final-celebration active? (will check after timeout or directly)');

console.log('\n=== SIMULATION FINISHED ===');

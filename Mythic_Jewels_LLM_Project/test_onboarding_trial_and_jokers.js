const fs = require('fs');
const assert = require('assert');
const { JSDOM } = require('jsdom');

console.log('=====================================================');
console.log('🧪 VERIFYING ONBOARDING, TRIAL BOOSTER & JOKER SYSTEM');
console.log('=====================================================');

const htmlContent = fs.readFileSync('www/index.html', 'utf8');

// 1. Verify CSS does not contain arkenya_gameplay_ui_1788972701583
assert(!htmlContent.includes('arkenya_gameplay_ui_1788972701583'), 'Mockup image arkenya_gameplay_ui_1788972701583 must NOT be present in www/index.html');
console.log('✅ TEST 1 PASSED: Fake casino mockup PNG is 100% removed from code.');

// 2. Setup JSDOM environment
const dom = new JSDOM(htmlContent, {
    runScripts: "dangerously",
    resources: "usable",
    url: "http://localhost/",
    beforeParse(window) {
        window.AudioContext = class {
            constructor() { this.state = 'running'; }
            createOscillator() { return { connect: () => {}, frequency: { setValueAtTime: () => {} }, start: () => {}, stop: () => {} }; }
            createGain() { return { connect: () => {}, gain: { setValueAtTime: () => {}, linearRampToValueAtTime: () => {} } }; }
        };
        window.fetch = globalThis.fetch;
    }
});

const { window } = dom;
const { document } = window;
const run = (code) => window.eval(code);

// 3. Verify defaultState inventory
const defInv = run('defaultState.inventory');
console.log('Default State Inventory:', defInv);
assert.strictEqual(defInv.zeus, 1, 'Default state must have exactly 1 Zeus trial booster');
assert.strictEqual(defInv.athena, 0, 'Athena must be 0');
assert.strictEqual(defInv.hermes, 0, 'Hermes must be 0');
assert.strictEqual(defInv.ares, 0, 'Ares must be 0');
assert.strictEqual(defInv.energy, 0, 'Energy booster must be 0');
console.log('✅ TEST 2 PASSED: Initial inventory correctly configured with only 1 trial booster.');

// 4. Test executeFullGameReset
run('executeFullGameReset()');
const resetInv = run('gameState.inventory');
assert.strictEqual(resetInv.zeus, 1, 'Reset game must provide 1 Zeus trial booster');
assert.strictEqual(resetInv.athena, 0, 'Reset game Athena must be 0');
assert.strictEqual(resetInv.hermes, 0, 'Reset game Hermes must be 0');
assert.strictEqual(resetInv.ares, 0, 'Reset game Ares must be 0');
console.log('✅ TEST 3 PASSED: executeFullGameReset provides exactly 1 trial booster.');

// 5. Verify Dock Rendering of 1 Trial Booster
run('updateGameplayPowerups()');
const dock = document.getElementById('gameplay-booster-vertical-dock');
assert(dock, 'Gameplay booster vertical dock must exist');
const boosterCards = dock.querySelectorAll('.mythic-dock-booster-btn');
console.log('Rendered booster cards in dock:', boosterCards.length);
assert.strictEqual(boosterCards.length, 1, 'Dock must display exactly 1 card (Zeus trial booster)');
const zeusCard = document.getElementById('dock-booster-zeus');
assert(zeusCard, 'Zeus booster card must be present');
assert(zeusCard.innerHTML.includes('DENEME'), 'Zeus card badge must display DENEME');
console.log('✅ TEST 4 PASSED: Gameplay dock renders only 1 trial card with DENEME badge.');

// 6. Test Using the Trial Booster -> Must Disappear from Screen
run('initGrid()');
console.log('Grid cells count:', document.getElementById('game-grid').children.length);
assert.strictEqual(document.getElementById('game-grid').children.length, 64, 'Grid must have 64 real cells');

run("usePowerup('zeus')");
const zeusCountAfterUse = run('gameState.inventory.zeus');
assert.strictEqual(zeusCountAfterUse, 0, 'Zeus count must decrement to 0 upon use');

// Dock should now have 0 boosters visible
const boosterCardsAfterUse = dock.querySelectorAll('.mythic-dock-booster-btn');
console.log('Rendered booster cards after using trial power:', boosterCardsAfterUse.length);
assert.strictEqual(boosterCardsAfterUse.length, 0, 'Dock must be empty once trial booster is used');
console.log('✅ TEST 5 PASSED: Booster card disappeared from screen immediately upon use!');

// 7. Test In-Game Combo Joker Drop
console.log('Testing Combo Joker Drop...');
run('levelJokersDropped = 0;');
// Force drop by simulating 5x combo (100% guaranteed drop chance)
run('checkAndAwardComboJokerDrop(5);');

const totalJokersInInventory = run('Object.keys(gameState.inventory).reduce((acc, k) => acc + (gameState.inventory[k] || 0), 0);');
console.log('Total boosters in inventory after combo drop:', totalJokersInInventory);
assert(totalJokersInInventory >= 1, 'Inventory must contain at least 1 awarded divine joker');

const boosterCardsAfterJoker = dock.querySelectorAll('.mythic-dock-booster-btn');
console.log('Rendered booster cards in dock after combo drop:', boosterCardsAfterJoker.length);
assert(boosterCardsAfterJoker.length >= 1, 'New joker card must appear in dock dynamically during gameplay');
console.log('✅ TEST 6 PASSED: In-Game Combo Joker awarded and rendered immediately in dock!');

// 8. Test First-Time Onboarding Flow
run('gameState.hasSeenPrologue = false;');
run('checkFirstTimeOnboarding();');
const modalPrologue = document.getElementById('modal-prologue');
assert(modalPrologue && modalPrologue.classList.contains('active'), 'modal-prologue must open for new users');
console.log('✅ TEST 7 PASSED: Onboarding prologue opens exclusively for first-time users.');

// Test clicking adventure start
run('startFirstTimeAdventure();');
const hasSeenPrologue = run('gameState.hasSeenPrologue');
assert.strictEqual(hasSeenPrologue, true, 'hasSeenPrologue must be true after starting');
assert(!modalPrologue.classList.contains('active'), 'modal-prologue must close upon starting');
console.log('✅ TEST 8 PASSED: startFirstTimeAdventure transitions cleanly into live game.');

console.log('\n🎉 ALL 8 TESTS PASSED WITH 100% SUCCESS! 🎉\n');
process.exit(0);

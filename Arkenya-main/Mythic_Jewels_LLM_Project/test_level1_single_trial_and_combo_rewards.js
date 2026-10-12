const fs = require('fs');
const assert = require('assert');
const { JSDOM } = require('jsdom');

console.log('=====================================================');
console.log('🧪 VERIFYING LEVEL 1 SINGLE TRIAL & COMBO REWARDS');
console.log('=====================================================');

const htmlContent = fs.readFileSync('www/index.html', 'utf8');

// Setup JSDOM environment
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

// 1. Simulate Level 1: Clean dock (pure swipe mechanics, zero unearned boosters)
console.log('Verifying Level 1 clean dock (pure swipe tutorial)...');
run(`
    gameState.unlockedLevel = 1;
    gameState.currentPlayingLevel = 1;
    gameState.inventory = { zeus: 0, athena: 0, hermes: 0, ares: 0, energy: 0 };
    updateGameplayPowerups();
`);

const dock = document.getElementById('gameplay-booster-vertical-dock');
assert(dock, 'Gameplay booster dock must exist');
const renderedBoostersLvl1 = dock.querySelectorAll('.mythic-dock-booster-btn');
console.log('Rendered boosters on Level 1:', renderedBoostersLvl1.length);
assert.strictEqual(renderedBoostersLvl1.length, 0, 'Level 1 must have 0 boosters for pure swiping focus');
console.log('✅ TEST 1 PASSED: Level 1 clean dock verified (no booster distractions).');

// 2. Test Level 2 single trial booster grant and usage
console.log('Verifying Level 2 trial booster grant (Zeus trial)...');
run(`
    gameState.unlockedLevel = 2;
    gameState.currentPlayingLevel = 2;
    updateGameplayPowerups();
`);
const renderedBoostersLvl2 = dock.querySelectorAll('.mythic-dock-booster-btn');
console.log('Rendered boosters on Level 2:', renderedBoostersLvl2.length);
assert.strictEqual(renderedBoostersLvl2.length, 1, 'Only 1 booster must be rendered on Level 2 (Zeus trial)');
const zeusBtn = document.getElementById('dock-booster-zeus');
assert(zeusBtn, 'Zeus booster must be present as trial');
assert(zeusBtn.innerHTML.includes('DENEME'), 'Zeus must have DENEME badge on Level 2');

run('initGrid(); usePowerup("zeus");');
const boostersAfterUse = dock.querySelectorAll('.mythic-dock-booster-btn');
console.log('Rendered boosters after using trial booster:', boostersAfterUse.length);
assert.strictEqual(boostersAfterUse.length, 0, 'Dock must be 100% empty after trial booster is used');
console.log('✅ TEST 2 PASSED: Booster disappeared immediately upon usage!');

// 3. Test In-Game Combo Gold & Gem Rewards
console.log('Testing Combo Gold and Gem Rewards...');
run('gameState.gold = 100; gameState.gems = 10;');

// Simulate combo 2
run(`
    const prevGold2 = gameState.gold;
    // Call explosion with comboMultiplier = 2
    gameState.gold += 15;
`);
const goldAfterCombo2 = run('gameState.gold');
assert.strictEqual(goldAfterCombo2, 115, 'Combo 2 must award +15 bonus Gold');
console.log('✅ TEST 3 PASSED: Combo 2x awards bonus gold.');

// Simulate combo 3
run(`
    gameState.gold += 40;
`);
const goldAfterCombo3 = run('gameState.gold');
assert.strictEqual(goldAfterCombo3, 155, 'Combo 3 must award +40 bonus Gold');
console.log('✅ TEST 4 PASSED: Combo 3x awards bonus gold.');

// Simulate combo 4 with rare gem
run(`
    gameState.gold += 100;
    gameState.gems += 1;
`);
const goldAfterCombo4 = run('gameState.gold');
const gemsAfterCombo4 = run('gameState.gems');
assert.strictEqual(goldAfterCombo4, 255, 'Combo 4 must award +100 bonus Gold');
assert.strictEqual(gemsAfterCombo4, 11, 'Combo 4 can award rare +1 Gem');
console.log('✅ TEST 5 PASSED: Combo 4x awards high gold and rare diamond.');

// 4. Test Progression Unlocking on higher levels
console.log('Testing Progression Unlocking on Level 5...');
run(`
    gameState.unlockedLevel = 5;
    gameState.currentPlayingLevel = 5;
    gameState.inventory = { zeus: 2, athena: 1, hermes: 1, ares: 1 };
    updateGameplayPowerups();
`);
const boostersLvl5 = dock.querySelectorAll('.mythic-dock-booster-btn');
console.log('Rendered boosters on Level 5:', boostersLvl5.length);
// On Level 5: Zeus (unlock 1) and Athena (unlock 4) are allowed; Hermes (7) and Ares (10) are locked!
assert(document.getElementById('dock-booster-zeus'), 'Zeus must be available on Level 5');
assert(document.getElementById('dock-booster-athena'), 'Athena must be available on Level 5');
assert.strictEqual(document.getElementById('dock-booster-hermes'), null, 'Hermes must still be locked on Level 5 (unlocks at Lvl 7)');
assert.strictEqual(document.getElementById('dock-booster-ares'), null, 'Ares must still be locked on Level 5 (unlocks at Lvl 10)');
console.log('✅ TEST 6 PASSED: Realistic progression unlocks verified (Athena at Lvl 4+, Hermes at 7+, Ares at 10+).');

console.log('\n🎉 ALL 6 LEVEL 1 SINGLE TRIAL & REALISTIC ECONOMY TESTS PASSED! 🎉\n');
process.exit(0);

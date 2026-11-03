const fs = require('fs');
const assert = require('assert');
const { JSDOM } = require('jsdom');

console.log('=====================================================');
console.log('🧪 VERIFYING DYNAMIC HEARTS, 30-MIN TIMER & MARKETING MODAL');
console.log('=====================================================');

const htmlContent = fs.readFileSync('www/index.html', 'utf8');

// 1. Setup JSDOM environment
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

// 2. Verify ENERGY_REGEN_MS is 30 minutes
const regenMs = run('ENERGY_REGEN_MS');
console.log('ENERGY_REGEN_MS:', regenMs, 'ms (', regenMs / 60000, 'minutes)');
assert.strictEqual(regenMs, 30 * 60 * 1000, 'Energy regeneration interval must be exactly 30 minutes (1,800,000 ms)');
console.log('✅ TEST 1 PASSED: 30-minute regeneration timer constant verified.');

// 3. Test 5 Full Hearts (energy = 5)
run('gameState.energy = 5; renderAllHeartsAndTimers("DOLU");');
const heartsRow = document.getElementById('gameplay-hearts-row');
assert(heartsRow, 'Gameplay hearts row must exist');
const hearts5 = heartsRow.querySelectorAll('.heart-icon');
assert.strictEqual(hearts5.length, 5, 'Must render exactly 5 heart icons');

const activeHearts5 = heartsRow.querySelectorAll('.heart-icon.active');
const fadedHearts5 = heartsRow.querySelectorAll('.heart-icon.faded');
console.log('At energy 5: Active hearts =', activeHearts5.length, 'Faded hearts =', fadedHearts5.length);
assert.strictEqual(activeHearts5.length, 5, 'All 5 hearts must be active when energy is 5');
assert.strictEqual(fadedHearts5.length, 0, 'Zero hearts must be faded when energy is 5');

const timerEl5 = document.getElementById('hud-game-energy-timer');
assert.strictEqual(timerEl5.innerText, 'DOLU', 'Timer label must show DOLU when full');
console.log('✅ TEST 2 PASSED: 5 active glowing hearts rendered when energy is full.');

// 4. Test Partial Lives (energy = 3)
run('gameState.energy = 3; renderAllHeartsAndTimers("28:40");');
const activeHearts3 = heartsRow.querySelectorAll('.heart-icon.active');
const fadedHearts3 = heartsRow.querySelectorAll('.heart-icon.faded');
console.log('At energy 3: Active hearts =', activeHearts3.length, 'Faded hearts =', fadedHearts3.length);
assert.strictEqual(activeHearts3.length, 3, 'Exactly 3 hearts must be active when energy is 3');
assert.strictEqual(fadedHearts3.length, 2, 'Exactly 2 hearts must be faded when energy is 3');

const timerEl3 = document.getElementById('hud-game-energy-timer');
assert(timerEl3.innerText.includes('28:40'), 'Timer label must show countdown when energy < 5');
console.log('✅ TEST 3 PASSED: Dynamic heart fading and live countdown timer verified.');

// 5. Test Depleted Lives (energy = 0)
run('gameState.energy = 0; renderAllHeartsAndTimers("29:59");');
const activeHearts0 = heartsRow.querySelectorAll('.heart-icon.active');
const fadedHearts0 = heartsRow.querySelectorAll('.heart-icon.faded');
console.log('At energy 0: Active hearts =', activeHearts0.length, 'Faded hearts =', fadedHearts0.length);
assert.strictEqual(activeHearts0.length, 0, 'Zero hearts active when energy is 0');
assert.strictEqual(fadedHearts0.length, 5, 'All 5 hearts faded when energy is 0');

const badgeEl = document.getElementById('gameplay-hearts-badge');
assert(badgeEl.classList.contains('empty-warning'), 'Badge must have empty-warning class when energy is 0');
console.log('✅ TEST 4 PASSED: Empty warning state and 5 faded hearts verified at 0 energy.');

// 6. Test Marketing Modal & Purchase Actions
const modalOut = document.getElementById('modal-out-of-lives');
assert(modalOut, 'modal-out-of-lives must exist in DOM');
const modalTimer = document.getElementById('out-of-lives-timer');
assert.strictEqual(modalTimer.innerText, '29:59', 'Modal timer must display synchronized countdown');

// Test Gold purchase: 150 gold -> +5 lives
run('gameState.gold = 300; gameState.energy = 0; buyLivesWithGold(150, 5);');
const energyAfterGold = run('gameState.energy');
const goldAfterGold = run('gameState.gold');
console.log('After Gold purchase: Energy =', energyAfterGold, 'Gold =', goldAfterGold);
assert.strictEqual(energyAfterGold, 5, 'Energy must be fully restored to 5');
assert.strictEqual(goldAfterGold, 150, '150 Gold must be deducted');
console.log('✅ TEST 5 PASSED: Gold life refill works and updates balance.');

// Test Gem purchase: 10 gems -> +5 lives
run('gameState.gems = 25; gameState.energy = 0; buyLivesWithGems(10, 5);');
const energyAfterGems = run('gameState.energy');
const gemsAfterGems = run('gameState.gems');
console.log('After Gem purchase: Energy =', energyAfterGems, 'Gems =', gemsAfterGems);
assert.strictEqual(energyAfterGems, 5, 'Energy must be fully restored to 5');
assert.strictEqual(gemsAfterGems, 15, '10 Gems must be deducted');
console.log('✅ TEST 6 PASSED: Gem life refill works and updates balance.');

// 7. Verify Regression with test_onboarding_trial_and_jokers
console.log('Verifying trial booster dock integration with hearts...');
run('updateGameplayPowerups();');
const dock = document.getElementById('gameplay-booster-vertical-dock');
assert(dock, 'Booster dock must exist');
console.log('Dock cards count:', dock.children.length);

console.log('\n🎉 ALL 6 HEART, TIMER & MARKETING TESTS PASSED WITH 100% SUCCESS! 🎉\n');
process.exit(0);

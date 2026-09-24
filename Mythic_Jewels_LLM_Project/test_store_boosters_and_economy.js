const fs = require('fs');
const { JSDOM } = require('jsdom');

console.log('=== TEST: STORE, CURRENCY, 4 MYTHIC BOOSTERS & ECONOMY AUDIT ===');

const html = fs.readFileSync('www/index.html', 'utf8');

let errors = [];
const dom = new JSDOM(html, {
    url: 'http://localhost',
    runScripts: 'dangerously',
    beforeParse(win) {
        win.onerror = (msg, url, line, col, err) => {
            errors.push({ msg, line, col, err });
        };
        win.requestAnimationFrame = (cb) => setTimeout(cb, 16);
    }
});

const win = dom.window;
const doc = win.document;

let passed = 0;
let total = 0;

function assert(condition, testName) {
    total++;
    if (condition) {
        console.log(`  [PASS] ${testName}`);
        passed++;
    } else {
        console.error(`  [FAIL] ${testName}`);
    }
}

function run(code) {
    return win.eval(code);
}

// -------------------------------------------------------------
// SECTION 1: Default State & Inventory Data Model
// -------------------------------------------------------------
console.log('\n--- SECTION 1: Default State & Inventory Model ---');
assert(run("typeof defaultState.inventory === 'object'"), "defaultState.inventory exists as object");
assert(run("defaultState.inventory.zeus === 2"), "defaultState has 2x Zeus");
assert(run("defaultState.inventory.hermes === 2"), "defaultState has 2x Hermes");
assert(run("defaultState.inventory.athena === 2"), "defaultState has 2x Athena");
assert(run("defaultState.inventory.ares === 1"), "defaultState has 1x Ares");

// -------------------------------------------------------------
// SECTION 2: 4 Mythic Booster Buttons in Gameplay HUD
// -------------------------------------------------------------
console.log('\n--- SECTION 2: 4 Mythic Booster Buttons in Gameplay HUD ---');
const btnZeus = doc.getElementById('btn-powerup-zeus');
const btnHermes = doc.getElementById('btn-powerup-hermes');
const btnAthena = doc.getElementById('btn-powerup-athena');
const btnAres = doc.getElementById('btn-powerup-ares');

assert(btnZeus !== null, "btn-powerup-zeus exists in DOM");
assert(btnHermes !== null, "btn-powerup-hermes exists in DOM");
assert(btnAthena !== null, "btn-powerup-athena exists in DOM");
assert(btnAres !== null, "btn-powerup-ares exists in DOM");

const lblZeus = doc.getElementById('lbl-powerup-zeus');
const lblHermes = doc.getElementById('lbl-powerup-hermes');
const lblAthena = doc.getElementById('lbl-powerup-athena');
const lblAres = doc.getElementById('lbl-powerup-ares');

assert(lblZeus !== null && lblHermes !== null && lblAthena !== null && lblAres !== null, "All 4 booster count labels exist");

// -------------------------------------------------------------
// SECTION 3: Pacing & Level Locks
// -------------------------------------------------------------
console.log('\n--- SECTION 3: Pacing & Level Locks ---');
// Level 1: All 4 should be locked
run(`
    gameState.currentPlayingLevel = 1;
    updateGameplayPowerups();
`);
assert(btnZeus.classList.contains('locked'), "Level 1: Zeus is locked");
assert(lblZeus.innerText.includes('5B'), "Level 1: Zeus label indicates unlock at Level 5");
assert(btnHermes.classList.contains('locked'), "Level 1: Hermes is locked");
assert(btnAthena.classList.contains('locked'), "Level 1: Athena is locked");
assert(btnAres.classList.contains('locked'), "Level 1: Ares is locked");

// Level 5: Zeus unlocks
run(`
    gameState.currentPlayingLevel = 5;
    updateGameplayPowerups();
`);
assert(!btnZeus.classList.contains('locked'), "Level 5: Zeus is unlocked");
assert(btnHermes.classList.contains('locked'), "Level 5: Hermes remains locked until Level 7");

// Level 15: All 4 unlocked
run(`
    gameState.currentPlayingLevel = 15;
    updateGameplayPowerups();
`);
assert(!btnZeus.classList.contains('locked') && !btnHermes.classList.contains('locked') && !btnAthena.classList.contains('locked') && !btnAres.classList.contains('locked'), "Level 15: All 4 boosters are fully unlocked");

// -------------------------------------------------------------
// SECTION 4: Consumption of Rights & Effects
// -------------------------------------------------------------
console.log('\n--- SECTION 4: Consumption of Rights & Divine Effects ---');
run(`
    gameState.currentPlayingLevel = 15;
    gameState.inventory = { zeus: 2, hermes: 2, athena: 2, ares: 1 };
    saveGame();
    startGameplayCore();
`);

// Test Zeus
const prevZeus = run("gameState.inventory.zeus");
run("usePowerup('zeus')");
assert(run("gameState.inventory.zeus") === prevZeus - 1, "usePowerup('zeus') consumed 1 charge (2 -> 1)");
assert(run("gameScore >= 2500"), "Zeus lightning awarded +2,500 score");

// Test Hermes
const prevHermes = run("gameState.inventory.hermes");
run("usePowerup('hermes')");
assert(run("gameState.inventory.hermes") === prevHermes - 1, "usePowerup('hermes') consumed 1 charge (2 -> 1)");

// Test Athena
const prevMoves = run("gameMoves");
const prevAthena = run("gameState.inventory.athena");
run("usePowerup('athena')");
assert(run("gameState.inventory.athena") === prevAthena - 1, "usePowerup('athena') consumed 1 charge (2 -> 1)");
assert(run("gameMoves") === prevMoves + 5, "Athena shield awarded +5 extra moves");

// Test Ares
const prevAres = run("gameState.inventory.ares");
run("usePowerup('ares')");
assert(run("gameState.inventory.ares") === prevAres - 1, "usePowerup('ares') consumed 1 charge (1 -> 0)");

// -------------------------------------------------------------
// SECTION 5: Quick-Buy Modal when Out of Rights
// -------------------------------------------------------------
console.log('\n--- SECTION 5: Quick-Buy Modal when Out of Rights ---');
const quickBuyModal = doc.getElementById('modal-quick-booster-buy');
assert(quickBuyModal !== null, "modal-quick-booster-buy exists in DOM");

// Now Ares is 0, using Ares should open modal-quick-booster-buy
run("usePowerup('ares')");
assert(quickBuyModal.classList.contains('active'), "Clicking empty booster (Ares 0x) opened modal-quick-booster-buy");

// Purchase 1 Ares with Gold (500 gold)
run(`
    gameState.gold = 1000;
    executeQuickBoosterPurchase('gold');
`);
assert(run("gameState.gold === 500"), "Quick buy deducted 500 gold for Ares");
assert(!quickBuyModal.classList.contains('active'), "modal-quick-booster-buy closed after purchase");

// -------------------------------------------------------------
// SECTION 6: Pre-Level Boosters in Level Preview Modal
// -------------------------------------------------------------
console.log('\n--- SECTION 6: Pre-Level Boosters in Level Preview Modal ---');
const preBoostersWrap = doc.getElementById('preview-preboosters-wrap');
const chipMoves = doc.getElementById('chip-prebooster-moves');
const chipBomb = doc.getElementById('chip-prebooster-bomb');

assert(preBoostersWrap !== null, "preview-preboosters-wrap exists in preview modal");
assert(chipMoves !== null, "chip-prebooster-moves exists");
assert(chipBomb !== null, "chip-prebooster-bomb exists");

// Toggle moves pre-booster
chipMoves.click();
assert(chipMoves.classList.contains('selected'), "Clicking chip-prebooster-moves marked it selected");

// Start gameplay with moves booster
run(`
    gameState.gold = 500;
    preLevelBoosters.moves = true;
    startGameplayCore();
`);
assert(run("gameState.gold === 350"), "Pre-game +3 moves deducted 150 gold (500 -> 350)");
assert(run("gameMoves === (LEVEL_DATA[gameState.currentPlayingLevel] ? LEVEL_DATA[gameState.currentPlayingLevel].maxMoves : 30) + 3"), "Starting gameMoves includes +3 bonus");

// -------------------------------------------------------------
// SECTION 7: Screen Store Live Counters & Categories
// -------------------------------------------------------------
console.log('\n--- SECTION 7: Screen Store Live Counters & Categories ---');
const invZeusStore = doc.getElementById('store-screen-inv-zeus');
const invHermesStore = doc.getElementById('store-screen-inv-hermes');
const invAthenaStore = doc.getElementById('store-screen-inv-athena');
const invAresStore = doc.getElementById('store-screen-inv-ares');

assert(invZeusStore !== null, "store-screen-inv-zeus exists in store");
assert(invHermesStore !== null, "store-screen-inv-hermes exists in store");
assert(invAthenaStore !== null, "store-screen-inv-athena exists in store");
assert(invAresStore !== null, "store-screen-inv-ares exists in store");

run(`
    gameState.inventory = { zeus: 7, hermes: 4, athena: 5, ares: 3 };
    syncAllHUDs();
`);
assert(invZeusStore.innerText === "7", "Store shows 7x Zeus");
assert(invHermesStore.innerText === "4", "Store shows 4x Hermes");
assert(invAthenaStore.innerText === "5", "Store shows 5x Athena");
assert(invAresStore.innerText === "3", "Store shows 3x Ares");

// -------------------------------------------------------------
// SECTION 8: Reset Full Game Inventory Wipe & Restoral
// -------------------------------------------------------------
console.log('\n--- SECTION 8: Reset Full Game Inventory Restoral ---');
run(`
    gameState.inventory = { zeus: 99, hermes: 88, athena: 77, ares: 66 };
    executeFullGameReset();
`);
assert(run("gameState.inventory.zeus === 2"), "After full game reset: Zeus restored to 2");
assert(run("gameState.inventory.hermes === 2"), "After full game reset: Hermes restored to 2");
assert(run("gameState.inventory.athena === 2"), "After full game reset: Athena restored to 2");
assert(run("gameState.inventory.ares === 1"), "After full game reset: Ares restored to 1");

console.log(`\n=============================================================`);
console.log(`TEST SUMMARY: ${passed} / ${total} assertions PASSED.`);
console.log(`=============================================================`);

if (passed === total) {
    console.log(">>> ALL STORE, CURRENCY & BOOSTER TESTS PASSED! <<<");
    process.exit(0);
} else {
    console.error(">>> SOME TESTS FAILED <<<");
    process.exit(1);
}

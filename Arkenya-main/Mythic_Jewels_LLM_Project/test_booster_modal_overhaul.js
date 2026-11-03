const assert = require('assert');
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

console.log('=== TEST: BOOSTER MODAL OVERHAUL & MONETIZATION FLOW ===');

const htmlContent = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

// Check CSS modal-overlay
assert(htmlContent.includes('background: rgba(4, 8, 18, 0.62);'), "CSS .modal-overlay has glassmorphism background (rgba(4, 8, 18, 0.62))");
assert(htmlContent.includes('backdrop-filter: blur(6px)'), "CSS .modal-overlay has backdrop-filter blur(6px)");
console.log('  [PASS] CSS Glassmorphism & semi-transparent backdrop verified (game board remains visible).');

const dom = new JSDOM(htmlContent, {
    url: 'http://localhost/',
    runScripts: 'dangerously',
    pretendToBeVisual: true
});

const { window } = dom;
const { document } = window;
const run = (code) => window.eval(code);

// Check DOM elements exist
const modal = document.getElementById('modal-quick-booster-buy');
assert(modal !== null, "modal-quick-booster-buy exists in DOM");

const btnGold = document.getElementById('btn-quick-buy-gold');
const btnGems = document.getElementById('btn-quick-buy-gems');
const insuffArea = document.getElementById('quick-buy-insufficient-area');
const btnStore = document.getElementById('btn-quick-buy-goto-store');
const btnAd = document.getElementById('btn-quick-buy-ad-free');
const btnExchange = document.getElementById('btn-quick-buy-exchange-gems');

assert(btnGold !== null, "btn-quick-buy-gold exists");
assert(btnGems !== null, "btn-quick-buy-gems exists");
assert(insuffArea !== null, "quick-buy-insufficient-area exists");
assert(btnStore !== null, "btn-quick-buy-goto-store exists");
assert(btnAd !== null, "btn-quick-buy-ad-free exists");
assert(btnExchange !== null, "btn-quick-buy-exchange-gems exists");
console.log('  [PASS] All modal controls, store redirect button, and ad reward button exist in DOM.');

// TEST CASE 1: Insufficient Balance (User has 210 Gold, 6 Gems, Zeus costs 3500 Gold / 15 Gems)
run(`
    gameState.gold = 210;
    gameState.gems = 6;
    switchQuickBuyGod('zeus');
`);

assert.strictEqual(btnGold.disabled, true, "btnGold must be disabled when user has insufficient gold");
assert.strictEqual(btnGold.style.pointerEvents, 'none', "btnGold pointer-events must be none");
assert(btnGold.innerHTML.includes('Yetersiz Altın'), "btnGold shows missing gold deficit badge");
assert(btnGold.innerHTML.includes('90'), "btnGold indicates exactly 90 missing gold (300 - 210)");

assert.strictEqual(btnGems.disabled, true, "btnGems must be disabled when user has insufficient gems");
assert.strictEqual(btnGems.style.pointerEvents, 'none', "btnGems pointer-events must be none");
assert(btnGems.innerHTML.includes('Yetersiz Elmas'), "btnGems shows missing gems deficit badge");
assert(btnGems.innerHTML.includes('9'), "btnGems indicates exactly 9 missing gems");

assert.strictEqual(insuffArea.style.display, 'block', "Olimpos Treasury / Store referral card is visible");
assert(document.getElementById('quick-buy-insufficient-msg').innerHTML.includes('Mevcut bakiyen takviye için yetersiz'), "Helpful guidance message is shown");
console.log('  [PASS] Test Case 1: Insufficient balance properly disables buttons, displays exact deficits, and shows Olimpos Store card.');

// TEST CASE 2: Sufficient Gold (User has 5000 Gold, 6 Gems)
run(`
    gameState.gold = 5000;
    gameState.gems = 6;
    switchQuickBuyGod('zeus');
`);

assert.strictEqual(btnGold.disabled, false, "btnGold is enabled when user has enough gold");
assert.strictEqual(btnGold.style.pointerEvents, 'auto', "btnGold pointer-events is auto");
assert.strictEqual(btnGems.disabled, true, "btnGems remains disabled when gems are insufficient");
console.log('  [PASS] Test Case 2: Sufficient gold enables gold purchase button.');

// TEST CASE 3: Sufficient Gems (User has 210 Gold, 20 Gems)
run(`
    gameState.gold = 210;
    gameState.gems = 20;
    switchQuickBuyGod('zeus');
`);

assert.strictEqual(btnGold.disabled, true, "btnGold remains disabled when gold is insufficient");
assert.strictEqual(btnGems.disabled, false, "btnGems is enabled when user has enough gems");
assert.strictEqual(btnGems.style.pointerEvents, 'auto', "btnGems pointer-events is auto");
// Since user has 20 gems (>= 10) and not enough gold, Gem exchange button should be available!
assert.strictEqual(btnExchange.style.display, 'block', "Exchange button is offered since user has >= 10 gems");
console.log('  [PASS] Test Case 3: Sufficient gems enables gem purchase and shows gem-to-gold exchange option.');

// TEST CASE 4: Purchase with Gold
run(`
    gameState.unlockedLevel = 5;
    gameState.currentPlayingLevel = 5;
    gameState.gold = 5000;
    gameState.inventory = { zeus: 0 };
    activeQuickBuyGod = 'zeus';
    executeQuickBoosterPurchase('gold');
`);
assert.strictEqual(run('gameState.gold'), 4700, "Gold properly deducted (5000 - 300 = 4700)");
assert.strictEqual(run('gameState.inventory.zeus'), 1, "+1 Zeus booster added to inventory");
console.log('  [PASS] Test Case 4: Gold purchase deducts cost and credits booster.');

// TEST CASE 5: Ethical Store Navigation Flow
run(`
    isGamePaused = false;
    openStoreFromQuickBuy();
`);
assert.strictEqual(run('isGamePaused'), true, "Game is paused while navigating to store");
assert.strictEqual(run('currentActiveScreen'), 'screen-store', "Active screen switches to screen-store");
assert(!modal.classList.contains('active'), "Quick buy modal is closed");
console.log('  [PASS] Test Case 5: Store referral smoothly opens store and pauses game.');

// TEST CASE 6: Return from Store to Gameplay
run(`
    showScreen('screen-gameplay');
`);
assert.strictEqual(run('currentActiveScreen'), 'screen-gameplay', "Active screen is screen-gameplay");
assert.strictEqual(run('isGamePaused'), false, "Game is automatically unpaused upon returning to gameplay");
console.log('  [PASS] Test Case 6: Returning from store unpauses gameplay.');

console.log('\nResults: ALL 6 TEST SUITES PASSED! (100% Verified)');

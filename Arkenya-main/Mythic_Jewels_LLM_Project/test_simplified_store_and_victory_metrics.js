const fs = require('fs');
const { JSDOM } = require('jsdom');

console.log('===================================================================');
console.log('🧪 TESTING SIMPLIFIED STORE & REFORMED VICTORY METRICS');
console.log('===================================================================');

const html = fs.readFileSync('www/index.html', 'utf8');

const dom = new JSDOM(html, {
    url: 'http://localhost',
    runScripts: 'dangerously',
    beforeParse(win) {
        win.AudioContext = class {
            constructor() { this.state = 'running'; }
            createOscillator() { return { connect: () => {}, frequency: { setValueAtTime: () => {} }, start: () => {}, stop: () => {} }; }
            createGain() { return { connect: () => {}, gain: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} } }; }
        };
        win.requestAnimationFrame = (cb) => setTimeout(cb, 16);
    }
});

const { window } = dom;
const { document } = window;
const run = (code) => window.eval(code);

function assert(condition, message) {
    if (!condition) {
        console.error(`❌ FAIL: ${message}`);
        process.exit(1);
    }
    console.log(`✅ PASS: ${message}`);
}

async function runTestSuite() {
    // -------------------------------------------------------------
    // TEST 1: Simplified Store DOM Elements & Counters
    // -------------------------------------------------------------
    console.log('\n[TEST 1] Verifying Simplified Store Structure & Live Counters:');
    const storeGold = document.getElementById('store-screen-gold');
    const storeGems = document.getElementById('store-screen-gems');
    const invZeus = document.getElementById('store-screen-inv-zeus');
    const invHermes = document.getElementById('store-screen-inv-hermes');
    const invAthena = document.getElementById('store-screen-inv-athena');
    const invAres = document.getElementById('store-screen-inv-ares');

    assert(storeGold !== null && storeGems !== null, "Store gold and gems indicators are present");
    assert(invZeus !== null && invHermes !== null && invAthena !== null && invAres !== null, "All 4 inventory counters exist in Store DOM");

    run(`
        gameState.gold = 1500;
        gameState.gems = 45;
        gameState.inventory = { zeus: 3, hermes: 2, athena: 4, ares: 1 };
        updateStoreUI();
    `);

    assert(storeGold.innerText === "1,500" || storeGold.innerText === "1.500", `Store gold displayed correctly: ${storeGold.innerText}`);
    assert(storeGems.innerText === "45", `Store gems displayed correctly: ${storeGems.innerText}`);
    assert(invZeus.innerText === "3", `Zeus inventory shows 3x`);
    assert(invHermes.innerText === "2", `Hermes inventory shows 2x`);
    assert(invAthena.innerText === "4", `Athena inventory shows 4x`);
    assert(invAres.innerText === "1", `Ares inventory shows 1x`);

    // -------------------------------------------------------------
    // TEST 2: Purchasing Boosters with In-Game Gold
    // -------------------------------------------------------------
    console.log('\n[TEST 2] Verifying In-Game Gold Booster Purchase:');
    run(`
        gameState.gold = 1000;
        gameState.inventory.zeus = 0;
        buyItem('zeus', 300, 'gold', 1);
    `);
    assert(run("gameState.gold === 700"), `Gold correctly deducted (1000 - 300 = 700): ${run("gameState.gold")}`);
    assert(run("gameState.inventory.zeus === 1"), `Zeus inventory increased to 1: ${run("gameState.inventory.zeus")}`);

    // -------------------------------------------------------------
    // TEST 3: Purchasing Trio God Bundle with Earned Gems
    // -------------------------------------------------------------
    console.log('\n[TEST 3] Verifying Trio God Bundle (15 Gems -> 1x Zeus, 1x Hermes, 1x Athena):');
    run(`
        gameState.gems = 30;
        gameState.inventory = { zeus: 0, hermes: 0, athena: 0, ares: 0 };
        buyItem('bundle_trio', 15, 'gems', 1);
    `);
    assert(run("gameState.gems === 15"), `Gems deducted (30 - 15 = 15): ${run("gameState.gems")}`);
    assert(run("gameState.inventory.zeus === 1"), `Trio bundle granted 1x Zeus`);
    assert(run("gameState.inventory.hermes === 1"), `Trio bundle granted 1x Hermes`);
    assert(run("gameState.inventory.athena === 1"), `Trio bundle granted 1x Athena`);

    // -------------------------------------------------------------
    // TEST 4: Realistic Gems-to-Gold Exchange (No 45,000 inflation)
    // -------------------------------------------------------------
    console.log('\n[TEST 4] Verifying Gems-to-Gold Exchange (10 Gems -> 500 Gold & 20 Gems -> 1200 Gold):');
    run(`
        gameState.gems = 50;
        gameState.gold = 200;
        exchangeGemsForGold(10, 500);
    `);
    assert(run("gameState.gems === 40 && gameState.gold === 700"), `Small exchange: 10 Gems -> 500 Gold (Gems: 40, Gold: 700)`);

    run(`
        exchangeGemsForGold(20, 1200);
    `);
    assert(run("gameState.gems === 20 && gameState.gold === 1900"), `Big chest exchange: 20 Gems -> 1200 Gold (Gems: 20, Gold: 1900)`);

    // -------------------------------------------------------------
    // TEST 5: Victory Screen Metrics & Accuracy Rationalization
    // -------------------------------------------------------------
    console.log('\n[TEST 5] Verifying Victory Screen Metrics Rationalization:');
    run(`
        gameState.currentPlayingLevel = 1;
        gameTarget = 3500;
        gameScore = 5200;
        movesLeftAtWin = 4;
        showVictory();
    `);

    const accuracyEl = document.getElementById('victory-accuracy');
    const targetScoreEl = document.getElementById('victory-target-score');
    const xpEarnedEl = document.getElementById('victory-xp-earned');
    const movesLeftEl = document.getElementById('victory-moves-left');

    assert(!accuracyEl.innerText.includes('565'), `Absurd 565% accuracy bug eliminated! Current: "${accuracyEl.innerText}"`);
    assert(accuracyEl.innerText.includes('100%') || accuracyEl.innerText.includes('%100'), `Accuracy properly capped and labeled: "${accuracyEl.innerText}"`);
    assert((targetScoreEl.innerText.includes('3,500') || targetScoreEl.innerText.includes('3.500')) && targetScoreEl.innerText.includes('✓'), `Target clearly shows completed target: "${targetScoreEl.innerText}"`);
    assert(xpEarnedEl.innerText.includes('XP') && xpEarnedEl.innerText.includes('Zafer'), `XP origin transparently stated: "${xpEarnedEl.innerText}"`);
    assert(movesLeftEl.innerText.includes('+4 Hamle'), `Leftover moves bonus accurately labeled: "${movesLeftEl.innerText}"`);

    console.log('\n===================================================================');
    console.log('🏆 ALL SIMPLIFIED STORE & VICTORY METRIC TESTS PASSED!');
    console.log('===================================================================');
}

runTestSuite()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error("Test Suite Unhandled Exception:", err);
        process.exit(1);
    });

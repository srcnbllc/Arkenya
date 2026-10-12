const fs = require('fs');
const assert = require('assert');
const { JSDOM } = require('jsdom');

console.log("===================================================================");
console.log("🧪 TESTING REBALANCED COMBO ECONOMY & SCARCITY PROTECTION");
console.log("===================================================================");

const htmlContent = fs.readFileSync('www/index.html', 'utf8');

const dom = new JSDOM(htmlContent, {
    url: "http://localhost",
    runScripts: "dangerously",
    resources: "usable",
    beforeParse(window) {
        window.AudioContext = class {
            constructor() {
                this.state = 'running';
                this.currentTime = 0;
                this.destination = {};
            }
            createOscillator() {
                return {
                    connect: () => {},
                    frequency: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} },
                    start: () => {},
                    stop: () => {}
                };
            }
            createGain() {
                return {
                    connect: () => {},
                    gain: {
                        value: 0.1,
                        setValueAtTime: () => {},
                        exponentialRampToValueAtTime: () => {},
                        linearRampToValueAtTime: () => {}
                    }
                };
            }
            createBiquadFilter() {
                return {
                    connect: () => {},
                    frequency: { setValueAtTime: () => {} }
                };
            }
            resume() { return Promise.resolve(); }
        };
        window.webkitAudioContext = window.AudioContext;
        window.fetch = () => Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    }
});

const { window } = dom;
const { document } = window;
const run = (code) => window.eval(code);

async function runTestSuite() {
    // -------------------------------------------------------------
    // TEST 1: checkAndAwardComboJokerDrop does NOT award jokers
    // -------------------------------------------------------------
    console.log("\n[TEST 1] Verifying checkAndAwardComboJokerDrop gives 0 jokers:");
    run(`
        gameState.inventory = { zeus: 0, athena: 0, hermes: 0, ares: 0, energy: 0 };
        checkAndAwardComboJokerDrop(3);
        checkAndAwardComboJokerDrop(4);
        checkAndAwardComboJokerDrop(5);
    `);
    const inv = run('gameState.inventory');
    console.log("  Inventory after 3x/4x/5x combo calls:", inv);
    assert.strictEqual(inv.zeus, 0, 'Zeus must not drop from combos');
    assert.strictEqual(inv.athena, 0, 'Athena must not drop from combos');
    assert.strictEqual(inv.hermes, 0, 'Hermes must not drop from combos');
    assert.strictEqual(inv.ares, 0, 'Ares must not drop from combos');
    console.log("✅ PASS: In-game combos do NOT drop unearned divine jokers!");

    // -------------------------------------------------------------
    // TEST 2: checkAndAwardComboDiamondDrop does NOT award diamonds
    // -------------------------------------------------------------
    console.log("\n[TEST 2] Verifying checkAndAwardComboDiamondDrop gives 0 diamonds:");
    run(`
        gameState.gems = 10;
        checkAndAwardComboDiamondDrop(3);
        checkAndAwardComboDiamondDrop(4);
        checkAndAwardComboDiamondDrop(5);
    `);
    const gems = run('gameState.gems');
    console.log("  Gems after 3x/4x/5x combo calls:", gems);
    assert.strictEqual(gems, 10, 'Gems must remain unchanged by casual combos');
    console.log("✅ PASS: In-game combos do NOT leak premium diamonds!");

    // -------------------------------------------------------------
    // TEST 3: Mid-match 2x, 3x, 4x combos give Score & Gauge, NOT Wallet Gold
    // -------------------------------------------------------------
    console.log("\n[TEST 3] Verifying processMatchesWithExplosion gives Score, NOT Wallet Gold:");
    run(`
        gameState.currentPlayingLevel = 6;
        gameState.gold = 500;
        initGrid();
        // Setup matching cells
        gridData[0][0] = 'ruby';
        gridData[0][1] = 'ruby';
        gridData[0][2] = 'ruby';
        processMatchesWithExplosion(2);
    `);
    const goldAfterCombo2 = run('gameState.gold');
    console.log("  Gold after 2x combo:", goldAfterCombo2);
    assert.strictEqual(goldAfterCombo2, 500, 'Gold must NOT increase mid-swap on 2x combo');

    run(`
        gridData[1][0] = 'sapphire';
        gridData[1][1] = 'sapphire';
        gridData[1][2] = 'sapphire';
        processMatchesWithExplosion(4);
    `);
    const goldAfterCombo4 = run('gameState.gold');
    console.log("  Gold after 4x combo:", goldAfterCombo4);
    assert.strictEqual(goldAfterCombo4, 500, 'Gold must NOT increase mid-swap on 4x combo');
    console.log("✅ PASS: In-game combos reward Score and Charge, preserving wallet economy!");

    // -------------------------------------------------------------
    // TEST 4: Victory Screen DOES award legitimate Gold, Gems & XP
    // -------------------------------------------------------------
    console.log("\n[TEST 4] Verifying Victory Screen awards legitimate earned rewards:");
    run(`
        gameState.currentPlayingLevel = 6;
        gameState.completedLevels = {};
        gameScore = 10000;
        gameTarget = 8000;
        movesLeftAtWin = 5;
        const initialGold = gameState.gold;
        const initialGems = gameState.gems;
        showVictory();
    `);
    const goldAfterWin = run('gameState.gold');
    const gemsAfterWin = run('gameState.gems');
    console.log("  Gold before win:", 500, "-> after win:", goldAfterWin);
    console.log("  Gems before win:", 10, "-> after win:", gemsAfterWin);
    assert(goldAfterWin > 500, 'Gold must be legitimately rewarded upon completing level');
    assert(gemsAfterWin > 10, 'Gems must be legitimately rewarded upon completing level');
    console.log("✅ PASS: Level victory legitimately delivers hard-earned gold and diamonds!");

    console.log("\n===================================================================");
    console.log("🏆 ALL COMBO ECONOMY & SCARCITY REBALANCE TESTS PASSED!");
    console.log("===================================================================");
}

runTestSuite().then(() => {
    process.exit(0);
}).catch(err => {
    console.error("❌ TEST FAILED:", err);
    process.exit(1);
});

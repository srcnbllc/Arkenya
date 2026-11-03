const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { JSDOM } = require('jsdom');

console.log("=== ARKENYA UNIFIED REWARD & STORE ECONOMY TEST SUITE ===");

const htmlPath = path.resolve(__dirname, 'index.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');

const dom = new JSDOM(htmlContent, {
    url: 'http://localhost',
    runScripts: 'dangerously',
    beforeParse(win) {
        win.AudioContext = class {
            createOscillator() { return { connect() {}, start() {}, stop() {}, frequency: { setValueAtTime() {}, exponentialRampToValueAtTime() {} } }; }
            createGain() { return { connect() {}, gain: { setValueAtTime() {}, linearRampToValueAtTime() {}, exponentialRampToValueAtTime() {} } }; }
            get currentTime() { return 0; }
            get state() { return 'running'; }
            resume() { return Promise.resolve(); }
        };
        win.webkitAudioContext = win.AudioContext;
        win.navigator.vibrate = () => true;
        win.localStorage = {
            _data: {},
            getItem(k) { return this._data[k] || null; },
            setItem(k, v) { this._data[k] = String(v); },
            removeItem(k) { delete this._data[k]; }
        };
    }
});

const window = dom.window;
const document = window.document;

function runSuite() {
    console.log("\n[TEST 1] Daily Rewards Table & Single Claim Engine Synchronization...");
    assert(Array.isArray(window.DAILY_REWARDS), "DAILY_REWARDS array exists");
    assert.strictEqual(window.DAILY_REWARDS.length, 7, "DAILY_REWARDS has exactly 7 days");
    assert.strictEqual(window.DAILY_REWARDS[0].gold, 50, "Day 1 gives 50 gold");
    assert.strictEqual(window.DAILY_REWARDS[0].items.zeus, 1, "Day 1 gives 1x Zeus");
    assert.strictEqual(window.DAILY_REWARDS[6].gold, 200, "Day 7 gives 200 gold");
    assert.strictEqual(window.DAILY_REWARDS[6].gems, 15, "Day 7 gives 15 gems");
    console.log("✓ TEST 1 PASSED: 7-day streak rewards verified");

    console.log("\n[TEST 2] Booster Prices: Store & Quick Booster Buy Parity...");
    assert(window.BOOSTER_CONFIG, "BOOSTER_CONFIG exists");
    assert.strictEqual(window.BOOSTER_CONFIG.zeus.goldCost, 300, "Zeus gold cost is 300 (matches store)");
    assert.strictEqual(window.BOOSTER_CONFIG.hermes.goldCost, 250, "Hermes gold cost is 250 (matches store)");
    assert.strictEqual(window.BOOSTER_CONFIG.athena.goldCost, 350, "Athena gold cost is 350 (matches store)");
    assert.strictEqual(window.BOOSTER_CONFIG.ares.goldCost, 450, "Ares gold cost is 450 (matches store)");
    console.log("✓ TEST 2 PASSED: 100% price harmony between Store and Gameplay Quick Buy");

    console.log("\n[TEST 3] Lives Economy: Store & Out-Of-Lives Modal Parity...");
    // Check buyLivesWithGold default
    window.gameState = window.gameState || {};
    window.gameState.gold = 1000;
    window.gameState.energy = 0;
    window.gameState.maxEnergy = 5;
    window.buyLivesWithGold(200, 5);
    assert.strictEqual(window.gameState.gold, 800, "200 Gold deducted for 5 lives");
    assert.strictEqual(window.gameState.energy, 5, "Energy replenished to 5");

    window.gameState.gems = 10;
    window.gameState.energy = 0;
    window.buyLivesWithGems(4, 5);
    assert.strictEqual(window.gameState.gems, 6, "4 Gems deducted for 5 lives");
    assert.strictEqual(window.gameState.energy, 5, "Energy replenished to 5 via gems");
    console.log("✓ TEST 3 PASSED: 5 lives = 200 Gold or 4 Gems across all dialogs");

    console.log("\n[TEST 4] Ad Chest & Free Ad Rewards Harmonization...");
    window.AdGuard.showRewardedAd = (title, cb) => cb();
    window.gameState.dailyHub = { adChestCount: 0, adChestDate: new Date().toDateString() };
    const prevGold = window.gameState.gold;
    window.claimStoreAdChest();
    assert.strictEqual(window.gameState.gold, prevGold + 50, "+50 Gold delivered from store ad chest");
    assert.strictEqual(window.gameState.dailyHub.adChestCount, 1, "Ad chest count incremented to 1");

    window.watchAdForFreeGold();
    assert.strictEqual(window.gameState.gold, prevGold + 100, "+50 Gold delivered from free gold ad");
    console.log("✓ TEST 4 PASSED: Ad rewards unified to 50 Gold standard");

    console.log("\n[TEST 5] Daily Quests & Store Banner Harmonization...");
    assert(Array.isArray(window.DAILY_QUESTS_CONFIG), "DAILY_QUESTS_CONFIG exists");
    assert.strictEqual(window.DAILY_QUESTS_CONFIG.length, 3, "Exactly 3 daily quests configured");
    assert.strictEqual(window.DAILY_QUESTS_CONFIG[0].reward.gold, 50, "Quest 1 gives 50 gold");
    assert.strictEqual(window.DAILY_QUESTS_CONFIG[1].reward.gold, 75, "Quest 2 gives 75 gold");
    assert.strictEqual(window.DAILY_QUESTS_CONFIG[2].reward.gems, 3, "Quest 3 gives 3 gems");

    // Master chest test
    window.gameState.dailyHub.quests = {
        claimed: { q1: true, q2: true, q3: true, master: false }
    };
    const preMasterGold = window.gameState.gold;
    const preMasterGems = window.gameState.gems;
    window.claimDailyMasterChest();
    assert.strictEqual(window.gameState.gold, preMasterGold + 150, "Master chest gives +150 Gold");
    assert.strictEqual(window.gameState.gems, preMasterGems + 5, "Master chest gives +5 Gems");
    console.log("✓ TEST 5 PASSED: Daily quests & master chest rewards match store banner");

    console.log("\n[TEST 6] Level Victory & Level Preview Reward Harmonization...");
    assert(typeof window.calculateLevelRewards === 'function', "calculateLevelRewards engine exists");
    const r1 = window.calculateLevelRewards(1, 3);
    assert.strictEqual(r1.gold, 55, "Level 1 (3 stars): 40 base + 15 star bonus = 55 Gold");
    assert.strictEqual(r1.gems, 1, "Level 1 (3 stars): 1 Gem");

    const r10 = window.calculateLevelRewards(10, 3);
    assert.strictEqual(r10.gold, 155, "Level 10 Boss: 40 base + 15 star bonus + 100 boss bonus = 155 Gold");
    assert.strictEqual(r10.gems, 5, "Level 10 Boss: 5 Gems");

    const r36 = window.calculateLevelRewards(36, 3);
    assert.strictEqual(r36.gold, 135, "Level 36 (3 stars): 100 base + 35 star bonus = 135 Gold");
    console.log("✓ TEST 6 PASSED: calculateLevelRewards produces deterministic gold/gems");

    console.log("\n[TEST 7] Gem-To-Gold Exchange Rate Consistency...");
    // Store Small Pouch: 10 Gems = 500 Gold
    // Smart Exchange Tier: 10 Gems = 500 Gold
    // Quick Booster Buy Exchange: 10 Gems = 500 Gold
    window.gameState.gems = 20;
    window.gameState.gold = 50;
    window.gameState.currentPlayingLevel = 5;
    window.gameState.unlockedLevel = 5;
    window.activeQuickBuyGod = 'zeus'; // Cost: 300 gold
    window.executeQuickBoosterGemExchange();
    // 20 - 10 = 10 gems left
    // 50 + 500 - 300 = 250 gold left
    // +1 Zeus in inventory
    assert.strictEqual(window.gameState.gems, 10, "10 Gems spent in quick exchange");
    assert.strictEqual(window.gameState.gold, 250, "Player received 500 gold, paid 300 for Zeus, has 250 gold left");
    assert.strictEqual(window.gameState.inventory.zeus, 1, "1 Zeus added to inventory");
    console.log("✓ TEST 7 PASSED: 10 Gems = 500 Gold exchange rate perfectly preserved");

    console.log("\n=======================================================");
    console.log("🎉 ALL 7 UNIFIED REWARD ECONOMY SUITES PASSED! 100% SUCCESS!");
    console.log("=======================================================\n");
}

try {
    runSuite();
} catch (err) {
    console.error("❌ TEST SUITE FAILED:", err);
    process.exit(1);
}

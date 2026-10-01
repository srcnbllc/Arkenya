const fs = require('fs');
const { JSDOM } = require('jsdom');

console.log('=== TEST SUITE: INTEGRATED STORE REWARDS & DAILY TREASURES ===');

const html = fs.readFileSync('www/index.html', 'utf8');

const dom = new JSDOM(html, {
    url: 'http://localhost',
    runScripts: 'dangerously',
    beforeParse(win) {
        win.requestAnimationFrame = (cb) => setTimeout(cb, 16);
    }
});

const win = dom.window;
const doc = win.document;

function assert(condition, message) {
    if (!condition) {
        console.error('FAIL:', message);
        process.exit(1);
    }
    console.log('✓', message);
}

// 1. Initial State & DOM Presence
assert(!!win.gameState, 'gameState exists on window');
assert(!!win.ensureDailyHubData, 'ensureDailyHubData function exists');
win.ensureDailyHubData();
assert(!!win.gameState.dailyHub, 'gameState.dailyHub initialized');
assert(!!win.gameState.dailyHub.quests, 'gameState.dailyHub.quests initialized');
assert(doc.getElementById('store-free-gift-btn-container') !== null, 'store-free-gift-btn-container exists in DOM');
assert(doc.getElementById('store-ad-chest-btn-container') !== null, 'store-ad-chest-btn-container exists in DOM');
assert(doc.getElementById('store-quests-badge-count') !== null, 'store-quests-badge-count exists in DOM');
assert(doc.getElementById('modal-daily-quests') !== null, 'modal-daily-quests exists in DOM');

// 2. Test Claiming Store Free Gift
const initGold = win.gameState.gold || 0;
const initEnergy = win.gameState.energy || 0;
win.gameState.dailyHub.freeGiftDate = null; // ensure eligible
win.claimStoreFreeGift();
assert(win.gameState.gold === initGold + 150, 'Store Free Gift added 150 gold (Expected ' + (initGold + 150) + ', got ' + win.gameState.gold + ')');
assert(win.gameState.energy >= initEnergy, 'Store Free Gift replenished energy');
assert(win.gameState.dailyHub.freeGiftDate === new Date().toDateString(), 'freeGiftDate marked as today');

// Second claim today should be blocked
const goldBeforeSecond = win.gameState.gold;
win.claimStoreFreeGift();
assert(win.gameState.gold === goldBeforeSecond, 'Second free gift claim on same day is blocked');

// 3. Test Claiming Store Ad Chest
win.gameState.dailyHub.adChestCount = 0;
win.gameState.dailyHub.adChestDate = new Date().toDateString();
win.gameState.hasPurchasedNoAds = true; // VIP instant test
const goldBeforeAd = win.gameState.gold;
const gemsBeforeAd = win.gameState.gems;

win.claimStoreAdChest();
assert(win.gameState.gold === goldBeforeAd + 50, 'Ad chest added 50 gold (VIP instant)');
assert(win.gameState.dailyHub.adChestCount === 1, 'adChestCount incremented to 1');

// Claim 2nd ad chest
win.claimStoreAdChest();
assert(win.gameState.dailyHub.adChestCount === 2, 'adChestCount incremented to 2');

// Claim 3rd ad chest
win.claimStoreAdChest();
assert(win.gameState.dailyHub.adChestCount === 3, 'adChestCount incremented to 3');

// 4th claim should be blocked (limit 3/3)
win.claimStoreAdChest();
assert(win.gameState.dailyHub.adChestCount === 3, '4th claim blocked, limit 3/3 respected');

// 4. Test Daily Quests Progression & Claims
win.gameState.dailyHub.quests = {
    q1_gems: 0,
    q2_levels: 0,
    q3_powers: 0,
    claimed: { q1: false, q2: false, q3: false, master: false }
};

// Quest 1: Gems
assert(!win.gameState.dailyHub.quests.claimed.q1, 'Quest 1 unclaimed initially');
win.gameState.dailyHub.quests.q1_gems = 100; // reach target
const goldBeforeQ1 = win.gameState.gold;
win.claimDailyQuest('q1');
assert(win.gameState.dailyHub.quests.claimed.q1 === true, 'Quest 1 marked as claimed');
assert(win.gameState.gold === goldBeforeQ1 + 200, 'Quest 1 awarded 200 gold');

// Quest 2: Levels Won
win.gameState.dailyHub.quests.q2_levels = 2; // reach target
win.gameState.inventory = win.gameState.inventory || {};
const zeusBeforeQ2 = win.gameState.inventory.zeus || 0;
win.claimDailyQuest('q2');
assert(win.gameState.dailyHub.quests.claimed.q2 === true, 'Quest 2 marked as claimed');
assert((win.gameState.inventory.zeus || 0) === zeusBeforeQ2 + 1, 'Quest 2 awarded 1 Zeus booster');

// Quest 3: Hero Power
win.gameState.dailyHub.quests.q3_powers = 1; // reach target
const gemsBeforeQ3 = win.gameState.gems;
win.claimDailyQuest('q3');
assert(win.gameState.dailyHub.quests.claimed.q3 === true, 'Quest 3 marked as claimed');
assert(win.gameState.gems === gemsBeforeQ3 + 5, 'Quest 3 awarded 5 gems');

// 5. Test Master Chest (All 3 quests complete)
const goldBeforeMaster = win.gameState.gold;
const gemsBeforeMaster = win.gameState.gems;
const athenaBeforeMaster = win.gameState.inventory.athena || 0;

win.claimDailyMasterChest();
assert(win.gameState.dailyHub.quests.claimed.master === true, 'Master chest marked as claimed');
assert(win.gameState.gold === goldBeforeMaster + 500, 'Master chest awarded 500 gold');
assert(win.gameState.gems === gemsBeforeMaster + 10, 'Master chest awarded 10 gems');
assert((win.gameState.inventory.athena || 0) === athenaBeforeMaster + 1, 'Master chest awarded 1 Athena shield');

// 6. Test openDailyRewardsModal & UI sync
assert(typeof win.openDailyRewardsModal === 'function', 'openDailyRewardsModal is defined and callable');
win.openDailyRewardsModal(); // Should not throw error

assert(typeof win.updateDailyHubUI === 'function', 'updateDailyHubUI is defined and callable');
win.updateDailyHubUI(); // Updates all badges and counters

console.log('\n>>> ALL 6 INTEGRATED REWARDS & DAILY TREASURES SUITES PASSED! <<<');
process.exit(0);

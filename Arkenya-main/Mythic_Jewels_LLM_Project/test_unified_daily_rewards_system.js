const fs = require('fs');
const { JSDOM } = require('jsdom');
const assert = require('assert');

console.log("================================================================================");
console.log("🎁 TEST: UNIFIED DAILY REWARDS & STORE SYNCHRONIZATION TEST SUITE");
console.log("================================================================================");

const html = fs.readFileSync('index.html', 'utf8');

// 1. Verify CSS & HTML Structure
console.log("\n--- TEST 1: Button Styling & HTML Structure ---");
assert(html.includes('id="btn-claim-daily-reward"'), "Modal claim button has id btn-claim-daily-reward");
assert(html.includes('min-height: 48px; height: auto;'), "Modal claim button has flexible height to prevent overflow");
assert(html.includes('id="store-free-gift-desc"'), "Store free gift has dynamic description id");
console.log("  ✅ [PASS] Flexible button styling & dynamic store elements verified.");

const dom = new JSDOM(html, {
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

const { window } = dom;
const { document } = window;

// 2. Unclaimed State: Auto-launch should open modal
console.log("\n--- TEST 2: Unclaimed Daily Reward Auto-Launch ---");
window.gameState.lastClaimedRewardDay = null;
if (window.gameState.dailyHub) window.gameState.dailyHub.freeGiftDate = null;
window.gameState.loginStreak = 1;
window.gameState.gold = 100;
window.gameState.currentPlayingLevel = 5;
window.gameState.unlockedLevel = 5;
window.gameState.inventory = { zeus: 0 };

const modal = document.getElementById('modal-daily-reward');
modal.classList.remove('active');

window.checkDailyReward(false); // auto-launch
assert(modal.classList.contains('active'), "Modal MUST open on auto-launch when reward is unclaimed!");

const claimBtn = document.getElementById('btn-claim-daily-reward');
assert.strictEqual(claimBtn.disabled, false, "Claim button must be enabled when unclaimed!");
assert(claimBtn.innerHTML.includes('GÜN 1 ÖDÜLÜNÜ AL'), "Claim button must show Day 1 reward!");
console.log("  ✅ [PASS] Auto-launch opened modal with active Day 1 claim button.");

// 3. Store Synchronization in Unclaimed State
console.log("\n--- TEST 3: Store Synchronization (Unclaimed) ---");
window.updateDailyHubUI();
const storeDesc = document.getElementById('store-free-gift-desc');
const storeBtnContainer = document.getElementById('store-free-gift-btn-container');
assert(storeDesc.innerHTML.includes('50 Altın + 1x Şimşek'), "Store card description must match Day 1 streak reward!");
assert(storeBtnContainer.innerHTML.includes('GÜN 1 AL'), "Store button must indicate Day 1 claim!");
console.log("  ✅ [PASS] Store gift card perfectly matches 7-day streak Day 1 reward.");

// 4. Claim Reward & Verify 100% Dual-Sync
console.log("\n--- TEST 4: Claiming Reward & Dual-Sync ---");
window.claimDailyReward();
assert.strictEqual(window.gameState.gold, 150, "Gold credited (100 + 50 = 150)!");
assert.strictEqual(window.gameState.inventory.zeus, 1, "1x Zeus lightning booster credited!");
const today = new Date().toDateString();
assert.strictEqual(window.gameState.lastClaimedRewardDay, today, "lastClaimedRewardDay updated to today!");
assert.strictEqual(window.gameState.dailyHub.freeGiftDate, today, "dailyHub.freeGiftDate synced with lastClaimedRewardDay!");
assert(!modal.classList.contains('active'), "Modal closes after claiming reward!");
console.log("  ✅ [PASS] Reward claimed, inventory updated, and date flags dual-synced.");

// 5. Claimed State in Modal (Manual View)
console.log("\n--- TEST 5: Manual Open After Claim & Countdown Display ---");
window.openDailyRewardsModal();
assert(modal.classList.contains('active'), "Modal opens upon explicit manual click!");
assert.strictEqual(claimBtn.disabled, true, "Claim button must be disabled after claim!");
assert(claimBtn.innerHTML.includes('BUGÜNKÜ ÖDÜLÜNÜ ALDIN'), "Button says BUGÜNKÜ ÖDÜLÜNÜ ALDIN!");
assert(claimBtn.innerHTML.includes('⏳ Yeni Ödül:'), "Button displays live countdown timer without text overflow!");
console.log("  ✅ [PASS] Claimed button shows clean badge and live countdown.");

// 6. Claimed State in Store
console.log("\n--- TEST 6: Store Card Reflects Claimed Status & Countdown ---");
window.updateDailyHubUI();
assert(storeBtnContainer.innerHTML.includes('⏳'), "Store button becomes countdown timer button!");
assert(storeBtnContainer.querySelector('button').disabled, "Store button is disabled when claimed!");
console.log("  ✅ [PASS] Store card immediately shows claimed countdown timer.");

// 7. Auto-Launch Suppressed on Subsequent App Boot Today
console.log("\n--- TEST 7: Auto-Launch Suppressed When Already Claimed Today ---");
modal.classList.remove('active');
window.checkDailyReward(false); // auto-launch (e.g. app restart)
assert(!modal.classList.contains('active'), "Modal MUST NOT pop up on auto-launch if already claimed today!");
console.log("  ✅ [PASS] Zero annoying popups for users who already claimed today's reward!");

// 8. 24-Hour Countdown Helper Function Format
console.log("\n--- TEST 8: Remaining Countdown String Format ---");
const timeStr = window.getRemainingTimeToMidnightString();
assert(/^\d{2}:\d{2}:\d{2}$/.test(timeStr), "Timer format must be HH:MM:SS!");
console.log("  ✅ [PASS] Countdown string format verified: " + timeStr);

console.log("\n================================================================================");
console.log("🎯 ALL 8 UNIFIED DAILY REWARD & STORE SYNC TESTS PASSED 100%!");
console.log("================================================================================");

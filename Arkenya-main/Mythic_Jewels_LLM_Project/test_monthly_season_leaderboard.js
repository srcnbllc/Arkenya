const fs = require('fs');
const assert = require('assert');

console.log('=== TEST: MONTHLY SEASON LEADERBOARD & REALISTIC FLOW ===');

const html = fs.readFileSync('www/index.html', 'utf8');

// 1. Verify absence of Firebase/Firestore or connection status keywords
assert(!html.includes('firestore.googleapis.com'), 'No firestore URLs');
assert(!html.includes('Firebase Canlı'), 'No "Firebase Canlı" text');
assert(!html.includes('lb-sync-status'), 'No "lb-sync-status" element in HTML');

// 2. Mock environment to test Monthly Season Rollover and Realistic Rival Progression
global.localStorage = {
    _data: {},
    getItem(k) { return this._data[k] || null; },
    setItem(k, v) { this._data[k] = String(v); },
    removeItem(k) { delete this._data[k]; },
    get length() { return Object.keys(this._data).length; },
    key(i) { return Object.keys(this._data)[i] || null; }
};

let toastCount = 0;
global.showToast = (msg, type) => {
    toastCount++;
    console.log(`[Toast ${type}]: ${msg}`);
};
global.triggerHaptic = () => {};
global.saveGame = () => {};

let elementMap = {};
function createMockEl(id) {
    return {
        id,
        style: {},
        innerHTML: '',
        innerText: '',
        classList: { add() {}, remove() {} }
    };
}

global.document = {
    getElementById(id) {
        if (!elementMap[id]) elementMap[id] = createMockEl(id);
        return elementMap[id];
    }
};

global.gameState = {
    unlockedLevel: 8,
    totalScore: 12500,
    weeklyScore: 12500,
    monthlyScore: 12500,
    gold: 500,
    gems: 20,
    activeSeasonKey: '2026-09', // Previous month
    lastRecordedRank: 2, // Was 2nd in previous month (in Promotion Zone!)
    selectedHero: 'arkenya',
    playerProfile: {
        username: 'OlimposKralı',
        avatarHero: 'arkenya'
    }
};

// Evaluate the monthly season engine block
const jsStartStr = '        // =========================================================================\n        // AAA LUXURY SIMULATED OLYMPUS MONTHLY LEAGUE & MANAGER ENGINE';
const jsEndStr = '        // SPECIAL GEM STATE (Parallel Grid for Candy Crush Mechanics)';

const jsStartIndex = html.indexOf(jsStartStr);
const jsEndIndex = html.indexOf(jsEndStr);
assert(jsStartIndex !== -1 && jsEndIndex !== -1, 'JS bounds found');

const code = html.substring(jsStartIndex, jsEndIndex);
eval(code);

// 3. Test Season Info
const seasonInfo = getCurrentSeasonInfo();
console.log('Current Season:', seasonInfo.title, '| Days Remaining:', seasonInfo.daysLeft, '| Day Progress:', seasonInfo.dayProgress.toFixed(2));
assert(seasonInfo.daysLeft > 0 && seasonInfo.daysLeft <= 31, 'Valid daysLeft in month');

// 4. Test Monthly Season Rollover
// gameState had '2026-09', current is '2026-10' (or current month)
checkAndApplyMonthlySeasonRollover();

// User should have received season rewards (+30 gems, +1000 gold for bronze top 3) and monthly score reset
console.log('After Rollover -> Gems:', gameState.gems, 'Gold:', gameState.gold, 'MonthlyScore:', gameState.monthlyScore);
assert.strictEqual(gameState.monthlyScore, 0, 'Monthly score reset to 0 for new month');
assert.strictEqual(gameState.activeSeasonKey, seasonInfo.key, 'Active season key updated to current month');
assert(gameState.gems >= 50, 'Seasonal gems awarded');
assert(gameState.gold >= 1500, 'Seasonal gold awarded');

// 5. Test loadLeaderboard for 'aylik'
loadLeaderboard('aylik');
const listEl = document.getElementById('leaderboard-list');
const playerCardEl = document.getElementById('lb-player-card');
const timerEl = document.getElementById('lb-timer');
const seasonNameEl = document.getElementById('lb-season-name');

assert(timerEl.innerText.includes('Sezon Sonu:'), 'Timer displays days remaining in month');
assert(seasonNameEl.innerText.includes('Sezonu'), 'Season name displays current month and year');
assert(listEl.innerHTML.includes('OlimposKralı'), 'User appears in monthly leaderboard table');
assert(playerCardEl.innerHTML.includes('OlimposKralı'), 'User card rendered at bottom');

// 6. Test syncScoreToLeaderboard and simulateRivalMatchProgression
const prevTotal = gameState.totalScore;
syncScoreToLeaderboard(prevTotal + 1500);
assert.strictEqual(gameState.totalScore, prevTotal + 1500, 'Score updated');

console.log('\n=============================================================');
console.log('>>> ALL MONTHLY SEASON & REALISTIC FLOW TESTS PASSED! <<<');
console.log('=============================================================');

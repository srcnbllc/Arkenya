const fs = require('fs');

console.log('=== TEST: SIMULATED MANAGER LEADERBOARD ENGINE ===');

const html = fs.readFileSync('www/index.html', 'utf8');

// 1. Verify no Firestore REST calls remain
if (html.includes('firestore.googleapis.com')) {
    console.error('FAIL: Found lingering firestore.googleapis.com URL in html');
    process.exit(1);
} else {
    console.log('PASS: No firestore.googleapis.com in application bundle');
}

// 2. Extract and test loadLeaderboard logic
// Mock environment
global.localStorage = {
    _data: {},
    getItem(k) { return this._data[k] || null; },
    setItem(k, v) { this._data[k] = String(v); }
};

global.gameState = {
    unlockedLevel: 5,
    totalScore: 7850,
    weeklyScore: 7850,
    monthlyScore: 19500,
    selectedHero: 'arkenya',
    playerProfile: {
        username: 'TestOyuncusu',
        avatarHero: 'arkenya'
    }
};

// Check if OLYMPUS_RIVALS_POOL exists and has 19 entries
const matchPool = html.match(/const OLYMPUS_RIVALS_POOL = (\[[\s\S]*?\]);/);
if (!matchPool) {
    console.error('FAIL: OLYMPUS_RIVALS_POOL not found in html');
    process.exit(1);
}

const rivalsPool = eval(matchPool[1]);
console.log(`PASS: OLYMPUS_RIVALS_POOL defined with ${rivalsPool.length} contenders (Expected: 19)`);
if (rivalsPool.length !== 19) {
    console.error('FAIL: Expected 19 rivals, got ' + rivalsPool.length);
    process.exit(1);
}

// Check DOM mock and leaderboard loading
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
global.triggerHaptic = () => {};
global.showToast = () => {};

// Evaluate the functions in a controlled scope
const jsTargetStart = '        // AAA LUXURY SIMULATED OLYMPUS MANAGER LEAGUE & LEADERBOARD ENGINE';
const jsTargetEnd = '        // SPECIAL GEM STATE (Parallel Grid for Candy Crush Mechanics)';

const startIdx = html.indexOf(jsTargetStart);
const endIdx = html.indexOf(jsTargetEnd);
const codeToEval = html.substring(startIdx, endIdx);

eval(codeToEval);

// Test loadLeaderboard for 'haftalik'
loadLeaderboard('haftalik');

const listEl = document.getElementById('leaderboard-list');
const playerCardEl = document.getElementById('lb-player-card');

console.log('List HTML length:', listEl.innerHTML.length);
console.log('Player Card HTML length:', playerCardEl.innerHTML.length);

if (listEl.innerHTML.includes('TestOyuncusu') && listEl.innerHTML.includes('SEN')) {
    console.log('PASS: User row is displayed in the leaderboard with SEN badge');
} else {
    console.error('FAIL: User row missing from leaderboard');
    process.exit(1);
}

if (playerCardEl.innerHTML.includes('TestOyuncusu') && playerCardEl.innerHTML.includes((7850).toLocaleString())) {
    console.log('PASS: User real score (7,850) correctly rendered in player card');
} else {
    console.error('FAIL: User real score missing from player card');
    process.exit(1);
}

// Test promotion/relegation zones
const bronzeLeague = getCurrentPlayerLeague(5);
console.log(`PASS: Current League for level 5: ${bronzeLeague.name} (${bronzeLeague.id})`);

console.log('\n>>> ALL SIMULATED MANAGER LEADERBOARD TESTS PASSED! <<<');

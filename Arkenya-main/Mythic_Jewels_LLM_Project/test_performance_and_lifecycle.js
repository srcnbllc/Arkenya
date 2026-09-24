const fs = require('fs');
const { JSDOM } = require('jsdom');

console.log('=== TEST: PERFORMANCE, LIFECYCLE & CRASH RECOVERY ===');

const html = fs.readFileSync('www/index.html', 'utf8');

let errors = [];
const dom = new JSDOM(html, {
    url: 'http://localhost',
    runScripts: 'dangerously',
    resources: 'usable',
    beforeParse(win) {
        win.onerror = (msg, url, line, col, err) => {
            errors.push({ msg, line, col, err });
        };
        // Mock AudioContext
        class MockGain {
            constructor() {
                this.gain = { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} };
            }
            connect() {}
        }
        class MockOsc {
            constructor() {
                this.frequency = { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} };
            }
            connect() {}
            start() {}
            stop() {}
        }
        win.AudioContext = class MockAudioContext {
            constructor() {
                this.state = 'running';
                this.currentTime = 0;
                this.destination = {};
            }
            createOscillator() { return new MockOsc(); }
            createGain() { return new MockGain(); }
            suspend() { this.state = 'suspended'; return Promise.resolve(); }
            resume() { this.state = 'running'; return Promise.resolve(); }
        };
        win.webkitAudioContext = win.AudioContext;
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

// 1. Script parsing & syntax
assert(errors.length === 0, `Script parsed with 0 errors (errors: ${errors.length})`);

// 2. AudioContext singleton verification
assert(win.eval("typeof getAudioContext === 'function'"), 'getAudioContext function exists');
assert(win.eval("typeof sfxVictory === 'function'"), 'sfxVictory function exists');
assert(win.eval("typeof sfxDefeat === 'function'"), 'sfxDefeat function exists');
win.eval("sfxVictory(); sfxDefeat();");
assert(win.eval("sharedAudioContext !== null"), 'sharedAudioContext created as singleton');

// 3. DOM Pooling test for popups
for (let i = 0; i < 8; i++) {
    win.eval(`spawnFloatingCombo('Combo x${i}'); spawnFloatingScore('+${i * 100}');`);
}
const comboPopups = doc.querySelectorAll('.floating-combo-popup');
const scorePopups = doc.querySelectorAll('.floating-score-popup');
assert(comboPopups.length <= 3, `DOM Pooling: Max 3 combo popups (found: ${comboPopups.length})`);
assert(scorePopups.length <= 3, `DOM Pooling: Max 3 score popups (found: ${scorePopups.length})`);

// 4. Active Match Persistence & Recovery
assert(win.eval("typeof saveActiveMatchSession === 'function'"), 'saveActiveMatchSession exists');
assert(win.eval("typeof resumeActiveMatchSession === 'function'"), 'resumeActiveMatchSession exists');
assert(win.eval("typeof clearActiveMatchSession === 'function'"), 'clearActiveMatchSession exists');

// Setup mock gameplay state
win.eval(`
    currentActiveScreen = 'screen-gameplay';
    isLevelEnding = false;
    gameState.currentPlayingLevel = 4;
    gameScore = 5200;
    gameMoves = 19;
    gameTarget = 7500;
    gameGauge = 60;
    gridData = Array(8).fill(null).map(() => Array(8).fill('ruby'));
    specialGrid = Array(8).fill(null).map(() => Array(8).fill(null));
    specialGrid[2][3] = 'line_h';
    saveActiveMatchSession();
`);

const savedRaw = win.localStorage.getItem('arkenya_active_match');
assert(!!savedRaw, 'Active match session successfully saved to localStorage');
const parsedSession = JSON.parse(savedRaw);
assert(parsedSession.level === 4 && parsedSession.score === 5200 && parsedSession.moves === 19, 'Session data correctly stores level, score, moves');

// Simulate recovery prompt
const modalResume = doc.getElementById('modal-resume-match');
assert(!!modalResume, 'modal-resume-match DOM element exists');
const hadPrompt = win.eval("checkAndPromptActiveMatchRecovery()");
assert(hadPrompt === true, 'checkAndPromptActiveMatchRecovery detects active session');
assert(modalResume.classList.contains('active'), 'modal-resume-match becomes active');

// Simulate state reset and recovery execution
win.eval(`
    gameScore = 0;
    gameMoves = 0;
    resumeActiveMatchSession();
`);
assert(win.eval("gameScore === 5200"), 'resumeActiveMatchSession restored gameScore (5200)');
assert(win.eval("gameMoves === 19"), 'resumeActiveMatchSession restored gameMoves (19)');
assert(win.eval("gameState.currentPlayingLevel === 4"), 'resumeActiveMatchSession restored currentPlayingLevel (4)');
assert(win.eval("gridData[0][0] === 'ruby'"), 'resumeActiveMatchSession restored gridData');
assert(!modalResume.classList.contains('active'), 'modal-resume-match dismissed after recovery');

// Test clear active match
win.eval("clearActiveMatchSession()");
assert(win.localStorage.getItem('arkenya_active_match') === null, 'clearActiveMatchSession removes storage key');

// 5. Ad Guard State Machine
assert(typeof win.AdGuard === 'object', 'window.AdGuard exists');
assert(typeof win.AdGuard.prepareForAd === 'function', 'AdGuard.prepareForAd exists');
assert(typeof win.AdGuard.onAdClosed === 'function', 'AdGuard.onAdClosed exists');

win.AdGuard.prepareForAd('rewarded');
assert(win.AdGuard.isAdActive === true, 'AdGuard flags ad as active');
assert(win.eval("isSwapping === true"), 'AdGuard locks board input to prevent accidental taps');

let rewardedCallbackFired = false;
win.AdGuard.onAdClosed(true, () => {
    rewardedCallbackFired = true;
});
assert(win.AdGuard.isAdActive === false, 'AdGuard unflags ad');
assert(win.eval("isSwapping === false"), 'AdGuard unlocks board input');
assert(rewardedCallbackFired === true, 'AdGuard reward callback executed');

// 6. Lifecycle & Auto-Pause
assert(win.eval("typeof pauseGameForBackground === 'function'"), 'pauseGameForBackground exists');
win.eval(`
    currentActiveScreen = 'screen-gameplay';
    isLevelEnding = false;
    pauseGameForBackground();
`);
assert(win.eval("isGamePaused === true"), 'pauseGameForBackground flags game as paused');
assert(doc.getElementById('modal-pause').classList.contains('active'), 'modal-pause is opened on backgrounding');

// 7. Rewarded ad buttons in modals
assert(!!doc.getElementById('btn-save-me-ad'), 'btn-save-me-ad button exists in modal-save-me');
assert(doc.getElementById('modal-out-of-lives').innerHTML.includes('watchAdForFreeLife'), 'watchAdForFreeLife button exists in modal-out-of-lives');

console.log(`\n=== RESULTS: ${passed} / ${total} TESTS PASSED ===`);
if (passed === total) {
    process.exit(0);
} else {
    process.exit(1);
}

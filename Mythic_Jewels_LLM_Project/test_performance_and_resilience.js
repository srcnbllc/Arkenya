const fs = require('fs');
const { JSDOM } = require('jsdom');

console.log("=== Testing Performance, Stability, Ad Handling & Gesture Resilience ===");

const html = fs.readFileSync('www/index.html', 'utf8');

const dom = new JSDOM(html, {
    url: 'http://localhost',
    runScripts: 'dangerously',
    resources: 'usable'
});

const { window } = dom;
const { document } = window;
const run = (code) => window.eval(code);

function assert(cond, msg) {
    if (!cond) {
        console.error(`  [FAIL] ${msg}`);
        process.exit(1);
    }
    console.log(`  [PASS] ${msg}`);
}

// 1. Check Pause State and Pause / Resume Flow
assert(run("typeof pauseGameForBackground === 'function'"), 'pauseGameForBackground is defined');
assert(run("typeof resumeGameFromBackground === 'function'"), 'resumeGameFromBackground is defined');
run("currentActiveScreen = 'screen-gameplay'; isLevelEnding = false;");
run("pauseGameForBackground();");
assert(run("isGamePaused === true"), 'isGamePaused is true when backgrounded');
const modalPause = document.getElementById('modal-pause');
assert(modalPause && modalPause.classList.contains('active'), 'Pause modal is active when paused');
run("resumeGameFromBackground(); closeModal('modal-pause');");
assert(modalPause && !modalPause.classList.contains('active'), 'Pause modal closes on resume');

// 2. Check AdGuard State Machine & Rewarded Ad Protection
assert(run("typeof window.AdGuard === 'object'"), 'window.AdGuard is defined');
assert(run("typeof window.AdGuard.prepareForAd === 'function'"), 'window.AdGuard.prepareForAd is defined');
assert(run("typeof window.AdGuard.onAdClosed === 'function'"), 'window.AdGuard.onAdClosed is defined');

run("window.AdGuard.prepareForAd('rewarded');");
assert(run("window.AdGuard.isAdActive === true"), 'AdGuard.isAdActive is true during ad');
assert(run("isSwapping === true"), 'Board interactions locked during ad display');

let rewardClaimed = false;
run("window.AdGuard.onAdClosed(true, () => { rewardClaimed = true; });");
assert(run("window.AdGuard.isAdActive === false"), 'AdGuard.isAdActive is false after ad ends');
assert(run("isSwapping === false"), 'Board interaction unlocked after ad');

// 3. Check Session Restoration / State Persistence (Resume from crash or app close)
assert(run("typeof saveActiveMatchSession === 'function'"), 'saveActiveMatchSession is defined');
assert(run("typeof resumeActiveMatchSession === 'function'"), 'resumeActiveMatchSession is defined');
assert(run("typeof clearActiveMatchSession === 'function'"), 'clearActiveMatchSession is defined');

// Setup mock session
run(`
    gameState.currentPlayingLevel = 3;
    gameScore = 1500;
    gameMoves = 14;
    gameTarget = 5000;
    gameGauge = 45;
    gridData = Array(8).fill(null).map(() => Array(8).fill('ruby'));
    specialGrid = Array(8).fill(null).map(() => Array(8).fill(null));
    currentActiveScreen = 'screen-gameplay';
    isLevelEnding = false;
    saveActiveMatchSession();
`);

const rawSession = window.localStorage.getItem('arkenya_active_match');
assert(rawSession !== null, 'Active match session saved to localStorage');
const parsed = JSON.parse(rawSession);
assert(parsed.level === 3, 'Saved match level matches');
assert(parsed.score === 1500, 'Saved match score matches');
assert(parsed.moves === 14, 'Saved match moves matches');

// Reset in-memory values and restore
run(`
    gameScore = 0;
    gameMoves = 0;
    resumeActiveMatchSession();
`);

assert(run("gameScore === 1500"), 'Restored session preserved gameScore');
assert(run("gameMoves === 14"), 'Restored session preserved gameMoves');

run("clearActiveMatchSession();");
assert(window.localStorage.getItem('arkenya_active_match') === null, 'Session cleared cleanly');

// 4. Check addXP loop guard & progression
const initLvl = run("gameState.playerLevel || 1");
run("addXP(1000);");
assert(run("gameState.playerLevel") > initLvl, 'addXP increased level without infinite loop');

// 5. Check CSS will-change, contain, and touch-action: manipulation
const cssText = document.querySelector('style').textContent;
assert(cssText.includes('will-change: transform'), 'CSS includes will-change: transform for smooth gem animations');
assert(cssText.includes('contain: layout style'), 'CSS includes layout containment');
assert(cssText.includes('touch-action: manipulation'), 'CSS includes touch-action: manipulation for fast touch response');

console.log("=== All Performance, Resilience & Ad Tests PASSED! ===");
process.exit(0);

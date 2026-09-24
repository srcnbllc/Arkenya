const fs = require('fs');
const { JSDOM } = require('jsdom');

console.log('=== TEST: USER ENHANCEMENTS & BUG FIXES ===');

const html = fs.readFileSync('www/index.html', 'utf8');

let errors = [];
const dom = new JSDOM(html, {
    url: 'http://localhost',
    runScripts: 'dangerously',
    beforeParse(win) {
        win.onerror = (msg, url, line, col, err) => {
            errors.push({ msg, line, col, err });
        };
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

// TEST 1: Copyright / Prohibited Names Scrubbing
const copyrightMatches = html.match(/tuncel|kurtiz/gi) || [];
assert(copyrightMatches.length === 0, `Zero copyright mentions of prohibited name (found: ${copyrightMatches.length})`);
assert(html.includes('Kadim Bilge'), "Kadim Bilge title is used in place of prohibited name");

// TEST 2: Main Menu Cleanliness & Reset Relocation
const mainMenuEl = doc.getElementById('screen-mainmenu');
assert(!mainMenuEl.innerHTML.includes('resetProgressToFresh'), "Main menu no longer contains 'Oyunu Sıfırla' link");
const modalConfirmReset = doc.getElementById('modal-confirm-reset');
assert(!!modalConfirmReset, "modal-confirm-reset DOM element exists");
const settingsModal = doc.getElementById('modal-settings');
assert(settingsModal && settingsModal.innerHTML.includes('modal-confirm-reset'), "Settings modal contains button to open modal-confirm-reset");

// Test executeFullGameReset
win.eval(`
    gameState.unlockedLevel = 15;
    gameState.totalScore = 45000;
    saveGame();
    saveActiveMatchSession();
`);
assert(win.eval("gameState.unlockedLevel === 15"), "State setup: unlockedLevel is 15");
win.eval("executeFullGameReset()");
assert(win.eval("gameState.unlockedLevel === 1"), "executeFullGameReset reset unlockedLevel to 1");
assert(win.eval("gameState.totalScore === 0"), "executeFullGameReset reset totalScore to 0");
assert(win.localStorage.getItem('arkenya_active_match') === null, "Active match session removed on reset");

// TEST 3: Global Bottom Navigation Permanence & Visibility
const nav = doc.getElementById('global-bottom-nav');
assert(!!nav, "global-bottom-nav exists");

win.showScreen('screen-mainmenu');
assert(nav.style.display === 'none', "Bottom nav cleanly hidden on screen-mainmenu (clean mainmenu isolation)");

win.showScreen('screen-worldmap');
assert(nav.style.display === 'flex', "Bottom nav visible on screen-worldmap");

win.showScreen('screen-hero');
assert(nav.style.display === 'flex', "Bottom nav visible on screen-hero");

win.showScreen('screen-store');
assert(nav.style.display === 'flex', "Bottom nav visible on screen-store");

win.showScreen('screen-gameplay');
assert(nav.style.display === 'none', "Bottom nav hidden on screen-gameplay");

win.showScreen('screen-mainmenu');
assert(nav.style.display === 'none', "Bottom nav cleanly hidden when returning to mainmenu");

// TEST 4: Level 1 Balance & 1-5 Onboarding Flow
const lvl1 = win.eval("LEVEL_DATA[1]");
assert(lvl1.targetScore === 4000, `Level 1 targetScore balanced to 4000 (was 2500) (found: ${lvl1.targetScore})`);

// Level 1 Gameplay start: check ability lock
win.eval(`
    gameState.currentPlayingLevel = 1;
    startGameplayCore();
`);
const btnAbility = doc.getElementById('btn-use-ability');
assert(btnAbility && btnAbility.disabled === true, "Level 1: Hero Ability button is disabled/locked");
assert(btnAbility && btnAbility.innerText.includes('4. BÖLÜMDE'), "Level 1: Hero Ability button indicates unlock at Level 4");

// Level 4 Gameplay start: check ability unlocks
win.eval(`
    gameState.currentPlayingLevel = 4;
    startGameplayCore();
`);
assert(btnAbility && btnAbility.innerText === 'YETENEK KULLAN', "Level 4: Hero Ability button unlocks with 'YETENEK KULLAN'");

// Level 5 Tutorial check
win.eval(`
    gameState.currentPlayingLevel = 5;
    setupLevelTutorial(5);
`);
const banner = doc.getElementById('onboarding-tip-banner');
assert(banner && banner.innerHTML.includes('GÜÇLENDİRİCİLER'), "Level 5: Booster and milestone onboarding banner displayed");

console.log(`\n=== TEST RESULTS: ${passed} / ${total} ASSERTIONS PASSED ===`);
if (passed === total) {
    console.log(">>> ALL ENHANCEMENT TESTS PASSED! <<<");
    process.exit(0);
} else {
    process.exit(1);
}

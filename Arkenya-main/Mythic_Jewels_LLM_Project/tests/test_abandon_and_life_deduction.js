const fs = require('fs');
const { JSDOM } = require('jsdom');

console.log('=== TEST SUITE: ABANDON MATCH & LIFE DEDUCTION CONFIRMATION ===');

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

// 1. Check DOM presence of modal-confirm-abandon
const confirmModal = doc.getElementById('modal-confirm-abandon');
assert(confirmModal !== null, 'modal-confirm-abandon element exists');
const titleEl = doc.getElementById('confirm-abandon-title');
const descEl = doc.getElementById('confirm-abandon-desc');
const heartsPreviewEl = doc.getElementById('confirm-abandon-hearts-preview');
const yesBtn = doc.getElementById('btn-confirm-abandon-yes');
assert(titleEl && descEl && heartsPreviewEl && yesBtn, 'All subcomponents of modal-confirm-abandon exist');

// 2. Test promptAbandonMatch for 'quit'
win.gameState.energy = 4;
win.promptAbandonMatch('quit');
assert(confirmModal.classList.contains('active'), 'modal-confirm-abandon opened for quit');
assert(titleEl.innerText.includes('MÜCADELEDEN AYRIL'), 'Title reflects quit action');
assert(descEl.innerHTML.includes('-1 ❤️'), 'Description warns about -1 life deduction');
assert(heartsPreviewEl.innerHTML.includes('4 ❤️') && heartsPreviewEl.innerHTML.includes('3 ❤️'), 'Hearts preview reflects 4 -> 3 deduction');

// Test cancel (Hayır)
win.closeModal('modal-confirm-abandon');
assert(!confirmModal.classList.contains('active'), 'Confirmation modal closed on cancel');
assert(win.gameState.energy === 4, 'Energy remains untouched when user cancels');

// 3. Test promptAbandonMatch for 'restart'
win.promptAbandonMatch('restart');
assert(confirmModal.classList.contains('active'), 'modal-confirm-abandon opened for restart');
assert(titleEl.innerText.includes('YENİDEN BAŞLAT'), 'Title reflects restart action');
assert(yesBtn.innerText.includes('YENİDEN BAŞLAT'), 'Yes button reflects restart action');

// 4. Test executeConfirmedAbandon for 'quit'
win.promptAbandonMatch('quit');
win.executeConfirmedAbandon();
assert(!confirmModal.classList.contains('active'), 'Confirmation modal closed after execution');
assert(win.gameState.energy === 3, 'Energy deducted from 4 to 3 on confirmed quit (Expected 3, got ' + win.gameState.energy + ')');
assert(win.currentActiveScreen === 'screen-mainmenu', 'User returned to main menu on quit');

// 5. Test executeConfirmedAbandon when energy drops to 0
win.gameState.energy = 1;
win.promptAbandonMatch('quit');
win.executeConfirmedAbandon();
assert(win.gameState.energy === 0, 'Energy deducted from 1 to 0');

// 6. Test discardActiveMatchSession deducts life
win.gameState.energy = 5;
win.discardActiveMatchSession();
assert(win.gameState.energy === 4, 'discardActiveMatchSession deducted 1 energy from 5 to 4');

// 7. Test that startGameplayCore blocks when energy is 0
win.gameState.energy = 0;
win.startGameplayCore();
assert(win.gameState.energy === 0, 'startGameplayCore does NOT give free 5 energy when energy is 0');
const outOfLivesModal = doc.getElementById('modal-out-of-lives');
assert(outOfLivesModal.classList.contains('active'), 'modal-out-of-lives shown when attempting to start with 0 energy');

// 8. Test Single Heart Display During Active Gameplay (User Issue in Screenshot)
win.gameState.energy = 1;
win.gameState.currentPlayingLevel = 1;
win.startGameplayCore();
assert(win.gameState.energy === 1, 'Playing with last life preserves energy = 1 during the match (not prematurely 0)');
win.renderAllHeartsAndTimers();
const heartsRow = doc.getElementById('gameplay-hearts-row');
const activeHearts = heartsRow ? heartsRow.querySelectorAll('.heart-icon.active').length : 0;
const fadedHearts = heartsRow ? heartsRow.querySelectorAll('.heart-icon.faded').length : 0;
assert(activeHearts === 1, 'Exactly 1 active heart rendered during last-life match (got ' + activeHearts + ')');
assert(fadedHearts === 4, 'Exactly 4 faded hearts rendered during last-life match');
const badge = doc.getElementById('gameplay-hearts-badge');
assert(!badge.classList.contains('empty-warning'), 'Badge does NOT flash empty-warning while actively playing last life');

// 9. Test Defeat Zeroes the Last Life
win.declineSaveMe();
assert(win.gameState.energy === 0, 'Losing the match zeroes out the last life (energy = 0)');
const defeatModal = doc.getElementById('modal-defeat');
assert(defeatModal.classList.contains('active'), 'modal-defeat is shown upon defeat');

// 10. Test Restart from Defeat Modal When Energy is 0 Blocks Without Granting Free 5 Lives
win.restartCurrentLevel();
assert(win.gameState.energy === 0, 'restartCurrentLevel with 0 energy does NOT reset energy to 5');

// 11. Test Restart on Last Life in Abandon Confirmation Modal
win.gameState.energy = 1;
win.promptAbandonMatch('restart');
assert(heartsPreviewEl.innerHTML.includes('1 ❤️') && heartsPreviewEl.innerHTML.includes('0 ❤️'), 'Restart preview shows 1 ❤️ -> 0 ❤️');
assert(descEl.innerHTML.includes('canın sıfırlanacak'), 'Restart description warns that energy will become 0 on last life');
win.executeConfirmedAbandon();
assert(win.gameState.energy === 0, 'Restarting on last life consumed the life to 0');
assert(win.currentActiveScreen === 'screen-mainmenu', 'Routed to main menu because no lives remain');

// 12. Test Victory Preserves Life Integrity
win.gameState.energy = 1;
win.showVictory();
assert(win.gameState.energy === 1, 'showVictory preserves energy at 1');
win.playNextLevelDirectly();
assert(win.gameState.energy === 1, 'playNextLevelDirectly does NOT reset energy to 5');

console.log('\n>>> ALL 12 ABANDON MATCH & LIFE DEDUCTION TESTS PASSED! <<<');
process.exit(0);


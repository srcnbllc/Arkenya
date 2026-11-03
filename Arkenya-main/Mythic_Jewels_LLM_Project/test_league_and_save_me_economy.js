const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { JSDOM } = require('jsdom');

console.log('🧪 [TEST SUITE] Starting League Economy & 10-Gem Save Me Validation...');

const htmlPath = path.resolve(__dirname, 'index.html');
const htmlSource = fs.readFileSync(htmlPath, 'utf8');

// Build virtual DOM with proper mocks before parsing scripts
const dom = new JSDOM(htmlSource, {
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
        win.HTMLMediaElement.prototype.play = () => Promise.resolve();
        win.HTMLMediaElement.prototype.pause = () => {};
        win.HTMLMediaElement.prototype.load = () => {};
        win.navigator.vibrate = () => true;
        win.localStorage = {
            _data: {},
            getItem(k) { return this._data[k] || null; },
            setItem(k, v) { this._data[k] = String(v); },
            removeItem(k) { delete this._data[k]; },
            clear() { this._data = {}; }
        };
    }
});

const { window } = dom;

let passedCount = 0;

function assertTest(name, fn) {
    try {
        fn();
        console.log(`  ✅ [PASS] ${name}`);
        passedCount++;
    } catch (err) {
        console.error(`  ❌ [FAIL] ${name}`);
        console.error(err);
        process.exit(1);
    }
}

// Ensure gameState initialized
window.gameState = window.gameState || {};

// 1. Check Save Me modal HTML definition
assertTest('Save Me modal button HTML is configured for 10 Gems', () => {
    const btn = window.document.getElementById('btn-save-me-gems');
    assert(btn, 'Save Me gems button must exist');
    assert(btn.textContent.includes('10 ELMAS'), `Expected '10 ELMAS' in button text, got: ${btn.textContent}`);
});

// 2. Check prepareSaveMeModal with insufficient gems (< 10)
assertTest('prepareSaveMeModal disables button when gems < 10', () => {
    window.gameState.gems = 9;
    window.prepareSaveMeModal(false);
    const btn = window.document.getElementById('btn-save-me-gems');
    assert.strictEqual(btn.disabled, true, 'Button should be disabled when gems < 10');
    assert(btn.innerHTML.includes('(Yetersiz)'), 'Button text should indicate (Yetersiz)');
    assert(btn.innerHTML.includes('10 ELMAS'), 'Button should state 10 ELMAS');
});

// 3. Check prepareSaveMeModal with sufficient gems (>= 10)
assertTest('prepareSaveMeModal enables button when gems >= 10', () => {
    window.gameState.gems = 10;
    window.prepareSaveMeModal(false);
    const btn = window.document.getElementById('btn-save-me-gems');
    assert.strictEqual(btn.disabled, false, 'Button should be enabled when gems >= 10');
    assert(!btn.innerHTML.includes('(Yetersiz)'), 'Button text should not have (Yetersiz)');
    assert(btn.innerHTML.includes('10 ELMAS İLE DEVAM ET'), 'Button text should offer 10 ELMAS İLE DEVAM ET');
});

// 4. Check buyExtraMovesWithGems deduction & clutch recovery
assertTest('buyExtraMovesWithGems deducts exactly 10 gems and updates moves display by +5', () => {
    window.gameState.gems = 15;
    const movesEl = window.document.getElementById('game-moves');
    const initialMoves = parseInt(movesEl.innerText || '25', 10);
    window.buyExtraMovesWithGems();
    assert.strictEqual(window.gameState.gems, 5, `Expected 5 gems remaining (15 - 10), got ${window.gameState.gems}`);
    const newMoves = parseInt(movesEl.innerText, 10);
    assert.strictEqual(newMoves, initialMoves + 5, `Expected game-moves display to increase by 5 (${initialMoves} -> ${initialMoves + 5}), got ${newMoves}`);
    const modal = window.document.getElementById('modal-save-me');
    assert(!modal.classList.contains('active'), 'Save Me modal should be closed');
});

// 5. Check buyExtraMovesWithGems rejection when gems < 10
assertTest('buyExtraMovesWithGems rejects purchase when gems < 10 without deduction', () => {
    window.gameState.gems = 8;
    const movesEl = window.document.getElementById('game-moves');
    const beforeMoves = parseInt(movesEl.innerText, 10);
    window.buyExtraMovesWithGems();
    assert.strictEqual(window.gameState.gems, 8, 'Gems should not be deducted');
    const afterMoves = parseInt(movesEl.innerText, 10);
    assert.strictEqual(afterMoves, beforeMoves, 'Moves should not increase when rejected');
});

// 6. Check updateMainMenuUI dynamic season countdown timer
assertTest('updateMainMenuUI updates #mainmenu-league-timer with dynamic season countdown', () => {
    window.updateMainMenuUI();
    const timerEl = window.document.getElementById('mainmenu-league-timer');
    assert(timerEl, '#mainmenu-league-timer element must exist');
    assert(timerEl.textContent.includes('gün kaldı'), `Expected 'gün kaldı' in timer text, got: ${timerEl.textContent}`);
});

// 7. Check loadLeaderboard tab rewards: Aylık (100%), Haftalık (40%), Genel (Şeref Rozeti)
assertTest('loadLeaderboard displays dynamic rewards based on active tab', () => {
    const playerLvl = window.gameState.unlockedLevel || 1;
    const currentLeague = window.getCurrentPlayerLeague(playerLvl);
    const rewardValEl = window.document.getElementById('lb-season-reward-val');
    const seasonNameEl = window.document.getElementById('lb-season-name');

    // Tab: Aylık
    window.loadLeaderboard('aylik');
    assert(rewardValEl.innerHTML.includes(`${currentLeague.rewardGems} 💎`), 'Aylık tab must show full gems');
    assert(rewardValEl.innerHTML.includes(`${currentLeague.rewardGold.toLocaleString()} 💰`), 'Aylık tab must show full gold');

    // Tab: Haftalık
    window.loadLeaderboard('haftalik');
    const weeklyGems = Math.round(currentLeague.rewardGems * 0.4);
    const weeklyGold = Math.round(currentLeague.rewardGold * 0.4);
    assert(rewardValEl.innerHTML.includes(`+${weeklyGems} 💎`), `Haftalık tab must show 40% gems (+${weeklyGems})`);
    assert(rewardValEl.innerHTML.includes(`${weeklyGold.toLocaleString()} 💰`), `Haftalık tab must show 40% gold`);
    assert(seasonNameEl.innerText.includes('Haftalık Turnuva'), 'Haftalık title must mention Haftalık Turnuva');

    // Tab: Genel
    window.loadLeaderboard('genel');
    assert(rewardValEl.innerHTML.includes('Olimpos Şeref Rozeti'), 'Genel tab must show Olimpos Şeref Rozeti');
    assert(seasonNameEl.innerText.includes('Tüm Zamanlar Olimpos Efsaneleri'), 'Genel title must show Tüm Zamanlar');
});

console.log(`\n🎉 [ALL TESTS PASSED] Successfully executed ${passedCount}/${passedCount} tests without errors.`);
process.exit(0);

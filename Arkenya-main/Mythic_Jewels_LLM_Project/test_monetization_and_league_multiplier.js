const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { JSDOM } = require('jsdom');

console.log('🧪 [TEST SUITE] Validating Pre-Release Monetization & Weekly League Multiplier...');

const htmlPath = path.resolve(__dirname, 'www/index.html');
const htmlSource = fs.readFileSync(htmlPath, 'utf8');

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

let passed = 0;
function test(name, fn) {
    try {
        fn();
        console.log(`  ✅ [PASS] ${name}`);
        passed++;
    } catch(e) {
        console.error(`  ❌ [FAIL] ${name}`);
        console.error(e);
        process.exit(1);
    }
}

// 1. AdMob Safe Configuration
test('AdMob init includes safe testing devices configuration', () => {
    assert(htmlSource.includes("testingDevices: ['EMULATOR']"), "Expected testingDevices: ['EMULATOR'] in AdMob initialization");
    assert(window.AdGuard.adUnitIds.rewarded.android.startsWith('ca-app-pub-5447184164278795/'), "Live Rewarded unit ID verified");
    assert(window.AdGuard.adUnitIds.interstitial.android.startsWith('ca-app-pub-3940256099942544/'), "Official Google test interstitial ID safely verified");
});

// 2. Victory Modal League Multiplier Row UI elements
test('Victory Modal contains #victory-league-bonus-row with value placeholders', () => {
    const row = window.document.getElementById('victory-league-bonus-row');
    assert(row, '#victory-league-bonus-row element must exist');
    const bonusVal = window.document.getElementById('victory-league-bonus-val');
    assert(bonusVal, '#victory-league-bonus-val element must exist');
    const movesVal = window.document.getElementById('victory-league-moves-val');
    assert(movesVal, '#victory-league-moves-val element must exist');
});

// 3. showVictory calculation with leftover moves multiplier
test('showVictory adds (movesLeftAtWin * 150) to weeklyScore and displays breakdown', () => {
    window.gameState = window.gameState || {};
    window.gameState.weeklyScore = 1000;
    window.gameState.totalScore = 5000;
    window.gameState.gold = 100;
    window.gameState.gems = 10;
    window.gameScore = 2500;
    window.gameTarget = 2000;
    window.currentLevel = 5;
    window.movesLeftAtWin = 7; // 7 leftover moves -> 7 * 150 = 1050 bonus

    window.showVictory();

    // Expected weeklyScore: 1000 + 2500 + 1050 = 4550
    assert.strictEqual(window.gameState.weeklyScore, 4550, `Expected weeklyScore to be 4550, got ${window.gameState.weeklyScore}`);

    const bonusVal = window.document.getElementById('victory-league-bonus-val');
    assert.strictEqual(bonusVal.innerText, (1050).toLocaleString(), `Expected bonus display ${(1050).toLocaleString()}, got '${bonusVal.innerText}'`);

    const movesVal = window.document.getElementById('victory-league-moves-val');
    assert.strictEqual(String(movesVal.innerText), '7', `Expected moves display '7', got '${movesVal.innerText}'`);
});

// 4. Leaderboard Modal Prize Pool Display & Google Play Policy Footnote
test('Leaderboard Modal features compliant 3-tier tournament prize pool & policy footnote', () => {
    const box = window.document.getElementById('lb-season-reward-box');
    assert(box, '#lb-season-reward-box must exist');
    const boxContent = box.innerHTML;

    assert(boxContent.includes('HAFTALIK TURNUVA ÖDÜL HAVUZU'), 'Header mentions HAFTALIK TURNUVA ÖDÜL HAVUZU');
    assert(boxContent.includes('250 TL Play Kodu'), '1st tier offers 250 TL Play Kodu');
    assert(boxContent.includes('100 TL Play Kodu'), '2nd-5th tier offers 100 TL Play Kodu');
    assert(boxContent.includes('50 💎 Elmas'), '6th-20th tier offers 50 💎 Elmas');
    assert(boxContent.includes('Google Play Hediye Kodu ve oyun içi varlık'), 'Policy disclaimer explains digital gift cards');
    assert(boxContent.includes('Gerçek para nakit çekimi (cash-out) veya kumar unsuru içermez'), 'Policy disclaimer explicitly rules out cash-out and gambling');
});

console.log(`\n🎉 [ALL MONETIZATION & LEAGUE MULTIPLIER TESTS PASSED] (${passed}/${passed})`);
process.exit(0);

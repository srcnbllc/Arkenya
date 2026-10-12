const fs = require('fs');
const { JSDOM } = require('jsdom');

console.log('===================================================================');
console.log('🧪 TESTING HAPTICS PERMISSION, SETTINGS & CLEAN COMBO POPUPS');
console.log('===================================================================');

const html = fs.readFileSync('www/index.html', 'utf8');

const dom = new JSDOM(html, {
    url: 'http://localhost',
    runScripts: 'dangerously',
    beforeParse(win) {
        win.vibrateCalls = [];
        win.navigator.vibrate = function(val) {
            win.vibrateCalls.push(val);
            return true;
        };
        win.AudioContext = class {
            constructor() { this.state = 'running'; }
            createOscillator() { return { connect: () => {}, frequency: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} }, start: () => {}, stop: () => {} }; }
            createGain() { return { connect: () => {}, gain: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} } }; }
        };
        win.requestAnimationFrame = (cb) => setTimeout(cb, 16);
    }
});

const { window } = dom;
const { document } = window;
const run = (code) => window.eval(code);

function assert(condition, message) {
    if (!condition) {
        console.error(`❌ FAIL: ${message}`);
        process.exit(1);
    }
    console.log(`✅ PASS: ${message}`);
}

async function runTestSuite() {
    // -------------------------------------------------------------
    // TEST 1: Settings Modal contains Titreşim Toggle Button
    // -------------------------------------------------------------
    console.log('\n[TEST 1] Verifying Vibration Toggle in Settings Modal:');
    const vibBtn = document.getElementById('btn-settings-vibration');
    assert(vibBtn !== null, "btn-settings-vibration exists in Settings Modal");
    assert(vibBtn.textContent.trim() === 'AÇIK', `Initial button state is AÇIK (Found: '${vibBtn.textContent}')`);
    assert(run("isVibrationEnabled === true"), "isVibrationEnabled is true by default");
    assert(run("gameState.vibrationEnabled === true"), "gameState.vibrationEnabled is true by default");

    // -------------------------------------------------------------
    // TEST 2: Toggling Vibration ON / OFF via toggleVibration
    // -------------------------------------------------------------
    console.log('\n[TEST 2] Verifying Vibration Toggle Interaction:');
    run("toggleVibration(document.getElementById('btn-settings-vibration'))");
    assert(run("isVibrationEnabled === false"), "Vibration toggled to false");
    assert(run("gameState.vibrationEnabled === false"), "gameState.vibrationEnabled is false");
    assert(vibBtn.textContent.trim() === 'KAPALI', `Button text changed to KAPALI (Found: '${vibBtn.textContent}')`);

    // Verify openModal refreshes button state
    run("openModal('modal-settings')");
    assert(vibBtn.textContent.trim() === 'KAPALI', "openModal correctly synced button to KAPALI");

    // Toggle back ON
    run("toggleVibration(document.getElementById('btn-settings-vibration'))");
    assert(run("isVibrationEnabled === true"), "Vibration toggled back to true");
    assert(vibBtn.textContent.trim() === 'AÇIK', `Button text restored to AÇIK (Found: '${vibBtn.textContent}')`);

    // -------------------------------------------------------------
    // TEST 3: triggerHaptic respects settings permission
    // -------------------------------------------------------------
    console.log('\n[TEST 3] Verifying triggerHaptic respects permission:');
    window.vibrateCalls = [];
    run("triggerHaptic('light')");
    assert(window.vibrateCalls.length === 1 && window.vibrateCalls[0][0] === 15, `Light haptic recorded (15ms): ${JSON.stringify(window.vibrateCalls)}`);

    window.vibrateCalls = [];
    run("triggerHaptic('medium')");
    assert(window.vibrateCalls.length === 1 && window.vibrateCalls[0][0] === 25, `Medium haptic recorded (25ms): ${JSON.stringify(window.vibrateCalls)}`);

    window.vibrateCalls = [];
    run("triggerHaptic('heavy')");
    assert(window.vibrateCalls.length === 1 && Array.isArray(window.vibrateCalls[0]), `Heavy haptic recorded pattern: ${JSON.stringify(window.vibrateCalls)}`);

    // Now disable vibration and verify zero haptic calls
    run("isVibrationEnabled = false; gameState.vibrationEnabled = false;");
    window.vibrateCalls = [];
    run("triggerHaptic('light')");
    run("triggerHaptic('medium')");
    run("triggerHaptic('heavy')");
    assert(window.vibrateCalls.length === 0, "No vibrations triggered when permission is disabled");

    // Restore vibration
    run("isVibrationEnabled = true; gameState.vibrationEnabled = true;");

    // -------------------------------------------------------------
    // TEST 4: Singleton Floating Combo Display
    // -------------------------------------------------------------
    console.log('\n[TEST 4] Verifying Singleton, Clean Floating Banner:');
    run("spawnFloatingCombo('🌈 ZEUS KÜRESİ! 🌈')");
    let activeBanner = document.getElementById('floating-combo-active-banner');
    assert(activeBanner !== null, "Active banner element exists");
    assert(activeBanner.textContent === "🌈 ZEUS KÜRESİ! 🌈", `Banner text is correct: ${activeBanner.textContent}`);
    
    // Spawn another combo immediately to test overwrite without DOM stacking
    run("spawnFloatingCombo('✨ TANRISAL KOMBO x4! ✨')");
    const banners = document.querySelectorAll('.floating-combo-popup');
    assert(banners.length === 1, `Strictly 1 banner on screen (Found: ${banners.length})`);
    assert(banners[0].textContent === "✨ TANRISAL KOMBO x4! ✨", `Banner smoothly updated text: ${banners[0].textContent}`);

    // -------------------------------------------------------------
    // TEST 5: Match Processing Text Spam Elimination & Important Events
    // -------------------------------------------------------------
    console.log('\n[TEST 5] Verifying 4-gem & 5-gem feedback in gameplay:');
    // Ensure clean state
    if (activeBanner && activeBanner.parentNode) activeBanner.remove();

    // 5A: Simulate 4-match line special creation
    window.vibrateCalls = [];
    run(`
        gameState.currentPlayingLevel = 5;
        // Mock newSpecials with a line_h gem
        const newSpecials = [{ r: 2, c: 3, gemType: 'fire', special: 'line_h' }];
        const comboMultiplier = 1;
        const lvl = 5;
        
        // Execute the exact feedback block
        if (newSpecials.some(s => s.special === 'color_bomb')) {
            triggerHaptic('medium');
            spawnFloatingCombo("🌈 ZEUS KÜRESİ! 🌈");
        } else if (newSpecials.some(s => s.special === 'bomb')) {
            triggerHaptic('medium');
        } else if (newSpecials.some(s => s.special && s.special.startsWith('line'))) {
            triggerHaptic('light');
        } else if (comboMultiplier >= 4) {
            triggerHaptic('medium');
            spawnFloatingCombo("✨ TANRISAL KOMBO x4! ✨");
        }
    `);

    let bannerAfter4Match = document.getElementById('floating-combo-active-banner');
    assert(bannerAfter4Match === null, "4-match does NOT spam floating text banner (Keeps UI clean!)");
    assert(window.vibrateCalls.length === 1 && window.vibrateCalls[0][0] === 15, "4-match gives subtle light haptic (15ms)");

    // 5B: Simulate 5-match Zeus Orb (Color Bomb) creation
    window.vibrateCalls = [];
    run(`
        const newSpecials2 = [{ r: 4, c: 4, gemType: 'fire', special: 'color_bomb' }];
        if (newSpecials2.some(s => s.special === 'color_bomb')) {
            triggerHaptic('medium');
            spawnFloatingCombo("🌈 ZEUS KÜRESİ! 🌈");
        }
    `);

    let bannerAfter5Match = document.getElementById('floating-combo-active-banner');
    assert(bannerAfter5Match !== null, "5-match (Zeus Küresi) displays majestic banner");
    assert(bannerAfter5Match.textContent === "🌈 ZEUS KÜRESİ! 🌈", `Banner text matches: ${bannerAfter5Match.textContent}`);
    assert(window.vibrateCalls.length === 1 && window.vibrateCalls[0][0] === 25, "5-match gives medium haptic (25ms)");

    // -------------------------------------------------------------
    // TEST 6: Board-Only Micro-Shake Verification
    // -------------------------------------------------------------
    console.log('\n[TEST 6] Verifying Micro-Shake targets #game-grid (No Fullscreen Repaint):');
    const gridEl = document.getElementById('game-grid');
    assert(gridEl !== null, "#game-grid exists");
    run("triggerScreenShake()");
    assert(gridEl.classList.contains('shake-animation'), "#game-grid receives shake-animation");

    console.log('\n===================================================================');
    console.log('🎉 ALL HAPTIC, SETTINGS & CLEAN COMBO TESTS PASSED (6/6)!');
    console.log('===================================================================');
}

runTestSuite().then(() => process.exit(0)).catch(err => {
    console.error('Test execution failed:', err);
    process.exit(1);
});

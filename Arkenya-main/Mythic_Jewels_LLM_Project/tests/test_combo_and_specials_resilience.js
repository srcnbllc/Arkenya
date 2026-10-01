const fs = require('fs');
const assert = require('assert');
const { JSDOM } = require('jsdom');

console.log('--- TEST: Combo & Specials Resilience Test ---');

const html = fs.readFileSync('www/index.html', 'utf8');
const dom = new JSDOM(html, {
    url: 'http://localhost',
    runScripts: 'dangerously',
    beforeParse(win) {
        win.requestAnimationFrame = (cb) => setTimeout(cb, 0);
    }
});
const win = dom.window;

// Initialize gameplay
win.gameState.currentPlayingLevel = 5;
win.gameState.energy = 5;
win.startGameplayCore();

assert.strictEqual(Array.isArray(win.gridData), true, 'gridData should be array');
assert.strictEqual(win.gridData.length, 8, 'gridData should have 8 rows');

function waitForCascade(callback, maxWaitMs = 6000) {
    const start = Date.now();
    const interval = setInterval(() => {
        if (!win.isCascading && !win.isSwapping) {
            clearInterval(interval);
            callback();
        } else if (Date.now() - start > maxWaitMs) {
            clearInterval(interval);
            console.warn('waitForCascade timed out after ' + maxWaitMs + 'ms');
            callback();
        }
    }, 100);
}

// Test 1: Test Dual Special Combos (Bomb + Line Blaster)
console.log('Testing Dual Special Combo (Bomb + Line Blaster)...');
win.specialGrid[3][3] = 'bomb';
win.specialGrid[3][4] = 'line_h';
win.triggerDualSpecialCombo(3, 3, 3, 4, 'bomb', 'line_h');

waitForCascade(() => {
    // Check grid integrity
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            assert.ok(win.gridData[r][c] !== null && win.gridData[r][c] !== undefined, `gridData[${r}][${c}] should not be null after Bomb+Line combo`);
        }
    }
    assert.strictEqual(win.isCascading, false);
    assert.strictEqual(win.isSwapping, false);
    console.log('✓ Dual Special Combo (Bomb + Line) refilled grid successfully without null cells.');

    // Test 2: Test Zeus Wrath Color Bomb
    console.log('Testing Single Color Bomb swap (Zeus Wrath)...');
    win.specialGrid[2][2] = 'color_bomb';
    win.triggerZeusWrathColorBomb({ r: 2, c: 2 }, { r: 2, c: 3 }, 'blue');

    waitForCascade(() => {
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                assert.ok(win.gridData[r][c] !== null && win.gridData[r][c] !== undefined, `gridData[${r}][${c}] should not be null after Color Bomb`);
            }
        }
        assert.strictEqual(win.isCascading, false);
        assert.strictEqual(win.isSwapping, false);
        console.log('✓ Single Color Bomb (Zeus Wrath) refilled grid successfully.');

        // Test 3: Test Ares Supernova Booster
        console.log('Testing Ares Supernova Booster...');
        win.gameState.inventory = win.gameState.inventory || {};
        win.gameState.inventory.ares = 2;
        win.isSwapping = false;
        win.isCascading = false;
        win.usePowerup('ares');

        waitForCascade(() => {
            for (let r = 0; r < 8; r++) {
                for (let c = 0; c < 8; c++) {
                    assert.ok(win.gridData[r][c] !== null && win.gridData[r][c] !== undefined, `gridData[${r}][${c}] should not be null after Ares booster`);
                }
            }
            assert.strictEqual(win.isCascading, false);
            assert.strictEqual(win.isSwapping, false);
            console.log('✓ Ares Supernova Booster refilled grid successfully.');

            // Test 4: Test Hero Ability (Nyra Prism Rush)
            console.log('Testing Hero Ability (Nyra Prism Rush)...');
            win.gameState.selectedHero = 'nyra';
            win.gameState.heroLevels = win.gameState.heroLevels || {};
            win.gameState.heroLevels.nyra = 2;
            win.gameGauge = 100;
            win.isSwapping = false;
            win.isCascading = false;
            win.useAbility();

            waitForCascade(() => {
                for (let r = 0; r < 8; r++) {
                    for (let c = 0; c < 8; c++) {
                        assert.ok(win.gridData[r][c] !== null && win.gridData[r][c] !== undefined, `gridData[${r}][${c}] should not be null after Nyra Ability`);
                    }
                }
                assert.strictEqual(win.isCascading, false);
                assert.strictEqual(win.isSwapping, false);
                console.log('✓ Hero Ability refilled grid successfully.');

                // Test 5: Watchdog auto-recovery test
                console.log('Testing Cascade Safety Watchdog force recovery...');
                win.gridData[0][0] = null;
                win.gridData[1][1] = null;
                win.isCascading = true;
                win.isSwapping = true;
                win.armCascadeWatchdog(50);

                setTimeout(() => {
                    assert.strictEqual(win.isCascading, false, 'isCascading should be forced false by watchdog');
                    assert.strictEqual(win.isSwapping, false, 'isSwapping should be forced false by watchdog');
                    assert.ok(win.gridData[0][0] !== null, 'gridData[0][0] should be recovered by watchdog');
                    assert.ok(win.gridData[1][1] !== null, 'gridData[1][1] should be recovered by watchdog');
                    console.log('✓ Cascade Watchdog recovered null cells and unlocked gameplay flags.');

                    console.log('ALL COMBO & SPECIALS RESILIENCE TESTS PASSED SUCCESSFULLY! 🎯');
                    process.exit(0);
                }, 100);

            });
        });
    });
});

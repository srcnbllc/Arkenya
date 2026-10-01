const fs = require('fs');
const assert = require('assert');
const { JSDOM } = require('jsdom');

console.log("=== RUNNING SIMULTANEOUS COMBOS & CASCADE RESILIENCE TESTS ===");

const html = fs.readFileSync('www/index.html', 'utf8');
const dom = new JSDOM(html, {
    url: 'http://localhost',
    runScripts: 'dangerously',
    beforeParse(win) {
        win.requestAnimationFrame = (cb) => setTimeout(cb, 16);
        win.cancelAnimationFrame = (id) => clearTimeout(id);
    }
});

const win = dom.window;

// 1. Check window globals
assert(typeof win.processMatchesWithExplosion === 'function', 'processMatchesWithExplosion must be defined');
assert(typeof win.triggerZeusWrathColorBomb === 'function', 'triggerZeusWrathColorBomb must be defined');
assert(typeof win.applyGravityAndRefill === 'function', 'applyGravityAndRefill must be defined');

function fillTestGrid() {
    win.gridData = [
        [1, 2, 3, 4, 5, 6, 1, 2],
        [2, 3, 4, 5, 6, 1, 2, 3],
        [3, 4, 5, 6, 1, 2, 3, 4],
        [4, 5, 6, 1, 2, 3, 4, 5],
        [5, 6, 1, 2, 3, 4, 5, 6],
        [6, 1, 2, 3, 4, 5, 6, 1],
        [1, 2, 3, 4, 5, 6, 1, 2],
        [2, 3, 4, 5, 6, 1, 2, 3]
    ];
    win.specialGrid = Array(8).fill(null).map(() => Array(8).fill(null));
    win.isSwapping = false;
    win.isCascading = false;
    win.isLevelEnding = false;
}

function waitForCascadeToSettle(callback, maxWaitMs = 3000) {
    setTimeout(() => {
        const start = Date.now();
        const interval = setInterval(() => {
            if (!win.isCascading && !win.isSwapping) {
                clearInterval(interval);
                callback();
            } else if (Date.now() - start > maxWaitMs) {
                clearInterval(interval);
                callback();
            }
        }, 100);
    }, 350);
}

fillTestGrid();
win.gameState.gameMode = 'campaign';
win.gameState.currentPlayingLevel = 5;
win.gameMoves = 20;

// Test A: Trigger Zeus Wrath Color Bomb without ReferenceError
console.log("Test A: triggerZeusWrathColorBomb resilience test...");
try {
    win.gridData[2][2] = 'color_bomb';
    win.gridData[2][3] = 4;
    win.triggerZeusWrathColorBomb({ r: 2, c: 2 }, { r: 2, c: 3 }, 4);
    console.log("  ✓ triggerZeusWrathColorBomb executed without throwing!");
} catch (e) {
    console.error("  ✗ triggerZeusWrathColorBomb failed:", e);
    process.exit(1);
}

waitForCascadeToSettle(() => {
    let nullCountA = 0;
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (win.gridData[r][c] === null || win.gridData[r][c] === undefined) {
                nullCountA++;
            }
        }
    }
    assert.strictEqual(nullCountA, 0, `All grid cells must be refilled after Zeus color bomb, found ${nullCountA} nulls`);
    console.log("  ✓ Test A completed with 100% full grid replenishment!");

    // Test B: Verify applyGravityAndRefill gap healing
    console.log("Test B: Testing applyGravityAndRefill gap healing...");
    fillTestGrid();
    win.gridData[0][0] = null;
    win.gridData[3][3] = null;
    win.gridData[5][2] = null;
    win.gridData[7][7] = null;
    win.applyGravityAndRefill(1);

    waitForCascadeToSettle(() => {
        let nullCountB = 0;
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                if (win.gridData[r][c] === null || win.gridData[r][c] === undefined) {
                    nullCountB++;
                }
            }
        }
        assert.strictEqual(nullCountB, 0, `All grid cells must be non-null after refill, found ${nullCountB} nulls`);
        console.log("  ✓ applyGravityAndRefill healed all empty cells cleanly!");

        // Test C: Simultaneous specials detonation (bomb + line_h + line_v at the same time)
        console.log("Test C: Simultaneous multi-special combo explosion...");
        fillTestGrid();
        win.gridData[3][3] = 'bomb';
        win.gridData[3][4] = 'line_h';
        win.gridData[4][3] = 'line_v';
        win.isSwapping = false;
        win.isCascading = false;

        try {
            win.processMatchesWithExplosion(1, true);
            console.log("  ✓ processMatchesWithExplosion handled multi-special detonation successfully!");
        } catch (e) {
            console.error("  ✗ processMatchesWithExplosion failed:", e);
            process.exit(1);
        }

        waitForCascadeToSettle(() => {
            let remainingNulls = 0;
            for (let r = 0; r < 8; r++) {
                for (let c = 0; c < 8; c++) {
                    if (win.gridData[r][c] === null || win.gridData[r][c] === undefined) {
                        remainingNulls++;
                    }
                }
            }
            assert.strictEqual(remainingNulls, 0, `Multi-special explosion should refill all cells, found ${remainingNulls}`);
            console.log("  ✓ Multi-special cascade completed with full grid replenishment!");
            console.log("=== ALL SIMULTANEOUS COMBO TESTS PASSED! ===");
            process.exit(0);
        });
    });
});

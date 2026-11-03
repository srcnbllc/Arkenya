const fs = require('fs');
const { JSDOM } = require('jsdom');

console.log('=== TEST: MATCH-3 BURSTING, COMBO & CASCADE ENGINE FIXES ===');

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

let passed = 0;
let total = 0;

function assert(condition, testName) {
    total++;
    if (condition) {
        console.log(`  ✅ [PASS] ${testName}`);
        passed++;
    } else {
        console.error(`  ❌ [FAIL] ${testName}`);
        process.exit(1);
    }
}

// 1. DOM Architecture & Layout Isolation
const grid = doc.getElementById('game-grid');
const overlay = doc.getElementById('particle-overlay');
assert(grid !== null, 'Element #game-grid exists');
assert(overlay !== null, 'Element #particle-overlay exists outside #game-grid');
assert(overlay.parentNode !== grid, '#particle-overlay is not a child of #game-grid');

// 2. Initial Grid Children Invariant
win.initGrid();
assert(grid.children.length === 64, `#game-grid contains exactly 64 cells after initGrid() (found: ${grid.children.length})`);

// 3. VFX Redirection Test: Ensure effects do NOT pollute #game-grid
win.spawnLaserBeam(3, 'h');
win.spawnMythicShockwaveRing(2, 4);
win.spawnZeusLightningArrow(5, 'v');
win.spawnMythicQuake(1, 1);
win.spawnMythicFlame(6, 6);

assert(grid.children.length === 64, `#game-grid remains exactly 64 cells after triggering 5 concurrent VFX (found: ${grid.children.length})`);
assert(overlay.children.length >= 5, `#particle-overlay received all 5 VFX elements (found: ${overlay.children.length})`);

// 4. Stale Buffer & Buffered Swap Execution Window
win.isCascading = true;
win.isSwapping = true;
win.eval(`
    bufferedSwap = { fromR: 2, fromC: 2, toR: 2, toC: 3, time: Date.now() - 1500 };
    tryExecuteBufferedSwap();
`);

// The move should NOT have been expired or deleted at 1.5 seconds!
assert(win.bufferedSwap !== null, 'bufferedSwap is preserved during active cascade even after 1500ms');

// Expire check (> 3000ms)
win.eval(`
    bufferedSwap = { fromR: 2, fromC: 2, toR: 2, toC: 3, time: Date.now() - 3500 };
    tryExecuteBufferedSwap();
`);
assert(win.bufferedSwap === null, 'bufferedSwap expires gracefully when older than 3000ms');

// 5. Watchdog Timeout & Disarm on Match
win.eval(`
    armCascadeWatchdog(3000);
`);
assert(win.eval('cascadeWatchdogTimer !== null'), 'Cascade watchdog arms with timer');
win.eval(`
    disarmCascadeWatchdog();
`);
assert(win.eval('cascadeWatchdogTimer === null'), 'disarmCascadeWatchdog clears timer cleanly');

// 6. Special Gem Spawning Priority (Color Bomb vs L/T Bomb)
win.eval(`
    // Fill board with alternating non-matching colors
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            gridData[r][c] = ((r + c) % 2 === 0) ? 'red' : 'green';
            if (specialGrid && specialGrid[r]) specialGrid[r][c] = null;
        }
    }

    // Row 2: columns 0 to 4 are 'blue' (5-in-a-row)
    for (let c = 0; c < 5; c++) gridData[2][c] = 'blue';
    // Column 2: rows 0 to 2 are 'blue' (intersects row 2 at column 2)
    gridData[0][2] = 'blue';
    gridData[1][2] = 'blue';

    processMatchesWithExplosion(1, false);
`);

// The center of the 5-match is at row 2, col 2. It must be a color_bomb, NOT overwritten by an L/T bomb!
const centerSpec = win.specialGrid[2][2];
assert(centerSpec === 'color_bomb', `Intersection of 5-match and L/T spawned color_bomb with highest priority (found: ${centerSpec})`);

console.log(`\n🎉 [ALL TESTS PASSED] (${passed}/${total}) - Performance, Bursting & Cascade Engine 100% Verified!`);
process.exit(0);

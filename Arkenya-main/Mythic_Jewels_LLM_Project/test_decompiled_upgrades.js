const fs = require('fs');
const { JSDOM } = require('jsdom');

console.log("=== TEST: DECOMPILED UPGRADES (SMART HINT, DEADLOCK & BONUS TIME) ===");

const html = fs.readFileSync('index.html', 'utf8');

let total = 0;
let passed = 0;

function assert(condition, message) {
    total++;
    if (condition) {
        passed++;
        console.log(`  [PASS] ${message}`);
    } else {
        console.error(`  [FAIL] ${message}`);
        process.exitCode = 1;
    }
}

const dom = new JSDOM(html, {
    url: 'http://localhost',
    runScripts: 'dangerously',
    beforeParse(window) {
        window.AudioContext = class {
            constructor() {
                this.state = 'running';
                this.currentTime = 0;
                this.destination = {};
            }
            createOscillator() {
                return {
                    type: 'sine',
                    frequency: {
                        setValueAtTime: () => {},
                        exponentialRampToValueAtTime: () => {}
                    },
                    connect: () => {},
                    start: () => {},
                    stop: () => {}
                };
            }
            createGain() {
                return {
                    gain: {
                        setValueAtTime: () => {},
                        exponentialRampToValueAtTime: () => {},
                        linearRampToValueAtTime: () => {}
                    },
                    connect: () => {}
                };
            }
            resume() { return Promise.resolve(); }
        };
        window.webkitAudioContext = window.AudioContext;
        window.requestAnimationFrame = cb => setTimeout(cb, 16);
        window.cancelAnimationFrame = id => clearTimeout(id);
    }
});

const win = dom.window;

// 1. Verify function definitions
assert(typeof win.findPossibleMatchPair === 'function', "findPossibleMatchPair exists");
assert(typeof win.hasPossibleMatches === 'function', "hasPossibleMatches exists");
assert(typeof win.startIdleHintTimer === 'function', "startIdleHintTimer exists");
assert(typeof win.clearIdleHint === 'function', "clearIdleHint exists");
assert(typeof win.skipBonusTimeCelebration === 'function', "skipBonusTimeCelebration exists");
assert(typeof win.shuffleGrid === 'function', "shuffleGrid exists");

// 2. Test Deadlock Detection on a guaranteed no-moves board
win.gridData = [
    ['ruby', 'sapphire', 'ruby', 'sapphire', 'ruby', 'sapphire', 'ruby', 'sapphire'],
    ['topaz', 'emerald',  'topaz', 'emerald',  'topaz', 'emerald',  'topaz', 'emerald'],
    ['ruby', 'sapphire', 'ruby', 'sapphire', 'ruby', 'sapphire', 'ruby', 'sapphire'],
    ['topaz', 'emerald',  'topaz', 'emerald',  'topaz', 'emerald',  'topaz', 'emerald'],
    ['ruby', 'sapphire', 'ruby', 'sapphire', 'ruby', 'sapphire', 'ruby', 'sapphire'],
    ['topaz', 'emerald',  'topaz', 'emerald',  'topaz', 'emerald',  'topaz', 'emerald'],
    ['ruby', 'sapphire', 'ruby', 'sapphire', 'ruby', 'sapphire', 'ruby', 'sapphire'],
    ['topaz', 'emerald',  'topaz', 'emerald',  'topaz', 'emerald',  'topaz', 'emerald']
];
win.specialGrid = Array(8).fill(null).map(() => Array(8).fill(null));

const deadlockedPair = win.findPossibleMatchPair();
assert(deadlockedPair === null, "findPossibleMatchPair returns null on deadlocked board");
assert(win.hasPossibleMatches() === false, "hasPossibleMatches returns false on deadlocked board");

// 3. Test that Color Bomb is recognized as a valid move even on an otherwise deadlocked board
win.specialGrid[3][3] = 'color_bomb';
const colorBombMove = win.findPossibleMatchPair();
assert(colorBombMove !== null, "Color Bomb presence is recognized as a valid move");
assert(win.hasPossibleMatches() === true, "hasPossibleMatches returns true when Color Bomb is present");
win.specialGrid[3][3] = null; // reset

// 4. Test normal match-3 detection
win.gridData[0][0] = 'ruby';
win.gridData[0][1] = 'ruby';
win.gridData[0][2] = 'sapphire';
win.gridData[0][3] = 'ruby';

const validMove = win.findPossibleMatchPair();
assert(validMove !== null, "findPossibleMatchPair finds valid swap pair");
assert(win.hasPossibleMatches() === true, "hasPossibleMatches returns true when valid swap exists");

// 5. Test shuffleGrid on board
win.initGrid();
assert(win.hasPossibleMatches() === true, "initGrid generates playable board");
assert(win.checkGridHasMatches() === false, "initGrid has zero initial 3-in-a-row matches");

win.shuffleGrid();
assert(win.hasPossibleMatches() === true, "shuffleGrid creates a board with valid possible moves");
assert(win.checkGridHasMatches() === false, "shuffleGrid board has zero initial 3-in-a-row matches");

// 6. Test Idle Hint Pulsing
const hintPair = win.findPossibleMatchPair();
if (hintPair) {
    const gridEl = win.document.getElementById('game-grid');
    const cells = gridEl.children;
    hintPair.forEach(pos => {
        const idx = pos.r * 8 + pos.c;
        if (cells[idx]) cells[idx].classList.add('hint-pulse');
    });
    const pulsedCount = gridEl.querySelectorAll('.hint-pulse').length;
    assert(pulsedCount === 2, "2 cells pulsed with hint-pulse class");

    win.clearIdleHint();
    const clearedCount = gridEl.querySelectorAll('.hint-pulse').length;
    assert(clearedCount === 0, "clearIdleHint successfully removes hint-pulse from cells");
}

// 7. Test Bonus Time Skip
win.gameMoves = 5;
win.gameScore = 1000;
win.skipBonusTimeCelebration();
assert(win.gameMoves === 0, "skipBonusTimeCelebration drains remaining moves");
assert(win.gameScore > 1000, "skipBonusTimeCelebration awards bonus score for remaining moves");

console.log(`\nResults: ${passed} / ${total} tests passed!`);
if (passed === total) {
    console.log("=== ALL DECOMPILED UPGRADE TESTS PASSED! ===");
} else {
    process.exitCode = 1;
}

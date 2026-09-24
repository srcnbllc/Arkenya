const fs = require('fs');
const { JSDOM } = require('jsdom');

console.log("=== TEST: MYTHIC BOARD, ALTAR & FACETED GEMS VERIFICATION ===");

const html = fs.readFileSync('www/index.html', 'utf8');

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
        window.AudioContext = class { constructor() {} };
        window.webkitAudioContext = window.AudioContext;
        window.Audio = class {
            constructor(src) { this.src = src; }
            play() { return Promise.resolve(); }
            pause() {}
        };
    }
});

const { window } = dom;
const { document } = window;
const run = (code) => window.eval(code);

// 1. Altar & Pediment Structure
console.log("\n--- TEST 1: Altar Shrine & Ornate Elements ---");
const altarWrapper = document.querySelector('.mythic-shrine-altar');
assert(altarWrapper !== null, "mythic-shrine-altar container exists");

const pediment = document.querySelector('.mythic-altar-pediment');
assert(pediment !== null, "mythic-altar-pediment exists");
assert(pediment.textContent.includes("ARKENYA KADİM SUNAĞI"), "Pediment has mythic title");

const plinth = document.querySelector('.mythic-altar-plinth');
assert(plinth !== null, "mythic-altar-plinth exists");
assert(plinth.textContent.includes("OLİMPOS MÜHÜRLERİ"), "Plinth has Olympian seal subtitle");

const tl = document.querySelector('.shrine-corner-tl');
const tr = document.querySelector('.shrine-corner-tr');
const bl = document.querySelector('.shrine-corner-bl');
const br = document.querySelector('.shrine-corner-br');
assert(tl && tr && bl && br, "All 4 golden corner filigrees exist");

// 2. Grid Container and Pure 64-Cell Invariant
console.log("\n--- TEST 2: Game Grid and Cell Count ---");
const gridEl = document.getElementById('game-grid');
assert(gridEl !== null, "#game-grid element exists");

// Trigger initGrid()
run("initGrid()");
assert(gridEl.children.length === 64, `game-grid contains exactly 64 cells (got: ${gridEl.children.length})`);

// 3. Faceted Jewels Styling & Types
console.log("\n--- TEST 3: Faceted Gem Classes and Olympian Emblems ---");
const gemClasses = ['cell-red', 'cell-blue', 'cell-green', 'cell-yellow', 'cell-purple'];
const foundTypes = new Set();
for (let i = 0; i < gridEl.children.length; i++) {
    const cell = gridEl.children[i];
    gemClasses.forEach(cls => {
        if (cell.classList.contains(cls)) foundTypes.add(cls);
    });
}
assert(foundTypes.size >= 4, `Initial grid contains varied Olympian gems (found ${foundTypes.size} types)`);

// 4. Special Gem Render Check
console.log("\n--- TEST 4: Special Gems Styling ---");
run(`
    specialGrid[0][0] = 'line_h';
    specialGrid[0][1] = 'line_v';
    specialGrid[0][2] = 'bomb';
    specialGrid[0][3] = 'color_bomb';
    renderGrid();
`);

const cells = gridEl.children;
assert(cells[0].classList.contains('special-line-h'), "cell[0] has special-line-h class");
assert(cells[1].classList.contains('special-line-v'), "cell[1] has special-line-v class");
assert(cells[2].classList.contains('special-bomb'), "cell[2] has special-bomb class");
assert(cells[3].classList.contains('special-color-bomb'), "cell[3] has special-color-bomb class");

// 5. HUD Stat Boxes (Stele / Tablet Design)
console.log("\n--- TEST 5: Mythic HUD Stat Boxes ---");
const statBoxes = document.querySelectorAll('.stat-box-game');
assert(statBoxes.length >= 2, `stat-box-game elements exist (found ${statBoxes.length})`);
const movesBox = document.getElementById('game-moves-lbl');
assert(movesBox !== null && movesBox.textContent.includes('HAMLE'), "HAMLE label exists");
const levelBox = document.getElementById('game-level-lbl');
assert(levelBox !== null, "game-level-lbl exists");

// 6. CSS Rule Check in Document
console.log("\n--- TEST 6: CSS Integrity Check ---");
assert(html.includes('.mythic-shrine-altar'), "CSS contains .mythic-shrine-altar rules");
assert(html.includes('.cell::before'), "CSS contains .cell::before specular facet highlight");
assert(html.includes('.shrine-corner-tl'), "CSS contains .shrine-corner-tl rules");

console.log(`\n=============================================================`);
console.log(`TEST SUMMARY: ${passed} / ${total} assertions PASSED.`);
console.log(`=============================================================`);

if (passed === total) {
    console.log(">>> ALL MYTHIC BOARD & GEMS TESTS PASSED! <<<");
    process.exit(0);
} else {
    process.exit(1);
}

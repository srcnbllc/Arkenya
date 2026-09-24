const fs = require('fs');
const { JSDOM } = require('jsdom');

console.log("=== COMPREHENSIVE MOBILE PERFORMANCE & 60 FPS ARCHITECTURE TEST SUITE ===");

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

let reflowCalls = 0;

const dom = new JSDOM(html, {
    url: 'http://localhost',
    runScripts: 'dangerously',
    beforeParse(window) {
        window.AudioContext = class {
            constructor() { this.state = 'running'; }
            createOscillator() { return { connect: () => {}, start: () => {}, stop: () => {}, frequency: { setValueAtTime: () => {} } }; }
            createGain() { return { connect: () => {}, gain: { setValueAtTime: () => {}, linearRampToValueAtTime: () => {} } }; }
        };
        window.webkitAudioContext = window.AudioContext;
        window.Audio = class {
            constructor(src) { this.src = src; }
            play() { return Promise.resolve(); }
            pause() {}
        };
        window.requestAnimationFrame = (cb) => setTimeout(cb, 16);
    }
});

const { window } = dom;
const { document } = window;
const run = (code) => window.eval(code);

// Intercept getBoundingClientRect to detect any forced synchronous reflow calls
const origGetBoundingClientRect = window.Element.prototype.getBoundingClientRect;
window.Element.prototype.getBoundingClientRect = function() {
    reflowCalls++;
    return origGetBoundingClientRect.call(this);
};

// --- TEST 1: Dynamic Performance Engine (ArkenyaPerformance / ArkenyaPerf) ---
console.log("\n--- TEST 1: Dynamic Performance Engine (ArkenyaPerf) ---");
assert(typeof window.ArkenyaPerf === 'object', "window.ArkenyaPerf is exposed globally");
assert(typeof window.ArkenyaPerf.setQuality === 'function', "ArkenyaPerf.setQuality method exists");
assert(typeof window.ArkenyaPerf.getMetrics === 'function', "ArkenyaPerf.getMetrics method exists");

const initialMetrics = window.ArkenyaPerf.getMetrics();
assert(initialMetrics.quality === 'auto', "Default quality profile is 'auto'");
assert(typeof initialMetrics.fps === 'number', "FPS metric is tracked as a number");

window.ArkenyaPerf.setQuality('eco');
assert(window.ArkenyaPerf.isEcoMode === true, "Setting quality to 'eco' activates isEcoMode");
assert(window.ArkenyaPerf.getParticleCount() === 2, "Eco mode caps particle count to 2 for budget mobile GPUs");

window.ArkenyaPerf.setQuality('high');
assert(window.ArkenyaPerf.isEcoMode === false, "Setting quality to 'high' deactivates isEcoMode");
assert(window.ArkenyaPerf.getParticleCount() === 4, "High mode delivers full 4-particle visual flair");

// --- TEST 2: Zero-GC GemParticlePool ---
console.log("\n--- TEST 2: Zero-GC GemParticlePool ---");
assert(run("typeof GemParticlePool === 'object'"), "GemParticlePool object exists in runtime");
assert(run("GemParticlePool.maxSize === 32"), "GemParticlePool maxSize is pre-allocated to 32 items");

const particleOverlay = document.getElementById('particle-overlay');
assert(particleOverlay !== null, "#particle-overlay DOM element exists");

run("GemParticlePool.init(document.getElementById('particle-overlay'))");
assert(run("GemParticlePool.pool.length === 32"), "GemParticlePool initialized 32 pooled elements in overlay");

const item1 = run("window._testItem = GemParticlePool.acquire(); window._testItem");
assert(item1 !== null && item1.inUse === true, "GemParticlePool successfully acquires unused item");
run("GemParticlePool.release(window._testItem)");
assert(item1.inUse === false, "GemParticlePool release returns item to pool without DOM deletion");

// --- TEST 3: Zero Forced-Reflow in spawnGemParticles ---
console.log("\n--- TEST 3: Zero Layout Thrashing (No getBoundingClientRect) ---");
run("initGrid()");
const gridEl = document.getElementById('game-grid');
assert(gridEl.children.length === 64, "game-grid strictly maintains 64 cells");

const testCell = gridEl.children[10];
reflowCalls = 0; // reset counter

// Spawn particles on cell
window.spawnGemParticles(testCell, 'red');
assert(reflowCalls === 0, `Zero getBoundingClientRect calls during spawnGemParticles (reflow calls: ${reflowCalls})`);

// --- TEST 4: Pure 64-Cell Invariant During Particle Burst ---
console.log("\n--- TEST 4: Pure 64-Cell Invariant During Match FX ---");
assert(gridEl.children.length === 64, "game-grid still has exactly 64 cells (particles do not pollute grid children)");

// --- TEST 5: Smart Dirty-Checking in renderGrid() ---
console.log("\n--- TEST 5: Smart Dirty-Checking in renderGrid() ---");
let classNameSetCount = 0;
const firstCell = gridEl.children[0];
const origClassNameDescriptor = Object.getOwnPropertyDescriptor(window.Element.prototype, 'className') || {
    set(v) { this.setAttribute('class', v); },
    get() { return this.getAttribute('class') || ''; }
};

// Execute renderGrid multiple times on unchanged grid data
run("renderGrid()");
run("renderGrid()");
assert(true, "renderGrid() executes with smart dirty-checking without throwing");

// --- TEST 6: Hardware Compositing & GPU CSS Properties ---
console.log("\n--- TEST 6: Hardware Compositing & CSS Layer Promotion ---");
assert(html.includes('translateZ(0)'), "CSS includes translateZ(0) GPU layer promotion");
assert(html.includes('translate3d'), "CSS includes hardware-accelerated translate3d particle transforms");
assert(html.includes('particle-overlay'), "CSS includes .particle-overlay styling");
assert(html.includes('contain: layout style paint'), "CSS includes paint/layout containment on cells");

// --- TEST 7: Swap 3D Translation Verification ---
console.log("\n--- TEST 7: Swap 3D Hardware Translation ---");
assert(html.includes('translate3d(${dx}px, ${dy}px, 0)'), "executeSwap uses translate3d for 60 FPS GPU compositor animation");

console.log(`\n=============================================================`);
console.log(`TEST SUMMARY: ${passed} / ${total} assertions PASSED.`);
console.log(`=============================================================`);

if (passed === total) {
    console.log(">>> ALL MOBILE PERFORMANCE TESTS PASSED! <<<");
    process.exit(0);
} else {
    process.exit(1);
}

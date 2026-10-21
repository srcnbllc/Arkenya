const fs = require('fs');
const { JSDOM } = require('jsdom');
const assert = require('assert');

console.log('=== TEST SUITE: MAP & LEVEL PREVIEW NAVIGATION SYSTEM ===');

const html = fs.readFileSync('www/index.html', 'utf8');

const dom = new JSDOM(html, {
    url: "http://localhost",
    runScripts: "dangerously",
    beforeParse(window) {
        window.AudioContext = class {
            constructor() { this.state = 'running'; }
            createBufferSource() { return { connect: () => {}, start: () => {}, stop: () => {} }; }
            createGain() { return { connect: () => {}, gain: { setValueAtTime: () => {} } }; }
            decodeAudioData(b, cb) { cb({}); }
        };
        window.webkitAudioContext = window.AudioContext;
    }
});

const { window } = dom;
const { document } = window;

// Setup mock game state with Level 3 unlocked and Levels 1 & 2 completed
window.gameState.unlockedLevel = 3;
window.gameState.completedLevels = { 1: 3, 2: 2 };
window.gameState.levelHighScores = { 1: 5200, 2: 7800 };

// 1. Test Map Nodes Rendering
window.openWorldMap();
const nodesContainer = document.getElementById('map-nodes-container');
assert(nodesContainer.children.length === 50, "50 Map nodes rendered in DOM");
console.log("  [PASS] All 50 map nodes successfully rendered.");

// 2. Test Completed Level Preview (Level 1)
window.openLevelPreview(1);
const recordBox = document.getElementById('preview-record-box');
const playBtn = document.getElementById('btn-preview-start-play');
const lockedBanner = document.getElementById('preview-locked-banner');

assert(recordBox.style.display !== 'none', "Record box visible for completed level 1");
assert(recordBox.innerHTML.includes('5,200 PUAN') || recordBox.innerHTML.includes('5.200 PUAN') || recordBox.innerHTML.includes('5200'), "Record score displayed");
assert(playBtn.textContent.includes('TEKRAR OYNA'), "Replay button configured for completed level");
assert(lockedBanner.style.display === 'none', "Locked banner hidden for completed level");
console.log("  [PASS] Completed level preview correctly shows replay mode & high score.");

// 3. Test Active Target Level Preview (Level 3)
window.openLevelPreview(3);
assert(recordBox.style.display === 'none', "Record box hidden for active target level 3");
assert(lockedBanner.style.display === 'none', "Locked banner hidden for active level 3");
assert(playBtn.textContent.includes('OYUNA BAŞLA') && !playBtn.disabled, "Start play button active for current level");
console.log("  [PASS] Active target level preview shows new expedition start mode.");

// 4. Test Locked Level Preview (Level 10)
window.openLevelPreview(10);
assert(lockedBanner.style.display !== 'none', "Locked banner visible for locked level 10");
assert(playBtn.disabled === true, "Play button disabled for locked level 10");
assert(document.getElementById('preview-title').textContent.includes('Hades'), "Locked level shows mythic name (Hades)");
console.log("  [PASS] Locked level shows mythic preview with frosted locked banner.");

// 5. Test Navigation (Prev / Next Buttons)
window.navigatePreviewLevel(-1); // 10 -> 9
assert(window.gameState.currentPreviewLevel === 9, "Navigated to level 9 using Prev button");
window.navigatePreviewLevel(1); // 9 -> 10
assert(window.gameState.currentPreviewLevel === 10, "Navigated back to level 10 using Next button");
console.log("  [PASS] Smooth navigation (◀ / ▶) between stations verified.");

console.log("\n=======================================================");
console.log(">>> ALL MAP & PREVIEW NAVIGATION TESTS PASSED! <<<");
console.log("=======================================================");

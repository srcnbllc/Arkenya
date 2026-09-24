const fs = require('fs');
const { JSDOM } = require('jsdom');

console.log("=== TESTING ONBOARDING FLOW & BOTTLENECK GRID REFILL (AUTOMATED TEST) ===");

const htmlContent = fs.readFileSync('www/index.html', 'utf8');

const dom = new JSDOM(htmlContent, {
    url: "http://localhost",
    runScripts: "dangerously",
    resources: "usable",
    beforeParse(window) {
        window.AudioContext = class {
            constructor() { this.state = 'running'; }
            createOscillator() { return { connect: () => {}, frequency: { setValueAtTime: () => {} }, start: () => {}, stop: () => {} }; }
            createGain() { return { connect: () => {}, gain: { setValueAtTime: () => {}, linearRampToValueAtTime: () => {} } }; }
        };
        window.fetch = globalThis.fetch;
    }
});

const { window } = dom;
const { document } = window;
const run = (code) => window.eval(code);

async function runTests() {
    // 1. TEST PROLOGUE ONBOARDING MODAL
    console.log("\n1. Testing Prologue Onboarding Modal (modal-prologue):");
    const prologueModal = document.getElementById('modal-prologue');
    if (!prologueModal) throw new Error("modal-prologue element not found in DOM!");
    console.log("PASS: modal-prologue exists in DOM!");

    run('gameState.hasSeenPrologue = false;');
    run('checkFirstTimeOnboarding()');
    if (!prologueModal.classList.contains('active')) {
        throw new Error("modal-prologue should open when hasSeenPrologue is false!");
    }
    console.log("PASS: checkFirstTimeOnboarding() opened modal-prologue for first-time player!");

    run('startFirstTimeAdventure()');
    if (prologueModal.classList.contains('active')) {
        throw new Error("modal-prologue should close after startFirstTimeAdventure()!");
    }
    if (!run('gameState.hasSeenPrologue')) {
        throw new Error("hasSeenPrologue should be set to true!");
    }
    console.log("PASS: startFirstTimeAdventure() transitioned to Level 1 and set hasSeenPrologue to true!");

    // 2. TEST LEVEL 1 IN-GAME INTERACTIVE TUTORIAL
    console.log("\n2. Testing Level 1 In-Game Interactive Tutorial:");
    run('gameState.completedTutorials = {}; gameState.currentPlayingLevel = 1;');
    run('initGrid()');
    run('setupLevelTutorial(1)');

    const handHint = document.getElementById('tutorial-hand-hint');
    const banner = document.getElementById('onboarding-tip-banner');
    const pulsedCells = document.querySelectorAll('.tutorial-pulse');

    if (!handHint) throw new Error("tutorial-hand-hint not found on board!");
    if (!banner) throw new Error("onboarding-tip-banner not found during Level 1 tutorial!");
    if (pulsedCells.length < 2) throw new Error("Target swap cells should have tutorial-pulse class!");

    console.log("PASS: Level 1 Interactive tutorial initialized with hand hint, glowing cells, and guidance banner!");
    console.log("Banner Text:", banner.textContent.trim());

    // Verify tutorial is NOT prematurely marked completed before making the move
    const compBefore = run('gameState.completedTutorials[1]');
    if (compBefore) throw new Error("completedTutorials[1] was prematurely marked as true before player move!");
    console.log("PASS: Tutorial remains active and uncompleted until player actually executes a swap!");

    // 3. TEST BOTTLENECK FIX (NO TypeError, GEMS EXPLODE AND REFILL 100% OF 64 CELLS)
    console.log("\n3. Testing Gem Explosion & Refill (Bottleneck Fix):");
    
    // Set up a match on row 7, cols 5, 6, 7 (exactly as in user screenshot)
    run(`
        gridData[7][5] = 'blue';
        gridData[7][6] = 'blue';
        gridData[7][7] = 'blue';
        gameMoves = 30;
        gameScore = 0;
    `);

    console.log("Triggering processMatchesWithExplosion for 3 matching blue gems on row 7...");
    let pops = 0;
    try {
        pops = run('processMatchesWithExplosion(1, true)');
    } catch(err) {
        throw new Error("processMatchesWithExplosion crashed with error: " + err.message);
    }

    console.log(`Exploded ${pops} gems! Score:`, run('gameScore'), "Moves:", run('gameMoves'));
    if (run('gameMoves') !== 29) throw new Error("Move count was not decremented to 29!");
    if (run('gameScore') <= 0) throw new Error("Score was not increased!");
    console.log("PASS: Match explosion executed with zero script errors (gauge null crash fixed)!");

    // Test applyGravityAndRefill
    console.log("Applying gravity and refilling board...");
    run('applyGravityAndRefill(1)');

    // Verify all 64 cells in gridData are non-null
    let nullCount = 0;
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const val = run(`gridData[${r}][${c}]`);
            if (val === null || val === undefined) {
                nullCount++;
            }
        }
    }

    console.log("Null cells in gridData after refill:", nullCount);
    if (nullCount > 0) {
        throw new Error(`Bottleneck detected: ${nullCount} cells in gridData are empty/null!`);
    }
    console.log("PASS: 100% of the 8x8 grid (all 64 cells) are completely filled with gems! No bottleneck!");

    // Verify no cells have exploding class lingering
    const lingeringExploding = document.querySelectorAll('.cell.exploding');
    if (lingeringExploding.length > 0) {
        throw new Error("Some cells still have .exploding class after refill!");
    }
    console.log("PASS: Zero lingering exploding animations on refilled cells!");

    // 4. TEST TUTORIAL COMPLETION ON SWAP
    console.log("\n4. Testing Tutorial Completion After Move:");
    run('executeSwap(3, 2, 3, 3)');
    const compAfter = run('gameState.completedTutorials[1]');
    if (!compAfter) throw new Error("Tutorial should be marked completed after executeSwap!");
    const handHintAfter = document.getElementById('tutorial-hand-hint');
    if (handHintAfter && handHintAfter.style.opacity !== '0') {
        throw new Error("tutorial-hand-hint should be dismissed after move!");
    }
    console.log("PASS: Hand hint dismissed and Level 1 tutorial marked complete upon player action!");

    console.log("\n=========================================================================");
    console.log("=== ALL ONBOARDING & BOTTLENECK TESTS PASSED WITH 100% SUCCESS! ===");
    console.log("=========================================================================");
    process.exit(0);
}

runTests().catch(err => {
    console.error("FAIL:", err);
    process.exit(1);
});

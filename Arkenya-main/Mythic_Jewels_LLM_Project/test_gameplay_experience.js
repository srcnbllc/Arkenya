const fs = require('fs');
const { JSDOM } = require('jsdom');

console.log("=== COMPREHENSIVE GAMEPLAY & USER EXPERIENCE TEST SUITE ===");

const htmlContent = fs.readFileSync('www/index.html', 'utf8');

const dom = new JSDOM(htmlContent, {
    url: "http://localhost",
    runScripts: "dangerously",
    resources: "usable",
    beforeParse(window) {
        window.AudioContext = class {
            constructor() { this.state = 'running'; this.currentTime = 0; this.destination = {}; }
            createOscillator() { 
                return { 
                    connect: () => {}, 
                    frequency: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} }, 
                    start: () => {}, 
                    stop: () => {} 
                }; 
            }
            createGain() { 
                return { 
                    connect: () => {}, 
                    gain: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} } 
                }; 
            }
            createBiquadFilter() { return { connect: () => {}, frequency: { setValueAtTime: () => {} } }; }
            resume() { return Promise.resolve(); }
        };
        window.webkitAudioContext = window.AudioContext;
        window.fetch = () => Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
    }
});

const { window } = dom;
const { document } = window;
const run = (code) => window.eval(code);

let totalAssertions = 0;
let passedAssertions = 0;

function assert(condition, message) {
    totalAssertions++;
    if (condition) {
        passedAssertions++;
        console.log(`  [PASS] ${message}`);
    } else {
        console.error(`  [FAIL] ${message}`);
        process.exitCode = 1;
    }
}

// -------------------------------------------------------------
// TEST 1: Default State Structure & XP Initialization
// -------------------------------------------------------------
console.log("\n--- TEST 1: Default State & XP Setup ---");
const state = run("gameState");
assert(state.playerLevel === 1, "Initial playerLevel is 1");
assert(state.xp === 0, "Initial XP is 0");
assert(state.maxXp === 500, "Initial maxXp is 500");
assert(state.dailyFreeSaveMeDate === null, "Initial dailyFreeSaveMeDate is null");

// -------------------------------------------------------------
// TEST 2: addXP(amount) and Level-Up Progression
// -------------------------------------------------------------
console.log("\n--- TEST 2: addXP Progression and Level-Up Rewards ---");
const initialGold = state.gold || 0;
const initialGems = state.gems || 0;
const initialZeus = (state.inventory && state.inventory.zeus) || 0;

// Add 300 XP (no level up)
let leveled = run("addXP(300)");
assert(!leveled, "300 XP added, no level up");
assert(run("gameState.xp") === 300, "XP is now 300");
assert(run("gameState.playerLevel") === 1, "Level is still 1");

// Add 250 XP (crosses 500 threshold -> Level 2, 50 XP remainder)
leveled = run("addXP(250)");
assert(leveled, "Crossed 500 XP threshold, leveledUp is true");
assert(run("gameState.playerLevel") === 2, "playerLevel is now 2");
assert(run("gameState.xp") === 50, "Remaining XP is 50");
assert(run("gameState.maxXp") === 1000, "New maxXp for Level 2 is 1,000 (2 * 500)");
assert(run("gameState.gems") === initialGems + 25, "Level-up awarded +25 Gems");
assert(run("gameState.gold") === initialGold + 250, "Level-up awarded +250 Gold");
assert(run("gameState.inventory.zeus") === initialZeus + 1, "Level-up awarded +1 Zeus Powerup");

// -------------------------------------------------------------
// TEST 3: updateMovesDisplay() and Clutch Pulse Warning
// -------------------------------------------------------------
console.log("\n--- TEST 3: Moves Display & Clutch Warning (.moves-clutch) ---");
run("gameMoves = 10; updateMovesDisplay();");
const movesEl = document.getElementById('game-moves');
assert(movesEl.textContent === '10' || movesEl.innerText === '10', "Moves element displays 10");
assert(!movesEl.classList.contains('moves-clutch'), "10 moves: no moves-clutch class");

run("gameMoves = 3; updateMovesDisplay();");
assert(movesEl.textContent === '3' || movesEl.innerText === '3', "Moves element displays 3");
assert(movesEl.classList.contains('moves-clutch'), "3 moves: moves-clutch class IS applied");

run("gameMoves = 1; updateMovesDisplay();");
assert(movesEl.classList.contains('moves-clutch'), "1 move: moves-clutch class remains applied");

// -------------------------------------------------------------
// TEST 4: Save-Me Modal Dynamic Options & Near-Miss
// -------------------------------------------------------------
console.log("\n--- TEST 4: Save-Me Modal Dynamic Rescue Options ---");
// Simulate near-miss (score 85% of target)
run("gameTarget = 10000; gameScore = 8800; prepareSaveMeModal(true);");
const msgEl = document.getElementById('save-me-status-msg');
assert(msgEl.innerHTML.includes('%88'), "Near-miss message reflects 88% target progress");

const btnFree = document.getElementById('btn-save-me-free');
assert(btnFree && btnFree.style.display !== 'none', "Daily Free Zeus Grace button is visible for first-time daily user");

// Test Claim Free Zeus Save-Me
run("claimFreeZeusSaveMe()");
assert(run("gameMoves") === 4, "Free Zeus Grace added +3 moves (was 1, now 4)");
const todayStr = new Date().toISOString().slice(0, 10);
assert(run("gameState.dailyFreeSaveMeDate") === todayStr, "dailyFreeSaveMeDate marked for today");

// Now check that free button is hidden on second near-miss today
run("prepareSaveMeModal(true)");
assert(btnFree.style.display === 'none', "Free Zeus Grace button is now hidden after usage");

// Test Gold Option (350 Gold)
run("gameState.gold = 500; saveGame();");
const btnGold = document.getElementById('btn-save-me-gold');
run("prepareSaveMeModal(true)");
assert(!btnGold.disabled, "Gold button is enabled when player has 500 gold (>= 350)");

const movesBeforeGold = run("gameMoves");
run("buyExtraMovesWithGold()");
assert(run("gameMoves") === movesBeforeGold + 5, "Gold rescue added +5 moves");
assert(run("gameState.gold") === 150, "Gold deducted by 350 (500 - 350 = 150)");

// Test Gems Option (20 Gems)
run("gameState.gems = 30; saveGame();");
const btnGems = document.getElementById('btn-save-me-gems');
run("prepareSaveMeModal(true)");
assert(!btnGems.disabled, "Gems button is enabled when player has 30 gems (>= 20)");

const movesBeforeGems = run("gameMoves");
run("buyExtraMovesWithGems()");
assert(run("gameMoves") === movesBeforeGems + 5, "Gems rescue added +5 moves");
assert(run("gameState.gems") === 10, "Gems deducted by 20 (30 - 20 = 10)");

// -------------------------------------------------------------
// TEST 5: 5-Level Milestone Chest Rewards in showVictory()
// -------------------------------------------------------------
console.log("\n--- TEST 5: 5-Level Milestone Chests & Victory XP Bar ---");
const milestones = run("MILESTONE_REWARDS");
assert(typeof milestones === 'object', "MILESTONE_REWARDS table exists");
assert(milestones[5] && milestones[10] && milestones[25] && milestones[50], "Key milestone brackets (5, 10, 25, 50) exist");

// Simulate completing Level 5 for the first time
run(`
    gameState.currentPlayingLevel = 5;
    gameState.completedLevels[5] = 0; // First time
    gameScore = 12000;
    gameTarget = 9800;
    movesLeftAtWin = 6;
    isLevelEnding = false;
    showVictory();
`);

const milestoneBox = document.getElementById('victory-milestone-box');
assert(milestoneBox && milestoneBox.style.display === 'block', "Level 5 Milestone Box is displayed in victory modal");
const milestoneTitle = document.getElementById('victory-milestone-title');
assert(milestoneTitle.innerText.includes('5. BÖLÜM'), "Milestone title mentions 5. BÖLÜM");

// Verify XP bar elements updated
const xpFill = document.getElementById('victory-xp-fill');
const xpLabel = document.getElementById('victory-xp-label');
assert(xpFill !== null && xpLabel && xpLabel.innerText.includes('XP'), "Victory XP fill and label exist and reflect progress");
const xpEarned = document.getElementById('victory-xp-earned');
assert(xpEarned && xpEarned.innerText.includes('XP'), "Victory XP earned text is displayed");

// -------------------------------------------------------------
// TEST 6: Audio & Cascade Flow
// -------------------------------------------------------------
console.log("\n--- TEST 6: Pentatonic Cascade Execution ---");
run("gameMoves = 2; triggerEndLevelCascade();");
assert(run("gameMoves") === 1, "triggerEndLevelCascade decremented gameMoves to 1 with musical tone");

// -------------------------------------------------------------
// TEST 7: Multi-File Synchronization Hash Check
// -------------------------------------------------------------
console.log("\n--- TEST 7: SHA-256 Synchronization Check ---");
const crypto = require('crypto');
const hash1 = crypto.createHash('sha256').update(fs.readFileSync('www/index.html')).digest('hex');
const hash2 = crypto.createHash('sha256').update(fs.readFileSync('index.html')).digest('hex');
const hash3 = crypto.createHash('sha256').update(fs.readFileSync('Arkenya_Playable_Demo.html')).digest('hex');
const hash4 = crypto.createHash('sha256').update(fs.readFileSync('android/app/src/main/assets/public/index.html')).digest('hex');

assert(hash1 === hash2, "www/index.html matches index.html");
assert(hash1 === hash3, "www/index.html matches Arkenya_Playable_Demo.html");
assert(hash1 === hash4, "www/index.html matches android native assets");

console.log(`\n=============================================================`);
console.log(`TEST SUMMARY: ${passedAssertions} / ${totalAssertions} assertions PASSED.`);
console.log(`=============================================================`);

if (passedAssertions === totalAssertions) {
    console.log(">>> ALL GAMEPLAY & UX TESTS PASSED SUCCESSFULLY! <<<");
    process.exit(0);
} else {
    process.exit(1);
}

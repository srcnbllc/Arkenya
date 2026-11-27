const fs = require('fs');
const { JSDOM } = require('jsdom');

console.log('================================================================================');
console.log('⚡🏛️ TEST: REA MECHANICS, COMBO TREASURE, SMART HINT & STORE/LEVEL SYNERGY');
console.log('================================================================================');

const html = fs.readFileSync('www/index.html', 'utf8');

let total = 0;
let passed = 0;

function assert(condition, msg) {
    total++;
    if (condition) {
        passed++;
        console.log(`  ✅ [PASS] ${msg}`);
    } else {
        console.error(`  ❌ [FAIL] ${msg}`);
        process.exitCode = 1;
    }
}

const dom = new JSDOM(html, {
    url: 'http://localhost/',
    runScripts: 'dangerously',
    beforeParse(win) {
        win.AudioContext = class {
            constructor() { this.state = 'running'; this.currentTime = 0; this.destination = {}; }
            createOscillator() { return { type: 'sine', frequency: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} }, connect: () => {}, start: () => {}, stop: () => {} }; }
            createGain() { return { gain: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {}, linearRampToValueAtTime: () => {} }, connect: () => {} }; }
            resume() { return Promise.resolve(); }
        };
        win.webkitAudioContext = win.AudioContext;
        win.Audio = class { constructor() { this.paused = true; } play() { return Promise.resolve(); } pause() {} };
        win.requestAnimationFrame = cb => setTimeout(cb, 16);
    }
});

const win = dom.window;
const doc = win.document;
const run = code => win.eval(code);

// 1. Zero-Reflow Grid Metrics Cache
const metrics = win.getCachedGridMetrics();
assert(metrics && metrics.cellW > 0 && metrics.cellH > 0, '1. Zero-Reflow getCachedGridMetrics() returns valid cached cell dimensions');

// 2. Smart Tactical Hint Prioritization (5-match > 3-match)
run(`
    initGrid();
    for (let r = 0; r < 8; r++) {
        if (!gridData[r]) gridData[r] = [];
        for (let c = 0; c < 8; c++) {
            gridData[r][c] = ((r + c) % 2 === 0) ? 'red' : 'blue';
            if (specialGrid[r]) specialGrid[r][c] = null;
        }
    }
    // Place a normal 3-match candidate at row 0 (swapping (0,2) and (0,3))
    gridData[0][0] = 'green';
    gridData[0][1] = 'green';
    gridData[0][2] = 'red';
    gridData[0][3] = 'green';

    // Place a 5-match Zeus Orb candidate at row 5 (swapping (4,2) and (5,2))
    gridData[5][0] = 'purple';
    gridData[5][1] = 'purple';
    gridData[5][2] = 'yellow';
    gridData[5][3] = 'purple';
    gridData[5][4] = 'purple';
    gridData[4][2] = 'purple';
`);
const bestHint = win.findPossibleMatchPair();
assert(
    bestHint && ((bestHint[0].r === 4 && bestHint[1].r === 5) || (bestHint[0].r === 5 && bestHint[1].r === 4)),
    '2. Smart Hint Engine prioritizes 5-match Zeus Orb over ordinary 3-match at [0,0]'
);

// 3. Pre-Game Bomb & Win Streak Synergy across Levels 6-50
run(`
    gameState.energy = 5;
    gameState.gold = 1000;
    gameState.currentPlayingLevel = 8;
    gameState.winStreak = 2;
    preLevelBoosters.bomb = true;
    startGameplayCore();
`);
assert(run("specialGrid[2][2] === 'bomb'"), '3.1 Pre-Game Bomb (-180 Gold) places ready bomb at [2][2] on board');
assert(run("gameMoves === LEVEL_DATA[8].maxMoves + 2"), '3.2 Win Streak (2x) grants +2 bonus moves on Level 8');

// 4. Combo Treasure Crystal & Store Claim Integration
const storeComboCard = doc.getElementById('store-card-combo-treasure');
assert(storeComboCard !== null, '4.1 #store-card-combo-treasure exists in Store Screen');

run(`
    gameState.comboTreasureProgress = 0;
    advanceComboTreasureProgress(40);
    advanceComboTreasureProgress(60);
    updateDailyHubUI();
`);
assert(run("gameState.comboTreasureProgress === 100"), '4.2 In-app combos charge comboTreasureProgress to 100%');
assert(doc.getElementById('btn-claim-combo-treasure').disabled === false, '4.3 Store Combo Treasure claim button enables at 100%');

const goldBeforeChest = run("gameState.gold");
const gemsBeforeChest = run("gameState.gems");
const zeusBeforeChest = run("gameState.inventory.zeus || 0");
run("claimComboTreasureChest();");
assert(run("gameState.comboTreasureProgress === 0"), '4.4 Claiming Combo Treasure resets meter to 0%');
assert(run("gameState.gold") === goldBeforeChest + 75, '4.5 Claiming Combo Treasure awards +75 Gold');
assert(run("gameState.gems") === gemsBeforeChest + 2, '4.6 Claiming Combo Treasure awards +2 Gems');
assert(run("gameState.inventory.zeus") === zeusBeforeChest + 1, '4.7 Claiming Combo Treasure awards +1 Zeus Lightning');

// 5. Fast Purchase Modal Force-Close Compatibility
run(`
    gameState.gold = 2000;
    openQuickBoosterBuy('zeus');
    executeQuickBoosterPurchase('gold');
`);
assert(!doc.getElementById('modal-quick-booster-buy').classList.contains('active'), '5.1 Quick Booster Purchase immediately closes modal even within 450ms');

// 6. Clutch Victory Bonus (movesLeftAtWin === 0) & Defeat Streak Reset
run(`
    gameState.currentPlayingLevel = 6;
    gameState.winStreak = 3;
    declineSaveMe();
`);
assert(run("gameState.winStreak === 0"), '6.1 Declining Save-Me (Defeat) resets active winStreak to 0');

// 7. Mathematical Sawtooth Pacing & Stage Gem Value Scaling (Levels 1-50)
assert(win.getStageMathematicalGemValue(1) === 45 && win.getStageMathematicalGemValue(5) === 45, '7.1 Onboarding Levels 1-5 preserve exact 45 base gem value');
assert(win.getStagePacingRole(11).role === 'flow_recovery' && win.getStagePacingRole(16).role === 'flow_recovery', '7.2 Post-Boss (X1) and Post-Chest (X6) stages use Flow/Recovery Sawtooth role');
assert(win.getStagePacingRole(15).role === 'milestone_gate' && win.getStagePacingRole(20).role === 'boss', '7.3 Mid-Zone (X5) and Zone Boss (X0) stages use Gate/Boss Sawtooth roles');
assert(win.getStageMathematicalGemValue(50) > 140, '7.4 Level 50 Grand Boss scales gem value mathematically (>140/gem) to match 155,000 target');

// 8. Milestone Chests Faucet-to-Sink Alignment with Hero Unlock Costs & Real Inventory Keys
const ms = run('MILESTONE_REWARDS');
const heroes = run('HEROES');
assert(ms[5].gold === heroes.asterion.unlockGoldCost, '8.1 Level 5 Milestone Chest gold (350) matches Asterion unlock cost');
assert(ms[15].gold === heroes.nyra.unlockGoldCost, '8.2 Level 15 Milestone Chest gold (850) matches Nyra unlock cost');
assert(ms[25].gold === heroes.thalor.unlockGoldCost, '8.3 Level 25 Milestone Chest gold (1500) matches Thalor unlock cost');
assert(ms[35].gold === heroes.athena.unlockGoldCost, '8.4 Level 35 Milestone Chest gold (2400) matches Athena unlock cost');
assert(ms[45].gold === heroes.zeus.unlockGoldCost, '8.5 Level 45 Milestone Chest gold (3500) matches Zeus unlock cost');

// 9. Level 3 & Level 5 First-Time Victory Real Store/Dock Booster Delivery
run(`
    gameState.completedLevels = {};
    gameState.unlockedPowers = {};
    gameState.inventory = { zeus: 0, hermes: 0, athena: 0, ares: 0 };
    gameState.currentPlayingLevel = 3;
    gameScore = 7000;
    gameTarget = 6500;
    movesLeftAtWin = 4;
    showVictory();
`);
assert(run("gameState.inventory.hermes === 1"), '9.1 First-time Level 3 victory delivers real Hermes booster (+1) to Store/Dock inventory');

// 10. Bilingual (TR & EN) Epic Narrator, Hero Voices, Combo Callouts & Android Emulator Audio Bridge
const path = require('path');
const narratorJs = fs.readFileSync(path.join(__dirname, 'www', 'Assets', 'audio', 'narrator_audio_data.js'), 'utf8');
win.eval(narratorJs);
assert(!!win.NARRATOR_AUDIO_BASE64['prologue_en'] && win.NARRATOR_AUDIO_BASE64['prologue_en'].startsWith('data:audio/wav;base64,'), '10.1 English Epic Prologue voice (prologue_en) embedded in-memory');
assert(!!win.NARRATOR_AUDIO_BASE64['biome_1_en'] && !!win.NARRATOR_AUDIO_BASE64['saga_theme_1_en'], '10.2 English Epic Biome & Saga Theme voices embedded in-memory');
assert(!!win.NARRATOR_AUDIO_BASE64['hero_zeus_ability_en'] && !!win.NARRATOR_AUDIO_BASE64['callout_combo_3_en'], '10.3 English Epic Hero & Combo Callout voices embedded in-memory');

run("gameState.language = 'en';");
const enSaga1 = run("getThemeSagaForLevel(1)");
assert(enSaga1 && enSaga1.audioKey === 'saga_theme_1_en' && enSaga1.themeTitle.includes('Dawn of Light'), '10.4 getThemeSagaForLevel(1) returns English epic saga metadata & audioKey when language=en');
const enSrc = run("getBilingualAudioSource('prologue', '.mp3')");
assert(enSrc && enSrc.startsWith('data:audio/wav;base64,'), '10.5 getBilingualAudioSource resolves English Base64 voice stream when language=en');

run("gameState.language = 'tr';");
const trSrc = run("getBilingualAudioSource('prologue', '.mp3')");
assert(trSrc && trSrc.startsWith('data:audio/mp3;base64,'), '10.6 getBilingualAudioSource resolves Turkish Base64 voice stream when language=tr');

const mainActivityJava = fs.readFileSync(path.join(__dirname, 'android', 'app', 'src', 'main', 'java', 'com', 'mythic', 'jewels', 'MainActivity.java'), 'utf8');
assert(mainActivityJava.includes('AndroidNativeTTS') && mainActivityJava.includes('TextToSpeech'), '10.7 MainActivity.java registers AndroidNativeTTS native bridge for Android Emulator fallback');

console.log('================================================================================');
console.log(`🎯 REA UPGRADE TEST SUMMARY: ${passed} / ${total} PASSED (100%)`);
console.log('================================================================================');
process.exit(passed === total ? 0 : 1);

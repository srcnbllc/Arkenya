const fs = require('fs');
const assert = require('assert');
const { JSDOM } = require('jsdom');

console.log("===================================================================");
console.log("🧪 ARKENYA: WEEKLY LEAGUE, RESPONSIVE MAP & 50-LEVEL THEME SUITE");
console.log("===================================================================");

const htmlContent = fs.readFileSync('www/index.html', 'utf8');

const dom = new JSDOM(htmlContent, {
    url: "http://localhost",
    runScripts: "dangerously",
    resources: "usable",
    beforeParse(window) {
        window.AudioContext = class {
            constructor() {
                this.state = 'running';
                this.currentTime = 0;
                this.destination = {};
            }
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
                    gain: {
                        value: 0.1,
                        setValueAtTime: () => {},
                        exponentialRampToValueAtTime: () => {},
                        linearRampToValueAtTime: () => {}
                    }
                };
            }
            createBiquadFilter() {
                return {
                    connect: () => {},
                    frequency: { setValueAtTime: () => {} }
                };
            }
            resume() { return Promise.resolve(); }
        };
        window.webkitAudioContext = window.AudioContext;
        window.fetch = () => Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
        window.innerWidth = 360;
        window.innerHeight = 740;
    }
});

const { window } = dom;
const { document } = window;
const run = (code) => window.eval(code);

async function runTestSuite() {
    // -------------------------------------------------------------
    // TEST 1: Weekly League Info & Rollover Verification
    // -------------------------------------------------------------
    console.log("\n[TEST 1] Verifying Weekly League Rollover Engine:");
    const weekInfo = run("getCurrentWeekInfo()");
    console.log(`  Current Week Key: ${weekInfo.key} | Days to Monday: ${weekInfo.daysLeft}`);
    assert(weekInfo.key && weekInfo.key.includes('-W'), "Valid ISO Week Key format (YYYY-Www)");
    assert(weekInfo.daysLeft >= 1 && weekInfo.daysLeft <= 7, "Valid days to next Monday");

    // Mock weekly rollover from previous week
    run(`
        gameState.unlockedLevel = 15; // Silver League
        gameState.totalScore = 45000;
        gameState.weeklyScore = 12000;
        gameState.gold = 500;
        gameState.gems = 20;
        gameState.activeWeekKey = '2026-W39'; // Previous week
        gameState.lastRecordedWeeklyRank = 2; // Finished 2nd in weekly league
        checkAndApplyWeeklyRollover();
    `);

    const weeklyScoreAfterRollover = run("gameState.weeklyScore");
    const activeWeekKeyAfterRollover = run("gameState.activeWeekKey");
    const goldAfterRollover = run("gameState.gold");
    const gemsAfterRollover = run("gameState.gems");
    const totalScoreAfterRollover = run("gameState.totalScore");

    console.log(`  After Rollover -> WeeklyScore: ${weeklyScoreAfterRollover}, ActiveWeekKey: ${activeWeekKeyAfterRollover}`);
    console.log(`  Rewards -> Gold: ${goldAfterRollover}, Gems: ${gemsAfterRollover}, TotalScore preserved: ${totalScoreAfterRollover}`);

    assert.strictEqual(weeklyScoreAfterRollover, 0, "Weekly score cleanly reset to 0 for new week");
    assert.strictEqual(activeWeekKeyAfterRollover, weekInfo.key, "Active week key updated to current week");
    assert(goldAfterRollover > 500, "Weekly top 3 reward gold credited");
    assert(gemsAfterRollover > 20, "Weekly top 3 reward gems credited");
    assert.strictEqual(totalScoreAfterRollover, 45000, "All-time totalScore safely preserved!");
    console.log("✅ PASS: Weekly league rollover and reset on Monday works flawlessly!");

    // -------------------------------------------------------------
    // TEST 2: Protected Weekly Score Accumulation (No Total Overwrite)
    // -------------------------------------------------------------
    console.log("\n[TEST 2] Verifying Score Sync Does NOT Overwrite Weekly Score:");
    run(`
        gameState.weeklyScore = 3500;
        gameState.totalScore = 60000;
        syncScoreToLeaderboard();
    `);
    const weeklyScoreAfterSync = run("gameState.weeklyScore");
    console.log(`  Weekly Score after sync: ${weeklyScoreAfterSync} (Total: ${run("gameState.totalScore")})`);
    assert.strictEqual(weeklyScoreAfterSync, 3500, "Weekly score remained 3500 and was NOT overwritten with 60000 total score!");
    console.log("✅ PASS: Weekly score accumulation is fully isolated from all-time total score!");

    // -------------------------------------------------------------
    // TEST 3: Responsive Map Node Coordinates & Viewport Bounds
    // -------------------------------------------------------------
    console.log("\n[TEST 3] Verifying Responsive Saga Map Node Bounds on 360px Mobile Screen:");
    run(`
        gameState.unlockedLevel = 50;
        openWorldMap();
    `);

    const container = document.getElementById('map-nodes-container');
    assert(container !== null, "map-nodes-container exists");
    assert.strictEqual(container.children.length, 50, "All 50 map nodes rendered");

    let minX = Infinity;
    let maxX = -Infinity;
    for (let i = 1; i <= 50; i++) {
        const node = document.getElementById(`map-node-${i}`);
        assert(node !== null, `Node ${i} exists`);
        const leftVal = parseInt(node.style.left);
        if (leftVal < minX) minX = leftVal;
        if (leftVal > maxX) maxX = leftVal;

        // Node center leftVal with translate(-50%, -50%):
        // On 360px screen, 48px node extends leftVal - 24 to leftVal + 24
        const nodeLeftEdge = leftVal - 24;
        const nodeRightEdge = leftVal + 24;

        assert(nodeLeftEdge >= 10, `Node ${i} left edge (${nodeLeftEdge}px) must be >= 10px inside screen`);
        assert(nodeRightEdge <= 350, `Node ${i} right edge (${nodeRightEdge}px) must be <= 350px inside screen`);
    }

    console.log(`  Map Nodes X range across 50 levels: ${minX}px to ${maxX}px (Safely bounded within 360px viewport!)`);
    console.log("✅ PASS: All 50 level stops fit comfortably within compact mobile screens with zero clipping!");

    // -------------------------------------------------------------
    // TEST 4: Comprehensive 50-Level Biome / Theme Progression
    // -------------------------------------------------------------
    console.log("\n[TEST 4] Verifying Dynamic Theme & Biome Changes Across 50 Levels:");
    const expectedBiomes = [
        { zone: 1, name: "Kristal Vadi", sampleLevel: 5, expectedBg: "Assets/Art/main_menu_clean_bg.jpg", bossLevel: 10, boss: "Hades'in Kapı Bekçisi" },
        { zone: 2, name: "Fırtına Kanyonu", sampleLevel: 15, expectedBg: "Assets/Art/zone2_poseidon_bg.jpg", bossLevel: 20, boss: "Poseidon'un Öfkesi" },
        { zone: 3, name: "Yeraltı Lav Mağarası", sampleLevel: 25, expectedBg: "Assets/Art/zone3_hades_bg.jpg", bossLevel: 30, boss: "Hades ve Kor Obsidyen" },
        { zone: 4, name: "Donmuş Titan Geçidi", sampleLevel: 35, expectedBg: "Assets/Art/zone2_athena_1789468777787.jpg", bossLevel: 40, boss: "Kronos'un Donmuş Gölgesi" },
        { zone: 5, name: "Olimpos İlahi Zirvesi", sampleLevel: 45, expectedBg: "Assets/Art/zone4_olympus_bg.jpg", bossLevel: 50, boss: "Büyük Olimpos Şampiyonu" }
    ];

    expectedBiomes.forEach(b => {
        run(`updateDynamicZoneBackground(${b.sampleLevel});`);
        const bodyBiome = document.body.getAttribute('data-biome');
        const gameplayScreen = document.getElementById('screen-gameplay');
        const bg = gameplayScreen.style.backgroundImage;

        assert.strictEqual(String(bodyBiome), String(b.zone), `Level ${b.sampleLevel} sets data-biome="${b.zone}"`);
        assert(bg.includes(b.expectedBg), `Level ${b.sampleLevel} sets background ${b.expectedBg}`);

        const biomeLore = run(`BIOME_LORE[${b.zone}]`);
        assert(biomeLore && biomeLore.name === b.name, `Biome ${b.zone} lore name is ${b.name}`);
        assert.strictEqual(biomeLore.bossLevel, b.bossLevel, `Biome ${b.zone} boss level is ${b.bossLevel}`);

        console.log(`  Zone ${b.zone} (${b.name}): Sample Lvl ${b.sampleLevel} -> data-biome=${bodyBiome}, Bg=${b.expectedBg}`);
    });

    // Test transition from Zone 1 to Zone 2 when passing level 10
    console.log("\n  Testing Zone Transition at Chapter Milestones:");
    run(`
        gameState.currentPlayingLevel = 10;
        updateDynamicZoneBackground(10);
    `);
    assert.strictEqual(document.body.getAttribute('data-biome'), '1', "Level 10 is Zone 1");

    run(`
        gameState.currentPlayingLevel = 11;
        updateDynamicZoneBackground(11);
    `);
    assert.strictEqual(document.body.getAttribute('data-biome'), '2', "Level 11 successfully transitions to Zone 2 (Fırtına Kanyonu)");

    run(`
        gameState.currentPlayingLevel = 21;
        updateDynamicZoneBackground(21);
    `);
    assert.strictEqual(document.body.getAttribute('data-biome'), '3', "Level 21 successfully transitions to Zone 3 (Yeraltı Lav Mağarası)");

    run(`
        gameState.currentPlayingLevel = 31;
        updateDynamicZoneBackground(31);
    `);
    assert.strictEqual(document.body.getAttribute('data-biome'), '4', "Level 31 successfully transitions to Zone 4 (Donmuş Titan Geçidi)");

    run(`
        gameState.currentPlayingLevel = 41;
        updateDynamicZoneBackground(41);
    `);
    assert.strictEqual(document.body.getAttribute('data-biome'), '5', "Level 41 successfully transitions to Zone 5 (Olimpos İlahi Zirvesi)");

    console.log("✅ PASS: All 5 chapter themes transition with distinct biomes, backgrounds, and boss battles!");

    // -------------------------------------------------------------
    // TEST 5: Seamless Next Level Transition (playNextLevelDirectly)
    // -------------------------------------------------------------
    console.log("\n[TEST 5] Verifying Seamless Level Transition & Flag Safety:");
    run(`
        gameState.currentPlayingLevel = 7;
        isCascading = true;
        isSwapping = true;
        isLevelEnding = true;
        playNextLevelDirectly();
    `);

    await new Promise(r => setTimeout(r, 650));

    const playingLvlAfterNext = run("gameState.currentPlayingLevel");
    const isCascadingAfterNext = run("isCascading");
    const isSwappingAfterNext = run("isSwapping");
    const isLevelEndingAfterNext = run("isLevelEnding");

    assert.strictEqual(playingLvlAfterNext, 8, "Current playing level incremented from 7 to 8");
    assert.strictEqual(isCascadingAfterNext, false, "Cascade flag cleanly cleared");
    assert.strictEqual(isSwappingAfterNext, false, "Swap flag cleanly cleared");
    assert.strictEqual(isLevelEndingAfterNext, false, "Level ending flag cleanly cleared");
    console.log("✅ PASS: Next level transition is fully disarmed of lockups and starts level 8 cleanly!");

    console.log("\n===================================================================");
    console.log("🏆 ALL WEEKLY LEAGUE, MAP BOUNDS & THEME PROGRESSION TESTS PASSED!");
    console.log("===================================================================");
}

runTestSuite().then(() => {
    process.exit(0);
}).catch(err => {
    console.error("Test Suite Failed:", err);
    process.exit(1);
});

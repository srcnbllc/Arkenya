const fs = require('fs');
const { JSDOM } = require('jsdom');

console.log('===================================================================');
console.log('🧪 TESTING REBALANCED DAILY QUESTS, ADS & IN-GAME BONUS SCORES');
console.log('===================================================================');

const html = fs.readFileSync('www/index.html', 'utf8');

const dom = new JSDOM(html, {
    url: 'http://localhost',
    runScripts: 'dangerously',
    beforeParse(win) {
        win.AudioContext = class {
            constructor() { this.state = 'running'; }
            createOscillator() { return { connect: () => {}, frequency: { setValueAtTime: () => {} }, start: () => {}, stop: () => {} }; }
            createGain() { return { connect: () => {}, gain: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} } }; }
        };
        win.requestAnimationFrame = (cb) => setTimeout(cb, 16);
    }
});

const { window } = dom;
const { document } = window;
const run = (code) => window.eval(code);

function assert(condition, message) {
    if (!condition) {
        console.error(`❌ FAIL: ${message}`);
        process.exit(1);
    }
    console.log(`✅ PASS: ${message}`);
}

async function runTestSuite() {
    // -------------------------------------------------------------
    // TEST 1: Daily Quests Reward Rebalance
    // -------------------------------------------------------------
    console.log('\n[TEST 1] Verifying Rebalanced Daily Quests Config:');
    const qConfig = run("DAILY_QUESTS_CONFIG");
    assert(qConfig.length === 3, "DAILY_QUESTS_CONFIG contains 3 core quests");

    assert(qConfig[0].reward.gold === 40 && qConfig[0].reward.energy === 1, `Quest 1 rewards 40 Gold + 1 Life: ${JSON.stringify(qConfig[0].reward)}`);
    assert(qConfig[1].reward.gold === 50 && qConfig[1].reward.items.zeus === 1, `Quest 2 rewards 50 Gold + 1 Zeus: ${JSON.stringify(qConfig[1].reward)}`);
    assert(qConfig[2].reward.gems === 2, `Quest 3 rewards 2 Gems: ${JSON.stringify(qConfig[2].reward)}`);

    // Test Master Chest
    run(`
        gameState.gold = 100;
        gameState.gems = 10;
        gameState.inventory = { zeus: 0, athena: 0, hermes: 0, ares: 0, energy: 0 };
        gameState.dailyHub = {
            questsDate: new Date().toDateString(),
            quests: {
                claimed: { q1: true, q2: true, q3: true, master: false }
            }
        };
        claimDailyMasterChest();
    `);
    assert(run("gameState.gold === 220"), `Master Chest added 120 Gold (100 -> 220): ${run("gameState.gold")}`);
    assert(run("gameState.gems === 13"), `Master Chest added 3 Gems (10 -> 13): ${run("gameState.gems")}`);
    assert(run("gameState.inventory.athena === 1"), `Master Chest added 1x Athena: ${run("gameState.inventory.athena")}`);

    // -------------------------------------------------------------
    // TEST 2: Free Daily Gift & Rewarded Ad Chest
    // -------------------------------------------------------------
    console.log('\n[TEST 2] Verifying Free Daily Gift & Ad Chest:');
    run(`
        gameState.gold = 500;
        gameState.energy = 3;
        gameState.dailyHub.freeGiftDate = null;
        claimStoreFreeGift();
    `);
    assert(run("gameState.gold === 540"), `Free Gift added 40 Gold (500 -> 540): ${run("gameState.gold")}`);
    assert(run("gameState.energy === 4"), `Free Gift added 1 Life (3 -> 4): ${run("gameState.energy")}`);

    run(`
        gameState.gold = 540;
        gameState.dailyHub.adChestCount = 0;
        window.AdGuard = {
            showRewardedAd: (title, onReward) => onReward()
        };
        claimStoreAdChest();
    `);
    assert(run("gameState.gold === 565"), `Ad Chest added 25 Gold (540 -> 565): ${run("gameState.gold")}`);

    // -------------------------------------------------------------
    // TEST 3: Rewarded Video for Free Life
    // -------------------------------------------------------------
    console.log('\n[TEST 3] Verifying Rewarded Video for Free Life:');
    run(`
        gameState.gold = 200;
        gameState.energy = 0;
        gameState.noAds = false;
        // Mock AdGuard
        window.AdGuard = {
            showRewardedAd: (title, onReward) => onReward()
        };
        watchAdForFreeLife();
    `);
    assert(run("gameState.energy === 1"), `Video ad granted 1 Life (0 -> 1): ${run("gameState.energy")}`);
    assert(run("gameState.gold === 215"), `Video ad granted modest 15 Gold (200 -> 215): ${run("gameState.gold")}`);

    // -------------------------------------------------------------
    // TEST 4: 7-Day Login Streak Economy
    // -------------------------------------------------------------
    console.log('\n[TEST 4] Verifying 7-Day Login Streak Rewards:');
    const dRewards = run("DAILY_REWARDS");
    assert(dRewards[0].gold === 40, `Day 1 login awards 40 Gold (was 300): ${dRewards[0].gold}`);
    assert(dRewards[1].gems === 2, `Day 2 login awards 2 Gems (was 10): ${dRewards[1].gems}`);
    assert(dRewards[2].gold === 60, `Day 3 login awards 60 Gold (was 500): ${dRewards[2].gold}`);
    assert(dRewards[3].gems === 3, `Day 4 login awards 3 Gems (was 20): ${dRewards[3].gems}`);
    assert(dRewards[4].gold === 80, `Day 5 login awards 80 Gold (was 750): ${dRewards[4].gold}`);
    assert(dRewards[5].gems === 4, `Day 6 login awards 4 Gems (was 30): ${dRewards[5].gems}`);
    assert(dRewards[6].gold === 150 && dRewards[6].gems === 6, `Day 7 login awards 150 Gold + 6 Gems (was 1500 + 50): ${dRewards[6].gold} Gold, ${dRewards[6].gems} Gems`);

    // -------------------------------------------------------------
    // TEST 5: In-game Bonus Scoring Anti-Inflation Check
    // -------------------------------------------------------------
    console.log('\n[TEST 5] Verifying In-Game Bonus Scoring Anti-Inflation:');
    run(`
        gameState.currentPlayingLevel = 5;
        gameState.playerHero = 'zeus';
        gameState.playerLevel = 1;
        gameScore = 0;
        gameGauge = 100;
        initGrid();
        useAbility();
    `);

    const scoreAfterHero = run("gameScore");
    console.log(`  Hero Ultimate Score Awarded: ${scoreAfterHero}`);
    assert(scoreAfterHero < 1500, `Hero Ultimate awards sensible score (< 1,500 pts vs previous 10,800+ explosion): ${scoreAfterHero}`);

    // Test Color Bomb score
    run(`
        gameScore = 0;
        const bPos = { r: 3, c: 3 };
        const oPos = { r: 3, c: 4 };
        triggerZeusWrathColorBomb(bPos, oPos, 'red');
    `);
    const scoreAfterBomb = run("gameScore");
    console.log(`  Color Bomb Score Awarded: ${scoreAfterBomb}`);
    assert(scoreAfterBomb < 2000, `Color bomb awards proportional score (< 2,000 pts vs previous 3,750+ inflation): ${scoreAfterBomb}`);

    console.log('\n===================================================================');
    console.log('🏆 ALL REBALANCED DAILY, AD & IN-GAME BONUS TESTS PASSED!');
    console.log('===================================================================');
}

runTestSuite()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error("Test Suite Unhandled Exception:", err);
        process.exit(1);
    });

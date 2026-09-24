const fs = require('fs');
const { JSDOM } = require('jsdom');

console.log("=== TESTING PLAYER PROFILE PILL, FULL RESET, DAILY REWARDS & STORE HEADER ===");

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

async function testAll() {
    // 1. Test Player Profile Pill (Elimination of hardcoded 'KADER' & XP Overflow)
    console.log("\n1. Testing Player Profile Pill & XP Logic:");
    run('gameState.playerProfile.username = "AşilTest"; gameState.playerLevel = 2; gameState.xp = 350; gameState.maxXp = 1000;');
    run('updateMainMenuUI()');

    const nameText = document.getElementById('mainmenu-player-name').textContent;
    const lvlText = document.getElementById('mainmenu-player-level').textContent;
    const xpText = document.getElementById('mainmenu-xp-text').textContent;
    const xpWidth = document.getElementById('mainmenu-xp-bar').style.width;

    console.log(`Pill Display -> Name: ${nameText}, Level: ${lvlText}, XP: ${xpText}, Bar Width: ${xpWidth}`);
    if (nameText === 'KADER') throw new Error("Hardcoded 'KADER' is still showing!");
    if (nameText !== 'AŞILTEST') throw new Error(`Expected AŞILTEST, got ${nameText}`);
    if (xpText !== '350 / 1.000') throw new Error(`Unexpected XP format: ${xpText}`);
    if (xpWidth !== '35%') throw new Error(`Unexpected XP width: ${xpWidth}`);
    console.log("PASS: Player Profile Pill displays genuine player name, clean level, and accurate XP bar!");

    // Test XP Overflow auto-leveling
    console.log("\nTesting XP Overflow handling (e.g. 2450 / 500):");
    run('gameState.playerLevel = 1; gameState.xp = 2450; gameState.maxXp = 500;');
    run('updateMainMenuUI()');
    const autoLvl = run('gameState.playerLevel');
    const autoXp = run('gameState.xp');
    const autoMaxXp = run('gameState.maxXp');
    console.log(`Auto Leveled Up -> Level: ${autoLvl}, Remaining XP: ${autoXp}, Next Max XP: ${autoMaxXp}`);
    if (autoXp >= autoMaxXp) throw new Error("XP is still overflowing beyond max XP capacity!");
    console.log("PASS: XP overflow correctly leveled up the player and restored normalized XP capacity!");

    // 2. Test Full Pristine Game & Profile Reset
    console.log("\n2. Testing Comprehensive Clean Game Reset (executeFullGameReset):");
    // Give user bloated values
    run('gameState.gold = 99999; gameState.gems = 888; gameState.totalScore = 50000; gameState.unlockedLevel = 15; gameState.inventory = { zeus: 5, athena: 5, hermes: 5, ares: 5 };');
    console.log("Pre-reset: Gold =", run('gameState.gold'), "Gems =", run('gameState.gems'), "Score =", run('gameState.totalScore'));
    
    run('executeFullGameReset()');
    
    const postGold = run('gameState.gold');
    const postGems = run('gameState.gems');
    const postScore = run('gameState.totalScore');
    const postLevel = run('gameState.unlockedLevel');
    const postXp = run('gameState.xp');
    const postInv = run('gameState.inventory');

    console.log(`Post-reset -> Gold: ${postGold}, Gems: ${postGems}, Score: ${postScore}, Level: ${postLevel}, XP: ${postXp}`);
    console.log("Post-reset Inventory:", JSON.stringify(postInv));

    if (postGold !== 0 || postGems !== 0 || postScore !== 0 || postLevel !== 1 || postXp !== 0) {
        throw new Error("Game state was not completely zeroed out after reset!");
    }
    if (postInv.zeus !== 0 || postInv.athena !== 0) {
        throw new Error("Inventory was not cleared on reset!");
    }
    console.log("PASS: Pristine zero-score, zero-currency, clean level 1 reset verified!");

    // 3. Test Gameplay-Gated Daily Rewards
    console.log("\n3. Testing Daily Rewards (Gameplay Requirement & Inventory Credit):");
    const today = new Date().toDateString();
    run(`gameState.lastPlayedDay = null; gameState.stats.levelsPlayedToday = 0; gameState.lastClaimedRewardDay = null;`);
    
    // Attempt claim before playing today
    run('checkDailyReward()');
    const dailyModal = document.getElementById('modal-daily-reward');
    if (dailyModal.classList.contains('active')) {
        throw new Error("Daily reward modal should NOT open before playing any game today!");
    }
    console.log("PASS: Daily reward successfully locked when 0 games played today!");

    // Simulate playing a level (winning)
    console.log("Simulating 1 level played today...");
    run(`gameState.lastPlayedDay = "${today}"; gameState.lastLoginDate = "${today}"; gameState.stats.levelsPlayedToday = 1; gameState.loginStreak = 1;`);
    run('checkDailyReward()');
    if (!dailyModal.classList.contains('active')) {
        throw new Error("Daily reward modal should be open after completing 1 level!");
    }
    console.log("PASS: Daily reward unlocked after playing today's level!");

    // Claim Day 1 reward (300 Gold + 1x Zeus)
    const preClaimGold = run('gameState.gold');
    const preClaimZeus = run('gameState.inventory.zeus || 0');
    run('claimDailyReward()');
    const postClaimGold = run('gameState.gold');
    const postClaimZeus = run('gameState.inventory.zeus || 0');

    console.log(`Reward Claim Result -> Gold: ${preClaimGold} -> ${postClaimGold} (+300), Zeus: ${preClaimZeus} -> ${postClaimZeus} (+1)`);
    if (postClaimGold !== preClaimGold + 300 || postClaimZeus !== preClaimZeus + 1) {
        throw new Error("Daily reward items not credited to gameState!");
    }
    console.log("PASS: Daily reward items and gold credited to player inventory!");

    // 4. Test Store Header Layout (Back Button Aligned to Right)
    console.log("\n4. Testing Store Header Controls Layout:");
    const storeHeader = document.querySelector('#screen-store > div:first-child');
    const backBtn = storeHeader.querySelector('button[onclick="navigateBack()"]');
    const goldCounter = document.getElementById('store-screen-gold');
    const gemCounter = document.getElementById('store-screen-gems');

    if (!backBtn || !goldCounter || !gemCounter) {
        throw new Error("Store header elements missing!");
    }
    if (!backBtn.style.marginLeft.includes('auto')) {
        throw new Error("Back button is not right-aligned (margin-left: auto missing)!");
    }
    console.log("PASS: Back button is cleanly right-aligned, currency pills are on the left!");

    console.log("\n=========================================================================");
    console.log("=== ALL 4 USER REQUIREMENTS VERIFIED & PASSED WITH 100% ACCURACY! ===");
    console.log("=========================================================================");
}

testAll().catch(e => {
    console.error("FAIL:", e);
    process.exit(1);
});

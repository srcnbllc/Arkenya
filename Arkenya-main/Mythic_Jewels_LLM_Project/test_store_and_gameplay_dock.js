const fs = require('fs');
const { JSDOM } = require('jsdom');

console.log("=== TESTING NEW STORE HIERARCHY, CURRENCY EXCHANGE & GAMEPLAY DOCK ===");

const htmlContent = fs.readFileSync('www/index.html', 'utf8');

const dom = new JSDOM(htmlContent, {
    url: "http://localhost",
    runScripts: "dangerously",
    resources: "usable",
    beforeParse(window) {
        window.AudioContext = class {
            constructor() { this.state = 'running'; }
            createOscillator() { return { connect: () => {}, frequency: { setValueAtTime: () => {} }, start: () => {}, stop: () => {} }; }
            createGain() { return { connect: () => {}, gain: { setValueAtTime: () => {} } }; }
        };
        window.fetch = globalThis.fetch;
    }
});

const { window } = dom;
const { document } = window;
const run = (code) => window.eval(code);

async function testAll() {
    // 1. Verify Store Header Hierarchy
    console.log("\n1. Verifying Two-Tier Store Header Hierarchy:");
    const sGold = document.getElementById('store-screen-gold');
    const sGems = document.getElementById('store-screen-gems');
    if (!sGold || !sGems) throw new Error("Store currency counters missing!");
    console.log("PASS: Two-tier Store Header verified with gold & gems indicators!");

    // 2. Test Currency Exchange (Gems -> Gold)
    console.log("\n2. Testing Gems to Gold Exchange:");
    run('gameState.gems = 50; gameState.gold = 100;');
    console.log("Initial: Gems = 50, Gold = 100");
    run('exchangeGemsForGold(10, 500)');
    const postGems = run('gameState.gems');
    const postGold = run('gameState.gold');
    console.log(`Result: Gems = ${postGems} (expected 40), Gold = ${postGold} (expected 600)`);
    if (postGems !== 40 || postGold !== 600) {
        throw new Error("Currency exchange math failed!");
    }
    console.log("PASS: 10 Gems converted to 500 Gold seamlessly!");

    // 3. Test Ad Bypass with No-Ads Pass
    console.log("\n3. Testing No-Ads Flow:");
    run('applyIAPBundle("no_ads")');
    if (!run('gameState.noAds')) throw new Error("gameState.noAds should be true!");
    run('window.rewardGiven = false;');
    run('window.AdGuard.showRewardedAd("Bonus", () => { window.rewardGiven = true; })');
    if (!run('window.rewardGiven')) throw new Error("Rewarded ad did not grant immediate reward with No-Ads pass!");
    console.log("PASS: No-Ads pass immediately bypasses ads and grants reward!");

    // 4. Verify Gameplay Screen Cleanliness (Hero summon bar removed)
    console.log("\n4. Verifying Gameplay Screen Cleanliness:");
    const oldSummonBar = document.querySelector('.gameplay-god-summons');
    const oldAbilityBar = document.querySelector('.gameplay-bottom');
    if (oldSummonBar) throw new Error("Old gameplay-god-summons bar still present!");
    if (oldAbilityBar) throw new Error("Old gameplay-bottom ability bar still present!");
    console.log("PASS: Locked hero buttons and Bull Rush bar are completely removed!");

    // 5. Test Bottom Left Level Badge & Bottom Right Booster Dock
    console.log("\n5. Testing New Gameplay Layout (Level Badge & Dynamic Booster Dock):");
    const levelBadgeCard = document.getElementById('gameplay-level-badge-card');
    const boosterDock = document.getElementById('gameplay-booster-vertical-dock');
    if (!levelBadgeCard) throw new Error("Level badge card missing in gameplay screen!");
    if (!boosterDock) throw new Error("Booster vertical dock missing in gameplay screen!");

    // Set level and inventory
    run('gameState.currentPlayingLevel = 3; gameState.inventory = { zeus: 2, athena: 1, hermes: 0 };');
    run('updateGameplayPowerups()');

    const badgeTitle = document.getElementById('gameplay-level-badge-title').innerText;
    const badgeNext = document.getElementById('gameplay-level-badge-next').innerText;
    console.log("Level Badge:", badgeTitle, "|", badgeNext);
    if (!badgeTitle.includes('3')) throw new Error("Level badge did not reflect level 3!");

    // Check rendered boosters in dock
    console.log("Booster dock children count:", boosterDock.children.length);
    if (boosterDock.children.length !== 2) {
        throw new Error(`Expected 2 active boosters (zeus:2, athena:1), got ${boosterDock.children.length}`);
    }
    console.log("PASS: Exactly 2 active boosters shown in right-side vertical dock!");

    // 6. Test Booster Depletion & Auto-Disappearing
    console.log("\n6. Testing Booster Depletion (Athena from 1 -> 0):");
    // Grid setup for game
    run('initGrid()');
    run('usePowerup("athena")'); // uses athena (1 -> 0)
    console.log("Remaining Athena count:", run('gameState.inventory.athena'));
    console.log("Booster dock children count after use:", boosterDock.children.length);
    if (boosterDock.children.length !== 1) {
        throw new Error(`Expected 1 booster remaining (zeus), got ${boosterDock.children.length}`);
    }
    console.log("PASS: Athena booster automatically disappeared from dock when count reached 0!");

    console.log("\n=======================================================");
    console.log("=== ALL STORE, CURRENCY & GAMEPLAY DOCK TESTS PASSED ===");
    console.log("=======================================================");
}

testAll().catch(e => {
    console.error("FAIL:", e);
    process.exit(1);
});

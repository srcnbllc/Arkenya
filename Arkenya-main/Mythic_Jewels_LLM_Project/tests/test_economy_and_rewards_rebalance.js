const fs = require('fs');
const { JSDOM } = require('jsdom');

console.log('=== TEST SUITE: ECONOMY REBALANCE, COMBO DROPS & REWARDED AD CHEST ===');

const html = fs.readFileSync('www/index.html', 'utf8');

const dom = new JSDOM(html, {
    runScripts: 'dangerously',
    resources: 'usable',
    url: 'http://localhost/'
});

const window = dom.window;
const document = window.document;

function assert(condition, message) {
    if (!condition) {
        console.error(`❌ ASSERTION FAILED: ${message}`);
        process.exit(1);
    } else {
        console.log(`✓ ${message}`);
    }
}

setTimeout(() => {
    try {
        const gameState = window.gameState;
        assert(gameState !== undefined, 'gameState exists on window');

        // 1. TEST: Automatic +2 Diamonds on Every Level Victory
        console.log('\n--- 1. Automatic +2 Diamonds on Level Completion ---');
        gameState.gems = 10;
        gameState.currentPlayingLevel = 3;
        window.gameScore = 5000;
        window.showVictory();
        assert(gameState.gems === 12, `Victory gave exactly +2 diamonds (Expected 12, got ${gameState.gems})`);

        // Second win on level 4
        gameState.currentPlayingLevel = 4;
        window.gameScore = 6000;
        window.showVictory();
        assert(gameState.gems === 14, `Subsequent victory gave exactly +2 diamonds (Expected 14, got ${gameState.gems})`);

        // 2. TEST: In-Match Surprise Combo Diamond Drop (Levels 5+)
        console.log('\n--- 2. In-Match Surprise Combo Diamond Drop ---');
        // Level < 5: Should not drop diamond
        gameState.currentPlayingLevel = 2;
        window.levelDiamondsDropped = 0;
        const gemsBeforeEarlyDrop = gameState.gems;
        for (let i = 0; i < 50; i++) {
            window.checkAndAwardComboDiamondDrop(4);
        }
        assert(gameState.gems === gemsBeforeEarlyDrop, 'Combo diamond does NOT drop before level 5');

        // Level >= 5: Drops diamond on 3-5 combo
        gameState.currentPlayingLevel = 6;
        window.levelDiamondsDropped = 0;
        // Mock Math.random to guarantee drop
        const origRandom = window.Math.random;
        window.Math.random = Math.random = () => 0.05; // Less than 0.15 threshold
        window.checkAndAwardComboDiamondDrop(3);
        assert(gameState.gems === gemsBeforeEarlyDrop + 1, 'Combo diamond dropped +1 diamond on 3x combo at level 6');
        assert(window.levelDiamondsDropped === 1, 'levelDiamondsDropped reached max 1 per match');

        // Second drop attempt in same level should be blocked
        window.checkAndAwardComboDiamondDrop(5);
        assert(gameState.gems === gemsBeforeEarlyDrop + 1, 'Only 1 combo diamond drop per match allowed');
        window.Math.random = Math.random = origRandom;

        // 3. TEST: In-Match Combo Joker Drop
        console.log('\n--- 3. In-Match Combo Joker Drop ---');
        window.levelJokersDropped = 0;
        gameState.inventory = gameState.inventory || {};
        const totalJokersBefore = (gameState.inventory.zeus || 0) + (gameState.inventory.athena || 0) + (gameState.inventory.hermes || 0) + (gameState.inventory.ares || 0);
        window.Math.random = Math.random = () => 0.1; // Guarantee drop
        window.checkAndAwardComboJokerDrop(3);
        const totalJokersAfter = (gameState.inventory.zeus || 0) + (gameState.inventory.athena || 0) + (gameState.inventory.hermes || 0) + (gameState.inventory.ares || 0);
        assert(totalJokersAfter === totalJokersBefore + 1, 'Combo joker drop rewarded +1 divine booster to inventory');
        window.Math.random = Math.random = origRandom;

        // 4. TEST: Daily Ad Chest 3-Ad Limit, 50 Gold Per Ad, Button Display
        console.log('\n--- 4. Daily Ad Chest 3-Ad Limit & 50 Gold Progression ---');
        window.ensureDailyHubData();
        gameState.dailyHub.adChestCount = 0;
        gameState.dailyHub.adChestDate = new Date().toDateString();
        gameState.hasPurchasedNoAds = true; // Instant VIP bypass
        gameState.gold = 1000;

        // State 0: 3/0
        window.updateDailyHubUI();
        const adBtnContainer = document.getElementById('store-ad-chest-btn-container');
        assert(adBtnContainer !== null, 'store-ad-chest-btn-container exists');
        assert(adBtnContainer.innerHTML.includes('(3/0)'), `Initial button reflects (3/0) format (got: ${adBtnContainer.innerHTML})`);

        // Claim 1: +50 Gold -> 3/1
        window.claimStoreAdChest();
        assert(gameState.gold === 1050, `1st ad rewarded +50 gold (got: ${gameState.gold})`);
        assert(gameState.dailyHub.adChestCount === 1, 'Ad chest count is 1');
        assert(adBtnContainer.innerHTML.includes('(3/1)'), `Button reflects (3/1) format (got: ${adBtnContainer.innerHTML})`);

        // Claim 2: +50 Gold -> 3/2
        window.claimStoreAdChest();
        assert(gameState.gold === 1100, `2nd ad rewarded +50 gold (got: ${gameState.gold})`);
        assert(gameState.dailyHub.adChestCount === 2, 'Ad chest count is 2');
        assert(adBtnContainer.innerHTML.includes('(3/2)'), `Button reflects (3/2) format (got: ${adBtnContainer.innerHTML})`);

        // Claim 3: +50 Gold -> 3/3 -> Disabled with 'Yarın Tekrar Deneyebilirsiniz'
        window.claimStoreAdChest();
        assert(gameState.gold === 1150, `3rd ad rewarded +50 gold (got: ${gameState.gold})`);
        assert(gameState.dailyHub.adChestCount === 3, 'Ad chest count is 3');
        assert(adBtnContainer.innerHTML.includes('disabled'), 'Button is disabled after 3/3 ads');
        assert(adBtnContainer.innerHTML.includes('3/3 - Yarın Tekrar Deneyebilirsiniz'), `Button shows '3/3 - Yarın Tekrar Deneyebilirsiniz' (got: ${adBtnContainer.innerHTML})`);

        // Claim 4: Blocked!
        window.claimStoreAdChest();
        assert(gameState.gold === 1150, '4th ad claim strictly blocked');
        assert(gameState.dailyHub.adChestCount === 3, 'Ad count remains 3');

        // 5. TEST: Store Economy Rebalance & Prevent Early Level 1 Buyout
        console.log('\n--- 5. Store Economy Rebalance ---');
        assert(window.BOOSTER_CONFIG.zeus.goldCost === 3500, `Zeus costs 3,500 gold (got: ${window.BOOSTER_CONFIG.zeus.goldCost})`);
        assert(window.BOOSTER_CONFIG.hermes.goldCost === 3000, `Hermes costs 3,000 gold (got: ${window.BOOSTER_CONFIG.hermes.goldCost})`);
        assert(window.BOOSTER_CONFIG.athena.goldCost === 4500, `Athena costs 4,500 gold (got: ${window.BOOSTER_CONFIG.athena.goldCost})`);
        assert(window.BOOSTER_CONFIG.ares.goldCost === 6000, `Ares costs 6,000 gold (got: ${window.BOOSTER_CONFIG.ares.goldCost})`);

        // Verify a fresh player with initial gold (~300) cannot buy any boosters in level 1
        gameState.gold = 300;
        const initialZeusInventory = (gameState.inventory && gameState.inventory.zeus) || 0;
        window.buyItem('zeus', 3500, 'gold');
        // Smart exchange modal opens, no item directly granted without exchange
        assert((gameState.inventory && gameState.inventory.zeus) === initialZeusInventory, 'Cannot buy 3,500 gold Zeus with 300 gold');

        console.log('\n>>> ALL REBALANCE, COMBO DROPS & AD REWARD TESTS PASSED PERFECTLY! <<<');
        process.exit(0);
    } catch(e) {
        console.error('Test execution failed:', e);
        process.exit(1);
    }
}, 400);

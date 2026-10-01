const fs = require('fs');
const { JSDOM } = require('jsdom');

console.log('=== TEST SUITE: STORE, MARKETPLACE & SMART EXCHANGE ===');

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

// Wait for initial DOM load
setTimeout(() => {
    try {
        const gameState = window.gameState;
        assert(gameState !== undefined, 'gameState exists on window');

        // Test 1: Verify Store Categories in DOM
        const storeScreen = document.getElementById('screen-store');
        assert(storeScreen !== null, 'screen-store exists');

        const smartExchangeModal = document.getElementById('modal-smart-exchange');
        assert(smartExchangeModal !== null, 'modal-smart-exchange exists');

        // Test 2: buyLivesWithGold with insufficient gold
        gameState.gold = 50; // Need 2500
        gameState.gems = 20;
        gameState.energy = 0;

        window.buyLivesWithGold(2500, 5);
        assert(smartExchangeModal.classList.contains('active'), 'modal-smart-exchange opened when gold is insufficient for lives');
        assert(window.pendingSmartAction !== null, 'pendingSmartAction is recorded');
        assert(window.pendingSmartAction.type === 'lives', 'pendingSmartAction type is lives');

        // Test 3: executeSmartExchangeAction for lives
        window.executeSmartExchangeAction();
        assert(!smartExchangeModal.classList.contains('active'), 'modal-smart-exchange closed after execution');
        assert(gameState.energy === 5, 'Energy replenished to 5 via smart exchange');
        assert(gameState.gems === 10, '10 gems deducted (20 - 10 = 10)');
        // 50 gold + 3000 reward - 2500 cost = 550 gold
        assert(gameState.gold === 550, `Gold balance correct after exchange and purchase (Expected 550, got ${gameState.gold})`);

        // Test 4: buyItem with insufficient gold
        gameState.gold = 100; // Zeus costs 3500
        gameState.gems = 50;
        window.buyItem('zeus', 3500, 'gold');
        assert(smartExchangeModal.classList.contains('active'), 'modal-smart-exchange opened when gold is insufficient for zeus');
        assert(window.pendingSmartAction.type === 'item', 'pendingSmartAction type is item');

        // Test 5: executeSmartExchangeAction for item
        const initialZeus = (gameState.inventory && gameState.inventory.zeus) || 0;
        window.executeSmartExchangeAction();
        assert((gameState.inventory && gameState.inventory.zeus) === initialZeus + 1, 'Zeus inventory incremented after smart exchange');

        // Test 6: In-game quick booster buy with insufficient gold
        gameState.gold = 50;
        gameState.gems = 50;
        window.openQuickBoosterBuy('hermes'); // Hermes costs 3000
        window.executeQuickBoosterPurchase('gold');
        assert(smartExchangeModal.classList.contains('active'), 'modal-smart-exchange opened from quick booster purchase');
        assert(window.pendingSmartAction.type === 'booster', 'pendingSmartAction type is booster');

        // Test 7: Direct Marketplace Exchange (Gems -> Gold)
        gameState.gems = 50;
        gameState.gold = 1000;
        window.exchangeGemsForGold(40, 15000);
        assert(gameState.gems === 10, 'Gems deducted correctly in direct exchange (50 - 40 = 10)');
        assert(gameState.gold === 16000, 'Gold credited correctly in direct exchange (1000 + 15000 = 16000)');

        // Test 8: IAP Bundle expansion
        window.applyIAPBundle('gems_sack');
        assert(gameState.gems === 660, `650 Gems added from gems_sack (10 + 650 = 660, got ${gameState.gems})`);
        assert(gameState.inventory.zeus >= 3, 'Zeus boosters awarded with gems_sack');

        window.applyIAPBundle('gems_hoard');
        assert(gameState.gems === 2160, `1500 Gems added from gems_hoard (660 + 1500 = 2160, got ${gameState.gems})`);

        // Test 9: No-Ads VIP Rewarded Bypass
        gameState.noAds = true;
        gameState.energy = 2;
        window.watchAdForLifeOrSpeedup();
        assert(gameState.energy === 3, 'VIP player receives instant life without waiting for video ad');

        console.log('\n>>> ALL 9 STORE, MARKETPLACE & SMART EXCHANGE TESTS PASSED! <<<');
        process.exit(0);
    } catch (err) {
        console.error('Test error:', err);
        process.exit(1);
    }
}, 500);

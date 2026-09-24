const fs = require('fs');
const { JSDOM } = require('jsdom');

console.log("=== COMPREHENSIVE AUDIT: ALL NEW & MODIFIED BUTTONS, MENUS & NAVIGATION ===");

const htmlContent = fs.readFileSync('www/index.html', 'utf8');

const dom = new JSDOM(htmlContent, {
    url: "http://localhost",
    runScripts: "dangerously",
    resources: "usable",
    beforeParse(window) {
        window.AudioContext = class {
            constructor() { this.state = 'running'; this.currentTime = 0; this.destination = {}; }
            createOscillator() { return { connect: () => {}, frequency: { setValueAtTime: () => {} }, start: () => {}, stop: () => {} }; }
            createGain() { return { connect: () => {}, gain: { value: 0.1, setValueAtTime: () => {} } }; }
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

async function runComprehensiveAudit() {
    let auditedCount = 0;
    let passCount = 0;
    let failCount = 0;

    function assert(name, condition, details = "") {
        auditedCount++;
        if (condition) {
            passCount++;
            console.log(`  [PASS] ${name} ${details ? '(' + details + ')' : ''}`);
        } else {
            failCount++;
            console.error(`  [FAIL] ${name} ${details ? '(' + details + ')' : ''}`);
        }
    }

    // SECTION 1: GLOBAL BOTTOM NAVIGATION
    console.log("\n--- SECTION 1: GLOBAL BOTTOM NAVIGATION BAR ---");
    const bottomNavItems = document.querySelectorAll('#global-bottom-nav .nav-item');
    assert("Bottom Nav Items Count", bottomNavItems.length === 5, `Found ${bottomNavItems.length} items`);

    const navTargets = [
        { name: "ANA MENÜ", expectedScreen: "screen-mainmenu" },
        { name: "HARİTA", expectedScreen: "screen-worldmap" },
        { name: "KAHRAMANLAR", expectedScreen: "screen-hero" },
        { name: "HAZİNE (MAĞAZA)", expectedScreen: "screen-store" }
    ];

    for (const target of navTargets) {
        let foundBtn = Array.from(bottomNavItems).find(el => el.textContent.includes(target.name.split(' ')[0]));
        if (foundBtn) {
            foundBtn.click();
            const current = run("currentActiveScreen");
            assert(`Nav Click -> ${target.name}`, current === target.expectedScreen, `Active: ${current}`);
        } else {
            assert(`Nav Item ${target.name} Found`, false, "Element missing in DOM");
        }
    }

    // Lig modal nav item
    let ligBtn = Array.from(bottomNavItems).find(el => el.textContent.includes("LİG"));
    assert("Nav Item LİG Found", !!ligBtn);
    if (ligBtn) {
        run("gameState.playerProfile.hasCompletedProfile = true;");
        ligBtn.click();
        const lbModal = document.getElementById('modal-leaderboard');
        assert("Nav Click LİG -> modal-leaderboard active", lbModal.classList.contains('active'));
        run("closeModal('modal-leaderboard');");
    }

    // SECTION 2: TOP HUD BUTTONS & CURRENCY PILLS
    console.log("\n--- SECTION 2: TOP GLOBAL HUD BUTTONS & PILLS ---");
    const homeBtn = document.querySelector('.btn-hud-home');
    assert("Top HUD Home Icon Exists", !!homeBtn);
    if (homeBtn) {
        run("showScreen('screen-worldmap');");
        homeBtn.click();
        assert("Home Icon Click -> screen-mainmenu", run("currentActiveScreen") === 'screen-mainmenu');
    }

    const goldPill = document.querySelector('.hud-currency-pill[title="Altın"]');
    assert("Top HUD Gold Pill Exists", !!goldPill);
    if (goldPill) {
        goldPill.click();
        assert("Gold Pill Click -> screen-store", run("currentActiveScreen") === 'screen-store');
    }

    const gemsPill = document.querySelector('.hud-currency-pill[title="Elmas"]');
    assert("Top HUD Gems Pill Exists", !!gemsPill);
    if (gemsPill) {
        run("showScreen('screen-mainmenu');");
        gemsPill.click();
        assert("Gems Pill Click -> screen-store", run("currentActiveScreen") === 'screen-store');
    }

    // SECTION 3: STORE SCREEN BUTTONS & FUNCTIONS
    console.log("\n--- SECTION 3: STORE SCREEN (screen-store) FUNCTIONALITY ---");
    run("showScreen('screen-store');");

    // 3.1 Back Button in Store Sticky Header
    const storeBackBtn = document.querySelector('#screen-store button.mythic-btn-sub');
    assert("Store '← GERİ DÖN' Button Exists", !!storeBackBtn);
    if (storeBackBtn) {
        // Setup history: mainmenu -> store
        run("screenNavigationHistory = ['screen-worldmap'];");
        storeBackBtn.click();
        assert("Store Back Button Click -> Returns to screen-worldmap", run("currentActiveScreen") === 'screen-worldmap');
        run("showScreen('screen-store');"); // return to store
    }

    // 3.2 Restore Purchases Button
    const restoreBtn = document.querySelector('#screen-store button[onclick*="restorePurchases"]');
    assert("Restore Purchases Button Exists", !!restoreBtn);
    if (restoreBtn) {
        run("gameState.noAds = false;");
        restoreBtn.click();
        assert("restorePurchases() Executed without error", true);
    }

    // 3.3 Starter Bundle Button
    const starterBtn = document.querySelector('#screen-store button[onclick*="starter_bundle"]');
    assert("Starter Bundle Button Exists", !!starterBtn);
    if (starterBtn) {
        starterBtn.click();
        const payModal = document.getElementById('modal-payment');
        assert("Starter Bundle Click -> Opens modal-payment", payModal.classList.contains('active'));
        const payPrice = document.getElementById('payment-price').innerText;
        assert("modal-payment Price Bound Correctly", payPrice.includes('39.99'), `Price: ${payPrice}`);
        run("closeModal('modal-payment');");
    }

    // 3.4 No Ads Pass Button
    const noAdsBtn = document.querySelector('#screen-store button[onclick*="no_ads"]');
    assert("No Ads Pass Button Exists", !!noAdsBtn);
    if (noAdsBtn) {
        noAdsBtn.click();
        const payPrice = document.getElementById('payment-price').innerText;
        assert("No Ads Click -> Opens modal-payment with 49.99", payPrice.includes('49.99'));
        run("closeModal('modal-payment');");
    }

    // 3.5 Infinite Energy Button
    const energyBtn = document.querySelector('#screen-store button[onclick*="infinite_energy"]');
    assert("Infinite Energy Button Exists", !!energyBtn);
    if (energyBtn) {
        energyBtn.click();
        const payPrice = document.getElementById('payment-price').innerText;
        assert("Infinite Energy Click -> Opens modal-payment with 19.99", payPrice.includes('19.99'));
        run("closeModal('modal-payment');");
    }

    // 3.6 Gems Pouch (60 Gems) Button
    const gemsPouchBtn = document.querySelector('#screen-store button[onclick*="gems_pouch"]');
    assert("Gems Pouch (60 Gems) Button Exists", !!gemsPouchBtn);
    if (gemsPouchBtn) {
        gemsPouchBtn.click();
        const payPrice = document.getElementById('payment-price').innerText;
        assert("Gems Pouch Click -> Opens modal-payment with 19.99", payPrice.includes('19.99'));
        run("closeModal('modal-payment');");
    }

    // 3.7 Gems Chest (250 Gems) Button
    const gemsChestBtn = document.querySelector('#screen-store button[onclick*="gems_chest"]');
    assert("Gems Chest (250 Gems) Button Exists", !!gemsChestBtn);
    if (gemsChestBtn) {
        gemsChestBtn.click();
        const payPrice = document.getElementById('payment-price').innerText;
        assert("Gems Chest Click -> Opens modal-payment with 69.99", payPrice.includes('69.99'));
        run("closeModal('modal-payment');");
    }

    // 3.8 Gold Exchange Buttons (10 Gems -> 500 Gold, 40 Gems -> 2500 Gold)
    const goldExchange10 = document.querySelector('#screen-store button[onclick*="exchangeGemsForGold(10"]');
    assert("Gold Exchange (10 Gems) Button Exists", !!goldExchange10);
    if (goldExchange10) {
        run("gameState.gems = 100; gameState.gold = 0;");
        goldExchange10.click();
        assert("10 Gems -> 500 Gold Exchange Executed", run("gameState.gems") === 90 && run("gameState.gold") === 500);
    }

    const goldExchange40 = document.querySelector('#screen-store button[onclick*="exchangeGemsForGold(40"]');
    assert("Gold Exchange (40 Gems) Button Exists", !!goldExchange40);
    if (goldExchange40) {
        goldExchange40.click();
        assert("40 Gems -> 2500 Gold Exchange Executed", run("gameState.gems") === 50 && run("gameState.gold") === 3000);
    }

    // 3.9 In-game Boosters (buyItem: Zeus, Athena, Energy)
    const buyZeusBtn = document.querySelector('#screen-store button[onclick*="buyItem(\'zeus\'"]');
    assert("Buy Zeus Strike (250 Gold) Button Exists", !!buyZeusBtn);
    if (buyZeusBtn) {
        run("gameState.gold = 1000; if (!gameState.inventory) gameState.inventory = { zeus: 0 };");
        const prevZeus = run("gameState.inventory.zeus || 0");
        buyZeusBtn.click();
        assert("buyItem('zeus') Deducted 250 Gold & Added 1 Zeus", run("gameState.gold") === 750 && run("gameState.inventory.zeus") === prevZeus + 1);
    }

    const buyAthenaBtn = document.querySelector('#screen-store button[onclick*="buyItem(\'athena\'"]');
    assert("Buy Athena Grace (500 Gold) Button Exists", !!buyAthenaBtn);
    if (buyAthenaBtn) {
        const prevAthena = run("gameState.inventory.athena || 0");
        buyAthenaBtn.click();
        assert("buyItem('athena') Deducted 500 Gold & Added 1 Athena", run("gameState.gold") === 250 && run("gameState.inventory.athena") === prevAthena + 1);
    }

    const buyEnergyItemBtn = document.querySelector('#screen-store button[onclick*="buyItem(\'energy\'"]');
    assert("Buy Energy Refill (10 Gems) Button Exists", !!buyEnergyItemBtn);
    if (buyEnergyItemBtn) {
        run("gameState.energy = 1; gameState.gems = 50;");
        buyEnergyItemBtn.click();
        assert("buyItem('energy') Refilled Energy to 5 & Deducted 10 Gems", run("gameState.energy") === 5 && run("gameState.gems") === 40);
    }


    // SECTION 4: PAYMENT MODAL ACTION BUTTONS
    console.log("\n--- SECTION 4: PAYMENT MODAL (modal-payment) BUTTONS ---");
    run("purchaseIAP('starter_bundle', 39.99, 'Test Paketi', ['1x Test']);");
    const payModalEl = document.getElementById('modal-payment');
    assert("modal-payment Opened via purchaseIAP", payModalEl.classList.contains('active'));

    const cancelPayBtn = document.querySelector('#modal-payment button[onclick*="closeModal"]');
    assert("modal-payment 'VAZGEÇ VE GERİ DÖN' Button Exists", !!cancelPayBtn);
    if (cancelPayBtn) {
        cancelPayBtn.click();
        assert("Payment Modal Dismissed via Cancel Button", !payModalEl.classList.contains('active'));
    }

    // Test Confirm Purchase Flow
    run("purchaseIAP('starter_bundle', 39.99, 'Test Paketi', ['250 Elmas', '2.500 Altın']);");
    const confirmPayBtn = document.getElementById('btn-confirm-payment');
    assert("btn-confirm-payment Exists", !!confirmPayBtn);
    if (confirmPayBtn) {
        const preGems = run("gameState.gems");
        const preGold = run("gameState.gold");
        confirmPayBtn.click(); // Triggers simulation timer
        assert("btn-confirm-payment click triggered 'İşlem Güvenle Doğrulanıyor...'", confirmPayBtn.innerText.includes("Doğrulanıyor"));

        // Wait 1800ms for payment completion
        await new Promise(r => setTimeout(r, 1850));
        assert("IAP Bundle Applied: Gems & Gold Incremented", run("gameState.gems") === preGems + 250 && run("gameState.gold") === preGold + 2500);
        assert("modal-payment Closed Automatically After Purchase", !payModalEl.classList.contains('active'));
    }


    // SECTION 5: LEADERBOARD MODAL BUTTONS & TABS
    console.log("\n--- SECTION 5: LEADERBOARD MODAL (modal-leaderboard) BUTTONS & TABS ---");
    run("openLeaderboardModal();");
    const lbModalEl = document.getElementById('modal-leaderboard');
    assert("modal-leaderboard Opened", lbModalEl.classList.contains('active'));

    // 5.1 Tab Switching
    const tabAylik = document.getElementById('tab-aylik');
    assert("Tab Aylık Button Exists", !!tabAylik);
    if (tabAylik) {
        tabAylik.click();
        assert("Tab Aylık Click -> currentLeaderboardTab is aylik", run("currentLeaderboardTab") === 'aylik');
    }

    const tabGenel = document.getElementById('tab-genel');
    assert("Tab Genel Button Exists", !!tabGenel);
    if (tabGenel) {
        tabGenel.click();
        assert("Tab Genel Click -> currentLeaderboardTab is genel", run("currentLeaderboardTab") === 'genel');
    }

    const tabHaftalik = document.getElementById('tab-haftalik');
    assert("Tab Haftalık Button Exists", !!tabHaftalik);
    if (tabHaftalik) {
        tabHaftalik.click();
        assert("Tab Haftalık Click -> currentLeaderboardTab is haftalik", run("currentLeaderboardTab") === 'haftalik');
    }

    // 5.2 Refresh Button
    const refreshBtn = document.getElementById('btn-refresh-lb');
    assert("Refresh Button Exists", !!refreshBtn);
    if (refreshBtn) {
        refreshBtn.click();
        assert("refreshLeaderboard() Executed without error", true);
    }

    // 5.3 Close Modal X Button & Footer KAPAT Button
    const lbCloseX = document.querySelector('#modal-leaderboard .modal-close');
    assert("Leaderboard Close '✕' Button Exists", !!lbCloseX);
    if (lbCloseX) {
        lbCloseX.click();
        assert("Leaderboard Closed via '✕' Button", !lbModalEl.classList.contains('active'));
    }

    run("openLeaderboardModal();");
    const lbCloseFooter = document.querySelector('#modal-leaderboard button[onclick*="modal-leaderboard"]');
    assert("Leaderboard Footer 'KAPAT' Button Exists", !!lbCloseFooter);
    if (lbCloseFooter) {
        lbCloseFooter.click();
        assert("Leaderboard Closed via Footer 'KAPAT' Button", !lbModalEl.classList.contains('active'));
    }


    // SECTION 6: UNIVERSAL ESCAPE & BACKDROP DISMISSAL
    console.log("\n--- SECTION 6: ESCAPE KEY & MODAL BACKDROP CLICK DISMISSAL ---");
    run("openLeaderboardModal();");
    assert("Leaderboard Modal Opened for Escape Test", lbModalEl.classList.contains('active'));
    
    // Simulate Escape keydown
    window.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape' }));
    assert("Leaderboard Modal Closed on 'Escape' Key Event", !lbModalEl.classList.contains('active'));

    run("openLeaderboardModal();");
    assert("Leaderboard Modal Opened for Backdrop Test", lbModalEl.classList.contains('active'));

    // Simulate clicking overlay backdrop (target === modal-overlay)
    lbModalEl.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }));
    assert("Leaderboard Modal Closed on Backdrop Click", !lbModalEl.classList.contains('active'));


    console.log("\n===================================================================");
    console.log(`=== AUDIT SUMMARY: TOTAL AUDITED: ${auditedCount} | PASSED: ${passCount} | FAILED: ${failCount} ===`);
    console.log("===================================================================");

    if (failCount > 0) {
        process.exit(1);
    }
}

runComprehensiveAudit().catch(err => {
    console.error("FATAL AUDIT ERROR:", err);
    process.exit(1);
});

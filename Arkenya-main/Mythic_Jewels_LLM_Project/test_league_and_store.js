const fs = require('fs');
const { JSDOM } = require('jsdom');

console.log("=== RUNNING TEST: TIERED LEAGUE, STORE & USER-CENTRIC REVERSIBILITY ===");

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

async function testLeagueAndStore() {
    // 1. Test Navigation Stack & Reversibility
    console.log("\n1. Testing Navigation Stack & Reversibility (Geri Dönülebilirlik):");
    run("showScreen('screen-mainmenu');");
    console.log("  Initial Screen:", run("currentActiveScreen"));

    run("openWorldMap();");
    console.log("  Navigated to:", run("currentActiveScreen"));
    if (run("currentActiveScreen") !== 'screen-worldmap') throw new Error("Failed to open world map!");

    run("openStoreScreen();");
    console.log("  Navigated to Store:", run("currentActiveScreen"));
    if (run("currentActiveScreen") !== 'screen-store') throw new Error("Failed to open store!");

    // Back to World Map
    run("navigateBack();");
    console.log("  After Back 1 (Expected screen-worldmap):", run("currentActiveScreen"));
    if (run("currentActiveScreen") !== 'screen-worldmap') throw new Error("navigateBack did not return to screen-worldmap!");

    // Back to Main Menu
    run("navigateBack();");
    console.log("  After Back 2 (Expected screen-mainmenu):", run("currentActiveScreen"));
    if (run("currentActiveScreen") !== 'screen-mainmenu') throw new Error("navigateBack did not return to screen-mainmenu!");

    console.log("PASS: Reversible screen navigation verified!");

    // 2. Test Modal Reversibility
    console.log("\n2. Testing Modal Reversibility via navigateBack & Profile Guard:");
    // Fresh player without profile setup -> should open profile modal first
    run("openLeaderboardModal();");
    const profileModal = document.getElementById('modal-profile-setup');
    if (!profileModal.classList.contains('active')) throw new Error("Profile guard modal did not open for new player!");
    console.log("  Profile guard modal opened for new player: true");
    run("navigateBack();");
    if (profileModal.classList.contains('active')) throw new Error("Profile modal did not close via navigateBack!");
    console.log("  Profile guard modal closed via navigateBack: true");

    // Complete profile and open leaderboard
    run("gameState.playerProfile.hasCompletedProfile = true;");
    run("openLeaderboardModal();");
    const lbModal = document.getElementById('modal-leaderboard');
    if (!lbModal.classList.contains('active')) throw new Error("Leaderboard modal did not open after profile completed!");
    console.log("  Leaderboard modal is active: true");

    run("navigateBack();");
    if (lbModal.classList.contains('active')) throw new Error("Leaderboard modal did not close via navigateBack!");
    console.log("  Leaderboard modal closed via navigateBack: true");
    console.log("PASS: Modal reversibility verified!");

    // 3. Test Tiered League System & Realistic Scales
    console.log("\n3. Testing 5-Tier Olympus Leagues (Realistic & Thematic):");
    const leagues = run("OLYMPUS_LEAGUES");
    if (!leagues || leagues.length !== 5) throw new Error("Expected 5 Olympus leagues!");
    console.log("  Leagues loaded:", leagues.map(l => l.name).join(", "));

    const l1 = run("getCurrentPlayerLeague(1)");
    const l15 = run("getCurrentPlayerLeague(15)");
    const l25 = run("getCurrentPlayerLeague(25)");
    const l40 = run("getCurrentPlayerLeague(40)");
    const l50 = run("getCurrentPlayerLeague(50)");

    console.log("  Level 1 League:", l1.name, "(Icon:", l1.icon, ")");
    console.log("  Level 15 League:", l15.name, "(Icon:", l15.icon, ")");
    console.log("  Level 25 League:", l25.name, "(Icon:", l25.icon, ")");
    console.log("  Level 40 League:", l40.name, "(Icon:", l40.icon, ")");
    console.log("  Level 50 League:", l50.name, "(Icon:", l50.icon, ")");

    if (l1.id !== 'bronze' || l15.id !== 'silver' || l25.id !== 'gold' || l40.id !== 'diamond' || l50.id !== 'olympus') {
        throw new Error("League tier resolution mismatch!");
    }

    // Check loadLeaderboard realistic scores
    run("gameState.unlockedLevel = 1;");
    await run("loadLeaderboard('haftalik');");
    const listEl = document.getElementById('leaderboard-list');
    if (!listEl || !listEl.innerHTML.includes('TERFİ 🟢')) {
        throw new Error("Promotion zone tag not rendered in leaderboard!");
    }
    console.log("  Verified promotion zone tag 🟢 in leaderboard list!");
    console.log("PASS: Tiered League System verified!");

    // 4. Test Store & Payment Confirmation Flow
    console.log("\n4. Testing Thematic Store & Payment Flow:");
    run("openStoreScreen();");
    const initialGems = run("gameState.gems");
    const initialGold = run("gameState.gold");

    console.log(`  Initial Balance: ${initialGold} Gold, ${initialGems} Gems`);

    // Simulate buying starter_bundle
    run("applyIAPBundle('starter_bundle');");
    const afterIAPGems = run("gameState.gems");
    const afterIAPGold = run("gameState.gold");
    console.log(`  Balance after Starter Bundle: ${afterIAPGold} Gold, ${afterIAPGems} Gems`);

    if (afterIAPGems !== initialGems + 250 || afterIAPGold !== initialGold + 2500) {
        throw new Error("Starter bundle did not award correct balanced amounts!");
    }

    // Test exchanging gems for gold
    run("exchangeGemsForGold(10, 500);");
    const afterExchangeGems = run("gameState.gems");
    const afterExchangeGold = run("gameState.gold");
    console.log(`  Balance after Exchange: ${afterExchangeGold} Gold, ${afterExchangeGems} Gems`);

    if (afterExchangeGems !== afterIAPGems - 10 || afterExchangeGold !== afterIAPGold + 500) {
        throw new Error("Gem exchange for gold calculation error!");
    }

    // Test HUD Synchronization
    const hudGoldText = document.getElementById('hud-gold').innerText;
    const storeGoldText = document.getElementById('store-screen-gold').innerText;
    console.log("  HUD Gold:", hudGoldText, "| Store Gold:", storeGoldText);

    if (run("gameState.gold") !== 3000 || !storeGoldText.includes('3') || !hudGoldText.includes('3')) {
        throw new Error("HUD Gold and Store Gold are out of sync!");
    }
    console.log("PASS: Universal HUD Synchronization verified!");

    console.log("\n===================================================================");
    console.log("=== ALL LEAGUE, STORE & REVERSIBILITY TESTS PASSED! ===");
    console.log("===================================================================");
}

testLeagueAndStore().catch(err => {
    console.error("TEST FAILED:", err);
    process.exit(1);
});

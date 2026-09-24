const fs = require('fs');
const { JSDOM } = require('jsdom');

console.log("=== TEST: MAIN MENU REFERENCE DESIGN & FUNCTIONAL AUDIT ===");

const html = fs.readFileSync('www/index.html', 'utf8');

let total = 0;
let passed = 0;

function assert(condition, message) {
    total++;
    if (condition) {
        passed++;
        console.log(`  [PASS] ${message}`);
    } else {
        console.error(`  [FAIL] ${message}`);
        process.exitCode = 1;
    }
}

const dom = new JSDOM(html, {
    url: 'http://localhost',
    runScripts: 'dangerously',
    beforeParse(window) {
        window.AudioContext = class { constructor() {} };
        window.webkitAudioContext = window.AudioContext;
        window.Audio = class {
            constructor(src) { this.src = src; }
            play() { return Promise.resolve(); }
            pause() {}
        };
    }
});

const { window } = dom;
const { document } = window;
const run = (code) => window.eval(code);

// SECTION 1: TOP BAR ELEMENTS
console.log("\n--- SECTION 1: Top Bar Header & Stats ---");
const profilePill = document.querySelector('.mainmenu-profile-pill');
assert(profilePill !== null, "Profile pill element exists");
const nameEl = document.getElementById('mainmenu-player-name');
assert(nameEl !== null, "mainmenu-player-name exists");
const lvlEl = document.getElementById('mainmenu-player-level');
assert(lvlEl !== null, "mainmenu-player-level exists");
const xpBar = document.getElementById('mainmenu-xp-bar');
const xpText = document.getElementById('mainmenu-xp-text');
assert(xpBar !== null && xpText !== null, "XP bar and XP text exist");

const goldEl = document.getElementById('mainmenu-gold-val');
assert(goldEl !== null, "mainmenu-gold-val exists");
const gemsEl = document.getElementById('mainmenu-gems-val');
assert(gemsEl !== null, "mainmenu-gems-val exists");

const settingsBtn = document.getElementById('mainmenu-btn-settings');
assert(settingsBtn !== null, "mainmenu-btn-settings exists");
const settingsDot = settingsBtn.querySelector('.settings-notification-dot');
assert(settingsDot !== null, "Settings gear has red notification dot");

// SECTION 2: FLOATING CONTENT CARDS
console.log("\n--- SECTION 2: Floating Content Cards ---");
const leagueCard = document.getElementById('mainmenu-card-league');
assert(leagueCard !== null, "Kristal Lig card exists");
const leagueName = document.getElementById('mainmenu-league-name');
assert(leagueName !== null && leagueName.textContent.includes('Kristal Lig'), "League name is Kristal Lig");
const leagueProgress = document.getElementById('mainmenu-league-progress-text');
assert(leagueProgress !== null, "League progress text exists");

const treasuresCard = document.getElementById('mainmenu-card-treasures');
assert(treasuresCard !== null, "Hazineler card exists");
assert(treasuresCard.textContent.includes('HAZİNELER'), "Hazineler title is present");
assert(treasuresCard.textContent.includes('Ödüllerini Topla'), "Hazineler subtitle is present");

const dailyQuestsCard = document.getElementById('mainmenu-card-dailyquests');
assert(dailyQuestsCard !== null, "Günlük Görevler card exists");
assert(dailyQuestsCard.textContent.includes('GÜNLÜK GÖREVLER'), "Günlük Görevler title is present");
const dqRedDot = dailyQuestsCard.querySelector('.dailyquests-red-dot');
assert(dqRedDot !== null, "Daily quests has red notification dot");

// SECTION 3: CENTER-LOW PRIMARY PLAY BUTTON
console.log("\n--- SECTION 3: Center-Low Primary Action (OYUNA BAŞLA) ---");
const playBtn = document.getElementById('btn-main-play');
assert(playBtn !== null, "btn-main-play exists");
const playText = document.getElementById('btn-mainmenu-play-text');
assert(playText !== null && playText.textContent.includes('OYUNA BAŞLA'), "Primary CTA text is OYUNA BAŞLA");
const playSub = document.querySelector('.play-subtitle-txt');
assert(playSub !== null && playSub.textContent.includes('Yeni Macera Seni Bekliyor'), "Subtitle 'Yeni Macera Seni Bekliyor' is present");

// SECTION 4: 3-CARD BOTTOM NAVIGATION
console.log("\n--- SECTION 4: 3-Card Bottom Navigation ---");
const navHeroes = document.getElementById('mainmenu-nav-heroes');
const navMap = document.getElementById('mainmenu-nav-map');
const navPantheon = document.getElementById('mainmenu-nav-pantheon');
assert(navHeroes !== null, "KAHRAMANLAR bottom card exists");
assert(navMap !== null, "HARİTA bottom card exists");
assert(navPantheon !== null, "PANTEON bottom card exists");

const heroDot = navHeroes.querySelector('.nav-card-red-dot');
assert(heroDot !== null, "KAHRAMANLAR card has red notification dot");

const footerSigil = document.querySelector('.mainmenu-footer-sigil');
assert(footerSigil !== null && footerSigil.textContent.includes('EFSANE SENİNLE BAŞLAR'), "Footer 'EFSANE SENİNLE BAŞLAR' is present");

// SECTION 5: FUNCTIONAL WIRING & CLICK INTERACTIONS
console.log("\n--- SECTION 5: Functional Action Verification ---");

// Test Profile Click
profilePill.click();
const profileModal = document.getElementById('modal-profile-setup');
assert(profileModal && profileModal.classList.contains('active'), "Clicking profile pill opens modal-profile-setup");
run("closeModal('modal-profile-setup')");

// Test Settings Click
settingsBtn.click();
const settingsModal = document.getElementById('modal-settings');
assert(settingsModal && settingsModal.classList.contains('active'), "Clicking settings gear opens modal-settings");
run("closeModal('modal-settings')");

// Test League Click
leagueCard.click();
const lbModal = document.getElementById('modal-leaderboard');
assert(lbModal && lbModal.classList.contains('active'), "Clicking league card opens modal-leaderboard");
run("closeModal('modal-leaderboard')");

// Test Treasures Click
treasuresCard.click();
assert(run("currentActiveScreen") === 'screen-store', "Clicking Hazineler card navigates to screen-store");
run("showScreen('screen-mainmenu')");

// Test Daily Quests Click
dailyQuestsCard.click();
const dqModal = document.getElementById('modal-daily-quests');
assert(dqModal && dqModal.classList.contains('active'), "Clicking Günlük Görevler opens modal-daily-quests");

// Test Claim Daily Quest
const initialGold = run("gameState.gold || 0");
const claimBtn = dqModal.querySelector('.btn-action');
assert(claimBtn !== null, "Daily quest claim button exists");
claimBtn.click();
const newGold = run("gameState.gold");
assert(newGold === initialGold + 250, `Claiming quest awarded +250 Gold (was ${initialGold}, now ${newGold})`);
assert(claimBtn.textContent.includes('ALINDI'), "Claim button changed to ALINDI");
run("closeModal('modal-daily-quests')");

// Test Heroes Nav Click
navHeroes.click();
assert(run("currentActiveScreen") === 'screen-hero', "Clicking KAHRAMANLAR navigates to screen-hero");

// Test Map Nav Click
run("showScreen('screen-mainmenu')");
navMap.click();
assert(run("currentActiveScreen") === 'screen-worldmap', "Clicking HARİTA navigates to screen-worldmap");

// Test Bottom Hazine Nav Click
run("showScreen('screen-mainmenu')");
navPantheon.click();
assert(run("currentActiveScreen") === 'screen-store', "Clicking HAZİNE bottom card navigates to screen-store");
run("showScreen('screen-mainmenu')");

// SECTION 6: DYNAMIC DATA BINDING
console.log("\n--- SECTION 6: Dynamic Data Synchronization ---");
run(`
    gameState.playerName = "HERACLES";
    gameState.playerLevel = 25;
    gameState.playerXp = 4800;
    gameState.maxXp = 6000;
    gameState.gold = 75000;
    gameState.gems = 1250;
    updateHUD();
`);

assert(nameEl.textContent === "HERACLES", `Player name updated to HERACLES (got: ${nameEl.textContent})`);
assert(lvlEl.textContent === "Seviye 25", `Player level updated to Seviye 25 (got: ${lvlEl.textContent})`);
assert(xpText.textContent.includes("4.800"), `XP text formatted with thousand separator (got: ${xpText.textContent})`);
assert(goldEl.textContent.includes("75.000"), `Gold updated to 75.000 (got: ${goldEl.textContent})`);
assert(gemsEl.textContent.includes("1.250"), `Gems updated to 1.250 (got: ${gemsEl.textContent})`);

console.log(`\n=============================================================`);
console.log(`TEST SUMMARY: ${passed} / ${total} assertions PASSED.`);
console.log(`=============================================================`);

if (passed === total) {
    console.log(">>> ALL MAIN MENU REFERENCE DESIGN TESTS PASSED! <<<");
    process.exit(0);
} else {
    process.exit(1);
}

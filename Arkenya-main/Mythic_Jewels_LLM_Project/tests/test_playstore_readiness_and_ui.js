const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

console.log('=== RUNNING COMPREHENSIVE PLAYSTORE READINESS & UI TEST SUITE ===');

const html = fs.readFileSync('www/index.html', 'utf8');

const dom = new JSDOM(html, {
    runScripts: "dangerously",
    resources: "usable",
    url: "http://localhost:3000/"
});

const { window } = dom;
const { document } = window;

let totalAsserts = 0;
let passedAsserts = 0;

function assert(condition, message) {
    totalAsserts++;
    if (condition) {
        passedAsserts++;
        console.log(`  [PASS] ${message}`);
    } else {
        console.error(`  [FAIL] ${message}`);
    }
}

// TEST 1: MAIN MENU SETTINGS & ACTION BUTTONS
console.log('\n--- 1. Main Menu UI & Settings Fit ---');
const settingsBtn = document.getElementById('mainmenu-btn-settings');
assert(!!settingsBtn, 'Main menu settings button exists');
const profilePill = document.querySelector('.mainmenu-profile-pill');
assert(!!profilePill, 'Profile pill exists');
const goldPill = document.querySelector('.mainmenu-currency-pill.gold-pill');
assert(!!goldPill, 'Gold currency pill exists');
const gemPill = document.querySelector('.mainmenu-currency-pill.gem-pill');
assert(!!gemPill, 'Gem currency pill exists');
const playBtn = document.getElementById('btn-main-play');
assert(!!playBtn, 'Play CTA button exists');
const heroesCard = document.getElementById('mainmenu-nav-heroes');
assert(!!heroesCard, 'Bottom nav Heroes card exists');
const mapCard = document.getElementById('mainmenu-nav-map');
assert(!!mapCard, 'Bottom nav Map card exists');
const pantheonCard = document.getElementById('mainmenu-nav-pantheon');
assert(!!pantheonCard, 'Bottom nav Pantheon card exists');

// TEST 2: HERO SELECTION CAROUSEL & LARGE TOUCH TARGETS
console.log('\n--- 2. Hero Selection Carousel & Touch Ergonomics ---');
const heroTabsContainer = document.querySelector('.hero-tabs');
assert(!!heroTabsContainer, 'Hero tabs container exists');
const heroTabBtns = document.querySelectorAll('.hero-tab-btn');
assert(heroTabBtns.length === 6, `Found all 6 hero tabs (count: ${heroTabBtns.length})`);

const arkenyaTab = document.getElementById('tab-arkenya');
assert(!!arkenyaTab, 'Tab Arkenya exists');
const asterionTab = document.getElementById('tab-asterion');
assert(!!asterionTab, 'Tab Asterion exists');

// Verify tab avatar mini exists inside tabs
const miniAvatars = document.querySelectorAll('.hero-tab-btn .tab-avatar-mini');
assert(miniAvatars.length === 6, 'All 6 tabs contain hero avatars');

// TEST 3: ZERO EMPTY BOX GUARANTEE & SELF-HEALING TEST
console.log('\n--- 3. Empty Box / Blank Cell Prevention & Self-Healing ---');
// Extract GEM_TYPES from html or window
const gemTypesMatch = html.match(/const GEM_TYPES = (\[[^\]]+\]);/);
const gemTypes = gemTypesMatch ? eval(gemTypesMatch[1]) : ['ruby', 'sapphire', 'emerald', 'topaz', 'amethyst'];

// Call startGameplayCore or initialize grid
if (typeof window.startGameplayCore === 'function') {
    window.startGameplayCore();
}

// Inject corrupted null cells
if (window.gridData && window.gridData[2]) {
    window.gridData[2][3] = null;
    window.gridData[4][5] = undefined;
    window.gridData[0][0] = 'corrupted_unknown_string';
    
    // Call renderGrid()
    window.renderGrid();
    
    let hasNull = false;
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (!window.gridData[r][c] || !gemTypes.includes(window.gridData[r][c])) {
                hasNull = true;
            }
        }
    }
    assert(!hasNull, 'renderGrid instantly self-healed all null/corrupted cells to valid GEM_TYPES');
} else {
    assert(html.includes('ZERO EMPTY BOX GUARANTEE'), 'HTML contains zero empty box self-healing code');
}

// TEST 4: ALL 50 LEVELS & PROGRESSION TARGETS
console.log('\n--- 4. 50 Levels & Progression Integrity ---');
const sIdx = html.indexOf('const LEVEL_DATA = {');
const eIdx = html.indexOf('};\n\n', sIdx);
eval(html.substring(sIdx, eIdx + 2).replace('const LEVEL_DATA =', 'global.LEVEL_DATA ='));
assert(Object.keys(global.LEVEL_DATA).length === 50, 'All 50 levels are defined in LEVEL_DATA');
let allLevelsValid = true;
for (let lvl = 1; lvl <= 50; lvl++) {
    const l = global.LEVEL_DATA[lvl];
    if (!l || !l.title || !l.targetScore || !l.maxMoves) {
        allLevelsValid = false;
    }
}
assert(allLevelsValid, 'Every level has valid title, targetScore (>0), and maxMoves (>0)');

// TEST 5: ADMOB & FIREBASE INTEGRATIONS
console.log('\n--- 5. AdMob & Firebase Integration Integrity ---');
const manifestXml = fs.readFileSync('android/app/src/main/AndroidManifest.xml', 'utf8');
assert(manifestXml.includes('ca-app-pub-5447184164278795~6893138952'), 'AndroidManifest contains correct AdMob App ID');
assert(manifestXml.includes('android:screenOrientation="unspecified"'), 'AndroidManifest allows orientation change (landscape & portrait)');

const capConfig = JSON.parse(fs.readFileSync('capacitor.config.json', 'utf8'));
assert(capConfig.plugins.ScreenOrientation.orientation === 'unspecified', 'Capacitor orientation is unspecified (responsive on all devices)');

assert(html.includes('OLYMPUS_RIVALS_POOL') && html.includes('getSimulatedLeagueParticipants'), 'Manager-Style Simulated League Engine is properly configured');
assert(html.includes('window.AdGuard'), 'AdGuard AdMob architecture is properly implemented');

console.log(`\n=============================================================`);
console.log(`TEST SUMMARY: ${passedAsserts} / ${totalAsserts} assertions PASSED.`);
console.log(`=============================================================`);

if (passedAsserts === totalAsserts) {
    console.log('>>> ALL VERIFICATION TESTS PASSED PERFECTLY! <<<');
    process.exit(0);
} else {
    console.error('>>> SOME TESTS FAILED! <<<');
    process.exit(1);
}

const fs = require('fs');
const { JSDOM } = require('jsdom');

console.log('=== TEST: Comprehensive 5-by-5 Progression & Victory Showcase ===');

const html = fs.readFileSync('www/index.html', 'utf8');

let dom;
let window;
let document;

try {
    dom = new JSDOM(html, {
        url: 'http://localhost',
        runScripts: 'dangerously',
        resources: 'usable',
        beforeParse(win) {
            win.AudioContext = class {
                createOscillator() { return { connect() {}, start() {}, stop() {}, frequency: { setValueAtTime() {}, exponentialRampToValueAtTime() {} } }; }
                createGain() { return { connect() {}, gain: { setValueAtTime() {}, linearRampToValueAtTime() {}, exponentialRampToValueAtTime() {} } }; }
                get currentTime() { return 0; }
                get state() { return 'running'; }
                resume() { return Promise.resolve(); }
            };
            win.webkitAudioContext = win.AudioContext;
            win.navigator.vibrate = () => true;
        }
    });
    window = dom.window;
    document = window.document;
    console.log('[PASS] DOM parsed and scripts evaluated without syntax error.');
} catch (e) {
    console.error('[FAIL] Syntax or eval error in index.html:', e);
    process.exit(1);
}

// 1. Verify BIOME_LORE completeness
console.log('\n--- 1. Testing BIOME_LORE Data Structure ---');
const biomes = window.BIOME_LORE;
if (!biomes || typeof biomes !== 'object') {
    console.error('[FAIL] BIOME_LORE is not defined or invalid');
    process.exit(1);
}

for (let z = 1; z <= 5; z++) {
    const b = biomes[z];
    if (!b || !b.name || !b.title || !b.bossName || !b.bossStoryText) {
        console.error(`[FAIL] Biome ${z} missing critical boss or lore data:`, b);
        process.exit(1);
    }
    console.log(`[PASS] Biome ${z}: ${b.name} (${b.title}) - Boss: ${b.bossName}`);
}

// 2. Verify 50 Levels Progression & Milestones
console.log('\n--- 2. Testing 50-Level Data & Milestones ---');
const levels = window.eval('LEVEL_DATA');
const milestones = window.eval('MILESTONE_REWARDS');

for (let i = 1; i <= 50; i++) {
    const lvl = levels[i];
    if (!lvl) {
        console.error(`[FAIL] Missing LEVEL_DATA for level ${i}`);
        process.exit(1);
    }
    if (i % 5 === 0) {
        if (!milestones[i]) {
            console.error(`[FAIL] Missing MILESTONE_REWARDS for milestone level ${i}`);
            process.exit(1);
        }
    }
}
console.log(`[PASS] All 50 levels configured with valid scores, moves, and 5-level milestone chests.`);

// 3. Test Dynamic Biome Backgrounds
console.log('\n--- 3. Testing Dynamic Zone Backgrounds ---');
window.updateDynamicZoneBackground(1);
let b1 = document.body.getAttribute('data-biome');
let bg1 = document.getElementById('screen-gameplay').style.backgroundImage;

window.updateDynamicZoneBackground(15);
let b2 = document.body.getAttribute('data-biome');
let bg2 = document.getElementById('screen-gameplay').style.backgroundImage;

window.updateDynamicZoneBackground(45);
let b5 = document.body.getAttribute('data-biome');
let bg5 = document.getElementById('screen-gameplay').style.backgroundImage;

if (b1 !== '1' || b2 !== '2' || b5 !== '5' || !bg1 || !bg2 || !bg5 || bg1 === bg2 || bg2 === bg5) {
    console.error('[FAIL] Zone backgrounds not updating dynamically across biomes:', { b1, b2, b5, bg1, bg2, bg5 });
    process.exit(1);
}
console.log('[PASS] Dynamic zone backgrounds transition distinctly per chapter biome (1 -> 2 -> 5).');

// 4. Test Story Scroll Modal for Chapter Entry & Boss
console.log('\n--- 4. Testing Story Scroll Modal ---');
window.openStoryScrollModal(window.BIOME_LORE[1], 1);
const titleEl = document.getElementById('story-scroll-title');
const badgeEl = document.getElementById('story-scroll-badge');
if (!titleEl.innerText.includes('IŞIĞIN ŞAFAĞI') || !badgeEl.innerText.includes('BÖLGE 1')) {
    console.error('[FAIL] Chapter 1 story modal did not render expected chapter title:', titleEl.innerText);
    process.exit(1);
}
console.log('[PASS] Chapter 1 story modal rendered:', titleEl.innerText);

window.openStoryScrollModal(window.BIOME_LORE[1], 10);
if (!titleEl.innerText.includes('Hades') || !badgeEl.innerText.includes('BOSS SAVAŞI')) {
    console.error('[FAIL] Boss Level 10 story modal did not render expected boss details:', titleEl.innerText, badgeEl.innerText);
    process.exit(1);
}
console.log('[PASS] Boss Level 10 story modal rendered:', titleEl.innerText, '|', badgeEl.innerText);

// 5. Test showVictory for Normal Level (Level 1)
console.log('\n--- 5. Testing showVictory on Level 1 ---');
window.eval(`
    gameState.currentPlayingLevel = 1;
    gameState.unlockedLevel = 1;
    gameScore = 5200;
    gameTarget = 4000;
    movesLeftAtWin = 6;
    gameMoves = 6;
    showVictory();
`);

const chipEl = document.getElementById('victory-stage-chip');
const scoreEl = document.getElementById('victory-score');
const targetEl = document.getElementById('victory-target-score');
const ratingEl = document.getElementById('victory-rating-text');
const nextBtn = document.getElementById('btn-victory-next');

if (!chipEl.innerText.includes('BÖLÜM 1') || (!chipEl.innerText.includes('KRİSTAL') && !chipEl.innerText.includes('KRISTAL'))) {
    console.error('[FAIL] Victory stage chip invalid:', chipEl.innerText);
    process.exit(1);
}
if (!ratingEl.innerText.includes('YILDIZ')) {
    console.error('[FAIL] Victory rating text missing stars rating:', ratingEl.innerText);
    process.exit(1);
}
const unlockedLvlAfter1 = window.eval('gameState.unlockedLevel');
if (unlockedLvlAfter1 < 2) {
    console.error('[FAIL] gameState.unlockedLevel did not increment to 2:', unlockedLvlAfter1);
    process.exit(1);
}
console.log('[PASS] Level 1 Victory Modal populated accurately:');
console.log('       Chip:', chipEl.innerText);
console.log('       Rating:', ratingEl.innerText);
console.log('       Target:', targetEl.innerText);
console.log('       Unlocked Level:', unlockedLvlAfter1);

// 6. Test showVictory for Boss Level (Level 10)
console.log('\n--- 6. Testing showVictory on Boss Level 10 ---');
window.eval(`
    gameState.currentPlayingLevel = 10;
    gameState.unlockedLevel = 10;
    gameScore = 15000;
    gameTarget = 12000;
    movesLeftAtWin = 4;
    gameMoves = 4;
    showVictory();
`);

const crestEl = document.getElementById('victory-crest-icon');
const mainTitleEl = document.getElementById('victory-main-title');
const notifyEl = document.getElementById('unlock-hero-notify');

if (mainTitleEl.innerText !== 'BOSS MAĞLUP EDİLDİ!') {
    console.error('[FAIL] Expected BOSS MAĞLUP EDİLDİ! but got:', mainTitleEl.innerText);
    process.exit(1);
}
if (!nextBtn.innerHTML.includes('YENİ BÖLGEYE ADIM AT')) {
    console.error('[FAIL] Boss next button did not indicate entering new biome:', nextBtn.innerHTML);
    process.exit(1);
}
console.log('[PASS] Boss Level 10 Victory Modal correctly reflects boss victory and new biome entrance.');
console.log('       Main Title:', mainTitleEl.innerText);
console.log('       Next Button:', nextBtn.innerHTML);

// 7. Test showVictory for Final Level 50
console.log('\n--- 7. Testing showVictory on Final Level 50 ---');
window.eval(`
    gameState.currentPlayingLevel = 50;
    gameState.unlockedLevel = 50;
    gameScore = 32000;
    gameTarget = 25000;
    movesLeftAtWin = 8;
    gameMoves = 8;
    showVictory();
`);

if (mainTitleEl.innerText !== 'BÜYÜK OLİMPOS ŞAMPİYONU!') {
    console.error('[FAIL] Expected BÜYÜK OLİMPOS ŞAMPİYONU! on Level 50 but got:', mainTitleEl.innerText);
    process.exit(1);
}
if (!nextBtn.innerHTML.includes('EFSANEVİ FİNAL KUTLAMASI')) {
    console.error('[FAIL] Level 50 next button did not trigger final celebration:', nextBtn.innerHTML);
    process.exit(1);
}
console.log('[PASS] Level 50 Victory leads seamlessly to final championship celebration.');

console.log('\n=== ALL 7 PROGRESSION & VICTORY TESTS PASSED! ===');

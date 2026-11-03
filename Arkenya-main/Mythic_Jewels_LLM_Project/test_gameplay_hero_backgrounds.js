const fs = require('fs');
const { JSDOM } = require('jsdom');
const assert = require('assert');

console.log("================================================================================");
console.log("🛡️ TEST: GAMEPLAY THEMATIC GREEK HERO BACKGROUNDS & ALTAR VERIFICATION");
console.log("================================================================================");

const html = fs.readFileSync('www/index.html', 'utf8');

const dom = new JSDOM(html, {
    url: 'http://localhost',
    runScripts: 'dangerously',
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
        win.localStorage = {
            _data: {},
            getItem(k) { return this._data[k] || null; },
            setItem(k, v) { this._data[k] = String(v); },
            removeItem(k) { delete this._data[k]; }
        };
    }
});

const { window } = dom;
const { document } = window;

// 1. Initial State: Check Level 1 (Arkenya)
console.log("\n--- TEST 1: Zone 1 (Bölüm 1 - 10) -> Arkenya Kadim Şampiyon ---");
window.updateDynamicZoneBackground(5);
const screenGameplay = document.getElementById('screen-gameplay');
const altarTitle = document.querySelector('.altar-title-txt');

assert(screenGameplay.style.backgroundImage.includes('hero_arkenya.jpg'), "Bölüm 5 arkaplanı hero_arkenya.jpg içermeli!");
assert.strictEqual(altarTitle.innerText, 'ARKENYA KADİM SUNAĞI', "Altar başlığı ARKENYA KADİM SUNAĞI olmalı!");
console.log("  ✅ [PASS] Zone 1 gameplay background: hero_arkenya.jpg");
console.log("  ✅ [PASS] Altar başlığı: " + altarTitle.innerText);

// 2. Zone 2: Level 15 (Thalor)
console.log("\n--- TEST 2: Zone 2 (Bölüm 11 - 20) -> Thalor Okyanus Komutanı ---");
window.updateDynamicZoneBackground(15);
assert(screenGameplay.style.backgroundImage.includes('hero_thalor_1789032663594.png'), "Bölüm 15 arkaplanı hero_thalor içermeli!");
assert.strictEqual(altarTitle.innerText, 'THALOR OKYANUS SUNAĞI', "Altar başlığı THALOR OKYANUS SUNAĞI olmalı!");
console.log("  ✅ [PASS] Zone 2 gameplay background: hero_thalor_1789032663594.png");
console.log("  ✅ [PASS] Altar başlığı: " + altarTitle.innerText);

// 3. Zone 3: Level 25 (Asterion)
console.log("\n--- TEST 3: Zone 3 (Bölüm 21 - 30) -> Asterion Labirent Muhafızı ---");
window.updateDynamicZoneBackground(25);
assert(screenGameplay.style.backgroundImage.includes('hero_asterion_1789032622044.png'), "Bölüm 25 arkaplanı hero_asterion içermeli!");
assert.strictEqual(altarTitle.innerText, 'ASTERİON LABİRENT SUNAĞI', "Altar başlığı ASTERİON LABİRENT SUNAĞI olmalı!");
console.log("  ✅ [PASS] Zone 3 gameplay background: hero_asterion_1789032622044.png");
console.log("  ✅ [PASS] Altar başlığı: " + altarTitle.innerText);

// 4. Zone 4: Level 35 (Nyra)
console.log("\n--- TEST 4: Zone 4 (Bölüm 31 - 40) -> Nyra Prizma Tanrıçası ---");
window.updateDynamicZoneBackground(35);
assert(screenGameplay.style.backgroundImage.includes('hero_nyra_1789032644250.png'), "Bölüm 35 arkaplanı hero_nyra içermeli!");
assert.strictEqual(altarTitle.innerText, 'NYRA PRİZMA SUNAĞI', "Altar başlığı NYRA PRİZMA SUNAĞI olmalı!");
console.log("  ✅ [PASS] Zone 4 gameplay background: hero_nyra_1789032644250.png");
console.log("  ✅ [PASS] Altar başlığı: " + altarTitle.innerText);

// 5. Zone 5: Level 45 (Athena) & Level 50 (Zeus)
console.log("\n--- TEST 5: Zone 5 (Bölüm 41 - 50) -> Athena (41-45) & Zeus (46-50) ---");
window.updateDynamicZoneBackground(45);
assert(screenGameplay.style.backgroundImage.includes('hero_athena_1789032003209.png'), "Bölüm 45 arkaplanı hero_athena içermeli!");
assert.strictEqual(altarTitle.innerText, 'ATHENA BİLGELİK SUNAĞI', "Bölüm 45 altar başlığı ATHENA BİLGELİK SUNAĞI olmalı!");
console.log("  ✅ [PASS] Bölüm 45 gameplay background: hero_athena_1789032003209.png");
console.log("  ✅ [PASS] Altar başlığı: " + altarTitle.innerText);

window.updateDynamicZoneBackground(50);
assert(screenGameplay.style.backgroundImage.includes('hero_zeus_1789031982831.png'), "Bölüm 50 arkaplanı hero_zeus içermeli!");
assert.strictEqual(altarTitle.innerText, 'ZEUS İLÂHİ SUNAĞI', "Bölüm 50 altar başlığı ZEUS İLÂHİ SUNAĞI olmalı!");
console.log("  ✅ [PASS] Bölüm 50 gameplay background: hero_zeus_1789031982831.png");
console.log("  ✅ [PASS] Altar başlığı: " + altarTitle.innerText);

// 6. Test Level Badge Icons across levels
console.log("\n--- TEST 6: Gameplay Level Badge Icons & Level Names ---");
window.gameState.currentPlayingLevel = 4;
window.updateGameplayLevelBadge();
const badgeIcon = document.getElementById('gameplay-level-badge-icon');
assert.strictEqual(badgeIcon.innerText, '🐍', "Bölüm 4 Medusa ikonu 🐍 olmalı!");
console.log("  ✅ [PASS] Bölüm 4 badge icon: " + badgeIcon.innerText + " (Medusa Yılanı)");

window.gameState.currentPlayingLevel = 50;
window.updateGameplayLevelBadge();
assert.strictEqual(badgeIcon.innerText, '👑', "Bölüm 50 Olimpos Taç ikonu 👑 olmalı!");
console.log("  ✅ [PASS] Bölüm 50 badge icon: " + badgeIcon.innerText + " (Olimpos Tacı)");

// 7. Test User Selected Avatar / Hero (User chooses Zeus and plays Level 3)
console.log("\n--- TEST 7: User Chooses Zeus Avatar -> Plays Level 3 (Troy Zone) ---");
window.gameState.selectedHero = 'zeus';
window.gameState.customHeroSelected = true;
window.updateDynamicZoneBackground(3);
assert(screenGameplay.style.backgroundImage.includes('hero_zeus_1789031982831.png'), "Kullanıcı Zeus seçtiğinde Bölüm 3 arkaplanı Zeus olmalı!");
assert.strictEqual(altarTitle.innerText, 'ZEUS İLÂHİ SUNAĞI', "Kullanıcı Zeus seçtiğinde Altar başlığı ZEUS İLÂHİ SUNAĞI olmalı!");
console.log("  ✅ [PASS] Level 3 with selected hero Zeus correctly reflects Zeus background and altar!");

// 8. Test User Selected Avatar / Hero (User chooses Athena and plays Level 12)
console.log("\n--- TEST 8: User Chooses Athena Avatar -> Plays Level 12 (Poseidon Zone) ---");
window.gameState.selectedHero = 'athena';
window.gameState.customHeroSelected = true;
window.updateDynamicZoneBackground(12);
assert(screenGameplay.style.backgroundImage.includes('hero_athena_1789032003209.png'), "Kullanıcı Athena seçtiğinde Bölüm 12 arkaplanı Athena olmalı!");
assert.strictEqual(altarTitle.innerText, 'ATHENA BİLGELİK SUNAĞI', "Kullanıcı Athena seçtiğinde Altar başlığı ATHENA BİLGELİK SUNAĞI olmalı!");
console.log("  ✅ [PASS] Level 12 with selected hero Athena correctly reflects Athena background and altar!");

// 9. Test User Selected Avatar / Hero (User chooses Asterion and plays Level 48)
console.log("\n--- TEST 9: User Chooses Asterion Avatar -> Plays Level 48 (Olympus Zone) ---");
window.gameState.selectedHero = 'asterion';
window.gameState.customHeroSelected = true;
window.updateDynamicZoneBackground(48);
assert(screenGameplay.style.backgroundImage.includes('hero_asterion_1789032622044.png'), "Kullanıcı Asterion seçtiğinde Bölüm 48 arkaplanı Asterion olmalı!");
assert.strictEqual(altarTitle.innerText, 'ASTERİON LABİRENT SUNAĞI', "Kullanıcı Asterion seçtiğinde Altar başlığı ASTERİON LABİRENT SUNAĞI olmalı!");
console.log("  ✅ [PASS] Level 48 with selected hero Asterion correctly reflects Asterion background and altar!");

console.log("\n================================================================================");
console.log("🎯 ALL GAMEPLAY HERO BACKGROUND & ALTAR TESTS PASSED 100%!");
console.log("================================================================================");

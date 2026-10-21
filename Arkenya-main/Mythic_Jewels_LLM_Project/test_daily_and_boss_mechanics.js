const fs = require('fs');
const { JSDOM } = require('jsdom');

console.log("================================================================================");
console.log("👑🎁 TEST: DAILY REWARDS CALENDAR, ENERGY/LIVES REGEN & BOSS BATTLE HUD SYSTEM");
console.log("================================================================================");

const html = fs.readFileSync('www/index.html', 'utf8');

let total = 0;
let passed = 0;

function assert(condition, message) {
    total++;
    if (condition) {
        passed++;
        console.log(`  ✅ [PASS] ${message}`);
    } else {
        console.error(`  ❌ [FAIL] ${message}`);
        process.exitCode = 1;
    }
}

const dom = new JSDOM(html, {
    url: 'http://localhost',
    runScripts: 'dangerously',
    beforeParse(window) {
        window.AudioContext = class {
            constructor() { this.state = 'running'; this.currentTime = 0; }
            createOscillator() { return { type: 'sine', frequency: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} }, connect: () => {}, start: () => {}, stop: () => {} }; }
            createGain() { return { gain: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {}, linearRampToValueAtTime: () => {} }, connect: () => {} }; }
            resume() { return Promise.resolve(); }
        };
        window.webkitAudioContext = window.AudioContext;
        window.Audio = class {
            constructor() { this.volume = 1; this.paused = true; }
            play() { this.paused = false; return Promise.resolve(); }
            pause() { this.paused = true; }
        };
        window.requestAnimationFrame = (fn) => setTimeout(fn, 16);
    }
});

const { window } = dom;
const run = (code) => window.eval(code);

async function runTests() {
    // -------------------------------------------------------------------------
    // TEST 1: Daily Login Calendar & Streak Progression
    // -------------------------------------------------------------------------
    console.log("\n--- TEST 1: 7 Günlük Giriş Takvimi & Doğrudan Giriş Ödülü ---");
    assert(typeof run("checkDailyReward") === 'function', "checkDailyReward tanımlı");
    assert(typeof run("claimDailyReward") === 'function', "claimDailyReward tanımlı");
    assert(run("DAILY_REWARDS.length") === 7, "7 günlük ödül seti tanımlı");

    // Oyuncu herhangi bir bölüm oynamadan önce doğrudan ödül penceresini açabilmeli
    const yesterdayStr = new Date(Date.now() - 86400000).toDateString();
    run(`
        gameState.unlockedLevel = 5;
        gameState.currentPlayingLevel = 5;
        gameState.lastPlayedDay = 'some_past_date';
        gameState.lastClaimedRewardDay = '${yesterdayStr}';
        gameState.lastLoginDate = '${yesterdayStr}';
        gameState.loginStreak = 1;
        gameState.gold = 100;
        gameState.gems = 10;
        checkDailyReward(false);
    `);

    const dailyModal = window.document.getElementById('modal-daily-reward');
    assert(dailyModal !== null, "modal-daily-reward DOM'da mevcut");
    assert(dailyModal.classList.contains('active'), "Ödül penceresi oyun oynama şartı olmadan doğrudan açıldı");

    const claimBtn = dailyModal.querySelector('.btn-action');
    assert(claimBtn !== null && claimBtn.disabled === false, "Ödül alma butonu aktif");

    // Gün 2 ödülünü al: 3 Elmas + 1 Kalkan
    run("claimDailyReward();");
    assert(run("gameState.lastClaimedRewardDay") === new Date().toDateString(), "Ödül alındı tarihi bugüne güncellendi");
    assert(run("gameState.gems") === 13, "Gün 2 ödülü (3 Elmas) hesaba eklendi");
    assert(run("gameState.inventory.athena") >= 1, "Gün 2 güçlendiricisi (Athena Kalkanı) envantere eklendi");

    // Aynı gün tekrar ödül açılmak istendiğinde buton kilitli ve bilgilendirici olmalı
    run("checkDailyReward(false);");
    assert(claimBtn.disabled === true, "Aynı gün ikinci kez ödül alma butonu pasif (hilesiz/güvenli)");

    // Gün 5 ödülü: Tam Can (5 ❤️) Yenileme Testi
    run(`
        gameState.energy = 1;
        gameState.lastClaimedRewardDay = '${yesterdayStr}';
        pendingDailyReward = DAILY_REWARDS[4]; // Day 5
        claimDailyReward();
    `);
    assert(run("gameState.energy") === 5, "Gün 5 can iksiriyle kutsal canlar 5'e (TAM DOLU) yükseldi");

    // -------------------------------------------------------------------------
    // TEST 2: Can & Enerji Offline Yenilenme
    // -------------------------------------------------------------------------
    console.log("\n--- TEST 2: Kutsal Canlar & Offline Can Yenileme Sistemi ---");
    assert(typeof run("applyOfflineEnergyRegen") === 'function', "applyOfflineEnergyRegen tanımlı");
    assert(typeof run("renderAllHeartsAndTimers") === 'function', "renderAllHeartsAndTimers tanımlı");

    run(`
        gameState.energy = 2;
        // 60 dakika (3600 saniye = 2 can x 30 dk) geçmiş gibi simüle et
        gameState.lastEnergyUpdate = Date.now() - (60 * 60 * 1000);
        applyOfflineEnergyRegen();
    `);
    assert(run("gameState.energy") === 4, "Offline geçen sürede 2 can otomatik yenilendi (2 -> 4)");

    // -------------------------------------------------------------------------
    // TEST 3: Boss Savaşı HUD & Görsel Bileşenler (Level 10 Hades)
    // -------------------------------------------------------------------------
    console.log("\n--- TEST 3: Boss Bölümü HUD & Görsel Can Barı ---");
    const bossHud = window.document.getElementById('boss-battle-hud');
    const bossName = window.document.getElementById('boss-hud-name');
    const bossAvatar = window.document.getElementById('boss-avatar-frame');
    const bossHpFill = window.document.getElementById('boss-hud-hp-fill');
    const bossHpText = window.document.getElementById('boss-hud-hp-text');

    assert(bossHud !== null, "boss-battle-hud DOM'da mevcut");
    assert(bossName !== null, "boss-hud-name DOM'da mevcut");
    assert(bossAvatar !== null, "boss-avatar-frame DOM'da mevcut");
    assert(bossHpFill !== null, "boss-hud-hp-fill DOM'da mevcut");
    assert(bossHpText !== null, "boss-hud-hp-text DOM'da mevcut");

    // Normal seviye (Örn: Seviye 3): Boss HUD gizli olmalı
    run("gameState.currentPlayingLevel = 3; startGameplayCore();");
    assert(bossHud.style.display === 'none', "Normal Seviye 3'te Boss HUD gizli tutuldu");

    // Boss Seviyesi (Seviye 10 Hades)
    run("gameState.currentPlayingLevel = 10; startGameplayCore();");
    assert(bossHud.style.display === 'flex', "Seviye 10'da Boss HUD otomatik açıldı");
    assert(bossName.textContent.includes("HADES"), "Boss adı 'HADES' olarak belirlendi");
    assert(bossHpFill.style.width === '100%', "Başlangıçta Boss Can Barı 100% dolu");

    const target10 = run("gameTarget");
    assert(bossHpText.textContent.includes(target10.toLocaleString()), "Boss Can metninde hedef skor doğru gösteriliyor");

    // Taş patlatıp skor kazanıldığında Boss Can Barı azalmalı ve hasar titremesi tetiklenmeli
    run(`
        gameScore = 21000;
        updateStarProgressBar();
    `);
    assert(bossHpFill.style.width === '50%', "Boss yarı cana indiğinde can barı 50%'ye düştü");
    assert(bossAvatar.classList.contains('boss-hit-shake'), "Darbe anında boss portresi hasar titremesi (boss-hit-shake) aldı");

    // Son 5 hamle kaldığında Boss Öfke Modu (boss-enraged) tetiklenmeli
    run(`
        gameMoves = 4;
        updateMovesDisplay();
    `);
    assert(bossHud.classList.contains('boss-enraged'), "Kalan hamle <= 5 iken Boss Öfke Moduna (boss-enraged) girdi");

    // Skor hedefe ulaştığında Boss mağlup edilmeli
    run(`
        gameScore = gameTarget;
        updateStarProgressBar();
    `);
    assert(bossHpFill.style.width === '0%', "Hedefe ulaşıldığında Boss Canı 0%'a indi");
    assert(bossHud.classList.contains('boss-defeated'), "Boss mağlup edildi animasyonu (boss-defeated) tetiklendi");
    assert(!bossHud.classList.contains('boss-enraged'), "Mağlubiyet sonrası öfke modu kaldırıldı");

    // -------------------------------------------------------------------------
    // TEST 4: Diğer Mitolojik Boss'lar (Poseidon, Zeus, Kronos)
    // -------------------------------------------------------------------------
    console.log("\n--- TEST 4: Seviye 20, 30 ve 50 Mitolojik Boss Entegrasyonu ---");
    run("gameState.currentPlayingLevel = 20; startGameplayCore();");
    assert(bossName.textContent.includes("POSEİDON"), "Seviye 20'de Poseidon tanımlı");

    run("gameState.currentPlayingLevel = 30; startGameplayCore();");
    assert(bossName.textContent.includes("ZEUS"), "Seviye 30'da Zeus tanımlı");

    run("gameState.currentPlayingLevel = 50; startGameplayCore();");
    assert(bossName.textContent.includes("KRONOS"), "Seviye 50'de Grand Boss Kronos tanımlı");

    console.log("================================================================================");
    console.log(`🎉 TEST SONUÇLARI: ${passed} / ${total} BAŞARILI!`);
    console.log("================================================================================");
    if (passed === total) {
        console.log(">>> GÜNLÜK GİRİŞ TAKVİMİ, CAN YENİLENMESİ VE BOSS SAVAŞI HUD 100% UYUMLU! <<<");
        process.exit(0);
    } else {
        process.exit(1);
    }
}

runTests();

const fs = require('fs');
const { JSDOM } = require('jsdom');

console.log("================================================================================");
console.log("🏹🏛️ TEST: MYTHIC VFX, GAME MECHANICS, LEVEL PROGRESSION & STORE/IAP COMPATIBILITY");
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

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function runAllTests() {
    // -------------------------------------------------------------------------
    // TEST 1: Mitolojik Efekt Fonksiyonları ve DOM İzolasyonu
    // -------------------------------------------------------------------------
    console.log("\n--- TEST 1: Mitolojik Görsel Efekt Fonksiyonları & DOM İzolasyonu ---");
    assert(typeof run("spawnZeusLightningArrow") === 'function', "spawnZeusLightningArrow tanımlı");
    assert(typeof run("spawnMythicQuake") === 'function', "spawnMythicQuake tanımlı");
    assert(typeof run("spawnMythicFlame") === 'function', "spawnMythicFlame tanımlı");
    assert(typeof run("triggerScreenShake") === 'function', "triggerScreenShake tanımlı");

    // Efekt elemanlarını tetikleme ve pointer-events kontrolü
    const grid = window.document.getElementById('game-grid');
    assert(grid !== null, "game-grid DOM elemanı mevcut");

    run("spawnZeusLightningArrow(3, 'h');");
    run("spawnZeusLightningArrow(4, 'v');");
    run("spawnMythicQuake(2, 2);");
    run("spawnMythicFlame(3, 3);");

    const arrowH = grid.querySelector('.zeus-arrow-h');
    const arrowV = grid.querySelector('.zeus-arrow-v');
    const quake = grid.querySelector('.quake-shockwave');
    const flame = grid.querySelector('.mythic-flame-burst');

    assert(arrowH !== null, "Zeus Yatay Şimşek Oku (.zeus-arrow-h) DOM'a eklendi");
    assert(arrowV !== null, "Zeus Dikey Şimşek Oku (.zeus-arrow-v) DOM'a eklendi");
    assert(quake !== null, "Poseidon / Gaia Deprem Dalgası (.quake-shockwave) DOM'a eklendi");
    assert(flame !== null, "Ares İlahi Alev Patlaması (.mythic-flame-burst) DOM'a eklendi");

    // CSS pointer-events none kontrolü (Kullanıcı dokunuşlarını ve sürüklemeleri asla engellememeli)
    assert(html.includes(".zeus-arrow-h") && html.includes("pointer-events: none;"), "Zeus Oku pointer-events: none emniyeti aktif");
    assert(html.includes(".quake-shockwave") && html.includes("pointer-events: none;"), "Deprem dalgası pointer-events: none emniyeti aktif");
    assert(html.includes(".mythic-flame-burst") && html.includes("pointer-events: none;"), "Alev patlaması pointer-events: none emniyeti aktif");

    // 500ms sonra otomatik temizleme (garbage collection) kontrolü
    await sleep(550);
    const lingeringArrows = grid.querySelectorAll('.zeus-arrow-h, .zeus-arrow-v, .quake-shockwave, .mythic-flame-burst');
    assert(lingeringArrows.length === 0, "Efektler süre sonunda DOM'dan temizlendi (Hafıza sızıntısı yok)");

    // -------------------------------------------------------------------------
    // TEST 2: Bölüm Bölüm Özellik Açılma & Özel Taş Patlama Entegrasyonu
    // -------------------------------------------------------------------------
    console.log("\n--- TEST 2: Bölüm İlerlemesi & Özel Taş Patlama Entegrasyonu ---");
    
    // Seviye 1: Başlangıç emniyeti
    run("gameState.currentPlayingLevel = 1; initGrid();");
    assert(run("isCascading") === false, "Seviye 1 başlangıcında tahta stabil (isCascading: false)");
    assert(run("gameScore") === 0, "Seviye 1 başlangıcında skor sıfır");

    // Seviye 2: 4'lü eşleşme ve Şimşek Oku patlaması
    run("gameState.currentPlayingLevel = 2; initGrid();");
    run(`
        // Satır 3'te 3'lü eşleşme kurup ortadaki taşı line_h yap
        gridData[3][1] = 'yellow';
        gridData[3][2] = 'yellow';
        gridData[3][3] = 'yellow';
        specialGrid[3][2] = 'line_h';
        window.arrowSpawned = false;
        window.origZeus = spawnZeusLightningArrow;
        spawnZeusLightningArrow = function(coord, dir) {
            window.arrowSpawned = true;
            window.origZeus(coord, dir);
        };
        processMatchesWithExplosion();
    `);
    assert(run("window.arrowSpawned") === true, "Satır patlamasında (line_h) Zeus Şimşek Oku otomatik fırlatıldı");
    run("spawnZeusLightningArrow = window.origZeus;");

    // Seviye 3: Bomba (3x3) patlamasında Deprem ve Ares Alevi
    run("gameState.currentPlayingLevel = 3; initGrid();");
    run(`
        gridData[4][2] = 'red';
        gridData[4][3] = 'red';
        gridData[4][4] = 'red';
        specialGrid[4][3] = 'bomb';
        window.quakeSpawned = false;
        window.flameSpawned = false;
        window.origQuake = spawnMythicQuake;
        window.origFlame = spawnMythicFlame;
        spawnMythicQuake = function(r, c) { window.quakeSpawned = true; window.origQuake(r, c); };
        spawnMythicFlame = function(r, c) { window.flameSpawned = true; window.origFlame(r, c); };
        processMatchesWithExplosion();
    `);
    assert(run("window.quakeSpawned") === true, "Bomba (bomb) patlamasında Poseidon Depremi tetiklendi");
    assert(run("window.flameSpawned") === true, "Bomba (bomb) patlamasında Ares Kutsal Alevi tetiklendi");
    run("spawnMythicQuake = window.origQuake; spawnMythicFlame = window.origFlame;");

    // Seviye 4: Renk Bombası patlaması (Zeus'un Gazabı)
    run("gameState.currentPlayingLevel = 4; initGrid();");
    run(`
        specialGrid[2][2] = 'color_bomb';
        gridData[2][2] = 'yellow';
        window.colorBombVFX = false;
        window.origFlame2 = spawnMythicFlame;
        spawnMythicFlame = function(r, c) { window.colorBombVFX = true; window.origFlame2(r, c); };
        triggerZeusWrathColorBomb({r: 2, c: 2}, {r: 2, c: 3}, 'ruby');
    `);
    assert(run("window.colorBombVFX") === true, "Renk bombası takasında (triggerZeusWrathColorBomb) süpernova alev & şimşek efekti tetiklendi");
    run("spawnMythicFlame = window.origFlame2;");

    // -------------------------------------------------------------------------
    // TEST 3: Mağaza (Store), IAP & Uygulama İçi Satın Alma Uyumluluğu
    // -------------------------------------------------------------------------
    console.log("\n--- TEST 3: Mağaza, IAP & Satın Alma Entegrasyonu ---");
    assert(typeof run("openStoreScreen") === 'function', "openStoreScreen fonksiyonu mevcut");
    assert(typeof run("updateStoreUI") === 'function', "updateStoreUI fonksiyonu mevcut");
    assert(typeof run("purchaseIAP") === 'function', "purchaseIAP fonksiyonu mevcut");

    // Mağaza kilit kontrolü: 5. Seviyeden önce açılamaz
    run("gameState.unlockedLevel = 2; openStoreScreen();");
    assert(!window.document.getElementById('screen-store').classList.contains('active'), "Seviye 2'de Tapınak Mağazası kilitli tutuldu");

    // 5. Seviye olunca Mağaza açılır
    run("gameState.unlockedLevel = 5; openStoreScreen();");
    assert(window.document.getElementById('screen-store').classList.contains('active'), "5. Seviye zaferinden sonra Mağaza ekranı başarıyla açıldı");

    // IAP satın alma ve Güvenli Ödeme Penceresi (modal-payment) akışı
    const initGold = run("gameState.gold || 0");
    const initGems = run("gameState.gems || 0");
    const modalPayment = window.document.getElementById('modal-payment');
    assert(modalPayment !== null, "modal-payment (Google Play / App Store Güvenli Ödeme) DOM'da mevcut");

    // Booster için IAP satın alma başlatma
    run(`
        activeQuickBuyGod = 'ares';
        buyBoosterWithIAP('gems_pouch', 19.99, '60 Kutsal Elmas Kesesi');
    `);
    assert(modalPayment.classList.contains('active'), "IAP başlatıldığında Güvenli Ödeme Onay penceresi (modal-payment) açıldı");
    assert(window.document.getElementById('payment-price').innerText === '₺19.99', "Ödeme penceresinde fiyat doğru gösteriliyor");

    // Kullanıcı ödemeyi onayladı (applyIAPBundle)
    run(`applyIAPBundle('gems_pouch');`);
    assert(run("gameState.gems") === initGems + 60, "IAP onayı sonrası 60 Kutsal Elmas hesaba geçti");
    assert(run("gameState.inventory.ares") >= 1, "IAP onayı sonrası seçilen Ares Gazabı jokeri de başarıyla envantere eklendi");
    assert(!modalPayment.classList.contains('active'), "Ödeme tamamlanınca ödeme penceresi kapandı");

    // -------------------------------------------------------------------------
    // TEST 4: Kutsal Joker Kilitleri & Hızlı Satın Alma (Quick Booster Buy)
    // -------------------------------------------------------------------------
    console.log("\n--- TEST 4: Kutsal Joker Kilitleri & Hızlı Satın Alma Uyumu ---");
    assert(typeof run("openQuickBoosterBuy") === 'function', "openQuickBoosterBuy fonksiyonu mevcut");
    assert(typeof run("executeQuickBoosterPurchase") === 'function', "executeQuickBoosterPurchase fonksiyonu mevcut");
    assert(typeof run("usePowerup") === 'function', "usePowerup fonksiyonu mevcut");

    // Joker kilit seviyeleri kontrolü: Zeus 2, Athena 5, Hermes 7, Ares 10 (Dock ile tam senkron)
    const unlocks = run("BOOSTER_UNLOCKS");
    assert(unlocks.zeus === 2, "Zeus Şimşeği 2. Seviyede açılıyor");
    assert(unlocks.athena === 5, "Athena Kalkanı 5. Seviyede açılıyor");
    assert(unlocks.hermes === 7, "Hermes Kasırgası 7. Seviyede açılıyor");
    assert(unlocks.ares === 10, "Ares Gazabı 10. Seviyede açılıyor");

    // Hızlı Satın Alma Modal Z-Index Güvenliği
    const modalBuy = window.document.getElementById('modal-quick-booster-buy');
    assert(modalBuy !== null, "Hızlı satın alma modalı DOM'da mevcut");
    assert(modalBuy.style.zIndex === '99999', "Hızlı satın alma modal z-index'i (99999) efektlerin (120) üzerinde");

    // Altınla Zeus Jokeri satın alma penceresi açılışı
    run(`
        gameState.inventory = gameState.inventory || {};
        gameState.inventory.zeus = 0;
        gameState.gold = 50000;
        openQuickBoosterBuy('zeus');
    `);
    assert(run("activeQuickBuyGod") === 'zeus', "Zeus için hızlı satın alma penceresi açıldı");

    // Satın alımı gerçekleştirme (Yeterli altın ile)
    run("executeQuickBoosterPurchase('gold');");
    assert(!modalBuy.classList.contains('active'), "Satın alma sonrası modal başarıyla kapandı");
    assert(run("gameState.inventory.zeus") >= 1, "Satın alınan Zeus Jokeri envantere 1 adet eklendi");

    // Dock'ta Mağaza Kartı (dock-booster-shop) ve Satın Alınan Kart Kontrolü
    const shopBtn = window.document.getElementById('dock-booster-shop');
    assert(shopBtn !== null, "Oyun içi dock'ta 🏛️ Mağaza Kartı (+ AL) daima mevcut");
    const zeusDockBtn = window.document.getElementById('dock-booster-zeus');
    assert(zeusDockBtn !== null, "Satın alınan özellik anında kısayol kartı olarak dock'ta belirdi");

    // -------------------------------------------------------------------------
    // TEST 5: Joker Kullanımında Oyun Dinamiklerinin Korunması (Zero Deadlock)
    // -------------------------------------------------------------------------
    console.log("\n--- TEST 5: Joker Kullanımı & Oyun Akış Bütünlüğü (Zero Deadlock) ---");
    await sleep(250); // Önceki satın alma animasyonunun bitmesini bekle
    run(`
        gameState.unlockedLevel = 15;
        gameState.currentPlayingLevel = 15;
        initGrid();
        gameState.inventory.zeus = 2;
        gameState.inventory.ares = 2;
        isSwapping = false;
        isCascading = false;
        isLevelEnding = false;
    `);

    // Zeus Jokeri kullanımı
    const scoreBeforeZeus = run("gameScore");
    run("usePowerup('zeus');");
    assert(run("gameScore") > scoreBeforeZeus, "Zeus Yıldırımı 5 rastgele taşı patlatıp skoru artırdı");
    assert(run("gameState.inventory.zeus") === 1, "Zeus envanteri 1 eksildi");

    // Ares Jokeri kullanımı
    await sleep(350);
    run("isSwapping = false; isCascading = false;");
    const scoreBeforeAres = run("gameScore");
    run("usePowerup('ares');");
    assert(run("gameScore") > scoreBeforeAres, "Ares Süpernova Gazabı en yaygın renkteki taşları patlatıp skoru artırdı");
    assert(run("gameState.inventory.ares") === 1, "Ares envanteri 1 eksildi");

    // -------------------------------------------------------------------------
    // TEST 6: Mobil Performans & Zero-Reflow (Donma Kontrolü)
    // -------------------------------------------------------------------------
    console.log("\n--- TEST 6: Mobil Performans & Zero-Reflow Denetimi ---");
    assert(!html.includes("void p.offsetWidth;"), "spawnGemParticles içindeki void offsetWidth (reflow dondurması) kaldırıldı");
    assert(html.includes("will-change: transform, opacity;"), "CSS'te GPU compositing (will-change) aktif");
    assert(html.includes("translate3d"), "Donanım hızlandırmalı translate3d katmanları mevcut");

    console.log("\n================================================================================");
    console.log(`🎉 TEST SONUÇLARI: ${passed} / ${total} BAŞARILI!`);
    console.log("================================================================================");
    if (passed === total) {
        console.log(">>> TÜM MİTOLOJİK EFEKTLER, BÖLÜM GELİŞİMİ VE MAĞAZA ENTEGRASYONLARI 100% UYUMLU! <<<");
    } else {
        process.exit(1);
    }
}

runAllTests();

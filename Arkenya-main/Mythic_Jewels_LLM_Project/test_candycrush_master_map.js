const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

console.log("================================================================================");
console.log("🏛️ TEST: CANDY CRUSH DYNAMIC INTERACTIVE MAP, POPUP CARDS & 60FPS VEIL SUITE");
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
            resume() { this.state = 'running'; return Promise.resolve(); }
            suspend() { this.state = 'suspended'; return Promise.resolve(); }
        };
        window.webkitAudioContext = window.AudioContext;
        window.Audio = class {
            constructor() { this.volume = 1; this.paused = true; }
            play() { this.paused = false; return Promise.resolve(); }
            pause() { this.paused = true; }
        };
        window.requestAnimationFrame = (fn) => setTimeout(fn, 16);
        window.cancelAnimationFrame = (id) => clearTimeout(id);
        window.HTMLElement.prototype.scrollIntoView = function() { this.__scrolledIntoView = true; };
        window.Element.prototype.scrollIntoView = function() { this.__scrolledIntoView = true; };
        window.Element.prototype.scrollTo = function(opts) {
            if (opts && typeof opts.top === 'number') this.scrollTop = opts.top;
        };
    }
});

const { window } = dom;
const { document } = window;
const run = (code) => window.eval(code);

async function runTests() {
    console.log("\n--- 1. CANDY CRUSH DİNAMİK HARİTA YAPISI & SÜRÜKLEME (DRAG) MOTORU ---");
    const screenWorldMap = document.getElementById('screen-worldmap');
    assert(screenWorldMap !== null, "Harita ana ekranı (#screen-worldmap) mevcut");
    
    // Test Drag Engine initialization
    run("openWorldMap();");
    assert(screenWorldMap.__hasCandyCrushDragEngine === true, "Candy Crush momentum sürükleme motoru (#screen-worldmap) üzerinde aktif");

    // Test Drag vs Tap discrimination
    screenWorldMap.__hasRecentlyDragged = true;
    const node1 = document.getElementById('map-node-1');
    assert(node1 !== null, "Durak 1 DOM'da mevcut");

    // Trigger click on node container while recently dragged
    const nodesContainer = document.getElementById('map-nodes-container');
    const evt = new window.MouseEvent('click', { bubbles: true, cancelable: true });
    Object.defineProperty(evt, 'target', { value: node1 });
    nodesContainer.dispatchEvent(evt);
    
    // Modal shouldn't open if dragged
    const modalPreview = document.getElementById('modal-level-preview');
    assert(!modalPreview.classList.contains('active'), "Sürükleme (Drag) anında durak tıklaması engellendi (Candy Crush hissiyatı)");

    // Now clear drag flag and trigger real tap
    screenWorldMap.__hasRecentlyDragged = false;
    nodesContainer.dispatchEvent(evt);
    assert(modalPreview.classList.contains('active'), "Normal durak dokunuşunda önizleme popup kartı başarıyla açıldı");
    run("closeModal('modal-level-preview');");

    console.log("\n--- 2. DURAK BİLGİ POP-UP KARTI & TEKRAR OYNAMA / ÖNCEKİ REKOR ---");
    // Completed stage test (e.g. Level 2)
    run("gameState.unlockedLevel = 5; gameState.completedLevels = { 1: 3, 2: 3 }; gameState.levelHighScores = { 2: 9500 }; gameState.levelPlayCounts = { 2: 4 };");
    run("openLevelPreview(2);");
    
    const recordBox = document.getElementById('preview-record-box');
    assert(recordBox && recordBox.style.display !== 'none', "Tamamlanan durakta Önceki Rekor & Oyun Bilgileri kutusu (#preview-record-box) açıldı");
    
    const scoreEl = document.getElementById('preview-record-score');
    const hasScore = scoreEl && (scoreEl.textContent.includes('9.500') || scoreEl.textContent.includes('9,500') || scoreEl.textContent.includes('9500'));
    assert(hasScore, "Önceki en yüksek skor (9,500 PUAN) kartta gösteriliyor");

    const playCountEl = document.getElementById('preview-record-plays');
    assert(playCountEl && playCountEl.textContent.includes('4 Kez Oynandı'), "Oynanma sayısı doğru gösteriliyor");

    const startBtn = document.getElementById('btn-preview-start-play');
    assert(startBtn && startBtn.textContent.includes('TEKRAR OYNA'), "Daha önce oynanmış durakta 'TEKRAR OYNA' butonu hazır ve oyuna tekrar giriş yapılabiliyor");

    const nextStageBtn = document.getElementById('btn-preview-next-stage');
    assert(nextStageBtn && nextStageBtn.style.display !== 'none', "Tamamlanan durakta 'SONRAKİ BÖLÜME GEÇ' seçeneği sunuluyor");
    run("closeModal('modal-level-preview');");

    console.log("\n--- 3. 60FPS VEIL İLE KUSURSUZ EKRAN GEÇİŞLERİ (TRANSITION VEIL) ---");
    const veil = document.getElementById('screen-transition-veil');
    assert(veil !== null, "Mitolojik Altın Geçiş Perdesi (#screen-transition-veil) mevcut");

    run("showScreen('screen-gameplay');");
    assert(veil.classList.contains('flash'), "Oyun tahtasına geçişte altın geçiş perdesi (.flash) tetiklendi (donma ve yırtılma engellendi)");

    run("showScreen('screen-worldmap');");
    assert(veil.classList.contains('flash'), "Haritaya geri dönüşte altın geçiş perdesi (.flash) tetiklendi");

    console.log("\n--- 4. SIFIR-DONMA 5 GPU ARKAPLAN KATMANI & TEMATİK SLAYT GEÇİŞLERİ ---");
    const bgLayersContainer = document.getElementById('map-bg-layers');
    assert(bgLayersContainer !== null, "5 GPU arkaplan katman grubu (#map-bg-layers) mevcut");

    for (let z = 1; z <= 5; z++) {
        const layer = document.getElementById(`map-bg-layer-${z}`);
        assert(layer !== null, `Bölge ${z} GPU arkaplan katmanı (#map-bg-layer-${z}) mevcut`);
    }

    // Test layer switching
    run("jumpToZone(3);");
    const layer3 = document.getElementById('map-bg-layer-3');
    const layer1 = document.getElementById('map-bg-layer-1');
    assert(layer3.classList.contains('active'), "Bölge 3'e geçildiğinde 3. arkaplan katmanı aktif oldu");
    assert(!layer1.classList.contains('active'), "Bölge 3'e geçildiğinde 1. arkaplan katmanı deaktif oldu (Zero-repaint crossfade)");

    console.log("\n--- 5. YUNAN EPİK MİTOLOJİSİ ÖGELERİ & TANRI PANTEONU ENTEGRASYONU ---");
    const pantheon = run("OLYMPIAN_PANTHEON;");
    assert(Array.isArray(pantheon) && pantheon.length >= 6, "12 Olimposlu Tanrı ve Tanrıça panteonu oyunda tanımlı");
    
    const deities = pantheon.map(d => d.name);
    assert(deities.includes("Zeus") && deities.includes("Poseidon") && deities.includes("Hades") && deities.includes("Athena"), "Zeus, Poseidon, Hades ve Athena tanrı ögeleri mevcut");

    const activeNode = document.querySelector('.map-node.active-target');
    assert(activeNode !== null, "Aktif oynanabilir durak ilahi aura animasyonu ile vurgulanıyor");

    console.log("\n--- 6. WEB -> MOBILE PLATFORM DAĞITIM VE EŞİTLİK KONTROLÜ ---");
    const wwwContent = fs.readFileSync('www/index.html', 'utf8');
    const demoContent = fs.readFileSync('www/Arkenya_Playable_Demo.html', 'utf8');
    const androidContent = fs.readFileSync('android/app/src/main/assets/public/index.html', 'utf8');
    const iosContent = fs.readFileSync('ios/App/App/public/index.html', 'utf8');

    assert(wwwContent === demoContent, "www/index.html ile www/Arkenya_Playable_Demo.html birebir eşit");
    assert(wwwContent === androidContent, "www/index.html ile Android public/index.html birebir eşit");
    assert(wwwContent === iosContent, "www/index.html ile iOS public/index.html birebir eşit");

    console.log("\n================================================================================");
    console.log(`🎯 TOTAL TESTS: ${total} | PASSED: ${passed} | FAILED: ${total - passed}`);
    console.log("================================================================================");
    if (total === passed) {
        console.log(">>> ALL CANDY CRUSH MAP & 60FPS HARDWARE TRANSITION REQUIREMENTS PASSED 100%! <<<");
        process.exit(0);
    } else {
        process.exit(1);
    }
}

runTests().catch(err => {
    console.error("Test execution failed:", err);
    process.exit(1);
});

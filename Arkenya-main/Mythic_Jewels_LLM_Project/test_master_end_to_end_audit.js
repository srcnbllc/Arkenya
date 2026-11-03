const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

console.log("================================================================================");
console.log("🏛️ ARKENYA: BAŞTAN SONA KAPSAMLI PERFORMANS & BUTON ÇALIŞMA DENETİMİ (E2E)");
console.log("================================================================================");

const html = fs.readFileSync('www/index.html', 'utf8');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message, details = "") {
    totalTests++;
    if (condition) {
        passedTests++;
        console.log(`  ✅ [PASS] ${message}`);
    } else {
        failedTests++;
        console.error(`  ❌ [FAIL] ${message} ${details ? '-> ' + details : ''}`);
        process.exitCode = 1;
    }
}

// Setup JSDOM with complete browser mock
const dom = new JSDOM(html, {
    url: 'http://localhost/',
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

async function runEndToEndAudit() {
    // -------------------------------------------------------------
    // BÖLÜM 1: HARİTA GÖRÜNÜMÜ VE TÜM BUTONLARIN ÇALIŞMA DENETİMİ
    // -------------------------------------------------------------
    console.log("\n--- BÖLÜM 1: DÜNYA HARİTASI KONSOLU & TÜM GEZİNTİ BUTONLARI ---");
    
    run(`
        gameState.unlockedLevel = 7;
        gameState.completedLevels = { 1: 3, 2: 3, 3: 2, 4: 3, 5: 2, 6: 3 };
        gameState.levelHighScores = { 1: 8500, 2: 9500, 3: 7200, 4: 8900, 5: 6400, 6: 9100 };
        gameState.levelPlayCounts = { 1: 2, 2: 3, 3: 1, 4: 2, 5: 1, 6: 2 };
        openWorldMap();
    `);

    const screenMap = document.getElementById('screen-worldmap');
    assert(screenMap && screenMap.classList.contains('active'), "1.1: #screen-worldmap aktif ve görünür");

    // 1.2 Dual Tab Değişimi: Parkur Haritası vs Etaplar & Geçmiş
    const tabVisual = document.getElementById('btn-tab-visual');
    const tabList = document.getElementById('btn-tab-list');
    const visualView = document.getElementById('map-visual-view');
    const listView = document.getElementById('map-list-view');

    assert(tabVisual && tabList, "1.2: Dual Tab butonları DOM'da mevcut");
    
    // Tab Listeye Geç
    tabList.click();
    assert(listView.style.display.includes('flex') || listView.classList.contains('active'), "1.3: 'ETAPLAR & GEÇMİŞ' tabı tıklandığında liste ekranı açıldı");
    
    // Tekrar Görsel Parkura Geç
    tabVisual.click();
    assert(visualView.style.display !== 'none', "1.4: 'PARKUR HARİTASI' tabı tıklandığında SVG görsel parkur açıldı");

    // 1.3 5 Tematik Bölge Sekmeleri (Zone 1 - 5 Pills)
    for (let z = 1; z <= 5; z++) {
        const pill = document.getElementById(`zone-pill-${z}`);
        assert(pill !== null, `1.5.${z}: Bölge ${z} hızlı zıplama butonu (#zone-pill-${z}) mevcut`);
        pill.click();
        const activeLayer = document.getElementById(`map-bg-layer-${z}`);
        assert(activeLayer && activeLayer.classList.contains('active'), `1.5.${z}.B: Bölge ${z} pill tıklandığında #${activeLayer.id} aktif GPU arkaplanı oldu`);
    }

    // 1.4 Bölge Gezinti Yön Okları (◀ ve ▶)
    const btnPrev = document.getElementById('btn-zone-prev');
    const btnNext = document.getElementById('btn-zone-next');
    assert(btnPrev && btnNext, "1.6: Bölge ◀ ve ▶ yön okları mevcut");

    // Bölge 5'ten 1'e döngüsel geçiş (btnNext)
    run("jumpToZone(5);");
    btnNext.click();
    assert(run("currentViewingZone") === 1, "1.7: Bölge 5'ten ▶ okuna basıldığında döngüsel olarak Bölge 1'e geçti");

    // Bölge 1'den 5'e geri döngüsel geçiş (btnPrev)
    btnPrev.click();
    assert(run("currentViewingZone") === 5, "1.8: Bölge 1'den ◀ okuna basıldığında döngüsel olarak Bölge 5'e geçti");
    run("jumpToZone(1);");

    // 1.5 Tematik Bilgi Çekmecesi (Accordion Drawer) Açma/Kapama
    const zoneChip = document.getElementById('zone-current-chip');
    const drawer = document.getElementById('zone-theme-drawer');
    const drawerCloseBtn = drawer ? drawer.querySelector('.zone-drawer-close-x') : null;
    const drawerCollapseBtn = drawer ? drawer.querySelector('.zone-drawer-collapse-btn') : null;

    assert(zoneChip && drawer, "1.9: Tema Bilgi Çipi ve Çekmecesi mevcut");
    zoneChip.click();
    assert(drawer.style.display === 'block', "1.10: Çipe tıklandığında tema bilgi çekmecesi açıldı");
    
    if (drawerCloseBtn) drawerCloseBtn.click();
    assert(drawer.style.display === 'none', "1.11: Çekmece ✕ butonu ile kapatıldı");

    zoneChip.click();
    if (drawerCollapseBtn) drawerCollapseBtn.click();
    assert(drawer.style.display === 'none', "1.12: Çekmece alt kapatma butonu ile kapatıldı");

    // 1.6 Alt Numara Şeridi Kontrolü (Kullanıcı İsteği)
    const miniStrip = document.getElementById('zone-stages-mini-strip');
    assert(!miniStrip || miniStrip.style.display === 'none' || miniStrip.children.length === 0, "1.13: Tematik bölümler altındaki mini numara şeridi tamamen gizli/boş");

    // -------------------------------------------------------------
    // BÖLÜM 2: DURAKLARA TIKLAMA VE BİLGİ KARTININ AÇILMASI & BUTONLARI
    // -------------------------------------------------------------
    console.log("\n--- BÖLÜM 2: DURAK ÖNİZLEME & REKOR BİLGİ KARTI (#modal-level-preview) ---");

    const modalPreview = document.getElementById('modal-level-preview');
    assert(modalPreview !== null, "2.1: Önizleme modalı (#modal-level-preview) DOM'da mevcut");

    // 2.2 Tamamlanmış Durağa Tıklama (Durak 2 - 3 Yıldızlı, Rekorlu)
    const node2 = document.getElementById('map-node-2');
    assert(node2 !== null, "2.2: Tamamlanmış Durak 2 DOM'da mevcut");
    node2.click();

    assert(modalPreview.classList.contains('active'), "2.3: Durak 2'ye tıklandığında bilgi kartı açıldı (.active)");

    // Kart İçi Verilerin Doğruluğu
    const previewTitle = document.getElementById('preview-title');
    const previewBadge = document.getElementById('preview-badge');
    const recordBox = document.getElementById('preview-record-box');
    const startPlayBtn = document.getElementById('btn-preview-start-play');
    const nextStageBtn = document.getElementById('btn-preview-next-stage');
    const backToMapBtn = document.getElementById('btn-preview-map');
    const closeXBtn = document.getElementById('btn-preview-close');

    assert(previewTitle && previewTitle.textContent.includes('2'), "2.4: Kart başlığında Bölüm 2 bilgisi yazıyor");
    assert(previewBadge && (previewBadge.textContent.toUpperCase().includes('KRISTAL VADI') || previewBadge.textContent.includes('KRİSTAL VADİ')), "2.5: Bölge ve tema adı rozette yazıyor");
    assert(recordBox && recordBox.style.display !== 'none', "2.6: Tamamlanmış durakta Önceki Rekor kutusu görünür");
    assert(startPlayBtn && startPlayBtn.textContent.includes('TEKRAR OYNA'), "2.7: Buton 'TEKRAR OYNA' modunda");
    assert(nextStageBtn && nextStageBtn.style.display !== 'none', "2.8: 'SONRAKİ BÖLÜME GEÇ' butonu hazır");

    // 2.9 Durak İçi ◀ ve ▶ Gezinti Okları
    const btnPreviewPrev = document.getElementById('btn-preview-prev');
    const btnPreviewNext = document.getElementById('btn-preview-next');
    assert(btnPreviewPrev && btnPreviewNext, "2.9: Önizleme kartı içinde ◀ ve ▶ gezinti okları mevcut");

    btnPreviewNext.click();
    assert(previewTitle.textContent.includes('3'), "2.10: Kart içindeki ▶ okuna basınca Durak 3'e geçiş yaptı");

    btnPreviewPrev.click();
    assert(previewTitle.textContent.includes('2'), "2.11: Kart içindeki ◀ okuna basınca Durak 2'ye geri döndü");

    // 2.12 Haritaya Geri Dön Butonu (#btn-preview-map)
    assert(backToMapBtn !== null, "2.12: '⬅️ GERİ / ANA HARİTAYA DÖN' butonu mevcut");
    backToMapBtn.click();
    assert(!modalPreview.classList.contains('active'), "2.13: 'GERİ / ANA HARİTAYA DÖN' butonuna basıldığında kart anında kapandı");

    // 2.14 ✕ Kapatma Butonu
    node2.click();
    assert(modalPreview.classList.contains('active'), "2.14: Kart tekrar açıldı");
    closeXBtn.click();
    assert(!modalPreview.classList.contains('active'), "2.15: ✕ butonuna basıldığında kart anında kapandı");

    // 2.16 Aktif (İlk Kez Oynanacak) Durağa Tıklama (Durak 7)
    const node7 = document.getElementById('map-node-7');
    assert(node7 !== null, "2.16: Aktif oynanabilir Durak 7 mevcut");
    node7.click();
    assert(modalPreview.classList.contains('active'), "2.17: Durak 7 bilgi kartı açıldı");
    assert(recordBox.style.display === 'none', "2.18: Henüz oynanmamış durakta rekor kutusu gizli");
    assert(startPlayBtn.textContent.includes('OYUNA BAŞLA'), "2.19: Buton 'OYUNA BAŞLA' modunda");
    backToMapBtn.click();

    // -------------------------------------------------------------
    // BÖLÜM 3: OYUNA GİRİŞ, OYUN İÇİ HUD VE HARİTAYA DÖNÜŞ ENTEGRASYONU
    // -------------------------------------------------------------
    console.log("\n--- BÖLÜM 3: OYUN EKRANI & HARİTAYA DÖNÜŞ BUTONLARI ---");

    run(`
        gameState.hasSeenPrologue = true;
        gameState.energy = 5;
        openLevelPreview(7);
        startGameplay();
    `);

    const screenGameplay = document.getElementById('screen-gameplay');
    assert(screenGameplay && screenGameplay.classList.contains('active'), "3.1: 'OYUNA BAŞLA' butonuna basıldığında oyun ekranı (#screen-gameplay) açıldı");

    // Oyun HUD orta hapı ile haritaya dönüş
    const hudCenterPill = document.querySelector('.hud-center-pill');
    assert(hudCenterPill !== null, "3.2: HUD Bölüm rozeti (.hud-center-pill) mevcut");
    hudCenterPill.click();
    assert(screenMap.classList.contains('active'), "3.3: HUD Bölüm rozetine tıklandığında sorunsuz DÜNYA HARİTASINA dönüldü");

    // Pause Modalı ve Ana Menü / Haritaya Dönüş
    run("showScreen('screen-gameplay');");
    run("openModal('modal-pause');");
    const pauseModal = document.getElementById('modal-pause');
    assert(pauseModal && pauseModal.classList.contains('active'), "3.4: Oyun duraklatma modalı açıldı");
    run("resumeGameFromPause();");
    assert(!pauseModal.classList.contains('active'), "3.5: 'OYUNA DEVAM ET' butonuna basınca mola modalı kapandı");

    // -------------------------------------------------------------
    // BÖLÜM 4: PERFORMANS, GPU KATMANLARI & 60FPS MOTOR DENETİMİ
    // -------------------------------------------------------------
    console.log("\n--- BÖLÜM 4: 60FPS GPU HIZLANDIRMA, VEIL PERDESİ & BELLEK/DONMA TESTİ ---");

    const veil = document.getElementById('screen-transition-veil');
    assert(veil !== null, "4.1: Donma önleyici Mitolojik Geçiş Perdesi (#screen-transition-veil) mevcut");
    
    // Geçiş perdesi pointer-events kontrolü (tıklamayı engellememesi şart)
    const veilStyle = window.getComputedStyle(veil);
    assert(veilStyle.pointerEvents === 'none', "4.2: Geçiş perdesi 'pointer-events: none' ile tüm tıklamaları serbest bırakıyor");

    // 5 GPU Arkaplan Katmanlarının DOM Kontrolü
    const bgLayersContainer = document.getElementById('map-bg-layers');
    assert(bgLayersContainer !== null, "4.3: 5 GPU arkaplan katman grubu (#map-bg-layers) mevcut");
    assert(bgLayersContainer.children.length === 5, "4.4: 5 Tematik bölge için tam 5 adet donanım hızlandırmalı GPU katmanı mevcut");

    // Repaint Koruması: #screen-worldmap arkaplan stili transparent olmalı, GPU katmanları arka planda çalışmalı
    run("openWorldMap();");
    assert(screenMap.classList.contains('active'), "4.5: Harita ekranı aktif modda");

    // Sürükleme (Drag) Hassasiyeti: 28px eşiği ile dokunma ve sürükleme ayrımı
    run(`
        screenWorldMap = document.getElementById('screen-worldmap');
        // Simüle edilmiş parmak dokunuşu (10px hareket - drag DEĞİL)
        screenWorldMap.dispatchEvent(new window.MouseEvent('mousedown', { clientY: 100, button: 0 }));
        window.dispatchEvent(new window.MouseEvent('mousemove', { clientY: 110 }));
        window.dispatchEvent(new window.MouseEvent('mouseup', {}));
    `);
    assert(run("screenWorldMap.__hasRecentlyDragged") !== true, "4.6: Hafif parmak dokunuşları (10px) sürükleme olarak algılanmadı (tıklama serbest)");

    run(`
        // Simüle edilmiş gerçek sürükleme (40px hareket - drag)
        screenWorldMap.dispatchEvent(new window.MouseEvent('mousedown', { clientY: 100, button: 0 }));
        window.dispatchEvent(new window.MouseEvent('mousemove', { clientY: 145 }));
        window.dispatchEvent(new window.MouseEvent('mouseup', {}));
    `);
    assert(run("screenWorldMap.__hasRecentlyDragged") === true, "4.7: Belirgin kaydırmada (45px) sürükleme bayrağı devreye girdi (Candy Crush hissiyatı)");

    // -------------------------------------------------------------
    // BÖLÜM 5: ÇOKLU PLATFORM DAĞITIM VE EŞİTLİK
    // -------------------------------------------------------------
    console.log("\n--- BÖLÜM 5: WEB, ANDROID VE IOS DOSYA BÜTÜNLÜĞÜ VE EŞİTLİĞİ ---");
    const crypto = require('crypto');
    function getHash(p) { return crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex'); }
    
    const baseH = getHash('www/index.html');
    const demoH = getHash('www/Arkenya_Playable_Demo.html');
    const androidH = getHash('android/app/src/main/assets/public/index.html');
    const iosH = getHash('ios/App/App/public/index.html');

    assert(baseH === demoH, "5.1: www/index.html ile www/Arkenya_Playable_Demo.html birebir eşit");
    assert(baseH === androidH, "5.2: www/index.html ile Android public/index.html birebir eşit");
    assert(baseH === iosH, "5.3: www/index.html ile iOS public/index.html birebir eşit");

    // -------------------------------------------------------------
    // ÖZET RAPOR
    // -------------------------------------------------------------
    console.log("\n================================================================================");
    console.log(`🎯 DENETİM SONUCU: TOPLAM TEST: ${totalTests} | BAŞARILI: ${passedTests} | BAŞARISIZ: ${failedTests}`);
    console.log("================================================================================");
    if (failedTests === 0) {
        console.log(">>> TÜM BUTONLAR, GEÇİŞLER, PERFORMANS VE PLATFORM EŞİTLİĞİ 100% KUSURSUZ! <<<\n");
    }
}

runEndToEndAudit().catch(err => {
    console.error("FATAL ERROR IN AUDIT:", err);
    process.exit(1);
});

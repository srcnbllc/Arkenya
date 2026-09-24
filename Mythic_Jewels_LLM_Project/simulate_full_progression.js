const fs = require('fs');
const { JSDOM } = require('jsdom');

console.log("=== 50-LEVEL PROGRESSION SIMULATION & ROOT CAUSE ANALYSIS (5 BY 5 BRACKETS) ===");

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
const run = (code) => window.eval(code);

function simulateBrackets() {
    const levelData = run("LEVEL_DATA");
    const heroes = run("HEROES");
    const biomeLore = run("BIOME_LORE");

    console.log(`Loaded ${Object.keys(levelData).length} total levels.`);

    const brackets = [
        { name: "Grup 1: Bölüm 1 - 5 (Herkül Başlangıcı & Temel Mekanikler)", start: 1, end: 5 },
        { name: "Grup 2: Bölüm 6 - 10 (Kristal Vadi & 1. Boss Hades Kapısı)", start: 6, end: 10 },
        { name: "Grup 3: Bölüm 11 - 15 (Yeraltı Dünyası - Styx & Kerberos)", start: 11, end: 15 },
        { name: "Grup 4: Bölüm 16 - 20 (Tartarus Zirvesi & 2. Boss Poseidon)", start: 16, end: 20 },
        { name: "Grup 5: Bölüm 21 - 25 (Ege Adaları & Tanrısal Tapınaklar)", start: 21, end: 25 },
        { name: "Grup 6: Bölüm 26 - 30 (Demirciler & 3. Boss Zeus)", start: 26, end: 30 },
        { name: "Grup 7: Bölüm 31 - 35 (Efsaneler & Kadim Kahramanlar)", start: 31, end: 35 },
        { name: "Grup 8: Bölüm 36 - 40 (Canavarlar Meclisi & 4. Boss Hades Dönüşü)", start: 36, end: 40 },
        { name: "Grup 9: Bölüm 41 - 45 (Olimpos Etekleri & Kadim Güçler)", start: 41, end: 45 },
        { name: "Grup 10: Bölüm 46 - 50 (Olimpos Zirvesi & Grand Boss)", start: 46, end: 50 }
    ];

    for (const b of brackets) {
        console.log(`\n======================================================`);
        console.log(`📊 ${b.name.toUpperCase()}`);
        console.log(`======================================================`);

        for (let lvl = b.start; lvl <= b.end; lvl++) {
            const data = levelData[lvl];
            if (!data) {
                console.error(`  [FAIL] Level ${lvl} data is missing!`);
                continue;
            }

            const pointsPerMoveRequired = Math.round(data.targetScore / data.maxMoves);
            const biomeId = run(`getZoneForLevel(${lvl})`);
            const biome = biomeLore[biomeId] ? biomeLore[biomeId].name : "Bilinmeyen";

            let specialFeature = "-";
            if (lvl === 1) specialFeature = "👉 3'lü Eşleştirme Eğitimi";
            else if (lvl === 2) specialFeature = "⚡ 4'lü Yıldırım Kristali Eğitimi";
            else if (lvl === 3) specialFeature = "💥 5'li T/L Bomba Eğitimi";
            else if (lvl === 4) specialFeature = "🌈 5'li Düz Zeus Küresi Eğitimi";
            else if (lvl === 5) specialFeature = "🛡️ Kahraman İlahi Gücü & Kombo Barı";
            else if (lvl === 10) specialFeature = "👑 BOSS HADES & Nyra Kahramanı Kilidi Açılışı";
            else if (lvl === 20) specialFeature = "👑 BOSS POSEIDON & Su Fırtınası";
            else if (lvl === 25) specialFeature = "🛡️ Thalor Kahramanı Kilidi Açılışı";
            else if (lvl === 30) specialFeature = "👑 BOSS ZEUS & Şimşekler Meclisi";
            else if (lvl === 40) specialFeature = "👑 BOSS HADES II & Karanlık Dönüş";
            else if (lvl === 50) specialFeature = "👑 GRAND BOSS ZEUS & Efsanevi Şampiyonluk";

            console.log(`  Bölüm ${lvl.toString().padStart(2, ' ')}: "${data.title}" | Hedef: ${data.targetScore.toLocaleString().padStart(6, ' ')} | Hamle: ${data.maxMoves} | Oran: ${pointsPerMoveRequired} p/hamle | Biyom: ${biome} | Özellik: ${specialFeature}`);
        }
    }
}

simulateBrackets();

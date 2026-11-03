const fs = require('fs');
const path = require('path');

console.log("=== CLEANING THEME_SAGA_DATA ENCODING ===");

const indexPath = path.join(__dirname, 'www', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

const oldSagaStart = 'const THEME_SAGA_DATA = {';
const oldSagaEnd = 'function getThemeSagaForLevel(levelId) {';

const newSagaBlock = `const THEME_SAGA_DATA = {
            1: {
                themeId: 1,
                startLevel: 1,
                endLevel: 10,
                themeTitle: "Işığın Şafağı ve Kristal Vadi",
                badge: "BÖLÜM 1 - 10 • KRİSTAL VADİ",
                audioKey: "saga_theme_1",
                audioFile: "assets/audio/saga_theme_1.mp3",
                storyText: "Gözlerini aç evlat... Olimpos'un ilahi zirvesinden çalınan kutsal kristaller bu vadiye saçıldı. Kadim mühürler kırıldı, gök yarıldı ve tanrıların gücü mücevherlerin içine hapsoldu. Şimdi önünde uzanan Kristal Vadi, senin ilk sınavındır. 3 kutsal taşı yan yana getir, zinciri kur ve uyanışı başlat. Çünkü kader, önüne serilen taşlar değil; o taşlara vurduğun akıl ve yürektir..."
            },
            2: {
                themeId: 2,
                startLevel: 11,
                endLevel: 20,
                themeTitle: "Poseidon'un Öfkesi ve Fırtına Koyu",
                badge: "BÖLÜM 11 - 20 • FIRTINA KOYU",
                audioKey: "saga_theme_2",
                audioFile: "assets/audio/saga_theme_2.mp3",
                storyText: "İlk zaferin yankısı henüz dinmeden, yolumuz Poseidon'un azgın sularına uzandı. Kristal Vadi'yi aştın; lâkin şimdi karşında göğü döven şimşekler ve Fırtına Koyu var! Üç dişli mızrağın kudreti suları coşturuyor. Korkma! Şimşek arkını yakala, dalgaları yar ve fırtınanın kalbine doğru ilerle..."
            },
            3: {
                themeId: 3,
                startLevel: 21,
                endLevel: 30,
                themeTitle: "Hades'in Gazabı ve Yeraltı Dünyası",
                badge: "BÖLÜM 21 - 30 • YERALTI DÜNYASI",
                audioKey: "saga_theme_3",
                audioFile: "assets/audio/saga_theme_3.mp3",
                storyText: "Gökyüzü karardı, yeryüzü yarıldı... Artık Hades'in hüküm sürdüğü Yeraltı Labirenti'ndeyiz. Bu diyarda taşlar kömür gibi yanar, engeller kaskatı kesilir. Zayıflar için burada umut yok; ancak senin gibi kararlı bir savaşçı için her lav havuzu, yeni bir gücün kaynağıdır. Zincirleri kır, gölgeleri yar ve yeraltının karanlığını kendi ışığınla aydınlat..."
            },
            4: {
                themeId: 4,
                startLevel: 31,
                endLevel: 40,
                themeTitle: "Athena'nın Zekası ve Titan Kalesi",
                badge: "BÖLÜM 31 - 40 • TİTAN KALESİ",
                audioKey: "saga_theme_4",
                audioFile: "assets/audio/saga_theme_4.mp3",
                storyText: "Ateşin ve gölgelerin içinden sağ çıktın. Şimdi ise savaşın değil, saf aklın ve stratejinin tapınağındasın: Titan Kalesi ve Prizma Surları! Athena'nın kalkanı Aegis burada parıldıyor. Kaba kuvvet yetmez evlat; her hamleni satranç ustası gibi hesaplamalı, ilahi prizmaları zekanla hizalamalısın. Tahtanın fatihi olmak için zihnini kılıçtan daha keskin bile!"
            },
            5: {
                themeId: 5,
                startLevel: 41,
                endLevel: 50,
                themeTitle: "Zeus'un Yüce Olimpos Zirvesi",
                badge: "BÖLÜM 41 - 50 • OLİMPOS ZİRVESİ",
                audioKey: "saga_theme_5",
                audioFile: "assets/audio/saga_theme_5.mp3",
                storyText: "Nihayet... Bulutların ötesinde, tanrıların tahtındayız: Olimpos Zirvesi! Yıldırımların Efendisi Zeus, senin adımlarını izledi. Şimdi kaderin mührünü vurma, efsaneni altın harflerle göklere kazıma vaktidir. Tüm elementleri birleştir, tanrısal kombolarla gökleri inlet ve nihai zafer tacını başına tak! Arkenya'nın ebedi kahramanı olmaya hazır mısın?"
            }
        };

        `;

const sIdx = html.indexOf(oldSagaStart);
const eIdx = html.indexOf(oldSagaEnd);
if (sIdx !== -1 && eIdx !== -1) {
    html = html.substring(0, sIdx) + newSagaBlock + html.substring(eIdx);
    console.log("Cleaned THEME_SAGA_DATA successfully.");
}

fs.writeFileSync(indexPath, html, 'utf8');

// Synchronize all 5 targets
const targets = [
    path.join(__dirname, 'www', 'Arkenya_Playable_Demo.html'),
    path.join(__dirname, 'android', 'app', 'src', 'main', 'assets', 'public', 'index.html'),
    path.join(__dirname, 'android', 'app', 'src', 'main', 'assets', 'public', 'Arkenya_Playable_Demo.html'),
    path.join(__dirname, 'ios', 'App', 'App', 'public', 'index.html'),
    path.join(__dirname, 'ios', 'App', 'App', 'public', 'Arkenya_Playable_Demo.html')
];

for (const t of targets) {
    if (fs.existsSync(path.dirname(t))) {
        fs.writeFileSync(t, html, 'utf8');
        console.log("Synced to:", t);
    }
}
console.log("=== ALL TARGETS UPDATED WITH PURE UTF-8 THEME_SAGA_DATA ===");

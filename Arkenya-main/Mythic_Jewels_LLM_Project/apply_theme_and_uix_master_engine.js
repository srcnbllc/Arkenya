const fs = require('fs');
const path = require('path');

console.log("=== ARKENYA: APPLYING THEME, SAGA HARMONIZATION & UI/UX MASTER UPGRADE ===");

const indexPath = path.join(__dirname, 'www', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// 1. HARMONIZE THEME_SAGA_DATA TO EXACT 10-STAGE ZONE CHUNKS (1-10, 11-20, 21-30, 31-40, 41-50)
const oldThemeSagaDataRegex = /const THEME_SAGA_DATA = \{[\s\S]*?\n\s*\};\s*\n\s*const _blobUrlCache/;

const newThemeSagaData = `const THEME_SAGA_DATA = {
            1: {
                themeId: 1,
                startLevel: 1,
                endLevel: 10,
                themeTitle: "Işığın Şafağı ve Kristal Vadi",
                badge: "BÖLÜM 1 - 10 • KRİSTAL VADİ",
                audioKey: "saga_theme_1",
                audioFile: "assets/audio/saga_theme_1.mp3",
                storyText: "Gözlerini aç evlat... Olimpos'un ilahi zirvesinden çalınan kutsal kristaller bu vadiye saçıldı. Kadim mühürler kırıldı, gök yarıldı ve tanrıların gücü mücevherlerin içine hapsoldu. Şimdi önünde uzanan Kristal Vadi, senin ilk sınavındır. Üç kutsal taşı yan yana getir, zinciri kur ve uyanışı başlat. Çünkü kader, önüne serilen taşlar değil; o taşlara vurduğun akıl ve yürektir..."
            },
            2: {
                themeId: 2,
                startLevel: 11,
                endLevel: 20,
                themeTitle: "Poseidon'un Öfkesi ve Fırtına Kanyonu",
                badge: "BÖLÜM 11 - 20 • FIRTINA KANYONU",
                audioKey: "saga_theme_2",
                audioFile: "assets/audio/saga_theme_2.mp3",
                storyText: "İlk zaferin yankısı henüz dinmeden, yolumuz Poseidon'un azgın sularına uzandı. Kristal Vadi'yi aştın; lâkin şimdi karşında göğü döven şimşekler ve Fırtına Kanyonu var! Üç dişli mızrağın kudreti suları coşturuyor. Korkma! Şimşek arkını yakala, dalgaları yar ve fırtınanın kalbine doğru ilerle..."
            },
            3: {
                themeId: 3,
                startLevel: 21,
                endLevel: 30,
                themeTitle: "Hades'in Gazabı ve Yeraltı Lav Mağarası",
                badge: "BÖLÜM 21 - 30 • YERALTI MAĞARASI",
                audioKey: "saga_theme_3",
                audioFile: "assets/audio/saga_theme_3.mp3",
                storyText: "Fırtınayı geride bıraktın; lâkin şimdi yerin yedi kat dibindeyiz, Styx Nehri ve kor lavların diyarında! Yeraltı lordu Hades, obsidyenden kalkanlar dikmiş önümüze. Taş devi Thalor yanımızda duruyor. Vur çekici lav kalkanlarına, karanlığı aydınlat ve yerin dibinde adaleti sağla..."
            },
            4: {
                themeId: 4,
                startLevel: 31,
                endLevel: 40,
                themeTitle: "Donmuş Titan Geçidi ve Medusa'nın Laneti",
                badge: "BÖLÜM 31 - 40 • BUZUL GEÇİT",
                audioKey: "saga_theme_4",
                audioFile: "assets/audio/saga_theme_4.mp3",
                storyText: "Ateş fırtınasını geçtin; fakat zirveye giden yol, zamanın bile donduğu bu amansız buzul geçidinden geçiyor. Gorgon Medusa'nın soğuk bakışları taş etmiş zamanı. Zihnini toparla, Athena'nın bilgeliğini kalkan yap! Donmuş buzları parçala ve ilahi zirve kapısını arala..."
            },
            5: {
                themeId: 5,
                startLevel: 41,
                endLevel: 50,
                themeTitle: "Olimpos İlahi Zirvesi ve Kronos Kaosu",
                badge: "BÖLÜM 41 - 50 • İLAHİ ZİRVE",
                audioKey: "saga_theme_5",
                audioFile: "assets/audio/saga_theme_5.mp3",
                storyText: "İşte geldik yolun sonuna... Bulutları yaran Olimpos'un altın zirvesi gözlerinin önünde parıldıyor. Ancak kutsal tahtın üzerinde, zamanın efendisi titan Kronos bekliyor. Bu son savaş tüm panteonun savaşıdır. Kalbindeki inancı son taşlara vur, gök gürültüsünü çağır ve ebedi şampiyonluk tacını giy!"
            }
        };

        const _blobUrlCache`;

if (oldThemeSagaDataRegex.test(html)) {
    html = html.replace(oldThemeSagaDataRegex, newThemeSagaData);
    console.log("  [+] Harmonized THEME_SAGA_DATA to 5 x 10-stage zones");
}

// 2. UPDATE getThemeSagaForLevel TO USE getZoneForLevel
const oldGetThemeSagaFn = `        function getThemeSagaForLevel(levelId) {
            levelId = parseInt(levelId) || 1;
            if (levelId <= 5) return THEME_SAGA_DATA[1];
            if (levelId <= 15) return THEME_SAGA_DATA[2];
            if (levelId <= 25) return THEME_SAGA_DATA[3];
            if (levelId <= 35) return THEME_SAGA_DATA[4];
            return THEME_SAGA_DATA[5];
        }`;

const newGetThemeSagaFn = `        function getThemeSagaForLevel(levelId) {
            levelId = Math.max(1, Math.min(50, parseInt(levelId) || 1));
            const zone = (typeof getZoneForLevel === 'function') ? getZoneForLevel(levelId) : Math.ceil(levelId / 10);
            return THEME_SAGA_DATA[zone] || THEME_SAGA_DATA[1];
        }`;

if (html.includes(oldGetThemeSagaFn)) {
    html = html.replace(oldGetThemeSagaFn, newGetThemeSagaFn);
    console.log("  [+] Harmonized getThemeSagaForLevel with getZoneForLevel");
}

// 3. UI/UX: STICKY FOOTER ACTION BUTTONS & SCROLLABLE CONTENT BODY IN #modal-level-preview
const oldModalPreviewCardStart = `<div class="modal-card" style="width: 92%; max-width: 410px; padding: 18px 16px; box-sizing: border-box; border: 1.5px solid var(--gold-primary); background: radial-gradient(circle at top, #151e33 0%, #090e1c 100%); box-shadow: 0 16px 45px rgba(0,0,0,0.9), 0 0 25px rgba(245,197,66,0.15); border-radius: 20px; max-height: 94vh; overflow-y: auto;">`;

const newModalPreviewCardStart = `<div class="modal-card" style="width: 92%; max-width: 410px; padding: 16px 16px 12px; box-sizing: border-box; border: 1.5px solid var(--gold-primary); background: radial-gradient(circle at top, #151e33 0%, #090e1c 100%); box-shadow: 0 16px 45px rgba(0,0,0,0.9), 0 0 25px rgba(245,197,66,0.15); border-radius: 20px; max-height: 90vh; display: flex; flex-direction: column; overflow: hidden;">
                    
                    <!-- Fixed Modal Header -->
                    <div class="modal-preview-header" style="flex-shrink: 0;">`;

const targetHeaderClose = `                    <!-- Stage Emblem & Status Mode Banner (Issue 3: İlk Kez Oynanacak vs Daha Önce Oynanmış Durak) -->`;

const newScrollableBodyStart = `                    </div>

                    <!-- Scrollable Content Body for Mobile Comfort -->
                    <div class="modal-preview-scroll-body" style="flex: 1; overflow-y: auto; -webkit-overflow-scrolling: touch; padding-right: 2px; margin-bottom: 6px;">

                    <!-- Stage Emblem & Status Mode Banner (Issue 3: İlk Kez Oynanacak vs Daha Önce Oynanmış Durak) -->`;

const targetActionButtons = `                    <!-- Action Buttons (Requirement 5: Tekrar Oyna & Sonraki Bölüme Geç) -->
                    <button id="btn-preview-start-play"`;

const newStickyFooterActions = `                    </div> <!-- end .modal-preview-scroll-body -->

                    <!-- Sticky Bottom Action Footer (Always Visible on Any Mobile Viewport) -->
                    <div class="modal-preview-footer-actions" style="flex-shrink: 0; padding-top: 6px; border-top: 1px solid rgba(245, 197, 66, 0.2);">
                    <button id="btn-preview-start-play"`;

const targetModalCloseDiv = `                    <button class="btn-action-sub" id="btn-preview-map" style="min-height: 42px; height: auto; padding: 10px 14px; font-size: 13px; font-weight: 800; border-radius: 12px; width: 100%; display: flex; align-items: center; justify-content: center; letter-spacing: 0.5px; line-height: 1.25;" onclick="closeModal('modal-level-preview', true)">⬅️ GERİ / ANA HARİTAYA DÖN</button>
                </div>
            </div>`;

const newModalCloseDiv = `                    <button class="btn-action-sub" id="btn-preview-map" style="min-height: 42px; height: auto; padding: 10px 14px; font-size: 13px; font-weight: 800; border-radius: 12px; width: 100%; display: flex; align-items: center; justify-content: center; letter-spacing: 0.5px; line-height: 1.25;" onclick="closeModal('modal-level-preview', true)">⬅️ GERİ / ANA HARİTAYA DÖN</button>
                    </div> <!-- end .modal-preview-footer-actions -->
                </div>
            </div>`;

if (html.includes(oldModalPreviewCardStart) && !html.includes('class="modal-preview-scroll-body"')) {
    html = html.replace(oldModalPreviewCardStart, newModalPreviewCardStart);
    html = html.replace(targetHeaderClose, newScrollableBodyStart);
    html = html.replace(targetActionButtons, newStickyFooterActions);
    html = html.replace(targetModalCloseDiv, newModalCloseDiv);
    console.log("  [+] Converted #modal-level-preview to sticky-footer mobile UI/UX layout");
}

// 4. WRITE BACK AND SYNC TO ALL PLATFORMS
fs.writeFileSync(indexPath, html, 'utf8');
console.log("  [✓] Updated www/index.html");

const demoPath = path.join(__dirname, 'www', 'Arkenya_Playable_Demo.html');
fs.writeFileSync(demoPath, html, 'utf8');
console.log("  [✓] Synced www/Arkenya_Playable_Demo.html");

const androidPath = path.join(__dirname, 'android', 'app', 'src', 'main', 'assets', 'public', 'index.html');
if (fs.existsSync(androidPath)) {
    fs.writeFileSync(androidPath, html, 'utf8');
    console.log("  [✓] Synced android/.../public/index.html");
}

const androidDemoPath = path.join(__dirname, 'android', 'app', 'src', 'main', 'assets', 'public', 'Arkenya_Playable_Demo.html');
if (fs.existsSync(androidDemoPath)) {
    fs.writeFileSync(androidDemoPath, html, 'utf8');
    console.log("  [✓] Synced android/.../public/Arkenya_Playable_Demo.html");
}

const iosPath = path.join(__dirname, 'ios', 'App', 'App', 'public', 'index.html');
if (fs.existsSync(iosPath)) {
    fs.writeFileSync(iosPath, html, 'utf8');
    console.log("  [✓] Synced ios/.../public/index.html");
}

const iosDemoPath = path.join(__dirname, 'ios', 'App', 'App', 'public', 'Arkenya_Playable_Demo.html');
if (fs.existsSync(iosDemoPath)) {
    fs.writeFileSync(iosDemoPath, html, 'utf8');
    console.log("  [✓] Synced ios/.../public/Arkenya_Playable_Demo.html");
}

console.log("=== COMPLETED THEME & UI/UX UPGRADE DEPLOYMENT ===");

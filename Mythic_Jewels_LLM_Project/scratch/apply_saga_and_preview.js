const fs = require('fs');

let html = fs.readFileSync('www/index.html', 'utf8');

console.log("=== 1. REMOVING MODAL-PROLOGUE ===");
// Find and remove modal-prologue block completely
const prologueRegex = /\s*<!--\s*MODAL:\s*PROLOGUE[\s\S]*?id="modal-prologue"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;
if (prologueRegex.test(html)) {
    html = html.replace(prologueRegex, '');
    console.log("PASS: Removed modal-prologue HTML.");
} else {
    console.log("WARNING: modal-prologue block not matched via regex, searching substring...");
    const pStart = html.indexOf('id="modal-prologue"');
    if (pStart !== -1) {
        const commentStart = html.lastIndexOf('<!--', pStart);
        // Find closing divs: modal-overlay has inner modal-card story-scroll-card
        const nextOverlay = html.indexOf('<div class="modal-overlay"', pStart + 20);
        html = html.substring(0, commentStart) + html.substring(nextOverlay);
        console.log("PASS: Removed modal-prologue via substring.");
    }
}

console.log("=== 2. INJECTING CSS FOR PREVIEW STORY BUTTON & SOUNDWAVE ===");
const previewCss = `
        /* Mythic Level Preview Story & Audio Bar */
        .btn-preview-story {
            background: linear-gradient(135deg, rgba(245, 197, 66, 0.22), rgba(0, 210, 255, 0.16));
            border: 1px solid var(--gold-primary);
            border-radius: 18px;
            padding: 5px 10px;
            color: var(--gold-light);
            font-size: 11px;
            font-weight: 800;
            display: inline-flex;
            align-items: center;
            gap: 5px;
            cursor: pointer;
            box-shadow: 0 0 10px rgba(245, 197, 66, 0.2);
            transition: all 0.2s ease;
        }
        .btn-preview-story:active {
            transform: scale(0.96);
        }
        .preview-soundwave {
            display: inline-flex;
            align-items: center;
            gap: 2px;
            height: 12px;
        }
        .preview-soundwave span {
            width: 2.5px;
            height: 100%;
            background: var(--gold-primary);
            border-radius: 1px;
            animation: previewWave 0.8s infinite ease-in-out alternate;
        }
        .preview-soundwave span:nth-child(2) { animation-delay: 0.2s; }
        .preview-soundwave span:nth-child(3) { animation-delay: 0.4s; }
        .preview-soundwave span:nth-child(4) { animation-delay: 0.6s; }

        @keyframes previewWave {
            0% { height: 3px; }
            100% { height: 12px; }
        }
`;

if (!html.includes('.btn-preview-story')) {
    html = html.replace('</style>', `${previewCss}\n    </style>`);
    console.log("PASS: Injected .btn-preview-story and soundwave CSS.");
}

console.log("=== 3. UPDATING MODAL-LEVEL-PREVIEW HTML ===");
const oldPreviewStart = html.indexOf('<!-- MODAL: LEVEL PREVIEW');
const oldPreviewEnd = html.indexOf('<!-- MODAL: VICTORY', oldPreviewStart);

if (oldPreviewStart !== -1 && oldPreviewEnd !== -1) {
    const newPreviewHtml = `<!-- MODAL: LEVEL PREVIEW & THEME SAGA POPUP -->
            <div class="modal-overlay" id="modal-level-preview">
                <div class="modal-card" style="width: 92%; max-width: 410px; padding: 18px 16px; box-sizing: border-box; border: 1.5px solid var(--gold-primary); background: radial-gradient(circle, #151e33 0%, #090e1c 100%); box-shadow: 0 16px 45px rgba(0,0,0,0.9); border-radius: 18px;">
                    
                    <!-- Top Bar: Title & Top-Right Non-Forced 'HİKAYEYİ DİNLE' Button -->
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; gap: 8px;">
                        <div style="text-align: left;">
                            <div id="preview-badge" style="font-size: 10px; font-weight: 800; color: var(--gold-light); letter-spacing: 0.8px; text-transform: uppercase;">BÖLGE 1 • KRİSTAL VADİ</div>
                            <div class="modal-title" id="preview-title" style="font-size: 16px; margin-top: 2px; color: #fff; text-shadow: 0 0 12px rgba(245, 197, 66, 0.4);">BÖLÜM 1</div>
                        </div>

                        <!-- Top-Right 'HİKAYEYİ DİNLE' / 'DURDUR' Non-Forced Audio Button -->
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <button id="btn-preview-listen-story" class="btn-preview-story" onclick="togglePreviewStoryAudio()" title="Hikayeyi Dinle veya Duraklat">
                                <span id="preview-story-icon">🔊</span>
                                <span id="preview-story-text">HİKAYEYİ DİNLE</span>
                                <div class="preview-soundwave" id="preview-soundwave" style="display: none;">
                                    <span></span><span></span><span></span><span></span>
                                </div>
                            </button>
                            <div class="modal-close" style="position: static; font-size: 18px; cursor: pointer; color: #94a3b8; padding: 4px;" onclick="closeModal('modal-level-preview')">✕</div>
                        </div>
                    </div>

                    <!-- Mythic Parchment Story Box with Continuous Saga Lore -->
                    <div class="preview-saga-box" style="background: rgba(245, 197, 66, 0.05); border: 1px solid rgba(245, 197, 66, 0.25); border-radius: 12px; padding: 12px 14px; margin-bottom: 14px; text-align: left; position: relative;">
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                            <span id="preview-theme-title" style="font-size: 11px; font-weight: 800; color: var(--gold-primary); text-transform: uppercase; letter-spacing: 0.5px;">📜 KADİM DESTAN</span>
                            <span id="preview-theme-status" style="font-size: 9.5px; background: rgba(245, 197, 66, 0.15); color: var(--gold-light); padding: 2px 6px; border-radius: 6px; font-weight: 700;">İSTEĞE BAĞLI ANLATIM</span>
                        </div>
                        <div id="preview-story" style="font-size: 11.5px; color: #e2e8f0; font-style: italic; line-height: 1.5; max-height: 110px; overflow-y: auto;">
                            "Hikaye yükleniyor..."
                        </div>
                    </div>

                    <!-- Target & Moves Info Chips -->
                    <div style="display: flex; gap: 10px; margin-bottom: 14px; justify-content: space-between;">
                        <div style="flex: 1; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 8px 10px; text-align: center;">
                            <div style="font-size: 10px; color: #94a3b8; font-weight: 700; text-transform: uppercase;">🎯 HEDEF SKOR</div>
                            <div style="font-size: 15px; font-weight: 900; color: var(--gold-light); margin-top: 2px;" id="preview-target">4,000</div>
                        </div>
                        <div style="flex: 1; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 8px 10px; text-align: center;">
                            <div style="font-size: 10px; color: #94a3b8; font-weight: 700; text-transform: uppercase;">🦶 TOPLAM HAMLE</div>
                            <div style="font-size: 15px; font-weight: 900; color: var(--accent-blue); margin-top: 2px;" id="preview-moves">25</div>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <button class="btn-action btn-action-gold" style="height: 48px; font-size: 14.5px; width: 100%; margin-bottom: 8px;" onclick="startGameplay()">⚡ OYUNA BAŞLA (⚡ 1 Can)</button>
                    <button class="btn-action-sub" style="height: 38px; font-size: 12.5px; width: 100%;" onclick="closeModal('modal-level-preview')">🗺️ HARİTAYA DÖN</button>
                </div>
            </div>

            `;
    html = html.substring(0, oldPreviewStart) + newPreviewHtml + html.substring(oldPreviewEnd);
    console.log("PASS: Replaced modal-level-preview with modern theme-saga modal.");
}

console.log("=== 4. DEFINING THEME_SAGA_DATA & SAGA AUDIO CONTROLS ===");
const sagaEngineCode = `
        // ==========================================
        // 5 CONTINUOUS SAGA THEMES & AUDIO ENGINE
        // Complete Tolkien / Mythic Saga Continuity
        // 100% Spelled Out Turkish (No Acronyms / Pure Pronunciation)
        // ==========================================
        const THEME_SAGA_DATA = {
            1: {
                themeId: 1,
                startLevel: 1,
                endLevel: 5,
                themeTitle: "Işığın Şafağı ve Kadim Uyanış",
                badge: "BÖLÜM 1 - 5 • KRİSTAL VADİ",
                audioKey: "saga_theme_1",
                audioFile: "assets/audio/saga_theme_1.mp3",
                storyText: "Gözlerini aç evlat... Milattan Önce üç bin yılında, Olimpos'un ilahi zirvesinden çalınan kutsal ateş bu topraklara düştü. Kadim mühürler kırıldı, gök yarıldı ve tanrıların gücü mücevherlerin içine hapsoldu. Şimdi önünde uzanan bu Kristal Vadi, senin ilk sınavındır. Üç kutsal taşı yan yana getir, zinciri kur ve uyanışı başlat. Çünkü kader, önüne serilen taşlar değil; o taşlara vurduğun akıl ve yürektir..."
            },
            2: {
                themeId: 2,
                startLevel: 6,
                endLevel: 15,
                themeTitle: "Kayıp Tapınak ve Styx Nehri",
                badge: "BÖLÜM 6 - 15 • ÖLÜLER DİYARI",
                audioKey: "saga_theme_2",
                audioFile: "assets/audio/saga_theme_2.mp3",
                storyText: "İlk zaferin yankısı henüz dinmeden, yolumuz yerin yedi kat altına uzandı. Kristal Vadi'yi aştın; lâkin şimdi karşında ölüler diyarı ve Styx Nehri uzanıyor. Sular zifiri karanlık, taşlar buz gibi soğuktur. Kharon'un kadim kayığı kıyıda beklerken, Hades'in bekçileri her köşede pusuda. Korkma! Poseydon'un sularını yar, mızrağın gücünü taşlara vur ve karanlık nehrin akışını tersine çevir..."
            },
            3: {
                themeId: 3,
                startLevel: 16,
                endLevel: 25,
                themeTitle: "Ares'in Gazabı ve Titanlar Vadisi",
                badge: "BÖLÜM 16 - 25 • SAVAŞ MEYDANI",
                audioKey: "saga_theme_3",
                audioFile: "assets/audio/saga_theme_3.mp3",
                storyText: "Nehrin karanlığını ardında bıraktın; lâkin ateşin ve kılıcın çağı yeni başlıyor! Göğü kızıla boyayan volkanlar patlıyor; savaş tanrısı Ares'in öfkesi vadileri titretiyor. Kadim titanlar zincirlerinden kurtulmak için tahtayı sarsıyor. Şimdi tereddüt zamanı değildir! Şimşekleri kuşan, dörtlü ve beşli patlamalarla yeri göğü inlet. Olimpos'un kaderi bu kızıl savaş meydanında yazılacak..."
            },
            4: {
                themeId: 4,
                startLevel: 26,
                endLevel: 35,
                themeTitle: "Donmuş Labirent ve Medusa'nın Laneti",
                badge: "BÖLÜM 26 - 35 • BUZUL GEÇİT",
                audioKey: "saga_theme_4",
                audioFile: "assets/audio/saga_theme_4.mp3",
                storyText: "Ateş fırtınasını geçtin; fakat zirveye giden yol, zamanın bile donduğu bu amansız labirentten geçiyor. Gorgon Medusa'nın bakışları altındaki taşlar kaskatı kesilmiş. En ufak bir dikkatsizlik, seni de sonsuz bir taş heykele çevirebilir. Zihnini toparla, Athena'nın bilgeliğini kalkan yap! Hamlelerini iyi hesapla ve donmuş buzları parçalayarak ilahi kapıyı arala..."
            },
            5: {
                themeId: 5,
                startLevel: 36,
                endLevel: 50,
                themeTitle: "Olimpos İlahi Zirvesi ve Kronos",
                badge: "BÖLÜM 36 - 50 • İLAHİ ZİRVE",
                audioKey: "saga_theme_5",
                audioFile: "assets/audio/saga_theme_5.mp3",
                storyText: "İşte geldik yolun sonuna... Bulutları yaran Olimpos'un altın zirvesi gözlerinin önünde parıldıyor. Ancak kutsal tahtın üzerinde, zamanın efendisi titan Kronos bekliyor. Bu son savaş, yalnızca senin değil; tüm tanrıların ve ölümlülerin savaşıdır. Kalbindeki inancı son taşlara vur, gök gürültüsünü çağır ve altın tacı başına tak. Zafer senin ellerinde evlat; efsaneni tamamla!"
            }
        };

        function getThemeSagaForLevel(levelId) {
            levelId = parseInt(levelId) || 1;
            if (levelId <= 5) return THEME_SAGA_DATA[1];
            if (levelId <= 15) return THEME_SAGA_DATA[2];
            if (levelId <= 25) return THEME_SAGA_DATA[3];
            if (levelId <= 35) return THEME_SAGA_DATA[4];
            return THEME_SAGA_DATA[5];
        }

        let previewStoryAudio = null;
        let isPreviewStoryPlaying = false;

        function stopPreviewStoryAudio() {
            if (previewStoryAudio) {
                try { previewStoryAudio.pause(); } catch(e) {}
                previewStoryAudio = null;
            }
            isPreviewStoryPlaying = false;
            const btnText = document.getElementById('preview-story-text');
            const btnIcon = document.getElementById('preview-story-icon');
            const wave = document.getElementById('preview-soundwave');
            if (btnText) btnText.textContent = 'HİKAYEYİ DİNLE';
            if (btnIcon) btnIcon.textContent = '🔊';
            if (wave) wave.style.display = 'none';
        }

        function togglePreviewStoryAudio() {
            if (isPreviewStoryPlaying) {
                stopPreviewStoryAudio();
                return;
            }

            const currentLvl = gameState.currentPlayingLevel || 1;
            const saga = getThemeSagaForLevel(currentLvl);
            if (!saga) return;

            stopPreviewStoryAudio();

            const audioKey = saga.audioKey;
            let audioSrc = saga.audioFile;
            if (typeof window.NARRATOR_AUDIO_BASE64 !== 'undefined' && window.NARRATOR_AUDIO_BASE64[audioKey]) {
                audioSrc = window.NARRATOR_AUDIO_BASE64[audioKey];
            }

            try {
                previewStoryAudio = new Audio(audioSrc);
                previewStoryAudio.volume = (typeof sfxVolume !== 'undefined') ? sfxVolume : 1.0;
                previewStoryAudio.onended = () => {
                    stopPreviewStoryAudio();
                };
                previewStoryAudio.play().then(() => {
                    isPreviewStoryPlaying = true;
                    const btnText = document.getElementById('preview-story-text');
                    const btnIcon = document.getElementById('preview-story-icon');
                    const wave = document.getElementById('preview-soundwave');
                    if (btnText) btnText.textContent = 'DURDUR';
                    if (btnIcon) btnIcon.textContent = '⏸️';
                    if (wave) wave.style.display = 'inline-flex';
                }).catch(err => {
                    console.warn("Audio play blocked or unavailable:", err);
                    stopPreviewStoryAudio();
                });
            } catch(err) {
                console.error("Failed to play preview story audio:", err);
                stopPreviewStoryAudio();
            }
        }
`;

// Replace or inject into script
if (!html.includes('const THEME_SAGA_DATA = {')) {
    html = html.replace('function openLevelPreview(levelId) {', `${sagaEngineCode}\n        function openLevelPreview(levelId) {`);
    console.log("PASS: Injected THEME_SAGA_DATA and saga audio controls.");
}

console.log("=== 5. UPDATING openLevelPreview FUNCTION ===");
const oldOpenLevelPreviewRegex = /function\s+openLevelPreview\s*\(levelId\)\s*\{[\s\S]*?document\.getElementById\('modal-level-preview'\)\.classList\.add\('active'\);\s*\}/;

const newOpenLevelPreview = `function openLevelPreview(levelId) {
            levelId = parseInt(levelId) || 1;
            gameState.currentPlayingLevel = levelId;
            updateDynamicZoneBackground(levelId);

            // Stop any previously playing story audio
            stopPreviewStoryAudio();

            const fallbackTarget = 3000 + (levelId * 150);
            const levelInfo = LEVEL_DATA[levelId] || { 
                title: \`Bölüm \${levelId}\`, 
                desc: "Olimpos'un ötesinde bilinmeyen efsanevi topraklara adım atıyorsun...", 
                targetScore: fallbackTarget,
                maxMoves: 25
            };

            const saga = getThemeSagaForLevel(levelId);
            
            const titleEl = document.getElementById('preview-title');
            if (titleEl) titleEl.innerText = \`BÖLÜM \${levelId}: \${levelInfo.title}\` + (levelId % 10 === 0 ? " (BOSS)" : "");

            const badgeEl = document.getElementById('preview-badge');
            if (badgeEl && saga) badgeEl.innerText = saga.badge;

            const themeTitleEl = document.getElementById('preview-theme-title');
            if (themeTitleEl && saga) themeTitleEl.innerText = \`📜 TEMA: \${saga.themeTitle}\`;
            
            const storyEl = document.getElementById('preview-story');
            if (storyEl) {
                storyEl.innerText = \`"\${saga ? saga.storyText : levelInfo.desc}"\`;
            }
            
            const targetEl = document.getElementById('preview-target');
            if (targetEl) targetEl.innerText = (levelInfo.targetScore || 4000).toLocaleString();

            const movesEl = document.getElementById('preview-moves');
            if (movesEl) movesEl.innerText = levelInfo.maxMoves || 25;

            // Reset story audio button UI
            const btnText = document.getElementById('preview-story-text');
            const btnIcon = document.getElementById('preview-story-icon');
            const wave = document.getElementById('preview-soundwave');
            if (btnText) btnText.textContent = 'HİKAYEYİ DİNLE';
            if (btnIcon) btnIcon.textContent = '🔊';
            if (wave) wave.style.display = 'none';

            openModal('modal-level-preview');
        }`;

if (oldOpenLevelPreviewRegex.test(html)) {
    html = html.replace(oldOpenLevelPreviewRegex, newOpenLevelPreview);
    console.log("PASS: Replaced openLevelPreview function.");
} else {
    console.log("WARNING: oldOpenLevelPreviewRegex not matched, checking alternate...");
}

console.log("=== 6. UPDATING startAdventure() & checkFirstTimeOnboarding() ===");
// Remove openModal('modal-prologue') from checkFirstTimeOnboarding and startAdventure
html = html.replace(/function\s+startAdventure\(\)\s*\{[\s\S]*?\}\s*function\s+checkFirstTimeOnboarding/, `function startAdventure() {
            triggerHaptic('light');
            openLevelPreview(gameState.currentPlayingLevel || 1);
        }

        function checkFirstTimeOnboarding`);

// In checkFirstTimeOnboarding, do not open modal-prologue
html = html.replace(/if\s*\(!gameState\.hasSeenPrologue\)\s*\{\s*setTimeout\(\(\)\s*=>\s*\{\s*openModal\('modal-prologue'\);\s*\}, 500\);\s*\}/g, `// Prologue is integrated directly into stage preview`);
html = html.replace(/if\s*\(!gameState\.hasSeenPrologue\)\s*\{\s*setTimeout\(\(\)\s*=>\s*\{\s*openModal\('modal-prologue'\);\s*\}, 400\);\s*\}/g, `// Prologue is integrated directly into stage preview`);
html = html.replace(/openModal\('modal-prologue'\);/g, `openLevelPreview(gameState.currentPlayingLevel || 1);`);

console.log("=== 7. ENSURING closeModal STOPS PREVIEW AUDIO ===");
if (!html.includes("if (modalId === 'modal-level-preview') stopPreviewStoryAudio();")) {
    html = html.replace("function closeModal(modalId) {", `function closeModal(modalId) {
            if (modalId === 'modal-level-preview') stopPreviewStoryAudio();`);
    console.log("PASS: Added stopPreviewStoryAudio() to closeModal().");
}

if (!html.includes("stopPreviewStoryAudio();\n            closeModal('modal-level-preview');")) {
    html = html.replace("closeModal('modal-level-preview');\n            screenTransitionWipe", `stopPreviewStoryAudio();\n            closeModal('modal-level-preview');\n            screenTransitionWipe`);
    console.log("PASS: Added stopPreviewStoryAudio() to startGameplay().");
}

fs.writeFileSync('www/index.html', html, 'utf8');
console.log("ALL SAGA & LEVEL PREVIEW CHANGES SAVED TO www/index.html");

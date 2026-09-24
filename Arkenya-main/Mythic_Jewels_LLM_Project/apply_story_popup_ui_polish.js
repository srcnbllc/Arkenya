const fs = require('fs');

console.log("=== POLISHING STORY & PROLOGUE POPUP UI / UX ===");

let html = fs.readFileSync('www/index.html', 'utf8');

// 1. REVISE CSS FOR STORY-SCROLL-CARD & MYTHIC AUDIO PLAYER
const oldStoryCSSRegex = /\/\* STORY SCROLL MODAL STYLES \*\/[\s\S]*?\.biome-mechanic-pill \{[\s\S]*?\}/;

const newStoryCSS = `/* STORY SCROLL & PROLOGUE MODAL STYLES (ELEGANT MYTHIC DESIGNS) */
        .story-scroll-card {
            background: linear-gradient(180deg, #14100a 0%, #080604 100%) !important;
            border: 1.5px solid var(--gold-primary) !important;
            box-shadow: 0 10px 45px rgba(0, 0, 0, 0.9), 0 0 30px rgba(245, 197, 66, 0.3) !important;
            border-radius: 18px !important;
            padding: 16px 16px !important;
            max-width: 390px !important;
            width: 92% !important;
            max-height: 86vh !important;
            max-height: 86dvh !important;
            display: flex !important;
            flex-direction: column !important;
            box-sizing: border-box !important;
            position: relative !important;
            overflow: hidden !important;
        }
        .story-scroll-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 10px;
            padding-bottom: 10px;
            border-bottom: 1px solid rgba(245, 197, 66, 0.2);
            text-align: left;
            flex-shrink: 0;
        }
        .story-scroll-icon {
            font-size: 34px;
            line-height: 1;
            filter: drop-shadow(0 0 10px rgba(245, 197, 66, 0.6));
        }
        .story-badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 10px;
            font-size: 10px;
            font-weight: 800;
            letter-spacing: 0.8px;
            background: rgba(245, 197, 66, 0.18);
            color: var(--gold-light);
            border: 1px solid var(--gold-primary);
            margin-bottom: 3px;
            text-transform: uppercase;
        }
        .story-scroll-title {
            font-size: 17px;
            font-weight: 900;
            color: var(--gold-light);
            letter-spacing: 0.5px;
            line-height: 1.2;
            text-transform: uppercase;
        }
        .story-scroll-body {
            flex: 1;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
            padding-right: 4px;
            margin-bottom: 12px;
        }
        .story-scroll-body::-webkit-scrollbar {
            width: 4px;
        }
        .story-scroll-body::-webkit-scrollbar-thumb {
            background: rgba(245, 197, 66, 0.3);
            border-radius: 4px;
        }
        .mythic-audio-bar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: linear-gradient(135deg, rgba(245, 197, 66, 0.14) 0%, rgba(0, 210, 255, 0.1) 100%);
            border: 1.5px solid rgba(245, 197, 66, 0.45);
            border-radius: 12px;
            padding: 8px 12px;
            margin-bottom: 12px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
        }
        .mythic-play-btn {
            display: flex;
            align-items: center;
            gap: 8px;
            background: linear-gradient(135deg, #f5c542, #b8820c);
            color: #050811;
            border: none;
            border-radius: 8px;
            padding: 8px 14px;
            font-size: 12px;
            font-weight: 800;
            cursor: pointer;
            transition: all 0.25s ease;
            box-shadow: 0 2px 8px rgba(245, 197, 66, 0.4);
        }
        .mythic-play-btn:active {
            transform: scale(0.96);
        }
        .mythic-play-btn.speaking {
            background: linear-gradient(135deg, #e74c3c, #c0392b);
            color: #ffffff;
            box-shadow: 0 0 16px rgba(231, 76, 60, 0.8);
        }
        .mythic-soundwave {
            display: flex;
            align-items: center;
            gap: 3px;
            height: 18px;
            padding: 0 4px;
        }
        .mythic-soundwave span {
            display: block;
            width: 3px;
            height: 4px;
            background: #f5c542;
            border-radius: 2px;
            transition: height 0.2s;
        }
        .mythic-soundwave.active span {
            animation: soundWaveAnim 1.1s infinite ease-in-out;
        }
        .mythic-soundwave.active span:nth-child(1) { animation-delay: 0.1s; }
        .mythic-soundwave.active span:nth-child(2) { animation-delay: 0.3s; }
        .mythic-soundwave.active span:nth-child(3) { animation-delay: 0.2s; }
        .mythic-soundwave.active span:nth-child(4) { animation-delay: 0.4s; }
        .mythic-soundwave.active span:nth-child(5) { animation-delay: 0.15s; }

        @keyframes soundWaveAnim {
            0%, 100% { height: 4px; background: #f5c542; }
            50% { height: 18px; background: #00d2ff; }
        }

        .story-parchment {
            background: rgba(0, 0, 0, 0.6);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-left: 3px solid var(--gold-primary);
            border-radius: 10px;
            padding: 12px 14px;
            font-size: 12.5px;
            line-height: 1.6;
            color: #f1f5f9;
            text-align: left;
            margin-bottom: 12px;
            font-style: italic;
            box-shadow: inset 0 2px 8px rgba(0,0,0,0.5);
        }
        .story-compact-info {
            display: flex;
            gap: 8px;
            margin-bottom: 10px;
            font-size: 11px;
            text-align: left;
        }
        .story-info-chip {
            flex: 1;
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 8px;
            padding: 7px 10px;
            display: flex;
            flex-direction: column;
            gap: 2px;
        }
        .biome-mechanic-pill {
            background: rgba(0, 210, 255, 0.12);
            border: 1px solid rgba(0, 210, 255, 0.35);
            color: #38bdf8;
            border-radius: 8px;
            padding: 8px 12px;
            font-size: 11px;
            text-align: left;
            margin-bottom: 4px;
            line-height: 1.4;
        }
        .story-scroll-footer {
            flex-shrink: 0;
            padding-top: 4px;
        }`;

if (oldStoryCSSRegex.test(html)) {
    html = html.replace(oldStoryCSSRegex, newStoryCSS);
    console.log("-> Replaced story scroll CSS with elegant responsive styles.");
}

// 2. REWRITE modal-story-scroll HTML
const newStoryScrollHTML = `            <!-- MODAL: MITOLOJİK HİKAYE VE SESLİ ANLATIM PARŞÖMENİ -->
            <div class="modal-overlay" id="modal-story-scroll">
                <div class="modal-card story-scroll-card">
                    <div class="modal-close" onclick="confirmStoryAndStart()">✕</div>

                    <!-- Header -->
                    <div class="story-scroll-header">
                        <div class="story-scroll-icon" id="story-scroll-icon">📜</div>
                        <div>
                            <div class="story-badge" id="story-scroll-badge">BÖLGE 1 • KRİSTAL VADİ</div>
                            <div class="story-scroll-title" id="story-scroll-title">IŞIĞIN ŞAFAĞI</div>
                        </div>
                    </div>

                    <!-- Scrollable Content Body -->
                    <div class="story-scroll-body">
                        <!-- Mythic Audio Player Bar (Tuncel Kurtiz Style) -->
                        <div class="mythic-audio-bar">
                            <button class="mythic-play-btn" id="btn-narrator-toggle" onclick="toggleStoryVoice()">
                                <span id="narrator-play-icon">▶</span>
                                <span id="narrator-play-text">MİSTİK ANLATICIYI DİNLE</span>
                            </button>
                            <div class="mythic-soundwave" id="narrator-soundwave">
                                <span></span><span></span><span></span><span></span><span></span>
                            </div>
                        </div>

                        <!-- Parchment Story Text -->
                        <div class="story-parchment" id="story-scroll-text">
                            Karanlık güçler Olimpos'un kutsal kristallerini çaldığında gökler karardı...
                        </div>

                        <!-- Compact Roles Strip -->
                        <div class="story-compact-info">
                            <div class="story-info-chip">
                                <span style="color: var(--gold-light); font-weight: 800; font-size: 9.5px;">🛡️ SAVUNUCU</span>
                                <span id="story-scroll-hero" style="color: #fff; font-weight: 700;">Arkenya</span>
                            </div>
                            <div class="story-info-chip">
                                <span style="color: var(--accent-red); font-weight: 800; font-size: 9.5px;">⚔️ DÜŞMAN</span>
                                <span id="story-scroll-villain" style="color: #fff; font-weight: 700;">Hades</span>
                            </div>
                        </div>

                        <!-- Mechanic Pill -->
                        <div class="biome-mechanic-pill">
                            <b id="story-mechanic-title">⚡ Özel Mekanik:</b> <span id="story-mechanic-desc">Saf Eşleştirme</span>
                        </div>
                    </div>

                    <!-- Fixed Footer Action -->
                    <div class="story-scroll-footer">
                        <button class="btn-action btn-action-gold" style="width: 100%; height: 48px; font-size: 15px; font-weight: 900; box-shadow: 0 4px 18px rgba(245, 197, 66, 0.4);" onclick="confirmStoryAndStart()">⚔️ SAVAŞA BAŞLA ➔</button>
                    </div>
                </div>
            </div>`;

const storyScrollRegex = /<!-- MODAL: MITOLOJİK HİKAYE VE SESLİ ANLATIM PARŞÖMENİ -->[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>/;
if (storyScrollRegex.test(html)) {
    html = html.replace(storyScrollRegex, newStoryScrollHTML);
    console.log("-> Replaced modal-story-scroll HTML with responsive, elegant card structure.");
}

// 3. REWRITE modal-prologue HTML
const newPrologueHTML = `            <!-- MODAL: PROLOGUE ONBOARDING -->
            <div class="modal-overlay" id="modal-prologue">
                <div class="modal-card story-scroll-card">
                    <div class="modal-close" onclick="stopStoryVoice(); startFirstTimeAdventure();">✕</div>

                    <!-- Header -->
                    <div class="story-scroll-header">
                        <div style="font-size: 32px; filter: drop-shadow(0 0 10px rgba(245, 197, 66, 0.7));">⚡</div>
                        <div>
                            <div class="story-badge">OLİMPOS BAŞLANGICI</div>
                            <div class="story-scroll-title">ARKENYA: EFSANENİN DOĞUŞU</div>
                        </div>
                    </div>

                    <!-- Scrollable Content Body -->
                    <div class="story-scroll-body">
                        <!-- Mythic Audio Player Bar -->
                        <div class="mythic-audio-bar">
                            <button class="mythic-play-btn" id="btn-prologue-narrator" onclick="playPrologueVoice()">
                                <span id="prologue-play-icon">▶</span>
                                <span id="prologue-play-text">EFSANEYİ DİNLE (Tuncel Kurtiz)</span>
                            </button>
                            <div class="mythic-soundwave" id="prologue-soundwave">
                                <span></span><span></span><span></span><span></span><span></span>
                            </div>
                        </div>

                        <div class="story-parchment">
                            "Kader dediğin şey, önüne serilen taşlar değildir yeğen... Kader, o taşlara vurduğun ilahi akıldır, yürektir!"
                        </div>

                        <!-- Gameplay Rules List -->
                        <div style="display: flex; flex-direction: column; gap: 7px; text-align: left; font-size: 11.5px; margin-bottom: 6px;">
                            <div style="display: flex; align-items: center; gap: 9px; background: rgba(255,255,255,0.04); padding: 8px 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.06);">
                                <span style="font-size: 18px;">👉</span>
                                <div><b>3 Taşı Eşleştir:</b> Taşları kaydırarak ilahi gücü uyandır.</div>
                            </div>
                            <div style="display: flex; align-items: center; gap: 9px; background: rgba(255,255,255,0.04); padding: 8px 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.06);">
                                <span style="font-size: 18px;">⚡</span>
                                <div><b>Özel Taşlar Yarat:</b> 4'lü ve 5'li kombolarla yıldırımlar yağdır.</div>
                            </div>
                            <div style="display: flex; align-items: center; gap: 9px; background: rgba(255,255,255,0.04); padding: 8px 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.06);">
                                <span style="font-size: 18px;">🏆</span>
                                <div><b>50 Mitolojik Bölüm:</b> Olimpos Zirvesine doğru tırmanışa geç!</div>
                            </div>
                        </div>
                    </div>

                    <!-- Fixed Footer Action -->
                    <div class="story-scroll-footer">
                        <button class="btn-action btn-action-green" style="width: 100%; height: 48px; font-size: 15px; font-weight: 800; box-shadow: 0 4px 18px rgba(46, 204, 113, 0.4);" onclick="stopStoryVoice(); startFirstTimeAdventure();">⚔️ 1. BÖLÜME BAŞLA (HERKÜL) ➔</button>
                    </div>
                </div>
            </div>`;

const prologueRegex = /<div class="modal-overlay" id="modal-prologue">[\s\S]*?<\/div>[\s\S]*?<\/div>/;
if (prologueRegex.test(html)) {
    html = html.replace(prologueRegex, newPrologueHTML);
    console.log("-> Replaced modal-prologue HTML with matching elegant layout.");
}

// 4. UPDATE updateNarratorButtonUI TO CONTROL BOTH STORY & PROLOGUE SOUNDWAVES AND BUTTONS
const oldUpdateNarratorUI = `        function updateNarratorButtonUI(speaking) {
            const btn = document.getElementById('btn-narrator-toggle');
            if (btn) {
                btn.innerHTML = speaking ? '⏹️ ANLATIMI DURDUR' : '🎙️ MİSTİK ANLATICIYI DİNLE';
                btn.style.background = speaking ? 'linear-gradient(135deg, #e74c3c, #c0392b)' : 'linear-gradient(135deg, #ffd700, #ff9900)';
                btn.style.color = speaking ? '#fff' : '#000';
                btn.style.boxShadow = speaking ? '0 0 22px rgba(231,76,60,0.85)' : '0 0 22px rgba(255,215,0,0.7)';
            }
        }`;

const newUpdateNarratorUI = `        function updateNarratorButtonUI(speaking) {
            const btn = document.getElementById('btn-narrator-toggle');
            const icon = document.getElementById('narrator-play-icon');
            const text = document.getElementById('narrator-play-text');
            const wave = document.getElementById('narrator-soundwave');

            if (btn) {
                if (speaking) {
                    btn.classList.add('speaking');
                    if (icon) { icon.innerText = '⏹'; icon.textContent = '⏹'; }
                    if (text) { text.innerText = 'ANLATIMI DURDUR'; text.textContent = 'ANLATIMI DURDUR'; }
                } else {
                    btn.classList.remove('speaking');
                    if (icon) { icon.innerText = '▶'; icon.textContent = '▶'; }
                    if (text) { text.innerText = 'MİSTİK ANLATICIYI DİNLE'; text.textContent = 'MİSTİK ANLATICIYI DİNLE'; }
                }
            }
            if (wave) {
                if (speaking) wave.classList.add('active');
                else wave.classList.remove('active');
            }

            // Also synchronize prologue button and soundwave if present
            const proBtn = document.getElementById('btn-prologue-narrator');
            const proIcon = document.getElementById('prologue-play-icon');
            const proText = document.getElementById('prologue-play-text');
            const proWave = document.getElementById('prologue-soundwave');
            if (proBtn) {
                if (speaking) {
                    proBtn.classList.add('speaking');
                    if (proIcon) { proIcon.innerText = '⏹'; proIcon.textContent = '⏹'; }
                    if (proText) { proText.innerText = 'ANLATIMI DURDUR'; proText.textContent = 'ANLATIMI DURDUR'; }
                } else {
                    proBtn.classList.remove('speaking');
                    if (proIcon) { proIcon.innerText = '▶'; proIcon.textContent = '▶'; }
                    if (proText) { proText.innerText = 'EFSANEYİ DİNLE (Tuncel Kurtiz)'; proText.textContent = 'EFSANEYİ DİNLE (Tuncel Kurtiz)'; }
                }
            }
            if (proWave) {
                if (speaking) proWave.classList.add('active');
                else proWave.classList.remove('active');
            }
        }
        
        // Directly update in-memory function
        if (typeof updateNarratorButtonUI === 'function') {
            updateNarratorButtonUI = new Function('speaking', newUpdateNarratorUI.slice(newUpdateNarratorUI.indexOf('{') + 1, newUpdateNarratorUI.lastIndexOf('}')));
        }`;

if (html.includes('function updateNarratorButtonUI(speaking) {')) {
    html = html.replace(oldUpdateNarratorUI, newUpdateNarratorUI);
    console.log("-> Updated updateNarratorButtonUI with soundwave and dual modal synchronization.");
}

// SAVE ALL FILES
fs.writeFileSync('www/index.html', html, 'utf8');
console.log("-> Saved www/index.html");

const targets = [
    'index.html',
    'Arkenya_Playable_Demo.html',
    'android/app/src/main/assets/public/index.html'
];

targets.forEach(t => {
    fs.writeFileSync(t, html, 'utf8');
    console.log(`-> Synchronized: ${t}`);
});

console.log("=== POLISH COMPLETE & ALL TARGETS SYNCHRONIZED ===");

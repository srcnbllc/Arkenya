const fs = require('fs');

console.log("=== APPLYING ADVANCED AUDIO & TURKISH STORY ENGINE ===");

let html = fs.readFileSync('www/index.html', 'utf8');

// 1. ADD CSS FOR STORY BANNER
const cssTarget = `/* 12 OLİMPOSLU PANTEON MODAL TASARIMI */`;
const cssReplacement = `/* KADİM DESTANI DİNLE (MİTOLOJİK TÜRKÇE MASALCI BANNERI) */
        .mainmenu-story-banner {
            margin: 6px 16px 10px 16px;
            padding: 8px 14px;
            background: linear-gradient(135deg, rgba(30, 41, 59, 0.85) 0%, rgba(15, 23, 42, 0.95) 100%);
            border: 1.5px solid rgba(245, 197, 66, 0.45);
            border-radius: 12px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2);
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: all 0.25s ease;
            display: flex;
            align-items: center;
        }
        .mainmenu-story-banner:active {
            transform: scale(0.98);
            border-color: #ffd700;
        }
        .mainmenu-story-banner.active-playing {
            border-color: #00d2ff;
            background: linear-gradient(135deg, rgba(14, 55, 85, 0.9) 0%, rgba(10, 25, 47, 0.95) 100%);
            box-shadow: 0 0 18px rgba(0, 210, 255, 0.35);
        }
        .story-banner-inner {
            display: flex;
            align-items: center;
            width: 100%;
            gap: 10px;
        }
        .story-banner-icon {
            font-size: 20px;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
        }
        .story-banner-text {
            display: flex;
            flex-direction: column;
            flex: 1;
            min-width: 0;
        }
        .story-banner-title {
            font-family: 'Cinzel', serif;
            font-size: 12.5px;
            font-weight: 700;
            color: #ffe885;
            letter-spacing: 0.8px;
            text-shadow: 0 1px 3px rgba(0,0,0,0.8);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .story-banner-sub {
            font-size: 10.5px;
            color: #cbd5e1;
            letter-spacing: 0.2px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .story-banner-btn-play {
            padding: 5px 12px;
            background: linear-gradient(135deg, #ffd700 0%, #d4af37 100%);
            color: #0b0f19;
            font-weight: 800;
            font-size: 11px;
            letter-spacing: 0.5px;
            border-radius: 8px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.4);
            white-space: nowrap;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .story-banner-btn-play.playing {
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            color: #fff;
        }
        .story-banner-soundwave {
            display: inline-flex;
            align-items: center;
            gap: 2px;
            height: 14px;
        }
        .story-banner-soundwave span {
            display: inline-block;
            width: 2.5px;
            background: #00d2ff;
            border-radius: 2px;
            animation: soundwave-bar 0.8s infinite ease-in-out alternate;
        }
        .story-banner-soundwave span:nth-child(1) { height: 6px; animation-delay: 0.1s; }
        .story-banner-soundwave span:nth-child(2) { height: 14px; animation-delay: 0.3s; }
        .story-banner-soundwave span:nth-child(3) { height: 10px; animation-delay: 0.2s; }
        .story-banner-soundwave span:nth-child(4) { height: 8px; animation-delay: 0.4s; }
        @keyframes soundwave-bar {
            0% { transform: scaleY(0.3); }
            100% { transform: scaleY(1.2); }
        }

        /* 12 OLİMPOSLU PANTEON MODAL TASARIMI */`;

if (!html.includes('.mainmenu-story-banner')) {
    html = html.replace(cssTarget, cssReplacement);
    console.log("[1] Story banner CSS added.");
} else {
    console.log("[1] Story banner CSS already exists.");
}

// 2. ADD STORY BANNER HTML IN MAIN MENU (Between Play Button and Bottom Cards)
const htmlTarget = `<div class="mainmenu-bottom-cards-row">`;
const bannerHtml = `<!-- MİTOLOJİK TÜRKÇE MASALCI SESLENDİRME BANNERI -->
                    <div class="mainmenu-story-banner" id="mainmenu-story-banner" onclick="toggleMainMenuStoryNarration()" title="Kadim Masalı Dinle">
                        <div class="story-banner-inner">
                            <span class="story-banner-icon" id="mainmenu-story-icon">📜</span>
                            <div class="story-banner-text">
                                <span class="story-banner-title" id="mainmenu-story-title">KADİM DESTANI DİNLE</span>
                                <span class="story-banner-sub">Mitolojik Türkçe Masalcı & Olimpos Efsanesi</span>
                            </div>
                            <div class="story-banner-soundwave" id="mainmenu-story-wave" style="display: none;">
                                <span></span><span></span><span></span><span></span>
                            </div>
                            <span class="story-banner-btn-play" id="mainmenu-story-playbtn">▶ DİNLE</span>
                        </div>
                    </div>

                    <div class="mainmenu-bottom-cards-row">`;

if (!html.includes('id="mainmenu-story-banner"')) {
    html = html.replace(htmlTarget, bannerHtml);
    console.log("[2] Story banner HTML inserted into main menu.");
} else {
    console.log("[2] Story banner HTML already present.");
}

// 3. REPLACE BGM ENGINE WITH ADVANCED DUAL-TRACK & AUTOPLAY AUDIO ENGINE
const bgmOldCodeStart = `let isBgmEnabled = true;\n        let bgmSynthInterval = null;`;
const bgmOldCodeEnd = `// --- TÜRKÇE EPİK SESLENDİRME & TEPKİ MOTORU ---`;

const newAudioEngine = `// ==========================================
        // ARKENYA ADVANCED MYTHIC AUDIO ENGINE
        // Web Audio Synthesizer, Dual Soundtrack (Menu & In-Game),
        // Turkish Mythic Storyteller & Safe Offline Autoplay
        // ==========================================

        let isBgmEnabled = true;
        let isSfxEnabled = true;
        let sharedAudioContext = null;
        let currentMusicTrack = null; // 'menu' | 'gameplay' | null
        let bgmGainNode = null;
        let menuMusicInterval = null;
        let gameMusicInterval = null;
        let currentMenuChordIdx = 0;
        let currentGameBeatIdx = 0;
        let isAudioUnlocked = false;
        let isMusicDucked = false;
        let mainMenuStoryAudio = null;
        let isMainMenuStoryPlaying = false;

        function getAudioContext() {
            try {
                const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
                if (!AudioCtxClass) return null;
                if (!sharedAudioContext) {
                    sharedAudioContext = new AudioCtxClass();
                }
                if (sharedAudioContext.state === 'suspended') {
                    sharedAudioContext.resume().catch(() => {});
                }
                return sharedAudioContext;
            } catch(e) {
                return null;
            }
        }

        // Global One-Time Touch Listener to Bypass Browser / WebView Autoplay Lock
        function unlockAudioOnFirstInteraction() {
            if (isAudioUnlocked) return;
            const ctx = getAudioContext();
            if (ctx) {
                ctx.resume().then(() => {
                    isAudioUnlocked = true;
                    if (isBgmEnabled && !currentMusicTrack) {
                        syncMusicWithCurrentScreen(currentActiveScreen || 'screen-mainmenu');
                    }
                }).catch(() => {});
            }
        }

        if (typeof window !== 'undefined') {
            const unlockEvents = ['pointerdown', 'touchstart', 'click', 'keydown'];
            const onFirstTouch = () => {
                unlockAudioOnFirstInteraction();
                unlockEvents.forEach(evt => window.removeEventListener(evt, onFirstTouch));
            };
            unlockEvents.forEach(evt => window.addEventListener(evt, onFirstTouch, { passive: true }));
        }

        function ensureBgmMasterGain(ctx) {
            if (!bgmGainNode && ctx) {
                bgmGainNode = ctx.createGain();
                bgmGainNode.gain.setValueAtTime(isMusicDucked ? 0.005 : 0.045, ctx.currentTime);
                bgmGainNode.connect(ctx.destination);
            }
            return bgmGainNode;
        }

        function duckBackgroundMusic(duck = true) {
            isMusicDucked = duck;
            if (bgmGainNode) {
                try {
                    const ctx = getAudioContext();
                    if (ctx) {
                        const targetVol = duck ? 0.005 : 0.045;
                        bgmGainNode.gain.cancelScheduledValues(ctx.currentTime);
                        bgmGainNode.gain.linearRampToValueAtTime(targetVol, ctx.currentTime + 0.35);
                    }
                } catch(e) {}
            }
        }

        // --- 1. MENÜ MÜZİĞİ: "OLİMPOS MASALI & KADİM LİR" (~72 BPM) ---
        // Antik Yunan liri, arp kadansları ve mistik tapınak aurası
        const GREEK_MENU_CHORDS = [
            [110.00, 164.81, 220.00, 261.63, 329.63, 493.88], // Am9
            [87.31, 130.81, 174.61, 220.00, 261.63, 329.63],   // Fmaj7
            [73.42, 110.00, 146.83, 174.61, 220.00, 261.63],   // Dm9
            [98.00, 146.83, 196.00, 246.94, 293.66, 392.00],   // Gsus4
            [65.41, 130.81, 196.00, 261.63, 329.63, 392.00],   // Cmaj7
            [82.41, 123.47, 164.81, 220.00, 246.94, 329.63]    // E7sus4
        ];

        function playMenuMusic() {
            if (!isBgmEnabled) return;
            if (currentMusicTrack === 'menu' && menuMusicInterval) return;
            
            stopGameMusic();
            stopMenuMusic();
            currentMusicTrack = 'menu';

            try {
                const ctx = getAudioContext();
                if (!ctx) return;
                if (ctx.state === 'suspended') ctx.resume().catch(() => {});

                const masterGain = ensureBgmMasterGain(ctx);

                function playLyreMeasure() {
                    if (!isBgmEnabled || currentMusicTrack !== 'menu' || !bgmGainNode) return;
                    const chord = GREEK_MENU_CHORDS[currentMenuChordIdx % GREEK_MENU_CHORDS.length];
                    currentMenuChordIdx++;

                    // Soft ambient temple drone for depth
                    const droneOsc = ctx.createOscillator();
                    const droneGain = ctx.createGain();
                    droneOsc.type = 'sine';
                    droneOsc.frequency.setValueAtTime(chord[0], ctx.currentTime);
                    droneGain.gain.setValueAtTime(0.001, ctx.currentTime);
                    droneGain.gain.linearRampToValueAtTime(0.015, ctx.currentTime + 0.8);
                    droneGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.1);
                    droneOsc.connect(droneGain);
                    droneGain.connect(masterGain);
                    droneOsc.start(ctx.currentTime);
                    droneOsc.stop(ctx.currentTime + 3.2);

                    // Plucked lyre / harp arpeggio
                    chord.forEach((freq, idx) => {
                        const osc = ctx.createOscillator();
                        const noteGain = ctx.createGain();
                        const filter = (typeof ctx.createBiquadFilter === 'function') ? ctx.createBiquadFilter() : null;

                        osc.type = 'triangle';
                        const noteStart = ctx.currentTime + (idx * 0.28) + (Math.random() * 0.04);
                        osc.frequency.setValueAtTime(freq, noteStart);

                        noteGain.gain.setValueAtTime(0.0001, noteStart);
                        noteGain.gain.exponentialRampToValueAtTime(0.042, noteStart + 0.04);
                        noteGain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 2.2);

                        if (filter) {
                            filter.type = 'lowpass';
                            filter.frequency.setValueAtTime(1600, noteStart);
                            osc.connect(filter);
                            filter.connect(noteGain);
                        } else {
                            osc.connect(noteGain);
                        }
                        noteGain.connect(masterGain);

                        osc.start(noteStart);
                        osc.stop(noteStart + 2.3);
                    });
                }

                playLyreMeasure();
                menuMusicInterval = setInterval(playLyreMeasure, 3100);
            } catch(e) {
                console.log("Menu BGM error:", e);
            }
        }

        function stopMenuMusic() {
            if (menuMusicInterval) {
                clearInterval(menuMusicInterval);
                menuMusicInterval = null;
            }
            if (currentMusicTrack === 'menu') currentMusicTrack = null;
        }

        // --- 2. OYUN İÇİ MÜZİK: "KUTSAL MÜCADELE & TAPINAK RİTMİ" (~105 BPM) ---
        // Ritmik tapınak bası, pentatonik arp kaskadları ve mitolojik macera tansiyonu
        const GAME_PENTATONIC_SCALE = [220.00, 261.63, 293.66, 329.63, 392.00, 440.00, 523.25];
        const GAME_ROOTS = [55.00, 65.41, 73.42, 82.41];

        function playGameMusic() {
            if (!isBgmEnabled) return;
            if (currentMusicTrack === 'gameplay' && gameMusicInterval) return;

            stopMenuMusic();
            stopGameMusic();
            currentMusicTrack = 'gameplay';

            try {
                const ctx = getAudioContext();
                if (!ctx) return;
                if (ctx.state === 'suspended') ctx.resume().catch(() => {});

                const masterGain = ensureBgmMasterGain(ctx);

                function playTempleStep() {
                    if (!isBgmEnabled || currentMusicTrack !== 'gameplay' || !bgmGainNode) return;
                    const step = currentGameBeatIdx % 8;
                    const root = GAME_ROOTS[Math.floor((currentGameBeatIdx % 32) / 8)];
                    currentGameBeatIdx++;

                    const now = ctx.currentTime;

                    // Beat 0 & 4: Deep temple drum kick
                    if (step === 0 || step === 4 || step === 2) {
                        const kickOsc = ctx.createOscillator();
                        const kickGain = ctx.createGain();
                        kickOsc.type = 'sine';
                        kickOsc.frequency.setValueAtTime(step === 0 ? 82 : 68, now);
                        kickOsc.frequency.exponentialRampToValueAtTime(32, now + 0.22);
                        kickGain.gain.setValueAtTime(0.045, now);
                        kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
                        kickOsc.connect(kickGain);
                        kickGain.connect(masterGain);
                        kickOsc.start(now);
                        kickOsc.stop(now + 0.25);
                    }

                    // Shaker / chime tick on offbeats
                    const chimeOsc = ctx.createOscillator();
                    const chimeGain = ctx.createGain();
                    chimeOsc.type = 'triangle';
                    const chimeFreq = (step % 2 === 0) ? 1318.51 : 1760.00;
                    chimeOsc.frequency.setValueAtTime(chimeFreq, now);
                    chimeGain.gain.setValueAtTime(0.008, now);
                    chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
                    chimeOsc.connect(chimeGain);
                    chimeGain.connect(masterGain);
                    chimeOsc.start(now);
                    chimeOsc.stop(now + 0.09);

                    // Melodic Pentatonic Harp Note
                    const noteIdx = (step * 2 + Math.floor(currentGameBeatIdx / 4)) % GAME_PENTATONIC_SCALE.length;
                    const noteFreq = GAME_PENTATONIC_SCALE[noteIdx];
                    const harpOsc = ctx.createOscillator();
                    const harpGain = ctx.createGain();
                    harpOsc.type = 'triangle';
                    harpOsc.frequency.setValueAtTime(noteFreq, now);
                    harpGain.gain.setValueAtTime(0.001, now);
                    harpGain.gain.exponentialRampToValueAtTime(0.032, now + 0.03);
                    harpGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.48);
                    harpOsc.connect(harpGain);
                    harpGain.connect(masterGain);
                    harpOsc.start(now);
                    harpOsc.stop(now + 0.5);
                }

                playTempleStep();
                gameMusicInterval = setInterval(playTempleStep, 540); // ~111 BPM
            } catch(e) {
                console.log("Game BGM error:", e);
            }
        }

        function stopGameMusic() {
            if (gameMusicInterval) {
                clearInterval(gameMusicInterval);
                gameMusicInterval = null;
            }
            if (currentMusicTrack === 'gameplay') currentMusicTrack = null;
        }

        function stopAllMusic() {
            stopMenuMusic();
            stopGameMusic();
            if (bgmGainNode) {
                try {
                    const ctx = getAudioContext();
                    if (ctx) bgmGainNode.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
                } catch(e) {}
            }
            currentMusicTrack = null;
        }

        function syncMusicWithCurrentScreen(screenId) {
            if (!isBgmEnabled) return;
            const targetScreen = screenId || currentActiveScreen || 'screen-mainmenu';
            if (targetScreen === 'screen-gameplay') {
                playGameMusic();
            } else {
                playMenuMusic();
            }
        }

        function startBackgroundMusic() {
            isBgmEnabled = true;
            syncMusicWithCurrentScreen(currentActiveScreen || 'screen-mainmenu');
        }

        function stopBackgroundMusic() {
            isBgmEnabled = false;
            stopAllMusic();
        }

        function toggleBgm(btn) {
            isBgmEnabled = !isBgmEnabled;
            if (btn) {
                btn.innerText = isBgmEnabled ? 'AÇIK' : 'KAPALI';
                btn.className = isBgmEnabled ? 'btn-action btn-action-blue' : 'btn-action';
                btn.style.background = isBgmEnabled ? '' : '#475569';
            }
            if (isBgmEnabled) {
                syncMusicWithCurrentScreen(currentActiveScreen || 'screen-mainmenu');
                showToast("🎵 Arka plan müziği açıldı", "info");
            } else {
                stopAllMusic();
                showToast("🔇 Arka plan müziği kapatıldı", "info");
            }
        }

        // --- 3. ANA MENÜ TÜRKÇE MASALCI SESLENDİRME ÇALICISI ---
        function toggleMainMenuStoryNarration() {
            if (isMainMenuStoryPlaying) {
                stopMainMenuStoryNarration();
                return;
            }

            const audioSrc = (typeof window.NARRATOR_AUDIO_BASE64 !== 'undefined' && window.NARRATOR_AUDIO_BASE64['prologue']) 
                ? window.NARRATOR_AUDIO_BASE64['prologue'] 
                : 'assets/audio/prologue.mp3';

            try {
                if (mainMenuStoryAudio) {
                    try { mainMenuStoryAudio.pause(); } catch(e) {}
                    mainMenuStoryAudio = null;
                }

                mainMenuStoryAudio = new Audio(audioSrc);
                mainMenuStoryAudio.volume = 1.0;
                mainMenuStoryAudio.onended = () => {
                    stopMainMenuStoryNarration();
                };

                duckBackgroundMusic(true);
                startMysticalSoundscape();

                isMainMenuStoryPlaying = true;
                const titleEl = document.getElementById('mainmenu-story-title');
                const btnEl = document.getElementById('mainmenu-story-playbtn');
                const waveEl = document.getElementById('mainmenu-story-wave');
                const banner = document.getElementById('mainmenu-story-banner');

                if (titleEl) titleEl.innerText = 'KADİM DESTAN ANLATILIYOR...';
                if (btnEl) { btnEl.innerText = '⏸ DURDUR'; btnEl.classList.add('playing'); }
                if (waveEl) waveEl.style.display = 'inline-flex';
                if (banner) banner.classList.add('active-playing');

                const playPromise = mainMenuStoryAudio.play();
                if (playPromise && playPromise.catch) {
                    playPromise.catch(err => {
                        console.warn("Main menu story playback error, falling back to TTS:", err);
                        playTTSFallback("Dinle evlat... Bak ne anlatacağım sana. Dünya değişti... Toprak unuttu eski günleri, gökler unuttu tanrıların adını. Kadim Olimpos'un kutsal kristalleri çalındığında, dağlar inledi, denizler taştı. Şimdi kalkanını kuşan Asterion... Bu vadi, ışığı bekler!");
                    });
                }
            } catch(e) {
                console.error("Main menu story audio error:", e);
                stopMainMenuStoryNarration();
            }
        }

        function stopMainMenuStoryNarration() {
            if (mainMenuStoryAudio) {
                try { mainMenuStoryAudio.pause(); } catch(e) {}
                mainMenuStoryAudio = null;
            }
            stopMysticalSoundscape();
            duckBackgroundMusic(false);
            isMainMenuStoryPlaying = false;

            const titleEl = document.getElementById('mainmenu-story-title');
            const btnEl = document.getElementById('mainmenu-story-playbtn');
            const waveEl = document.getElementById('mainmenu-story-wave');
            const banner = document.getElementById('mainmenu-story-banner');

            if (titleEl) titleEl.innerText = 'KADİM DESTANI DİNLE';
            if (btnEl) { btnEl.innerText = '▶ DİNLE'; btnEl.classList.remove('playing'); }
            if (waveEl) waveEl.style.display = 'none';
            if (banner) banner.classList.remove('active-playing');
        }

        `;

const bgmStartPos = html.indexOf('let isBgmEnabled = true;');
const bgmEndPos = html.indexOf('// --- TÜRKÇE EPİK SESLENDİRME & TEPKİ MOTORU ---');

if (bgmStartPos !== -1 && bgmEndPos !== -1) {
    html = html.slice(0, bgmStartPos) + newAudioEngine + html.slice(bgmEndPos);
    console.log("[3] Dual-track Audio Engine injected successfully.");
} else {
    console.error("[3] ERROR: Could not find bgm code slice boundaries!");
}

// 4. UPDATE playEpicCallout FOR RICH CHIMES + TURKISH TTS
const oldEpicCalloutStart = `function playEpicCallout(type) {`;
const oldEpicCalloutEnd = `// --- ZENGİN SES EFEKTLERİ (SFX) ---`;

const newEpicCallout = `function playEpicCallout(type) {
            if (!isSfxEnabled) return;
            const now = Date.now();
            if (now - lastCalloutTimestamp < 3500) return; // Throttle to prevent overlap
            lastCalloutTimestamp = now;

            const lines = EPIC_CALLOUT_LINES[type];
            if (!lines || !lines.length) return;
            const line = lines[Math.floor(Math.random() * lines.length)];

            // 1. Mythological triumphant chime signature
            try {
                const ctx = getAudioContext();
                if (ctx) {
                    const freqs = (type === 'victory') ? [523.25, 659.25, 783.99, 1046.50] :
                                  (type === 'combo_4') ? [440.00, 554.37, 659.25, 880.00] :
                                  (type === 'clutch') ? [293.66, 349.23, 440.00] :
                                  [392.00, 493.88, 587.33];
                    freqs.forEach((f, idx) => {
                        const osc = ctx.createOscillator();
                        const g = ctx.createGain();
                        osc.type = 'triangle';
                        const t = ctx.currentTime + (idx * 0.08);
                        osc.frequency.setValueAtTime(f, t);
                        g.gain.setValueAtTime(0.001, t);
                        g.gain.exponentialRampToValueAtTime(0.08, t + 0.04);
                        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);
                        osc.connect(g);
                        g.connect(ctx.destination);
                        osc.start(t);
                        osc.stop(t + 0.48);
                    });
                }
            } catch(e) {}

            // 2. Turkish spoken speech
            if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                try {
                    const u = new SpeechSynthesisUtterance(line);
                    u.lang = 'tr-TR';
                    u.rate = 0.88;
                    u.pitch = 0.82;
                    u.volume = 1.0;
                    const voices = window.speechSynthesis.getVoices();
                    const trVoice = voices.find(v => v.lang && (v.lang === 'tr-TR' || v.lang.toLowerCase().startsWith('tr')));
                    if (trVoice) u.voice = trVoice;
                    window.speechSynthesis.speak(u);
                } catch(e) {}
            }
        }

        `;

const calloutStartPos = html.indexOf(oldEpicCalloutStart);
const calloutEndPos = html.indexOf(oldEpicCalloutEnd);
if (calloutStartPos !== -1 && calloutEndPos !== -1) {
    html = html.slice(0, calloutStartPos) + newEpicCallout + html.slice(calloutEndPos);
    console.log("[4] Enhanced playEpicCallout injected successfully.");
} else {
    console.error("[4] ERROR: Could not find callout code slice boundaries!");
}

// 5. UPDATE showScreen TO SYNC MUSIC
const showScreenTarget = `syncAllHUDs();\n            updateHeroLockBadges();`;
const showScreenReplacement = `syncAllHUDs();\n            updateHeroLockBadges();\n            syncMusicWithCurrentScreen(screenId);`;

if (!html.includes('syncMusicWithCurrentScreen(screenId)')) {
    html = html.replace(showScreenTarget, showScreenReplacement);
    console.log("[5] showScreen updated to call syncMusicWithCurrentScreen.");
} else {
    console.log("[5] showScreen already syncs music.");
}

// 6. UPDATE startStoryAtmosphereDrone, togglePreviewStoryAudio & stopPreviewStoryAudio
const oldDroneStart = `function startStoryAtmosphereDrone() {`;
const oldDroneEnd = `function openLevelPreview(levelId) {`;

const newDroneAndPreview = `function startStoryAtmosphereDrone() {
            try {
                const audioCtx = getAudioContext();
                if (!audioCtx) return;
                if (audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});

                stopStoryAtmosphereDrone();

                storyDroneGain = audioCtx.createGain();
                storyDroneGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
                storyDroneGain.gain.linearRampToValueAtTime(0.035, audioCtx.currentTime + 1.2);

                const filter = (typeof audioCtx.createBiquadFilter === 'function') ? audioCtx.createBiquadFilter() : null;
                storyDroneOsc1 = audioCtx.createOscillator();
                storyDroneOsc1.type = 'sawtooth';
                storyDroneOsc1.frequency.setValueAtTime(73.42, audioCtx.currentTime);

                storyDroneOsc2 = audioCtx.createOscillator();
                storyDroneOsc2.type = 'sine';
                storyDroneOsc2.frequency.setValueAtTime(110.0, audioCtx.currentTime);

                if (filter) {
                    filter.type = 'lowpass';
                    filter.frequency.setValueAtTime(140, audioCtx.currentTime);
                    storyDroneOsc1.connect(filter);
                    storyDroneOsc2.connect(filter);
                    filter.connect(storyDroneGain);
                } else {
                    storyDroneOsc1.connect(storyDroneGain);
                    storyDroneOsc2.connect(storyDroneGain);
                }
                storyDroneGain.connect(audioCtx.destination);

                storyDroneOsc1.start();
                storyDroneOsc2.start();
            } catch(e) {}
        }

        function stopStoryAtmosphereDrone() {
            if (storyDroneGain) {
                try {
                    const audioCtx = getAudioContext();
                    if (audioCtx) {
                        storyDroneGain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
                        setTimeout(() => {
                            try { if (storyDroneOsc1) storyDroneOsc1.stop(); } catch(e) {}
                            try { if (storyDroneOsc2) storyDroneOsc2.stop(); } catch(e) {}
                            storyDroneOsc1 = null;
                            storyDroneOsc2 = null;
                            storyDroneGain = null;
                        }, 450);
                    } else {
                        storyDroneGain = null;
                    }
                } catch(e) {
                    storyDroneGain = null;
                }
            }
        }

        function stopPreviewStoryAudio() {
            stopStoryAtmosphereDrone();
            duckBackgroundMusic(false);
            if (previewStoryAudio) {
                try { previewStoryAudio.pause(); } catch(e) {}
                previewStoryAudio = null;
            }
            isPreviewStoryPlaying = false;
            const btnText = document.getElementById('preview-story-text');
            const btnIcon = document.getElementById('preview-story-icon');
            const wave = document.getElementById('preview-soundwave');
            if (btnText) { btnText.textContent = 'HİKAYEYİ DİNLE'; btnText.innerText = 'HİKAYEYİ DİNLE'; }
            if (btnIcon) { btnIcon.textContent = '🔊'; btnIcon.innerText = '🔊'; }
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

                startStoryAtmosphereDrone();
                duckBackgroundMusic(true);

                isPreviewStoryPlaying = true;
                const btnText = document.getElementById('preview-story-text');
                const btnIcon = document.getElementById('preview-story-icon');
                const wave = document.getElementById('preview-soundwave');
                if (btnText) { btnText.textContent = 'DURDUR'; btnText.innerText = 'DURDUR'; }
                if (btnIcon) { btnIcon.textContent = '⏸️'; btnIcon.innerText = '⏸️'; }
                if (wave) wave.style.display = 'inline-flex';

                const playPromise = previewStoryAudio.play();
                if (playPromise && playPromise.catch) {
                    playPromise.catch(err => {
                        console.warn("Audio play blocked or unavailable, falling back to TTS:", err);
                        playTTSFallback(saga.storyText);
                    });
                }
            } catch(err) {
                console.error("Failed to play preview story audio:", err);
                stopPreviewStoryAudio();
            }
        }

        `;

const droneStartPos = html.indexOf(oldDroneStart);
const droneEndPos = html.indexOf(oldDroneEnd);
if (droneStartPos !== -1 && droneEndPos !== -1) {
    html = html.slice(0, droneStartPos) + newDroneAndPreview + html.slice(droneEndPos);
    console.log("[6] Drone & Preview Audio functions updated successfully.");
} else {
    console.error("[6] ERROR: Could not find drone code slice boundaries!");
}

// Save modified html back to www/index.html
fs.writeFileSync('www/index.html', html, 'utf8');
console.log("SUCCESS: www/index.html updated with complete Audio Engine! New size:", html.length);

const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'www', 'index.html');
let content = fs.readFileSync(targetPath, 'utf8');

console.log("=== APPLYING MASTER UPGRADE: ONBOARDING, SCORING & NARRATOR AUDIO ===");

// 1. UPDATE defaultState with completedTutorials
if (!content.includes('completedTutorials: {},')) {
    content = content.replace(
        'completedLevels: {},',
        'completedLevels: {},\n            completedTutorials: {},'
    );
    console.log("PASS: Added completedTutorials to defaultState.");
}

// 2. UPDATE resetGameProgress with completedTutorials
if (!content.includes('gameState.completedTutorials = {};')) {
    content = content.replace(
        'gameState.completedLevels = {};',
        'gameState.completedLevels = {};\n                gameState.completedTutorials = {};'
    );
    console.log("PASS: Added completedTutorials reset to resetGameProgress.");
}

// 3. UPDATE localStorage loader for completedTutorials
if (!content.includes('if (!gameState.completedTutorials) gameState.completedTutorials = {};')) {
    content = content.replace(
        "if (!gameState.playerProfile) {",
        "if (!gameState.completedTutorials) gameState.completedTutorials = {};\n                if (!gameState.playerProfile) {"
    );
    console.log("PASS: Added completedTutorials check in save loader.");
}

// 4. REPLACE Level 1 tutorial with Progressive Onboarding Engine (Levels 1-4)
const oldTutorialRegex = /\/\/\s*={10,}\s*\n\s*\/\/\s*LEVEL 1 INTERACTIVE ONBOARDING TUTORIAL[\s\S]*?function dismissTutorialHint\(\) \{[\s\S]*?\}\s*\}/;

const newProgressiveEngine = `// ==========================================
        // PROGRESSIVE ONBOARDING TUTORIAL ENGINE (LEVELS 1-4)
        // Shows only on first-time playthrough!
        // ==========================================
        function setupLevelTutorial(lvl) {
            lvl = lvl || gameState.currentPlayingLevel || 1;
            if (!gameState.completedTutorials) gameState.completedTutorials = {};

            // If already completed or level > 4, do nothing
            if (gameState.completedTutorials[lvl] || lvl > 4) return;

            // Remove any existing hint
            dismissTutorialHint();

            const grid = document.getElementById('game-grid');
            if (!grid) return;

            if (lvl === 1) {
                // Level 1: Basic 3-Match Tutorial
                // Setup guaranteed horizontal 3-match at row 3: [3, 2] swapped with [3, 3]
                gridData[3][2] = 'yellow';
                gridData[3][3] = 'purple';
                gridData[3][4] = 'yellow';
                gridData[3][5] = 'yellow';
                if (gridData[2][3] === 'purple') gridData[2][3] = 'green';
                if (gridData[4][3] === 'purple') gridData[4][3] = 'red';
                renderGrid();

                const cells = grid.children;
                const idx1 = 3 * 8 + 2;
                const idx2 = 3 * 8 + 3;
                if (cells[idx1]) cells[idx1].classList.add('tutorial-pulse');
                if (cells[idx2]) cells[idx2].classList.add('tutorial-pulse');

                const cellWidth = grid.clientWidth > 0 ? (grid.clientWidth / 8) : 42;
                const topPos = (3 * cellWidth) - 12;
                const leftPos = (2 * cellWidth) + (cellWidth / 2) - 15;

                const hint = document.createElement('div');
                hint.id = 'tutorial-hand-hint';
                hint.className = 'tutorial-hand-hint';
                hint.style.top = topPos + 'px';
                hint.style.left = leftPos + 'px';
                hint.innerHTML = \`
                    <div class="hand-icon">👉</div>
                    <div class="hand-label">3'lü Eşleştir! (Sağa Kaydır)</div>
                \`;
                grid.appendChild(hint);

                showOnboardingBanner("👉 1. BÖLÜM: 3 AYNI TAŞI EŞLEŞTİR!<br><span style='font-size: 11px; opacity:0.85;'>İşaretli sarı taşı sağa kaydırarak ilk 3'lü eşleştirmeyi yap ve puanını kazan!</span>", 8000);
            } else if (lvl === 2) {
                // Level 2: Lightning Crystal (4-Match)
                // Setup guaranteed horizontal 4-match at row 4: [4, 2] swapped with [4, 3]
                gridData[4][1] = 'blue';
                gridData[4][2] = 'red';
                gridData[4][3] = 'blue';
                gridData[4][4] = 'blue';
                gridData[4][5] = 'blue';
                if (gridData[3][2] === 'red') gridData[3][2] = 'yellow';
                if (gridData[5][2] === 'red') gridData[5][2] = 'green';
                renderGrid();

                const cells = grid.children;
                const idx1 = 4 * 8 + 2;
                const idx2 = 4 * 8 + 3;
                if (cells[idx1]) cells[idx1].classList.add('tutorial-pulse');
                if (cells[idx2]) cells[idx2].classList.add('tutorial-pulse');

                const cellWidth = grid.clientWidth > 0 ? (grid.clientWidth / 8) : 42;
                const topPos = (4 * cellWidth) - 12;
                const leftPos = (2 * cellWidth) + (cellWidth / 2) - 15;

                const hint = document.createElement('div');
                hint.id = 'tutorial-hand-hint';
                hint.className = 'tutorial-hand-hint';
                hint.style.top = topPos + 'px';
                hint.style.left = leftPos + 'px';
                hint.innerHTML = \`
                    <div class="hand-icon">⚡</div>
                    <div class="hand-label">4'lü Eşleştir! (Yıldırım Kristali)</div>
                \`;
                grid.appendChild(hint);

                showOnboardingBanner("⚡ 2. BÖLÜM: YILDIRIM KRİSTALİ (4'LÜ EŞLEŞTİRME)!<br><span style='font-size: 11px; opacity:0.85;'>4 taşı birleştirerek tüm satırı/sütunu temizleyen Şimşek Kristali kazan!</span>", 8000);
            } else if (lvl === 3) {
                // Level 3: Bomb & Zeus Orb
                showOnboardingBanner("💥 3. BÖLÜM: BOMBA & ZEUS KÜRESİ!<br><span style='font-size: 11px; opacity:0.85;'>T veya L şeklinde 5 taşla 3x3 Bomba; düz 5 taşla tek rengi temizleyen Zeus Küresi yarat!</span>", 7000);
            } else if (lvl === 4) {
                // Level 4: Hero Ability & Gauge
                showOnboardingBanner("🛡️ 4. BÖLÜM: KAHRAMAN İLAHİ GÜCÜ!<br><span style='font-size: 11px; opacity:0.85;'>Eşleştirmelerle sol alttaki Kombo Barını doldur, %100 olunca 'Yetenek Kullan' ile gücünü patlat!</span>", 7000);
            }
        }

        function setupLevel1InteractiveTutorial() {
            setupLevelTutorial(1);
        }

        function showOnboardingBanner(htmlText, durationMs = 6000) {
            const oldBanner = document.getElementById('onboarding-tip-banner');
            if (oldBanner) oldBanner.remove();

            const banner = document.createElement('div');
            banner.id = 'onboarding-tip-banner';
            banner.className = 'onboarding-tutorial-banner';
            banner.innerHTML = \`
                <div style="font-size: 12.5px; font-weight: 700; color: #ffe885; line-height: 1.4; text-shadow: 0 2px 4px rgba(0,0,0,0.8);">\${htmlText}</div>
            \`;
            const gameplayScreen = document.getElementById('screen-gameplay');
            if (gameplayScreen) gameplayScreen.appendChild(banner);

            setTimeout(() => {
                if (banner && banner.parentNode) {
                    banner.style.transition = 'opacity 0.6s, transform 0.6s';
                    banner.style.opacity = '0';
                    banner.style.transform = 'translate(-50%, -30px)';
                    setTimeout(() => banner.remove(), 600);
                }
            }, durationMs);
        }

        function dismissTutorialHint() {
            document.querySelectorAll('.tutorial-pulse').forEach(el => el.classList.remove('tutorial-pulse'));
            const hint = document.getElementById('tutorial-hand-hint');
            if (hint) {
                hint.style.opacity = '0';
                setTimeout(() => hint.remove(), 300);
            }
            const banner = document.getElementById('onboarding-tip-banner');
            if (banner) {
                banner.style.opacity = '0';
                setTimeout(() => banner.remove(), 300);
            }
            const lvl = gameState.currentPlayingLevel || 1;
            if (!gameState.completedTutorials) gameState.completedTutorials = {};
            if (lvl <= 4 && !gameState.completedTutorials[lvl]) {
                gameState.completedTutorials[lvl] = true;
                saveGame();
            }
        }`;

if (oldTutorialRegex.test(content)) {
    content = content.replace(oldTutorialRegex, newProgressiveEngine);
    console.log("PASS: Replaced Level 1 tutorial with Progressive Multi-Level Onboarding Engine!");
} else {
    console.log("Warning: oldTutorialRegex did not match directly.");
}

// 5. UPDATE initGrid() TO PREVENT PRE-EXISTING MATCHES AND REMOVE AUTO-EXPLODE
const oldInitGridRegex = /function initGrid\(\) \{[\s\S]*?gridEl\.appendChild\(cell\);[\s\S]*?\}\s*\}/;

const newCleanInitGrid = `function initGrid() {
            const gridEl = document.getElementById('game-grid');
            gridEl.innerHTML = '';
            gridData = [];
            specialGrid = Array(8).fill(null).map(() => Array(8).fill(null));

            // Generate random gems with ZERO initial 3-in-a-row matches
            for (let r = 0; r < 8; r++) {
                gridData[r] = [];
                for (let c = 0; c < 8; c++) {
                    let availableTypes = [...GEM_TYPES];
                    if (c >= 2 && gridData[r][c - 1] === gridData[r][c - 2]) {
                        availableTypes = availableTypes.filter(t => t !== gridData[r][c - 1]);
                    }
                    if (r >= 2 && gridData[r - 1][c] === gridData[r - 2][c]) {
                        availableTypes = availableTypes.filter(t => t !== gridData[r - 1][c]);
                    }
                    const type = availableTypes[Math.floor(Math.random() * availableTypes.length)];
                    gridData[r][c] = type;

                    const cell = document.createElement('div');
                    cell.className = \`cell cell-\${type}\`;
                    cell.draggable = false;
                    cell.innerText = GEM_ICONS[type];
                    cell.dataset.r = r;
                    cell.dataset.c = c;

                    // Unified Pointer Event Handlers (touch, mouse, stylus)
                    cell.addEventListener('pointerdown', onCellPointerDown);
                    cell.addEventListener('pointermove', onCellPointerMove);
                    cell.addEventListener('pointerup', onCellPointerUp);
                    cell.addEventListener('pointercancel', onCellPointerCancel);

                    gridEl.appendChild(cell);
                }
            }

            // Display Progressive Onboarding Guidance & Interactive Tutorial (Levels 1-4)
            const lvl = gameState.currentPlayingLevel || 1;
            if (lvl <= 4 && (!gameState.completedTutorials || !gameState.completedTutorials[lvl])) {
                setTimeout(() => { setupLevelTutorial(lvl); }, 300);
            } else {
                showLevelOnboardingTip();
            }

            // NOTE: Absolutely NO auto-explosion! The board stays stable at 0 score waiting for player moves.
        }`;

if (oldInitGridRegex.test(content)) {
    content = content.replace(oldInitGridRegex, newCleanInitGrid);
    console.log("PASS: Updated initGrid() to prevent matches and removed auto-explosion!");
} else {
    console.log("Warning: oldInitGridRegex did not match.");
}

// 6. GUARD checkDailyReward() for brand new installs
const oldDailyRegex = /function checkDailyReward\(\) \{\s*const today = new Date\(\)\.toDateString\(\);/;
if (oldDailyRegex.test(content)) {
    content = content.replace(
        oldDailyRegex,
        `function checkDailyReward() {\n            // Only unlock daily rewards after the player has completed at least 1 level!\n            if (!gameState.completedLevels || Object.keys(gameState.completedLevels).length === 0) {\n                return;\n            }\n            const today = new Date().toDateString();`
    );
    console.log("PASS: Guarded checkDailyReward() against unearned initial gifts.");
}

// 7. ENSURE executeSwap calls dismissTutorialHint()
if (content.includes('function executeSwap(r1, c1, r2, c2) {') && !content.includes('dismissTutorialHint();\n            isSwapping = true;')) {
    content = content.replace(
        'function executeSwap(r1, c1, r2, c2) {\n            if (gameMoves <= 0 || isSwapping || isLevelEnding) return;\n            isSwapping = true;',
        'function executeSwap(r1, c1, r2, c2) {\n            if (gameMoves <= 0 || isSwapping || isLevelEnding) return;\n            dismissTutorialHint();\n            isSwapping = true;'
    );
    console.log("PASS: Added dismissTutorialHint() to executeSwap().");
}

// 8. ENHANCED MYSTICAL AUDIO NARRATOR & STORE PERMISSION COMPLIANCE
// App Store & Google Play Audio Policy: Audio synthesis must be explicitly triggered by user interaction
// and provide soundscape harmonics if device TTS voice is missing or restricted.
const oldNarratorRegex = /function speakStoryNarrative\(text\) \{[\s\S]*?function stopStoryNarrative\(\) \{[\s\S]*?\}\s*\}/;

const enhancedNarratorSystem = `// ==========================================
        // MYSTICAL HYBRID NARRATOR & AUDIO SYNTHESIS ENGINE
        // App Store & Play Store Policy Compliant (Explicit User Triggered)
        // Works 100% Offline with Deep Mythological Pitch & Ambient Resonance
        // ==========================================
        let storyAmbientDroneNodes = null;

        function startMysticalAmbientDrone() {
            try {
                if (!audioCtx) initAudio();
                if (audioCtx.state === 'suspended') audioCtx.resume();

                // Create deep resonant mystic soundscape (F minor ancient scale)
                const osc1 = audioCtx.createOscillator();
                const osc2 = audioCtx.createOscillator();
                const filter = audioCtx.createBiquadFilter();
                const gain = audioCtx.createGain();

                osc1.type = 'sine';
                osc1.frequency.setValueAtTime(87.31, audioCtx.currentTime); // F2 deep drone
                osc2.type = 'triangle';
                osc2.frequency.setValueAtTime(130.81, audioCtx.currentTime); // C3 fifth harmony

                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(320, audioCtx.currentTime);

                gain.gain.setValueAtTime(0.01, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.09, audioCtx.currentTime + 1.5);

                osc1.connect(filter);
                osc2.connect(filter);
                filter.connect(gain);
                gain.connect(audioCtx.destination);

                osc1.start();
                osc2.start();

                storyAmbientDroneNodes = { osc1, osc2, gain, filter };
            } catch(e) {
                console.log("Ambient drone init error:", e);
            }
        }

        function stopMysticalAmbientDrone() {
            if (storyAmbientDroneNodes) {
                try {
                    const { osc1, osc2, gain } = storyAmbientDroneNodes;
                    gain.gain.setValueAtTime(gain.gain.value, audioCtx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.8);
                    setTimeout(() => {
                        try { osc1.stop(); osc2.stop(); } catch(e) {}
                    }, 850);
                } catch(e) {}
                storyAmbientDroneNodes = null;
            }
        }

        function speakStoryNarrative(text) {
            if (!('speechSynthesis' in window)) {
                console.log("SpeechSynthesis not supported on this platform, relying on ambient score.");
                startMysticalAmbientDrone();
                return;
            }

            try {
                window.speechSynthesis.cancel();
            } catch(e) {}

            startMysticalAmbientDrone();

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'tr-TR';
            utterance.rate = 0.88; // Deep, slow epic cadence
            utterance.pitch = 0.82; // Mystical deep ancient god timbre
            utterance.volume = 1.0;

            const voices = window.speechSynthesis.getVoices();
            const trVoice = voices.find(v => v.lang.includes('tr') || v.lang.includes('TR'));
            if (trVoice) {
                utterance.voice = trVoice;
            }

            utterance.onstart = () => {
                isStoryNarratorSpeaking = true;
                const btn = document.getElementById('story-narrator-btn');
                if (btn) {
                    btn.classList.add('narrator-active');
                    btn.innerHTML = '🔊 <span style="font-size: 11px;">MİSTİK ANLATICI AÇIK</span>';
                }
            };

            utterance.onend = () => {
                isStoryNarratorSpeaking = false;
                stopMysticalAmbientDrone();
                const btn = document.getElementById('story-narrator-btn');
                if (btn) {
                    btn.classList.remove('narrator-active');
                    btn.innerHTML = '🔈 <span style="font-size: 11px;">SESLİ ANLATIMI AÇ</span>';
                }
            };

            utterance.onerror = (err) => {
                console.log("Narrator TTS event info:", err);
                isStoryNarratorSpeaking = false;
                stopMysticalAmbientDrone();
            };

            try {
                window.speechSynthesis.speak(utterance);
            } catch(e) {
                console.log("window.speechSynthesis.speak error:", e);
            }
        }

        function stopStoryNarrative() {
            if ('speechSynthesis' in window) {
                try {
                    window.speechSynthesis.cancel();
                } catch(e) {}
            }
            stopMysticalAmbientDrone();
            isStoryNarratorSpeaking = false;
            const btn = document.getElementById('story-narrator-btn');
            if (btn) {
                btn.classList.remove('narrator-active');
                btn.innerHTML = '🔈 <span style="font-size: 11px;">SESLİ ANLATIMI AÇ</span>';
            }
        }`;

if (oldNarratorRegex.test(content)) {
    content = content.replace(oldNarratorRegex, enhancedNarratorSystem);
    console.log("PASS: Upgraded speakStoryNarrative with Mystical Soundscape Drone & Store Compliant Policies!");
} else {
    console.log("Warning: oldNarratorRegex did not match directly.");
}

fs.writeFileSync(targetPath, content, 'utf8');
console.log("Finished patching www/index.html successfully!");

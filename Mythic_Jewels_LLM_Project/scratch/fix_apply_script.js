const fs = require('fs');

let raw = fs.readFileSync('www/index.html', 'utf8');
const isCRLF = raw.includes('\r\n');
let html = raw.replace(/\r\n/g, '\n');

console.log('Normalized line endings. Total lines:', html.split('\n').length);

// 1. AudioContext fix in sfxVictory & sfxDefeat
const sfxVictoryRegex = /function\s+sfxVictory\s*\(\)\s*\{[\s\S]*?const\s+ctx\s*=\s*new\s*\([^\)]+\)\(\);/;
if (sfxVictoryRegex.test(html)) {
    html = html.replace(sfxVictoryRegex, `function sfxVictory() {
            try {
                const ctx = getAudioContext();
                if (!ctx) return;`);
    console.log('Fixed sfxVictory AudioContext');
} else {
    console.log('sfxVictory already fixed or not matched');
}

const sfxDefeatRegex = /function\s+sfxDefeat\s*\(\)\s*\{[\s\S]*?const\s+ctx\s*=\s*new\s*\([^\)]+\)\(\);/;
if (sfxDefeatRegex.test(html)) {
    html = html.replace(sfxDefeatRegex, `function sfxDefeat() {
            try {
                const ctx = getAudioContext();
                if (!ctx) return;`);
    console.log('Fixed sfxDefeat AudioContext');
} else {
    console.log('sfxDefeat already fixed or not matched');
}

// 2. DOM Pooling in spawnFloatingCombo & spawnFloatingScore
const spawnComboRegex = /function\s+spawnFloatingCombo\s*\(text\)\s*\{[\s\S]*?setTimeout\(\s*\(\)\s*=>\s*popup\.remove\(\)\s*,\s*1200\s*\);\s*\}/;
if (spawnComboRegex.test(html)) {
    html = html.replace(spawnComboRegex, `function spawnFloatingCombo(text) {
            const screen = document.getElementById('screen-gameplay') || document.body;
            const existing = screen.querySelectorAll('.floating-combo-popup');
            if (existing.length >= 3) {
                existing[0].remove();
            }
            const popup = document.createElement('div');
            popup.className = 'floating-combo-popup';
            popup.innerText = text;
            screen.appendChild(popup);
            setTimeout(() => { if (popup.parentNode) popup.remove(); }, 1200);
        }`);
    console.log('Fixed spawnFloatingCombo with DOM pooling');
}

const spawnScoreRegex = /function\s+spawnFloatingScore\s*\(text\)\s*\{[\s\S]*?setTimeout\(\s*\(\)\s*=>\s*popup\.remove\(\)\s*,\s*850\s*\);\s*\}/;
if (spawnScoreRegex.test(html)) {
    html = html.replace(spawnScoreRegex, `function spawnFloatingScore(text) {
            const screen = document.getElementById('screen-gameplay') || document.body;
            const existing = screen.querySelectorAll('.floating-score-popup');
            if (existing.length >= 3) {
                existing[0].remove();
            }
            const popup = document.createElement('div');
            popup.className = 'floating-score-popup';
            popup.innerText = text;
            screen.appendChild(popup);
            setTimeout(() => { if (popup.parentNode) popup.remove(); }, 850);
        }`);
    console.log('Fixed spawnFloatingScore with DOM pooling');
}

// 3. onCellPointerMove with requestAnimationFrame & DPR calibration
const pointerMoveRegex = /function\s+onCellPointerMove\s*\(e\)\s*\{[\s\S]*?if\s*\(\s*absX\s*>=\s*14\s*\|\|\s*absY\s*>=\s*14\s*\)\s*\{[\s\S]*?dismissTutorialHint\(\);\s*executeSwap\(fromR,\s*fromC,\s*toR,\s*toC\);\s*\}\s*\}\s*\}/;

if (pointerMoveRegex.test(html)) {
    html = html.replace(pointerMoveRegex, `let pointerRafPending = false;
        function onCellPointerMove(e) {
            if (activePointerId === null || e.pointerId !== activePointerId || !pointerStartCell) return;
            if (isSwapping || isCascading || isLevelEnding || gameMoves <= 0 || (typeof isGamePaused !== 'undefined' && isGamePaused)) return;

            if (pointerRafPending) return;
            pointerRafPending = true;

            requestAnimationFrame(() => {
                pointerRafPending = false;
                if (activePointerId === null || !pointerStartCell) return;

                const dx = e.clientX - pointerStartX;
                const dy = e.clientY - pointerStartY;
                const absX = Math.abs(dx);
                const absY = Math.abs(dy);

                const dpr = window.devicePixelRatio || 1;
                const glideThreshold = Math.max(12, Math.min(22, Math.round(14 * (dpr > 2 ? 1.1 : 1.0))));

                if (absX >= glideThreshold || absY >= glideThreshold) {
                    pointerMoved = true;
                    const fromR = pointerStartCell.r;
                    const fromC = pointerStartCell.c;
                    const fromEl = pointerStartCell.el;

                    let toR = fromR;
                    let toC = fromC;

                    if (absX > absY) {
                        toC += (dx > 0 ? 1 : -1);
                    } else {
                        toR += (dy > 0 ? 1 : -1);
                    }

                    try {
                        if (fromEl && fromEl.hasPointerCapture && fromEl.hasPointerCapture(e.pointerId)) {
                            fromEl.releasePointerCapture(e.pointerId);
                        }
                    } catch(err) {}

                    activePointerId = null;
                    pointerStartCell = null;
                    clearSelectedCell();

                    if (toR >= 0 && toR < 8 && toC >= 0 && toC < 8) {
                        dismissTutorialHint();
                        executeSwap(fromR, fromC, toR, toC);
                    }
                }
            });
        }`);
    console.log('Fixed onCellPointerMove with requestAnimationFrame & DPR calibration');
}

// 4. SaveMe Ad button
const saveMeRegex = /(<button[^>]*buyExtraMovesWithGems\(\)[^>]*>[\s\S]*?<\/button>)/;
if (saveMeRegex.test(html) && !html.includes('id="btn-save-me-ad"')) {
    html = html.replace(saveMeRegex, `$1
                        <!-- Rewarded Ad Option (+5 Hamle) -->
                        <button id="btn-save-me-ad" class="btn-action" style="height: 46px; font-size: 13px; background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: #fff; font-weight: 800; border: none; border-radius: 12px; box-shadow: 0 4px 12px rgba(59,130,246,0.3);" onclick="watchAdForExtraMoves()">
                            📺 REKLAM İZLE (+5 Hamle Kazan)
                        </button>`);
    console.log('Added btn-save-me-ad');
}

// 5. Engine Injection before startup setTimeout
const startupRegex = /(setTimeout\s*\(\s*\(\)\s*=>\s*\{[\s\S]*?checkProfileSetup\(\);[\s\S]*?checkDailyReward\(\);[\s\S]*?checkFirstTimeOnboarding\(\);[\s\S]*?\}\s*,\s*600\s*\);)/;

if (startupRegex.test(html) && !html.includes('ACTIVE_MATCH_KEY')) {
    const engineCode = `
        // ==========================================
        // ACTIVE MATCH PERSISTENCE & CRASH RECOVERY ENGINE
        // Guarantees ZERO progress loss on call, crash or app kill
        // ==========================================
        const ACTIVE_MATCH_KEY = 'arkenya_active_match';

        function saveActiveMatchSession() {
            if (currentActiveScreen !== 'screen-gameplay' || isLevelEnding || gameMoves <= 0) return;
            try {
                const session = {
                    level: gameState.currentPlayingLevel || 1,
                    score: gameScore,
                    moves: gameMoves,
                    target: gameTarget,
                    gauge: gameGauge,
                    gridData: gridData,
                    specialGrid: specialGrid,
                    savedAt: Date.now()
                };
                localStorage.setItem(ACTIVE_MATCH_KEY, JSON.stringify(session));
            } catch(e) {}
        }

        function clearActiveMatchSession() {
            try {
                localStorage.removeItem(ACTIVE_MATCH_KEY);
            } catch(e) {}
        }

        function checkAndPromptActiveMatchRecovery() {
            try {
                const raw = localStorage.getItem(ACTIVE_MATCH_KEY);
                if (!raw) return false;
                const session = JSON.parse(raw);
                if (!session || !session.level || session.moves <= 0) {
                    clearActiveMatchSession();
                    return false;
                }
                // Valid if saved within last 48 hours
                if (Date.now() - (session.savedAt || 0) > 48 * 3600 * 1000) {
                    clearActiveMatchSession();
                    return false;
                }

                const infoEl = document.getElementById('resume-match-info');
                if (infoEl) {
                    infoEl.innerHTML = '<b>' + session.level + '. Bölüm</b> mücadelen kaydedildi!<br><br><span style="color:var(--gold-light); font-weight:700;">Skor: ' + (session.score || 0).toLocaleString() + '</span> | <span style="color:#38bdf8; font-weight:700;">Kalan Hamle: ' + session.moves + '</span><br><span style="font-size:11px; color:#94a3b8; display:block; margin-top:6px;">Hiçbir can veya puan kaybı olmadan kaldığın yerden devam edebilirsin.</span>';
                }
                openModal('modal-resume-match');
                return true;
            } catch(e) {
                return false;
            }
        }

        function resumeActiveMatchSession() {
            try {
                const raw = localStorage.getItem(ACTIVE_MATCH_KEY);
                if (!raw) {
                    closeModal('modal-resume-match');
                    return;
                }
                const session = JSON.parse(raw);
                closeModal('modal-resume-match');

                gameState.currentPlayingLevel = session.level;
                gameScore = session.score || 0;
                gameMoves = session.moves;
                gameTarget = session.target || 3000;
                gameGauge = session.gauge || 0;
                gridData = session.gridData;
                specialGrid = session.specialGrid || Array(8).fill(null).map(() => Array(8).fill(null));
                isSwapping = false;
                isCascading = false;
                isLevelEnding = false;

                showScreen('screen-gameplay');
                document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));

                // Render restored state
                document.getElementById('game-level-indicator').innerText = 'BÖLÜM ' + session.level;
                document.getElementById('game-score').innerText = gameScore.toLocaleString();
                updateMovesDisplay();
                updateStarProgressBar();
                updateGameplayPowerups();

                const gridEl = document.getElementById('game-grid');
                gridEl.innerHTML = '';
                for (let r = 0; r < 8; r++) {
                    for (let c = 0; c < 8; c++) {
                        const type = gridData[r][c];
                        const cell = document.createElement('div');
                        cell.className = 'cell cell-' + type;
                        cell.draggable = false;
                        cell.innerText = GEM_ICONS[type] || '';
                        cell.dataset.r = r;
                        cell.dataset.c = c;
                        cell.addEventListener('pointerdown', onCellPointerDown);
                        cell.addEventListener('pointermove', onCellPointerMove);
                        cell.addEventListener('pointerup', onCellPointerUp);
                        cell.addEventListener('pointercancel', onCellPointerCancel);
                        gridEl.appendChild(cell);
                    }
                }
                renderGrid();
                showToast("⚔️ Mücadele Kaldığın Yerden Yüklendi!", "success");
            } catch(e) {
                closeModal('modal-resume-match');
                showToast("Kayıt yüklenemedi, yeni bölüm başlatılıyor.", "error");
            }
        }

        function discardActiveMatchSession() {
            clearActiveMatchSession();
            closeModal('modal-resume-match');
            showToast("Önceki mücadele sıfırlandı.", "info");
        }

        // ==========================================
        // LIFECYCLE & AUTO-PAUSE ENGINE
        // Zero background battery drain, thermal safety & automatic pause
        // ==========================================
        let isGamePaused = false;

        function pauseGameForBackground() {
            if (currentActiveScreen === 'screen-gameplay' && !isLevelEnding) {
                isGamePaused = true;
                saveActiveMatchSession();
                if (typeof stopStoryVoice === 'function') {
                    stopStoryVoice();
                }
                if (sharedAudioContext && sharedAudioContext.state === 'running') {
                    try { sharedAudioContext.suspend(); } catch(e) {}
                }
                openModal('modal-pause');
            }
        }

        function resumeGameFromBackground() {
            if (sharedAudioContext && sharedAudioContext.state === 'suspended') {
                try { sharedAudioContext.resume(); } catch(e) {}
            }
        }

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                pauseGameForBackground();
            } else {
                resumeGameFromBackground();
            }
        });

        window.addEventListener('blur', () => {
            pauseGameForBackground();
        });

        window.addEventListener('focus', () => {
            resumeGameFromBackground();
        });

        if (typeof window !== 'undefined' && window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.App) {
            window.Capacitor.Plugins.App.addListener('appStateChange', (state) => {
                if (!state.isActive) {
                    pauseGameForBackground();
                } else {
                    resumeGameFromBackground();
                }
            });
        }

        // ==========================================
        // AD GUARD STATE MACHINE & REWARDED ADS
        // Mute audio, freeze board input, zero mid-combo accidental taps
        // ==========================================
        window.AdGuard = {
            isAdActive: false,

            prepareForAd: function(adType = 'rewarded') {
                this.isAdActive = true;
                saveActiveMatchSession();
                if (typeof stopStoryVoice === 'function') {
                    stopStoryVoice();
                }
                if (sharedAudioContext && sharedAudioContext.state === 'running') {
                    try { sharedAudioContext.suspend(); } catch(e) {}
                }
                isSwapping = true;
            },

            onAdClosed: function(rewardEarned = false, callback = null) {
                this.isAdActive = false;
                isSwapping = false;
                if (sharedAudioContext && sharedAudioContext.state === 'suspended') {
                    try { sharedAudioContext.resume(); } catch(e) {}
                }
                if (rewardEarned && typeof callback === 'function') {
                    callback();
                }
            },

            showRewardedAd: function(rewardTitle, onReward) {
                if (gameState.noAds) {
                    showToast("👑 Reklamsız Pass: Ödül anında verildi!", "success");
                    if (typeof onReward === 'function') onReward();
                    return;
                }

                this.prepareForAd('rewarded');

                const adOverlay = document.createElement('div');
                adOverlay.id = 'admob-simulated-overlay';
                adOverlay.style.cssText = 'position:fixed;inset:0;z-index:999999;background:rgba(0,0,0,0.94);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;text-align:center;backdrop-filter:blur(8px);';
                adOverlay.innerHTML = '<div style="background:linear-gradient(135deg, #1a2234 0%, #0d1322 100%);border:2px solid var(--gold-primary);border-radius:20px;padding:24px;max-width:360px;width:90%;box-shadow:0 10px 40px rgba(0,0,0,0.85);text-align:center;">' +
                    '<div style="font-size:38px;margin-bottom:8px;">📺</div>' +
                    '<div style="font-size:16px;font-weight:800;color:var(--gold-light);margin-bottom:6px;">' + rewardTitle + '</div>' +
                    '<div style="font-size:12px;color:#94a3b8;margin-bottom:16px;">Sponsorlu ödül videosu izleniyor...</div>' +
                    '<div style="background:rgba(0,0,0,0.45);border-radius:10px;padding:12px;margin-bottom:16px;border:1px solid rgba(255,255,255,0.1);">' +
                        '<div id="ad-countdown" style="font-size:22px;font-weight:900;color:#22c55e;">⏳ 3 sn...</div>' +
                    '</div>' +
                    '<button id="btn-ad-close" class="btn-action" style="display:none;background:linear-gradient(180deg,#22c55e,#15803d);color:#fff;font-weight:800;height:44px;font-size:14px;">🎁 ÖDÜLÜ AL VE DEVAM ET</button>' +
                '</div>';
                document.body.appendChild(adOverlay);

                let countdown = 3;
                const interval = setInterval(() => {
                    countdown--;
                    const countEl = document.getElementById('ad-countdown');
                    if (countEl) countEl.innerText = '⏳ ' + countdown + ' sn...';
                    if (countdown <= 0) {
                        clearInterval(interval);
                        if (countEl) countEl.innerText = "✅ Video Tamamlandı!";
                        const btn = document.getElementById('btn-ad-close');
                        if (btn) {
                            btn.style.display = 'block';
                            btn.onclick = () => {
                                adOverlay.remove();
                                window.AdGuard.onAdClosed(true, onReward);
                            };
                        }
                    }
                }, 1000);
            }
        };

        function watchAdForExtraMoves() {
            window.AdGuard.showRewardedAd("EKSTRA +5 HAMLE KAZAN", () => {
                closeModal('modal-save-me');
                gameMoves += 5;
                isLevelEnding = false;
                updateMovesDisplay();
                spawnFloatingCombo("⚡ +5 REKLAM HAMLESİ ALINDI! ⚡");
                saveActiveMatchSession();
            });
        }

        function watchAdForFreeLife() {
            window.AdGuard.showRewardedAd("+1 CAN KAZAN", () => {
                closeModal('modal-out-of-lives');
                gameState.energy = Math.min((gameState.maxEnergy || 5), (gameState.energy || 0) + 1);
                saveGame();
                updateHUD();
                showToast("❤️ +1 Can Hesabına Eklendi!", "success");
            });
        }
`;

    html = html.replace(startupRegex, `${engineCode}

        setTimeout(() => {
            checkProfileSetup();
            checkDailyReward();
            if (gameState.playerProfile && gameState.playerProfile.hasCompletedProfile) {
                const hadRecovery = checkAndPromptActiveMatchRecovery();
                if (!hadRecovery) {
                    checkFirstTimeOnboarding(); // check prologue
                }
            }
        }, 600);`);
    console.log('Injected Engine & updated startup block');
}

// 6. Hook clearActiveMatchSession to showVictory & declineSaveMe
if (html.includes('function showVictory() {') && !html.includes('clearActiveMatchSession();\n            document.getElementById(\'modal-victory\')')) {
    html = html.replace('function showVictory() {', 'function showVictory() {\n            clearActiveMatchSession();');
    console.log('Hooked clearActiveMatchSession to showVictory');
}

if (html.includes('function declineSaveMe() {') && !html.includes('clearActiveMatchSession();\n            closeModal(\'modal-save-me\')')) {
    html = html.replace('function declineSaveMe() {', 'function declineSaveMe() {\n            clearActiveMatchSession();');
    console.log('Hooked clearActiveMatchSession to declineSaveMe');
}

// 7. Hook saveActiveMatchSession on cascade complete
if (html.includes('isCascading = false;\n            checkLevelProgress();') && !html.includes('saveActiveMatchSession();\n            checkLevelProgress();')) {
    html = html.replace('isCascading = false;\n            checkLevelProgress();', 'isCascading = false;\n            saveActiveMatchSession();\n            checkLevelProgress();');
    console.log('Hooked saveActiveMatchSession to cascade completion');
}

// 8. Add will-change and touch-action to .cell CSS
if (html.includes('.cell {') && !html.includes('will-change: transform, opacity;')) {
    html = html.replace('.cell {', '.cell {\n            will-change: transform, opacity;\n            touch-action: none !important;');
    console.log('Added will-change and touch-action to .cell CSS');
}

if (isCRLF) {
    html = html.replace(/\n/g, '\r\n');
}

fs.writeFileSync('www/index.html', html, 'utf8');
console.log('Successfully written updated www/index.html! Length:', html.length);

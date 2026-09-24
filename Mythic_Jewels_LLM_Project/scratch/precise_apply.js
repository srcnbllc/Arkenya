const fs = require('fs');

let raw = fs.readFileSync('www/index.html', 'utf8');
const isCRLF = raw.includes('\r\n');
let content = raw.replace(/\r\n/g, '\n');

// Helper to replace exact substring once and verify
function replaceOnce(searchStr, replaceStr, label) {
    const sNorm = searchStr.replace(/\r\n/g, '\n').trim();
    const rNorm = replaceStr.replace(/\r\n/g, '\n');
    
    if (!content.includes(sNorm)) {
        throw new Error(`Failed to find target for [${label}]!`);
    }
    content = content.replace(sNorm, rNorm);
    console.log(`[OK] Replaced ${label}`);
}

// 1. AudioContext in sfxVictory and sfxDefeat
replaceOnce(
`        function sfxVictory() {
            try {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();`,
`        function sfxVictory() {
            try {
                const ctx = getAudioContext();
                if (!ctx) return;`,
'sfxVictory AudioContext'
);

replaceOnce(
`        function sfxDefeat() {
            try {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();`,
`        function sfxDefeat() {
            try {
                const ctx = getAudioContext();
                if (!ctx) return;`,
'sfxDefeat AudioContext'
);

// 2. DOM Pooling in spawnFloatingCombo and spawnFloatingScore
replaceOnce(
`        function spawnFloatingCombo(text) {
            const popup = document.createElement('div');
            popup.className = 'floating-combo-popup';
            popup.innerText = text;
            document.getElementById('screen-gameplay').appendChild(popup);
            setTimeout(() => popup.remove(), 1200);
        }
        
        function triggerScreenShake() {
            const screen = document.getElementById('screen-gameplay');
            screen.classList.add('shake-animation');
            setTimeout(() => {
                screen.classList.remove('shake-animation');
            }, 400);
        }

        function spawnFloatingScore(text) {
            const popup = document.createElement('div');
            popup.className = 'floating-score-popup';
            popup.innerText = text;
            document.getElementById('screen-gameplay').appendChild(popup);
            setTimeout(() => popup.remove(), 850);
        }`,
`        function spawnFloatingCombo(text) {
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
        }
        
        function triggerScreenShake() {
            const screen = document.getElementById('screen-gameplay');
            screen.classList.add('shake-animation');
            setTimeout(() => {
                screen.classList.remove('shake-animation');
            }, 400);
        }

        function spawnFloatingScore(text) {
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
        }`,
'DOM Pooling for popups'
);

// 3. onCellPointerMove with requestAnimationFrame & DPR calibration
replaceOnce(
`        function onCellPointerMove(e) {
            if (activePointerId === null || e.pointerId !== activePointerId || !pointerStartCell) return;
            if (isSwapping || isCascading || isLevelEnding || gameMoves <= 0) return;

            const dx = e.clientX - pointerStartX;
            const dy = e.clientY - pointerStartY;
            const absX = Math.abs(dx);
            const absY = Math.abs(dy);

            // Responsive 14px glide threshold: instant swap execution!
            if (absX >= 14 || absY >= 14) {
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
        }`,
`        let pointerRafPending = false;
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

                // High-DPI and 60/120Hz calibrated glide threshold
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
        }`,
'onCellPointerMove RAF & DPR'
);

// 4. Save state after cascade finishes
replaceOnce(
`            if (cellsToProcess.length === 0) {
                isSwapping = false;
                isCascading = false;
                clearTimeout(swapWatchdogTimer);`,
`            if (cellsToProcess.length === 0) {
                isSwapping = false;
                isCascading = false;
                clearTimeout(swapWatchdogTimer);
                saveActiveMatchSession();`,
'saveActiveMatchSession on cascade complete'
);

// 5. Clear state on victory and defeat
replaceOnce(
`        function showVictory() {
            document.getElementById('modal-victory').classList.add('active');`,
`        function showVictory() {
            clearActiveMatchSession();
            document.getElementById('modal-victory').classList.add('active');`,
'clearActiveMatchSession on victory'
);

replaceOnce(
`        function declineSaveMe() {
            closeModal('modal-save-me');`,
`        function declineSaveMe() {
            clearActiveMatchSession();
            closeModal('modal-save-me');`,
'clearActiveMatchSession on declineSaveMe'
);

// 6. Modal: RESUME MATCH HTML
replaceOnce(
`            <!-- MODAL: PAUSE -->`,
`            <!-- MODAL: RESUME MATCH (CRASH & INTERRUPT RECOVERY) -->
            <div class="modal-overlay" id="modal-resume-match">
                <div class="modal-card" style="width: 90%; max-width: 380px; padding: 22px; box-sizing: border-box; text-align: center; border: 2px solid var(--gold-primary); box-shadow: 0 0 30px rgba(245, 197, 66, 0.3);">
                    <div style="font-size: 42px; margin-bottom: 6px;">⚔️</div>
                    <div class="modal-title" style="color: var(--gold-light); font-size: 18px; margin-bottom: 8px;">YARIM KALAN MÜCADELE</div>
                    <div id="resume-match-info" style="font-size: 13px; color: #cbd5e1; line-height: 1.5; margin-bottom: 18px; background: rgba(0,0,0,0.3); border-radius: 10px; padding: 12px; border: 1px solid rgba(245,197,66,0.2);">
                        Kaldığın yerden devam etmek ister misin?
                    </div>
                    
                    <button class="btn-action btn-action-green" style="height: 48px; font-size: 15px; margin-bottom: 10px;" onclick="resumeActiveMatchSession()">▶️ SAVAŞA DEVAM ET</button>
                    <button class="btn-action" style="height: 38px; font-size: 12.5px; background: #333; color: #fff;" onclick="discardActiveMatchSession()">✕ İPTAL ET (BÖLÜMÜ SIFIRLA)</button>
                </div>
            </div>

            <!-- MODAL: PAUSE -->`,
'modal-resume-match HTML'
);

// 7. Rewarded ad button in modal-save-me
replaceOnce(
`                        <!-- Elmas Seçeneği (20 Elmas) -->
                        <button id="btn-save-me-gems" class="btn-action btn-action-green" style="height: 46px; font-size: 13px;" onclick="buyExtraMovesWithGems()">
                            💎 20 ELMAS İLE DEVAM ET (+5 Hamle)
                        </button>`,
`                        <!-- Elmas Seçeneği (20 Elmas) -->
                        <button id="btn-save-me-gems" class="btn-action btn-action-green" style="height: 46px; font-size: 13px;" onclick="buyExtraMovesWithGems()">
                            💎 20 ELMAS İLE DEVAM ET (+5 Hamle)
                        </button>
                        <!-- Rewarded Ad Option (+5 Hamle) -->
                        <button id="btn-save-me-ad" class="btn-action" style="height: 46px; font-size: 13px; background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: #fff; font-weight: 800; border: none; border-radius: 12px; box-shadow: 0 4px 12px rgba(59,130,246,0.3);" onclick="watchAdForExtraMoves()">
                            📺 REKLAM İZLE (+5 Hamle Kazan)
                        </button>`,
'btn-save-me-ad HTML'
);

// 8. Rewarded ad button in modal-out-of-lives
replaceOnce(
`                    <button class="btn-action btn-action-green" style="height: 48px; font-size: 14px; margin-bottom: 8px;" onclick="buyFullLives()">⚡ TÜM CANLARI DOLDUR (100 Elmas)</button>`,
`                    <button class="btn-action btn-action-green" style="height: 48px; font-size: 14px; margin-bottom: 8px;" onclick="buyFullLives()">⚡ TÜM CANLARI DOLDUR (100 Elmas)</button>
                    <button class="btn-action" style="height: 44px; font-size: 13px; margin-bottom: 8px; background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: #fff; font-weight: 800;" onclick="watchAdForFreeLife()">📺 REKLAM İZLE (+1 Can Kazan)</button>`,
'watchAdForFreeLife HTML'
);

// 9. quitActiveMatch in modal-pause
replaceOnce(
`                    <button class="btn-action" style="height: 40px; font-size: 13px; background: #333; color: #fff;" onclick="closeModal('modal-pause'); showScreen('screen-mainmenu');
            checkFirstTimeOnboarding();">🗺️ ANA MENÜYE DÖN</button>`,
`                    <button class="btn-action" style="height: 40px; font-size: 13px; background: #333; color: #fff;" onclick="quitActiveMatch()">🗺️ ANA MENÜYE DÖN</button>`,
'quitActiveMatch in modal-pause'
);

// 10. CSS hardware acceleration & touch-action
replaceOnce(
`        .cell {
            touch-action: none !important;
            -webkit-touch-callout: none !important;
            -webkit-user-select: none !important;
            user-select: none !important;
            -webkit-user-drag: none !important;
        }`,
`        .cell {
            will-change: transform, opacity;
            touch-action: none !important;
            -webkit-touch-callout: none !important;
            -webkit-user-select: none !important;
            user-select: none !important;
            -webkit-user-drag: none !important;
        }`,
'CSS will-change & touch-action'
);

// 11. Core Engine Injection and Startup Hook
const engineLogic = `
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
                isGamePaused = false;

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

        function quitActiveMatch() {
            clearActiveMatchSession();
            closeModal('modal-pause');
            showScreen('screen-mainmenu');
            checkFirstTimeOnboarding();
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

replaceOnce(
`        setTimeout(() => {
            checkProfileSetup();
            checkDailyReward();
            if (gameState.playerProfile && gameState.playerProfile.hasCompletedProfile) {
                checkFirstTimeOnboarding(); // check prologue
            }
        }, 600);`,
`${engineLogic}

        setTimeout(() => {
            checkProfileSetup();
            checkDailyReward();
            if (gameState.playerProfile && gameState.playerProfile.hasCompletedProfile) {
                const hadRecovery = checkAndPromptActiveMatchRecovery();
                if (!hadRecovery) {
                    checkFirstTimeOnboarding(); // check prologue
                }
            }
        }, 600);`,
'Engine Injection & Startup Hook'
);

if (isCRLF) {
    content = content.replace(/\n/g, '\r\n');
}

fs.writeFileSync('www/index.html', content, 'utf8');
console.log('Successfully updated www/index.html with all 11 modules! Total size:', content.length);

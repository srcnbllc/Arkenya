const fs = require('fs');

let html = fs.readFileSync('www/index.html', 'utf8');

console.log('Original html length:', html.length);

// 1. AudioContext fix in sfxVictory and sfxDefeat
const oldSfxVictory = `function sfxVictory() {
            try {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();`;
const newSfxVictory = `function sfxVictory() {
            try {
                const ctx = getAudioContext();
                if (!ctx) return;`;

const oldSfxDefeat = `function sfxDefeat() {
            try {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();`;
const newSfxDefeat = `function sfxDefeat() {
            try {
                const ctx = getAudioContext();
                if (!ctx) return;`;

if (!html.includes(oldSfxVictory)) {
    console.error('Failed to find oldSfxVictory!');
} else {
    html = html.replace(oldSfxVictory, newSfxVictory);
    console.log('Replaced sfxVictory AudioContext');
}

if (!html.includes(oldSfxDefeat)) {
    console.error('Failed to find oldSfxDefeat!');
} else {
    html = html.replace(oldSfxDefeat, newSfxDefeat);
    console.log('Replaced sfxDefeat AudioContext');
}

// 2. DOM Pooling in spawnFloatingCombo and spawnFloatingScore
const oldSpawnCombo = `function spawnFloatingCombo(text) {
            const popup = document.createElement('div');
            popup.className = 'floating-combo-popup';
            popup.innerText = text;
            document.getElementById('screen-gameplay').appendChild(popup);
            setTimeout(() => popup.remove(), 1200);
        }`;

const newSpawnCombo = `function spawnFloatingCombo(text) {
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
        }`;

const oldSpawnScore = `function spawnFloatingScore(text) {
            const popup = document.createElement('div');
            popup.className = 'floating-score-popup';
            popup.innerText = text;
            document.getElementById('screen-gameplay').appendChild(popup);
            setTimeout(() => popup.remove(), 850);
        }`;

const newSpawnScore = `function spawnFloatingScore(text) {
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
        }`;

if (html.includes(oldSpawnCombo)) {
    html = html.replace(oldSpawnCombo, newSpawnCombo);
    console.log('Replaced spawnFloatingCombo with DOM pooling');
} else {
    console.warn('oldSpawnCombo not found directly, checking variations...');
}

if (html.includes(oldSpawnScore)) {
    html = html.replace(oldSpawnScore, newSpawnScore);
    console.log('Replaced spawnFloatingScore with DOM pooling');
} else {
    console.warn('oldSpawnScore not found directly');
}

// 3. Touch & Glide optimization in onCellPointerMove
const oldPointerMove = `function onCellPointerMove(e) {
            if (activePointerId === null || e.pointerId !== activePointerId || !pointerStartCell) return;
            if (isSwapping || isCascading || isLevelEnding || gameMoves <= 0) return;

            const dx = e.clientX - pointerStartX;
            const dy = e.clientY - pointerStartY;
            const absX = Math.abs(dx);
            const absY = Math.abs(dy);

            // Responsive 14px glide threshold: instant swap execution!
            if (absX >= 14 || absY >= 14) {`;

const newPointerMove = `let pointerRafPending = false;
        function onCellPointerMove(e) {
            if (activePointerId === null || e.pointerId !== activePointerId || !pointerStartCell) return;
            if (isSwapping || isCascading || isLevelEnding || gameMoves <= 0 || isGamePaused) return;

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

                if (absX >= glideThreshold || absY >= glideThreshold) {`;

if (html.includes(oldPointerMove)) {
    html = html.replace(oldPointerMove, newPointerMove);
    // Remember to close the requestAnimationFrame in onCellPointerMove
    const oldPointerMoveEnd = `dismissTutorialHint();
                    executeSwap(fromR, fromC, toR, toC);
                }
            }
        }`;
    const newPointerMoveEnd = `dismissTutorialHint();
                    executeSwap(fromR, fromC, toR, toC);
                }
            });
        }`;
    if (html.includes(oldPointerMoveEnd)) {
        html = html.replace(oldPointerMoveEnd, newPointerMoveEnd);
        console.log('Replaced onCellPointerMove with requestAnimationFrame & DPR calibration');
    } else {
        console.warn('oldPointerMoveEnd not found!');
    }
} else {
    console.warn('oldPointerMove not found directly');
}

// 4. Add modal-resume-match right before modal-pause
const resumeMatchModalHTML = `<!-- MODAL: RESUME MATCH (CRASH & INTERRUPT RECOVERY) -->
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

            <!-- MODAL: PAUSE -->`;

if (html.includes('<!-- MODAL: PAUSE -->') && !html.includes('id="modal-resume-match"')) {
    html = html.replace('<!-- MODAL: PAUSE -->', resumeMatchModalHTML);
    console.log('Added modal-resume-match HTML');
}

// 5. Add Rewarded Ad buttons in modal-save-me and modal-out-of-lives
const saveMeGemsBtn = `<button id="btn-save-me-gems" class="btn-action btn-action-green" style="height: 46px; font-size: 13px;" onclick="buyExtraMovesWithGems()">
                            💎 20 ELMAS İLE DEVAM ET (+5 Hamle)
                        </button>`;
const saveMeAdBtn = `<button id="btn-save-me-gems" class="btn-action btn-action-green" style="height: 46px; font-size: 13px;" onclick="buyExtraMovesWithGems()">
                            💎 20 ELMAS İLE DEVAM ET (+5 Hamle)
                        </button>
                        <!-- Rewarded Ad Option (+5 Hamle) -->
                        <button id="btn-save-me-ad" class="btn-action" style="height: 46px; font-size: 13px; background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: #fff; font-weight: 800; border: none; border-radius: 12px; box-shadow: 0 4px 12px rgba(59,130,246,0.3);" onclick="watchAdForExtraMoves()">
                            📺 REKLAM İZLE (+5 Hamle Kazan)
                        </button>`;

if (html.includes(saveMeGemsBtn) && !html.includes('id="btn-save-me-ad"')) {
    html = html.replace(saveMeGemsBtn, saveMeAdBtn);
    console.log('Added Rewarded Ad button in modal-save-me');
}

const outOfLivesBtn = `<button class="btn-action btn-action-green" style="height: 48px; font-size: 14px; margin-bottom: 8px;" onclick="buyFullLives()">⚡ TÜM CANLARI DOLDUR (100 Elmas)</button>`;
const outOfLivesAdBtn = `<button class="btn-action btn-action-green" style="height: 48px; font-size: 14px; margin-bottom: 8px;" onclick="buyFullLives()">⚡ TÜM CANLARI DOLDUR (100 Elmas)</button>
                    <button class="btn-action" style="height: 44px; font-size: 13px; margin-bottom: 8px; background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: #fff; font-weight: 800;" onclick="watchAdForFreeLife()">📺 REKLAM İZLE (+1 Can Kazan)</button>`;

if (html.includes(outOfLivesBtn) && !html.includes('watchAdForFreeLife()')) {
    html = html.replace(outOfLivesBtn, outOfLivesAdBtn);
    console.log('Added Rewarded Ad button in modal-out-of-lives');
}

// 6. Persistence, Recovery, Lifecycle, Auto-Pause and AdGuard Engine
const engineScript = `
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
                    infoEl.innerHTML = \`<b>\${session.level}. Bölüm</b> mücadelen kaydedildi!<br><br><span style="color:var(--gold-light); font-weight:700;">Skor: \${(session.score || 0).toLocaleString()}</span> | <span style="color:#38bdf8; font-weight:700;">Kalan Hamle: \${session.moves}</span><br><span style="font-size:11px; color:#94a3b8; display:block; margin-top:6px;">Hiçbir can veya puan kaybı olmadan kaldığın yerden devam edebilirsin.</span>\`;
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
                document.getElementById('game-level-indicator').innerText = \`BÖLÜM \${session.level}\`;
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
                        cell.className = \`cell cell-\${type}\`;
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
            // Safe un-pause flag; modal stays open until user explicitly taps 'OYUNA DEVAM ET'
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
                isSwapping = true; // lock board input
            },

            onAdClosed: function(rewardEarned = false, callback = null) {
                this.isAdActive = false;
                isSwapping = false; // unlock board input
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
                adOverlay.innerHTML = \`
                    <div style="background:linear-gradient(135deg, #1a2234 0%, #0d1322 100%);border:2px solid var(--gold-primary);border-radius:20px;padding:24px;max-width:360px;width:90%;box-shadow:0 10px 40px rgba(0,0,0,0.85);text-align:center;">
                        <div style="font-size:38px;margin-bottom:8px;">📺</div>
                        <div style="font-size:16px;font-weight:800;color:var(--gold-light);margin-bottom:6px;">\${rewardTitle}</div>
                        <div style="font-size:12px;color:#94a3b8;margin-bottom:16px;">Sponsorlu ödül videosu izleniyor...</div>
                        <div style="background:rgba(0,0,0,0.45);border-radius:10px;padding:12px;margin-bottom:16px;border:1px solid rgba(255,255,255,0.1);">
                            <div id="ad-countdown" style="font-size:22px;font-weight:900;color:#22c55e;">⏳ 3 sn...</div>
                        </div>
                        <button id="btn-ad-close" class="btn-action" style="display:none;background:linear-gradient(180deg,#22c55e,#15803d);color:#fff;font-weight:800;height:44px;font-size:14px;">🎁 ÖDÜLÜ AL VE DEVAM ET</button>
                    </div>
                \`;
                document.body.appendChild(adOverlay);

                let countdown = 3;
                const interval = setInterval(() => {
                    countdown--;
                    const countEl = document.getElementById('ad-countdown');
                    if (countEl) countEl.innerText = \`⏳ \${countdown} sn...\`;
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

// Insert the engine right before the startup setTimeout
const startupAnchor = `setTimeout(() => {
            checkProfileSetup();
            checkDailyReward();
            if (gameState.playerProfile && gameState.playerProfile.hasCompletedProfile) {
                checkFirstTimeOnboarding(); // check prologue
            }
        }, 600);`;

const newStartup = `${engineScript}

        setTimeout(() => {
            checkProfileSetup();
            checkDailyReward();
            if (gameState.playerProfile && gameState.playerProfile.hasCompletedProfile) {
                const hadRecovery = checkAndPromptActiveMatchRecovery();
                if (!hadRecovery) {
                    checkFirstTimeOnboarding(); // check prologue
                }
            }
        }, 600);`;

if (html.includes(startupAnchor)) {
    html = html.replace(startupAnchor, newStartup);
    console.log('Injected Engine and updated startup block');
} else {
    console.warn('startupAnchor not found directly!');
}

// 7. Clear active match session on victory and defeat
const oldShowVictory = `function showVictory() {
            document.getElementById('modal-victory').classList.add('active');`;
const newShowVictory = `function showVictory() {
            clearActiveMatchSession();
            document.getElementById('modal-victory').classList.add('active');`;

if (html.includes(oldShowVictory)) {
    html = html.replace(oldShowVictory, newShowVictory);
    console.log('Hooked clearActiveMatchSession to showVictory');
}

const oldDeclineSaveMe = `function declineSaveMe() {
            closeModal('modal-save-me');`;
const newDeclineSaveMe = `function declineSaveMe() {
            clearActiveMatchSession();
            closeModal('modal-save-me');`;

if (html.includes(oldDeclineSaveMe)) {
    html = html.replace(oldDeclineSaveMe, newDeclineSaveMe);
    console.log('Hooked clearActiveMatchSession to declineSaveMe');
}

// 8. Auto-save session on successful moves
const oldCascadeEnd = `isSwapping = false;
            isCascading = false;
            checkLevelProgress();`;

const newCascadeEnd = `isSwapping = false;
            isCascading = false;
            saveActiveMatchSession();
            checkLevelProgress();`;

if (html.includes(oldCascadeEnd)) {
    html = html.replace(oldCascadeEnd, newCascadeEnd);
    console.log('Hooked saveActiveMatchSession to cascade completion');
}

// 9. CSS touch-action and hardware acceleration
const oldCssCell = `.cell {
            position: relative;`;
const newCssCell = `.cell {
            position: relative;
            will-change: transform, opacity;
            touch-action: none !important;`;

if (html.includes(oldCssCell)) {
    html = html.replace(oldCssCell, newCssCell);
    console.log('Added will-change & touch-action to .cell CSS');
}

fs.writeFileSync('www/index.html', html, 'utf8');
console.log('Successfully updated www/index.html! New length:', html.length);

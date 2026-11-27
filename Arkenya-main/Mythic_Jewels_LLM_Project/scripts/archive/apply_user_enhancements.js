const fs = require('fs');

console.log('=== APPLYING 5 USER ENHANCEMENTS ===');

let html = fs.readFileSync('www/index.html', 'utf8');
const isCrlf = html.includes('\r\n');

function clean(str) {
    return str.replace(/\r\n/g, '\n');
}

function restore(str) {
    return isCrlf ? str.replace(/\n/g, '\r\n') : str;
}

html = clean(html);

// -------------------------------------------------------------
// 1. REMOVE RESET OPTION FROM PROFILE MODAL
// -------------------------------------------------------------
const profileResetRegex = /\s*<div id="profile-reset-option"[\s\S]*?<\/div>\s*<\/div>/;

if (!profileResetRegex.test(html)) {
    console.error('FAIL: profileResetRegex not found');
    process.exit(1);
}
html = html.replace(profileResetRegex, '\n                </div>');
console.log('✓ 1. Profile modal reset button removed (now ONLY in Settings)');

// -------------------------------------------------------------
// 2. ENHANCE executeFullGameReset WITH COMPLETE DEEP RESET
// -------------------------------------------------------------
const resetFuncStart = 'function executeFullGameReset() {';
const resetFuncEnd = 'function resetProgressToFresh() {';

const rStartIdx = html.indexOf(resetFuncStart);
const rEndIdx = html.indexOf(resetFuncEnd);

if (rStartIdx === -1 || rEndIdx === -1) {
    console.error('FAIL: executeFullGameReset markers not found');
    process.exit(1);
}

const newExecuteReset = `function executeFullGameReset() {
            closeModal('modal-confirm-reset');
            closeModal('modal-settings');
            closeModal('modal-profile');
            closeModal('modal-profile-setup');

            // Complete wipe of all game data & active sessions
            localStorage.removeItem('arkenya_save_v11');
            localStorage.removeItem('arkenya_active_match');
            localStorage.removeItem('arkenya_user_profile');
            localStorage.removeItem('arkenya_daily_quests');

            // Restore pristine default state with fresh unique user ID
            gameState = JSON.parse(JSON.stringify(defaultState));
            gameState.playerProfile.userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
            gameState.completedLevels = {};
            gameState.completedTutorials = {};
            gameState.unlockedLevel = 1;
            gameState.currentPlayingLevel = 1;
            gameState.totalScore = 0;
            gameState.weeklyScore = 0;
            gameState.monthlyScore = 0;
            gameState.gold = 0;
            gameState.gems = 0;
            gameState.energy = 5;
            gameState.hasSeenPrologue = false;

            saveGame();
            updateHUD();
            updateHeroLockBadges();
            if (typeof renderWorldMapLevels === 'function') renderWorldMapLevels();
            if (typeof renderProfileHeroGrid === 'function') renderProfileHeroGrid();

            showToast("🔥 Tüm oyun geçmişi ve profil verileri sıfırlandı!", "success");
            showScreen('screen-mainmenu');
        }

        `;

html = html.substring(0, rStartIdx) + newExecuteReset + html.substring(rEndIdx);
console.log('✓ 2. executeFullGameReset upgraded with complete deep clean');

// -------------------------------------------------------------
// 3. AUDIO ENGINE: INCREASE GAIN LEVELS & RESUME AUDIO ON ANY TOUCH
// -------------------------------------------------------------
html = html.replace(
    'bgmGainNode.gain.setValueAtTime(isMusicDucked ? 0.005 : 0.045, ctx.currentTime);',
    'bgmGainNode.gain.setValueAtTime(isMusicDucked ? 0.02 : 0.20, ctx.currentTime);'
);

html = html.replace(
    'const targetVol = duck ? 0.005 : 0.045;',
    'const targetVol = duck ? 0.02 : 0.20;'
);

const touchWakeupCode = `
        // Persistent audioContext resume on every interaction (fixes Android WebView / Emulator sleep)
        if (typeof document !== 'undefined') {
            ['pointerdown', 'touchstart', 'click'].forEach(evtType => {
                document.addEventListener(evtType, () => {
                    const ctx = getAudioContext();
                    if (ctx && ctx.state === 'suspended') {
                        ctx.resume().catch(() => {});
                    }
                }, { passive: true });
            });
        }
`;

if (!html.includes('Persistent audioContext resume on every interaction')) {
    html = html.replace('function ensureBgmMasterGain(ctx) {', touchWakeupCode + '\n        function ensureBgmMasterGain(ctx) {');
}
console.log('✓ 3. BGM Master Gain boosted to 0.20 & global touch resume registered');

// -------------------------------------------------------------
// 4. STORY AUDIO TTS FALLBACK IN LEVEL PREVIEW
// -------------------------------------------------------------
const oldAudioCatch = `                const playPromise = previewStoryAudio.play();
                if (playPromise && playPromise.catch) {
                    playPromise.catch(err => {
                        console.warn("Audio play promise catch:", err);
                        if (saga.audioFile) {
                            previewStoryAudio.src = saga.audioFile;
                            previewStoryAudio.play().catch(() => {
                                stopPreviewStoryAudio();
                            });
                        } else {
                            stopPreviewStoryAudio();
                        }
                    });
                }`;

const newAudioCatch = `                const playPromise = previewStoryAudio.play();
                if (playPromise && playPromise.catch) {
                    playPromise.catch(err => {
                        console.warn("Audio play promise catch, falling back to TTS:", err);
                        if (saga.audioFile && previewStoryAudio.src !== saga.audioFile) {
                            previewStoryAudio.src = saga.audioFile;
                            previewStoryAudio.play().catch(() => {
                                playTTSFallback(saga.text || "Kadim Olimpos vadisinde kristallerin parıltısı yankılanıyor.");
                            });
                        } else {
                            playTTSFallback(saga.text || "Kadim Olimpos vadisinde kristallerin parıltısı yankılanıyor.");
                        }
                    });
                }`;

if (!html.includes(oldAudioCatch)) {
    console.error('FAIL: oldAudioCatch not found');
    process.exit(1);
}
html = html.replace(oldAudioCatch, newAudioCatch);
console.log('✓ 4. Story audio fallback to Turkish TTS connected for emulator resilience');

// -------------------------------------------------------------
// 5. CSS: TOP-RIGHT STACK & COMPACT PLAY BUTTON & BOTTOM HAZINE
// -------------------------------------------------------------
const oldCardsCss = `        /* 2. İÇERİK KARTLARI ROW (KRİSTAL LİG & HAZİNELER & GÖREVLER) */
        .mainmenu-content-cards-row {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 10px;
            margin-top: 14px;
            z-index: 25;
        }`;

const newCardsCss = `        /* 2. İÇERİK KARTLARI ROW: SAĞ ÜST DİKEY HİZALI DİZİLİM */
        .mainmenu-content-cards-row {
            display: flex;
            justify-content: flex-end;
            align-items: flex-start;
            margin-top: 8px;
            z-index: 25;
            pointer-events: none;
        }

        /* SAĞ ÜSTTE ALT ALTA 3 BUTON (KRİSTAL LİG, HAZİNELER, GÜNLÜK GÖREVLER) */
        .mainmenu-topright-stack {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 6px;
            width: 142px;
            pointer-events: auto;
        }`;

if (!html.includes(oldCardsCss)) {
    console.error('FAIL: oldCardsCss not found');
    process.exit(1);
}
html = html.replace(oldCardsCss, newCardsCss);

// Update .mainmenu-card-league width
html = html.replace('max-width: 195px;', 'width: 100%; box-sizing: border-box;');
html = html.replace('padding: 8px 10px;', 'padding: 5px 8px; border-radius: 13px;');

// Update .mainmenu-card-treasures layout to compact horizontal pill
const oldTreasuresCss = `        .mainmenu-card-treasures {
            width: 140px;
            background: linear-gradient(145deg, rgba(14, 20, 34, 0.92) 0%, rgba(6, 10, 18, 0.96) 100%);
            border: 1.8px solid var(--gold-primary);
            border-radius: 14px;
            padding: 6px 8px;
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: pointer;
            box-shadow: 0 6px 18px rgba(0,0,0,0.7), inset 0 1px 2px rgba(255,215,0,0.3);
            transition: transform 0.22s ease;
        }`;

const newTreasuresCss = `        .mainmenu-card-treasures {
            width: 100%;
            box-sizing: border-box;
            background: linear-gradient(145deg, rgba(14, 20, 34, 0.94) 0%, rgba(6, 10, 18, 0.98) 100%);
            border: 1.6px solid var(--gold-primary);
            border-radius: 13px;
            padding: 5px 8px;
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            box-shadow: 0 4px 14px rgba(0,0,0,0.7), inset 0 1px 2px rgba(255,215,0,0.3);
            transition: transform 0.2s ease;
        }`;

if (!html.includes(oldTreasuresCss)) {
    console.error('FAIL: oldTreasuresCss not found');
    process.exit(1);
}
html = html.replace(oldTreasuresCss, newTreasuresCss);

// Update chest svg in top-right pill
html = html.replace('width: 100%;\n            height: 38px;', 'width: 30px;\n            height: 26px;');
html = html.replace('width: 48px;\n            height: 36px;', 'width: 28px;\n            height: 22px;');
html = html.replace('.treasures-label-wrap {\n            text-align: center;', '.treasures-label-wrap {\n            text-align: left;');

// Update .mainmenu-card-dailyquests
html = html.replace('width: 140px;\n            background: linear-gradient(135deg, rgba(16, 22, 36, 0.94)', 'width: 100%;\n            box-sizing: border-box;\n            background: linear-gradient(135deg, rgba(16, 22, 36, 0.94)');

// Update .mainmenu-play-area and .mainmenu-play-cta (more compact, sits nicely above Harita)
const oldPlayCss = `        .mainmenu-play-area {
            width: 100%;
            max-width: 360px;
            margin: 0 auto 12px auto;
            display: flex;
            justify-content: center;
            z-index: 30;
        }

        .mainmenu-play-cta {
            width: 100%;
            position: relative;
            background: linear-gradient(180deg, #162a45 0%, #0c1828 50%, #060e18 100%);
            border: 2.5px solid var(--gold-primary);
            border-radius: 20px;
            padding: 10px 16px;
            cursor: pointer;
            box-shadow: 0 0 25px rgba(245, 197, 66, 0.45), 0 8px 30px rgba(0,0,0,0.8), inset 0 2px 3px rgba(255,232,133,0.5);
            display: flex;
            align-items: center;
            justify-content: space-between;
            transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            outline: 1.5px solid rgba(255,215,0,0.4);
            outline-offset: -5px;
        }`;

const newPlayCss = `        .mainmenu-play-area {
            width: auto;
            max-width: 220px;
            margin: auto auto 10px auto;
            display: flex;
            justify-content: center;
            z-index: 30;
        }

        .mainmenu-play-cta {
            width: 100%;
            position: relative;
            background: linear-gradient(180deg, #182e4b 0%, #0d1a2c 50%, #07101b 100%);
            border: 2px solid var(--gold-primary);
            border-radius: 16px;
            padding: 7px 14px;
            cursor: pointer;
            box-shadow: 0 0 20px rgba(245, 197, 66, 0.4), 0 6px 20px rgba(0,0,0,0.8), inset 0 1.5px 2px rgba(255,232,133,0.5);
            display: flex;
            align-items: center;
            justify-content: space-between;
            transition: all 0.22s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            outline: 1.2px solid rgba(255,215,0,0.4);
            outline-offset: -4px;
        }`;

if (!html.includes(oldPlayCss)) {
    console.error('FAIL: oldPlayCss not found');
    process.exit(1);
}
html = html.replace(oldPlayCss, newPlayCss);
console.log('✓ 5. CSS updated for right-aligned stack and compact play button');

// -------------------------------------------------------------
// 6. HTML: TOP-RIGHT STACK (LEAGUE, TREASURES, QUESTS) IN MAIN MENU
// -------------------------------------------------------------
const oldContentRowHtml = `                    <!-- İÇERİK KARTLARI (YÜZEN MİTOLOJİK KARTLAR) -->
                    <div class="mainmenu-content-cards-row">
                        <!-- Sol Üst: KRİSTAL LİG KARTI -->
                        <div class="mainmenu-card-league" id="mainmenu-card-league" onclick="openModal('modal-leaderboard')" title="Kristal Lig & Liderlik Tablosu">
                            <div class="league-card-header">
                                <div class="league-crest-badge">
                                    <svg viewBox="0 0 24 24" style="width:26px; height:26px;">
                                        <path d="M12 2L4 5v6.5C4 16.5 7.5 21 12 22c4.5-1 8-5.5 8-10.5V5L12 2z" fill="rgba(10,30,55,0.9)" stroke="url(#mythicGoldGrad)" stroke-width="1.8"/>
                                        <polygon points="12,6 16,11 12,16 8,11" fill="url(#mythicCyanGrad)" filter="drop-shadow(0 0 4px #00d2ff)"/>
                                    </svg>
                                </div>
                                <div class="league-info-body">
                                    <div class="league-title-row">
                                        <span class="league-name" id="mainmenu-league-name">Kristal Lig</span>
                                        <span class="league-info-icon" onclick="event.stopPropagation(); openModal('modal-leaderboard');" title="Lig Bilgisi">ⓘ</span>
                                    </div>
                                    <div class="league-progress-txt" id="mainmenu-league-progress-text">320 / 1000</div>
                                    <div class="league-progress-bar-wrap">
                                        <div class="league-progress-bar-fill" id="mainmenu-league-progress-fill" style="width: 32%;"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="league-card-reward-row">
                                <span class="reward-trophy-icon">🏆</span>
                                <div class="reward-text-col">
                                    <span class="reward-lbl">Sıradaki Ödül</span>
                                    <span class="reward-timer" id="mainmenu-league-timer">1 gün 4 saat</span>
                                </div>
                                <span class="reward-chest-icon">🎁</span>
                            </div>
                        </div>

                        <!-- Sağ Taraf Kolonu: HAZİNELER & GÜNLÜK GÖREVLER -->
                        <div class="mainmenu-right-cards-col">
                            <!-- Sağ Üst: HAZİNELER KARTI -->
                            <div class="mainmenu-card-treasures" id="mainmenu-card-treasures" onclick="showScreen('screen-store')" title="Hazineler & Mağaza">
                                <div class="treasures-chest-visual">
                                    <svg viewBox="0 0 64 48" class="chest-svg-glowing">
                                        <defs>
                                            <radialGradient id="chestGlowGrad" cx="50%" cy="50%" r="50%">
                                                <stop offset="0%" stop-color="#00ffff" stop-opacity="0.8"/>
                                                <stop offset="60%" stop-color="#ffd700" stop-opacity="0.4"/>
                                                <stop offset="100%" stop-color="#000" stop-opacity="0"/>
                                            </radialGradient>
                                        </defs>
                                        <circle cx="32" cy="24" r="22" fill="url(#chestGlowGrad)"/>
                                        <rect x="12" y="20" width="40" height="24" rx="3" fill="#8b5a2b" stroke="#f5c542" stroke-width="2"/>
                                        <path d="M10 20 Q32 8 54 20 Z" fill="#b8820c" stroke="#ffe885" stroke-width="2"/>
                                        <!-- Mücevherler -->
                                        <polygon points="26,16 32,10 38,16 32,22" fill="#00d2ff" filter="drop-shadow(0 0 3px #fff)"/>
                                        <polygon points="18,18 22,13 26,18 22,23" fill="#ffe885"/>
                                        <polygon points="38,18 42,13 46,18 42,23" fill="#00d2ff"/>
                                        <circle cx="32" cy="28" r="3" fill="#ffd700"/>
                                    </svg>
                                </div>
                                <div class="treasures-label-wrap">
                                    <span class="treasures-title">HAZİNELER</span>
                                    <span class="treasures-sub">Ödüllerini Topla ➔</span>
                                </div>
                            </div>

                            <!-- Orta Sağ: GÜNLÜK GÖREVLER KARTI -->
                            <div class="mainmenu-card-dailyquests" id="mainmenu-card-dailyquests" onclick="openDailyQuestsModal()" title="Günlük Görevler">
                                <div class="dailyquests-scroll-icon">
                                    <span class="scroll-icon-glyph">📜</span>
                                    <span class="dailyquests-red-dot"></span>
                                </div>
                                <div class="dailyquests-text-col">
                                    <span class="dailyquests-title">GÜNLÜK GÖREVLER ➔</span>
                                    <span class="dailyquests-sub">Tamamla ve Ödül Kazan</span>
                                </div>
                            </div>
                        </div>
                    </div>`;

const newContentRowHtml = `                    <!-- İÇERİK KARTLARI (SAĞ ÜSTTE ALT ALTA DİZİLEN 3 KART: KRİSTAL LİG, HAZİNELER, GÜNLÜK GÖREVLER) -->
                    <div class="mainmenu-content-cards-row">
                        <div class="mainmenu-topright-stack">
                            <!-- 1. KRİSTAL LİG KARTI -->
                            <div class="mainmenu-card-league" id="mainmenu-card-league" onclick="openModal('modal-leaderboard')" title="Kristal Lig & Liderlik Tablosu">
                                <div class="league-card-header">
                                    <div class="league-crest-badge">
                                        <svg viewBox="0 0 24 24" style="width:20px; height:20px;">
                                            <path d="M12 2L4 5v6.5C4 16.5 7.5 21 12 22c4.5-1 8-5.5 8-10.5V5L12 2z" fill="rgba(10,30,55,0.9)" stroke="url(#mythicGoldGrad)" stroke-width="1.8"/>
                                            <polygon points="12,6 16,11 12,16 8,11" fill="url(#mythicCyanGrad)" filter="drop-shadow(0 0 4px #00d2ff)"/>
                                        </svg>
                                    </div>
                                    <div class="league-info-body">
                                        <div class="league-title-row">
                                            <span class="league-name" id="mainmenu-league-name">Kristal Lig</span>
                                            <span class="league-info-icon" onclick="event.stopPropagation(); openModal('modal-leaderboard');" title="Lig Bilgisi">ⓘ</span>
                                        </div>
                                        <div class="league-progress-txt" id="mainmenu-league-progress-text">320 / 1000</div>
                                        <div class="league-progress-bar-wrap" style="margin-top:2px;">
                                            <div class="league-progress-bar-fill" id="mainmenu-league-progress-fill" style="width: 32%;"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="league-card-reward-row">
                                    <span class="reward-trophy-icon">🏆</span>
                                    <span class="reward-timer" id="mainmenu-league-timer">1 gün 4 saat</span>
                                    <span class="reward-chest-icon">🎁</span>
                                </div>
                            </div>

                            <!-- 2. HAZİNELER KARTI -->
                            <div class="mainmenu-card-treasures" id="mainmenu-card-treasures" onclick="showScreen('screen-store')" title="Hazineler & Mağaza">
                                <div class="treasures-chest-visual">
                                    <svg viewBox="0 0 64 48" class="chest-svg-glowing">
                                        <defs>
                                            <radialGradient id="chestGlowGrad" cx="50%" cy="50%" r="50%">
                                                <stop offset="0%" stop-color="#00ffff" stop-opacity="0.8"/>
                                                <stop offset="60%" stop-color="#ffd700" stop-opacity="0.4"/>
                                                <stop offset="100%" stop-color="#000" stop-opacity="0"/>
                                            </radialGradient>
                                        </defs>
                                        <circle cx="32" cy="24" r="20" fill="url(#chestGlowGrad)"/>
                                        <rect x="12" y="20" width="40" height="24" rx="3" fill="#8b5a2b" stroke="#f5c542" stroke-width="2"/>
                                        <path d="M10 20 Q32 8 54 20 Z" fill="#b8820c" stroke="#ffe885" stroke-width="2"/>
                                        <polygon points="26,16 32,10 38,16 32,22" fill="#00d2ff"/>
                                        <circle cx="32" cy="28" r="3" fill="#ffd700"/>
                                    </svg>
                                </div>
                                <div class="treasures-label-wrap">
                                    <span class="treasures-title">HAZİNELER</span>
                                    <span class="treasures-sub">Ödüllerini Topla ➔</span>
                                </div>
                            </div>

                            <!-- 3. GÜNLÜK GÖREVLER KARTI -->
                            <div class="mainmenu-card-dailyquests" id="mainmenu-card-dailyquests" onclick="openDailyQuestsModal()" title="Günlük Görevler">
                                <div class="dailyquests-scroll-icon">
                                    <span class="scroll-icon-glyph">📜</span>
                                    <span class="dailyquests-red-dot"></span>
                                </div>
                                <div class="dailyquests-text-col">
                                    <span class="dailyquests-title">GÜNLÜK GÖREVLER ➔</span>
                                    <span class="dailyquests-sub">Tamamla ve Ödül Kazan</span>
                                </div>
                            </div>
                        </div>
                    </div>`;

if (!html.includes(oldContentRowHtml)) {
    console.error('FAIL: oldContentRowHtml not found');
    process.exit(1);
}
html = html.replace(oldContentRowHtml, newContentRowHtml);
console.log('✓ 6. Main menu top-right stack applied');

// -------------------------------------------------------------
// 7. BOTTOM NAVIGATION: REPLACE PANTEON WITH HAZİNE
// -------------------------------------------------------------
const oldPantheonNav = `                        <!-- 3. PANTEON -->
                        <div class="mainmenu-nav-card" id="mainmenu-nav-pantheon" onclick="openPantheonModal()" title="12 Olimposlu Panteon">
                            <div class="nav-card-icon-wrap">
                                <svg class="nav-card-svg" viewBox="0 0 24 24">
                                    <polygon points="12,3 2,8 22,8" fill="rgba(245,197,66,0.3)" stroke="url(#mythicGoldGrad)" stroke-width="1.8"/>
                                    <line x1="5" y1="9" x2="5" y2="18" stroke="url(#mythicGoldGrad)" stroke-width="2"/>
                                    <line x1="9.5" y1="9" x2="9.5" y2="18" stroke="url(#mythicGoldGrad)" stroke-width="2"/>
                                    <line x1="14.5" y1="9" x2="14.5" y2="18" stroke="url(#mythicGoldGrad)" stroke-width="2"/>
                                    <line x1="19" y1="9" x2="19" y2="18" stroke="url(#mythicGoldGrad)" stroke-width="2"/>
                                    <rect x="2" y="18" width="20" height="3" rx="0.5" fill="rgba(245,197,66,0.3)" stroke="url(#mythicGoldGrad)" stroke-width="1.8"/>
                                </svg>
                            </div>
                            <span class="nav-card-label">PANTEON</span>
                        </div>`;

const newHazineNav = `                        <!-- 3. HAZİNE (Eski Panteon yerine, oyun içi alt menü ile birebir uyumlu) -->
                        <div class="mainmenu-nav-card" id="mainmenu-nav-pantheon" onclick="showScreen('screen-store')" title="Hazineler & Mağaza">
                            <div class="nav-card-icon-wrap">
                                <svg class="nav-card-svg" viewBox="0 0 24 24">
                                    <rect x="3" y="10.5" width="18" height="10.5" rx="1.5" fill="rgba(20,32,54,0.9)" stroke="url(#mythicGoldGrad)" stroke-width="1.8"/>
                                    <path d="M3 10.5c0-4 3.5-6.5 9-6.5s9 2.5 9 6.5H3z" fill="rgba(245,197,66,0.3)" stroke="url(#mythicGoldGrad)" stroke-width="1.8"/>
                                    <circle cx="12" cy="14" r="1.8" fill="url(#mythicGoldGrad)"/>
                                    <line x1="12" y1="15.8" x2="12" y2="18.5" stroke="url(#mythicGoldGrad)" stroke-width="1.8"/>
                                    <polygon points="12,1 13,3 15,4 13,5 12,7 11,5 9,4 11,3" fill="url(#mythicGoldGrad)"/>
                                </svg>
                            </div>
                            <span class="nav-card-label">HAZİNE</span>
                        </div>`;

if (!html.includes(oldPantheonNav)) {
    console.error('FAIL: oldPantheonNav not found');
    process.exit(1);
}
html = html.replace(oldPantheonNav, newHazineNav);
console.log('✓ 7. Bottom navigation card converted from PANTEON to HAZİNE');

html = restore(html);
fs.writeFileSync('www/index.html', html, 'utf8');
console.log('\n=== ALL USER ENHANCEMENTS APPLIED TO www/index.html! ===');

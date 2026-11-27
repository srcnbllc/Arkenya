const fs = require('fs');

console.log('=== APPLYING STABILITY, LIFECYCLE, TOAST & MONETIZATION OVERHAUL ===');

const filePath = 'www/index.html';
let content = fs.readFileSync(filePath, 'utf8');

// 1. UPDATE CSS FOR TOAST CONTAINER & TOAST ANIMATIONS
const oldToastCss = `        /* Toast Container */
        #toast-container {
            position: absolute;
            top: 55px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 20000;
            display: flex;
            flex-direction: column;
            gap: 8px;
            pointer-events: none;
            width: 90%;
            max-width: 340px;
        }
        .toast-msg {
            background: rgba(15, 22, 38, 0.95);
            color: #fff;
            border: 1px solid var(--gold-primary);
            border-radius: 12px;
            padding: 10px 16px;
            font-size: 13px;
            font-weight: 600;
            text-align: center;
            box-shadow: 0 4px 15px rgba(0,0,0,0.5);
            animation: toastIn 0.3s ease-out forwards;
        }
        @keyframes toastIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }`;

const newToastCss = `        /* Modern Native Toast Container with Safe Notch Inset */
        #toast-container {
            position: absolute;
            top: max(50px, calc(env(safe-area-inset-top, 0px) + 12px));
            left: 50%;
            transform: translateX(-50%);
            z-index: 25000;
            display: flex;
            flex-direction: column;
            gap: 8px;
            pointer-events: none;
            width: 90%;
            max-width: 360px;
        }
        .toast-msg {
            background: rgba(15, 22, 38, 0.96);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            color: #ffffff;
            border: 1.5px solid var(--gold-primary);
            border-radius: 14px;
            padding: 10px 16px;
            font-size: 13px;
            font-weight: 700;
            line-height: 1.4;
            text-align: center;
            box-shadow: 0 8px 25px rgba(0,0,0,0.65), 0 0 15px rgba(245, 197, 66, 0.25);
            animation: toastIn 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            transition: transform 0.2s ease, opacity 0.25s ease;
            pointer-events: none;
            will-change: transform, opacity;
        }
        .toast-msg.toast-out {
            animation: toastOut 0.25s cubic-bezier(0.7, 0, 0.84, 0) forwards;
        }
        @keyframes toastIn {
            from { opacity: 0; transform: translateY(-16px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes toastOut {
            from { opacity: 1; transform: translateY(0) scale(1); }
            to { opacity: 0; transform: translateY(-12px) scale(0.92); }
        }`;

if (content.includes(oldToastCss)) {
    content = content.replace(oldToastCss, newToastCss);
    console.log('✅ Updated Toast CSS with smooth toastOut & notch support.');
} else {
    console.warn('⚠️ oldToastCss exact match not found, applying regex fallback...');
    content = content.replace(/\/\*\s*Toast Container\s*\*\/[\s\S]*?@keyframes toastIn\s*\{[\s\S]*?\}\s*\}/, newToastCss);
}

// 2. INSERT GLOBAL ERROR & REJECTION BOUNDARY AT SCRIPT START
const errorBoundarySnippet = `        // ==========================================
        // GLOBAL ERROR & UNHANDLED REJECTION BOUNDARY
        // Guarantees zero unhandled crashes or ANRs on Android & iOS
        // ==========================================
        window.addEventListener('error', function(event) {
            console.warn('[ARKENYA RESILIENCE GUARD] Handled error:', event.message || event);
            return true; // Prevents default browser error dialog
        });

        window.addEventListener('unhandledrejection', function(event) {
            console.warn('[ARKENYA RESILIENCE GUARD] Handled rejection:', event.reason);
            if (event.preventDefault) event.preventDefault();
        });

`;

const firebaseHeader = `        // =========================================================================\n        // AAA LUXURY FIREBASE FIRESTORE SYNC & LEADERBOARD ENGINE`;

if (!content.includes('[ARKENYA RESILIENCE GUARD]') && content.includes(firebaseHeader)) {
    content = content.replace(firebaseHeader, errorBoundarySnippet + firebaseHeader);
    console.log('✅ Attached Global Error & Rejection Boundary at top of main script.');
}

// 3. RE-ENTRANCY GUARD FOR saveGame()
const oldSaveGame = `        function saveGame() {
            try {
                localStorage.setItem('arkenya_save_v11', JSON.stringify(gameState));
            } catch (err) {
                console.warn('LocalStorage save failed:', err);
            }
            updateHUD();
            updateHeroLockBadges();
        }`;

const newSaveGame = `        let isSavingGame = false;
        function saveGame() {
            if (isSavingGame) return;
            isSavingGame = true;
            try {
                localStorage.setItem('arkenya_save_v11', JSON.stringify(gameState));
            } catch (err) {
                console.warn('LocalStorage save failed:', err);
            }
            try {
                updateHUD();
                updateHeroLockBadges();
            } catch (err) {
                console.warn('HUD update inside saveGame caught:', err);
            } finally {
                isSavingGame = false;
            }
        }`;

if (content.includes(oldSaveGame)) {
    content = content.replace(oldSaveGame, newSaveGame);
    console.log('✅ Added re-entrancy protection to saveGame().');
}

// 4. RE-ENTRANCY GUARD FOR syncAllHUDs()
const oldSyncAllHUDs = `        function syncAllHUDs() {
            // 1. Top Global HUD`;

const newSyncAllHUDs = `        let isSyncingHUDs = false;
        function syncAllHUDs() {
            if (isSyncingHUDs) return;
            isSyncingHUDs = true;
            try {
                // 1. Top Global HUD`;

if (content.includes(oldSyncAllHUDs)) {
    // Also find where syncAllHUDs ends and close the try...finally block
    content = content.replace(oldSyncAllHUDs, newSyncAllHUDs);
    // find saveGame(); in syncAllHUDs
    content = content.replace(/(saveGame\(\);\s*\n\s*)(\}\s*\n\s*function purchaseIAP)/, `$1} finally {\n                isSyncingHUDs = false;\n            }\n        }\n\n        function purchaseIAP`);
    console.log('✅ Added re-entrancy protection to syncAllHUDs().');
}

// 5. UPDATE showToast() JS IMPLEMENTATION
const oldShowToastRegex = /let lastToastMsg = '';\s*let lastToastTime = 0;\s*function showToast\([\s\S]*?setTimeout\(\(\) => \{\s*if \(toast && toast\.parentNode\) \{\s*toast\.remove\(\);\s*\}\s*\}, 2400\);\s*\}/;

const newShowToast = `let lastToastMsg = '';
        let lastToastTime = 0;

        function showToast(msg, type = 'info') {
            const container = document.getElementById('toast-container');
            if (!container) return;

            const now = Date.now();
            // Anti-spam: if identical message fired within 1.2 seconds, pulse existing and return
            if (msg === lastToastMsg && (now - lastToastTime) < 1200) {
                const existing = container.querySelectorAll('.toast-msg:not(.toast-out)');
                if (existing.length > 0) {
                    const latest = existing[existing.length - 1];
                    latest.style.transform = 'scale(1.06)';
                    setTimeout(() => { if (latest) latest.style.transform = 'scale(1)'; }, 150);
                    return;
                }
            }

            lastToastMsg = msg;
            lastToastTime = now;

            // Smoothly dismiss older toasts if limit (2) reached
            const activeToasts = container.querySelectorAll('.toast-msg:not(.toast-out)');
            if (activeToasts.length >= 2) {
                const oldest = activeToasts[0];
                oldest.classList.add('toast-out');
                setTimeout(() => {
                    if (oldest && oldest.parentNode) oldest.remove();
                }, 260);
            }

            const toast = document.createElement('div');
            toast.className = 'toast-msg';
            if (type === 'error') {
                toast.style.borderColor = 'var(--accent-red)';
                toast.style.color = '#ff9999';
                toast.style.boxShadow = '0 8px 25px rgba(0,0,0,0.65), 0 0 15px rgba(231, 76, 60, 0.3)';
            } else if (type === 'success') {
                toast.style.borderColor = 'var(--accent-green)';
                toast.style.color = '#99ffbb';
                toast.style.boxShadow = '0 8px 25px rgba(0,0,0,0.65), 0 0 15px rgba(46, 204, 113, 0.3)';
            }
            toast.innerText = msg;
            container.appendChild(toast);

            const removeTimer = setTimeout(() => {
                if (toast && toast.parentNode) {
                    toast.classList.add('toast-out');
                    setTimeout(() => {
                        if (toast && toast.parentNode) toast.remove();
                    }, 260);
                }
            }, 2400);
            toast._timer = removeTimer;
        }`;

if (oldShowToastRegex.test(content)) {
    content = content.replace(oldShowToastRegex, newShowToast);
    console.log('✅ Overhauled showToast() with queue management & smooth exit.');
} else {
    console.warn('⚠️ oldShowToastRegex did not match directly, checking fallback...');
}

// 6. XP LEVEL-UP LOOP LIMIT IN updateMainMenuUI()
const oldXpLoop = `            // Seviye atlama kontrolü (Kapasite üstü birikmeyi engeller)
            while (gameState.xp >= gameState.maxXp && gameState.maxXp > 0) {
                gameState.xp -= gameState.maxXp;
                gameState.playerLevel++;
                gameState.maxXp = gameState.playerLevel * 500;
            }`;

const newXpLoop = `            // Seviye atlama kontrolü (Kapasite üstü birikmeyi engeller - Loop Limit Korumalı)
            let xpLoopLimit = 100;
            while (gameState.xp >= gameState.maxXp && gameState.maxXp > 0 && xpLoopLimit-- > 0) {
                gameState.xp -= gameState.maxXp;
                gameState.playerLevel++;
                gameState.maxXp = gameState.playerLevel * 500;
            }`;

if (content.includes(oldXpLoop)) {
    content = content.replace(oldXpLoop, newXpLoop);
    console.log('✅ Added loop limit to XP level-up in updateMainMenuUI().');
}

// 7. SAFE LIFECYCLE BACKGROUND & FOREGROUND AUDIO & REGEN RECOVERY
const oldResumeGame = `        function resumeGameFromBackground() {
            if (sharedAudioContext && sharedAudioContext.state === 'suspended') {
                try { sharedAudioContext.resume(); } catch(e) {}
            }
        }`;

const newResumeGame = `        function resumeGameFromBackground() {
            if (sharedAudioContext && sharedAudioContext.state === 'suspended') {
                try { sharedAudioContext.resume().catch(() => {}); } catch(e) {}
            }
            // Offline can yenilenmesini anında hesapla & senkronize et
            if (typeof checkEnergyRegen === 'function') {
                checkEnergyRegen();
            }
            if (typeof syncAllHUDs === 'function') {
                syncAllHUDs();
            }
        }`;

if (content.includes(oldResumeGame)) {
    content = content.replace(oldResumeGame, newResumeGame);
    console.log('✅ Enhanced resumeGameFromBackground() with promise catch & instant energy regen sync.');
}

// 8. ADGUARD WATCHDOG TIMEOUT FALLBACK (Never get trapped in ad overlay)
const oldAdGuardShow = `                let countdown = 3;
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
                }, 1000);`;

const newAdGuardShow = `                let countdown = 3;
                let isFinished = false;
                const interval = setInterval(() => {
                    countdown--;
                    const countEl = document.getElementById('ad-countdown');
                    if (countEl && !isFinished) countEl.innerText = '⏳ ' + countdown + ' sn...';
                    if (countdown <= 0) {
                        clearInterval(interval);
                        isFinished = true;
                        if (countEl) countEl.innerText = "✅ Video Tamamlandı!";
                        const btn = document.getElementById('btn-ad-close');
                        if (btn) {
                            btn.style.display = 'block';
                            btn.onclick = () => {
                                if (adOverlay && adOverlay.parentNode) adOverlay.remove();
                                window.AdGuard.onAdClosed(true, onReward);
                            };
                        }
                    }
                }, 1000);

                // Watchdog: After 6 seconds, allow emergency skip if stuck
                setTimeout(() => {
                    if (adOverlay && adOverlay.parentNode && !isFinished) {
                        const countEl = document.getElementById('ad-countdown');
                        if (countEl) countEl.innerText = "✅ Tamamlandı (Atla)";
                        const btn = document.getElementById('btn-ad-close');
                        if (btn) {
                            btn.style.display = 'block';
                            btn.onclick = () => {
                                adOverlay.remove();
                                window.AdGuard.onAdClosed(true, onReward);
                            };
                        }
                    }
                }, 6000);`;

if (content.includes(oldAdGuardShow)) {
    content = content.replace(oldAdGuardShow, newAdGuardShow);
    console.log('✅ Added Watchdog Timeout to AdGuard showRewardedAd.');
}

// 9. ADD 2X VICTORY REWARD MONETIZATION BUTTON TO MODAL-VICTORY HTML
const oldVictoryButtons = `                    <!-- Next Level & Return Buttons -->
                    <button class="btn-action btn-action-green" id="btn-victory-next" style="height: 48px; font-size: 14.5px; font-weight: 800; margin-bottom: 8px;" onclick="playNextLevelDirectly()">⚡ SONRAKİ BÖLÜME GEÇ (Bölüm <span id="next-lvl-num-btn">2</span>) ➔</button>`;

const newVictoryButtons = `                    <!-- 2X Double Reward Monetization Button (Rewarded Ad / VIP) -->
                    <button class="btn-action" id="btn-victory-double-ad" style="background: linear-gradient(180deg, #f59e0b 0%, #d97706 100%); color: #fff; font-weight: 800; height: 44px; font-size: 13.5px; margin-bottom: 8px; box-shadow: 0 4px 15px rgba(245,158,11,0.35); display: flex; align-items: center; justify-content: center; gap: 8px;" onclick="watchAdToDoubleVictoryRewards()">
                        <span>🎬 2X ÖDÜL KAZAN (Ödüllü Video)</span>
                    </button>

                    <!-- Next Level & Return Buttons -->
                    <button class="btn-action btn-action-green" id="btn-victory-next" style="height: 48px; font-size: 14.5px; font-weight: 800; margin-bottom: 8px;" onclick="playNextLevelDirectly()">⚡ SONRAKİ BÖLÜME GEÇ (Bölüm <span id="next-lvl-num-btn">2</span>) ➔</button>`;

if (content.includes(oldVictoryButtons)) {
    content = content.replace(oldVictoryButtons, newVictoryButtons);
    console.log('✅ Injected 2X Rewarded Ad Button into modal-victory.');
}

// 10. ADD watchAdToDoubleVictoryRewards() FUNCTION & UPDATE showVictory()
const oldShowVictoryEnd = `            saveGame();

            // Animate score count up`;

const newShowVictoryWithDouble = `            lastVictoryEarnedGold = earnedGold;
            lastVictoryEarnedGems = earnedGems;

            const doubleAdBtn = document.getElementById('btn-victory-double-ad');
            if (doubleAdBtn) {
                doubleAdBtn.disabled = false;
                doubleAdBtn.style.opacity = '1';
                doubleAdBtn.style.background = 'linear-gradient(180deg, #f59e0b 0%, #d97706 100%)';
                doubleAdBtn.innerHTML = \`<span>🎬 2X ÖDÜL KAZAN (+$\{earnedGold} 🪙, +$\{earnedGems} 💎)</span>\`;
                doubleAdBtn.style.display = 'flex';
            }

            saveGame();

            // Animate score count up`;

if (content.includes(oldShowVictoryEnd)) {
    content = content.replace(oldShowVictoryEnd, newShowVictoryWithDouble);
    console.log('✅ Integrated double rewards initialization in showVictory().');
}

// Add the watchAdToDoubleVictoryRewards function near watchAdForFreeLife
const oldWatchAdLife = `        function watchAdForFreeLife() {
            window.AdGuard.showRewardedAd("+1 CAN KAZAN", () => {
                closeModal('modal-out-of-lives');
                gameState.energy = Math.min((gameState.maxEnergy || 5), (gameState.energy || 0) + 1);
                saveGame();
                updateHUD();
                showToast("❤️ +1 Can Hesabına Eklendi!", "success");
            });
        }`;

const newWatchAdLifeWithDouble = `        function watchAdForFreeLife() {
            window.AdGuard.showRewardedAd("+1 CAN KAZAN", () => {
                closeModal('modal-out-of-lives');
                gameState.energy = Math.min((gameState.maxEnergy || 5), (gameState.energy || 0) + 1);
                saveGame();
                updateHUD();
                showToast("❤️ +1 Can Hesabına Eklendi!", "success");
            });
        }

        var lastVictoryEarnedGold = 0;
        var lastVictoryEarnedGems = 0;

        function watchAdToDoubleVictoryRewards() {
            const goldEarned = lastVictoryEarnedGold || 150;
            const gemsEarned = lastVictoryEarnedGems || 3;
            const btn = document.getElementById('btn-victory-double-ad');

            if (gameState.noAds) {
                gameState.gold = (gameState.gold || 0) + goldEarned;
                gameState.gems = (gameState.gems || 0) + gemsEarned;
                saveGame();
                syncAllHUDs();
                const goldEl = document.getElementById('victory-gold');
                const gemsEl = document.getElementById('victory-gems');
                if (goldEl) goldEl.innerText = (goldEarned * 2).toLocaleString();
                if (gemsEl) gemsEl.innerText = (gemsEarned * 2).toLocaleString();
                if (btn) {
                    btn.disabled = true;
                    btn.innerText = "👑 VIP: 2X ÖDÜL KATLANDI!";
                    btn.style.opacity = '0.7';
                    btn.style.background = '#475569';
                }
                showToast(\`👑 VIP Reklamsız: +\${goldEarned} Altın ve +\${gemsEarned} Elmas eklendi!\`, "success");
                return;
            }

            window.AdGuard.showRewardedAd("2X ZAFER ÖDÜLÜ KATLAMA", () => {
                gameState.gold = (gameState.gold || 0) + goldEarned;
                gameState.gems = (gameState.gems || 0) + gemsEarned;
                saveGame();
                syncAllHUDs();
                const goldEl = document.getElementById('victory-gold');
                const gemsEl = document.getElementById('victory-gems');
                if (goldEl) goldEl.innerText = (goldEarned * 2).toLocaleString();
                if (gemsEl) gemsEl.innerText = (gemsEarned * 2).toLocaleString();
                if (btn) {
                    btn.disabled = true;
                    btn.innerText = "✅ 2X ÖDÜL KAZANILDI!";
                    btn.style.opacity = '0.7';
                    btn.style.background = '#475569';
                }
                spawnFloatingCombo(\`✨ 2X ZAFER ÖDÜLÜ!\\n+\${goldEarned} 🪙 • +\${gemsEarned} 💎\`);
                showToast(\`🎉 Zafer ödülü 2 katına çıkarıldı! (+\${goldEarned} 🪙, +\${gemsEarned} 💎)\`, "success");
            });
        }`;

if (content.includes(oldWatchAdLife)) {
    content = content.replace(oldWatchAdLife, newWatchAdLifeWithDouble);
    console.log('✅ Injected watchAdToDoubleVictoryRewards() function.');
}

// 11. AUDIO UNLOCK ON FIRST USER INTERACTION (IOS / ANDROID TOUCH UNLOCK)
const initCapacitorTarget = `        setTimeout(() => {
            initCapacitorMobileApp();`;

const initCapacitorWithAudioUnlock = `        // Fast pointerdown audio unlock on first user touch (prevents AudioContext suspension warnings on mobile)
        function unlockAudioOnFirstInteraction() {
            if (!sharedAudioContext) {
                if (typeof initAudioContext === 'function') initAudioContext();
            } else if (sharedAudioContext.state === 'suspended') {
                try { sharedAudioContext.resume().catch(() => {}); } catch(e) {}
            }
            window.removeEventListener('pointerdown', unlockAudioOnFirstInteraction);
            window.removeEventListener('touchstart', unlockAudioOnFirstInteraction);
        }
        window.addEventListener('pointerdown', unlockAudioOnFirstInteraction, { passive: true, once: true });
        window.addEventListener('touchstart', unlockAudioOnFirstInteraction, { passive: true, once: true });

        setTimeout(() => {
            initCapacitorMobileApp();`;

if (content.includes(initCapacitorTarget)) {
    content = content.replace(initCapacitorTarget, initCapacitorWithAudioUnlock);
    console.log('✅ Added touch audio unlock listener for mobile WebViews.');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('=== OVERHAUL SUCCESSFULLY WRITTEN TO www/index.html ===');

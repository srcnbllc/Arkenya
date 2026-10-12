const fs = require('fs');

const path = 'www/index.html';
let content = fs.readFileSync(path, 'utf8');

console.log('=== APPLYING WEEKLY LEAGUE ENGINE & RESPONSIVE MAP BOUNDS ===');

// Check if Section 1 already added
if (!content.includes('function checkAndApplyWeeklyRollover()')) {
    const oldSeasonRollover = /function checkAndApplyMonthlySeasonRollover\(\) \{/;
    const weeklyAndMonthlyCode = `function getCurrentWeekInfo() {
            const now = new Date();
            const d = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
            const dayNum = d.getUTCDay() || 7;
            d.setUTCDate(d.getUTCDate() + 4 - dayNum);
            const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
            const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
            const year = d.getUTCFullYear();
            const dayOfWeek = now.getDay();
            const daysUntilMonday = ((8 - (dayOfWeek === 0 ? 7 : dayOfWeek)) % 7) || 7;
            return {
                key: year + '-W' + String(weekNo).padStart(2, '0'),
                weekNumber: weekNo,
                year: year,
                daysLeft: daysUntilMonday
            };
        }

        function checkAndApplyWeeklyRollover() {
            if (!gameState) return;
            const week = getCurrentWeekInfo();
            const storedWeekKey = gameState.activeWeekKey;

            if (!storedWeekKey) {
                gameState.activeWeekKey = week.key;
                if (typeof gameState.weeklyScore === 'undefined') {
                    gameState.weeklyScore = 0;
                }
                return;
            }

            if (storedWeekKey !== week.key) {
                const lastRank = gameState.lastRecordedWeeklyRank || 10;
                const currentLeague = getCurrentPlayerLeague(gameState.unlockedLevel || 1);

                if (lastRank <= 3) {
                    const gemReward = Math.round(currentLeague.rewardGems * 0.4);
                    const goldReward = Math.round(currentLeague.rewardGold * 0.4);
                    gameState.gems = (gameState.gems || 0) + gemReward;
                    gameState.gold = (gameState.gold || 0) + goldReward;
                    setTimeout(() => {
                        showToast('🏆 YENİ HAFTA BAŞLADI! Haftalık Ligde ' + lastRank + '. sırayı elde ettin! Ödülün: +' + gemReward + ' 💎 +' + goldReward.toLocaleString() + ' 💰', 'success');
                    }, 1500);
                }

                gameState.weeklyScore = 0;
                gameState.activeWeekKey = week.key;

                try {
                    for (let i = localStorage.length - 1; i >= 0; i--) {
                        const k = localStorage.key(i);
                        if (k && k.includes('_weekly_')) {
                            localStorage.removeItem(k);
                        }
                    }
                } catch(e) {}

                if (typeof saveGame === 'function') saveGame();
            }
        }

        function checkAndApplyMonthlySeasonRollover() {`;

    content = content.replace(oldSeasonRollover, weeklyAndMonthlyCode);
    console.log('✓ Section 1: Weekly league rollover functions integrated');
} else {
    console.log('✓ Section 1: Weekly league rollover already present');
}

// 2. Patch syncScoreToLeaderboard using regex
const syncRegex = /function syncScoreToLeaderboard\(forcedScore = null\) \{[\r\n\s]+if \(!gameState\) return;[\r\n\s]+checkAndApplyMonthlySeasonRollover\(\);[\r\n\s]+const scoreAllTime = forcedScore !== null \? forcedScore : \(gameState\.totalScore \|\| 0\);[\r\n\s]+gameState\.weeklyScore = Math\.max\(gameState\.weeklyScore \|\| 0, scoreAllTime\);[\r\n\s]+gameState\.monthlyScore = Math\.max\(gameState\.monthlyScore \|\| 0, scoreAllTime\);[\r\n\s]+gameState\.totalScore = Math\.max\(gameState\.totalScore \|\| 0, scoreAllTime\);/;

const newSyncReplacement = `function syncScoreToLeaderboard(forcedScore = null) {
            if (!gameState) return;
            checkAndApplyMonthlySeasonRollover();
            checkAndApplyWeeklyRollover();
            const scoreAllTime = forcedScore !== null ? forcedScore : (gameState.totalScore || 0);
            gameState.totalScore = Math.max(gameState.totalScore || 0, scoreAllTime);
            if (typeof gameState.monthlyScore === 'undefined') gameState.monthlyScore = gameState.totalScore;
            if (typeof gameState.weeklyScore === 'undefined') gameState.weeklyScore = gameState.totalScore;`;

if (syncRegex.test(content)) {
    content = content.replace(syncRegex, newSyncReplacement);
    console.log('✓ Section 2: syncScoreToLeaderboard protected from score overwriting');
} else {
    console.log('Notice: syncScoreToLeaderboard already patched or regex mismatch');
}

// 3. Patch weekly timer and rank record in loadLeaderboard
const timerRegex = /else if \(type === 'haftalik'\) timerEl\.innerText = '⏳ Sıfırlanma: Pazartesi 00:00';/;
const newTimerReplacement = "else if (type === 'haftalik') { const wInfo = getCurrentWeekInfo(); timerEl.innerText = '⏳ Sıfırlanma: ' + wInfo.daysLeft + ' Gün (Pazartesi 00:00)'; }";

if (timerRegex.test(content)) {
    content = content.replace(timerRegex, newTimerReplacement);
    console.log('✓ Section 3a: loadLeaderboard weekly timer countdown updated');
}

const rankRegex = /if \(type === 'aylik'\) gameState\.lastRecordedRank = myRank;/;
const newRankReplacement = "if (type === 'aylik') { gameState.lastRecordedRank = myRank; } else if (type === 'haftalik') { gameState.lastRecordedWeeklyRank = myRank; }";

if (rankRegex.test(content)) {
    content = content.replace(rankRegex, newRankReplacement);
    console.log('✓ Section 3b: loadLeaderboard weekly rank tracking added');
}

// 4. Responsive map node coordinates
const mapCoordsRegex = /const y = 50 \+ \(i \* 65\);[\r\n\s]+\/\/ Organic non-repeating curve using multiple sine waves[\r\n\s]+const xOffset = Math\.sin\(i \* 0\.4\) \* 80 \+ Math\.cos\(i \* 0\.15\) \* 60 \+ Math\.sin\(i \* 0\.9\) \* 20;[\r\n\s]+const x = 185 \+ xOffset;[\r\n\s]+node\.style\.top = y \+ 'px';[\r\n\s]+node\.style\.left = x \+ 'px';/;

const newMapCoords = `const y = 50 + (i * 65);
                // Responsive bounded curve calibrated to screen width (320px - 450px safe)
                const cWidth = (container && container.clientWidth > 0) ? container.clientWidth : Math.min(window.innerWidth || 380, 420);
                const cCenter = cWidth / 2;
                const maxAmp = Math.max(45, Math.min(85, (cWidth - 96) / 2));
                const normWave = Math.sin(i * 0.4) * 0.55 + Math.cos(i * 0.15) * 0.35 + Math.sin(i * 0.9) * 0.10;
                const x = Math.round(cCenter + (normWave * maxAmp));
                node.style.top = y + 'px';
                node.style.left = x + 'px';`;

if (mapCoordsRegex.test(content)) {
    content = content.replace(mapCoordsRegex, newMapCoords);
    console.log('✓ Section 4a: Responsive bounded X coordinates applied to saga map');
} else {
    console.log('Notice: Map coords already patched or regex pattern mismatch');
}

// 4b. Debounced unified pointerup handler
const nodeListenersRegex = /if \(isUnlocked\) \{[\r\n\s]+node\.style\.cursor = 'pointer';[\r\n\s]+node\.addEventListener\('click', \(e\) => \{[\r\n\s]+e\.preventDefault\(\);[\r\n\s]+e\.stopPropagation\(\);[\r\n\s]+openLevelPreview\(i\);[\r\n\s]+\}\);[\r\n\s]+node\.addEventListener\('touchend', \(e\) => \{[\r\n\s]+e\.preventDefault\(\);[\r\n\s]+e\.stopPropagation\(\);[\r\n\s]+openLevelPreview\(i\);[\r\n\s]+\}\);[\r\n\s]+\}/;

const newNodeListeners = `if (isUnlocked) {
                    node.style.cursor = 'pointer';
                    let lastNodeTap = 0;
                    const triggerNode = (e) => {
                        const now = Date.now();
                        if (now - lastNodeTap < 380) return;
                        lastNodeTap = now;
                        if (e) {
                            e.preventDefault();
                            e.stopPropagation();
                        }
                        openLevelPreview(i);
                    };
                    node.addEventListener('pointerup', triggerNode);
                }`;

if (nodeListenersRegex.test(content)) {
    content = content.replace(nodeListenersRegex, newNodeListeners);
    console.log('✓ Section 4b: Unified debounced pointerup handler applied to map nodes');
} else {
    console.log('Notice: Node listeners already patched or regex pattern mismatch');
}

// 5. Clean cascade and watchdog in playNextLevelDirectly
const playNextRegex = /function playNextLevelDirectly\(\) \{[\r\n\s]+screenWipeAndExecute\(\(\) => \{[\r\n\s]+closeModal\('modal-victory'\);[\r\n\s]+const lvl = gameState\.currentPlayingLevel \|\| 1;[\r\n\s]+if \(lvl < 50\) \{[\r\n\s]+gameState\.currentPlayingLevel = lvl \+ 1;[\r\n\s]+}[\r\n\s]+saveGame\(\);[\r\n\s]+startGameplay\(\);[\r\n\s]+\}\);[\r\n\s]+\}/;

const newPlayNextDirectly = `function playNextLevelDirectly() {
            if (typeof disarmCascadeWatchdog === 'function') disarmCascadeWatchdog();
            isCascading = false;
            isSwapping = false;
            isLevelEnding = false;
            screenWipeAndExecute(() => {
                closeModal('modal-victory');
                const lvl = gameState.currentPlayingLevel || 1;
                if (lvl < 50) {
                    gameState.currentPlayingLevel = lvl + 1;
                }
                saveGame();
                startGameplay();
            });
        }`;

if (playNextRegex.test(content)) {
    content = content.replace(playNextRegex, newPlayNextDirectly);
    console.log('✓ Section 5: playNextLevelDirectly cascade and flag safety disarm added');
} else {
    console.log('Notice: playNextLevelDirectly already patched or regex pattern mismatch');
}

fs.writeFileSync(path, content, 'utf8');
console.log('>>> www/index.html SUCCESSFULLY UPDATED! <<<');

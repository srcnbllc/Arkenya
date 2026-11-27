const fs = require('fs');

console.log("=== APPLYING GAMEPLAY & USER EXPERIENCE UPGRADES ===");

let html = fs.readFileSync('www/index.html', 'utf8');

// 1. ADD CSS FOR CLUTCH PULSE, XP PROGRESS BAR, AND MILESTONE NODES
const clutchStyles = `
        /* CLUTCH & NEAR-MISS INTENSE PULSE */
        .moves-clutch {
            color: #ff4757 !important;
            animation: clutchPulse 0.8s infinite alternate !important;
            text-shadow: 0 0 14px rgba(255, 71, 87, 0.95), 0 0 25px rgba(245, 197, 66, 0.6) !important;
        }
        @keyframes clutchPulse {
            0% { transform: scale(1); filter: brightness(1); }
            100% { transform: scale(1.22); filter: brightness(1.3); }
        }

        /* MAP MILESTONE NODES (EVERY 5 LEVELS) */
        .map-node.milestone-node {
            border: 2px solid #00d2ff !important;
            box-shadow: 0 0 15px rgba(0, 210, 255, 0.7), inset 0 0 10px rgba(245, 197, 66, 0.5) !important;
        }
        .node-chest-badge {
            position: absolute;
            top: -12px;
            right: -10px;
            font-size: 14px;
            animation: floatBadge 2s infinite ease-in-out alternate;
        }
        @keyframes floatBadge {
            0% { transform: translateY(0); }
            100% { transform: translateY(-4px); }
        }
`;

if (!html.includes('moves-clutch')) {
    html = html.replace('</style>', `${clutchStyles}\n    </style>`);
    console.log("-> Injected clutch pulse and milestone styles.");
}

// 2. UPDATE defaultState TO INCLUDE XP, maxXp, dailyFreeSaveMeDate
const targetDefaultState = `let defaultState = {
            gold: 0,              // Starts at pure 0
            gems: 0,              // Starts at pure 0
            energy: 5,
            maxEnergy: 5,
            lastEnergyUpdate: Date.now(),
            playerLevel: 1,
            xp: 0,
            maxXp: 500,
            dailyFreeSaveMeDate: null,
            totalScore: 0,        // Starts at pure 0`;

if (html.includes('let defaultState = {') && !html.includes('dailyFreeSaveMeDate: null,')) {
    html = html.replace(/let\s+defaultState\s*=\s*\{[\s\S]*?playerLevel:\s*1,[\s\S]*?totalScore:\s*0,/, targetDefaultState);
    console.log("-> Updated defaultState with xp, maxXp, and dailyFreeSaveMeDate.");
}

// 3. UPDATE modal-victory HTML TO INCLUDE XP PROGRESS BAR & MILESTONE CHEST NOTIFICATION
const victoryXPandMilestoneHTML = `                    <!-- XP & Level-Up Progression Bar -->
                    <div style="background: rgba(0,0,0,0.45); border: 1px solid rgba(245, 197, 66, 0.35); border-radius: 12px; padding: 10px 14px; margin-bottom: 12px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px; margin-bottom: 6px;">
                            <span style="font-weight: 800; color: var(--gold-light);">🎖️ OYUNCU SEVİYESİ: <span id="victory-player-level" style="color:#00d2ff; font-size:13px;">1</span></span>
                            <span style="color: #38bdf8; font-weight: 800;" id="victory-xp-earned">+0 XP</span>
                        </div>
                        <div style="background: rgba(255,255,255,0.1); border-radius: 10px; height: 10px; overflow: hidden; position: relative; box-shadow: inset 0 1px 3px rgba(0,0,0,0.5);">
                            <div id="victory-xp-fill" style="height: 100%; width: 0%; background: linear-gradient(90deg, #00d2ff, #f5c542); border-radius: 10px; transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);"></div>
                        </div>
                        <div style="display: flex; justify-content: space-between; font-size: 9.5px; color: #94a3b8; margin-top: 5px;">
                            <span id="victory-xp-label">0 / 500 XP</span>
                            <span id="victory-level-up-tag" style="color: #2ecc71; font-weight: 800; display: none; animation: pulse 1s infinite;">✨ SEVİYE ATLADIN! ✨</span>
                        </div>
                    </div>

                    <!-- 5-Level Milestone Chest Container -->
                    <div id="victory-milestone-box" style="display: none; background: linear-gradient(90deg, rgba(245,197,66,0.22), rgba(155,89,182,0.3)); border: 1.5px solid var(--gold-primary); border-radius: 12px; padding: 10px 12px; margin-bottom: 12px; text-align: center; box-shadow: 0 4px 15px rgba(245,197,66,0.25);">
                        <div style="font-size: 13px; font-weight: 800; color: var(--gold-light);" id="victory-milestone-title">🎁 5. BÖLÜM AŞAMA SANDIĞI AÇILDI!</div>
                        <div style="font-size: 11px; color: #e2e8f0; margin-top: 4px;" id="victory-milestone-desc">+300 Altın, +15 Elmas ve Kutsal Güçlendirici!</div>
                    </div>`;

if (!html.includes('victory-xp-fill')) {
    html = html.replace(/<div style="font-size: 14px; margin-bottom: 10px;">Skor: <b id="victory-score">0<\/b><\/div>/, `<div style="font-size: 14px; margin-bottom: 10px;">Skor: <b id="victory-score">0</b></div>\n${victoryXPandMilestoneHTML}`);
    console.log("-> Injected XP Progress Bar and Milestone Chest container into modal-victory.");
}

// 4. UPDATE modal-save-me HTML WITH NEAR-MISS, FREE ZEUS GRACE, GOLD (350), AND GEMS (20)
const saveMeModalReplacement = `            <!-- MODAL: SAVE ME (Ek Hamle & Zeus İlahi Kurtarışı) -->
            <div class="modal-overlay" id="modal-save-me">
                <div class="modal-card" style="width: 90%; max-width: 380px; padding: 22px 18px; border: 1.5px solid var(--gold-primary); box-shadow: 0 10px 35px rgba(0,0,0,0.85);">
                    <div style="font-size: 45px; animation: pulse 1s infinite alternate;">⚡</div>
                    <div class="modal-title" style="color: var(--gold-light); font-size: 19px; margin-bottom: 6px;">HAMLEN BİTTİ!</div>
                    <div id="save-me-status-msg" style="font-size: 12.5px; color: #e2e8f0; margin-bottom: 15px; line-height: 1.45;">
                        Hedefe ulaşmak üzeresin! Mücadeleyi bırakma, Olimpos güçleriyle zafere ulaş!
                    </div>

                    <div style="display: flex; flex-direction: column; gap: 9px; margin-bottom: 14px;">
                        <!-- Günlük 1x Ücretsiz Zeus Lütfu -->
                        <button id="btn-save-me-free" class="btn-action btn-action-gold" style="height: 48px; font-size: 13.5px; display: none;" onclick="claimFreeZeusSaveMe()">
                            ⚡ ZEUS'UN LÜTFU (+3 Hamle & Şimşek) [ÜCRETSİZ]
                        </button>
                        <!-- Altın Seçeneği (350 Altın) -->
                        <button id="btn-save-me-gold" class="btn-action" style="height: 46px; font-size: 13px; background: linear-gradient(135deg, #b8820c, #f5c542); color: #000; font-weight: 800; border: none; border-radius: 12px; box-shadow: 0 4px 12px rgba(245,197,66,0.3);" onclick="buyExtraMovesWithGold()">
                            💰 350 ALTIN İLE DEVAM ET (+5 Hamle)
                        </button>
                        <!-- Elmas Seçeneği (20 Elmas) -->
                        <button id="btn-save-me-gems" class="btn-action btn-action-green" style="height: 46px; font-size: 13px;" onclick="buyExtraMovesWithGems()">
                            💎 20 ELMAS İLE DEVAM ET (+5 Hamle)
                        </button>
                    </div>

                    <button class="btn-action-sub" onclick="declineSaveMe()">❌ VAZGEÇ (CAN KAYBET)</button>
                </div>
            </div>`;

if (html.includes('<!-- MODAL: SAVE ME (Ek Hamle Teklifi) -->')) {
    html = html.replace(/<!-- MODAL: SAVE ME \(Ek Hamle Teklifi\) -->[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>/, saveMeModalReplacement);
    console.log("-> Replaced modal-save-me with dynamic multi-tier rescue options.");
}

// 5. INJECT JAVASCRIPT GAMEPLAY UPGRADES:
// - MILESTONE_REWARDS
// - addXP(amount)
// - updateMovesDisplay()
// - prepareSaveMeModal(isNearMiss)
// - claimFreeZeusSaveMe()
// - buyExtraMovesWithGold()
// - buyExtraMovesWithGems()
// - executeClutchRecovery(movesToAdd, comboText)
const gameplayLogicAdditions = `
        // ==========================================
        // 5-LEVEL MILESTONE REWARDS TABLE
        // ==========================================
        const MILESTONE_REWARDS = {
            5:  { title: "Çırak Olimpos Sandığı", gold: 300, gems: 15, booster: "athena", desc: "+300 Altın, +15 Elmas ve 1x Athena Kalkanı!" },
            10: { title: "Yeraltı Zafer Sandığı", gold: 600, gems: 30, hero: "nyra", desc: "+600 Altın, +30 Elmas ve Kahraman Nyra!" },
            15: { title: "Fırtına Vadisi Sandığı", gold: 750, gems: 35, booster: "zeus", desc: "+750 Altın, +35 Elmas ve 1x Zeus Şimşeği!" },
            20: { title: "Poseidon Okyanus Sandığı", gold: 1000, gems: 45, booster: "zeus", desc: "+1.000 Altın, +45 Elmas ve 1x Zeus Şimşeği!" },
            25: { title: "Demirciler Panteon Sandığı", gold: 1250, gems: 55, hero: "thalor", desc: "+1.250 Altın, +55 Elmas ve Kahraman Thalor!" },
            30: { title: "Titanlar Kralı Sandığı", gold: 1500, gems: 70, booster: "athena", desc: "+1.500 Altın, +70 Elmas ve 2x Athena Kalkanı!" },
            35: { title: "Altın Dokunuş Sandığı", gold: 1800, gems: 85, booster: "zeus", desc: "+1.800 Altın, +85 Elmas ve 2x Zeus Şimşeği!" },
            40: { title: "Karanlık Zirve Sandığı", gold: 2200, gems: 100, booster: "athena", desc: "+2.200 Altın, +100 Elmas ve Kutsal Güçlendiriciler!" },
            45: { title: "Kronos Çağı Sandığı", gold: 2600, gems: 120, booster: "zeus", desc: "+2.600 Altın, +120 Elmas ve 2x Zeus Şimşeği!" },
            50: { title: "👑 BÜYÜK OLİMPOS ŞAMPİYON SANDIĞI", gold: 5000, gems: 250, booster: "all", desc: "+5.000 Altın, +250 Elmas ve Efsanevi Şampiyon Tacı!" }
        };

        // ==========================================
        // XP & LEVEL-UP PROGRESSION ENGINE
        // ==========================================
        function addXP(amount) {
            if (!gameState.playerLevel) gameState.playerLevel = 1;
            if (gameState.xp === undefined || gameState.xp === null) gameState.xp = 0;
            if (!gameState.maxXp) gameState.maxXp = gameState.playerLevel * 500;

            gameState.xp += amount;
            let leveledUp = false;

            while (gameState.xp >= gameState.maxXp) {
                gameState.xp -= gameState.maxXp;
                gameState.playerLevel++;
                gameState.maxXp = gameState.playerLevel * 500;
                leveledUp = true;

                // Level-up reward
                gameState.gems += 25;
                gameState.gold += 250;
                if (gameState.inventory) {
                    gameState.inventory.zeus = (gameState.inventory.zeus || 0) + 1;
                }

                spawnFloatingCombo(\`🎉 SEVİYE \${gameState.playerLevel}! (+25 💎 +250 💰 +1 ⚡)\`);
                triggerHaptic('heavy');
            }

            saveGame();
            updateHUD();
            return leveledUp;
        }

        function updateMovesDisplay() {
            const el = document.getElementById('game-moves');
            if (!el) return;
            el.innerText = gameMoves;
            if (gameMoves <= 3 && gameMoves > 0) {
                el.classList.add('moves-clutch');
            } else {
                el.classList.remove('moves-clutch');
            }
        }

        // ==========================================
        // SAVE-ME & CLUTCH RECOVERY HANDLERS
        // ==========================================
        function prepareSaveMeModal(isNearMiss) {
            const today = new Date().toISOString().slice(0, 10);
            const hasFreeZeus = gameState.dailyFreeSaveMeDate !== today;

            const btnFree = document.getElementById('btn-save-me-free');
            const btnGold = document.getElementById('btn-save-me-gold');
            const btnGems = document.getElementById('btn-save-me-gems');
            const msgEl = document.getElementById('save-me-status-msg');

            if (btnFree) {
                btnFree.style.display = hasFreeZeus ? 'block' : 'none';
            }

            const pct = Math.round((gameScore / gameTarget) * 100);
            if (msgEl) {
                if (isNearMiss) {
                    msgEl.innerHTML = \`Hedefin <b>%\${pct}</b> kadarına ulaştın, zafere çok az kaldı! Zeus'un gücüyle hamle kazan ve efsanevi bir geri dönüş yap!\`;
                } else {
                    msgEl.innerHTML = \`Hamlelerin tükendi! Ek hamle alarak tapınağı kurtarmaya devam edebilirsin.\`;
                }
            }

            if (btnGold) {
                const hasGold = (gameState.gold || 0) >= 350;
                btnGold.disabled = !hasGold;
                btnGold.style.opacity = hasGold ? '1' : '0.55';
                btnGold.innerHTML = \`💰 350 ALTIN İLE DEVAM ET (+5 Hamle)\${!hasGold ? ' (Yetersiz)' : ''}\`;
            }
            if (btnGems) {
                const hasGems = (gameState.gems || 0) >= 20;
                btnGems.disabled = !hasGems;
                btnGems.style.opacity = hasGems ? '1' : '0.55';
                btnGems.innerHTML = \`💎 20 ELMAS İLE DEVAM ET (+5 Hamle)\${!hasGems ? ' (Yetersiz)' : ''}\`;
            }
        }

        function claimFreeZeusSaveMe() {
            const today = new Date().toISOString().slice(0, 10);
            gameState.dailyFreeSaveMeDate = today;
            saveGame();
            executeClutchRecovery(3, "⚡ ZEUS'UN LÜTFU İLE KURTULDUN! ⚡");
        }

        function buyExtraMovesWithGold() {
            if ((gameState.gold || 0) >= 350) {
                gameState.gold -= 350;
                saveGame();
                updateHUD();
                executeClutchRecovery(5, "💰 ALTIN İLE +5 HAMLE ALINDI! 💰");
            } else {
                showToast("Yeterli altının yok!", "error");
            }
        }

        function buyExtraMovesWithGems() {
            if ((gameState.gems || 0) >= 20) {
                gameState.gems -= 20;
                saveGame();
                updateHUD();
                executeClutchRecovery(5, "💎 ELMAS İLE +5 HAMLE ALINDI! 💎");
            } else {
                showToast("Yeterli elmasın yok!", "error");
            }
        }

        function executeClutchRecovery(movesToAdd, comboText) {
            closeModal('modal-save-me');
            gameMoves += movesToAdd;
            isLevelEnding = false;
            updateMovesDisplay();
            spawnFloatingCombo(comboText);
            sfxZeusOrb();
            triggerScreenShake();

            // Zap 3 random tiles with lightning explosion to give player dynamic momentum
            const cells = document.getElementById('game-grid').children;
            const validCells = [];
            for (let r = 0; r < 8; r++) {
                for (let c = 0; c < 8; c++) {
                    if (gridData[r] && gridData[r][c] !== null) validCells.push({ r, c });
                }
            }
            validCells.sort(() => Math.random() - 0.5);
            const targets = validCells.slice(0, 3);
            targets.forEach(t => {
                const idx = t.r * 8 + t.c;
                if (cells[idx]) cells[idx].classList.add('exploding');
                gridData[t.r][t.c] = null;
            });

            setTimeout(() => {
                applyGravityAndRefill(1);
            }, 350);
        }
`;

if (!html.includes('MILESTONE_REWARDS')) {
    html = html.replace('function checkGameEnd() {', `${gameplayLogicAdditions}\n        function checkGameEnd() {`);
    console.log("-> Injected MILESTONE_REWARDS, addXP, updateMovesDisplay, and Save-Me recovery handlers.");
}

// 6. UPDATE checkGameEnd() TO CALL prepareSaveMeModal(isNearMiss)
const oldCheckGameEnd = `            } else if (gameMoves <= 0) {
                isLevelEnding = true;
                if (gameScore >= gameTarget * 0.9) {
                    const grid = document.getElementById('game-grid');
                    if (grid) {
                        grid.style.boxShadow = "0 0 50px rgba(255, 0, 0, 0.8)";
                        setTimeout(() => { grid.style.boxShadow = "none"; }, 2000);
                    }
                    spawnFloatingCombo("😲 ÇOK YAKLAŞTIN! 😲");
                }
                sfxDefeat();
                triggerHaptic('medium');
                openModal('modal-save-me');
            }`;

const newCheckGameEnd = `            } else if (gameMoves <= 0) {
                isLevelEnding = true;
                const isNearMiss = gameScore >= gameTarget * 0.80;
                if (isNearMiss) {
                    const grid = document.getElementById('game-grid');
                    if (grid) {
                        grid.style.boxShadow = "0 0 50px rgba(245, 197, 66, 0.85)";
                        setTimeout(() => { grid.style.boxShadow = "none"; }, 2000);
                    }
                    spawnFloatingCombo("😲 ÇOK YAKLAŞTIN! 😲");
                }
                sfxDefeat();
                triggerHaptic('medium');
                prepareSaveMeModal(isNearMiss);
                openModal('modal-save-me');
            }`;

if (html.includes(oldCheckGameEnd)) {
    html = html.replace(oldCheckGameEnd, newCheckGameEnd);
    console.log("-> Updated checkGameEnd with 80% near-miss detection and prepareSaveMeModal.");
}

// 7. UPDATE showVictory() TO HANDLE XP CALCULATION, ANIMATE XP BAR, AND HANDLE MILESTONE REWARDS
const targetShowVictoryScore = `            // Calculate rewards & XP Progression
            const earnedGold = 150 + Math.floor(gameScore / 80);
            const earnedGems = isFirstTime ? 20 : 3;

            // Base XP + Bonus for Stars
            const baseXP = 100 + Math.floor(gameScore / 120);
            const earnedXP = Math.round(baseXP * (stars >= 3 ? 1.5 : (stars === 2 ? 1.2 : 1.0)));

            const didLevelUp = addXP(earnedXP);

            gameState.totalScore += gameScore;
            gameState.weeklyScore = (gameState.weeklyScore || 0) + gameScore;
            gameState.monthlyScore = (gameState.monthlyScore || 0) + gameScore;
            syncScoreToLeaderboard();
            gameState.gold += earnedGold;
            gameState.gems += earnedGems;

            // Handle 5-Level Milestone Chest
            const milestoneBox = document.getElementById('victory-milestone-box');
            if (isFirstTime && MILESTONE_REWARDS[lvl]) {
                const ms = MILESTONE_REWARDS[lvl];
                gameState.gold += ms.gold;
                gameState.gems += ms.gems;
                if (ms.booster === 'zeus') gameState.inventory.zeus = (gameState.inventory.zeus || 0) + 1;
                else if (ms.booster === 'athena') gameState.inventory.athena = (gameState.inventory.athena || 0) + 1;
                else if (ms.booster === 'all') {
                    gameState.inventory.zeus = (gameState.inventory.zeus || 0) + 2;
                    gameState.inventory.athena = (gameState.inventory.athena || 0) + 2;
                }

                if (milestoneBox) {
                    document.getElementById('victory-milestone-title').innerText = \`🎁 \${lvl}. BÖLÜM: \${ms.title.toUpperCase()}!\`;
                    document.getElementById('victory-milestone-desc').innerText = ms.desc;
                    milestoneBox.style.display = 'block';
                }
            } else if (milestoneBox) {
                milestoneBox.style.display = 'none';
            }

            // Update XP bar display
            const lvlEl = document.getElementById('victory-player-level');
            if (lvlEl) lvlEl.innerText = gameState.playerLevel;
            const xpEarnedEl = document.getElementById('victory-xp-earned');
            if (xpEarnedEl) xpEarnedEl.innerText = \`+\${earnedXP.toLocaleString()} XP\`;
            const xpFillEl = document.getElementById('victory-xp-fill');
            const xpLabelEl = document.getElementById('victory-xp-label');
            const lvlUpTag = document.getElementById('victory-level-up-tag');
            if (lvlUpTag) lvlUpTag.style.display = didLevelUp ? 'inline' : 'none';
            if (xpFillEl && xpLabelEl) {
                const percent = Math.min(100, Math.round((gameState.xp / gameState.maxXp) * 100));
                xpLabelEl.innerText = \`\${gameState.xp.toLocaleString()} / \${gameState.maxXp.toLocaleString()} XP\`;
                setTimeout(() => { xpFillEl.style.width = \`\${percent}%\`; }, 400);
            }

            saveGame();`;

if (html.includes('const earnedGold = 150 + Math.floor(gameScore / 80);') && !html.includes('const didLevelUp = addXP(earnedXP);')) {
    html = html.replace(/const earnedGold = 150 \+ Math\.floor\(gameScore \/ 80\);[\s\S]*?gameState\.gems \+= earnedGems;\s*saveGame\(\);/, targetShowVictoryScore);
    console.log("-> Integrated XP Bar and Milestone Chest rewards into showVictory().");
}

// 8. UPDATE triggerEndLevelCascade TO PLAY ASCENDING PENTATONIC TONES AND USE updateMovesDisplay()
const oldCascade = `        function triggerEndLevelCascade() {
            if (gameMoves <= 0) {
                isCascading = false;
                setTimeout(showVictory, 600);
                return;
            }
            
            gameMoves--;
            document.getElementById('game-moves').innerText = gameMoves;
            
            const r = Math.floor(Math.random() * 8);
            const c = Math.floor(Math.random() * 8);
            const cells = document.getElementById('game-grid').children;
            const idx = r * 8 + c;
            if (cells && cells[idx]) {
                cells[idx].classList.add('exploding');
                setTimeout(() => {
                    if (cells[idx]) cells[idx].classList.remove('exploding');
                }, 300);
            }
            
            triggerHaptic('light');
            gameScore += 500;
            document.getElementById('game-score').innerText = gameScore.toLocaleString();
            updateStarProgressBar();
            spawnFloatingScore("+500 Bonus!");
            
            setTimeout(triggerEndLevelCascade, 220);
        }`;

const newCascade = `        function triggerEndLevelCascade() {
            if (gameMoves <= 0) {
                isCascading = false;
                sfxZeusOrb();
                setTimeout(showVictory, 600);
                return;
            }
            
            gameMoves--;
            updateMovesDisplay();
            
            const r = Math.floor(Math.random() * 8);
            const c = Math.floor(Math.random() * 8);
            const cells = document.getElementById('game-grid').children;
            const idx = r * 8 + c;
            if (cells && cells[idx]) {
                cells[idx].classList.add('exploding');
                setTimeout(() => {
                    if (cells[idx]) cells[idx].classList.remove('exploding');
                }, 300);
            }
            
            // Musical Pentatonic Cascade Audio
            try {
                const ctx = getAudioContext();
                if (ctx && typeof PENTATONIC_SCALE !== 'undefined') {
                    const noteIdx = (gameMoves % PENTATONIC_SCALE.length);
                    const freq = PENTATONIC_SCALE[noteIdx];
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(freq, ctx.currentTime);
                    gain.gain.setValueAtTime(0.18, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
                    osc.start(ctx.currentTime);
                    osc.stop(ctx.currentTime + 0.22);
                }
            } catch(e) {}

            triggerHaptic('light');
            gameScore += 500;
            document.getElementById('game-score').innerText = gameScore.toLocaleString();
            updateStarProgressBar();
            spawnFloatingScore("+500 Bonus!");
            
            setTimeout(triggerEndLevelCascade, 200);
        }`;

if (html.includes(oldCascade)) {
    html = html.replace(oldCascade, newCascade);
    console.log("-> Enhanced triggerEndLevelCascade with musical pentatonic cascade tones.");
}

// 9. UPDATE openWorldMap TO MARK 5-LEVEL MILESTONES WITH A GIFT BADGE
const oldMapMilestoneCheck = `                const isUnlocked = i <= unlockedLvl;
                const isCompleted = completedLvl[i] > 0;
                const isBoss = i % 10 === 0;
                const isCurrentTarget = (i === unlockedLvl);

                node.className = \`map-node \${isUnlocked ? 'unlocked' : 'locked'} \${isCompleted ? 'completed' : ''} \${isBoss ? 'boss' : ''} \${isCurrentTarget ? 'active-target' : ''}\`;`;

const newMapMilestoneCheck = `                const isUnlocked = i <= unlockedLvl;
                const isCompleted = completedLvl[i] > 0;
                const isBoss = i % 10 === 0;
                const isMilestone = (i % 5 === 0);
                const isCurrentTarget = (i === unlockedLvl);

                node.className = \`map-node \${isUnlocked ? 'unlocked' : 'locked'} \${isCompleted ? 'completed' : ''} \${isBoss ? 'boss' : ''} \${isMilestone && !isBoss ? 'milestone-node' : ''} \${isCurrentTarget ? 'active-target' : ''}\`;`;

if (html.includes(oldMapMilestoneCheck)) {
    html = html.replace(oldMapMilestoneCheck, newMapMilestoneCheck);
    console.log("-> Added milestone-node class to map nodes.");
}

// Add gift badge on milestone nodes:
const oldStarsPlacement = `                if (isCompleted) {
                    const stars = document.createElement('div');
                    stars.className = 'node-stars';
                    stars.innerText = '⭐'.repeat(completedLvl[i]);
                    node.appendChild(stars);
                }`;

const newStarsPlacement = `                if (isMilestone && !isBoss) {
                    const chestBadge = document.createElement('div');
                    chestBadge.className = 'node-chest-badge';
                    chestBadge.innerText = isCompleted ? '✨' : '🎁';
                    node.appendChild(chestBadge);
                }

                if (isCompleted) {
                    const stars = document.createElement('div');
                    stars.className = 'node-stars';
                    stars.innerText = '⭐'.repeat(completedLvl[i]);
                    node.appendChild(stars);
                }`;

if (html.includes(oldStarsPlacement) && !html.includes('node-chest-badge')) {
    html = html.replace(oldStarsPlacement, newStarsPlacement);
    console.log("-> Added animated gift/star badges on milestone map nodes.");
}

// 10. REPLACE deductMove `gameMoves--` WITH `gameMoves--; updateMovesDisplay();`
html = html.replace(/gameMoves--;\s*document\.getElementById\('game-moves'\)\.innerText = gameMoves;/g, "gameMoves--; updateMovesDisplay();");

// SAVE www/index.html
fs.writeFileSync('www/index.html', html, 'utf8');
console.log("-> Successfully saved www/index.html.");

// SYNCHRONIZE ALL TARGET FILES
const targets = [
    'index.html',
    'Arkenya_Playable_Demo.html',
    'android/app/src/main/assets/public/index.html'
];

targets.forEach(t => {
    fs.writeFileSync(t, html, 'utf8');
    console.log(`-> Synchronized: ${t}`);
});

console.log("=== ALL UPGRADES APPLIED AND FILES SYNCHRONIZED ===");

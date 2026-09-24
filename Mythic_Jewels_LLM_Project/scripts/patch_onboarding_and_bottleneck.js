const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log("=== ARKENYA: FIXING ONBOARDING FLOW & BOTTLENECK REFILL ISSUES ===");

const htmlPath = path.join(__dirname, '..', 'www', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');
const hadCRLF = html.includes('\r\n');
html = html.replace(/\r\n/g, '\n');

// 1. REPAIR BROKEN MODAL HTML (Lines around 3555-3672)
const wipeMarker = '<!-- SCREEN WIPE FADER -->\n            <div class="screen-wipe" id="screen-wipe"></div>';
const targetStart = html.indexOf(wipeMarker);
const targetEnd = html.indexOf('<!-- MODAL: ONBOARDING TUTORIAL -->');

if (targetStart === -1 || targetEnd === -1) {
    throw new Error("Could not locate screen-wipe or modal-onboarding markers!");
}

const cleanPrologueHTML = `<!-- SCREEN WIPE FADER -->
            <div class="screen-wipe" id="screen-wipe"></div>

            <!-- MODAL: PROLOGUE / KADİM EFSANE ONBOARDING -->
            <div class="modal-overlay" id="modal-prologue">
                <div class="modal-card" style="width: 90%; max-width: 400px; padding: 22px 18px; box-sizing: border-box; text-align: center; border: 2px solid var(--gold-primary); box-shadow: 0 0 35px rgba(245, 197, 66, 0.4); max-height: 90vh; overflow-y: auto;">
                    <div style="font-size: 38px; margin-bottom: 4px;">⚡</div>
                    <div class="story-badge" style="display: inline-block; background: rgba(245, 197, 66, 0.2); border: 1px solid var(--gold-primary); color: #ffe885; padding: 3px 12px; border-radius: 12px; font-size: 11px; font-weight: 800; margin-bottom: 6px; letter-spacing: 1px;">OLİMPOS BAŞLANGICI</div>
                    <div class="modal-title" style="color: var(--gold-light); font-size: 20px; font-weight: 900; margin-bottom: 12px;">ARKENYA: EFSANENİN DOĞUŞU</div>

                    <!-- Mythic Audio Player Bar -->
                    <div class="mythic-audio-bar" style="margin-bottom: 12px;">
                        <button class="mythic-play-btn" id="btn-prologue-narrator" onclick="playPrologueVoice()">
                            <span id="prologue-play-icon">▶</span>
                            <span id="prologue-play-text">KADİM EFSANEYİ DİNLE</span>
                        </button>
                        <div class="mythic-soundwave" id="prologue-soundwave">
                            <span></span><span></span><span></span><span></span><span></span>
                        </div>
                    </div>

                    <div class="story-parchment" style="background: rgba(0,0,0,0.45); border-left: 3px solid var(--gold-primary); border-radius: 8px; padding: 10px 14px; color: #cbd5e1; font-style: italic; font-size: 12px; line-height: 1.5; margin-bottom: 14px; text-align: left;">
                        "Kader dediğin şey, önüne serilen taşlar değildir evlat... Kader, o taşlara vurduğun ilahi akıldır, yürektir! Olimpos'un kutsal mühürlerini uyandır ve zirveye yürü!"
                    </div>

                    <!-- Gameplay Rules List -->
                    <div style="display: flex; flex-direction: column; gap: 8px; text-align: left; font-size: 12px; margin-bottom: 16px;">
                        <div style="display: flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.05); padding: 8px 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08);">
                            <span style="font-size: 20px;">👉</span>
                            <div><b>3 Taşı Eşleştir:</b> Parmağınla kaydırarak aynı renkte 3 taşı yan yana getir.</div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.05); padding: 8px 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08);">
                            <span style="font-size: 20px;">⚡</span>
                            <div><b>Özel Taşlar Yarat:</b> 4'lü eşleşmeyle Şimşek Kristali, 5'liyle Bomba ve Renk Küresi patlat.</div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.05); padding: 8px 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08);">
                            <span style="font-size: 20px;">🏆</span>
                            <div><b>50 Mitolojik Bölüm:</b> Herkül'den Zeus'a kadar kademeli zorlaşan Olimpos yolu!</div>
                        </div>
                    </div>

                    <button class="btn-action btn-action-green" style="width: 100%; height: 50px; font-size: 15px; font-weight: 800; box-shadow: 0 4px 18px rgba(46, 204, 113, 0.4); display: flex; align-items: center; justify-content: center; gap: 8px;" onclick="stopStoryVoice(); startFirstTimeAdventure();">
                        <span>⚔️ 1. BÖLÜME BAŞLA (HERKÜL)</span> <span>➔</span>
                    </button>
                </div>
            </div>\n\n            `;

html = html.substring(0, targetStart) + cleanPrologueHTML + html.substring(targetEnd);
console.log("✔ 1. Cleaned up corrupted prologue HTML and inserted pristine modal-prologue.");

// 2. CONNECT checkFirstTimeOnboarding() TO PROLOGUE
const oldCheckOnboarding = `        function checkFirstTimeOnboarding() {
            // Prologue is integrated directly into stage preview
        }`;

const newCheckOnboarding = `        function checkFirstTimeOnboarding() {
            if (!gameState.hasSeenPrologue) {
                openModal('modal-prologue');
            }
        }`;

if (html.includes(oldCheckOnboarding)) {
    html = html.replace(oldCheckOnboarding, newCheckOnboarding);
    console.log("✔ 2. Connected checkFirstTimeOnboarding() to modal-prologue.");
} else {
    console.warn("Could not find exact oldCheckOnboarding snippet.");
}

// 3. PROMPT PROLOGUE ON FIRST TIME "OYUNA BAŞLA"
const oldStartGameplay = `        function startGameplay() {
            document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
            updateGameplayPowerups();

            if (!gameState.currentPlayingLevel) {
                gameState.currentPlayingLevel = gameState.unlockedLevel || 1;
            }`;

const newStartGameplay = `        function startGameplay() {
            document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
            updateGameplayPowerups();

            if (!gameState.hasSeenPrologue) {
                openModal('modal-prologue');
                return;
            }

            if (!gameState.currentPlayingLevel) {
                gameState.currentPlayingLevel = gameState.unlockedLevel || 1;
            }`;

if (html.includes(oldStartGameplay)) {
    html = html.replace(oldStartGameplay, newStartGameplay);
    console.log("✔ 3. Guarded startGameplay() with modal-prologue for first-time players.");
} else {
    console.warn("Could not find exact oldStartGameplay snippet.");
}

// 4. FIX BOTTLENECK CRASH IN processMatchesWithExplosion (game-gauge-txt null crash)
const oldGaugeCrash = `            document.getElementById('game-score').innerText = gameScore.toLocaleString();
            updateStarProgressBar();
            document.getElementById('game-gauge-txt').innerText = \`\${Math.floor(gameGauge)}% (Kombo)\`;
            const btnAbility = document.getElementById('btn-use-ability');
            if (btnAbility) btnAbility.disabled = gameGauge < 100;

            updateGameplayPowerups();

            setTimeout(() => {
                applyGravityAndRefill(comboMultiplier);
            }, 220);`;

const newGaugeSafe = `            const scoreEl = document.getElementById('game-score');
            if (scoreEl) scoreEl.innerText = gameScore.toLocaleString();
            updateStarProgressBar();
            
            try {
                const gaugeTxt = document.getElementById('game-gauge-txt');
                if (gaugeTxt) gaugeTxt.innerText = \`\${Math.floor(gameGauge)}% (Kombo)\`;
                const btnAbility = document.getElementById('btn-use-ability');
                if (btnAbility) btnAbility.disabled = gameGauge < 100;
                updateGameplayPowerups();
            } catch(uiErr) {
                console.warn("Gameplay UI update warning:", uiErr);
            }

            setTimeout(() => {
                applyGravityAndRefill(comboMultiplier);
            }, 220);`;

if (html.includes(oldGaugeCrash)) {
    html = html.replace(oldGaugeCrash, newGaugeSafe);
    console.log("✔ 4. Fixed gauge element null crash in processMatchesWithExplosion.");
} else {
    console.warn("Could not find exact oldGaugeCrash snippet.");
}

// 5. GUARD useAbility GAUGE REFERENCES
const oldUseAbilityTail = `            document.getElementById('game-gauge-txt').innerText = "0% (Kombo)";
            document.getElementById('btn-use-ability').disabled = true;`;

const newUseAbilityTail = `            const gTxt = document.getElementById('game-gauge-txt');
            if (gTxt) gTxt.innerText = "0% (Kombo)";
            const bAbility = document.getElementById('btn-use-ability');
            if (bAbility) bAbility.disabled = true;`;

if (html.includes(oldUseAbilityTail)) {
    html = html.replace(oldUseAbilityTail, newUseAbilityTail);
    console.log("✔ 5. Guarded useAbility() gauge text and button references.");
}

// 6. ENHANCE applyGravityAndRefill WITH COMPLETE GRID REFILL GUARANTEE
const oldApplyGravity = `        function applyGravityAndRefill(comboMultiplier) {
            const cells = document.getElementById('game-grid').children;
            const droppedIndices = [];

            for (let c = 0; c < 8; c++) {
                let emptyRow = 7;
                for (let r = 7; r >= 0; r--) {
                    if (gridData[r][c] !== null) {
                        gridData[emptyRow][c] = gridData[r][c];
                        specialGrid[emptyRow][c] = specialGrid[r][c];
                        if (emptyRow !== r) {
                            gridData[r][c] = null;
                            specialGrid[r][c] = null;
                            droppedIndices.push(emptyRow * 8 + c);
                        }
                        emptyRow--;
                    }
                }
                for (let r = emptyRow; r >= 0; r--) {
                    gridData[r][c] = GEM_TYPES[Math.floor(Math.random() * GEM_TYPES.length)];
                    specialGrid[r][c] = null;
                    droppedIndices.push(r * 8 + c);
                }
            }
            renderGrid();

            // Smooth GPU falling cascade animation on refilled & fallen gems
            if (cells && droppedIndices.length > 0) {
                droppedIndices.forEach(idx => {
                    if (cells[idx]) cells[idx].classList.add('falling');
                });
                setTimeout(() => {
                    droppedIndices.forEach(idx => {
                        if (cells[idx]) cells[idx].classList.remove('falling');
                    });
                }, 200);
            }
            
            // Check matches again for cascade!
            setTimeout(() => {
                if (comboMultiplier < 25) {
                    processMatchesWithExplosion(comboMultiplier + 1, false);
                } else {
                    isCascading = false;
                    isSwapping = false;
                    clearTimeout(swapWatchdogTimer);
                    checkGameEnd();
                    tryExecuteBufferedSwap();
                }
            }, 200);
        }`;

const newApplyGravity = `        function applyGravityAndRefill(comboMultiplier) {
            const gridEl = document.getElementById('game-grid');
            const cells = gridEl ? gridEl.children : [];
            const droppedIndices = [];

            for (let c = 0; c < 8; c++) {
                let emptyRow = 7;
                for (let r = 7; r >= 0; r--) {
                    if (gridData[r][c] !== null) {
                        gridData[emptyRow][c] = gridData[r][c];
                        specialGrid[emptyRow][c] = specialGrid[r][c];
                        if (emptyRow !== r) {
                            gridData[r][c] = null;
                            specialGrid[r][c] = null;
                            droppedIndices.push(emptyRow * 8 + c);
                        }
                        emptyRow--;
                    }
                }
                for (let r = emptyRow; r >= 0; r--) {
                    gridData[r][c] = GEM_TYPES[Math.floor(Math.random() * GEM_TYPES.length)];
                    specialGrid[r][c] = null;
                    droppedIndices.push(r * 8 + c);
                }
            }

            // GUARANTEE: Ensure NO cell in gridData is left null under any circumstances!
            for (let r = 0; r < 8; r++) {
                for (let c = 0; c < 8; c++) {
                    if (gridData[r][c] === null) {
                        gridData[r][c] = GEM_TYPES[Math.floor(Math.random() * GEM_TYPES.length)];
                        specialGrid[r][c] = null;
                        droppedIndices.push(r * 8 + c);
                    }
                }
            }

            renderGrid();

            // Smooth GPU falling cascade animation on refilled & fallen gems
            if (cells && droppedIndices.length > 0) {
                droppedIndices.forEach(idx => {
                    if (cells[idx]) {
                        cells[idx].classList.remove('exploding');
                        cells[idx].classList.add('falling');
                    }
                });
                setTimeout(() => {
                    droppedIndices.forEach(idx => {
                        if (cells[idx]) cells[idx].classList.remove('falling');
                    });
                }, 200);
            }
            
            // Check matches again for cascade!
            setTimeout(() => {
                if (comboMultiplier < 25) {
                    processMatchesWithExplosion(comboMultiplier + 1, false);
                } else {
                    isCascading = false;
                    isSwapping = false;
                    clearTimeout(swapWatchdogTimer);
                    checkGameEnd();
                    tryExecuteBufferedSwap();
                }
            }, 200);
        }`;

if (html.includes(oldApplyGravity)) {
    html = html.replace(oldApplyGravity, newApplyGravity);
    console.log("✔ 6. Enhanced applyGravityAndRefill() with 100% full-board non-null guarantee.");
} else {
    console.warn("Could not find exact oldApplyGravity snippet.");
}

// 7. FIX renderGrid() TO REMOVE ANY STALE 'exploding' CLASSES
const oldRenderGrid = `                    let classStr = \`cell cell-\${type}\`;
                    if (special === 'line_h') classStr += ' special-line-h';
                    else if (special === 'line_v') classStr += ' special-line-v';
                    else if (special === 'bomb') classStr += ' special-bomb';
                    else if (special === 'color_bomb') classStr += ' special-color-bomb';

                    // Smart Dirty-Checking: Only mutate DOM if className or text has changed
                    if (cell.className !== classStr) {
                        cell.className = classStr;
                    }`;

const newRenderGrid = `                    cell.classList.remove('exploding');

                    let classStr = \`cell cell-\${type}\`;
                    if (special === 'line_h') classStr += ' special-line-h';
                    else if (special === 'line_v') classStr += ' special-line-v';
                    else if (special === 'bomb') classStr += ' special-bomb';
                    else if (special === 'color_bomb') classStr += ' special-color-bomb';

                    // Smart Dirty-Checking: Only mutate DOM if className or text has changed
                    if (cell.className !== classStr) {
                        cell.className = classStr;
                    }`;

if (html.includes(oldRenderGrid)) {
    html = html.replace(oldRenderGrid, newRenderGrid);
    console.log("✔ 7. Ensured renderGrid() removes exploding animation class on all cells.");
}

// 8. OVERHAUL IN-GAME ONBOARDING TUTORIAL (Separating DOM cleanup from completion flag)
const oldTutorialFunctions = `        function setupLevelTutorial(lvl) {
            lvl = lvl || gameState.currentPlayingLevel || 1;
            if (!gameState.completedTutorials) gameState.completedTutorials = {};

            // If already completed or level > 5, do nothing
            if (gameState.completedTutorials[lvl] || lvl > 5) return;

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
                showOnboardingBanner("🛡️ 4. BÖLÜM: KAHRAMAN İLAHİ GÜCÜ AÇILDI!<br><span style='font-size: 11px; opacity:0.85;'>Sol alttaki Kombo Barı açıldı! Eşleştirmelerle barı doldur, %100 olunca 'Yetenek Kullan' ile tahtayı sars!</span>", 8000);
            } else if (lvl === 5) {
                // Level 5: Boosters & Milestone Chest
                showOnboardingBanner("🎁 5. BÖLÜM: GÜÇLENDİRİCİLER & BÜYÜK SANDIK!<br><span style='font-size: 11px; opacity:0.85;'>Sıkıştığında üstteki Zeus Şimşeği ve Athena Kalkanını kullan! Bölüm bitiminde Büyük Aşama Sandığı açılacak!</span>", 8000);
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

const newTutorialFunctions = `        function removeTutorialDOMVisuals() {
            document.querySelectorAll('.tutorial-pulse').forEach(el => el.classList.remove('tutorial-pulse'));
            const hint = document.getElementById('tutorial-hand-hint');
            if (hint) hint.remove();
            const banner = document.getElementById('onboarding-tip-banner');
            if (banner) banner.remove();
        }

        function setupLevelTutorial(lvl) {
            lvl = lvl || gameState.currentPlayingLevel || 1;
            if (!gameState.completedTutorials) gameState.completedTutorials = {};

            // If already completed or level > 5, do nothing
            if (gameState.completedTutorials[lvl] || lvl > 5) return;

            // Remove any existing DOM hint without modifying completion flag
            removeTutorialDOMVisuals();

            const grid = document.getElementById('game-grid');
            if (!grid) return;
            const anchor = document.querySelector('.grid-mount-anchor') || grid;

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
                const topPos = (3 * cellWidth) - 10;
                const leftPos = (2 * cellWidth) + (cellWidth / 2) - 12;

                const hint = document.createElement('div');
                hint.id = 'tutorial-hand-hint';
                hint.className = 'tutorial-hand-hint';
                hint.style.top = topPos + 'px';
                hint.style.left = leftPos + 'px';
                hint.innerHTML = \`
                    <div class="hand-icon">👉</div>
                    <div class="hand-label">3'lü Eşleştir! (Sağa Kaydır)</div>
                \`;
                anchor.appendChild(hint);

                showOnboardingBanner("👉 1. BÖLÜM: 3 AYNI TAŞI YAN YANA GETİR!<br><span style='font-size: 11px; opacity:0.9;'>İşaretli sarı taşı sağa kaydırarak ilk 3'lü eşleştirmeyi yap ve puanını kazan!</span>", 0);
            } else if (lvl === 2) {
                // Level 2: Lightning Crystal (4-Match)
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
                const topPos = (4 * cellWidth) - 10;
                const leftPos = (2 * cellWidth) + (cellWidth / 2) - 12;

                const hint = document.createElement('div');
                hint.id = 'tutorial-hand-hint';
                hint.className = 'tutorial-hand-hint';
                hint.style.top = topPos + 'px';
                hint.style.left = leftPos + 'px';
                hint.innerHTML = \`
                    <div class="hand-icon">⚡</div>
                    <div class="hand-label">4'lü Eşleştir! (Yıldırım Kristali)</div>
                \`;
                anchor.appendChild(hint);

                showOnboardingBanner("⚡ 2. BÖLÜM: YILDIRIM KRİSTALİ (4'LÜ EŞLEŞTİRME)!<br><span style='font-size: 11px; opacity:0.9;'>4 mavi taşı birleştirerek tüm satırı/sütunu temizleyen Şimşek Kristali kazan!</span>", 0);
            } else if (lvl === 3) {
                showOnboardingBanner("💥 3. BÖLÜM: BOMBA & ZEUS KÜRESİ!<br><span style='font-size: 11px; opacity:0.9;'>T veya L şeklinde 5 taşla 3x3 Bomba; düz 5 taşla tek rengi temizleyen Zeus Küresi yarat!</span>", 7000);
            } else if (lvl === 4) {
                showOnboardingBanner("🛡️ 4. BÖLÜM: KAHRAMAN İLAHİ GÜCÜ AÇILDI!<br><span style='font-size: 11px; opacity:0.9;'>Eşleştirmelerle gücünü topla, bar dolunca ilahi yeteneğini serbest bırak!</span>", 8000);
            } else if (lvl === 5) {
                showOnboardingBanner("🎁 5. BÖLÜM: GÜÇLENDİRİCİLER & BÜYÜK SANDIK!<br><span style='font-size: 11px; opacity:0.9;'>Sıkıştığında sağ alttaki Zeus Şimşeği ve Athena Kalkanını kullan!</span>", 8000);
            }
        }

        function setupLevel1InteractiveTutorial() {
            setupLevelTutorial(1);
        }

        function showOnboardingBanner(htmlText, durationMs = 0) {
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

            if (durationMs > 0) {
                setTimeout(() => {
                    if (banner && banner.parentNode) {
                        banner.style.transition = 'opacity 0.6s, transform 0.6s';
                        banner.style.opacity = '0';
                        banner.style.transform = 'translate(-50%, -30px)';
                        setTimeout(() => banner.remove(), 600);
                    }
                }, durationMs);
            }
        }

        function dismissTutorialHint(markCompleted = false) {
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
            if (markCompleted) {
                const lvl = gameState.currentPlayingLevel || 1;
                if (!gameState.completedTutorials) gameState.completedTutorials = {};
                if (lvl <= 5 && !gameState.completedTutorials[lvl]) {
                    gameState.completedTutorials[lvl] = true;
                    saveGame();
                }
            }
        }`;

if (html.includes(oldTutorialFunctions)) {
    html = html.replace(oldTutorialFunctions, newTutorialFunctions);
    console.log("✔ 8. Upgraded tutorial functions with non-destructive DOM cleanup and persistent guidance.");
} else {
    console.warn("Could not find exact oldTutorialFunctions snippet.");
}

// 9. UPDATE executeSwap TO CALL dismissTutorialHint(true)
const oldSwapDismiss = `        function executeSwap(r1, c1, r2, c2) {
            if (gameMoves <= 0 || isSwapping || isLevelEnding) return;
            dismissTutorialHint();`;

const newSwapDismiss = `        function executeSwap(r1, c1, r2, c2) {
            if (gameMoves <= 0 || isSwapping || isLevelEnding) return;
            dismissTutorialHint(true);`;

if (html.includes(oldSwapDismiss)) {
    html = html.replace(oldSwapDismiss, newSwapDismiss);
    console.log("✔ 9. Updated executeSwap() to mark tutorial completed upon actual swap.");
}

// 10. UPDATE CSS FOR ONBOARDING BANNER TO BE POSITIONED PROMINENTLY
const oldBannerCSS = `        .onboarding-tutorial-banner {
            position: absolute;
            top: 95px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, rgba(15, 22, 38, 0.98), rgba(28, 36, 51, 0.98));
            border: 2px solid var(--gold-primary);
            border-radius: 16px;
            padding: 10px 18px;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.8), 0 0 20px rgba(245, 197, 66, 0.4);
            z-index: 400;
            width: 90%;
            max-width: 360px;
            animation: bannerPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }`;

const newBannerCSS = `        .onboarding-tutorial-banner {
            position: absolute;
            top: 76px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, rgba(10, 16, 30, 0.98), rgba(20, 30, 48, 0.98));
            border: 2px solid var(--gold-primary);
            border-radius: 14px;
            padding: 8px 14px;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.85), 0 0 20px rgba(245, 197, 66, 0.45);
            z-index: 450;
            width: 92%;
            max-width: 360px;
            pointer-events: none;
            animation: bannerPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }`;

if (html.includes(oldBannerCSS)) {
    html = html.replace(oldBannerCSS, newBannerCSS);
    console.log("✔ 10. Refined .onboarding-tutorial-banner CSS positioning & styling.");
}

// 11. SYNTAX VALIDATION VIA Node.js VM
console.log("--> Performing Syntax Validation of script blocks...");
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
if (!scriptMatch) {
    throw new Error("Could not find <script> block in HTML!");
}

try {
    new vm.Script(scriptMatch[1], { filename: 'index.html' });
    console.log("✔ SUCCESS: JavaScript parsed with 0 syntax errors!");
} catch (err) {
    console.error("❌ SYNTAX ERROR DETECTED:", err.stack);
    process.exit(1);
}

// 12. WRITE AND SYNCHRONIZE TO ALL TARGETS
const targets = [
    path.join(__dirname, '..', 'www', 'index.html'),
    path.join(__dirname, '..', 'index.html'),
    path.join(__dirname, '..', 'Arkenya_Playable_Demo.html'),
    path.join(__dirname, '..', 'www', 'Arkenya_Playable_Demo.html'),
    path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'assets', 'public', 'index.html'),
    path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'assets', 'public', 'Arkenya_Playable_Demo.html')
];

targets.forEach(target => {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, html, 'utf8');
    console.log(`✔ Synced to: ${target}`);
});

console.log("=== ALL ONBOARDING & BOTTLENECK FIXES APPLIED SUCCESSFULLY ===");

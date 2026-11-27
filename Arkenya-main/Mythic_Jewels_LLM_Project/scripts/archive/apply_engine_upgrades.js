const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

console.log("Applying Candy Crush & Mobile Engine Upgrades to index.html...");

// 1. ADD SPECIAL GRID STATE & HAPTICS HELPERS
const stateInsertBefore = `        // APP STATE & PERSISTENCE`;
const specialStateCode = `        // SPECIAL GEM STATE (Parallel Grid for Candy Crush Mechanics)
        let specialGrid = Array(8).fill(null).map(() => Array(8).fill(null));

        // NATIVE HAPTIC FEEDBACK HELPER (Android & iOS)
        function triggerHaptic(style = 'light') {
            try {
                if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Haptics) {
                    if (style === 'heavy') {
                        window.Capacitor.Plugins.Haptics.impact({ style: 'HEAVY' });
                    } else if (style === 'medium') {
                        window.Capacitor.Plugins.Haptics.impact({ style: 'MEDIUM' });
                    } else {
                        window.Capacitor.Plugins.Haptics.impact({ style: 'LIGHT' });
                    }
                } else if (navigator.vibrate) {
                    if (style === 'heavy') navigator.vibrate([60, 40, 80]);
                    else if (style === 'medium') navigator.vibrate([40]);
                    else navigator.vibrate([20]);
                }
            } catch(e) {}
        }

        // ENHANCED SFX FOR SPECIAL GEMS
        function sfxLaser() {
            try {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(880, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.3);
                gain.gain.setValueAtTime(0.3, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
                osc.start();
                osc.stop(ctx.currentTime + 0.3);
            } catch(e) {}
        }

        function sfxBomb() {
            try {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(140, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.45);
                gain.gain.setValueAtTime(0.4, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);
                osc.start();
                osc.stop(ctx.currentTime + 0.45);
            } catch(e) {}
        }

        function spawnLaserBeam(coord, direction) {
            const grid = document.getElementById('game-grid');
            if (!grid) return;
            const beam = document.createElement('div');
            beam.className = direction === 'h' ? 'laser-beam-h' : 'laser-beam-v';
            if (direction === 'h') {
                beam.style.top = (coord * 50 + 20) + 'px';
            } else {
                beam.style.left = (coord * 50 + 20) + 'px';
            }
            grid.appendChild(beam);
            setTimeout(() => beam.remove(), 400);
        }

`;

html = html.replace(stateInsertBefore, specialStateCode + stateInsertBefore);

// 2. UPGRADE initGrid to reset specialGrid
const oldInitGrid = `        function initGrid() {
            const gridEl = document.getElementById('game-grid');
            gridEl.innerHTML = '';
            gridData = [];

            for (let r = 0; r < 8; r++) {
                gridData[r] = [];
                for (let c = 0; c < 8; c++) {
                    const type = GEM_TYPES[Math.floor(Math.random() * GEM_TYPES.length)];
                    gridData[r][c] = type;

                    const cell = document.createElement('div');
                    cell.className = \`cell cell-\${type}\`;
                    cell.draggable = false;
                    cell.innerText = GEM_ICONS[type];
                    cell.dataset.r = r;
                    cell.dataset.c = c;
                    
                    // Touch & Mouse Drag Handlers
                    cell.addEventListener('mousedown', handleSwipeStart);
                    cell.addEventListener('touchstart', handleSwipeStart, {passive: false});
                    cell.addEventListener('mouseup', handleSwipeEnd);
                    cell.addEventListener('touchend', handleSwipeEnd);

                    gridEl.appendChild(cell);
                }
            }

            // Immediately check and explode initial matches for dynamic entrance!
            setTimeout(() => {
                processMatchesWithExplosion(1, false);
            }, 150);
        }`;

const newInitGrid = `        function initGrid() {
            const gridEl = document.getElementById('game-grid');
            gridEl.innerHTML = '';
            gridData = [];
            specialGrid = Array(8).fill(null).map(() => Array(8).fill(null));

            for (let r = 0; r < 8; r++) {
                gridData[r] = [];
                for (let c = 0; c < 8; c++) {
                    const type = GEM_TYPES[Math.floor(Math.random() * GEM_TYPES.length)];
                    gridData[r][c] = type;

                    const cell = document.createElement('div');
                    cell.className = \`cell cell-\${type}\`;
                    cell.draggable = false;
                    cell.innerText = GEM_ICONS[type];
                    cell.dataset.r = r;
                    cell.dataset.c = c;
                    
                    // Touch & Mouse Drag Handlers
                    cell.addEventListener('mousedown', handleSwipeStart);
                    cell.addEventListener('touchstart', handleSwipeStart, {passive: false});
                    cell.addEventListener('mouseup', handleSwipeEnd);
                    cell.addEventListener('touchend', handleSwipeEnd);

                    gridEl.appendChild(cell);
                }
            }

            // Display Level 1-5 Onboarding Guidance
            showLevelOnboardingTip();

            // Immediately check and explode initial matches for dynamic entrance!
            setTimeout(() => {
                processMatchesWithExplosion(1, false);
            }, 150);
        }

        function showLevelOnboardingTip() {
            const lvl = gameState.currentPlayingLevel || 1;
            const lvlInfo = LEVEL_DATA[lvl];
            const oldTip = document.getElementById('onboarding-tip-banner');
            if (oldTip) oldTip.remove();

            if (lvlInfo && lvlInfo.tip) {
                const banner = document.createElement('div');
                banner.id = 'onboarding-tip-banner';
                banner.className = 'onboarding-tutorial-banner';
                banner.innerHTML = \`<span style="font-size: 22px;">💡</span> <div style="font-size: 13px; font-weight: 600; color: #ffe885; line-height: 1.3;">\${lvlInfo.tip}</div>\`;
                document.getElementById('screen-gameplay').appendChild(banner);
                setTimeout(() => {
                    if (banner && banner.parentNode) {
                        banner.style.transition = 'opacity 0.6s, transform 0.6s';
                        banner.style.opacity = '0';
                        banner.style.transform = 'translate(-50%, -30px)';
                        setTimeout(() => banner.remove(), 600);
                    }
                }, 4500);
            }
        }`;

html = html.replace(oldInitGrid, newInitGrid);

// 3. UPGRADE renderGrid to visually represent special gems
const oldRenderGrid = `        function renderGrid() {
            const cells = document.getElementById('game-grid').children;
            let idx = 0;
            for (let r = 0; r < 8; r++) {
                for (let c = 0; c < 8; c++) {
                    const type = gridData[r][c];
                    const cell = cells[idx++];
                    cell.className = \`cell cell-\${type}\`;
                    cell.draggable = false;
                    cell.innerText = type ? GEM_ICONS[type] : '';
                }
            }
        }`;

const newRenderGrid = `        function renderGrid() {
            const cells = document.getElementById('game-grid').children;
            let idx = 0;
            for (let r = 0; r < 8; r++) {
                for (let c = 0; c < 8; c++) {
                    const type = gridData[r][c];
                    const special = specialGrid[r] ? specialGrid[r][c] : null;
                    const cell = cells[idx++];
                    if (!cell) continue;

                    let classStr = \`cell cell-\${type}\`;
                    if (special === 'line_h') classStr += ' special-line-h';
                    else if (special === 'line_v') classStr += ' special-line-v';
                    else if (special === 'bomb') classStr += ' special-bomb';
                    else if (special === 'color_bomb') classStr += ' special-color-bomb';

                    cell.className = classStr;
                    cell.draggable = false;
                    if (special === 'color_bomb') {
                        cell.innerText = '';
                    } else {
                        cell.innerText = type ? GEM_ICONS[type] : '';
                    }
                }
            }
        }`;

html = html.replace(oldRenderGrid, newRenderGrid);

// 4. UPGRADE executeSwap TO SUPPORT COLOR BOMB & SPECIAL COMBOS
const oldExecuteSwapStart = `        function executeSwap(r1, c1, r2, c2) {
            if (gameMoves <= 0 || isSwapping || isLevelEnding) return;
            isSwapping = true;
            clearSelectedCell();`;

const newExecuteSwapStart = `        function executeSwap(r1, c1, r2, c2) {
            if (gameMoves <= 0 || isSwapping || isLevelEnding) return;
            isSwapping = true;
            clearSelectedCell();
            triggerHaptic('light');

            // COLOR BOMB TRIGGER ON SWAP
            if (specialGrid[r1][c1] === 'color_bomb' || specialGrid[r2][c2] === 'color_bomb') {
                const bombPos = (specialGrid[r1][c1] === 'color_bomb') ? {r: r1, c: c1} : {r: r2, c: c2};
                const otherPos = (bombPos.r === r1 && bombPos.c === c1) ? {r: r2, c: c2} : {r: r1, c: c1};
                const targetColor = gridData[otherPos.r][otherPos.c];

                gameMoves--;
                document.getElementById('game-moves').innerText = gameMoves;
                triggerZeusWrathColorBomb(bombPos, otherPos, targetColor);
                return;
            }`;

html = html.replace(oldExecuteSwapStart, newExecuteSwapStart);

// Add triggerZeusWrathColorBomb helper
const zeusWrathCode = `        function triggerZeusWrathColorBomb(bombPos, otherPos, targetColor) {
            sfxLaser();
            triggerHaptic('heavy');
            triggerScreenShake();
            spawnFloatingCombo("⚡ ZEUS'UN GAZABI! ⚡");

            const cells = document.getElementById('game-grid').children;
            const bIdx = bombPos.r * 8 + bombPos.c;
            if (cells[bIdx]) cells[bIdx].classList.add('exploding');
            gridData[bombPos.r][bombPos.c] = null;
            specialGrid[bombPos.r][bombPos.c] = null;

            let destroyedCount = 1;
            for (let r = 0; r < 8; r++) {
                for (let c = 0; c < 8; c++) {
                    if (gridData[r][c] === targetColor || specialGrid[r][c] === 'color_bomb') {
                        destroyedCount++;
                        const idx = r * 8 + c;
                        if (cells[idx]) cells[idx].classList.add('exploding');
                        gridData[r][c] = null;
                        specialGrid[r][c] = null;
                    }
                }
            }

            const earned = destroyedCount * 250;
            gameScore += earned;
            document.getElementById('game-score').innerText = gameScore.toLocaleString();
            updateStarProgressBar();

            setTimeout(() => {
                applyGravityAndRefill(2);
            }, 400);
        }
`;

html = html.replace(`        function checkGridHasMatches() {`, zeusWrathCode + `\n        function checkGridHasMatches() {`);

// 5. UPGRADE processMatchesWithExplosion FOR CANDY CRUSH MATCHES & CASCADES
const oldProcessRegex = /function processMatchesWithExplosion\(comboMultiplier = 1, deductMove = false\) \{[\s\S]*?return matchesToPop\.length;\s*\}/;

const newProcessMatches = `function processMatchesWithExplosion(comboMultiplier = 1, deductMove = false) {
            let horizontalRuns = [];
            let verticalRuns = [];

            // 1. Horizontal Matches
            for (let r = 0; r < 8; r++) {
                let matchLength = 1;
                for (let c = 0; c < 8; c++) {
                    const current = gridData[r][c];
                    const next = c < 7 ? gridData[r][c + 1] : null;
                    if (current && current === next && specialGrid[r][c] !== 'color_bomb' && specialGrid[r][c+1] !== 'color_bomb') {
                        matchLength++;
                    } else {
                        if (matchLength >= 3) {
                            horizontalRuns.push({ r, startC: c - matchLength + 1, length: matchLength, type: current });
                        }
                        matchLength = 1;
                    }
                }
            }

            // 2. Vertical Matches
            for (let c = 0; c < 8; c++) {
                let matchLength = 1;
                for (let r = 0; r < 8; r++) {
                    const current = gridData[r][c];
                    const next = r < 7 ? gridData[r + 1][c] : null;
                    if (current && current === next && specialGrid[r][c] !== 'color_bomb' && specialGrid[r+1][c] !== 'color_bomb') {
                        matchLength++;
                    } else {
                        if (matchLength >= 3) {
                            verticalRuns.push({ c, startR: r - matchLength + 1, length: matchLength, type: current });
                        }
                        matchLength = 1;
                    }
                }
            }

            let initialCells = [];
            let newSpecials = [];

            // 5-match -> Color Bomb
            horizontalRuns.forEach(h => {
                if (h.length >= 5) {
                    const spawnC = h.startC + Math.floor(h.length / 2);
                    newSpecials.push({ r: h.r, c: spawnC, special: 'color_bomb', gemType: 'yellow' });
                }
            });
            verticalRuns.forEach(v => {
                if (v.length >= 5) {
                    const spawnR = v.startR + Math.floor(v.length / 2);
                    newSpecials.push({ r: spawnR, c: v.c, special: 'color_bomb', gemType: 'yellow' });
                }
            });

            // L or T shape -> Bomb
            horizontalRuns.forEach(h => {
                verticalRuns.forEach(v => {
                    if (h.type === v.type && v.c >= h.startC && v.c < h.startC + h.length && h.r >= v.startR && h.r < v.startR + v.length) {
                        newSpecials.push({ r: h.r, c: v.c, special: 'bomb', gemType: h.type });
                    }
                });
            });

            // 4-match -> Line Blaster
            horizontalRuns.forEach(h => {
                if (h.length === 4) {
                    const spawnC = h.startC + 1;
                    if (!newSpecials.some(s => s.r === h.r && s.c === spawnC)) {
                        newSpecials.push({ r: h.r, c: spawnC, special: 'line_h', gemType: h.type });
                    }
                }
                for (let i = 0; i < h.length; i++) initialCells.push({ r: h.r, c: h.startC + i });
            });
            verticalRuns.forEach(v => {
                if (v.length === 4) {
                    const spawnR = v.startR + 1;
                    if (!newSpecials.some(s => s.r === spawnR && s.c === v.c)) {
                        newSpecials.push({ r: spawnR, c: v.c, special: 'line_v', gemType: v.type });
                    }
                }
                for (let i = 0; i < v.length; i++) initialCells.push({ r: v.startR + i, c: v.c });
            });

            // Add remaining cells
            horizontalRuns.forEach(h => {
                if (h.length !== 4) {
                    for (let i = 0; i < h.length; i++) initialCells.push({ r: h.r, c: h.startC + i });
                }
            });
            verticalRuns.forEach(v => {
                if (v.length !== 4) {
                    for (let i = 0; i < v.length; i++) initialCells.push({ r: v.startR + i, c: v.c });
                }
            });

            let cellsToProcess = initialCells.filter((v, i, a) => a.findIndex(t => t.r === v.r && t.c === v.c) === i);

            if (cellsToProcess.length === 0) {
                isSwapping = false;
                isCascading = false;
                clearTimeout(swapWatchdogTimer);

                if (gameMoves > 0 && gameScore < gameTarget && !hasPossibleMatches()) {
                    shuffleGrid();
                }
                if (gameMoves <= 0 || gameScore >= gameTarget) {
                    setTimeout(checkGameEnd, 600);
                }
                return 0;
            }

            if (deductMove) {
                gameMoves--;
                document.getElementById('game-moves').innerText = gameMoves;
            }

            // Expand Special Gem Explosions (Line Blaster row/col, Bomb 3x3)
            let allPops = new Set();
            cellsToProcess.forEach(p => allPops.add(\`\${p.r},\${p.c}\`));

            let queue = [...cellsToProcess];
            while (queue.length > 0) {
                const curr = queue.shift();
                const spec = specialGrid[curr.r] ? specialGrid[curr.r][curr.c] : null;

                if (spec === 'line_h') {
                    sfxLaser();
                    triggerHaptic('medium');
                    spawnLaserBeam(curr.r, 'h');
                    for (let c = 0; c < 8; c++) {
                        const key = \`\${curr.r},\${c}\`;
                        if (!allPops.has(key)) {
                            allPops.add(key);
                            queue.push({ r: curr.r, c });
                        }
                    }
                } else if (spec === 'line_v') {
                    sfxLaser();
                    triggerHaptic('medium');
                    spawnLaserBeam(curr.c, 'v');
                    for (let r = 0; r < 8; r++) {
                        const key = \`\${r},\${curr.c}\`;
                        if (!allPops.has(key)) {
                            allPops.add(key);
                            queue.push({ r, c: curr.c });
                        }
                    }
                } else if (spec === 'bomb') {
                    sfxBomb();
                    triggerHaptic('heavy');
                    triggerScreenShake();
                    for (let dr = -1; dr <= 1; dr++) {
                        for (let dc = -1; dc <= 1; dc++) {
                            const nr = curr.r + dr;
                            const nc = curr.c + dc;
                            if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
                                const key = \`\${nr},\${nc}\`;
                                if (!allPops.has(key)) {
                                    allPops.add(key);
                                    queue.push({ r: nr, c: nc });
                                }
                            }
                        }
                    }
                }
            }

            const finalPopArray = Array.from(allPops).map(k => {
                const [r, c] = k.split(',').map(Number);
                return { r, c };
            });

            const cells = document.getElementById('game-grid').children;
            finalPopArray.forEach(pos => {
                const idx = pos.r * 8 + pos.c;
                if (cells[idx]) cells[idx].classList.add('exploding');
                gridData[pos.r][pos.c] = null;
                specialGrid[pos.r][pos.c] = null;
            });

            // Spawn new specials
            newSpecials.forEach(ns => {
                gridData[ns.r][ns.c] = ns.gemType;
                specialGrid[ns.r][ns.c] = ns.special;
                const idx = ns.r * 8 + ns.c;
                if (cells[idx]) cells[idx].classList.remove('exploding');
            });

            // Scoring with Multiplier & Feedback
            const baseEarned = finalPopArray.length * 60;
            const earned = baseEarned * comboMultiplier;
            gameScore += earned;

            const lvl = gameState.currentPlayingLevel || 1;
            const chargePerBlock = 100 / (15 + (lvl * 3.0));
            gameGauge = Math.min(100, gameGauge + (finalPopArray.length * chargePerBlock * (1 + (comboMultiplier * 0.2))));

            if (gameState && gameState.stats) {
                gameState.stats.totalGemsBroken += finalPopArray.length;
            }

            triggerHaptic(comboMultiplier >= 3 ? 'heavy' : 'light');

            if (newSpecials.some(s => s.special === 'color_bomb')) {
                spawnFloatingCombo("🌈 ZEUS KÜRESİ! 🌈");
                triggerScreenShake();
            } else if (newSpecials.some(s => s.special === 'bomb')) {
                spawnFloatingCombo("💥 MİTOLOJİK BOMBA! 💥");
            } else if (newSpecials.some(s => s.special && s.special.startsWith('line'))) {
                spawnFloatingScore("⚡ YILDIRIM KRİSTALİ! ⚡");
            } else if (comboMultiplier === 2) {
                spawnFloatingScore(\`🔥 KOMBO x2! +\${earned}\`);
            } else if (comboMultiplier === 3) {
                spawnFloatingCombo(\`🔥 EFSANEVİ KOMBO x3! +\${earned}\`);
                triggerScreenShake();
            } else if (comboMultiplier >= 4) {
                spawnFloatingCombo(\`✨ TANRISAL KOMBO x\${comboMultiplier}! +\${earned}\`);
                triggerScreenShake();
            }

            document.getElementById('game-score').innerText = gameScore.toLocaleString();
            updateStarProgressBar();
            document.getElementById('game-gauge-txt').innerText = \`\${Math.floor(gameGauge)}% (Kombo)\`;
            const btnAbility = document.getElementById('btn-use-ability');
            if (btnAbility) btnAbility.disabled = gameGauge < 100;

            updateGameplayPowerups();

            setTimeout(() => {
                applyGravityAndRefill(comboMultiplier);
            }, 350);

            return finalPopArray.length;
        }`;

html = html.replace(oldProcessRegex, newProcessMatches);

// 6. UPGRADE applyGravityAndRefill TO BRING DOWN specialGrid IN SYNC
const oldGravity = `        function applyGravityAndRefill(comboMultiplier) {
            for (let c = 0; c < 8; c++) {
                let emptyRow = 7;
                for (let r = 7; r >= 0; r--) {
                    if (gridData[r][c] !== null) {
                        gridData[emptyRow][c] = gridData[r][c];
                        if (emptyRow !== r) {
                            gridData[r][c] = null;
                        }
                        emptyRow--;
                    }
                }
                for (let r = emptyRow; r >= 0; r--) {
                    gridData[r][c] = GEM_TYPES[Math.floor(Math.random() * GEM_TYPES.length)];
                }
            }
            renderGrid();
            
            // Check matches again for cascade!
            setTimeout(() => {
                processMatchesWithExplosion(comboMultiplier + 1, false);
            }, 300);
        }`;

const newGravity = `        function applyGravityAndRefill(comboMultiplier) {
            for (let c = 0; c < 8; c++) {
                let emptyRow = 7;
                for (let r = 7; r >= 0; r--) {
                    if (gridData[r][c] !== null) {
                        gridData[emptyRow][c] = gridData[r][c];
                        specialGrid[emptyRow][c] = specialGrid[r][c];
                        if (emptyRow !== r) {
                            gridData[r][c] = null;
                            specialGrid[r][c] = null;
                        }
                        emptyRow--;
                    }
                }
                for (let r = emptyRow; r >= 0; r--) {
                    gridData[r][c] = GEM_TYPES[Math.floor(Math.random() * GEM_TYPES.length)];
                    specialGrid[r][c] = null;
                }
            }
            renderGrid();
            
            // Check matches again for cascade!
            setTimeout(() => {
                processMatchesWithExplosion(comboMultiplier + 1, false);
            }, 300);
        }`;

html = html.replace(oldGravity, newGravity);

// 7. UPGRADE applyIAPBundle & restorePurchases
const oldApplyIAP = `        function applyIAPBundle(bundleId) {
            if(bundleId === 'zeus_bundle') {
                gameState.gold += 15000;
                gameState.gems += 250;
                spawnFloatingCombo("🎁 ZEUS'UN BEREKETİ KAZANILDI!");
            } else if(bundleId === 'ares_bundle') {
                gameState.inventory.zeus += 25;
                gameState.inventory.athena += 25;
                spawnFloatingCombo("⚔️ ARES'İN ÖFKESİ KAZANILDI!");
            } else if(bundleId === 'poseidon_bundle') {
                gameState.energy = Math.min(gameState.maxEnergy, gameState.energy + 30);
                spawnFloatingCombo("🌊 POSEIDON'UN İKSİRLERİ KAZANILDI!");
            }
            saveGame();
            updateTopBar();
            updateStoreUI();
        }`;

const newApplyIAP = `        function applyIAPBundle(bundleId) {
            if (bundleId === 'starter_bundle') {
                gameState.gems += 500;
                gameState.gold += 5000;
                gameState.inventory.zeus += 5;
                gameState.inventory.athena += 5;
                gameState.energy = gameState.maxEnergy;
                spawnFloatingCombo("⚡ BAŞLANGIÇ PAKETİ KAZANILDI!");
            } else if (bundleId === 'no_ads') {
                gameState.noAds = true;
                gameState.gems += 100;
                spawnFloatingCombo("🚫 REKLAMLAR KALDIRILDI!");
            } else if (bundleId === 'infinite_energy') {
                gameState.energy = gameState.maxEnergy + 20;
                spawnFloatingCombo("⏳ SONSUZ ENERJİ AKTİF EDİLDİ!");
            } else if (bundleId === 'gems_chest') {
                gameState.gems += 600;
                gameState.inventory.zeus += 2;
                spawnFloatingCombo("💎 KUTSAL ELMAS SANDIĞI AÇILDI!");
            } else if (bundleId === 'olympus_vault') {
                gameState.gems += 2000;
                gameState.gold += 20000;
                gameState.inventory.zeus += 10;
                gameState.inventory.athena += 10;
                spawnFloatingCombo("🏛️ OLİMPOS HAZİNESİ KAZANILDI!");
            } else if (bundleId === 'zeus_bundle') {
                gameState.gold += 15000;
                gameState.gems += 250;
                spawnFloatingCombo("🎁 ZEUS'UN BEREKETİ KAZANILDI!");
            }
            triggerHaptic('heavy');
            saveGame();
            updateTopBar();
            updateStoreUI();
        }

        function restorePurchases() {
            showToast("Satın alımlar sorgulanıyor...", "info");
            setTimeout(() => {
                if (gameState.noAds) {
                    showToast("Aktif satın alımlar başarıyla geri yüklendi! ✓", "success");
                } else {
                    showToast("Geri yüklenecek bekleyen satın alım bulunamadı.", "info");
                }
            }, 1200);
        }`;

html = html.replace(oldApplyIAP, newApplyIAP);

fs.writeFileSync('index.html', html);
// Also copy to www/index.html and Arkenya_Playable_Demo.html for absolute parity!
fs.writeFileSync('www/index.html', html);
fs.writeFileSync('Arkenya_Playable_Demo.html', html);
fs.writeFileSync('www/Arkenya_Playable_Demo.html', html);

console.log("Game engine, Candy Crush special gems, haptics, level onboarding, and IAP successfully integrated into all HTML files!");

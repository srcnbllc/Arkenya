const fs = require('fs');

console.log('=== APPLYING GAMEPLAY SPEED & FLOW OPTIMIZATIONS ===');

let html = fs.readFileSync('www/index.html', 'utf8');
const isCrlf = html.includes('\r\n');

function clean(str) {
    return str.replace(/\r\n/g, '\n');
}

function replaceBlock(targetHtml, searchStr, replaceStr, label) {
    const cleanHtml = clean(targetHtml);
    const cleanSearch = clean(searchStr);
    const cleanReplace = clean(replaceStr);
    
    if (!cleanHtml.includes(cleanSearch)) {
        console.error(`FAIL: ${label} search block not found!`);
        process.exit(1);
    }
    const result = cleanHtml.replace(cleanSearch, cleanReplace);
    console.log(`✓ ${label} applied successfully.`);
    return isCrlf ? result.replace(/\n/g, '\r\n') : result;
}

// 1. CSS CELL TRANSITIONS AND FALLING ANIMATION
const oldCellCss1 = `        .cell {
            width: 100%;
            height: 100%;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            cursor: pointer;
            touch-action: none;
            user-select: none;
            position: relative;
            border: 1.5px solid rgba(255, 215, 0, 0.35);
            box-shadow: inset 0 2px 5px rgba(255,255,255,0.55), inset 0 -3px 6px rgba(0,0,0,0.55), 0 4px 10px rgba(0,0,0,0.6);
            transition: transform 0.22s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.2s, filter 0.2s;
            will-change: transform;
            contain: layout style;
            z-index: 10;
        }`;

const newCellCss1 = `        .cell {
            width: 100%;
            height: 100%;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            cursor: pointer;
            touch-action: none;
            user-select: none;
            position: relative;
            border: 1.5px solid rgba(255, 215, 0, 0.35);
            box-shadow: inset 0 2px 5px rgba(255,255,255,0.55), inset 0 -3px 6px rgba(0,0,0,0.55), 0 4px 10px rgba(0,0,0,0.6);
            transition: transform 0.16s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.16s, filter 0.16s;
            will-change: transform;
            contain: layout style;
            z-index: 10;
        }`;

html = replaceBlock(html, oldCellCss1, newCellCss1, 'Step 1: Cell Transition Speed');

// 2. CSS EXPLODING AND NEW FALLING ANIMATION
const oldExplodeCss = `        /* CANDY CRUSH EXPLOSION ANIMATION */
        .cell.exploding {
            animation: gemExplode 0.35s ease-out forwards;
        }

        @keyframes gemExplode {
            0% { transform: scale(1); filter: brightness(1); }
            50% { transform: scale(1.4); filter: brightness(2.5) drop-shadow(0 0 15px #ffe885); }
            100% { transform: scale(0); opacity: 0; }
        }`;

const newExplodeCss = `        /* CANDY CRUSH EXPLOSION & FAST CASCADE ANIMATION */
        .cell.exploding {
            animation: gemExplode 0.22s cubic-bezier(0.2, 0.8, 0.4, 1) forwards;
        }

        @keyframes gemExplode {
            0% { transform: scale(1); filter: brightness(1); }
            45% { transform: scale(1.35); filter: brightness(2.2) drop-shadow(0 0 16px #ffe885); }
            100% { transform: scale(0); opacity: 0; }
        }

        /* AKICI DÜŞÜŞ ANİMASYONU (SMOOTH GRAVITY CASCADE) */
        .cell.falling {
            animation: gemDrop 0.20s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }

        @keyframes gemDrop {
            0% { transform: translateY(-28px) scale(0.94); opacity: 0.85; }
            100% { transform: translateY(0) scale(1); opacity: 1; }
        }`;

html = replaceBlock(html, oldExplodeCss, newExplodeCss, 'Step 2: Explode & Falling Animations');

// 3. SECONDARY CELL CSS TRANSITION
const oldCellCss2 = `            transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.2s;
            will-change: transform;
            transform: translateZ(0);
            backface-visibility: hidden;
            contain: layout style paint;`;

const newCellCss2 = `            transition: transform 0.16s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.16s;
            will-change: transform;
            transform: translateZ(0);
            backface-visibility: hidden;
            contain: layout style paint;`;

html = replaceBlock(html, oldCellCss2, newCellCss2, 'Step 3: Secondary Cell CSS Transition');

// 4. INPUT BUFFERING & POINTER SWIPE OPTIMIZATIONS
const oldPointerEngine = `        let activePointerId = null;
        let pointerStartX = 0;
        let pointerStartY = 0;
        let pointerStartCell = null;
        let pointerMoved = false;
        let tutorialHintTimeout = null;

        function onCellPointerDown(e) {
            if (isSwapping || isCascading || isLevelEnding || gameMoves <= 0 || (typeof isGamePaused !== 'undefined' && isGamePaused) || (typeof isAdActive !== 'undefined' && isAdActive)) return;
            if (e.button && e.button !== 0) return; // Only primary button/touch

            activePointerId = e.pointerId;
            pointerStartX = e.clientX;
            pointerStartY = e.clientY;
            pointerMoved = false;

            const r = parseInt(this.dataset.r);
            const c = parseInt(this.dataset.c);
            pointerStartCell = { r, c, el: this };

            try {
                this.setPointerCapture(e.pointerId);
            } catch(err) {}
        }

        let pointerRafPending = false;
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
        }`;

const newPointerEngine = `        let activePointerId = null;
        let pointerStartX = 0;
        let pointerStartY = 0;
        let pointerStartCell = null;
        let pointerMoved = false;
        let tutorialHintTimeout = null;
        let bufferedSwap = null; // Smart Move Buffer for Butter-Smooth Rapid Play

        function tryExecuteBufferedSwap() {
            if (!bufferedSwap) return;
            const move = bufferedSwap;
            bufferedSwap = null;
            if (Date.now() - move.time > 800) return; // Expire stale moves
            if (gameMoves <= 0 || isSwapping || isCascading || isLevelEnding) return;
            if (move.fromR >= 0 && move.fromR < 8 && move.fromC >= 0 && move.fromC < 8 &&
                move.toR >= 0 && move.toR < 8 && move.toC >= 0 && move.toC < 8) {
                executeSwap(move.fromR, move.fromC, move.toR, move.toC);
            }
        }

        function onCellPointerDown(e) {
            if (isLevelEnding || gameMoves <= 0 || (typeof isGamePaused !== 'undefined' && isGamePaused) || (typeof isAdActive !== 'undefined' && isAdActive)) return;
            if (e.button && e.button !== 0) return; // Only primary button/touch

            activePointerId = e.pointerId;
            pointerStartX = e.clientX;
            pointerStartY = e.clientY;
            pointerMoved = false;

            const r = parseInt(this.dataset.r);
            const c = parseInt(this.dataset.c);
            pointerStartCell = { r, c, el: this };

            try {
                this.setPointerCapture(e.pointerId);
            } catch(err) {}
        }

        let pointerRafPending = false;
        function onCellPointerMove(e) {
            if (activePointerId === null || e.pointerId !== activePointerId || !pointerStartCell) return;
            if (isLevelEnding || gameMoves <= 0 || (typeof isGamePaused !== 'undefined' && isGamePaused)) return;

            if (pointerRafPending) return;
            pointerRafPending = true;

            requestAnimationFrame(() => {
                pointerRafPending = false;
                if (activePointerId === null || !pointerStartCell) return;

                const dx = e.clientX - pointerStartX;
                const dy = e.clientY - pointerStartY;
                const absX = Math.abs(dx);
                const absY = Math.abs(dy);

                // High-DPI calibrated responsive glide threshold (10px - 16px)
                const dpr = window.devicePixelRatio || 1;
                const glideThreshold = Math.max(10, Math.min(16, Math.round(12 * (dpr > 2 ? 1.05 : 1.0))));

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
                        if (isSwapping || isCascading) {
                            // Buffer move so it executes seamlessly the microsecond the board unlocks!
                            bufferedSwap = { fromR, fromC, toR, toC, time: Date.now() };
                        } else {
                            executeSwap(fromR, fromC, toR, toC);
                        }
                    }
                }
            });
        }`;

html = replaceBlock(html, oldPointerEngine, newPointerEngine, 'Step 4: Input Buffering & Pointer Swipe');

// 5. EXECUTE SWAP: DYNAMIC WIDTH & 160ms SPEED
const oldExecuteSwap = `            // Safety Watchdog: force unlock after 1.5s if any cascade step freezes
            clearTimeout(swapWatchdogTimer);
            swapWatchdogTimer = setTimeout(() => {
                isSwapping = false;
                isCascading = false;
            }, 1500);

            const cells = document.getElementById('game-grid').children;
            const idx1 = r1 * 8 + c1;
            const idx2 = r2 * 8 + c2;
            const cell1 = cells[idx1];
            const cell2 = cells[idx2];
            
            // Calculate translation for swap animation
            const dx = (c2 - c1) * 48;
            const dy = (r2 - r1) * 48;
            
            if (cell1 && cell2) {
                cell1.style.transform = \`translate3d(\${dx}px, \${dy}px, 0)\`;
                cell2.style.transform = \`translate3d(\${-dx}px, \${-dy}px, 0)\`;
                cell1.style.zIndex = '20';
            }
            
            setTimeout(() => {
                if (cell1 && cell2) {
                    cell1.style.transform = '';
                    cell2.style.transform = '';
                    cell1.style.zIndex = '10';
                }
                
                // Perform data swap
                const temp = gridData[r1][c1];
                gridData[r1][c1] = gridData[r2][c2];
                gridData[r2][c2] = temp;
                renderGrid();
                
                const matchedCount = processMatchesWithExplosion(1, true); // true = check moves deduct
                
                if (matchedCount === 0) {
                    // Invalid move, swap back
                    if (cell1 && cell2) {
                        cell1.style.transform = \`translate3d(\${dx}px, \${dy}px, 0)\`;
                        cell2.style.transform = \`translate3d(\${-dx}px, \${-dy}px, 0)\`;
                    }
                    
                    setTimeout(() => {
                        if (cell1 && cell2) {
                            cell1.style.transform = '';
                            cell2.style.transform = '';
                        }
                        gridData[r2][c2] = gridData[r1][c1];
                        gridData[r1][c1] = temp;
                        renderGrid();
                        isSwapping = false;
                        clearTimeout(swapWatchdogTimer);
                    }, 250);
                }
            }, 250);`;

const newExecuteSwap = `            // Safety Watchdog: force unlock after 1.2s if any cascade step freezes
            clearTimeout(swapWatchdogTimer);
            swapWatchdogTimer = setTimeout(() => {
                isSwapping = false;
                isCascading = false;
                tryExecuteBufferedSwap();
            }, 1200);

            const cells = document.getElementById('game-grid').children;
            const idx1 = r1 * 8 + c1;
            const idx2 = r2 * 8 + c2;
            const cell1 = cells[idx1];
            const cell2 = cells[idx2];
            
            // Calculate translation dynamically with exact cell width
            const cellWidth = (cell1 && (cell1.clientWidth || cell1.offsetWidth)) ? (cell1.clientWidth || cell1.offsetWidth) : 48;
            const dx = (c2 - c1) * cellWidth;
            const dy = (r2 - r1) * cellWidth;
            
            if (cell1 && cell2) {
                cell1.style.transform = \`translate3d(\${dx}px, \${dy}px, 0)\`;
                cell2.style.transform = \`translate3d(\${-dx}px, \${-dy}px, 0)\`;
                cell1.style.zIndex = '20';
            }
            
            setTimeout(() => {
                if (cell1 && cell2) {
                    cell1.style.transform = '';
                    cell2.style.transform = '';
                    cell1.style.zIndex = '10';
                }
                
                // Perform data swap
                const temp = gridData[r1][c1];
                gridData[r1][c1] = gridData[r2][c2];
                gridData[r2][c2] = temp;
                renderGrid();
                
                const matchedCount = processMatchesWithExplosion(1, true); // true = check moves deduct
                
                if (matchedCount === 0) {
                    // Invalid move, snap-back with crisp 160ms animation
                    if (cell1 && cell2) {
                        cell1.style.transform = \`translate3d(\${dx}px, \${dy}px, 0)\`;
                        cell2.style.transform = \`translate3d(\${-dx}px, \${-dy}px, 0)\`;
                    }
                    
                    setTimeout(() => {
                        if (cell1 && cell2) {
                            cell1.style.transform = '';
                            cell2.style.transform = '';
                        }
                        gridData[r2][c2] = gridData[r1][c1];
                        gridData[r1][c1] = temp;
                        renderGrid();
                        isSwapping = false;
                        clearTimeout(swapWatchdogTimer);
                        tryExecuteBufferedSwap();
                    }, 160);
                }
            }, 160);`;

html = replaceBlock(html, oldExecuteSwap, newExecuteSwap, 'Step 5: executeSwap Dynamic Width & 160ms Speed');

// 6. PROCESS MATCHES: 220ms EXPLOSION DELAY & BUFFER DRAIN
const oldMatchEnd = `            if (cellsToProcess.length === 0) {
                isSwapping = false;
                isCascading = false;
                clearTimeout(swapWatchdogTimer);
                saveActiveMatchSession();

                if (gameMoves > 0 && gameScore < gameTarget && !hasPossibleMatches()) {
                    shuffleGrid();
                }
                if (gameMoves <= 0 || gameScore >= gameTarget) {
                    setTimeout(checkGameEnd, 600);
                }
                return 0;
            }`;

const newMatchEnd = `            if (cellsToProcess.length === 0) {
                isSwapping = false;
                isCascading = false;
                clearTimeout(swapWatchdogTimer);
                saveActiveMatchSession();

                if (gameMoves > 0 && gameScore < gameTarget && !hasPossibleMatches()) {
                    shuffleGrid();
                }
                if (gameMoves <= 0 || gameScore >= gameTarget) {
                    setTimeout(checkGameEnd, 500);
                } else {
                    tryExecuteBufferedSwap();
                }
                return 0;
            }`;

html = replaceBlock(html, oldMatchEnd, newMatchEnd, 'Step 6: Match End Buffer Drain');

const oldPopTimeout = `            setTimeout(() => {
                applyGravityAndRefill(comboMultiplier);
            }, 350);`;

const newPopTimeout = `            setTimeout(() => {
                applyGravityAndRefill(comboMultiplier);
            }, 220);`;

html = replaceBlock(html, oldPopTimeout, newPopTimeout, 'Step 7: Pop Delay to 220ms');

// 8. APPLY GRAVITY AND REFILL WITH SMOOTH DROP ANIMATION
const oldGravity = `        function applyGravityAndRefill(comboMultiplier) {
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
                if (comboMultiplier < 25) {
                    processMatchesWithExplosion(comboMultiplier + 1, false);
                } else {
                    isCascading = false;
                    isSwapping = false;
                    clearTimeout(swapWatchdogTimer);
                    checkGameEnd();
                }
            }, 300);
        }`;

const newGravity = `        function applyGravityAndRefill(comboMultiplier) {
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

html = replaceBlock(html, oldGravity, newGravity, 'Step 8: applyGravityAndRefill Smooth Drop Animation');

// 9. ZEUS COLOR BOMB AND HERO ABILITY REFILL DELAY
const oldZeusRefill = `            setTimeout(() => {
                applyGravityAndRefill(2);
            }, 400);`;

const newZeusRefill = `            setTimeout(() => {
                applyGravityAndRefill(2);
            }, 260);`;

html = replaceBlock(html, oldZeusRefill, newZeusRefill, 'Step 9: Zeus Color Bomb Refill Delay');

const oldHeroRefill = `            setTimeout(() => {
                applyGravityAndRefill(1);
            }, 350);`;

const newHeroRefill = `            setTimeout(() => {
                applyGravityAndRefill(1);
            }, 240);`;

html = replaceBlock(html, oldHeroRefill, newHeroRefill, 'Step 10: Hero Ability Refill Delay');

fs.writeFileSync('www/index.html', html, 'utf8');
console.log('=== ALL 10 GAMEPLAY SPEED & FLOW OPTIMIZATIONS WRITTEN TO www/index.html ===');

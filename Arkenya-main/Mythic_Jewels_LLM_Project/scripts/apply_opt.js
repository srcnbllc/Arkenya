const fs = require('fs');

console.log('=== APPLYING GAMEPLAY SPEED & FLOW OPTIMIZATIONS ===');

// Reset from pristine index.html
fs.copyFileSync('index.html', 'www/index.html');
let html = fs.readFileSync('www/index.html', 'utf8');

// 1. CSS CELL TRANSITIONS
html = html.replace(
    /transition:\s*transform\s*0\.22s\s*cubic-bezier\(0\.175,\s*0\.885,\s*0\.32,\s*1\.275\),\s*opacity\s*0\.2s,\s*filter\s*0\.2s;/,
    'transition: transform 0.16s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.16s, filter 0.16s;'
);
console.log('✓ CSS Step 1: primary cell transition');

// 2. CSS EXPLODING AND NEW FALLING ANIMATION
const oldExplodeRegex = /\.cell\.exploding\s*\{[\s\S]*?@keyframes\s*gemExplode\s*\{[\s\S]*?100%\s*\{[\s\S]*?\}\s*\}/;

const newExplode = `.cell.exploding {
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

if (!oldExplodeRegex.test(html)) {
    console.error('FAIL: oldExplodeRegex not found');
    process.exit(1);
}
html = html.replace(oldExplodeRegex, newExplode);
console.log('✓ CSS Step 2: gemExplode 0.22s & gemDrop 0.20s');

// 3. SECONDARY CELL TRANSITION
html = html.replace(
    /transition:\s*transform\s*0\.2s\s*cubic-bezier\(0\.175,\s*0\.885,\s*0\.32,\s*1\.275\),\s*opacity\s*0\.2s;/,
    'transition: transform 0.16s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.16s;'
);
console.log('✓ CSS Step 3: secondary cell transition');

// 4. INPUT BUFFERING & POINTER SWIPE
const pointerStartMarker = 'let activePointerId = null;';
const pointerEndMarker = 'function onCellPointerUp(e) {';

const pStartIdx = html.indexOf(pointerStartMarker);
const pEndIdx = html.indexOf(pointerEndMarker);

if (pStartIdx === -1 || pEndIdx === -1) {
    console.error('FAIL: pointer engine markers not found');
    process.exit(1);
}

const newPointerEngine = `let activePointerId = null;
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
        }

        `;

html = html.substring(0, pStartIdx) + newPointerEngine + html.substring(pEndIdx);
console.log('✓ Step 4: Input Buffering & Pointer Swipe applied');

// 5. EXECUTE SWAP: DYNAMIC WIDTH & 160ms SPEED
const swapStartMarker = '// Safety Watchdog: force unlock after 1.5s if any cascade step freezes';
const swapEndMarker = 'function triggerZeusWrathColorBomb(bombPos, otherPos, targetColor) {';

const sStartIdx = html.indexOf(swapStartMarker);
const sEndIdx = html.indexOf(swapEndMarker);

if (sStartIdx === -1 || sEndIdx === -1) {
    console.error('FAIL: executeSwap markers not found');
    process.exit(1);
}

const newSwapBody = `// Safety Watchdog: force unlock after 1.2s if any cascade step freezes
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
            }, 160);
        }

        `;

html = html.substring(0, sStartIdx) + newSwapBody + html.substring(sEndIdx);
console.log('✓ Step 5: executeSwap Dynamic Width & 160ms Speed applied');

// 6. MATCH END BUFFER DRAIN
const matchEndRegex = /if\s*\(\s*cellsToProcess\.length\s*===\s*0\s*\)\s*\{[\s\S]*?return\s*0;\s*\}/;

const newMatchEnd = `if (cellsToProcess.length === 0) {
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

if (!matchEndRegex.test(html)) {
    console.error('FAIL: matchEndRegex not found');
    process.exit(1);
}
html = html.replace(matchEndRegex, newMatchEnd);
console.log('✓ Step 6: Match End Buffer Drain applied');

// 7. EXPLOSION TIMEOUT TO 220ms
const popRegex = /setTimeout\(\(\)\s*=>\s*\{\s*applyGravityAndRefill\(comboMultiplier\);\s*\}, 350\);/;
if (!popRegex.test(html)) {
    console.error('FAIL: popRegex not found');
    process.exit(1);
}
html = html.replace(popRegex, `setTimeout(() => {
                applyGravityAndRefill(comboMultiplier);
            }, 220);`);
console.log('✓ Step 7: Pop Delay to 220ms applied');

// 8. APPLY GRAVITY AND REFILL WITH SMOOTH DROP ANIMATION
const gravityStartMarker = 'function applyGravityAndRefill(comboMultiplier) {';
const gravityEndMarker = 'function spawnFloatingCombo(text) {';

const gStartIdx = html.indexOf(gravityStartMarker);
const gEndIdx = html.indexOf(gravityEndMarker);

if (gStartIdx === -1 || gEndIdx === -1) {
    console.error('FAIL: applyGravityAndRefill markers not found');
    process.exit(1);
}

const newGravity = `function applyGravityAndRefill(comboMultiplier) {
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
        }

        `;

html = html.substring(0, gStartIdx) + newGravity + html.substring(gEndIdx);
console.log('✓ Step 8: applyGravityAndRefill Smooth Drop Animation applied');

// 9. ZEUS COLOR BOMB AND HERO ABILITY REFILL DELAY
const zeusRegex = /setTimeout\(\(\)\s*=>\s*\{\s*applyGravityAndRefill\(2\);\s*\}, 400\);/;
if (zeusRegex.test(html)) {
    html = html.replace(zeusRegex, `setTimeout(() => {
                applyGravityAndRefill(2);
            }, 260);`);
    console.log('✓ Step 9: Zeus Color Bomb Refill Delay applied');
}

const heroRegex = /setTimeout\(\(\)\s*=>\s*\{\s*applyGravityAndRefill\(1\);\s*\}, 350\);/;
if (heroRegex.test(html)) {
    html = html.replace(heroRegex, `setTimeout(() => {
                applyGravityAndRefill(1);
            }, 240);`);
    console.log('✓ Step 10: Hero Ability Refill Delay applied');
}

fs.writeFileSync('www/index.html', html, 'utf8');
console.log('\n=== ALL GAMEPLAY FLOW OPTIMIZATIONS SUCCESSFULLY APPLIED TO www/index.html! ===');

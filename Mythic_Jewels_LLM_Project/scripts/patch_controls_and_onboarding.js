const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'www', 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. ADD handleMainMenuPlay() and ONBOARDING TRIGGER
const onboardingLogic = `
        function handleMainMenuPlay() {
            triggerHaptic('light');
            if (!gameState.hasSeenPrologue) {
                openModal('modal-prologue');
            } else {
                openWorldMap();
            }
        }

        function checkFirstTimeOnboarding() {
            if (!gameState.hasSeenPrologue) {
                setTimeout(() => {
                    openModal('modal-prologue');
                }, 500);
            }
        }

        function startFirstTimeAdventure() {
            closeModal('modal-prologue');
            gameState.hasSeenPrologue = true;
            gameState.currentPlayingLevel = 1;
            gameState.unlockedLevel = 1;
            gameState.totalScore = 0;
            gameState.gold = 0;
            gameState.gems = 0;
            saveGame();
            startGameplay();
        }
`;

// Replace old checkFirstTimeOnboarding and startFirstTimeAdventure
const oldOnboardingRegex = /function checkFirstTimeOnboarding\(\) \{[\s\S]*?function startFirstTimeAdventure\(\) \{[\s\S]*?startGameplay\(\);[\s\S]*?\}/;
if (oldOnboardingRegex.test(content)) {
    content = content.replace(oldOnboardingRegex, onboardingLogic.trim());
    console.log('Replaced checkFirstTimeOnboarding and startFirstTimeAdventure');
} else {
    console.log('Old onboarding regex did not match, adding handleMainMenuPlay');
    content = content.replace('function openHeroScreen() {', onboardingLogic + '\n        function openHeroScreen() {');
}

// 2. UNIFIED POINTER CONTROLS & LEVEL 1 TUTORIAL HINT ENGINE
const newControlsAndTutorial = `
        // ==========================================
        // UNIFIED HIGH-PERFORMANCE POINTER & SWIPE ENGINE
        // Works seamlessly on Mobile Touch, Stylus & Emulator Mouse
        // ==========================================
        let activePointerId = null;
        let pointerStartX = 0;
        let pointerStartY = 0;
        let pointerStartCell = null;
        let pointerMoved = false;
        let tutorialHintTimeout = null;

        function onCellPointerDown(e) {
            if (isSwapping || isCascading || isLevelEnding || gameMoves <= 0) return;
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

        function onCellPointerMove(e) {
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
        }

        function onCellPointerUp(e) {
            if (activePointerId === null || e.pointerId !== activePointerId) return;
            const cell = pointerStartCell;
            const moved = pointerMoved;

            try {
                if (cell && cell.el && cell.el.hasPointerCapture && cell.el.hasPointerCapture(e.pointerId)) {
                    cell.el.releasePointerCapture(e.pointerId);
                }
            } catch(err) {}

            activePointerId = null;
            pointerStartCell = null;
            pointerMoved = false;

            if (!moved && cell) {
                // Stationary tap -> Tap-to-select or Tap-adjacent-to-swap
                onCellTap(cell.r, cell.c, cell.el);
            }
        }

        function onCellPointerCancel(e) {
            if (activePointerId !== null && e.pointerId === activePointerId) {
                try {
                    if (pointerStartCell && pointerStartCell.el && pointerStartCell.el.hasPointerCapture) {
                        pointerStartCell.el.releasePointerCapture(e.pointerId);
                    }
                } catch(err) {}
                activePointerId = null;
                pointerStartCell = null;
                pointerMoved = false;
                clearSelectedCell();
            }
        }

        function onCellTap(r, c, el) {
            if (isSwapping || isCascading || isLevelEnding || gameMoves <= 0) return;

            if (!selectedCell) {
                selectedCell = { r, c, el };
                el.classList.add('selected');
                triggerHaptic('light');
            } else if (selectedCell.r === r && selectedCell.c === c) {
                // Tapped same cell again -> deselect
                clearSelectedCell();
            } else {
                const prev = selectedCell;
                clearSelectedCell();

                if (Math.abs(prev.r - r) + Math.abs(prev.c - c) === 1) {
                    // Adjacent cell tapped -> execute swap!
                    dismissTutorialHint();
                    executeSwap(prev.r, prev.c, r, c);
                } else {
                    // Non-adjacent cell tapped -> select new cell
                    selectedCell = { r, c, el };
                    el.classList.add('selected');
                    triggerHaptic('light');
                }
            }
        }

        // ==========================================
        // LEVEL 1 INTERACTIVE ONBOARDING TUTORIAL
        // ==========================================
        function setupLevel1InteractiveTutorial() {
            const lvl = gameState.currentPlayingLevel || 1;
            if (lvl !== 1 || (gameState.completedLevels && gameState.completedLevels[1])) return;

            // Guarantee a clean horizontal match at row 3, cols 2-4
            // gridData[3][2] and gridData[3][3] swap to match with gridData[3][4] and gridData[3][5]
            const targetColor = 'yellow';
            gridData[3][2] = 'yellow';
            gridData[3][3] = 'purple';
            gridData[3][4] = 'yellow';
            gridData[3][5] = 'yellow';
            renderGrid();

            // Highlight the two cells
            const cells = document.getElementById('game-grid').children;
            const idx1 = 3 * 8 + 2;
            const idx2 = 3 * 8 + 3;

            if (cells[idx1]) cells[idx1].classList.add('tutorial-pulse');
            if (cells[idx2]) cells[idx2].classList.add('tutorial-pulse');

            // Spawn floating hand pointer
            const oldHint = document.getElementById('tutorial-hand-hint');
            if (oldHint) oldHint.remove();

            const grid = document.getElementById('game-grid');
            const hint = document.createElement('div');
            hint.id = 'tutorial-hand-hint';
            hint.className = 'tutorial-hand-hint';
            
            // Position near cell [3, 2]
            const cellWidth = grid.clientWidth / 8;
            const topPos = (3 * cellWidth) - 10;
            const leftPos = (2 * cellWidth) + (cellWidth / 2) - 15;
            hint.style.top = topPos + 'px';
            hint.style.left = leftPos + 'px';

            hint.innerHTML = \`
                <div class="hand-icon">👉</div>
                <div class="hand-label">Sağa kaydırarak 3'lü eşleştir!</div>
            \`;
            grid.appendChild(hint);
        }

        function dismissTutorialHint() {
            document.querySelectorAll('.tutorial-pulse').forEach(el => el.classList.remove('tutorial-pulse'));
            const hint = document.getElementById('tutorial-hand-hint');
            if (hint) {
                hint.style.opacity = '0';
                setTimeout(() => hint.remove(), 300);
            }
        }
`;

// Replace from handleSwipeStart to window.addEventListener('mouseup', handleSwipeEnd);
const swipeEngineRegex = /let isPointerDragging = false;[\s\S]*?window\.addEventListener\('mouseup', handleSwipeEnd\);/;
if (swipeEngineRegex.test(content)) {
    content = content.replace(swipeEngineRegex, newControlsAndTutorial.trim());
    console.log('Replaced swipe engine with unified Pointer Event engine & tutorial.');
} else {
    console.log('Warning: swipeEngineRegex not matched, checking alternate pattern');
}

// 3. UPDATE initGrid() TO USE POINTER LISTENERS AND TRIGGER LEVEL 1 TUTORIAL
const oldInitGridRegex = /function initGrid\(\) \{[\s\S]*?gridEl\.appendChild\(cell\);[\s\S]*?\}\s*\}/;
const newInitGrid = `function initGrid() {
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

                    // Unified Pointer Event Handlers (touch, mouse, stylus)
                    cell.addEventListener('pointerdown', onCellPointerDown);
                    cell.addEventListener('pointermove', onCellPointerMove);
                    cell.addEventListener('pointerup', onCellPointerUp);
                    cell.addEventListener('pointercancel', onCellPointerCancel);

                    gridEl.appendChild(cell);
                }
            }

            // Display Level 1-5 Onboarding Guidance & Interactive Tutorial
            showLevelOnboardingTip();
            
            if (gameState.currentPlayingLevel === 1 && (!gameState.completedLevels || !gameState.completedLevels[1])) {
                setTimeout(setupLevel1InteractiveTutorial, 300);
            }

            // Immediately check and explode initial matches for dynamic entrance!
            setTimeout(() => {
                processMatchesWithExplosion(1, false);
            }, 150);
        }`;

if (oldInitGridRegex.test(content)) {
    content = content.replace(oldInitGridRegex, newInitGrid);
    console.log('Updated initGrid() with pointer listeners and Level 1 tutorial!');
} else {
    console.log('Warning: oldInitGridRegex did not match');
}

// 4. PREVENT BLOCKING modal-onboarding OVERLAY IN startGameplay()
content = content.replace(
    `            // Show Onboarding tutorial if level 1 and not yet completed
            if (lvl === 1 && (!gameState.completedLevels || !gameState.completedLevels[1])) {
                setTimeout(() => {
                    document.getElementById('modal-onboarding').classList.add('active');
                }, 800);
            }`,
    `            // Non-blocking Level 1 guide is handled organically via setupLevel1InteractiveTutorial()`
);
console.log('Removed disruptive modal-onboarding popup from startGameplay()');

// 5. RESET GAME PROGRESS ENHANCEMENT
const resetCleanCode = `
        function resetProgressToFresh() {
            if (confirm("Oyun sıfırlanacak, tüm puanlar silinecek ve 1. Bölümden sıfır puanla başlanacak. Emin misiniz?")) {
                localStorage.removeItem('arkenya_save_v10');
                localStorage.removeItem('arkenya_save_v9');
                localStorage.removeItem('arkenya_save_v8');
                gameState = Object.assign({}, defaultState);
                gameState.completedLevels = {};
                gameState.unlockedLevel = 1;
                gameState.currentPlayingLevel = 1;
                gameState.totalScore = 0;
                gameState.gold = 0;
                gameState.gems = 0;
                gameState.hasSeenPrologue = false;
                saveGame();
                updateHUD();
                showToast("Oyun sıfırlandı! Yeni maceraya hoş geldin.", "info");
                showScreen('screen-mainmenu');
                openModal('modal-prologue');
            }
        }
`;

content = content.replace(/function resetProgressToFresh\(\) \{[\s\S]*?showToast\("Oyun sıfırlandı! Asterion aktif\.", "info"\);\s*\}\s*\}/, resetCleanCode.trim());
console.log('Enhanced resetProgressToFresh()');

// 6. AUTO-TRIGGER PROLOGUE ON APP START IF BRAND NEW
if (!content.includes('checkFirstTimeOnboarding(); // check prologue')) {
    content = content.replace(
        'setTimeout(() => {\n            checkDailyReward();\n        }, 500);',
        'setTimeout(() => {\n            checkDailyReward();\n            checkFirstTimeOnboarding(); // check prologue\n        }, 600);'
    );
    console.log('Added auto-trigger prologue on app launch.');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Step 2 controls & onboarding patch complete!');

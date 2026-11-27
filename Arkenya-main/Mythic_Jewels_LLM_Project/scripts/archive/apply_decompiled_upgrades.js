const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(targetPath, 'utf8');

console.log("Applying Decompiled Master Upgrades to Arkenya (Refined)...");

// Replace clearIdleHint & shuffleGrid with bulletproof versions
const oldControllerTarget = `        var idleHintTimer = null;
        var activeHintCells = [];

        function clearIdleHint() {
            if (idleHintTimer) {
                clearTimeout(idleHintTimer);
                idleHintTimer = null;
            }
            if (activeHintCells && activeHintCells.length > 0) {
                const gridEl = document.getElementById('game-grid');
                if (gridEl) {
                    const cells = gridEl.children;
                    activeHintCells.forEach(pos => {
                        const idx = pos.r * 8 + pos.c;
                        if (cells[idx]) cells[idx].classList.remove('hint-pulse');
                    });
                }
                activeHintCells = [];
            }
        }`;

const newControllerReplacement = `        var idleHintTimer = null;
        var activeHintCells = [];

        function clearIdleHint() {
            if (idleHintTimer) {
                clearTimeout(idleHintTimer);
                idleHintTimer = null;
            }
            const gridEl = document.getElementById('game-grid');
            if (gridEl) {
                const pulsed = gridEl.querySelectorAll('.hint-pulse');
                pulsed.forEach(el => el.classList.remove('hint-pulse'));
            }
            activeHintCells = [];
        }`;

if (content.includes(oldControllerTarget)) {
    content = content.replace(oldControllerTarget, newControllerReplacement);
    console.log("  [+] Refined clearIdleHint with querySelectorAll fallback");
}

const oldShuffleTarget = `        function shuffleGrid() {
            clearIdleHint();
            spawnFloatingCombo("🔄 HAMLE KALMADI, TAHTA KARIŞTIRILIYOR!");
            triggerScreenShake('light');
            sfxGemSlide();

            let allCells = [];
            for (let r = 0; r < 8; r++) {
                for (let c = 0; c < 8; c++) {
                    allCells.push({
                        type: gridData[r][c] || GEM_TYPES[Math.floor(Math.random() * GEM_TYPES.length)],
                        special: (specialGrid && specialGrid[r]) ? specialGrid[r][c] : null
                    });
                }
            }

            let attempts = 0;
            do {
                allCells.sort(() => Math.random() - 0.5);
                let idx = 0;
                for (let r = 0; r < 8; r++) {
                    for (let c = 0; c < 8; c++) {
                        gridData[r][c] = allCells[idx].type;
                        if (specialGrid && specialGrid[r]) specialGrid[r][c] = allCells[idx].special;
                        idx++;
                    }
                }
                attempts++;
            } while ((checkGridHasMatches() || !hasPossibleMatches()) && attempts < 50);

            // Reshuffle loop safeguard: if after 50 attempts no moves exist, inject a guaranteed match candidate
            if (!hasPossibleMatches()) {
                const targetGem = GEM_TYPES[0] || 'ruby';
                const otherGem = GEM_TYPES[1] || 'sapphire';
                gridData[0][0] = targetGem;
                gridData[0][1] = targetGem;
                gridData[0][2] = otherGem;
                gridData[0][3] = targetGem;
                if (specialGrid) {
                    specialGrid[0][0] = null;
                    specialGrid[0][1] = null;
                    specialGrid[0][2] = null;
                    specialGrid[0][3] = null;
                }
            }

            renderGrid();
            startIdleHintTimer(4000);
        }`;

const newShuffleReplacement = `        function shuffleGrid() {
            clearIdleHint();
            spawnFloatingCombo("🔄 HAMLE KALMADI, TAHTA KARIŞTIRILIYOR!");
            triggerScreenShake('light');
            sfxGemSlide();

            let allCells = [];
            for (let r = 0; r < 8; r++) {
                for (let c = 0; c < 8; c++) {
                    allCells.push({
                        type: gridData[r][c] || GEM_TYPES[Math.floor(Math.random() * GEM_TYPES.length)],
                        special: (specialGrid && specialGrid[r]) ? specialGrid[r][c] : null
                    });
                }
            }

            let attempts = 0;
            do {
                allCells.sort(() => Math.random() - 0.5);
                let idx = 0;
                for (let r = 0; r < 8; r++) {
                    for (let c = 0; c < 8; c++) {
                        gridData[r][c] = allCells[idx].type;
                        if (specialGrid && specialGrid[r]) specialGrid[r][c] = allCells[idx].special;
                        idx++;
                    }
                }
                attempts++;
            } while ((checkGridHasMatches() || !hasPossibleMatches()) && attempts < 50);

            // Absolute Sanitization: eliminate any accidental 3-in-a-row matches from shuffle
            let sanitizePass = 0;
            while (checkGridHasMatches() && sanitizePass < 15) {
                sanitizePass++;
                for (let r = 0; r < 8; r++) {
                    for (let c = 0; c < 6; c++) {
                        if (gridData[r][c] && gridData[r][c] === gridData[r][c+1] && gridData[r][c] === gridData[r][c+2]) {
                            const avoid = gridData[r][c];
                            const candidate = GEM_TYPES.find(t => t !== avoid && t !== (gridData[r-1] ? gridData[r-1][c+1] : null)) || 'ruby';
                            gridData[r][c+1] = candidate;
                        }
                    }
                }
                for (let c = 0; c < 8; c++) {
                    for (let r = 0; r < 6; r++) {
                        if (gridData[r][c] && gridData[r+1][c] === gridData[r][c] && gridData[r+2][c] === gridData[r][c]) {
                            const avoid = gridData[r][c];
                            const candidate = GEM_TYPES.find(t => t !== avoid) || 'sapphire';
                            gridData[r+1][c] = candidate;
                        }
                    }
                }
            }

            // Reshuffle loop safeguard: if no moves exist, inject a guaranteed match candidate
            if (!hasPossibleMatches()) {
                const targetGem = GEM_TYPES[0] || 'ruby';
                const otherGem = GEM_TYPES[1] || 'sapphire';
                gridData[0][0] = targetGem;
                gridData[0][1] = targetGem;
                gridData[0][2] = otherGem;
                gridData[0][3] = targetGem;
                if (specialGrid) {
                    specialGrid[0][0] = null;
                    specialGrid[0][1] = null;
                    specialGrid[0][2] = null;
                    specialGrid[0][3] = null;
                }
            }

            renderGrid();
            startIdleHintTimer(4000);
        }`;

if (content.includes(oldShuffleTarget)) {
    content = content.replace(oldShuffleTarget, newShuffleReplacement);
    console.log("  [+] Refined shuffleGrid with zero 3-in-a-row sanitization pass");
}

fs.writeFileSync(targetPath, content, 'utf8');
console.log("  [SUCCESS] Updated " + targetPath);

const wwwPath = path.join(__dirname, 'www', 'index.html');
fs.writeFileSync(wwwPath, content, 'utf8');
console.log("  [SUCCESS] Synchronized " + wwwPath);

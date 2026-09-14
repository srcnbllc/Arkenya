const fs = require('fs');
let html = fs.readFileSync('Arkenya_Playable_Demo.html', 'utf8');

// 1. Update #screen-worldmap background
html = html.replace(/#screen-worldmap\s*\{\s*background:\s*radial-gradient[^}]+\}/,
`#screen-worldmap {
            background-image: url('Assets/Art/mythic_map_bg.png');
            background-size: cover;
            background-position: center;
            background-attachment: scroll;
        }`);

// 2. Update .btn-action CSS for mythological theme
html = html.replace(/\.btn-action\s*\{[\s\S]*?cursor:\s*pointer;\s*\}/, 
`.btn-action {
            width: 100%;
            padding: 12px;
            background: linear-gradient(180deg, #d4af37, #997a00);
            color: #1a0f00;
            border: 2px solid #ffdf73;
            border-radius: 8px;
            font-size: 15px;
            font-weight: 800;
            text-shadow: 0 1px 2px rgba(255,255,255,0.4);
            box-shadow: 0 4px 10px rgba(0,0,0,0.5), inset 0 2px 5px rgba(255,255,255,0.3);
            font-family: 'Cinzel', serif; /* Or fallback to Georgia/serif */
            cursor: pointer;
            text-transform: uppercase;
            letter-spacing: 1px;
            transition: all 0.2s ease;
        }
        .btn-action:active {
            transform: translateY(2px);
            box-shadow: 0 1px 3px rgba(0,0,0,0.8);
        }`);

// 3. Fix executeSwap logic: Swap back if invalid, and do NOT give score.
const oldExecuteSwap = `        function executeSwap(r1, c1, r2, c2) {
            if (gameMoves <= 0) return;

            const temp = gridData[r1][c1];
            gridData[r1][c1] = gridData[r2][c2];
            gridData[r2][c2] = temp;

            gameMoves--;
            document.getElementById('game-moves').innerText = gameMoves;

            renderGrid();
            
            const matchedCount = processMatchesWithExplosion();
            
            // If no natural 3-match occurred, perform Zeus wild burst on swap location to guarantee action!
            if (matchedCount === 0) {
                gameScore += 350;
                gameGauge = Math.min(100, gameGauge + 15);
                spawnFloatingScore("⚡ YILDIRIM TEMASI! +350");
                document.getElementById('game-score').innerText = gameScore.toLocaleString();
                document.getElementById('game-gauge-txt').innerText = \`\${gameGauge}%\`;

                if (gameGauge >= 40) document.getElementById('btn-summon-zeus').disabled = false;
                if (gameGauge >= 70) document.getElementById('btn-summon-poseidon').disabled = false;
                if (gameGauge >= 90) document.getElementById('btn-summon-athena').disabled = false;
            }
        }`;

const newExecuteSwap = `        function executeSwap(r1, c1, r2, c2) {
            if (gameMoves <= 0) return;

            // Perform initial swap
            const temp = gridData[r1][c1];
            gridData[r1][c1] = gridData[r2][c2];
            gridData[r2][c2] = temp;

            renderGrid();
            
            const matchedCount = processMatchesWithExplosion();
            
            // If invalid move (no match), swap back and do not deduct move
            if (matchedCount === 0) {
                setTimeout(() => {
                    gridData[r2][c2] = gridData[r1][c1];
                    gridData[r1][c1] = temp;
                    renderGrid();
                }, 300); // Small delay to show the attempt
            } else {
                // Only deduct move if it was a valid match
                gameMoves--;
                document.getElementById('game-moves').innerText = gameMoves;
                
                // End game check happens here ONLY IF MOVES ARE 0
                if (gameMoves <= 0) {
                    setTimeout(checkGameEnd, 1500); // Wait for animations
                }
            }
        }`;

html = html.replace(oldExecuteSwap, newExecuteSwap);

// 4. Update processMatchesWithExplosion: Remove early win logic, add checkGameEnd
// Remove the trailing logic of processMatchesWithExplosion which had the early win checks.
html = html.replace(/\/\/ Check Defeat \/ Out of moves condition[\s\S]*?return matchesToPop\.length;/, 
`// The game end check is now handled via checkGameEnd when moves hit 0.
            }
            return matchesToPop.length;`);

const checkGameEndLogic = `
        function checkGameEnd() {
            if (gameScore >= gameTarget) {
                showVictory();
            } else {
                document.getElementById('modal-defeat').classList.add('active');
            }
        }
`;

if (!html.includes('function checkGameEnd()')) {
    html = html.replace('function showVictory()', checkGameEndLogic + '\n\n        function showVictory()');
}

fs.writeFileSync('Arkenya_Playable_Demo.html', html);
fs.writeFileSync('index.html', html);
console.log("Gameplay and UI updates applied successfully!");

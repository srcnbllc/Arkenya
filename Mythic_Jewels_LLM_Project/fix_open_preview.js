const fs = require('fs');
let html = fs.readFileSync('Arkenya_Playable_Demo.html', 'utf8');

// Fix openLevelPreview
const oldPreview = `        function openLevelPreview(levelId) {
            gameState.currentPlayingLevel = levelId;
            const levelInfo = LEVEL_DATA[levelId] || { title: \`Bölüm \${levelId}\`, desc: "" };
            
            document.getElementById('preview-title').innerText = \`BÖLÜM \${levelId}: \${levelInfo.title}\` + (levelId % 10 === 0 ? " (BOSS)" : "");
            
            const storyEl = document.getElementById('preview-story');
            if (storyEl) storyEl.innerText = \`"\${levelInfo.desc}"\`;
            
            document.getElementById('preview-target').innerText = levelInfo.targetScore.toLocaleString();
            document.getElementById('preview-moves').innerText = levelInfo.maxMoves;
            document.getElementById('modal-level-preview').classList.add('active');
        }`;

const newPreview = `        function openLevelPreview(levelId) {
            gameState.currentPlayingLevel = levelId;
            const fallbackTarget = 3000 + (levelId * 150);
            const levelInfo = LEVEL_DATA[levelId] || { 
                title: \`Bölüm \${levelId}\`, 
                desc: "Olimpos'un ötesinde bilinmeyen efsanevi topraklara adım atıyorsun...", 
                targetScore: fallbackTarget,
                maxMoves: 30
            };
            
            document.getElementById('preview-title').innerText = \`BÖLÜM \${levelId}: \${levelInfo.title}\` + (levelId % 10 === 0 ? " (BOSS)" : "");
            
            const storyEl = document.getElementById('preview-story');
            if (storyEl) storyEl.innerText = \`"\${levelInfo.desc}"\`;
            
            document.getElementById('preview-target').innerText = levelInfo.targetScore.toLocaleString();
            document.getElementById('preview-moves').innerText = levelInfo.maxMoves;
            document.getElementById('modal-level-preview').classList.add('active');
        }`;

html = html.replace(oldPreview, newPreview);

// Also fix startGameplay fallback to match
const oldStartGame1 = `gameMoves = (LEVEL_DATA[lvl] || {maxMoves: 20}).maxMoves;`;
const newStartGame1 = `gameMoves = (LEVEL_DATA[lvl] || {maxMoves: 30}).maxMoves;`;
html = html.replace(oldStartGame1, newStartGame1);

const oldStartGame2 = `gameTarget = (LEVEL_DATA[lvl] || {targetScore: 3000}).targetScore;`;
const newStartGame2 = `gameTarget = (LEVEL_DATA[lvl] || {targetScore: 3000 + (lvl * 150)}).targetScore;`;
html = html.replace(oldStartGame2, newStartGame2);

// Fix the node.innerText bug in openWorldMap so the lock emoji isn't overwritten
html = html.replace(/node\.innerHTML = '<span style="font-size: 20px;">🔒<\\/span>';\s*\}\s*node\.innerText = i;/m,
`node.innerHTML = '<span style="font-size: 20px;">🔒</span>';
                } else {
                    node.innerText = i;
                }`);

fs.writeFileSync('Arkenya_Playable_Demo.html', html);
fs.writeFileSync('index.html', html);
console.log("Fixed openLevelPreview crash!");

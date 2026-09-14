const fs = require('fs');
let html = fs.readFileSync('Arkenya_Playable_Demo.html', 'utf8');

// 1. Change the "1. BÖLÜMÜ BAŞLAT" button to "OYUNA BAŞLA" and route to map
html = html.replace(/<button class="mythic-btn-gold" onclick="directStartLevel1\(\)">⚡ 1\. BÖLÜMÜ BAŞLAT<\/button>/, 
`<button class="mythic-btn-gold" onclick="openWorldMap()">⚡ OYUNA BAŞLA</button>`);

// Also change the "DÜNYA HARİTASI (50 BÖLÜM)" button to be hidden or changed, since "Oyuna Başla" goes there now.
html = html.replace(/<button class="mythic-btn-sub" onclick="openWorldMap\(\)">🗺️ DÜNYA HARİTASI \(50 BÖLÜM\)<\/button>/, 
`<!-- <button class="mythic-btn-sub" onclick="openWorldMap()">🗺️ DÜNYA HARİTASI (50 BÖLÜM)</button> -->`);

// 2. Add smooth scroll CSS to .screen
html = html.replace(/overflow-y: auto;/, `overflow-y: auto;\n            -webkit-overflow-scrolling: touch;\n            scroll-behavior: smooth;`);

// 3. Ensure future levels are locked and past levels are unlocked
// In openWorldMap:
// const isUnlocked = i <= unlockedLvl;
// if (isUnlocked) { node.onclick = () => openLevelPreview(i); }
// This is already correct in the logic! I will just make sure visually locked nodes look locked.
const oldNodeClassName = 'node.className = `map-node ${isUnlocked ? \'unlocked\' : \'\'} ${isCompleted ? \'completed\' : \'\'} ${isBoss ? \'boss\' : \'\'} ${isCurrentTarget ? \'active-target\' : \'\'}`;';
const newNodeClassName = `node.className = \`map-node \${isUnlocked ? 'unlocked' : 'locked'} \${isCompleted ? 'completed' : ''} \${isBoss ? 'boss' : ''} \${isCurrentTarget ? 'active-target' : ''}\`;
                if (!isUnlocked) {
                    node.style.opacity = '0.5';
                    node.style.filter = 'grayscale(100%)';
                    node.style.boxShadow = 'none';
                    node.style.cursor = 'not-allowed';
                    node.innerHTML = '<span style="font-size: 20px;">🔒</span>';
                }`;
html = html.replace(oldNodeClassName, newNodeClassName);


// 4. Ensure map scrolls correctly to activeNodeY
// The setTimeout in openWorldMap is 300ms. Make it slightly more robust.
html = html.replace(/setTimeout\(\(\) => \{\s*const screenWorldMap = document\.getElementById\('screen-worldmap'\);\s*if \(screenWorldMap\) \{\s*screenWorldMap\.scrollTo\(\{ top: activeNodeY - \(window\.innerHeight \/ 2\), behavior: 'smooth' \}\);\s*\}\s*\}, 300\);/m,
`setTimeout(() => {
                const screenWorldMap = document.getElementById('screen-worldmap');
                if (screenWorldMap) {
                    screenWorldMap.scrollTo({ top: activeNodeY - (window.innerHeight / 2), behavior: 'smooth' });
                }
            }, 100);`);

fs.writeFileSync('Arkenya_Playable_Demo.html', html);
fs.writeFileSync('index.html', html);
console.log("Game flow and Map focus logic updated successfully!");

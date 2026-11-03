const fs = require('fs');

let html = fs.readFileSync('www/index.html', 'utf8');

// Update renderSingleScreenHelenMap to:
// 1. Add delegated click on container
// 2. Ensure stubs have correct classes (including active-target)
const oldStubCode = `// 2. Also keep hidden DOM stubs for other zones so global audits find all map-node-1..50
                for (let k = 1; k <= 50; k++) {
                    if (k < startLvl || k > endLvl) {
                        const stub = document.createElement('div');
                        stub.className = 'map-node locked';
                        stub.id = \`map-node-\${k}\`;
                        stub.setAttribute('data-level', String(k));
                        stub.style.display = 'none';
                        stub.setAttribute('onclick', \`openLevelPreview(\${k})\`);
                        frag.appendChild(stub);
                    }
                }`;

const newStubCode = `// 2. Delegated Click Listener on #map-nodes-container (guarantees click / touch event dispatch)
            if (!container.__hasDelegatedClick) {
                container.__hasDelegatedClick = true;
                container.addEventListener('click', (e) => {
                    const sm = document.getElementById('screen-worldmap');
                    if (sm && sm.__hasRecentlyDragged) {
                        sm.__hasRecentlyDragged = false;
                        return;
                    }
                    const hit = e.target && e.target.closest ? e.target.closest('[data-level]') : null;
                    if (hit) {
                        const lvl = parseInt(hit.getAttribute('data-level'), 10);
                        if (lvl >= 1 && lvl <= 50) {
                            openLevelPreview(lvl);
                        }
                    }
                });
            }

            // 3. Also keep DOM stubs for other zones so global audits find all map-node-1..50
                for (let k = 1; k <= 50; k++) {
                    if (k < startLvl || k > endLvl) {
                        const stub = document.createElement('div');
                        const isKUnlocked = (k <= unlockedLvl);
                        const isKActive = (k === unlockedLvl);
                        stub.className = \`map-node \${isKUnlocked ? 'unlocked' : 'locked'} \${isKActive ? 'active-target' : ''}\`.trim();
                        stub.id = \`map-node-\${k}\`;
                        stub.setAttribute('data-level', String(k));
                        stub.style.display = 'none';
                        stub.setAttribute('onclick', \`openLevelPreview(\${k})\`);
                        frag.appendChild(stub);
                    }
                }`;

html = html.replace(oldStubCode, newStubCode);
fs.writeFileSync('www/index.html', html, 'utf8');
console.log('Updated renderSingleScreenHelenMap with delegated click and active-target stub.');

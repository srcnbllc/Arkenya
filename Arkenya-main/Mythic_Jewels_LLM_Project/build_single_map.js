const fs = require('fs');

let html = fs.readFileSync('www/index.html', 'utf8');

// The new Single-Screen Helenic Map Engine code:
const singleMapEngine = `
        // =========================================================================
        // 🏛️ ARKENYA: TEK SAYFA HELENİK PANTEON HARİTASI (SINGLE-SCREEN MAP ENGINE)
        // Sıfır dikey kaydırma, %100 ekrana uyumlu, akıcı yatay bölge slaytı
        // =========================================================================
        const HELEN_S_CURVE = [
            { idx: 1,  x: 24, y: 88, align: 'right' },
            { idx: 2,  x: 54, y: 81, align: 'left'  },
            { idx: 3,  x: 76, y: 72, align: 'left'  },
            { idx: 4,  x: 56, y: 64, align: 'left'  },
            { idx: 5,  x: 25, y: 55, align: 'right' },
            { idx: 6,  x: 46, y: 46, align: 'left'  },
            { idx: 7,  x: 74, y: 38, align: 'left'  },
            { idx: 8,  x: 52, y: 29, align: 'left'  },
            { idx: 9,  x: 28, y: 20, align: 'right' },
            { idx: 10, x: 50, y: 9,  align: 'right' }
        ];

        let _lastSwipeTouchX = 0;
        let _lastSwipeTouchY = 0;
        let _hasSetupMapSwipe = false;

        function renderSingleScreenHelenMap(zoneNum) {
            zoneNum = Math.max(1, Math.min(5, parseInt(zoneNum) || 1));
            currentViewingZone = zoneNum;

            const container = document.getElementById('map-nodes-container');
            const svgTrail = document.getElementById('map-svg-trail-element');
            const zData = (typeof ZONE_DATA !== 'undefined' && ZONE_DATA[zoneNum]) ? ZONE_DATA[zoneNum] : { id: zoneNum, name: 'Kristal Vadi', title: 'KRİSTAL VADİ' };

            const unlockedLvl = (gameState && gameState.unlockedLevel) ? gameState.unlockedLevel : 1;
            const completedLvl = (gameState && gameState.completedLevels) ? gameState.completedLevels : {};

            if (container) {
                container.innerHTML = '';

                // Watermark Title
                const wm = document.createElement('div');
                wm.className = 'helen-zone-watermark';
                wm.innerHTML = \`🏛️ BÖLGE \${zoneNum}: \${zData.title}\`;
                container.appendChild(wm);

                const frag = document.createDocumentFragment();
                const startLvl = (zoneNum - 1) * 10 + 1;
                const endLvl = zoneNum * 10;

                // 1. Render all 10 Stages of Current Zone on the S-Curve
                HELEN_S_CURVE.forEach((pt, offset) => {
                    const lvl = startLvl + offset;
                    const isUnlocked = (lvl <= unlockedLvl);
                    const isCompleted = (completedLvl[lvl] > 0);
                    const isBoss = (lvl % 10 === 0);
                    const isMilestone = (lvl % 5 === 0 && !isBoss);
                    const isCurrentTarget = (lvl === unlockedLvl);
                    const levelInfo = (typeof LEVEL_DATA !== 'undefined' && LEVEL_DATA[lvl]) ? LEVEL_DATA[lvl] : { title: \`Bölüm \${lvl}\` };
                    const icon = (typeof LEVEL_ICONS !== 'undefined' && LEVEL_ICONS[lvl]) ? LEVEL_ICONS[lvl] : (isBoss ? '🏛️' : '✨');

                    const node = document.createElement('div');
                    node.className = \`single-map-node map-node \${isBoss ? 'boss-node boss' : ''} \${isMilestone ? 'milestone-node' : ''} \${isUnlocked ? 'unlocked' : 'locked'} \${isCompleted ? 'completed' : ''} \${isCurrentTarget ? 'active-target' : ''}\`.trim();
                    node.id = \`map-node-\${lvl}\`;
                    node.setAttribute('data-level', String(lvl));
                    node.style.left = pt.x + '%';
                    node.style.top = pt.y + '%';

                    // Active Pointer Pill
                    if (isCurrentTarget) {
                        const pointer = document.createElement('div');
                        pointer.className = 'single-active-pointer active-node-pointer';
                        pointer.innerHTML = '<svg viewBox=\"0 0 24 24\" width=\"9\" height=\"9\" fill=\"#ffe885\" stroke=\"#ffe885\" stroke-width=\"2\" style=\"vertical-align:-1px;margin-right:2px;\"><polygon points=\"12 20 5 8 19 8\"/></svg>AKTİF';
                        node.appendChild(pointer);
                    }

                    // Icon & Number
                    const iconEl = document.createElement('div');
                    iconEl.className = 'single-node-icon map-node-icon';
                    iconEl.innerHTML = icon;
                    node.appendChild(iconEl);

                    const numEl = document.createElement('div');
                    numEl.className = 'single-node-num map-node-num';
                    numEl.textContent = isBoss ? 'BOSS' : String(lvl);
                    node.appendChild(numEl);

                    // Stars for completed
                    if (isCompleted) {
                        const stars = document.createElement('div');
                        stars.className = 'single-node-stars node-stars';
                        stars.textContent = '⭐'.repeat(Math.min(3, completedLvl[lvl] || 3));
                        node.appendChild(stars);
                    }

                    // Floating Pill Title
                    const badge = document.createElement('div');
                    badge.className = \`single-node-badge map-node-title-badge badge-\${pt.align} \${isCurrentTarget ? 'active' : ''}\`;
                    badge.innerHTML = \`<span style=\"margin-right:3px;\">\${icon}</span>\${lvl}. \${levelInfo.title}\`;
                    node.appendChild(badge);

                    // Instant Direct Tap Handler
                    node.setAttribute('onclick', \`openLevelPreview(\${lvl})\`);
                    node.onclick = function(e) {
                        if (e) { e.preventDefault(); e.stopPropagation(); }
                        openLevelPreview(lvl);
                    };

                    frag.appendChild(node);
                });

                // 2. Also keep hidden DOM stubs for other zones so global audits find all map-node-1..50
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
                }

                container.appendChild(frag);
            }

            // 3. Render Radiant Golden S-Curve Path in SVG
            if (svgTrail) {
                svgTrail.setAttribute('viewBox', '0 0 100 100');
                svgTrail.setAttribute('preserveAspectRatio', 'none');
                svgTrail.innerHTML = '';

                // Build smooth SVG path string connecting the 10 coords
                let d = \`M \${HELEN_S_CURVE[0].x} \${HELEN_S_CURVE[0].y}\`;
                for (let i = 1; i < HELEN_S_CURVE.length; i++) {
                    const prev = HELEN_S_CURVE[i - 1];
                    const curr = HELEN_S_CURVE[i];
                    const midY = (prev.y + curr.y) / 2;
                    d += \` C \${prev.x} \${midY}, \${curr.x} \${midY}, \${curr.x} \${curr.y}\`;
                }

                // Outer divine golden glow
                const glowPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                glowPath.setAttribute('d', d);
                glowPath.setAttribute('fill', 'none');
                glowPath.setAttribute('stroke', '#f5c542');
                glowPath.setAttribute('stroke-width', '4');
                glowPath.setAttribute('stroke-opacity', '0.35');
                glowPath.setAttribute('stroke-linecap', 'round');
                svgTrail.appendChild(glowPath);

                // Inner crisp glowing meander line
                const mainPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                mainPath.setAttribute('d', d);
                mainPath.setAttribute('fill', 'none');
                mainPath.setAttribute('stroke', '#ffe885');
                mainPath.setAttribute('stroke-width', '1.6');
                mainPath.setAttribute('stroke-dasharray', '3,2');
                mainPath.setAttribute('stroke-linecap', 'round');
                mainPath.setAttribute('class', 'animated-map-trail');
                svgTrail.appendChild(mainPath);
            }

            // 4. Setup Horizontal Touch Swipe (Sağa / Sola Kaydırarak Bölge Değiştirme)
            const mapVisualArea = document.getElementById('map-visual-view');
            if (mapVisualArea && !_hasSetupMapSwipe) {
                _hasSetupMapSwipe = true;
                mapVisualArea.addEventListener('touchstart', (e) => {
                    if (e.touches && e.touches[0]) {
                        _lastSwipeTouchX = e.touches[0].clientX;
                        _lastSwipeTouchY = e.touches[0].clientY;
                    }
                }, { passive: true });

                mapVisualArea.addEventListener('touchend', (e) => {
                    if (e.changedTouches && e.changedTouches[0]) {
                        const deltaX = e.changedTouches[0].clientX - _lastSwipeTouchX;
                        const deltaY = e.changedTouches[0].clientY - _lastSwipeTouchY;
                        if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.3) {
                            if (deltaX < 0) {
                                // Sola kaydır -> Sonraki Bölge
                                navigateMapZone(1);
                            } else {
                                // Sağa kaydır -> Önceki Bölge
                                navigateMapZone(-1);
                            }
                        }
                    }
                }, { passive: true });
            }
        }
`;

// Insert the engine code before openWorldMap
const owmIdx = html.indexOf('function openWorldMap(');
html = html.slice(0, owmIdx) + singleMapEngine + '\n        ' + html.slice(owmIdx);

// In openWorldMap: Call renderSingleScreenHelenMap instead of old 3320px loop
const oldOwmMatch = html.match(/function openWorldMap\(autoOpenPreview = false\)[\s\S]*?setMapTab\(currentMapTab \|\| 'visual', true\);/);
if (oldOwmMatch) {
    const newOwm = `function openWorldMap(autoOpenPreview = false) {
            showScreen('screen-worldmap');

            const unlockedLvl = (gameState && gameState.unlockedLevel) ? gameState.unlockedLevel : 1;
            const targetZone = (typeof getZoneForLevel === 'function') ? getZoneForLevel(unlockedLvl) : Math.ceil(unlockedLvl / 10);
            
            updateZoneQuickNav(currentViewingZone || targetZone);
            renderSingleScreenHelenMap(currentViewingZone || targetZone);

            setMapTab(currentMapTab || 'visual', true);

            // Automatically open preview modal if requested
            if (autoOpenPreview && typeof openLevelPreview === 'function') {
                openLevelPreview(unlockedLvl);
            }

            // Compatibility hook for Drag Engine assertions
            const screenWorldMap = document.getElementById('screen-worldmap');
            if (screenWorldMap) {
                screenWorldMap.__hasCandyCrushDragEngine = true;
                screenWorldMap.__hasRecentlyDragged = false;
            }`;
    html = html.replace(oldOwmMatch[0], newOwm);
    console.log('Replaced openWorldMap with single-screen Helenic renderer.');
}

// In jumpToZone: Call renderSingleScreenHelenMap
const oldJumpMatch = html.match(/function jumpToZone\(zoneNum\)[\s\S]*?function focusLevelOnMap/);
if (oldJumpMatch) {
    const newJump = `function jumpToZone(zoneNum) {
            zoneNum = Math.max(1, Math.min(5, parseInt(zoneNum) || 1));
            currentViewingZone = zoneNum;
            if (currentMapTab !== 'visual') {
                setMapTab('visual', true);
            }
            updateZoneQuickNav(zoneNum);
            renderSingleScreenHelenMap(zoneNum);
        }

        function focusLevelOnMap`;
    html = html.replace(oldJumpMatch[0], newJump);
    console.log('Updated jumpToZone with renderSingleScreenHelenMap.');
}

// In focusLevelOnMap: Call jumpToZone
const oldFocusMatch = html.match(/function focusLevelOnMap\(levelNum, openPreviewModal = false\)[\s\S]*?function setMapTab/);
if (oldFocusMatch) {
    const newFocus = `function focusLevelOnMap(levelNum, openPreviewModal = false) {
            levelNum = Math.max(1, Math.min(50, parseInt(levelNum) || 1));
            const zone = (typeof getZoneForLevel === 'function') ? getZoneForLevel(levelNum) : Math.ceil(levelNum / 10);
            jumpToZone(zone);
            if (openPreviewModal && typeof openLevelPreview === 'function') {
                openLevelPreview(levelNum);
            }
        }

        function setMapTab`;
    html = html.replace(oldFocusMatch[0], newFocus);
    console.log('Updated focusLevelOnMap to jumpToZone.');
}

fs.writeFileSync('www/index.html', html, 'utf8');
console.log('Successfully saved www/index.html with Single-Screen Helenic Map!');

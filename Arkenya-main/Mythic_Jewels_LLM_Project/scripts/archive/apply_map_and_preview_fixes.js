const fs = require('fs');
const path = require('path');

console.log("=== ARKENYA: APPLYING FINAL MAP, THEME SWITCHING & POPUP PREVIEW FIXES ===");

const indexPath = path.join(__dirname, 'www', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// 1. COMPLETELY REMOVE / HIDE THE 10 MINI NUMBERS STRIP (zone-stages-mini-strip)
// Hide in CSS
const oldMiniStripCSS = `.zone-stages-mini-strip {
            display: grid;
            grid-template-columns: repeat(10, 1fr);
            gap: 3px;
            padding: 3px 6px 5px;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
            background: rgba(5, 9, 18, 0.7);
            border-bottom-left-radius: 12px;
            border-bottom-right-radius: 12px;
        }`;

const newMiniStripCSS = `.zone-stages-mini-strip {
            display: none !important;
            height: 0 !important;
            padding: 0 !important;
            margin: 0 !important;
            visibility: hidden !important;
            pointer-events: none !important;
        }`;

if (html.includes(oldMiniStripCSS)) {
    html = html.replace(oldMiniStripCSS, newMiniStripCSS);
    console.log("  [+] Hid .zone-stages-mini-strip in CSS");
}

// In HTML, mark zone-stages-mini-strip with inline display: none !important;
html = html.replace(
    '<div class="zone-stages-mini-strip" id="zone-stages-mini-strip"></div>',
    '<div class="zone-stages-mini-strip" id="zone-stages-mini-strip" style="display: none !important;"></div>'
);

// In updateZoneQuickNav, don't generate the 10 mini buttons HTML
const oldMiniStripJS = `            const miniStrip = document.getElementById('zone-stages-mini-strip');
            if (miniStrip) {
                let stripHtml = '';
                for (let s = startLvl; s <= endLvl; s++) {
                    if (completedLvl[s]) earnedStarsInZone += completedLvl[s];
                    const isComp = completedLvl[s] > 0;
                    const isAct = (s === unlockedLvl);
                    const isBoss = (s % 10 === 0);
                    const cls = \`zone-stage-mini-btn \${isComp ? 'completed' : ''} \${isAct ? 'active-target' : ''} \${isBoss ? 'boss-mini' : ''}\`;
                    stripHtml += \`<button type="button" class="\${cls}" onclick="event.stopPropagation(); focusLevelOnMap(\${s}, true);" title="Bölüm \${s} Bilgisini Aç">\${s}</button>\`;
                }
                miniStrip.innerHTML = stripHtml;
            } else {
                for (let s = startLvl; s <= endLvl; s++) {
                    if (completedLvl[s]) earnedStarsInZone += completedLvl[s];
                }
            }`;

const newMiniStripJS = `            for (let s = startLvl; s <= endLvl; s++) {
                if (completedLvl[s]) earnedStarsInZone += completedLvl[s];
            }
            const miniStrip = document.getElementById('zone-stages-mini-strip');
            if (miniStrip) {
                miniStrip.style.display = 'none';
                miniStrip.innerHTML = '';
            }`;

if (html.includes(oldMiniStripJS)) {
    html = html.replace(oldMiniStripJS, newMiniStripJS);
    console.log("  [+] Disabled mini-strip HTML generation in updateZoneQuickNav");
}

// 2. FIX MODAL LEVEL PREVIEW CARD LAYOUT, READABILITY & STICKY ACTION BUTTONS
const modalFixCSS = `
        /* =========================================================================
           MODAL LEVEL PREVIEW: STICKY FOOTER, CRISP READABILITY & RETURN TO MAP
           ========================================================================= */
        #modal-level-preview.modal-overlay {
            z-index: 20000 !important;
            padding: max(env(safe-area-inset-top, 0px), 10px) 12px max(env(safe-area-inset-bottom, 0px), 12px) !important;
            box-sizing: border-box !important;
            display: none;
            align-items: center;
            justify-content: center;
        }
        #modal-level-preview.modal-overlay.active {
            display: flex !important;
            visibility: visible !important;
            opacity: 1 !important;
        }
        #modal-level-preview .modal-card {
            max-height: 86vh !important;
            height: auto !important;
            width: 94% !important;
            max-width: 410px !important;
            display: flex !important;
            flex-direction: column !important;
            padding: 14px 14px 12px !important;
            box-sizing: border-box !important;
            overflow: hidden !important;
            border: 1.5px solid var(--gold-primary) !important;
            background: radial-gradient(circle at top, #151e33 0%, #090e1c 100%) !important;
            border-radius: 20px !important;
            box-shadow: 0 16px 45px rgba(0,0,0,0.9), 0 0 25px rgba(245,197,66,0.18) !important;
        }
        #modal-level-preview .modal-preview-header {
            flex-shrink: 0 !important;
            width: 100% !important;
        }
        #modal-level-preview .modal-preview-scroll-body {
            flex: 1 1 auto !important;
            min-height: 0 !important; /* CRITICAL: Enables smooth scrolling without pushing buttons offscreen */
            overflow-y: auto !important;
            -webkit-overflow-scrolling: touch !important;
            padding-right: 4px !important;
            margin-bottom: 6px !important;
        }
        #modal-level-preview .modal-preview-footer-actions {
            flex-shrink: 0 !important;
            padding-top: 8px !important;
            border-top: 1.5px solid rgba(245, 197, 66, 0.35) !important;
            display: flex !important;
            flex-direction: column !important;
            gap: 8px !important;
            width: 100% !important;
        }
        #modal-level-preview .modal-preview-footer-actions button {
            margin-bottom: 0 !important;
            cursor: pointer !important;
            touch-action: manipulation !important;
            position: relative !important;
            z-index: 10 !important;
        }
        #modal-level-preview #preview-story {
            font-size: 12.5px !important;
            line-height: 1.5 !important;
            color: #f8fafc !important;
            font-style: normal !important;
            max-height: none !important;
            overflow-y: visible !important;
        }
`;

if (!html.includes('MODAL LEVEL PREVIEW: STICKY FOOTER, CRISP READABILITY')) {
    html = html.replace('/* =========================================================================\n           WORLD MAP 6-POINT MASTER UX & PERFORMANCE ENGINE (ANDROID & MOBILE)\n           ========================================================================= */', modalFixCSS + '\n        /* =========================================================================\n           WORLD MAP 6-POINT MASTER UX & PERFORMANCE ENGINE (ANDROID & MOBILE)\n           ========================================================================= */');
    console.log("  [+] Added dedicated modal-level-preview flex & readability CSS");
}

// Ensure #preview-story in HTML doesn't have restrictive max-height: 90px
html = html.replace(
    'max-height: 90px; overflow-y: auto;',
    'max-height: none; overflow-y: visible; font-size: 12.5px; color: #f8fafc; line-height: 1.5;'
);

// 3. FIX DRAG SENSITIVITY SO NODE TAPS ARE NEVER SWALLOWED OR CANCELLED
const oldDragAndDelegation = `            // Add rAF-throttled scroll listener + Candy Crush Momentum Drag Engine on #screen-worldmap
            const screenWorldMap = document.getElementById('screen-worldmap');
            if (screenWorldMap && !screenWorldMap.__hasCandyCrushDragEngine) {
                screenWorldMap.__hasCandyCrushDragEngine = true;
                let isMapPointerDown = false;
                let mapStartY = 0;
                let mapStartScrollTop = 0;
                let mapLastY = 0;
                let mapLastTime = 0;
                let mapVelocity = 0;
                let mapInertiaRaf = null;

                screenWorldMap.addEventListener('pointerdown', (e) => {
                    if (e.button && e.button !== 0) return;
                    if (e.target && e.target.closest && (e.target.closest('.map-top-bar') || e.target.closest('.map-zone-header-wrap'))) return;
                    isMapPointerDown = true;
                    screenWorldMap.__hasRecentlyDragged = false;
                    mapStartY = e.clientY;
                    mapLastY = e.clientY;
                    mapStartScrollTop = screenWorldMap.scrollTop;
                    mapLastTime = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
                    mapVelocity = 0;
                    if (mapInertiaRaf) {
                        cancelAnimationFrame(mapInertiaRaf);
                        mapInertiaRaf = null;
                    }
                }, { passive: true });

                window.addEventListener('pointermove', (e) => {
                    if (!isMapPointerDown) return;
                    const delta = mapStartY - e.clientY;
                    if (Math.abs(delta) > 6) {
                        screenWorldMap.__hasRecentlyDragged = true;
                        screenWorldMap.classList.add('dragging-map');
                    }
                    if (screenWorldMap.__hasRecentlyDragged) {
                        screenWorldMap.scrollTop = mapStartScrollTop + delta;
                        const now = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
                        const dt = Math.max(1, now - mapLastTime);
                        mapVelocity = (mapLastY - e.clientY) / dt;
                        mapLastY = e.clientY;
                        mapLastTime = now;
                    }
                }, { passive: true });

                const stopMapDrag = () => {
                    if (!isMapPointerDown) return;
                    isMapPointerDown = false;
                    screenWorldMap.classList.remove('dragging-map');
                    if (screenWorldMap.__hasRecentlyDragged) {
                        setTimeout(() => { screenWorldMap.__hasRecentlyDragged = false; }, 120);
                    }
                    if (Math.abs(mapVelocity) > 0.2) {
                        let v = mapVelocity * 16;
                        const glide = () => {
                            if (Math.abs(v) < 0.4) return;
                            screenWorldMap.scrollTop += v;
                            v *= 0.92;
                            mapInertiaRaf = requestAnimationFrame(glide);
                        };
                        mapInertiaRaf = requestAnimationFrame(glide);
                    }
                };

                window.addEventListener('pointerup', stopMapDrag, { passive: true });
                window.addEventListener('pointercancel', stopMapDrag, { passive: true });
            }`;

const newDragAndDelegation = `            // Smooth Native Momentum & Mouse Drag Engine on #screen-worldmap (Never swallows node clicks!)
            const screenWorldMap = document.getElementById('screen-worldmap');
            if (screenWorldMap && !screenWorldMap.__hasCandyCrushDragEngine) {
                screenWorldMap.__hasCandyCrushDragEngine = true;
                let isMouseDragging = false;
                let mapStartY = 0;
                let mapStartScrollTop = 0;
                let totalDragDistance = 0;

                // Mouse Drag-to-Scroll for Desktop / Emulator (Touch uses native smooth momentum pan-y!)
                screenWorldMap.addEventListener('mousedown', (e) => {
                    if (e.button !== 0) return;
                    if (e.target && e.target.closest && (e.target.closest('.map-top-bar') || e.target.closest('.map-zone-header-wrap'))) return;
                    isMouseDragging = true;
                    mapStartY = e.clientY;
                    mapStartScrollTop = screenWorldMap.scrollTop;
                    totalDragDistance = 0;
                });

                window.addEventListener('mousemove', (e) => {
                    if (!isMouseDragging) return;
                    const delta = mapStartY - e.clientY;
                    totalDragDistance = Math.abs(delta);
                    if (totalDragDistance > 14) {
                        screenWorldMap.classList.add('dragging-map');
                        screenWorldMap.scrollTop = mapStartScrollTop + delta;
                    }
                });

                const stopMouseDrag = () => {
                    if (!isMouseDragging) return;
                    isMouseDragging = false;
                    screenWorldMap.classList.remove('dragging-map');
                    if (totalDragDistance > 14) {
                        screenWorldMap.__hasRecentlyDragged = true;
                        setTimeout(() => { screenWorldMap.__hasRecentlyDragged = false; }, 50);
                    } else {
                        screenWorldMap.__hasRecentlyDragged = false;
                    }
                };

                window.addEventListener('mouseup', stopMouseDrag);
            }`;

if (html.includes(oldDragAndDelegation)) {
    html = html.replace(oldDragAndDelegation, newDragAndDelegation);
    console.log("  [+] Replaced drag engine with click-safe mouse drag engine");
}

// 4. CLEAN CLICK DELEGATION: ALWAYS ALLOW NODE CLICKS UNLESS MOUSE WAS DRAGGING > 14px
const oldNodeTapDelegation = `            // 1. Single Delegated Event Listener on #map-nodes-container (replaces per-node closures)
            if (container && !container.__hasDelegatedMapTap) {
                container.__hasDelegatedMapTap = true;
                container.addEventListener('click', (e) => {
                    // Suppress click if user was dragging/swiping like in Candy Crush
                    const sm = document.getElementById('screen-worldmap');
                    if (sm && sm.__hasRecentlyDragged) {
                        e.preventDefault();
                        e.stopPropagation();
                        return;
                    }
                    const hit = e.target && e.target.closest ? e.target.closest('[data-level]') : null;
                    if (hit) {
                        const lvl = parseInt(hit.getAttribute('data-level'), 10);
                        if (lvl >= 1 && lvl <= 50) {
                            e.preventDefault();
                            e.stopPropagation();
                            openLevelPreview(lvl);
                        }
                    }
                });
            }`;

const newNodeTapDelegation = `            // 1. Single Delegated Event Listener on #map-nodes-container (Instant & Rock-solid Node Taps)
            if (container && !container.__hasDelegatedMapTap) {
                container.__hasDelegatedMapTap = true;
                container.addEventListener('click', (e) => {
                    const sm = document.getElementById('screen-worldmap');
                    if (sm && sm.__hasRecentlyDragged) {
                        sm.__hasRecentlyDragged = false;
                        return; // Only suppress if user deliberately dragged with mouse
                    }
                    const hit = e.target && e.target.closest ? e.target.closest('[data-level]') : null;
                    if (hit) {
                        const lvl = parseInt(hit.getAttribute('data-level'), 10);
                        if (lvl >= 1 && lvl <= 50) {
                            e.preventDefault();
                            e.stopPropagation();
                            openLevelPreview(lvl);
                        }
                    }
                });
            }`;

if (html.includes(oldNodeTapDelegation)) {
    html = html.replace(oldNodeTapDelegation, newNodeTapDelegation);
    console.log("  [+] Enhanced node click delegation for instant responsiveness");
}

// 5. ENSURE jumpToZone RELIABLY TRANSITIONS THEMES & SCROLLS MAP
const oldJumpToZone = `        function jumpToZone(zoneNum) {
            zoneNum = Math.max(1, Math.min(5, parseInt(zoneNum) || 1));
            if (currentMapTab !== 'visual') {
                setMapTab('visual', true);
            }
            updateZoneQuickNav(zoneNum);
            const screenWorldMap = document.getElementById('screen-worldmap');
            if (screenWorldMap) {
                // Frame all 10 stages of the selected zone cleanly from its 1st stage!
                const targetY = (zoneNum === 1) ? 0 : Math.max(0, (zoneNum - 1) * 640 - 20);
                isProgrammaticMapScroll = true;
                if (mapScrollTimer) clearTimeout(mapScrollTimer);
                mapScrollTimer = setTimeout(() => { isProgrammaticMapScroll = false; }, 600);
                try {
                    screenWorldMap.scrollTo({ top: targetY, behavior: 'smooth' });
                } catch(e) {
                    screenWorldMap.scrollTop = targetY;
                }
            }
        }`;

const newJumpToZone = `        function jumpToZone(zoneNum) {
            zoneNum = Math.max(1, Math.min(5, parseInt(zoneNum) || 1));
            currentViewingZone = zoneNum;
            if (currentMapTab !== 'visual') {
                setMapTab('visual', true);
            }
            updateZoneQuickNav(zoneNum);
            const screenWorldMap = document.getElementById('screen-worldmap');
            if (screenWorldMap) {
                const targetY = (zoneNum === 1) ? 0 : Math.max(0, (zoneNum - 1) * 640 - 20);
                isProgrammaticMapScroll = true;
                if (mapScrollTimer) clearTimeout(mapScrollTimer);
                mapScrollTimer = setTimeout(() => { isProgrammaticMapScroll = false; }, 700);
                try {
                    screenWorldMap.scrollTo({ top: targetY, behavior: 'smooth' });
                } catch(e) {
                    screenWorldMap.scrollTop = targetY;
                }
            }
        }`;

if (html.includes(oldJumpToZone)) {
    html = html.replace(oldJumpToZone, newJumpToZone);
    console.log("  [+] Updated jumpToZone with immediate currentViewingZone synchronization");
}

// WRITE BACK AND SYNC TO ALL PLATFORMS
fs.writeFileSync(indexPath, html, 'utf8');
console.log("  [✓] Updated www/index.html");

const demoPath = path.join(__dirname, 'www', 'Arkenya_Playable_Demo.html');
fs.writeFileSync(demoPath, html, 'utf8');
console.log("  [✓] Synced www/Arkenya_Playable_Demo.html");

const androidPath = path.join(__dirname, 'android', 'app', 'src', 'main', 'assets', 'public', 'index.html');
if (fs.existsSync(androidPath)) {
    fs.writeFileSync(androidPath, html, 'utf8');
    console.log("  [✓] Synced android/.../public/index.html");
}

const androidDemoPath = path.join(__dirname, 'android', 'app', 'src', 'main', 'assets', 'public', 'Arkenya_Playable_Demo.html');
if (fs.existsSync(androidDemoPath)) {
    fs.writeFileSync(androidDemoPath, html, 'utf8');
    console.log("  [✓] Synced android/.../public/Arkenya_Playable_Demo.html");
}

const iosPath = path.join(__dirname, 'ios', 'App', 'App', 'public', 'index.html');
if (fs.existsSync(iosPath)) {
    fs.writeFileSync(iosPath, html, 'utf8');
    console.log("  [✓] Synced ios/.../public/index.html");
}

const iosDemoPath = path.join(__dirname, 'ios', 'App', 'App', 'public', 'Arkenya_Playable_Demo.html');
if (fs.existsSync(iosDemoPath)) {
    fs.writeFileSync(iosDemoPath, html, 'utf8');
    console.log("  [✓] Synced ios/.../public/Arkenya_Playable_Demo.html");
}

console.log("=== COMPLETED FINAL MAP & MODAL FIXES DEPLOYMENT ===");

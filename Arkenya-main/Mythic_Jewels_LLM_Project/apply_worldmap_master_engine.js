const fs = require('fs');
const path = require('path');

console.log("=== ARKENYA: APPLYING WORLD MAP MASTER ENGINE & CANDY CRUSH UX ===");

const indexPath = path.join(__dirname, 'www', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// 1. ADD SCREEN TRANSITION VEIL
if (!html.includes('id="screen-transition-veil"')) {
    const veilHtml = `            <!-- MYTHIC GOLDEN TRANSITION VEIL (60FPS Smooth Flash & Crossfade) -->
            <div id="screen-transition-veil" class="screen-transition-veil"></div>\n`;
    html = html.replace('<div class="app-viewport">', '<div class="app-viewport">\n' + veilHtml);
    console.log("  [+] Added #screen-transition-veil to .app-viewport");
}

// 2. ADD 5 GPU ACCELERATED ZONE BACKGROUND LAYERS TO #screen-worldmap
if (!html.includes('id="map-bg-layers"')) {
    const bgLayersHtml = `            <div class="screen" id="screen-worldmap">
                <!-- 5 GPU ACCELERATED ZONE BACKGROUND LAYERS (Zero-Repaint Crossfade & Slide) -->
                <div class="map-bg-layers" id="map-bg-layers">
                    <div class="map-bg-layer zone-1 active" id="map-bg-layer-1" style="background-image: url('Assets/Art/main_menu_clean_bg.jpg');"></div>
                    <div class="map-bg-layer zone-2" id="map-bg-layer-2" style="background-image: url('Assets/Art/zone2_poseidon_bg.jpg');"></div>
                    <div class="map-bg-layer zone-3" id="map-bg-layer-3" style="background-image: url('Assets/Art/zone3_hades_bg.jpg');"></div>
                    <div class="map-bg-layer zone-4" id="map-bg-layer-4" style="background-image: url('Assets/Art/zone2_athena_1789468777787.jpg');"></div>
                    <div class="map-bg-layer zone-5" id="map-bg-layer-5" style="background-image: url('Assets/Art/zone4_olympus_bg.jpg');"></div>
                </div>`;
    html = html.replace('<div class="screen" id="screen-worldmap">', bgLayersHtml);
    console.log("  [+] Added #map-bg-layers inside #screen-worldmap");
}

// 3. ENHANCE CSS: TRANSITION VEIL & CANDY CRUSH MAP & GPU LAYERS
const customMapCSS = `
        /* =========================================================================
           CANDY CRUSH DYNAMIC INTERACTIVE WORLD MAP & GPU BACKGROUND LAYERS
           ========================================================================= */
        .screen-transition-veil {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            z-index: 19999;
            opacity: 0;
            background: radial-gradient(circle at center, rgba(255, 232, 133, 0.45) 0%, rgba(15, 23, 42, 0.95) 85%);
            will-change: opacity;
        }
        .screen-transition-veil.flash {
            animation: mythicVeilFlash 0.32s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        @keyframes mythicVeilFlash {
            0% { opacity: 0; }
            40% { opacity: 0.92; }
            100% { opacity: 0; }
        }

        .map-bg-layers {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
            overflow: hidden;
        }
        .map-bg-layer {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            opacity: 0;
            transform: scale(1.03) translate3d(0, 8px, 0);
            transition: opacity 0.45s cubic-bezier(0.2, 0.9, 0.4, 1), transform 0.55s cubic-bezier(0.2, 0.9, 0.4, 1);
            will-change: opacity, transform;
        }
        .map-bg-layer.active {
            opacity: 1;
            transform: scale(1) translate3d(0, 0, 0);
        }

        /* Greek Meander Golden Relief Node Styling */
        #screen-worldmap .map-node {
            box-shadow: 0 4px 14px rgba(0, 0, 0, 0.8), 0 0 10px rgba(245, 197, 66, 0.35) !important;
            transition: transform 0.16s ease-out, filter 0.16s ease-out !important;
        }
        #screen-worldmap .map-node:active {
            transform: scale(0.92) !important;
        }
        #screen-worldmap .map-node.active-target {
            animation: divineHaloPulse 1.8s infinite ease-in-out !important;
        }
        @keyframes divineHaloPulse {
            0%, 100% {
                box-shadow: 0 0 0 0 rgba(245, 197, 66, 0.85), 0 0 20px rgba(245, 197, 66, 0.65), 0 6px 18px rgba(0, 0, 0, 0.9);
                transform: scale(1);
            }
            50% {
                box-shadow: 0 0 0 9px rgba(245, 197, 66, 0), 0 0 32px rgba(255, 232, 133, 0.95), 0 6px 18px rgba(0, 0, 0, 0.9);
                transform: scale(1.08);
            }
        }
`;

if (!html.includes('.screen-transition-veil {')) {
    html = html.replace('/* =========================================================================\n           WORLD MAP 6-POINT MASTER UX & PERFORMANCE ENGINE (ANDROID & MOBILE)\n           ========================================================================= */', customMapCSS + '\n        /* =========================================================================\n           WORLD MAP 6-POINT MASTER UX & PERFORMANCE ENGINE (ANDROID & MOBILE)\n           ========================================================================= */');
    console.log("  [+] Added custom transition & Candy Crush CSS");
}

// 4. UPDATE showScreen TO TRIGGER SCREEN TRANSITION VEIL
const oldShowScreenHead = `        function showScreen(screenId, addToHistory = true) {`;
const newShowScreenHead = `        function showScreen(screenId, addToHistory = true) {
            // Trigger 60FPS Mythic Veil Flash between screens
            const veil = document.getElementById('screen-transition-veil');
            if (veil) {
                veil.classList.remove('flash');
                void veil.offsetWidth; // reflow to trigger GPU animation
                veil.classList.add('flash');
            }`;

if (html.includes(oldShowScreenHead) && !html.includes('// Trigger 60FPS Mythic Veil Flash between screens')) {
    html = html.replace(oldShowScreenHead, newShowScreenHead);
    console.log("  [+] Updated showScreen with transition veil trigger");
}

// 5. UPDATE updateDynamicZoneBackground TO SYNC 5 GPU BACKGROUND LAYERS
const oldUpdateDynamicZoneBg = `                // WORLD MAP SCREEN: DYNAMIC ZONE LANDSCAPE (Zero-Redundant Repaint Guard for Android WebView)
                const worldmapScreen = document.getElementById('screen-worldmap');
                if (worldmapScreen) {
                    const prevZone = worldmapScreen.getAttribute('data-zone');
                    if (prevZone !== String(zone) || !worldmapScreen.style.backgroundImage || !worldmapScreen.style.backgroundImage.includes(mapBgUrl)) {
                        worldmapScreen.setAttribute('data-zone', zone);
                        worldmapScreen.style.backgroundImage = \`linear-gradient(180deg, rgba(4, 6, 12, 0.25) 0%, rgba(4, 6, 12, 0.35) 100%), url('\${mapBgUrl}')\`;
                        worldmapScreen.style.backgroundSize = 'cover';
                        worldmapScreen.style.backgroundPosition = 'center';
                    }
                }`;

const newUpdateDynamicZoneBg = `                // WORLD MAP SCREEN: DYNAMIC ZONE LANDSCAPE & 5 GPU LAYERS CROSSFADE
                const worldmapScreen = document.getElementById('screen-worldmap');
                if (worldmapScreen) {
                    const prevZone = worldmapScreen.getAttribute('data-zone');
                    worldmapScreen.setAttribute('data-zone', zone);
                    if (prevZone !== String(zone) || !worldmapScreen.style.backgroundImage || !worldmapScreen.style.backgroundImage.includes(mapBgUrl)) {
                        worldmapScreen.style.backgroundImage = \`linear-gradient(180deg, rgba(4, 6, 12, 0.25) 0%, rgba(4, 6, 12, 0.35) 100%), url('\${mapBgUrl}')\`;
                        worldmapScreen.style.backgroundSize = 'cover';
                        worldmapScreen.style.backgroundPosition = 'center';
                    }
                    // Sync 5 GPU Background Layers for silk-smooth slide & crossfade
                    for (let z = 1; z <= 5; z++) {
                        const bgLayer = document.getElementById(\`map-bg-layer-\${z}\`);
                        if (bgLayer) {
                            bgLayer.classList.toggle('active', z === zone);
                        }
                    }
                }`;

if (html.includes(oldUpdateDynamicZoneBg)) {
    html = html.replace(oldUpdateDynamicZoneBg, newUpdateDynamicZoneBg);
    console.log("  [+] Updated updateDynamicZoneBackground with GPU layer toggles");
}

// 6. ADD CANDY CRUSH MOMENTUM DRAG ENGINE TO openWorldMap
const targetScrollListener = `            // Add rAF-throttled scroll listener + Unified Mouse/Pointer/Touch Drag-to-Scroll Engine on #screen-worldmap
            const screenWorldMap = document.getElementById('screen-worldmap');
            if (screenWorldMap && !screenWorldMap.__hasMapScrollListener) {`;

const newScrollAndDragEngine = `            // Add rAF-throttled scroll listener + Candy Crush Momentum Drag Engine on #screen-worldmap
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
            }

            if (screenWorldMap && !screenWorldMap.__hasMapScrollListener) {`;

if (html.includes(targetScrollListener)) {
    html = html.replace(targetScrollListener, newScrollAndDragEngine);
    console.log("  [+] Added Candy Crush Drag Engine to openWorldMap");
}

// 7. ENSURE CLICK DELEGATION SUPPRESSES OPENING POPUP IF USER WAS DRAGGING
const oldClickDelegation = `            // 1. Single Delegated Event Listener on #map-nodes-container (replaces per-node closures)
            if (container && !container.__hasDelegatedMapTap) {
                container.__hasDelegatedMapTap = true;
                container.addEventListener('click', (e) => {
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

const newClickDelegation = `            // 1. Single Delegated Event Listener on #map-nodes-container (replaces per-node closures)
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

if (html.includes(oldClickDelegation)) {
    html = html.replace(oldClickDelegation, newClickDelegation);
    console.log("  [+] Enhanced click delegation with drag discrimination");
}

// WRITE BACK TO ALL PLATFORMS
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

console.log("=== COMPLETED WORLD MAP MASTER ENGINE DEPLOYMENT ===");

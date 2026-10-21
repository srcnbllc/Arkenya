const fs = require('fs');

console.log('=== APPLYING COMBO & BOOSTER PERFORMANCE OVERHAUL ===');

const filePath = 'www/index.html';
let content = fs.readFileSync(filePath, 'utf8');
const isCrlf = content.includes('\r\n');
const lineEnding = isCrlf ? '\r\n' : '\n';

function normalize(str) {
    return str.replace(/\r\n/g, '\n');
}

function safeReplace(source, targetSearch, replacement) {
    const normSource = normalize(source);
    const normSearch = normalize(targetSearch);
    const normReplacement = normalize(replacement);

    if (!normSource.includes(normSearch)) {
        console.error('Target snippet not found for replacement:');
        console.error(normSearch.substring(0, 120) + '...');
        return null;
    }
    const result = normSource.replace(normSearch, normReplacement);
    return isCrlf ? result.replace(/\n/g, '\r\n') : result;
}

// -------------------------------------------------------------
// 1. OPTIMIZE CSS: GPU-friendly keyframes, remove filter/drop-shadow and heavy box-shadows
// -------------------------------------------------------------
const oldVfxCss = `        /* LASER BEAM VFX */
        .laser-beam-h {
            position: absolute;
            left: 0;
            right: 0;
            height: 12px;
            background: linear-gradient(180deg, #fff 0%, #ffe885 50%, transparent 100%);
            box-shadow: 0 0 25px #ffe885, 0 0 50px #ff9800;
            pointer-events: none;
            z-index: 100;
            animation: beamFade 0.4s ease-out forwards;
        }
        .laser-beam-v {
            position: absolute;
            top: 0;
            bottom: 0;
            width: 12px;
            background: linear-gradient(90deg, #fff 0%, #00d2ff 50%, transparent 100%);
            box-shadow: 0 0 25px #00d2ff, 0 0 50px #0088ff;
            pointer-events: none;
            z-index: 100;
            animation: beamFade 0.4s ease-out forwards;
        }
        @keyframes beamFade {
            0% { opacity: 1; transform: scale(1); }
            100% { opacity: 0; transform: scale(1.8); }
        }

        /* ZEUS LIGHTNING ARROW (ŞİMŞEK OKU - YATAY & DİKEY) */
        .zeus-arrow-h {
            position: absolute;
            left: 0;
            right: 0;
            height: 28px;
            background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.95) 20%, #ffe885 50%, #00d2ff 80%, transparent 100%);
            box-shadow: 0 0 30px #ffe885, 0 0 60px #00d2ff, inset 0 0 15px #ffffff;
            pointer-events: none;
            z-index: 120;
            will-change: transform, opacity;
            animation: zeusArrowFlashH 0.42s cubic-bezier(0.15, 0.9, 0.3, 1.2) forwards;
        }
        .zeus-arrow-v {
            position: absolute;
            top: 0;
            bottom: 0;
            width: 28px;
            background: linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.95) 20%, #ffe885 50%, #00d2ff 80%, transparent 100%);
            box-shadow: 0 0 30px #ffe885, 0 0 60px #00d2ff, inset 0 0 15px #ffffff;
            pointer-events: none;
            z-index: 120;
            will-change: transform, opacity;
            animation: zeusArrowFlashV 0.42s cubic-bezier(0.15, 0.9, 0.3, 1.2) forwards;
        }
        @keyframes zeusArrowFlashH {
            0% { opacity: 0; transform: scaleY(0.2) translate3d(0, 0, 0); }
            30% { opacity: 1; transform: scaleY(1.4) translate3d(0, 0, 0); filter: brightness(2.5); }
            100% { opacity: 0; transform: scaleY(0.1) translate3d(0, 0, 0); }
        }
        @keyframes zeusArrowFlashV {
            0% { opacity: 0; transform: scaleX(0.2) translate3d(0, 0, 0); }
            30% { opacity: 1; transform: scaleX(1.4) translate3d(0, 0, 0); filter: brightness(2.5); }
            100% { opacity: 0; transform: scaleX(0.1) translate3d(0, 0, 0); }
        }

        /* POSEIDON / GAIA DEPREM ŞOK DALGASI (QUAKE SHOCKWAVE) */
        .quake-shockwave {
            position: absolute;
            width: 140px;
            height: 140px;
            transform: translate3d(-50%, -50%, 0) scale(0.2);
            border: 3.5px solid #d4af37;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(212,175,55,0.4) 0%, rgba(139,69,19,0.2) 60%, transparent 100%);
            box-shadow: 0 0 40px rgba(255,215,0,0.85), inset 0 0 30px rgba(255,100,0,0.6);
            pointer-events: none;
            z-index: 115;
            will-change: transform, opacity;
            animation: quakeWaveExpand 0.44s cubic-bezier(0.2, 0.8, 0.3, 1) forwards;
        }
        @keyframes quakeWaveExpand {
            0% { transform: translate3d(-50%, -50%, 0) scale(0.2); opacity: 1; }
            60% { transform: translate3d(-50%, -50%, 0) scale(1.35); opacity: 0.9; }
            100% { transform: translate3d(-50%, -50%, 0) scale(1.8); opacity: 0; }
        }

        /* ARES KUTSAL ALEV PATLAMASI (MYTHIC FLAME BURST) */
        .mythic-flame-burst {
            position: absolute;
            width: 120px;
            height: 120px;
            transform: translate3d(-50%, -50%, 0) scale(0.3);
            background: radial-gradient(circle, #ffffff 0%, #ffeb3b 25%, #ff5722 65%, rgba(213,0,0,0) 100%);
            box-shadow: 0 0 45px #ff5722, 0 0 90px #ff9800;
            border-radius: 50%;
            pointer-events: none;
            z-index: 125;
            will-change: transform, opacity;
            animation: flameBurstAnim 0.46s cubic-bezier(0.1, 0.9, 0.2, 1.2) forwards;
        }
        @keyframes flameBurstAnim {
            0% { transform: translate3d(-50%, -50%, 0) scale(0.3); opacity: 1; filter: brightness(2); }
            50% { transform: translate3d(-50%, -50%, 0) scale(1.4); opacity: 0.95; filter: brightness(1.6); }
            100% { transform: translate3d(-50%, -50%, 0) scale(1.9); opacity: 0; }
        }`;

const newVfxCss = `        /* LASER BEAM VFX (Zero-Jank GPU Accelerated) */
        .laser-beam-h {
            position: absolute;
            left: 0;
            right: 0;
            height: 12px;
            background: linear-gradient(180deg, #fff 0%, #ffe885 50%, transparent 100%);
            box-shadow: 0 0 10px #ffe885;
            pointer-events: none;
            z-index: 100;
            transform: translateZ(0);
            animation: beamFade 0.24s ease-out forwards;
        }
        .laser-beam-v {
            position: absolute;
            top: 0;
            bottom: 0;
            width: 12px;
            background: linear-gradient(90deg, #fff 0%, #00d2ff 50%, transparent 100%);
            box-shadow: 0 0 10px #00d2ff;
            pointer-events: none;
            z-index: 100;
            transform: translateZ(0);
            animation: beamFade 0.24s ease-out forwards;
        }
        @keyframes beamFade {
            0% { opacity: 1; transform: scale(1) translateZ(0); }
            100% { opacity: 0; transform: scale(1.4) translateZ(0); }
        }

        /* ZEUS LIGHTNING ARROW (Sıfır Donma, GPU Composited) */
        .zeus-arrow-h {
            position: absolute;
            left: 0;
            right: 0;
            height: 24px;
            background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.95) 20%, #ffe885 50%, #00d2ff 80%, transparent 100%);
            box-shadow: 0 0 12px #ffe885, inset 0 0 8px #ffffff;
            pointer-events: none;
            z-index: 120;
            will-change: transform, opacity;
            animation: zeusArrowFlashH 0.25s cubic-bezier(0.15, 0.9, 0.3, 1.2) forwards;
        }
        .zeus-arrow-v {
            position: absolute;
            top: 0;
            bottom: 0;
            width: 24px;
            background: linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.95) 20%, #ffe885 50%, #00d2ff 80%, transparent 100%);
            box-shadow: 0 0 12px #ffe885, inset 0 0 8px #ffffff;
            pointer-events: none;
            z-index: 120;
            will-change: transform, opacity;
            animation: zeusArrowFlashV 0.25s cubic-bezier(0.15, 0.9, 0.3, 1.2) forwards;
        }
        @keyframes zeusArrowFlashH {
            0% { opacity: 0; transform: scaleY(0.2) translate3d(0, 0, 0); }
            30% { opacity: 1; transform: scaleY(1.2) translate3d(0, 0, 0); }
            100% { opacity: 0; transform: scaleY(0.1) translate3d(0, 0, 0); }
        }
        @keyframes zeusArrowFlashV {
            0% { opacity: 0; transform: scaleX(0.2) translate3d(0, 0, 0); }
            30% { opacity: 1; transform: scaleX(1.2) translate3d(0, 0, 0); }
            100% { opacity: 0; transform: scaleX(0.1) translate3d(0, 0, 0); }
        }

        /* POSEIDON / GAIA DEPREM ŞOK DALGASI (Zero-Reflow Composited) */
        .quake-shockwave {
            position: absolute;
            width: 130px;
            height: 130px;
            transform: translate3d(-50%, -50%, 0) scale(0.2);
            border: 2.5px solid #d4af37;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(212,175,55,0.3) 0%, rgba(139,69,19,0.15) 60%, transparent 100%);
            box-shadow: 0 0 14px rgba(255,215,0,0.7);
            pointer-events: none;
            z-index: 115;
            will-change: transform, opacity;
            animation: quakeWaveExpand 0.26s cubic-bezier(0.2, 0.8, 0.3, 1) forwards;
        }
        @keyframes quakeWaveExpand {
            0% { transform: translate3d(-50%, -50%, 0) scale(0.2); opacity: 1; }
            60% { transform: translate3d(-50%, -50%, 0) scale(1.2); opacity: 0.85; }
            100% { transform: translate3d(-50%, -50%, 0) scale(1.5); opacity: 0; }
        }

        /* ARES KUTSAL ALEV PATLAMASI (Zero-Reflow Composited) */
        .mythic-flame-burst {
            position: absolute;
            width: 110px;
            height: 110px;
            transform: translate3d(-50%, -50%, 0) scale(0.3);
            background: radial-gradient(circle, #ffffff 0%, #ffeb3b 25%, #ff5722 65%, rgba(213,0,0,0) 100%);
            box-shadow: 0 0 16px #ff5722;
            border-radius: 50%;
            pointer-events: none;
            z-index: 125;
            will-change: transform, opacity;
            animation: flameBurstAnim 0.26s cubic-bezier(0.1, 0.9, 0.2, 1.2) forwards;
        }
        @keyframes flameBurstAnim {
            0% { transform: translate3d(-50%, -50%, 0) scale(0.3); opacity: 1; }
            50% { transform: translate3d(-50%, -50%, 0) scale(1.25); opacity: 0.9; }
            100% { transform: translate3d(-50%, -50%, 0) scale(1.6); opacity: 0; }
        }`;

let updated = safeReplace(content, oldVfxCss, newVfxCss);
if (!updated) {
    console.error('Failed to replace oldVfxCss!');
    process.exit(1);
}
content = updated;
console.log('✓ Step 1: Optimized Laser, Zeus Arrow, Quake and Flame CSS');

// -------------------------------------------------------------
// 2. OPTIMIZE .cell.exploding: Remove filter: drop-shadow and brightness
// -------------------------------------------------------------
const oldExplodeCss = `        /* CANDY CRUSH EXPLOSION ANIMATION (GPU Accelerated) */
        .cell.exploding {
            will-change: transform, opacity;
            animation: gemExplode 0.22s cubic-bezier(0.2, 0.8, 0.4, 1) forwards;
        }

        @keyframes gemExplode {
            0% { transform: scale(1) translate3d(0, 0, 0); filter: brightness(1); }
            45% { transform: scale(1.35) translate3d(0, 0, 0); filter: brightness(2.2) drop-shadow(0 0 16px #ffe885); }
            100% { transform: scale(0) translate3d(0, 0, 0); opacity: 0; }
        }`;

const newExplodeCss = `        /* CANDY CRUSH EXPLOSION ANIMATION (Pure GPU Composited - Zero Raster Thrashing) */
        .cell.exploding {
            will-change: transform, opacity;
            animation: gemExplode 0.20s cubic-bezier(0.2, 0.8, 0.4, 1) forwards;
        }

        @keyframes gemExplode {
            0% { transform: scale(1) translate3d(0, 0, 0); opacity: 1; }
            40% { transform: scale(1.25) translate3d(0, 0, 0); opacity: 0.95; }
            100% { transform: scale(0.1) translate3d(0, 0, 0); opacity: 0; }
        }`;

updated = safeReplace(content, oldExplodeCss, newExplodeCss);
if (!updated) {
    console.error('Failed to replace oldExplodeCss!');
    process.exit(1);
}
content = updated;
console.log('✓ Step 2: Replaced heavy filter: drop-shadow in gemExplode with pure GPU transform');

// -------------------------------------------------------------
// 3. FIX playEpicCallout: Disable Android WebView freezing window.speechSynthesis
// -------------------------------------------------------------
const oldSpeechCode = `            // 2. Turkish spoken speech
            if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                try {
                    const u = new SpeechSynthesisUtterance(line);
                    u.lang = 'tr-TR';
                    u.rate = 0.88;
                    u.pitch = 0.82;
                    u.volume = 1.0;
                    const voices = window.speechSynthesis.getVoices();
                    const trVoice = voices.find(v => v.lang && (v.lang === 'tr-TR' || v.lang.toLowerCase().startsWith('tr')));
                    if (trVoice) u.voice = trVoice;
                    window.speechSynthesis.speak(u);
                } catch(e) {}
            }`;

const newSpeechCode = `            // 2. Spoken speech: Android WebView IPC kilitlenmesini önlemek için mobil cihazlarda Web Audio osilatörleri kullanılır
            const isNativeMobile = !!(window.Capacitor || (window.navigator && /android|iphone|ipad|ipod/i.test(navigator.userAgent)));
            if (!isNativeMobile && typeof window !== 'undefined' && 'speechSynthesis' in window) {
                try {
                    const u = new SpeechSynthesisUtterance(line);
                    u.lang = 'tr-TR';
                    u.rate = 0.88;
                    u.pitch = 0.82;
                    u.volume = 0.8;
                    const voices = window.speechSynthesis.getVoices();
                    const trVoice = voices.find(v => v.lang && (v.lang === 'tr-TR' || v.lang.toLowerCase().startsWith('tr')));
                    if (trVoice) u.voice = trVoice;
                    window.speechSynthesis.speak(u);
                } catch(e) {}
            }`;

updated = safeReplace(content, oldSpeechCode, newSpeechCode);
if (!updated) {
    console.error('Failed to replace oldSpeechCode!');
    process.exit(1);
}
content = updated;
console.log('✓ Step 3: Safeguarded speech synthesis against mobile WebView IPC freezes');

// -------------------------------------------------------------
// 4. OPTIMIZE spawnLaserBeam, spawnZeusLightningArrow, spawnMythicQuake, spawnMythicFlame
// Synchronize removal timeouts with cascade timing (240ms instead of 450ms)
// -------------------------------------------------------------
const oldLaserFunc = `        function spawnLaserBeam(coord, direction) {
            const grid = document.getElementById('game-grid');
            if (!grid) return;
            const beam = document.createElement('div');
            beam.className = direction === 'h' ? 'laser-beam-h' : 'laser-beam-v';
            if (direction === 'h') {
                beam.style.top = (coord * 50 + 20) + 'px';
            } else {
                beam.style.left = (coord * 50 + 20) + 'px';
            }
            grid.appendChild(beam);
            setTimeout(() => beam.remove(), 400);
        }`;

const newLaserFunc = `        function spawnLaserBeam(coord, direction) {
            const grid = document.getElementById('game-grid');
            if (!grid) return;
            const beam = document.createElement('div');
            beam.className = direction === 'h' ? 'laser-beam-h' : 'laser-beam-v';
            const cellW = grid.clientWidth > 0 ? (grid.clientWidth / 8) : 42;
            const cellH = grid.clientHeight > 0 ? (grid.clientHeight / 8) : 42;
            if (direction === 'h') {
                beam.style.top = ((coord + 0.5) * cellH - 6) + 'px';
            } else {
                beam.style.left = ((coord + 0.5) * cellW - 6) + 'px';
            }
            grid.appendChild(beam);
            setTimeout(() => { if (beam && beam.parentNode) beam.remove(); }, 240);
        }`;

updated = safeReplace(content, oldLaserFunc, newLaserFunc);
if (!updated) {
    console.error('Failed to replace oldLaserFunc!');
    process.exit(1);
}
content = updated;
console.log('✓ Step 4: Streamlined spawnLaserBeam lifetime and positioning');

const oldMythicVfxFuncs = `        function spawnZeusLightningArrow(coord, direction) {
            const grid = document.getElementById('game-grid');
            if (!grid) return;
            const cellW = grid.clientWidth > 0 ? (grid.clientWidth / 8) : 42;
            const cellH = grid.clientHeight > 0 ? (grid.clientHeight / 8) : 42;

            const arrow = document.createElement('div');
            arrow.className = (direction === 'h') ? 'zeus-arrow-h' : 'zeus-arrow-v';
            if (direction === 'h') {
                arrow.style.top = ((coord + 0.5) * cellH - 14) + 'px';
            } else {
                arrow.style.left = ((coord + 0.5) * cellW - 14) + 'px';
            }
            grid.appendChild(arrow);
            setTimeout(() => {
                if (arrow && arrow.parentNode) arrow.remove();
            }, 450);
        }

        function spawnMythicQuake(r, c) {
            const grid = document.getElementById('game-grid');
            if (!grid) return;
            const cellW = grid.clientWidth > 0 ? (grid.clientWidth / 8) : 42;
            const cellH = grid.clientHeight > 0 ? (grid.clientHeight / 8) : 42;

            const wave = document.createElement('div');
            wave.className = 'quake-shockwave';
            wave.style.left = ((c + 0.5) * cellW) + 'px';
            wave.style.top = ((r + 0.5) * cellH) + 'px';
            grid.appendChild(wave);
            setTimeout(() => {
                if (wave && wave.parentNode) wave.remove();
            }, 450);
        }

        function spawnMythicFlame(r, c) {
            const grid = document.getElementById('game-grid');
            if (!grid) return;
            const cellW = grid.clientWidth > 0 ? (grid.clientWidth / 8) : 42;
            const cellH = grid.clientHeight > 0 ? (grid.clientHeight / 8) : 42;

            const flame = document.createElement('div');
            flame.className = 'mythic-flame-burst';
            flame.style.left = ((c + 0.5) * cellW) + 'px';
            flame.style.top = ((r + 0.5) * cellH) + 'px';
            grid.appendChild(flame);
            setTimeout(() => {
                if (flame && flame.parentNode) flame.remove();
            }, 480);
        }`;

const newMythicVfxFuncs = `        function spawnZeusLightningArrow(coord, direction) {
            const grid = document.getElementById('game-grid');
            if (!grid) return;
            const cellW = grid.clientWidth > 0 ? (grid.clientWidth / 8) : 42;
            const cellH = grid.clientHeight > 0 ? (grid.clientHeight / 8) : 42;

            const arrow = document.createElement('div');
            arrow.className = (direction === 'h') ? 'zeus-arrow-h' : 'zeus-arrow-v';
            if (direction === 'h') {
                arrow.style.top = ((coord + 0.5) * cellH - 12) + 'px';
            } else {
                arrow.style.left = ((coord + 0.5) * cellW - 12) + 'px';
            }
            grid.appendChild(arrow);
            setTimeout(() => {
                if (arrow && arrow.parentNode) arrow.remove();
            }, 250);
        }

        function spawnMythicQuake(r, c) {
            const grid = document.getElementById('game-grid');
            if (!grid) return;
            const cellW = grid.clientWidth > 0 ? (grid.clientWidth / 8) : 42;
            const cellH = grid.clientHeight > 0 ? (grid.clientHeight / 8) : 42;

            const wave = document.createElement('div');
            wave.className = 'quake-shockwave';
            wave.style.left = ((c + 0.5) * cellW) + 'px';
            wave.style.top = ((r + 0.5) * cellH) + 'px';
            grid.appendChild(wave);
            setTimeout(() => {
                if (wave && wave.parentNode) wave.remove();
            }, 260);
        }

        function spawnMythicFlame(r, c) {
            const grid = document.getElementById('game-grid');
            if (!grid) return;
            const cellW = grid.clientWidth > 0 ? (grid.clientWidth / 8) : 42;
            const cellH = grid.clientHeight > 0 ? (grid.clientHeight / 8) : 42;

            const flame = document.createElement('div');
            flame.className = 'mythic-flame-burst';
            flame.style.left = ((c + 0.5) * cellW) + 'px';
            flame.style.top = ((r + 0.5) * cellH) + 'px';
            grid.appendChild(flame);
            setTimeout(() => {
                if (flame && flame.parentNode) flame.remove();
            }, 260);
        }`;

updated = safeReplace(content, oldMythicVfxFuncs, newMythicVfxFuncs);
if (!updated) {
    console.error('Failed to replace oldMythicVfxFuncs!');
    process.exit(1);
}
content = updated;
console.log('✓ Step 5: Aligned Mythic VFX timeouts with cascade cadence (250ms)');

// -------------------------------------------------------------
// 5. OPTIMIZE triggerDualSpecialCombo: Deduplicate laser spawn in Color Bomb combos
// -------------------------------------------------------------
const oldDualComboCase2 = `                    let count = 0;
                    for (let r = 0; r < 8; r++) {
                        for (let c = 0; c < 8; c++) {
                            if (gridData[r][c] === targetColor || (r === cbPos.r && c === cbPos.c) || (r === spPos.r && c === spPos.c)) {
                                affectedCells.add(\`\${r},\${c}\`);
                                count++;
                                if (spType === 'bomb') {
                                    for (let dr = -1; dr <= 1; dr++) {
                                        for (let dc = -1; dc <= 1; dc++) {
                                            const nr = r + dr, nc = c + dc;
                                            if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) affectedCells.add(\`\${nr},\${nc}\`);
                                        }
                                    }
                                } else {
                                    if (count % 2 === 0) {
                                        for (let cc = 0; cc < 8; cc++) affectedCells.add(\`\${r},\${cc}\`);
                                        spawnLaserBeam(r, 'h');
                                    } else {
                                        for (let rr = 0; rr < 8; rr++) affectedCells.add(\`\${rr},\${c}\`);
                                        spawnLaserBeam(c, 'v');
                                    }
                                }
                            }
                        }
                    }`;

const newDualComboCase2 = `                    let count = 0;
                    const spawnedRows = new Set();
                    const spawnedCols = new Set();
                    for (let r = 0; r < 8; r++) {
                        for (let c = 0; c < 8; c++) {
                            if (gridData[r][c] === targetColor || (r === cbPos.r && c === cbPos.c) || (r === spPos.r && c === spPos.c)) {
                                affectedCells.add(\`\${r},\${c}\`);
                                count++;
                                if (spType === 'bomb') {
                                    for (let dr = -1; dr <= 1; dr++) {
                                        for (let dc = -1; dc <= 1; dc++) {
                                            const nr = r + dr, nc = c + dc;
                                            if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) affectedCells.add(\`\${nr},\${nc}\`);
                                        }
                                    }
                                } else {
                                    if (count % 2 === 0) {
                                        for (let cc = 0; cc < 8; cc++) affectedCells.add(\`\${r},\${cc}\`);
                                        if (!spawnedRows.has(r)) {
                                            spawnedRows.add(r);
                                            spawnLaserBeam(r, 'h');
                                        }
                                    } else {
                                        for (let rr = 0; rr < 8; rr++) affectedCells.add(\`\${rr},\${c}\`);
                                        if (!spawnedCols.has(c)) {
                                            spawnedCols.add(c);
                                            spawnLaserBeam(c, 'v');
                                        }
                                    }
                                }
                            }
                        }
                    }`;

updated = safeReplace(content, oldDualComboCase2, newDualComboCase2);
if (!updated) {
    console.error('Failed to replace oldDualComboCase2!');
    process.exit(1);
}
content = updated;
console.log('✓ Step 6: Deduplicated laser spawns in Dual Special Combos');

// -------------------------------------------------------------
// 6. EXPAND PARTICLE POOL & THROTTLE MASS EXPLOSIONS
// -------------------------------------------------------------
const oldPoolSize = `        const GemParticlePool = {
            pool: [],
            maxSize: 32,`;

const newPoolSize = `        const GemParticlePool = {
            pool: [],
            maxSize: 48,`;

updated = safeReplace(content, oldPoolSize, newPoolSize);
if (!updated) {
    console.error('Failed to replace oldPoolSize!');
    process.exit(1);
}
content = updated;
console.log('✓ Step 7: Expanded GemParticlePool to 48 particles');

// Save updated content
fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully written optimized code to ' + filePath);

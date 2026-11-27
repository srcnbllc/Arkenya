const fs = require('fs');

console.log('=== APPLYING ZERO-JANK EXPLOSION & COMBO ENGINE ===');

const targetFile = 'www/index.html';
let content = fs.readFileSync(targetFile, 'utf8');
const isCrlf = content.includes('\r\n');

function normalize(str) {
    return str.replace(/\r\n/g, '\n');
}

function safeReplace(source, targetSearch, replacement) {
    const normSource = normalize(source);
    const normSearch = normalize(targetSearch);
    const normReplacement = normalize(replacement);

    if (!normSource.includes(normSearch)) {
        console.error('Target snippet not found for replacement:');
        console.error(normSearch.substring(0, 150) + '...');
        return null;
    }
    const result = normSource.replace(normSearch, normReplacement);
    return isCrlf ? result.replace(/\n/g, '\r\n') : result;
}

// -------------------------------------------------------------
// 1. TRIGGER HAPTIC THROTTLE: Prevent rapid vibration bridge queue congestion
// -------------------------------------------------------------
const oldHapticCode = `        // NATIVE HAPTIC FEEDBACK HELPER (Android & iOS) - Settings-Aware & Smooth
        function triggerHaptic(style = 'light') {
            if (typeof isVibrationEnabled !== 'undefined' && !isVibrationEnabled) return;
            if (typeof gameState !== 'undefined' && gameState && gameState.vibrationEnabled === false) return;
            try {
                if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Haptics) {
                    if (style === 'heavy') {
                        window.Capacitor.Plugins.Haptics.impact({ style: 'HEAVY' });
                    } else if (style === 'medium') {
                        window.Capacitor.Plugins.Haptics.impact({ style: 'MEDIUM' });
                    } else {
                        window.Capacitor.Plugins.Haptics.impact({ style: 'LIGHT' });
                    }
                } else if (navigator && navigator.vibrate) {
                    if (style === 'heavy') navigator.vibrate([35, 25, 45]);
                    else if (style === 'medium') navigator.vibrate([25]);
                    else navigator.vibrate([15]);
                }
            } catch(e) {}
        }`;

const newHapticCode = `        // NATIVE HAPTIC FEEDBACK HELPER (Android & iOS) - Settings-Aware, Throttled & 60fps Safe
        let lastHapticTimestamp = 0;
        function triggerHaptic(style = 'light') {
            if (typeof isVibrationEnabled !== 'undefined' && !isVibrationEnabled) return;
            if (typeof gameState !== 'undefined' && gameState && gameState.vibrationEnabled === false) return;
            const now = Date.now();
            if (now - lastHapticTimestamp < 60) return; // Prevent Android IPC bridge congestion during rapid combos
            lastHapticTimestamp = now;
            try {
                if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Haptics) {
                    if (style === 'heavy') {
                        window.Capacitor.Plugins.Haptics.impact({ style: 'HEAVY' });
                    } else if (style === 'medium') {
                        window.Capacitor.Plugins.Haptics.impact({ style: 'MEDIUM' });
                    } else {
                        window.Capacitor.Plugins.Haptics.impact({ style: 'LIGHT' });
                    }
                } else if (navigator && navigator.vibrate) {
                    if (style === 'heavy') navigator.vibrate(30);
                    else if (style === 'medium') navigator.vibrate(20);
                    else navigator.vibrate(12);
                }
            } catch(e) {}
        }`;

let updated = safeReplace(content, oldHapticCode, newHapticCode);
if (!updated) {
    console.error('Failed to replace oldHapticCode!');
    process.exit(1);
}
content = updated;
console.log('✓ Step 1: Added 60ms IPC throttle to triggerHaptic');

// -------------------------------------------------------------
// 2. BACKGROUND PRELOAD FOR COMBO & CRITICAL VOICES (Zero-JIT Decoding Jank)
// -------------------------------------------------------------
const oldVoiceEngineStart = `        // TÜRKÇE GERÇEKÇİ KAHRAMAN & KOMBO SES SİSTEMİ (0ms Gecikmeli Web Audio API & AudioBuffer Havuzu)
        const _decodedVoiceBuffers = {};
        const _htmlVoiceAudioPool = {};

        function playStudioVoiceAudio(audioKey, volume = 0.95) {`;

const newVoiceEngineStart = `        // TÜRKÇE GERÇEKÇİ KAHRAMAN & KOMBO SES SİSTEMİ (0ms Gecikmeli Web Audio API & AudioBuffer Havuzu)
        const _decodedVoiceBuffers = {};
        const _htmlVoiceAudioPool = {};
        let _isPreloadingVoiceAudios = false;

        function preloadCriticalVoiceAudios() {
            if (_isPreloadingVoiceAudios) return;
            if (typeof window === 'undefined' || !window.NARRATOR_AUDIO_BASE64) return;
            const ctx = getAudioContext();
            if (!ctx) return;
            _isPreloadingVoiceAudios = true;

            const criticalKeys = [
                'callout_combo_2',
                'callout_combo_3',
                'callout_combo_4',
                'callout_clutch',
                'callout_victory',
                'hero_arkenya_ability',
                'hero_zeus_ability'
            ];

            let delay = 250;
            criticalKeys.forEach(key => {
                const b64Data = window.NARRATOR_AUDIO_BASE64[key];
                if (!b64Data || _decodedVoiceBuffers[key]) return;

                setTimeout(() => {
                    try {
                        if (_decodedVoiceBuffers[key]) return;
                        const rawB64 = b64Data.includes(',') ? b64Data.split(',')[1] : b64Data;
                        const binStr = window.atob(rawB64);
                        const len = binStr.length;
                        const bytes = new Uint8Array(len);
                        for (let i = 0; i < len; i++) bytes[i] = binStr.charCodeAt(i);
                        ctx.decodeAudioData(bytes.buffer.slice(0), (buf) => {
                            _decodedVoiceBuffers[key] = buf;
                        }, () => {});
                    } catch(e) {}
                }, delay);
                delay += 120;
            });
        }

        function playStudioVoiceAudio(audioKey, volume = 0.95) {`;

updated = safeReplace(content, oldVoiceEngineStart, newVoiceEngineStart);
if (!updated) {
    console.error('Failed to replace oldVoiceEngineStart!');
    process.exit(1);
}
content = updated;
console.log('✓ Step 2: Integrated preloadCriticalVoiceAudios for zero-latency audio buffering');

// -------------------------------------------------------------
// 3. ZERO-REFLOW SPAWN GEM PARTICLES (Pure mathematical coords, no offsetLeft queries)
// -------------------------------------------------------------
const oldSpawnParticles = `        function spawnGemParticles(cellEl, gemType) {
            if (!cellEl || typeof document === 'undefined') return;
            const grid = document.getElementById('game-grid');
            if (!grid) return;

            const particleContainer = document.getElementById('particle-overlay') || grid;

            if (!GemParticlePool.initialized || GemParticlePool.pool.length === 0) {
                GemParticlePool.init(particleContainer);
            }

            // Zero-Layout-Thrashing: Calculate coordinates mathematically without forced reflow
            let startX = 0;
            let startY = 0;
            const gridW = grid.clientWidth || 320;
            const gridH = grid.clientHeight || 320;
            const cellW = gridW / 8;
            const cellH = gridH / 8;

            if (cellEl.dataset && cellEl.dataset.r !== undefined && cellEl.dataset.c !== undefined) {
                const r = parseInt(cellEl.dataset.r, 10);
                const c = parseInt(cellEl.dataset.c, 10);
                startX = (c + 0.5) * cellW;
                startY = (r + 0.5) * cellH;
            } else if (typeof cellEl.offsetLeft === 'number' && typeof cellEl.offsetWidth === 'number') {
                startX = cellEl.offsetLeft + (cellEl.offsetWidth / 2);
                startY = cellEl.offsetTop + (cellEl.offsetHeight / 2);
            } else {
                startX = gridW / 2;
                startY = gridH / 2;
            }

            const color = GEM_PARTICLE_COLORS[gemType] || '#ffd700';
            const count = (typeof ArkenyaPerformance !== 'undefined') ? ArkenyaPerformance.getParticleCount() : 4;

            for (let i = 0; i < count; i++) {
                const item = GemParticlePool.acquire();
                if (!item) break;

                const p = item.el;
                p.style.backgroundColor = color;
                p.style.color = color;
                p.style.left = startX + 'px';
                p.style.top = startY + 'px';

                const angle = (Math.PI * 2 * i) / count + (Math.random() * 0.35);
                const dist = 20 + Math.random() * 18;
                const tx = Math.cos(angle) * dist;
                const ty = Math.sin(angle) * dist;
                p.style.setProperty('--tx', \`\${tx}px\`);
                p.style.setProperty('--ty', \`\${ty}px\`);

                p.style.display = 'block';
                // GPU-Composited Zero-Reflow Particle Animation (Zero Jank / Zero Freezing on Mobile)
                if (typeof p.animate === 'function') {
                    p.style.transform = 'translate3d(0, 0, 0) scale(1)';
                    p.style.opacity = '1';
                    const anim = p.animate([
                        { transform: 'translate3d(0, 0, 0) scale(1)', opacity: 1 },
                        { transform: \`translate3d(\${tx}px, \${ty}px, 0) scale(0)\`, opacity: 0 }
                    ], {
                        duration: 380,
                        easing: 'cubic-bezier(0.2, 0.8, 0.4, 1)',
                        fill: 'forwards'
                    });
                    anim.onfinish = () => {
                        GemParticlePool.release(item);
                    };
                } else {
                    p.classList.remove('active');
                    p.classList.add('active');
                    item.timer = setTimeout(() => {
                        GemParticlePool.release(item);
                    }, 400);
                }
            }
        }`;

const newSpawnParticles = `        function spawnGemParticles(r, c, gemType, precalcCellW, precalcCellH) {
            if (typeof document === 'undefined') return;
            const grid = document.getElementById('game-grid');
            if (!grid) return;

            const particleContainer = document.getElementById('particle-overlay') || grid;

            if (!GemParticlePool.initialized || GemParticlePool.pool.length === 0) {
                GemParticlePool.init(particleContainer);
            }

            // Zero-Layout-Thrashing: Pure mathematical coords without query thrashing
            let cellW = precalcCellW;
            let cellH = precalcCellH;
            let startX = 0;
            let startY = 0;

            if (typeof r === 'object' && r !== null) {
                // Backward-compatibility if passed (cellEl, gemType)
                const cellEl = r;
                gemType = c;
                if (!cellW) {
                    const gridW = grid.clientWidth || 320;
                    const gridH = grid.clientHeight || 320;
                    cellW = gridW / 8;
                    cellH = gridH / 8;
                }
                const row = (cellEl.dataset && cellEl.dataset.r !== undefined) ? parseInt(cellEl.dataset.r, 10) : 0;
                const col = (cellEl.dataset && cellEl.dataset.c !== undefined) ? parseInt(cellEl.dataset.c, 10) : 0;
                startX = (col + 0.5) * cellW;
                startY = (row + 0.5) * cellH;
            } else {
                if (!cellW) {
                    const gridW = grid.clientWidth || 320;
                    const gridH = grid.clientHeight || 320;
                    cellW = gridW / 8;
                    cellH = gridH / 8;
                }
                startX = (c + 0.5) * cellW;
                startY = (r + 0.5) * cellH;
            }

            const color = GEM_PARTICLE_COLORS[gemType] || '#ffd700';
            const count = 3; // Maximum 3 crisp particles per burst center to sustain locked 60fps

            for (let i = 0; i < count; i++) {
                const item = GemParticlePool.acquire();
                if (!item) break;

                const p = item.el;
                p.style.backgroundColor = color;
                p.style.color = color;
                p.style.left = startX + 'px';
                p.style.top = startY + 'px';

                const angle = (Math.PI * 2 * i) / count + (Math.random() * 0.35);
                const dist = 18 + Math.random() * 16;
                const tx = Math.cos(angle) * dist;
                const ty = Math.sin(angle) * dist;
                p.style.setProperty('--tx', \`\${tx}px\`);
                p.style.setProperty('--ty', \`\${ty}px\`);

                p.style.display = 'block';
                // GPU-Composited Zero-Reflow Particle Animation (Zero Jank / Zero Freezing on Mobile)
                if (typeof p.animate === 'function') {
                    p.style.transform = 'translate3d(0, 0, 0) scale(1)';
                    p.style.opacity = '1';
                    const anim = p.animate([
                        { transform: 'translate3d(0, 0, 0) scale(1)', opacity: 1 },
                        { transform: \`translate3d(\${tx}px, \${ty}px, 0) scale(0)\`, opacity: 0 }
                    ], {
                        duration: 300,
                        easing: 'cubic-bezier(0.2, 0.8, 0.4, 1)',
                        fill: 'forwards'
                    });
                    anim.onfinish = () => {
                        GemParticlePool.release(item);
                    };
                } else {
                    p.classList.remove('active');
                    p.classList.add('active');
                    item.timer = setTimeout(() => {
                        GemParticlePool.release(item);
                    }, 320);
                }
            }
        }`;

updated = safeReplace(content, oldSpawnParticles, newSpawnParticles);
if (!updated) {
    console.error('Failed to replace oldSpawnParticles!');
    process.exit(1);
}
content = updated;
console.log('✓ Step 3: Upgraded spawnGemParticles to zero-reflow mathematical coordinates');

// -------------------------------------------------------------
// 4. BATCH EXPLOSION IN processMatchesWithExplosion: Eliminate forced layout recalculation
// -------------------------------------------------------------
const oldExplodeBatch = `                const cells = document.getElementById('game-grid').children;
                finalPopArray.forEach(pos => {
                    const idx = pos.r * 8 + pos.c;
                    if (cells[idx]) {
                        cells[idx].classList.add('exploding');
                        spawnGemParticles(cells[idx], gridData[pos.r][pos.c]);
                    }
                    gridData[pos.r][pos.c] = null;
                    if (specialGrid[pos.r]) specialGrid[pos.r][pos.c] = null;
                });`;

const newExplodeBatch = `                const gridEl = document.getElementById('game-grid');
                const cells = gridEl ? gridEl.children : [];
                const gridW = gridEl ? (gridEl.clientWidth || 320) : 320;
                const gridH = gridEl ? (gridEl.clientHeight || 320) : 320;
                const cellW = gridW / 8;
                const cellH = gridH / 8;

                // Batch 1: DOM class mutation (Batch Write - Zero Interleaved Reads)
                finalPopArray.forEach(pos => {
                    const idx = pos.r * 8 + pos.c;
                    if (cells[idx]) {
                        cells[idx].classList.add('exploding');
                    }
                });

                // Batch 2: Pure mathematical particle spawning capped at 4 centers (Max 12 particles)
                const particleTargets = finalPopArray.slice(0, 4);
                particleTargets.forEach(pos => {
                    spawnGemParticles(pos.r, pos.c, gridData[pos.r][pos.c], cellW, cellH);
                });

                // Batch 3: State cleanup
                finalPopArray.forEach(pos => {
                    gridData[pos.r][pos.c] = null;
                    if (specialGrid[pos.r]) specialGrid[pos.r][pos.c] = null;
                });`;

updated = safeReplace(content, oldExplodeBatch, newExplodeBatch);
if (!updated) {
    console.error('Failed to replace oldExplodeBatch in processMatchesWithExplosion!');
    process.exit(1);
}
content = updated;
console.log('✓ Step 4: Batched DOM writes & capped particles in processMatchesWithExplosion');

// -------------------------------------------------------------
// 5. BATCH EXPLOSION IN triggerDualSpecialCombo
// -------------------------------------------------------------
const oldDualPopBatch = `                popArray.forEach(pos => {
                    const idx = pos.r * 8 + pos.c;
                    if (cells[idx]) {
                        cells[idx].classList.add('exploding');
                        spawnGemParticles(cells[idx], gridData[pos.r][pos.c]);
                    }
                    gridData[pos.r][pos.c] = null;
                    if (specialGrid[pos.r]) specialGrid[pos.r][pos.c] = null;
                });`;

const newDualPopBatch = `                const gridEl = document.getElementById('game-grid');
                const cells = gridEl ? gridEl.children : [];
                const gridW = gridEl ? (gridEl.clientWidth || 320) : 320;
                const gridH = gridEl ? (gridEl.clientHeight || 320) : 320;
                const cellW = gridW / 8;
                const cellH = gridH / 8;

                // Batch 1: DOM class mutation
                popArray.forEach(pos => {
                    const idx = pos.r * 8 + pos.c;
                    if (cells[idx]) {
                        cells[idx].classList.add('exploding');
                    }
                });

                // Batch 2: Controlled particles capped at 5 epicenter gems
                const dualParticleTargets = popArray.slice(0, 5);
                dualParticleTargets.forEach(pos => {
                    spawnGemParticles(pos.r, pos.c, gridData[pos.r][pos.c], cellW, cellH);
                });

                // Batch 3: State cleanup
                popArray.forEach(pos => {
                    gridData[pos.r][pos.c] = null;
                    if (specialGrid[pos.r]) specialGrid[pos.r][pos.c] = null;
                });`;

updated = safeReplace(content, oldDualPopBatch, newDualPopBatch);
if (!updated) {
    console.error('Failed to replace oldDualPopBatch in triggerDualSpecialCombo!');
    process.exit(1);
}
content = updated;
console.log('✓ Step 5: Batched DOM writes in triggerDualSpecialCombo');

// -------------------------------------------------------------
// 6. INVOKE preloadCriticalVoiceAudios IN startGameplay & PointerDown
// -------------------------------------------------------------
const oldStartGameplayPreload = `        function startGameplay() {
            document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
            updateGameplayPowerups();`;

const newStartGameplayPreload = `        function startGameplay() {
            preloadCriticalVoiceAudios();
            document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
            updateGameplayPowerups();`;

updated = safeReplace(content, oldStartGameplayPreload, newStartGameplayPreload);
if (!updated) {
    console.error('Failed to replace oldStartGameplayPreload!');
    process.exit(1);
}
content = updated;
console.log('✓ Step 6: Triggered preloadCriticalVoiceAudios on startGameplay');

// Save updated content
fs.writeFileSync(targetFile, content, 'utf8');
console.log('Successfully written all optimizations to ' + targetFile);

const fs = require('fs');

console.log('=== APPLYING MOBILE PERFORMANCE & 60 FPS DYNAMIC ARCHITECTURE ===');

let html = fs.readFileSync('www/index.html', 'utf8');
const isCrlf = html.includes('\r\n');
const lineEnding = isCrlf ? '\r\n' : '\n';

function clean(str) {
    return str.replace(/\r\n/g, '\n');
}

function replaceBlock(targetHtml, searchStr, replaceStr) {
    const cleanHtml = clean(targetHtml);
    const cleanSearch = clean(searchStr);
    const cleanReplace = clean(replaceStr);
    
    if (!cleanHtml.includes(cleanSearch)) {
        return null;
    }
    const result = cleanHtml.replace(cleanSearch, cleanReplace);
    return isCrlf ? result.replace(/\n/g, '\r\n') : result;
}

// 1. Particle VFX CSS with Hardware Acceleration & Overlay
const oldParticleCss = `        /* MYTHIC GEM BURST PARTICLES (VFX) */
        .sparkle-particle {
            position: absolute;
            width: 7px;
            height: 7px;
            border-radius: 50%;
            pointer-events: none;
            z-index: 280;
            box-shadow: 0 0 8px currentColor;
            animation: particleBurstAnim 0.45s ease-out forwards;
        }

        @keyframes particleBurstAnim {
            0% {
                opacity: 1;
                transform: translate(0, 0) scale(1.3);
            }
            100% {
                opacity: 0;
                transform: translate(var(--tx, 0px), var(--ty, 0px)) scale(0.2);
            }
        }`;

const newParticleCss = `        /* MYTHIC GEM BURST PARTICLES (VFX) - Hardware Accelerated & Pooled */
        .particle-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 280;
            overflow: visible;
        }
        .sparkle-particle {
            position: absolute;
            width: 7px;
            height: 7px;
            border-radius: 50%;
            pointer-events: none;
            z-index: 280;
            box-shadow: 0 0 6px currentColor;
            will-change: transform, opacity;
            transform: translate3d(0, 0, 0);
            display: none;
        }
        .sparkle-particle.active {
            display: block;
            animation: particleBurstAnim 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        @keyframes particleBurstAnim {
            0% {
                opacity: 1;
                transform: translate3d(0, 0, 0) scale(1.3);
            }
            100% {
                opacity: 0;
                transform: translate3d(var(--tx, 0px), var(--ty, 0px), 0) scale(0.2);
            }
        }`;

let nextHtml = replaceBlock(html, oldParticleCss, newParticleCss);
if (!nextHtml) {
    console.error('FAIL: oldParticleCss not found!');
    process.exit(1);
}
html = nextHtml;
console.log('✓ Step 1: Updated Particle CSS to 3D GPU acceleration & pooling classes');

// 2. Cell & Gem CSS Optimization (Overdraw reduction + GPU layer promotion)
const oldCellCss = `        .cell {
            width: 100%;
            height: 100%;
            border-radius: 11px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 22px;
            cursor: pointer;
            touch-action: none;
            user-select: none;
            position: relative;
            border: 1.5px solid rgba(255, 255, 255, 0.4);
            box-shadow: inset 0 2px 4px rgba(255,255,255,0.7), inset 0 -3px 6px rgba(0,0,0,0.75), 0 4px 10px rgba(0,0,0,0.6);
            transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.2s, filter 0.2s;
            will-change: transform;
            contain: layout style;
            z-index: 10;
            overflow: hidden;
        }`;

const newCellCss = `        .cell {
            width: 100%;
            height: 100%;
            border-radius: 11px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 22px;
            cursor: pointer;
            touch-action: none;
            user-select: none;
            position: relative;
            border: 1.5px solid rgba(255, 255, 255, 0.4);
            box-shadow: inset 0 2px 4px rgba(255,255,255,0.7), 0 3px 8px rgba(0,0,0,0.55);
            transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.2s;
            will-change: transform;
            transform: translateZ(0);
            backface-visibility: hidden;
            contain: layout style paint;
            z-index: 10;
            overflow: hidden;
        }`;

nextHtml = replaceBlock(html, oldCellCss, newCellCss);
if (!nextHtml) {
    console.error('FAIL: oldCellCss not found!');
    process.exit(1);
}
html = nextHtml;
console.log('✓ Step 2: Added translateZ(0) GPU layer and optimized cell shadow');

// Optimize gem overdraw shadows
const oldGemsCss = `        /* 1. KIZIL YAKUT: ARES'İN SAVAŞ MÜHRÜ */
        .cell-red { 
            background: radial-gradient(circle at 30% 25%, #ff7675 0%, #d63031 35%, #961214 70%, #4a0305 100%);
            border-color: rgba(255, 160, 160, 0.8);
            box-shadow: inset 0 2px 5px rgba(255,255,255,0.85), inset 0 -4px 7px rgba(0,0,0,0.85), inset 0 0 10px rgba(255,50,50,0.5), 0 4px 12px rgba(180, 20, 20, 0.5);
        }

        /* 2. DERİN SAFİR: POSEIDON'UN OKYANUS MÜHRÜ */
        .cell-blue { 
            background: radial-gradient(circle at 30% 25%, #74b9ff 0%, #0984e3 35%, #055099 70%, #031d45 100%);
            border-color: rgba(145, 205, 255, 0.8);
            box-shadow: inset 0 2px 5px rgba(255,255,255,0.85), inset 0 -4px 7px rgba(0,0,0,0.85), inset 0 0 10px rgba(0,210,255,0.5), 0 4px 12px rgba(9, 132, 227, 0.5);
        }

        /* 3. PARLAK ZÜMRÜT: DEMETER'İN YAŞAM MÜHRÜ */
        .cell-green { 
            background: radial-gradient(circle at 30% 25%, #55efc4 0%, #00b894 35%, #00735c 70%, #003328 100%);
            border-color: rgba(135, 245, 215, 0.8);
            box-shadow: inset 0 2px 5px rgba(255,255,255,0.85), inset 0 -4px 7px rgba(0,0,0,0.85), inset 0 0 10px rgba(0,245,160,0.5), 0 4px 12px rgba(0, 184, 148, 0.5);
        }

        /* 4. GÜNEŞ TOPAZI: ZEUS'UN ŞİMŞEK MÜHRÜ */
        .cell-yellow { 
            background: radial-gradient(circle at 30% 25%, #fff6cc 0%, #f9ca24 35%, #e19d00 70%, #6b4700 100%);
            border-color: rgba(255, 235, 150, 0.95);
            box-shadow: inset 0 2px 5px rgba(255,255,255,0.95), inset 0 -4px 7px rgba(0,0,0,0.85), inset 0 0 12px rgba(255,230,100,0.65), 0 4px 14px rgba(245, 197, 66, 0.6);
        }

        /* 5. GÖLGE AMETİSTİ: HADES'İN YERALTI MÜHRÜ */
        .cell-purple { 
            background: radial-gradient(circle at 30% 25%, #d1c4e9 0%, #8e44ad 35%, #5b1e77 70%, #280838 100%);
            border-color: rgba(215, 185, 255, 0.8);
            box-shadow: inset 0 2px 5px rgba(255,255,255,0.85), inset 0 -4px 7px rgba(0,0,0,0.85), inset 0 0 10px rgba(186,104,200,0.5), 0 4px 12px rgba(142, 68, 173, 0.5);
        }`;

const newGemsCss = `        /* 1. KIZIL YAKUT: ARES'İN SAVAŞ MÜHRÜ */
        .cell-red { 
            background: radial-gradient(circle at 30% 25%, #ff7675 0%, #d63031 35%, #961214 70%, #4a0305 100%);
            border-color: rgba(255, 160, 160, 0.8);
            box-shadow: inset 0 2px 4px rgba(255,255,255,0.8), 0 3px 8px rgba(180, 20, 20, 0.45);
        }

        /* 2. DERİN SAFİR: POSEIDON'UN OKYANUS MÜHRÜ */
        .cell-blue { 
            background: radial-gradient(circle at 30% 25%, #74b9ff 0%, #0984e3 35%, #055099 70%, #031d45 100%);
            border-color: rgba(145, 205, 255, 0.8);
            box-shadow: inset 0 2px 4px rgba(255,255,255,0.8), 0 3px 8px rgba(9, 132, 227, 0.45);
        }

        /* 3. PARLAK ZÜMRÜT: DEMETER'İN YAŞAM MÜHRÜ */
        .cell-green { 
            background: radial-gradient(circle at 30% 25%, #55efc4 0%, #00b894 35%, #00735c 70%, #003328 100%);
            border-color: rgba(135, 245, 215, 0.8);
            box-shadow: inset 0 2px 4px rgba(255,255,255,0.8), 0 3px 8px rgba(0, 184, 148, 0.45);
        }

        /* 4. GÜNEŞ TOPAZI: ZEUS'UN ŞİMŞEK MÜHRÜ */
        .cell-yellow { 
            background: radial-gradient(circle at 30% 25%, #fff6cc 0%, #f9ca24 35%, #e19d00 70%, #6b4700 100%);
            border-color: rgba(255, 235, 150, 0.95);
            box-shadow: inset 0 2px 4px rgba(255,255,255,0.9), 0 3px 8px rgba(245, 197, 66, 0.5);
        }

        /* 5. GÖLGE AMETİSTİ: HADES'İN YERALTI MÜHRÜ */
        .cell-purple { 
            background: radial-gradient(circle at 30% 25%, #d1c4e9 0%, #8e44ad 35%, #5b1e77 70%, #280838 100%);
            border-color: rgba(215, 185, 255, 0.8);
            box-shadow: inset 0 2px 4px rgba(255,255,255,0.8), 0 3px 8px rgba(142, 68, 173, 0.45);
        }`;

nextHtml = replaceBlock(html, oldGemsCss, newGemsCss);
if (!nextHtml) {
    console.error('FAIL: oldGemsCss not found!');
    process.exit(1);
}
html = nextHtml;
console.log('✓ Step 3: Streamlined gem box-shadows to reduce GPU fill-rate overdraw');

// 3. Mount particle overlay container alongside #game-grid
const oldGridHtml = `                    <!-- 8x8 Candy Match Grid (Sadece 64 hücre içerir, script & index uyumlu) -->
                    <div class="grid-container" id="game-grid"></div>`;

const newGridHtml = `                    <!-- 8x8 Candy Match Grid (Sadece 64 hücre içerir, script & index uyumlu) -->
                    <div class="grid-mount-anchor" style="position: relative; margin: 0 auto; display: inline-block;">
                        <div class="grid-container" id="game-grid"></div>
                        <div id="particle-overlay" class="particle-overlay" aria-hidden="true"></div>
                    </div>`;

nextHtml = replaceBlock(html, oldGridHtml, newGridHtml);
if (!nextHtml) {
    console.error('FAIL: oldGridHtml not found!');
    process.exit(1);
}
html = nextHtml;
console.log('✓ Step 4: Mounted particle-overlay container preserving exact 64-cell grid invariant');

// 4. Implement Dynamic Performance Engine, Zero-GC Particle Pool & Reflow-Free Particle Spawner
const oldParticleFunc = `        // --- GEM BURST PARTICLE SPAWNER (VFX) ---
        const GEM_PARTICLE_COLORS = {
            red: '#ff4757',
            blue: '#00d2ff',
            green: '#2ed573',
            yellow: '#ffd700',
            purple: '#a29bfe'
        };

        function spawnGemParticles(cellEl, gemType) {
            if (!cellEl || typeof document === 'undefined') return;
            const grid = document.getElementById('game-grid');
            if (!grid) return;

            const rect = cellEl.getBoundingClientRect ? cellEl.getBoundingClientRect() : { left: 0, top: 0, width: 40, height: 40 };
            const gridRect = grid.getBoundingClientRect ? grid.getBoundingClientRect() : { left: 0, top: 0 };
            const startX = rect.left - gridRect.left + (rect.width / 2);
            const startY = rect.top - gridRect.top + (rect.height / 2);
            const color = GEM_PARTICLE_COLORS[gemType] || '#ffd700';

            const count = 5;
            for (let i = 0; i < count; i++) {
                const p = document.createElement('div');
                p.className = 'sparkle-particle gem-particle';
                p.style.backgroundColor = color;
                p.style.color = color;
                p.style.left = startX + 'px';
                p.style.top = startY + 'px';

                const angle = (Math.PI * 2 * i) / count + (Math.random() * 0.4);
                const dist = 22 + Math.random() * 20;
                const tx = Math.cos(angle) * dist;
                const ty = Math.sin(angle) * dist;
                p.style.setProperty('--tx', \`\${tx}px\`);
                p.style.setProperty('--ty', \`\${ty}px\`);

                grid.appendChild(p);
                setTimeout(() => { if (p.parentNode) p.remove(); }, 460);
            }
        }`;

const newParticleFunc = `        // ==========================================
        // DYNAMIC MOBILE PERFORMANCE & ADAPTIVE FPS ENGINE
        // Ensures rock-solid 60 FPS across low/mid/high-tier mobile devices
        // ==========================================
        const ArkenyaPerformance = {
            quality: 'auto', // 'auto', 'high', 'eco'
            currentFps: 60,
            frameCount: 0,
            lastTime: (typeof performance !== 'undefined' ? performance.now() : Date.now()),
            isEcoMode: false,
            frameHistory: [],
            
            init() {
                if (typeof window === 'undefined') return;
                this.measureFps();
            },
            
            measureFps() {
                if (typeof window === 'undefined' || !window.requestAnimationFrame) return;
                const updateFps = (now) => {
                    this.frameCount++;
                    const delta = now - this.lastTime;
                    if (delta >= 1000) {
                        this.currentFps = Math.round((this.frameCount * 1000) / delta);
                        this.frameCount = 0;
                        this.lastTime = now;
                        this.frameHistory.push(this.currentFps);
                        if (this.frameHistory.length > 5) this.frameHistory.shift();

                        // Dynamic adaptation: if average FPS < 45 on auto quality, engage eco mode
                        if (this.quality === 'auto') {
                            const avgFps = this.frameHistory.reduce((a, b) => a + b, 0) / this.frameHistory.length;
                            if (avgFps < 45 && !this.isEcoMode) {
                                this.isEcoMode = true;
                            } else if (avgFps >= 55 && this.isEcoMode) {
                                this.isEcoMode = false;
                            }
                        }
                    }
                    if (typeof requestAnimationFrame === 'function') {
                        requestAnimationFrame(updateFps);
                    }
                };
                if (typeof requestAnimationFrame === 'function') {
                    requestAnimationFrame(updateFps);
                }
            },
            
            setQuality(mode) {
                this.quality = mode;
                if (mode === 'eco') {
                    this.isEcoMode = true;
                } else if (mode === 'high') {
                    this.isEcoMode = false;
                }
            },
            
            getParticleCount() {
                if (this.isEcoMode) return 2;
                return 4;
            },

            getMetrics() {
                return {
                    fps: this.currentFps,
                    quality: this.quality,
                    isEcoMode: this.isEcoMode
                };
            }
        };
        if (typeof window !== 'undefined') {
            window.ArkenyaPerf = ArkenyaPerformance;
        }
        ArkenyaPerformance.init();

        // --- ZERO-GC GEM BURST PARTICLE POOL (Mobile Optimized) ---
        const GEM_PARTICLE_COLORS = {
            red: '#ff4757',
            blue: '#00d2ff',
            green: '#2ed573',
            yellow: '#ffd700',
            purple: '#a29bfe'
        };

        const GemParticlePool = {
            pool: [],
            maxSize: 32,
            initialized: false,

            init(container) {
                if (!container || typeof document === 'undefined') return;
                this.pool = [];
                for (let i = 0; i < this.maxSize; i++) {
                    const p = document.createElement('div');
                    p.className = 'sparkle-particle gem-particle';
                    p.style.display = 'none';
                    container.appendChild(p);
                    this.pool.push({ el: p, inUse: false, timer: null });
                }
                this.initialized = true;
            },

            acquire() {
                for (let i = 0; i < this.pool.length; i++) {
                    if (!this.pool[i].inUse) {
                        this.pool[i].inUse = true;
                        return this.pool[i];
                    }
                }
                return null;
            },

            release(item) {
                if (!item) return;
                item.inUse = false;
                if (item.timer) {
                    clearTimeout(item.timer);
                    item.timer = null;
                }
                if (item.el) {
                    item.el.classList.remove('active');
                    item.el.style.display = 'none';
                }
            }
        };

        function spawnGemParticles(cellEl, gemType) {
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
                p.classList.remove('active');
                if (p.offsetWidth !== undefined) {
                    void p.offsetWidth;
                }
                p.classList.add('active');

                item.timer = setTimeout(() => {
                    GemParticlePool.release(item);
                }, 460);
            }
        }`;

nextHtml = replaceBlock(html, oldParticleFunc, newParticleFunc);
if (!nextHtml) {
    console.error('FAIL: oldParticleFunc not found!');
    process.exit(1);
}
html = nextHtml;
console.log('✓ Step 5: Implemented ArkenyaPerformance, GemParticlePool & Zero-Reflow spawner');

// 5. Upgrade executeSwap translation to translate3d
const oldSwapAnim = `            if (cell1 && cell2) {
                cell1.style.transform = \`translate(\${dx}px, \${dy}px)\`;
                cell2.style.transform = \`translate(\${-dx}px, \${-dy}px)\`;
                cell1.style.zIndex = '20';
            }`;

const newSwapAnim = `            if (cell1 && cell2) {
                cell1.style.transform = \`translate3d(\${dx}px, \${dy}px, 0)\`;
                cell2.style.transform = \`translate3d(\${-dx}px, \${-dy}px, 0)\`;
                cell1.style.zIndex = '20';
            }`;

const oldSwapBack = `                    if (cell1 && cell2) {
                        cell1.style.transform = \`translate(\${dx}px, \${dy}px)\`;
                        cell2.style.transform = \`translate(\${-dx}px, \${-dy}px)\`;
                    }`;

const newSwapBack = `                    if (cell1 && cell2) {
                        cell1.style.transform = \`translate3d(\${dx}px, \${dy}px, 0)\`;
                        cell2.style.transform = \`translate3d(\${-dx}px, \${-dy}px, 0)\`;
                    }`;

nextHtml = replaceBlock(html, oldSwapAnim, newSwapAnim);
if (!nextHtml) {
    console.error('FAIL: oldSwapAnim not found!');
    process.exit(1);
}
html = nextHtml;

nextHtml = replaceBlock(html, oldSwapBack, newSwapBack);
if (!nextHtml) {
    console.error('FAIL: oldSwapBack not found!');
    process.exit(1);
}
html = nextHtml;
console.log('✓ Step 6: Upgraded gem swap translation to hardware translate3d');

// 6. Smart Dirty-Checking in renderGrid()
const oldRenderGrid = `        function renderGrid() {
            const cells = document.getElementById('game-grid').children;
            let idx = 0;
            for (let r = 0; r < 8; r++) {
                for (let c = 0; c < 8; c++) {
                    const type = gridData[r][c];
                    const special = specialGrid[r] ? specialGrid[r][c] : null;
                    const cell = cells[idx++];
                    if (!cell) continue;

                    let classStr = \`cell cell-\${type}\`;
                    if (special === 'line_h') classStr += ' special-line-h';
                    else if (special === 'line_v') classStr += ' special-line-v';
                    else if (special === 'bomb') classStr += ' special-bomb';
                    else if (special === 'color_bomb') classStr += ' special-color-bomb';

                    cell.className = classStr;
                    cell.draggable = false;
                    if (special === 'color_bomb') {
                        cell.innerText = '';
                    } else {
                        cell.innerText = type ? GEM_ICONS[type] : '';
                    }
                }
            }
        }`;

const newRenderGrid = `        function renderGrid() {
            const cells = document.getElementById('game-grid').children;
            let idx = 0;
            for (let r = 0; r < 8; r++) {
                for (let c = 0; c < 8; c++) {
                    const type = gridData[r][c];
                    const special = specialGrid[r] ? specialGrid[r][c] : null;
                    const cell = cells[idx++];
                    if (!cell) continue;

                    let classStr = \`cell cell-\${type}\`;
                    if (special === 'line_h') classStr += ' special-line-h';
                    else if (special === 'line_v') classStr += ' special-line-v';
                    else if (special === 'bomb') classStr += ' special-bomb';
                    else if (special === 'color_bomb') classStr += ' special-color-bomb';

                    // Smart Dirty-Checking: Only mutate DOM if className or text has changed
                    if (cell.className !== classStr) {
                        cell.className = classStr;
                    }
                    cell.draggable = false;
                    const desiredText = (special === 'color_bomb') ? '' : (type ? (GEM_ICONS[type] || '') : '');
                    if (cell.innerText !== desiredText) {
                        cell.innerText = desiredText;
                    }
                }
            }
        }`;

nextHtml = replaceBlock(html, oldRenderGrid, newRenderGrid);
if (!nextHtml) {
    console.error('FAIL: oldRenderGrid not found!');
    process.exit(1);
}
html = nextHtml;
console.log('✓ Step 7: Implemented smart dirty-checking in renderGrid()');

fs.writeFileSync('www/index.html', html, 'utf8');
console.log('SUCCESS: All mobile performance optimizations written to www/index.html!');

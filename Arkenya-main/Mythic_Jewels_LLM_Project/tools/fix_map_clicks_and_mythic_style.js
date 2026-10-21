const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'www', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

console.log('Original index.html size:', html.length);

// 1. UPDATE CSS FOR MAP NODES AND ARROWS
const oldNodeCssPattern = /\.map-node\s*\{[\s\S]*?@keyframes pulseActiveNode\s*\{[\s\S]*?\}/;

const newNodeCss = `.map-node {
            position: absolute;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: radial-gradient(circle at 35% 35%, #2a3754 0%, #0f172a 75%, #050811 100%);
            border: 2px solid rgba(245, 197, 66, 0.55);
            color: #cbd5e1;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 15px;
            font-weight: 900;
            box-shadow: 0 8px 18px rgba(0,0,0,0.85), inset 0 1px 3px rgba(255,255,255,0.25);
            transform: translate(-50%, -50%);
            transition: transform 0.15s ease, box-shadow 0.15s ease;
            user-select: none;
            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation;
            cursor: pointer;
            z-index: 10;
        }

        .map-node:active {
            transform: translate(-50%, -50%) scale(0.92);
        }

        .map-node.unlocked {
            background: radial-gradient(circle at 35% 35%, #ffe885 0%, #f5c542 50%, #b8820c 100%);
            color: #1a0800;
            border: 2.5px solid #ffffff;
            box-shadow: 0 0 22px rgba(245, 197, 66, 0.85), 0 6px 15px rgba(0,0,0,0.7), inset 0 2px 5px rgba(255,255,255,0.8);
            text-shadow: 0 1px 1px rgba(255,255,255,0.9);
        }

        .map-node.completed {
            background: radial-gradient(circle at 35% 35%, #4ade80 0%, #16a34a 60%, #14532d 100%);
            color: #ffffff;
            border: 2px solid #ffe885;
            box-shadow: 0 0 18px rgba(34, 197, 94, 0.7), 0 6px 15px rgba(0,0,0,0.7), inset 0 2px 4px rgba(255,255,255,0.6);
            text-shadow: 0 1px 2px rgba(0,0,0,0.7);
        }

        .map-node.boss {
            width: 64px;
            height: 64px;
            font-size: 18px;
            border-width: 3px;
            background: radial-gradient(circle at 35% 35%, #f87171 0%, #dc2626 55%, #7f1d1d 100%);
            color: #ffffff;
            border-color: #ffd700;
            box-shadow: 0 0 28px rgba(239, 68, 68, 0.9), 0 8px 20px rgba(0,0,0,0.85), inset 0 2px 6px rgba(255,255,255,0.7);
        }

        .map-node.boss.locked {
            background: radial-gradient(circle at 35% 35%, #4a2020 0%, #200a0a 75%, #0e0404 100%);
            border-color: rgba(239, 68, 68, 0.5);
            box-shadow: 0 4px 15px rgba(0,0,0,0.8);
        }

        .map-node.boss.unlocked {
             background: radial-gradient(circle at 35% 35%, #ff8da1 0%, #e74c3c 60%, #990000 100%);
        }

        .map-node.active-target {
            transform: translate(-50%, -50%) scale(1.18);
            box-shadow: 0 0 32px rgba(56, 189, 248, 1), 0 8px 20px rgba(0,0,0,0.7), inset 0 2px 6px rgba(255,255,255,0.9);
            border-color: #ffffff;
            background: radial-gradient(circle at 35% 35%, #38bdf8 0%, #0284c7 55%, #0369a1 100%);
            color: #ffffff;
            animation: pulseActiveNode 2s infinite ease-in-out;
        }

        .map-node.locked {
            background: radial-gradient(circle at 35% 35%, #1e293b 0%, #0f172a 70%, #060913 100%);
            border-color: rgba(148, 163, 184, 0.4);
            color: #94a3b8;
            box-shadow: 0 4px 12px rgba(0,0,0,0.7), inset 0 1px 2px rgba(255,255,255,0.1);
        }

        .btn-nav-arrow {
            width: 34px;
            height: 34px;
            border-radius: 50%;
            background: linear-gradient(135deg, rgba(245, 197, 66, 0.25), rgba(15, 23, 42, 0.95));
            border: 1.5px solid var(--gold-primary);
            color: var(--gold-light);
            font-size: 13px;
            font-weight: 900;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.6), inset 0 1px 3px rgba(245, 197, 66, 0.4);
            transition: all 0.15s ease;
            user-select: none;
            touch-action: manipulation;
        }

        .btn-nav-arrow:active {
            transform: scale(0.92);
            background: rgba(245, 197, 66, 0.4);
        }

        @keyframes pulseActiveNode {
            0% { box-shadow: 0 0 20px rgba(0, 210, 255, 0.6), inset 0 2px 4px rgba(255,255,255,0.5); }
            50% { box-shadow: 0 0 40px rgba(0, 210, 255, 1), inset 0 2px 8px rgba(255,255,255,0.9); }
            100% { box-shadow: 0 0 20px rgba(0, 210, 255, 0.6), inset 0 2px 4px rgba(255,255,255,0.5); }
        }`;

if (oldNodeCssPattern.test(html)) {
    html = html.replace(oldNodeCssPattern, newNodeCss);
    console.log('✓ Successfully replaced map-node CSS');
} else {
    console.warn('! map-node CSS pattern did not match directly');
}

// 2. UPDATE MODAL LEVEL PREVIEW TOP BAR WITH ◀ AND ▶ BUTTONS
const oldPreviewTopBarPattern = /<!-- Top Bar: Title & Top-Right Non-Forced 'HİKAYEYİ DİNLE' Button -->[\s\S]*?<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; gap: 8px;">[\s\S]*?<div style="text-align: left;">[\s\S]*?<div id="preview-badge"[\s\S]*?<\/div>[\s\S]*?<div class="modal-title" id="preview-title"[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<div style="display: flex; align-items: center; gap: 8px;">[\s\S]*?<button id="btn-preview-listen-story"[\s\S]*?<\/button>[\s\S]*?<div class="modal-close"[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>/;

const newPreviewTopBar = `<!-- Top Bar: Title, Navigation Arrows & Top-Right Audio Button -->
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; gap: 6px;">
                        <button id="btn-preview-prev" class="btn-nav-arrow" onclick="navigatePreviewLevel(-1)" title="Önceki Bölüm">◀</button>
                        
                        <div style="text-align: center; flex: 1; min-width: 0;">
                            <div id="preview-badge" style="font-size: 10px; font-weight: 800; color: var(--gold-light); letter-spacing: 0.8px; text-transform: uppercase;">BÖLGE 1 • KRİSTAL VADİ</div>
                            <div class="modal-title" id="preview-title" style="font-size: 15.5px; margin-top: 2px; color: #fff; text-shadow: 0 0 12px rgba(245, 197, 66, 0.4); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">BÖLÜM 1</div>
                        </div>

                        <button id="btn-preview-next" class="btn-nav-arrow" onclick="navigatePreviewLevel(1)" title="Sonraki Bölüm">▶</button>

                        <div style="display: flex; align-items: center; gap: 6px;">
                            <button id="btn-preview-listen-story" class="btn-preview-story" onclick="togglePreviewStoryAudio()" title="Hikayeyi Dinle veya Duraklat">
                                <span id="preview-story-icon">🔊</span>
                                <span id="preview-story-text">DİNLE</span>
                                <div class="preview-soundwave" id="preview-soundwave" style="display: none;">
                                    <span></span><span></span><span></span><span></span>
                                </div>
                            </button>
                            <div class="modal-close" style="position: static; font-size: 18px; cursor: pointer; color: #94a3b8; padding: 4px;" onclick="closeModal('modal-level-preview')">✕</div>
                        </div>
                    </div>`;

if (oldPreviewTopBarPattern.test(html)) {
    html = html.replace(oldPreviewTopBarPattern, newPreviewTopBar);
    console.log('✓ Successfully injected ◀ and ▶ navigation buttons to preview modal');
} else {
    console.warn('! Preview top bar pattern did not match');
}

// 3. REWRITE NODE RENDERING IN openWorldMap
// Replace the entire for (let i = 1; i <= 50; i++) loop inside openWorldMap
const oldNodeLoopPattern = /for\s*\(\s*let\s+i\s*=\s*1;\s*i\s*<=\s*50;\s*i\+\+\s*\)\s*\{[\s\S]*?node\.setAttribute\('id',\s*`map-node-\$\{i\}`\);[\s\S]*?if\s*\(container\)\s*container\.appendChild\(node\);[\s\S]*?\}/;

const newNodeLoop = `for (let i = 1; i <= 50; i++) {
                const node = document.createElement('div');
                const isUnlocked = i <= unlockedLvl;
                const isCompleted = completedLvl[i] > 0;
                const isBoss = i % 10 === 0;
                const isMilestone = (i % 5 === 0);
                const isCurrentTarget = (i === unlockedLvl);

                node.className = \`map-node \${isUnlocked ? 'unlocked' : 'locked'} \${isCompleted ? 'completed' : ''} \${isBoss ? 'boss' : ''} \${isMilestone && !isBoss ? 'milestone-node' : ''} \${isCurrentTarget ? 'active-target' : ''}\`;
                
                if (!isUnlocked) {
                    node.innerHTML = \`<span style="font-size: 13px; font-weight: 800; opacity: 0.9;">\${i}</span><span style="position: absolute; bottom: -6px; right: -6px; font-size: 13px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.9));">🔒</span>\`;
                } else {
                    node.innerText = i;
                }
                node.setAttribute('id', \`map-node-\${i}\`);
                
                const y = 50 + (i * 65);
                const cWidth = (container && container.clientWidth > 0) ? container.clientWidth : Math.min(window.innerWidth || 380, 420);
                const cCenter = cWidth / 2;
                const maxAmp = Math.max(45, Math.min(85, (cWidth - 96) / 2));
                const normWave = Math.sin(i * 0.4) * 0.55 + Math.cos(i * 0.15) * 0.35 + Math.sin(i * 0.9) * 0.10;
                const x = Math.round(cCenter + (normWave * maxAmp));
                node.style.top = y + 'px';
                node.style.left = x + 'px';

                if (isCurrentTarget) {
                    activeNodeY = y;
                    const badge = document.createElement('div');
                    badge.className = 'active-node-pointer';
                    badge.innerText = '👇 AKTİF';
                    node.appendChild(badge);
                }

                pathCoords.push({ x: x + 24, y: y + 24 });

                if (isCompleted) {
                    const stars = document.createElement('div');
                    stars.className = 'node-stars';
                    stars.innerText = '⭐'.repeat(completedLvl[i]);
                    node.appendChild(stars);
                }

                // TOUCH & CLICK RESILIENCE: Works reliably on Android WebView, iOS & Desktop
                node.style.touchAction = 'manipulation';
                node.style.cursor = 'pointer';
                node.onclick = function(e) {
                    if (e) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                    openLevelPreview(i);
                };

                if (container) container.appendChild(node);
            }`;

if (oldNodeLoopPattern.test(html)) {
    html = html.replace(oldNodeLoopPattern, newNodeLoop);
    console.log('✓ Successfully patched openWorldMap node generation with universal click handlers');
} else {
    console.warn('! Node loop pattern did not match');
}

// 4. ALSO UPDATE renderWoodenStageCards() SO LOCKED CARDS ARE CLICKABLE PREVIEWS TOO
const oldWoodBtnPattern = /<button class="wood-card-btn \$\{isUnlocked \? '' : 'locked'\}" \$\{isUnlocked \? `onclick="openLevelPreview\(\$\{i\}\)"` : 'disabled'\}>[\s\S]*?<\/button>/;
const newWoodBtn = `<button class="wood-card-btn \${isUnlocked ? '' : 'locked'}" onclick="openLevelPreview(\${i})">
                        \${isUnlocked ? (isCompleted ? '🔄 İNCELE' : '⚡ OYNA') : '🔒 KİLİTLİ'}
                    </button>`;

if (oldWoodBtnPattern.test(html)) {
    html = html.replace(oldWoodBtnPattern, newWoodBtn);
    console.log('✓ Successfully patched renderWoodenStageCards button');
} else {
    console.warn('! Wood button pattern did not match');
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Updated index.html written successfully! New size:', html.length);

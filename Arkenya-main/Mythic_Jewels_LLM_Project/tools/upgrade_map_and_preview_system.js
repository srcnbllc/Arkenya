const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('=== UPGRADING MAP & LEVEL PREVIEW NAVIGATION SYSTEM ===\n');

const projectRoot = path.join(__dirname, '..');
const htmlPath = path.join(projectRoot, 'www', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// 1. Ensure highScores map exists in gameState
if (!html.includes('gameState.levelHighScores = gameState.levelHighScores || {};')) {
    html = html.replace(
        'gameState.completedLevels = gameState.completedLevels || {};',
        'gameState.completedLevels = gameState.completedLevels || {};\n            gameState.levelHighScores = gameState.levelHighScores || {};'
    );
}

// 2. In recordLevelVictory / handleVictory, save levelHighScore
const oldVictoryRecord = `            if (!gameState.completedLevels) gameState.completedLevels = {};
            gameState.completedLevels[curLvl] = Math.max(gameState.completedLevels[curLvl] || 0, starCount);`;

const newVictoryRecord = `            if (!gameState.completedLevels) gameState.completedLevels = {};
            gameState.completedLevels[curLvl] = Math.max(gameState.completedLevels[curLvl] || 0, starCount);
            if (!gameState.levelHighScores) gameState.levelHighScores = {};
            gameState.levelHighScores[curLvl] = Math.max(gameState.levelHighScores[curLvl] || 0, gameScore);`;

if (html.includes(oldVictoryRecord)) {
    html = html.replace(oldVictoryRecord, newVictoryRecord);
    console.log('✓ gameState.levelHighScores tracking hooked into victory logic.');
}

// 3. Update modal-level-preview HTML: Add Next/Prev Navigation controls & Flu Locked State
const oldPreviewModalCard = `<div class="modal-card" style="width: 92%; max-width: 410px; padding: 18px 16px; box-sizing: border-box; border: 1.5px solid var(--gold-primary); background: radial-gradient(circle at top, #151e33 0%, #090e1c 100%); box-shadow: 0 16px 45px rgba(0,0,0,0.9), 0 0 25px rgba(245,197,66,0.15); border-radius: 20px; max-height: 94vh; overflow-y: auto;">
                    
                    <!-- Top Bar: Title & Top-Right Non-Forced 'HİKAYEYİ DİNLE' Button -->
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; gap: 8px;">
                        <div style="text-align: left;">
                            <div id="preview-badge" style="font-size: 10px; font-weight: 800; color: var(--gold-light); letter-spacing: 0.8px; text-transform: uppercase;">BÖLGE 1 • KRİSTAL VADİ</div>
                            <div class="modal-title" id="preview-title" style="font-size: 16px; margin-top: 2px; color: #fff; text-shadow: 0 0 12px rgba(245, 197, 66, 0.4);">BÖLÜM 1</div>
                        </div>`;

const newPreviewModalCard = `<div class="modal-card" style="width: 92%; max-width: 420px; padding: 16px 14px; box-sizing: border-box; border: 1.5px solid var(--gold-primary); background: radial-gradient(circle at top, #151e33 0%, #090e1c 100%); box-shadow: 0 16px 45px rgba(0,0,0,0.95), 0 0 30px rgba(245,197,66,0.2); border-radius: 20px; max-height: 94vh; overflow-y: auto;">
                    
                    <!-- Top Navigation Bar: Prev (◀), Title & Stage Navigator, Next (▶) -->
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; gap: 6px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 8px;">
                        <button id="btn-preview-prev" onclick="navigatePreviewLevel(-1)" class="btn-nav-arrow" style="width: 38px; height: 38px; border-radius: 10px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); color: #fff; font-size: 16px; font-weight: 900; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s;">◀</button>
                        
                        <div style="text-align: center; flex: 1;">
                            <div id="preview-badge" style="font-size: 10px; font-weight: 800; color: var(--gold-light); letter-spacing: 0.8px; text-transform: uppercase;">BÖLGE 1 • KRİSTAL VADİ</div>
                            <div class="modal-title" id="preview-title" style="font-size: 15px; margin-top: 2px; color: #fff; text-shadow: 0 0 12px rgba(245, 197, 66, 0.4); font-weight: 900;">BÖLÜM 1</div>
                        </div>

                        <button id="btn-preview-next" onclick="navigatePreviewLevel(1)" class="btn-nav-arrow" style="width: 38px; height: 38px; border-radius: 10px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); color: #fff; font-size: 16px; font-weight: 900; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s;">▶</button>
                        <div class="modal-close" style="position: static; font-size: 18px; cursor: pointer; color: #94a3b8; padding: 4px; margin-left: 4px;" onclick="closeModal('modal-level-preview')">✕</div>
                    </div>`;

if (html.includes(oldPreviewModalCard)) {
    html = html.replace(oldPreviewModalCard, newPreviewModalCard);
    console.log('✓ modal-level-preview top navigation bar installed.');
}

// 4. Add Record / High-score banner & Locked Overlay inside preview modal
const oldActionButtons = `                    <!-- Action Buttons -->
                    <button class="btn-action btn-action-gold" style="height: 48px; font-size: 14.5px; width: 100%; margin-bottom: 8px;" onclick="startGameplay()">⚡ OYUNA BAŞLA (⚡ 1 Can)</button>
                    <button class="btn-action-amber" id="btn-preview-map" style="height: 40px; font-size: 13px; font-weight: 800; border-radius: 12px; width: 100%; display: flex; align-items: center; justify-content: center; background: linear-gradient(180deg, rgba(245,197,66,0.18) 0%, rgba(212,154,29,0.3) 100%); border: 1.5px solid var(--gold-primary); color: var(--gold-light); box-shadow: 0 2px 10px rgba(245,197,66,0.15); letter-spacing: 0.5px;" onclick="closeModal('modal-level-preview')">🗺️ HARİTAYA DÖN</button>`;

const newActionButtons = `                    <!-- Player Progress & Replay Record Box -->
                    <div id="preview-record-box" style="display: none; background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.35); border-radius: 12px; padding: 8px 12px; margin-bottom: 12px; text-align: left;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-size: 11px; font-weight: 800; color: #4ade80;">👑 SENİN EN YÜKSEK SKORUN:</span>
                            <span id="preview-record-score" style="font-size: 13px; font-weight: 900; color: #fff;">0</span>
                        </div>
                        <div id="preview-record-stars" style="font-size: 12px; margin-top: 2px;">⭐⭐⭐</div>
                        <div style="font-size: 9.5px; color: #cbd5e1; margin-top: 4px; line-height: 1.3;">
                            💡 <b>Strateji İpucu:</b> Bu bölümü daha az hamleyle bitirirsen kalan her hamlen +500 Ekstra Skor üretir ve toplam skorunu artırır!
                        </div>
                    </div>

                    <!-- Locked Warning Banner (Gelecek Kilitli Seviyeler İçin) -->
                    <div id="preview-locked-banner" style="display: none; background: rgba(239, 68, 68, 0.15); border: 1.5px dashed #ef4444; border-radius: 12px; padding: 12px; margin-bottom: 12px; text-align: center;">
                        <div style="font-size: 26px; margin-bottom: 2px;">🔒</div>
                        <div style="font-size: 13px; font-weight: 900; color: #fca5a5; letter-spacing: 0.5px;">BU DURAK HENÜZ KİLİTLİ!</div>
                        <div id="preview-locked-desc" style="font-size: 11px; color: #cbd5e1; margin-top: 4px;">
                            Bu mitolojik aşamaya geçmek için önce önceki bölümleri zaferle tamamlamalısın.
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <button id="btn-preview-start-play" class="btn-action btn-action-gold" style="height: 48px; font-size: 14.5px; width: 100%; margin-bottom: 8px;" onclick="startGameplay()">⚡ OYUNA BAŞLA (⚡ 1 Can)</button>
                    <button class="btn-action-amber" id="btn-preview-map" style="height: 40px; font-size: 13px; font-weight: 800; border-radius: 12px; width: 100%; display: flex; align-items: center; justify-content: center; background: linear-gradient(180deg, rgba(245,197,66,0.18) 0%, rgba(212,154,29,0.3) 100%); border: 1.5px solid var(--gold-primary); color: var(--gold-light); box-shadow: 0 2px 10px rgba(245,197,66,0.15); letter-spacing: 0.5px;" onclick="closeModal('modal-level-preview')">🗺️ HARİTAYA DÖN</button>`;

if (html.includes(oldActionButtons)) {
    html = html.replace(oldActionButtons, newActionButtons);
    console.log('✓ Record box and locked banner added to modal-level-preview.');
}

// 5. Update renderMapNodes: Allow tapping ALL 50 nodes (even locked ones)
const oldMapNodeTap = `                if (isUnlocked) {
                    node.style.cursor = 'pointer';
                    let lastNodeTap = 0;
                    const triggerNode = (e) => {
                        const now = Date.now();
                        if (now - lastNodeTap < 380) return;
                        lastNodeTap = now;
                        if (e) {
                            e.preventDefault();
                            e.stopPropagation();
                        }
                        openLevelPreview(i);
                    };
                    node.addEventListener('pointerup', triggerNode);
                }`;

const newMapNodeTap = `                // All nodes are interactable like professional survival & strategy maps
                node.style.cursor = 'pointer';
                let lastNodeTap = 0;
                const triggerNode = (e) => {
                    const now = Date.now();
                    if (now - lastNodeTap < 320) return;
                    lastNodeTap = now;
                    if (e) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                    openLevelPreview(i);
                };
                node.addEventListener('pointerup', triggerNode);
                node.addEventListener('click', triggerNode);`;

if (html.includes(oldMapNodeTap)) {
    html = html.replace(oldMapNodeTap, newMapNodeTap);
    console.log('✓ renderMapNodes updated: ALL 50 nodes are interactive and viewable.');
}

// 6. Comprehensive openLevelPreview and navigatePreviewLevel
const oldOpenLevelPreviewRegex = /function openLevelPreview\(levelId\)\s*\{[\s\S]*?(?=function openModal)/;

const newOpenLevelPreview = `function openLevelPreview(levelId) {
            levelId = Math.max(1, Math.min(50, parseInt(levelId) || 1));
            gameState.currentPreviewLevel = levelId;
            const unlockedLvl = gameState.unlockedLevel || 1;
            const completedLvl = gameState.completedLevels || {};
            const isUnlocked = (levelId <= unlockedLvl);
            const isCompleted = (completedLvl[levelId] > 0);
            const isCurrentActive = (levelId === unlockedLvl);

            // Update current playing level
            gameState.currentPlayingLevel = levelId;
            updateDynamicZoneBackground(levelId);

            // Stop any previously playing story audio
            if (typeof stopPreviewStoryAudio === 'function') stopPreviewStoryAudio();

            const levelInfo = LEVEL_DATA[levelId] || { 
                title: \`Bölüm \${levelId}\`, 
                desc: "Olimpos'un ötesinde bilinmeyen efsanevi topraklara adım atıyorsun...", 
                targetScore: 3500 + (levelId * 1500),
                maxMoves: 22
            };

            const saga = getThemeSagaForLevel(levelId);
            
            // 1. Title & Badge & Status
            const titleEl = document.getElementById('preview-title');
            if (titleEl) {
                const bossTag = (levelId % 10 === 0) ? " ⚔️ (BOSS)" : "";
                titleEl.textContent = \`BÖLÜM \${levelId}: \${levelInfo.title}\${bossTag}\`;
            }

            const badgeEl = document.getElementById('preview-badge');
            if (badgeEl && saga) {
                const zoneNum = Math.ceil(levelId / 10);
                badgeEl.textContent = \`BÖLGE \${zoneNum} • \${saga.themeTitle.toUpperCase()}\`;
            }

            // 2. Story / Lore box
            const themeTitleEl = document.getElementById('preview-theme-title');
            if (themeTitleEl) themeTitleEl.textContent = \`📜 DURAK EFSANESİ: \${levelInfo.title.toUpperCase()}\`;

            const storyEl = document.getElementById('preview-story');
            if (storyEl) {
                const descText = levelInfo.desc || (saga ? saga.storyText : "Bu bölgedeki kadim mühürleri uyandırmak için taşları stratejik eşleştir.");
                const tipText = levelInfo.tip ? \`<br><br><span style="color: #ffe885; font-weight: 700;">\${levelInfo.tip}</span>\` : "";
                storyEl.innerHTML = \`"\${descText}"\${tipText}\`;
            }

            // 3. Target Score & Moves
            const targetEl = document.getElementById('preview-target');
            if (targetEl) targetEl.textContent = (levelInfo.targetScore || 4000).toLocaleString();

            const movesEl = document.getElementById('preview-moves');
            if (movesEl) movesEl.textContent = levelInfo.maxMoves || 22;

            // 4. Navigation Buttons (Prev / Next Arrows)
            const prevBtn = document.getElementById('btn-preview-prev');
            const nextBtn = document.getElementById('btn-preview-next');
            if (prevBtn) {
                prevBtn.style.opacity = (levelId > 1) ? '1' : '0.3';
                prevBtn.style.pointerEvents = (levelId > 1) ? 'auto' : 'none';
            }
            if (nextBtn) {
                nextBtn.style.opacity = (levelId < 50) ? '1' : '0.3';
                nextBtn.style.pointerEvents = (levelId < 50) ? 'auto' : 'none';
            }

            // 5. High-score / Replay Box vs Locked Banner
            const recordBox = document.getElementById('preview-record-box');
            const lockedBanner = document.getElementById('preview-locked-banner');
            const startPlayBtn = document.getElementById('btn-preview-start-play');
            const storyBox = document.querySelector('.preview-saga-box');

            if (!isUnlocked) {
                // LOCKED LEVEL: Frosted / Flu aesthetic
                if (recordBox) recordBox.style.display = 'none';
                if (lockedBanner) {
                    lockedBanner.style.display = 'block';
                    const lockedDesc = document.getElementById('preview-locked-desc');
                    if (lockedDesc) {
                        lockedDesc.innerHTML = \`Bu durak henüz kilitli! Geçmek için önce <b>Bölüm \${unlockedLvl}</b>'e kadar tüm aşamaları tamamlamalısın.\`;
                    }
                }
                if (startPlayBtn) {
                    startPlayBtn.disabled = true;
                    startPlayBtn.style.opacity = '0.45';
                    startPlayBtn.style.background = '#475569';
                    startPlayBtn.style.cursor = 'not-allowed';
                    startPlayBtn.textContent = \`🔒 KİLİTLİ DURAK (Önce Bölüm \${unlockedLvl})\`;
                }
                if (storyBox) {
                    storyBox.style.filter = 'blur(1.5px)';
                    storyBox.style.opacity = '0.75';
                }
            } else {
                // UNLOCKED LEVEL: Crystal clear
                if (lockedBanner) lockedBanner.style.display = 'none';
                if (storyBox) {
                    storyBox.style.filter = 'none';
                    storyBox.style.opacity = '1';
                }

                if (isCompleted) {
                    // PREVIOUS COMPLETED LEVEL (REPLAY / RECORD MODE)
                    if (recordBox) {
                        recordBox.style.display = 'block';
                        const bestScore = (gameState.levelHighScores && gameState.levelHighScores[levelId]) 
                            ? gameState.levelHighScores[levelId] 
                            : Math.round(levelInfo.targetScore * 1.15);
                        const recScoreEl = document.getElementById('preview-record-score');
                        if (recScoreEl) recScoreEl.textContent = bestScore.toLocaleString() + ' PUAN';
                        
                        const starsEarned = completedLvl[levelId] || 3;
                        const recStarsEl = document.getElementById('preview-record-stars');
                        if (recStarsEl) recStarsEl.textContent = '⭐'.repeat(starsEarned) + ' (Zafer Kazanıldı)';
                    }
                    if (startPlayBtn) {
                        startPlayBtn.disabled = false;
                        startPlayBtn.style.opacity = '1';
                        startPlayBtn.style.background = 'linear-gradient(180deg, #38bdf8 0%, #0284c7 100%)';
                        startPlayBtn.style.cursor = 'pointer';
                        startPlayBtn.textContent = '🔄 REKOR İÇİN TEKRAR OYNA (⚡ 1 Can)';
                    }
                } else {
                    // CURRENT ACTIVE TARGET LEVEL
                    if (recordBox) recordBox.style.display = 'none';
                    if (startPlayBtn) {
                        startPlayBtn.disabled = false;
                        startPlayBtn.style.opacity = '1';
                        startPlayBtn.style.background = 'linear-gradient(180deg, #ffe885 0%, #f5c542 100%)';
                        startPlayBtn.style.cursor = 'pointer';
                        startPlayBtn.textContent = '⚡ OYUNA BAŞLA (⚡ 1 Can)';
                    }
                }
            }

            // 6. Preboosters & Hero ability card
            const preboostersWrap = document.getElementById('preview-preboosters-wrap');
            if (preboostersWrap) {
                preboostersWrap.style.display = (!isUnlocked || levelId < 5) ? 'none' : 'block';
            }

            const heroAbilityCard = document.getElementById('preview-hero-ability-card');
            if (heroAbilityCard) {
                if (isUnlocked && levelId >= 5) {
                    heroAbilityCard.style.display = 'block';
                    const activeHeroKey = (gameState && gameState.selectedHero && HEROES[gameState.selectedHero]) ? gameState.selectedHero : 'arkenya';
                    const heroDef = HEROES[activeHeroKey] || HEROES.arkenya;
                    const heroMeta = HERO_ABILITY_META[activeHeroKey] || HERO_ABILITY_META.arkenya;

                    const heroTag = document.getElementById('preview-hero-tag');
                    const heroIcon = document.getElementById('preview-hero-icon');
                    const abilityTitle = document.getElementById('preview-ability-title');
                    const abilityDesc = document.getElementById('preview-ability-desc');

                    if (heroTag) heroTag.textContent = heroDef.name;
                    if (heroIcon) heroIcon.textContent = heroMeta.icon;
                    if (abilityTitle) abilityTitle.textContent = \`\${heroMeta.name.toUpperCase()} (\${heroDef.ability})\`;
                    if (abilityDesc) abilityDesc.textContent = heroMeta.guideText;
                } else {
                    heroAbilityCard.style.display = 'none';
                }
            }

            openModal('modal-level-preview');
        }

        function navigatePreviewLevel(delta) {
            const cur = gameState.currentPreviewLevel || gameState.currentPlayingLevel || 1;
            const target = Math.max(1, Math.min(50, cur + delta));
            if (target !== cur) {
                openLevelPreview(target);
            }
        }
`;

html = html.replace(oldOpenLevelPreviewRegex, newOpenLevelPreview);
console.log('✓ openLevelPreview upgraded with full 50-stage browsing, replay records and locked frosted styling.');

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('✓ www/index.html updated successfully.');

// Sync all platforms
const syncOutput = execSync('node sync_distribution_targets.js', { cwd: projectRoot, encoding: 'utf8' });
console.log(syncOutput);

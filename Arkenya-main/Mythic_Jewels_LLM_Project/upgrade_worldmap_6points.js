const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'www', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8').replace(/\r\n/g, '\n');

// ============================================================================
// 1. FIX AUDIO FLOOD ON ANDROID EMULATOR (Stop continuous oscillator loop on WorldMap)
// ============================================================================
const oldSyncMusic = `        function syncMusicWithCurrentScreen(screenId) {
            if (!isBgmEnabled) return;
            const targetScreen = screenId || currentActiveScreen || 'screen-mainmenu';
            if (targetScreen === 'screen-gameplay') {
                playGameMusic();
            } else {
                playMenuMusic();
            }
        }`;

const newSyncMusic = `        function syncMusicWithCurrentScreen(screenId) {
            const targetScreen = screenId || currentActiveScreen || 'screen-mainmenu';
            // Android Emulator & Mobile WebView 60FPS Optimization:
            // Suspend continuous WebAudio oscillator scheduling on WorldMap so ranchu audio HAL never floods pcm_writei
            if (targetScreen === 'screen-worldmap') {
                stopAllMusic();
                try {
                    if (typeof sharedAudioContext !== 'undefined' && sharedAudioContext && sharedAudioContext.state === 'running' && !isPreviewStoryPlaying) {
                        sharedAudioContext.suspend().catch(() => {});
                    }
                } catch (e) {}
                return;
            }
            if (!isBgmEnabled) return;
            if (targetScreen === 'screen-gameplay') {
                playGameMusic();
            } else {
                playMenuMusic();
            }
        }`;

if (!html.includes(oldSyncMusic)) {
    throw new Error('Could not find oldSyncMusic in www/index.html');
}
html = html.replace(oldSyncMusic, newSyncMusic);

// ============================================================================
// 2. UPGRADE WORLD MAP HTML STRUCTURE (Collapsible Theme Info Drawer + Stage Strip + Floating Nav)
// ============================================================================
const oldWorldMapHeaderHtml = `                <!-- UNIFIED COMPACT ZONE NAVIGATION CONSOLE (Requirements 4 & 7) -->
                <div class="map-zone-header-wrap" id="map-zone-quick-nav">
                    <div class="map-zone-quick-nav-bar">
                        <button class="zone-nav-arrow" id="btn-zone-prev" onclick="navigateMapZone(-1)" title="Önceki Bölge">◀</button>
                        <div class="zone-nav-chip" id="zone-current-chip" onclick="cycleNextZone()">
                            <span id="zone-chip-icon">🏛️</span>
                            <span id="zone-chip-title">BÖLGE 1: KADİM TAPINAK (1-10)</span>
                        </div>
                        <button class="zone-nav-arrow" id="btn-zone-next" onclick="navigateMapZone(1)" title="Sonraki Bölge">▶</button>
                    </div>
                    <div class="zone-pills-row" id="zone-pills-row">
                        <button class="zone-pill-btn active" id="zone-pill-1" onclick="jumpToZone(1)"><svg class="mythic-inline-svg" viewBox="0 0 24 24"><path d="M3 10L12 4L21 10H3Z" fill="currentColor" fill-opacity="0.25"/><path d="M6 10V18M12 10V18M18 10V18M3 18H21"/></svg>1. Vadi</button>
                        <button class="zone-pill-btn" id="zone-pill-2" onclick="jumpToZone(2)"><svg class="mythic-inline-svg" viewBox="0 0 24 24"><path d="M12 3V21M6 6V10C6 12.5 8.5 14 12 14C15.5 14 18 12.5 18 10V6"/></svg>2. Fırtına</button>
                        <button class="zone-pill-btn" id="zone-pill-3" onclick="jumpToZone(3)"><svg class="mythic-inline-svg" viewBox="0 0 24 24"><path d="M12 2C15.5 6 18 9.5 17 14C16 17.5 14 20 12 20C10 20 8 17.5 7 14C6 9.5 8.5 6 12 2Z" fill="currentColor" fill-opacity="0.28"/></svg>3. Yeraltı</button>
                        <button class="zone-pill-btn" id="zone-pill-4" onclick="jumpToZone(4)"><svg class="mythic-inline-svg" viewBox="0 0 24 24"><path d="M12 2L4 5V11C4 16.5 7.5 20.5 12 22C16.5 20.5 20 16.5 20 11V5L12 2Z" fill="currentColor" fill-opacity="0.22"/></svg>4. Titan</button>
                        <button class="zone-pill-btn" id="zone-pill-5" onclick="jumpToZone(5)"><svg class="mythic-inline-svg" viewBox="0 0 24 24"><path d="M13 2L6 13H12L10 22L19 10H13L13 2Z" fill="currentColor" fill-opacity="0.3"/></svg>5. Zirve</button>
                    </div>
                </div>`;

const newWorldMapHeaderHtml = `                <!-- UNIFIED COMPACT ZONE NAVIGATION CONSOLE + COLLAPSIBLE THEME DRAWER (Issues 2, 4, 5) -->
                <div class="map-zone-header-wrap" id="map-zone-quick-nav">
                    <div class="map-zone-quick-nav-bar">
                        <button type="button" class="zone-nav-arrow" id="btn-zone-prev" onclick="event.stopPropagation(); navigateMapZone(-1);" title="Önceki Tema Bölgesi">◀</button>
                        <div class="zone-nav-chip" id="zone-current-chip" onclick="event.stopPropagation(); toggleZoneThemeDrawer();" title="Tema Bilgisi ve Hedefini Aç/Kapat">
                            <span id="zone-chip-icon">🏛️</span>
                            <span id="zone-chip-title">BÖLGE 1: KRİSTAL VADİ (1-10)</span>
                            <span class="zone-drawer-toggle-pill" id="zone-drawer-toggle-lbl">📜 Bilgi ▾</span>
                        </div>
                        <button type="button" class="zone-nav-arrow" id="btn-zone-next" onclick="event.stopPropagation(); navigateMapZone(1);" title="Sonraki Tema Bölgesi">▶</button>
                    </div>

                    <!-- 5 Zone Quick-Jump Pills -->
                    <div class="zone-pills-row" id="zone-pills-row">
                        <button type="button" class="zone-pill-btn active" id="zone-pill-1" onclick="event.stopPropagation(); jumpToZone(1);"><svg class="mythic-inline-svg" viewBox="0 0 24 24"><path d="M3 10L12 4L21 10H3Z" fill="currentColor" fill-opacity="0.25"/><path d="M6 10V18M12 10V18M18 10V18M3 18H21"/></svg>1. Vadi</button>
                        <button type="button" class="zone-pill-btn" id="zone-pill-2" onclick="event.stopPropagation(); jumpToZone(2);"><svg class="mythic-inline-svg" viewBox="0 0 24 24"><path d="M12 3V21M6 6V10C6 12.5 8.5 14 12 14C15.5 14 18 12.5 18 10V6"/></svg>2. Fırtına</button>
                        <button type="button" class="zone-pill-btn" id="zone-pill-3" onclick="event.stopPropagation(); jumpToZone(3);"><svg class="mythic-inline-svg" viewBox="0 0 24 24"><path d="M12 2C15.5 6 18 9.5 17 14C16 17.5 14 20 12 20C10 20 8 17.5 7 14C6 9.5 8.5 6 12 2Z" fill="currentColor" fill-opacity="0.28"/></svg>3. Yeraltı</button>
                        <button type="button" class="zone-pill-btn" id="zone-pill-4" onclick="event.stopPropagation(); jumpToZone(4);"><svg class="mythic-inline-svg" viewBox="0 0 24 24"><path d="M12 2L4 5V11C4 16.5 7.5 20.5 12 22C16.5 20.5 20 16.5 20 11V5L12 2Z" fill="currentColor" fill-opacity="0.22"/></svg>4. Titan</button>
                        <button type="button" class="zone-pill-btn" id="zone-pill-5" onclick="event.stopPropagation(); jumpToZone(5);"><svg class="mythic-inline-svg" viewBox="0 0 24 24"><path d="M13 2L6 13H12L10 22L19 10H13L13 2Z" fill="currentColor" fill-opacity="0.3"/></svg>5. Zirve</button>
                    </div>

                    <!-- Active Valley 10-Stage Quick Strip (Shows all 10 stages of current zone & jumps/opens on tap) -->
                    <div class="zone-stages-mini-strip" id="zone-stages-mini-strip"></div>

                    <!-- COLLAPSIBLE THEME LORE & GOAL ACCORDION DRAWER (Closed by default, opens downward on click, closable by user) -->
                    <div class="zone-theme-drawer" id="zone-theme-drawer" style="display: none;">
                        <div class="zone-theme-drawer-header">
                            <div style="display:flex; align-items:center; gap:6px;">
                                <span id="drawer-zone-badge" style="font-size:10px; font-weight:900; color:#ffe885; background:rgba(245,197,66,0.18); border:1px solid rgba(245,197,66,0.45); padding:2px 8px; border-radius:10px;">BÖLGE 1 TEMA REHBERİ</span>
                                <span id="drawer-zone-stars" style="font-size:10px; font-weight:800; color:#4ade80;">⭐ 0 / 30 Yıldız</span>
                            </div>
                            <button type="button" class="zone-drawer-close-x" onclick="event.stopPropagation(); toggleZoneThemeDrawer(false);" title="Bilgi Kartını Kapat">✕</button>
                        </div>
                        <div id="drawer-theme-title" style="font-size:13px; font-weight:900; color:#ffffff; margin:4px 0 4px; text-align:left;">🏛️ IŞIĞIN ŞAFAĞI VE HERKÜL VADİSİ</div>
                        <div id="drawer-myth-story" style="font-size:11px; color:#cbd5e1; line-height:1.45; font-style:italic; text-align:left; background:rgba(0,0,0,0.45); border-left:2.5px solid #f5c542; padding:7px 9px; border-radius:8px; margin-bottom:7px;">
                            "Olimpos'un kutsal kristalleri çalındığında gökler sarsıldı..."
                        </div>
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-bottom:7px; text-align:left;">
                            <div style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:8px; padding:5px 8px;">
                                <div style="font-size:9px; font-weight:800; color:#f5c542;">🛡️ BÖLGE MUHAFIZI</div>
                                <div id="drawer-hero-name" style="font-size:11px; font-weight:800; color:#fff;">Arkenya</div>
                            </div>
                            <div style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:8px; padding:5px 8px;">
                                <div style="font-size:9px; font-weight:800; color:#f87171;">⚔️ BÖLGE BOSS HEDEFİ</div>
                                <div id="drawer-boss-name" style="font-size:11px; font-weight:800; color:#fff;">Kronos'un Gölgesi</div>
                            </div>
                        </div>
                        <div style="background:rgba(56,189,248,0.12); border:1px solid rgba(56,189,248,0.35); border-radius:8px; padding:6px 9px; text-align:left; margin-bottom:8px;">
                            <div style="font-size:9.5px; font-weight:900; color:#38bdf8; text-transform:uppercase;">🎯 OYUN OYNAMA AMACI & TEMA HEDEFİ</div>
                            <div id="drawer-theme-goal" style="font-size:10.5px; color:#e2e8f0; line-height:1.35; margin-top:2px;">
                                Bu vadideki 10 durağı (Bölüm 1-10) hedef puana ulaşarak tamamla, kombolarla kahraman yeteneğini şarj et ve 10. Bölüm Boss'unu mağlup ederek yeni temanın kilidini aç!
                            </div>
                        </div>
                        <button type="button" class="zone-drawer-collapse-btn" onclick="event.stopPropagation(); toggleZoneThemeDrawer(false);">▲ TEMA BİLGİ KARTINI KAPAT / GİZLE</button>
                    </div>
                </div>

                <!-- Floating Map Quick Scroll Controls (Right Edge for 1-Tap & Smooth Navigation) -->
                <div class="map-floating-nav" id="map-floating-nav">
                    <button type="button" class="map-float-btn" onclick="event.stopPropagation(); scrollWorldMapBy(-280);" title="Haritada Yukarı Çık">▲</button>
                    <button type="button" class="map-float-btn active-focus" onclick="event.stopPropagation(); focusLevelOnMap(gameState.unlockedLevel || 1, false);" title="Aktif Durağa Git">🎯</button>
                    <button type="button" class="map-float-btn" onclick="event.stopPropagation(); scrollWorldMapBy(280);" title="Haritada Aşağı İn">▼</button>
                </div>`;

if (!html.includes(oldWorldMapHeaderHtml)) {
    throw new Error('Could not find oldWorldMapHeaderHtml in www/index.html');
}
html = html.replace(oldWorldMapHeaderHtml, newWorldMapHeaderHtml);

// ============================================================================
// 3. UPGRADE LEVEL PREVIEW MODAL HTML (#modal-level-preview) FOR ISSUE 3 & 6
// ============================================================================
const oldPreviewTopHtml = `                    <!-- Mythic Parchment Story Box with Continuous Saga Lore -->
                    <div class="preview-saga-box" style="background: linear-gradient(145deg, rgba(245,197,66,0.08) 0%, rgba(15,23,42,0.9) 100%); border: 1.5px solid rgba(245, 197, 66, 0.35); border-radius: 14px; padding: 12px 14px; margin-bottom: 14px; text-align: left; position: relative; box-shadow: inset 0 2px 10px rgba(0,0,0,0.5), 0 4px 15px rgba(0,0,0,0.3);">
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                            <span id="preview-theme-title" style="font-size: 11px; font-weight: 800; color: var(--gold-primary); text-transform: uppercase; letter-spacing: 0.5px;">📜 KADİM DESTAN</span>
                            <span id="preview-theme-status" style="font-size: 9.5px; background: rgba(245, 197, 66, 0.15); color: var(--gold-light); padding: 2px 6px; border-radius: 6px; font-weight: 700;">İSTEĞE BAĞLI ANLATIM</span>
                        </div>
                        <div id="preview-story" style="font-size: 11.5px; color: #e2e8f0; font-style: italic; line-height: 1.5; max-height: 110px; overflow-y: auto;">
                            "Hikaye yükleniyor..."
                        </div>
                    </div>`;

const newPreviewTopHtml = `                    <!-- Stage Emblem & Status Mode Banner (Issue 3: İlk Kez Oynanacak vs Daha Önce Oynanmış Durak) -->
                    <div id="preview-stage-status-card" style="display:flex; align-items:center; gap:10px; background:linear-gradient(135deg, rgba(245,197,66,0.14) 0%, rgba(15,23,42,0.95) 100%); border:1.5px solid rgba(245,197,66,0.45); border-radius:14px; padding:8px 12px; margin-bottom:10px; text-align:left;">
                        <div id="preview-stage-svg-emblem" style="width:38px; height:38px; border-radius:50%; background:radial-gradient(circle, rgba(245,197,66,0.28) 0%, rgba(15,23,42,0.95) 100%); border:1.5px solid #f5c542; display:flex; align-items:center; justify-content:center; color:#ffe885; flex-shrink:0; padding:6px; box-sizing:border-box;">🏛️</div>
                        <div style="flex:1; min-width:0;">
                            <div id="preview-stage-mode-badge" style="font-size:9.5px; font-weight:900; color:#38bdf8; letter-spacing:0.4px; text-transform:uppercase;">🌟 İLK KEZ OYNANACAK DURAK</div>
                            <div id="preview-stage-goal-summary" style="font-size:11px; color:#e2e8f0; font-weight:700; margin-top:2px; line-height:1.3;">Oyun Bilgileri: Hedef skora hamle bitmeden ulaş ve durağı fethet!</div>
                        </div>
                    </div>

                    <!-- Mythic Parchment Story Box with Continuous Saga Lore -->
                    <div class="preview-saga-box" style="background: linear-gradient(145deg, rgba(245,197,66,0.08) 0%, rgba(15,23,42,0.9) 100%); border: 1.5px solid rgba(245, 197, 66, 0.35); border-radius: 14px; padding: 10px 12px; margin-bottom: 10px; text-align: left; position: relative; box-shadow: inset 0 2px 10px rgba(0,0,0,0.5), 0 4px 15px rgba(0,0,0,0.3);">
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 5px;">
                            <span id="preview-theme-title" style="font-size: 11px; font-weight: 800; color: var(--gold-primary); text-transform: uppercase; letter-spacing: 0.5px;">📜 KADİM DESTAN</span>
                            <span id="preview-theme-status" style="font-size: 9.5px; background: rgba(245, 197, 66, 0.15); color: var(--gold-light); padding: 2px 6px; border-radius: 6px; font-weight: 700;">DURAK BİLGİSİ</span>
                        </div>
                        <div id="preview-story" style="font-size: 11px; color: #e2e8f0; font-style: italic; line-height: 1.45; max-height: 90px; overflow-y: auto;">
                            "Hikaye yükleniyor..."
                        </div>
                    </div>`;

if (!html.includes(oldPreviewTopHtml)) {
    throw new Error('Could not find oldPreviewTopHtml in www/index.html');
}
html = html.replace(oldPreviewTopHtml, newPreviewTopHtml);

// Also update the back button label in #modal-level-preview and #modal-defeat for 1-to-1 consistency (Issue 3 & 6)
html = html.replace(
    `<button class="btn-action-sub" id="btn-preview-map" style="min-height: 42px; height: auto; padding: 10px 14px; font-size: 13px; font-weight: 800; border-radius: 12px; width: 100%; display: flex; align-items: center; justify-content: center; letter-spacing: 0.5px; line-height: 1.25;" onclick="closeModal('modal-level-preview')">🗺️ HARİTAYA DÖN</button>`,
    `<button class="btn-action-sub" id="btn-preview-map" style="min-height: 42px; height: auto; padding: 10px 14px; font-size: 13px; font-weight: 800; border-radius: 12px; width: 100%; display: flex; align-items: center; justify-content: center; letter-spacing: 0.5px; line-height: 1.25;" onclick="closeModal('modal-level-preview')">⬅️ GERİ / ANA HARİTAYA DÖN</button>`
);

const oldDefeatModalHtml = `            <!-- MODAL: DEFEAT -->
            <div class="modal-overlay" id="modal-defeat">
                <div class="modal-card" style="width: 90%; max-width: 410px; padding: 20px 18px; box-sizing: border-box; text-align: center; border: 1.5px solid rgba(239, 68, 68, 0.6); background: radial-gradient(circle at top, #24131d 0%, #090e1c 100%); box-shadow: 0 16px 45px rgba(239, 68, 68, 0.35); border-radius: 20px; max-height: 94vh; overflow-y: auto;">
                    <div style="font-size: 42px; margin-bottom: 2px; animation: pulse 1.6s infinite alternate;">💔</div>
                    <div class="story-badge" style="display: inline-block; background: rgba(239, 68, 68, 0.2); border: 1px solid #ef4444; color: #fca5a5; padding: 3px 12px; border-radius: 20px; font-size: 10.5px; font-weight: 800; margin-bottom: 6px; letter-spacing: 0.5px; text-transform: uppercase;">SEFER TAMAMLANAMADI</div>
                    <div class="modal-title" style="color: #ffffff; font-size: 20px; font-weight: 900; margin-bottom: 4px;">BÖLÜM KAYBEDİLDİ</div>
                    <div style="font-size: 12px; color: #cbd5e1; line-height: 1.4; margin-bottom: 12px;">
                        Hedef puana ulaşılamadı ve 1 Kutsal Can kaybettin. Pes etme! Video izleyerek sonraki oyuna <b style="color: var(--gold-light);">+2 Ekstra Hamle</b> ile başla!
                    </div>`;

const newDefeatModalHtml = `            <!-- MODAL: DEFEAT (Synchronized 1-to-1 with Preview & Victory Summary Cards - Issue 6) -->
            <div class="modal-overlay" id="modal-defeat">
                <div class="modal-card" style="width: 90%; max-width: 410px; padding: 18px 16px; box-sizing: border-box; text-align: center; border: 1.5px solid rgba(239, 68, 68, 0.6); background: radial-gradient(circle at top, #24131d 0%, #090e1c 100%); box-shadow: 0 16px 45px rgba(239, 68, 68, 0.35); border-radius: 20px; max-height: 94vh; overflow-y: auto;">
                    <div id="defeat-stage-chip" class="story-badge" style="display: inline-block; background: rgba(239, 68, 68, 0.2); border: 1px solid #ef4444; color: #fca5a5; padding: 3px 12px; border-radius: 20px; font-size: 10.5px; font-weight: 800; margin-bottom: 6px; letter-spacing: 0.5px; text-transform: uppercase;">BÖLÜM 1 • KRİSTAL VADİ</div>
                    <div id="defeat-crest-icon" style="width: 48px; height: 48px; margin: 2px auto 6px; border-radius: 50%; background: rgba(239,68,68,0.15); border: 1.5px solid #ef4444; display: flex; align-items: center; justify-content: center; color: #fca5a5; padding: 8px; box-sizing: border-box;">💔</div>
                    <div class="modal-title" id="defeat-main-title" style="color: #ffffff; font-size: 19px; font-weight: 900; margin-bottom: 4px;">BÖLÜM TAMAMLANAMADI</div>
                    <div id="defeat-score-summary" style="background: rgba(0,0,0,0.45); border: 1px solid rgba(239,68,68,0.35); border-radius: 10px; padding: 8px 12px; margin-bottom: 10px; font-size: 11.5px; color: #e2e8f0; font-weight: 700;">
                        Ulaşılan Skor: <b style="color:#ffe885;">0</b> / Hedef Skor: <b style="color:#38bdf8;">4,000</b>
                    </div>
                    <div style="font-size: 11.5px; color: #cbd5e1; line-height: 1.4; margin-bottom: 12px;">
                        Hedef puana ulaşılamadı ve 1 Kutsal Can kaybettin. Pes etme! Video izleyerek sonraki oyuna <b style="color: var(--gold-light);">+2 Ekstra Hamle</b> ile başla!
                    </div>`;

if (!html.includes(oldDefeatModalHtml)) {
    throw new Error('Could not find oldDefeatModalHtml in www/index.html');
}
html = html.replace(oldDefeatModalHtml, newDefeatModalHtml);

// Also add Target Score & Moves summary strip inside #modal-story-scroll for 1-to-1 Start Card parity (Issue 6)
const oldStoryMechanicHtml = `                        <!-- Mechanic Pill -->
                        <div class="biome-mechanic-pill">
                            <b id="story-mechanic-title">⚡ Özel Mekanik:</b> <span id="story-mechanic-desc">Saf Eşleştirme</span>
                        </div>`;

const newStoryMechanicHtml = `                        <!-- Stage Target & Moves Strip (Issue 6: Start Card 1-to-1 Parity) -->
                        <div id="story-scroll-stage-metrics" style="display:flex; gap:8px; margin-bottom:8px;">
                            <div style="flex:1; background:rgba(245,197,66,0.12); border:1px solid rgba(245,197,66,0.35); border-radius:8px; padding:6px 8px; text-align:center;">
                                <div style="font-size:9px; color:#cbd5e1; font-weight:800;">🎯 HEDEF SKOR</div>
                                <div id="story-scroll-target-val" style="font-size:13px; color:#ffe885; font-weight:900;">4,000</div>
                            </div>
                            <div style="flex:1; background:rgba(56,189,248,0.12); border:1px solid rgba(56,189,248,0.35); border-radius:8px; padding:6px 8px; text-align:center;">
                                <div style="font-size:9px; color:#cbd5e1; font-weight:800;">🦶 TOPLAM HAMLE</div>
                                <div id="story-scroll-moves-val" style="font-size:13px; color:#38bdf8; font-weight:900;">22</div>
                            </div>
                        </div>
                        <!-- Mechanic Pill -->
                        <div class="biome-mechanic-pill">
                            <b id="story-mechanic-title">⚡ Özel Mekanik:</b> <span id="story-mechanic-desc">Saf Eşleştirme</span>
                        </div>`;

if (!html.includes(oldStoryMechanicHtml)) {
    throw new Error('Could not find oldStoryMechanicHtml in www/index.html');
}
html = html.replace(oldStoryMechanicHtml, newStoryMechanicHtml);

// ============================================================================
// 4. ADD CSS OVERRIDES FOR SCROLLING, COMPACT ALL-10-STAGES VIEW, DRAWER, AND MODALS
// ============================================================================
const cssInjectionPoint = `        /* MOJIII3 INSPIRED VICTORY CONFETTI CANVAS */`;
const newWorldMapCss = `        /* =========================================================================
           WORLD MAP 6-POINT MASTER UX & PERFORMANCE ENGINE (ANDROID & MOBILE)
           ========================================================================= */
        body.worldmap-view,
        body.worldmap-view #screen-worldmap,
        #screen-worldmap,
        #screen-worldmap #map-visual-view,
        #screen-worldmap #map-nodes-container,
        #screen-worldmap .map-node,
        #screen-worldmap .map-node-title-badge,
        #screen-worldmap .zone-trail-banner {
            touch-action: pan-y !important;
            -webkit-user-select: none;
            user-select: none;
        }

        #screen-worldmap.active {
            display: block !important;
            overflow-y: auto !important;
            overflow-x: hidden !important;
            -webkit-overflow-scrolling: touch !important;
            overscroll-behavior-y: contain !important;
            padding-top: max(env(safe-area-inset-top, 0px), 4px) !important;
            padding-bottom: calc(90px + env(safe-area-inset-bottom, 20px)) !important;
            cursor: grab;
        }
        #screen-worldmap.active.dragging-map {
            cursor: grabbing;
        }

        #screen-worldmap .map-top-bar {
            position: sticky !important;
            top: 0 !important;
            z-index: 300 !important;
            padding: 5px 10px 4px !important;
            background: rgba(8, 12, 22, 0.96) !important;
        }

        #screen-worldmap .map-zone-header-wrap {
            position: sticky !important;
            top: 42px !important;
            z-index: 295 !important;
            margin: 0 8px 4px !important;
            background: rgba(11, 17, 30, 0.97) !important;
            border: 1.5px solid rgba(245, 197, 66, 0.55) !important;
            border-radius: 13px !important;
            box-shadow: 0 6px 18px rgba(0, 0, 0, 0.85) !important;
        }

        .zone-drawer-toggle-pill {
            font-size: 9.5px;
            font-weight: 900;
            color: #1a0800;
            background: linear-gradient(180deg, #ffe885 0%, #f5c542 100%);
            padding: 2px 7px;
            border-radius: 10px;
            margin-left: 4px;
            border: 1px solid #ffffff;
            flex-shrink: 0;
            box-shadow: 0 0 8px rgba(245, 197, 66, 0.5);
        }

        .zone-stages-mini-strip {
            display: grid;
            grid-template-columns: repeat(10, 1fr);
            gap: 3px;
            padding: 3px 6px 5px;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
            background: rgba(5, 9, 18, 0.7);
            border-bottom-left-radius: 12px;
            border-bottom-right-radius: 12px;
        }

        .zone-stage-mini-btn {
            height: 22px;
            border-radius: 6px;
            border: 1px solid rgba(148, 163, 184, 0.3);
            background: rgba(30, 41, 59, 0.75);
            color: #94a3b8;
            font-size: 9.5px;
            font-weight: 900;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            padding: 0;
            transition: transform 0.12s ease, background 0.12s ease;
        }
        .zone-stage-mini-btn.completed {
            background: linear-gradient(180deg, #16a34a 0%, #14532d 100%);
            border-color: #86efac;
            color: #ffffff;
        }
        .zone-stage-mini-btn.active-target {
            background: linear-gradient(180deg, #38bdf8 0%, #0284c7 100%);
            border-color: #ffffff;
            color: #ffffff;
            box-shadow: 0 0 8px rgba(56, 189, 248, 0.85);
            transform: scale(1.06);
        }
        .zone-stage-mini-btn.boss-mini {
            border-color: #f87171;
        }

        .zone-theme-drawer {
            padding: 9px 11px 10px;
            border-top: 1.5px solid rgba(245, 197, 66, 0.35);
            background: linear-gradient(180deg, rgba(15, 23, 42, 0.99) 0%, rgba(7, 11, 20, 0.99) 100%);
            border-bottom-left-radius: 12px;
            border-bottom-right-radius: 12px;
            box-shadow: 0 12px 28px rgba(0, 0, 0, 0.9);
        }

        .zone-theme-drawer-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 4px;
        }

        .zone-drawer-close-x {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            border: 1px solid rgba(255, 255, 255, 0.25);
            background: rgba(255, 255, 255, 0.08);
            color: #f8fafc;
            font-size: 12px;
            font-weight: 900;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
        }

        .zone-drawer-collapse-btn {
            width: 100%;
            height: 30px;
            border-radius: 8px;
            border: 1px solid rgba(245, 197, 66, 0.45);
            background: linear-gradient(180deg, rgba(245, 197, 66, 0.2) 0%, rgba(15, 23, 42, 0.9) 100%);
            color: #ffe885;
            font-size: 10.5px;
            font-weight: 900;
            cursor: pointer;
            letter-spacing: 0.4px;
        }

        /* Compact Map Scroll Area so all 10 stages of each zone fit cleanly */
        #screen-worldmap .map-scroll-area {
            height: 3320px !important;
            min-height: 3320px !important;
        }

        #screen-worldmap .map-node {
            width: 44px !important;
            height: 44px !important;
        }
        #screen-worldmap .map-node.boss {
            width: 52px !important;
            height: 52px !important;
        }
        #screen-worldmap .map-node-icon {
            width: 18px !important;
            height: 18px !important;
        }
        #screen-worldmap .map-node-num {
            font-size: 10px !important;
        }
        #screen-worldmap .map-node-title-badge {
            padding: 3.5px 8px !important;
            max-width: min(168px, 43vw) !important;
        }
        #screen-worldmap .map-node-title-badge.badge-right {
            left: 48px !important;
        }
        #screen-worldmap .map-node-title-badge.badge-left {
            right: 48px !important;
        }

        /* Sleek Compact Zone Divider Ribbon (Never covers nodes!) */
        #screen-worldmap .zone-trail-banner {
            width: 82% !important;
            max-width: 320px !important;
            min-height: 32px !important;
            max-height: 34px !important;
            padding: 3px 10px !important;
            border-radius: 18px !important;
            z-index: 6 !important;
        }
        #screen-worldmap .zone-trail-subtitle {
            font-size: 8px !important;
        }
        #screen-worldmap .zone-trail-title {
            font-size: 10.5px !important;
        }

        /* Floating Right-Side Map Navigation Buttons */
        .map-floating-nav {
            position: fixed;
            right: 10px;
            bottom: calc(82px + env(safe-area-inset-bottom, 12px));
            z-index: 320;
            display: none;
            flex-direction: column;
            gap: 6px;
        }
        body.worldmap-view .map-floating-nav {
            display: flex;
        }
        .map-float-btn {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: rgba(11, 17, 30, 0.92);
            border: 1.5px solid rgba(245, 197, 66, 0.65);
            color: #ffe885;
            font-size: 14px;
            font-weight: 900;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.8);
            padding: 0;
        }
        .map-float-btn.active-focus {
            background: linear-gradient(180deg, #0284c7 0%, #0369a1 100%);
            border-color: #ffffff;
            color: #ffffff;
        }

        /* Force Instant Visibility on Active Modals (Zero Invisible Opacity Bug) */
        .modal-overlay.active {
            display: flex !important;
            visibility: visible !important;
            opacity: 1 !important;
            z-index: 20000 !important;
        }
        .modal-overlay.active .modal-card {
            opacity: 1 !important;
            transform: scale(1) !important;
            visibility: visible !important;
        }

        /* MOJIII3 INSPIRED VICTORY CONFETTI CANVAS */`;

if (!html.includes(cssInjectionPoint)) {
    throw new Error('Could not find cssInjectionPoint in www/index.html');
}
html = html.replace(cssInjectionPoint, newWorldMapCss);

// ============================================================================
// 5. UPGRADE WORLD MAP JS ENGINE (getMapNodeY, toggleZoneThemeDrawer, updateZoneQuickNav,
//    jumpToZone, focusLevelOnMap, Drag-to-Scroll Engine, and Non-Overlapping Banners)
// ============================================================================
const oldMapEngineBlock = `        var __stageCardsRendered = false;
        var __worldMapStateSignature = '';
        var __mapScrollRafPending = false;

        function getMapNodeY(levelNum) {
            const lvl = Math.max(1, Math.min(50, parseInt(levelNum) || 1));
            const zone = Math.ceil(lvl / 10);
            return 130 + ((lvl - 1) * 86) + ((zone - 1) * 110);
        }

        function setMapTab(tabMode, skipAutoFocus = false) {
            currentMapTab = tabMode;
            const btnVisual = document.getElementById('btn-tab-visual');
            const btnList = document.getElementById('btn-tab-list');
            const mapVisualView = document.getElementById('map-visual-view');
            const mapListView = document.getElementById('map-list-view');
            const zoneQuickNav = document.getElementById('map-zone-quick-nav');
            const zonePillsRow = document.getElementById('zone-pills-row');

            if (btnVisual) btnVisual.classList.toggle('active', tabMode === 'visual');
            if (btnList) btnList.classList.toggle('active', tabMode === 'list');
            
            if (mapVisualView) mapVisualView.style.display = (tabMode === 'visual' ? 'block' : 'none');
            if (zoneQuickNav) zoneQuickNav.style.display = (tabMode === 'visual' ? 'block' : 'none');
            if (zonePillsRow) zonePillsRow.style.display = (tabMode === 'visual' ? 'grid' : 'none');

            if (mapListView) {
                mapListView.classList.toggle('active', tabMode === 'list');
                mapListView.style.setProperty('display', tabMode === 'list' ? 'flex' : 'none', 'important');
            }

            const screenWorldMap = document.getElementById('screen-worldmap');
            if (tabMode === 'list') {
                if (screenWorldMap) screenWorldMap.scrollTop = 0;
                renderWoodenStageCards();
            } else if (!skipAutoFocus) {
                // Focus on active playable level when switching back to parkur
                const unlockedLvl = gameState.unlockedLevel || 1;
                focusLevelOnMap(unlockedLvl, false);
            }
        }

        function updateZoneQuickNav(zoneNum) {
            currentViewingZone = Math.max(1, Math.min(5, zoneNum));
            const zData = (typeof ZONE_DATA !== 'undefined' && ZONE_DATA[currentViewingZone]) ? ZONE_DATA[currentViewingZone] : { id: currentViewingZone, title: "BÖLGE", icon: "🏛️", levels: "1-10", themeColor: "#f5c542" };
            const heroData = (typeof ZONE_HEROES !== 'undefined' && ZONE_HEROES[currentViewingZone]) ? ZONE_HEROES[currentViewingZone] : { name: "Kahraman", title: "Şampiyon", icon: "🏛️" };

            const iconEl = document.getElementById('zone-chip-icon');
            const titleEl = document.getElementById('zone-chip-title');
            const navWrap = document.getElementById('map-zone-quick-nav');
            if (iconEl) iconEl.innerHTML = zData.icon;
            if (titleEl) {
                titleEl.innerText = \`BÖLGE \${zData.id}: \${zData.title} (\${zData.levels}) • \${heroData.name}\`;
                titleEl.style.color = zData.themeColor || '#ffe885';
            }
            if (navWrap && zData.themeColor) {
                navWrap.style.borderColor = zData.themeColor;
                navWrap.style.boxShadow = \`0 6px 18px rgba(0, 0, 0, 0.8), 0 0 12px \${zData.themeColor}40\`;
            }

            for (let z = 1; z <= 5; z++) {
                const pill = document.getElementById(\`zone-pill-\${z}\`);
                if (pill) {
                    const isActive = (z === currentViewingZone);
                    pill.classList.toggle('active', isActive);
                }
            }

            // Dynamically update background artwork for the active zone (mapOnly = true to avoid decoding gameplay hero textures during map scroll)
            if (typeof updateDynamicZoneBackground === 'function') {
                updateDynamicZoneBackground(currentViewingZone * 10 - 5, true);
            }
        }

        function navigateMapZone(delta) {
            const newZone = Math.max(1, Math.min(5, currentViewingZone + delta));
            jumpToZone(newZone);
        }

        function cycleNextZone() {
            const nextZone = (currentViewingZone >= 5) ? 1 : (currentViewingZone + 1);
            jumpToZone(nextZone);
        }

        function jumpToZone(zoneNum) {
            zoneNum = Math.max(1, Math.min(5, parseInt(zoneNum) || 1));
            if (currentMapTab !== 'visual') {
                setMapTab('visual', true);
            }
            updateZoneQuickNav(zoneNum);
            const screenWorldMap = document.getElementById('screen-worldmap');
            const anchor = document.getElementById(\`zone-anchor-\${zoneNum}\`);
            if (screenWorldMap) {
                let targetY = 0;
                if (zoneNum === 1) {
                    targetY = 0;
                } else if (anchor && anchor.offsetTop > 0) {
                    targetY = Math.max(0, anchor.offsetTop - 16);
                } else {
                    const targetLvl = (zoneNum - 1) * 10 + 1;
                    targetY = Math.max(0, getMapNodeY(targetLvl) - 135);
                }
                isProgrammaticMapScroll = true;
                if (mapScrollTimer) clearTimeout(mapScrollTimer);
                mapScrollTimer = setTimeout(() => { isProgrammaticMapScroll = false; }, 250);
                screenWorldMap.scrollTop = targetY;
            }
        }

        function focusLevelOnMap(levelNum, openPreviewModal = false) {
            levelNum = Math.max(1, Math.min(50, parseInt(levelNum) || 1));
            const nodeEl = document.getElementById(\`map-node-\${levelNum}\`);
            const screenWorldMap = document.getElementById('screen-worldmap');

            const zone = (typeof getZoneForLevel === 'function') ? getZoneForLevel(levelNum) : Math.ceil(levelNum / 10);
            updateZoneQuickNav(zone);

            if (screenWorldMap) {
                let targetY = Math.max(0, getMapNodeY(levelNum) - 240);
                if (nodeEl && nodeEl.offsetTop > 0) {
                    targetY = Math.max(0, nodeEl.offsetTop - 240);
                }
                isProgrammaticMapScroll = true;
                if (mapScrollTimer) clearTimeout(mapScrollTimer);
                mapScrollTimer = setTimeout(() => { isProgrammaticMapScroll = false; }, 250);
                screenWorldMap.scrollTop = targetY;
            }

            if (openPreviewModal) {
                gameState.currentPreviewLevel = levelNum;
                setTimeout(() => openLevelPreview(levelNum), 180);
            }
        }`;

const newMapEngineBlock = `        var __stageCardsRendered = false;
        var __worldMapStateSignature = '';
        var __mapScrollRafPending = false;
        var isZoneThemeDrawerOpen = false;

        // Compact 10-Stage Corridor Math: All 10 stages of each zone span 486px (fits cleanly in mobile viewport!)
        function getMapNodeY(levelNum) {
            const lvl = Math.max(1, Math.min(50, parseInt(levelNum) || 1));
            const zone = Math.ceil(lvl / 10);
            const idxInZone = (lvl - 1) % 10; // 0..9
            const zoneBaseY = 66 + (zone - 1) * 640;
            return zoneBaseY + (idxInZone * 54);
        }

        function toggleZoneThemeDrawer(forceState) {
            const drawer = document.getElementById('zone-theme-drawer');
            const toggleLbl = document.getElementById('zone-drawer-toggle-lbl');
            if (!drawer) return;
            isZoneThemeDrawerOpen = (typeof forceState === 'boolean') ? forceState : !isZoneThemeDrawerOpen;
            drawer.style.display = isZoneThemeDrawerOpen ? 'block' : 'none';
            if (toggleLbl) {
                toggleLbl.innerHTML = isZoneThemeDrawerOpen ? '▲ Kapat' : '📜 Bilgi ▾';
            }
        }

        function scrollWorldMapBy(deltaY) {
            const screenWorldMap = document.getElementById('screen-worldmap');
            if (!screenWorldMap) return;
            const maxScroll = Math.max(0, (screenWorldMap.scrollHeight || 3320) - (screenWorldMap.clientHeight || 680));
            const nextTop = Math.max(0, Math.min(maxScroll, screenWorldMap.scrollTop + deltaY));
            screenWorldMap.scrollTop = nextTop;
        }

        function setMapTab(tabMode, skipAutoFocus = false) {
            currentMapTab = tabMode;
            const btnVisual = document.getElementById('btn-tab-visual');
            const btnList = document.getElementById('btn-tab-list');
            const mapVisualView = document.getElementById('map-visual-view');
            const mapListView = document.getElementById('map-list-view');
            const zoneQuickNav = document.getElementById('map-zone-quick-nav');
            const zonePillsRow = document.getElementById('zone-pills-row');
            const floatingNav = document.getElementById('map-floating-nav');

            if (btnVisual) btnVisual.classList.toggle('active', tabMode === 'visual');
            if (btnList) btnList.classList.toggle('active', tabMode === 'list');
            
            if (mapVisualView) mapVisualView.style.display = (tabMode === 'visual' ? 'block' : 'none');
            if (zoneQuickNav) zoneQuickNav.style.display = (tabMode === 'visual' ? 'block' : 'none');
            if (zonePillsRow) zonePillsRow.style.display = (tabMode === 'visual' ? 'grid' : 'none');
            if (floatingNav) floatingNav.style.display = (tabMode === 'visual' ? 'flex' : 'none');

            if (mapListView) {
                mapListView.classList.toggle('active', tabMode === 'list');
                mapListView.style.setProperty('display', tabMode === 'list' ? 'flex' : 'none', 'important');
            }

            const screenWorldMap = document.getElementById('screen-worldmap');
            if (tabMode === 'list') {
                if (screenWorldMap) screenWorldMap.scrollTop = 0;
                renderWoodenStageCards();
            } else if (!skipAutoFocus) {
                const unlockedLvl = gameState.unlockedLevel || 1;
                focusLevelOnMap(unlockedLvl, false);
            }
        }

        function updateZoneQuickNav(zoneNum) {
            currentViewingZone = Math.max(1, Math.min(5, parseInt(zoneNum) || 1));
            const zData = (typeof ZONE_DATA !== 'undefined' && ZONE_DATA[currentViewingZone]) ? ZONE_DATA[currentViewingZone] : { id: currentViewingZone, title: "BÖLGE", name: "Kristal Vadi", icon: "🏛️", levels: "1-10", themeColor: "#f5c542" };
            const heroData = (typeof ZONE_HEROES !== 'undefined' && ZONE_HEROES[currentViewingZone]) ? ZONE_HEROES[currentViewingZone] : { name: "Arkenya", title: "Şampiyon", icon: "🏛️" };
            const bLore = (typeof BIOME_LORE !== 'undefined' && BIOME_LORE[currentViewingZone]) ? BIOME_LORE[currentViewingZone] : {
                name: zData.name || "Kristal Vadi",
                title: zData.title || "Işığın Şafağı",
                hero: heroData.name || "Arkenya",
                villain: "Kronos'un Gölgesi",
                mechanicTitle: "Saf Eşleştirme & Kombo",
                mechanicDesc: "3 veya daha fazla kutsal taşı eşleştirerek hedef skora ulaş.",
                storyText: "Olimpos'un kutsal kristalleri bu vadide parıldıyor."
            };

            const iconEl = document.getElementById('zone-chip-icon');
            const titleEl = document.getElementById('zone-chip-title');
            const navWrap = document.getElementById('map-zone-quick-nav');
            if (iconEl) iconEl.innerHTML = zData.icon;
            if (titleEl) {
                titleEl.innerText = \`BÖLGE \${zData.id}: \${zData.title} (\${zData.levels})\`;
                titleEl.style.color = zData.themeColor || '#ffe885';
            }
            if (navWrap && zData.themeColor) {
                navWrap.style.borderColor = zData.themeColor;
                navWrap.style.boxShadow = \`0 6px 18px rgba(0, 0, 0, 0.85), 0 0 12px \${zData.themeColor}40\`;
            }

            for (let z = 1; z <= 5; z++) {
                const pill = document.getElementById(\`zone-pill-\${z}\`);
                if (pill) {
                    const isActive = (z === currentViewingZone);
                    pill.classList.toggle('active', isActive);
                }
            }

            // Populate 10-Stage Mini Strip for Active Zone (Issue 2: All 10 stages in the valley visible & clickable)
            const startLvl = (currentViewingZone - 1) * 10 + 1;
            const endLvl = currentViewingZone * 10;
            const unlockedLvl = (gameState && gameState.unlockedLevel) ? gameState.unlockedLevel : 1;
            const completedLvl = (gameState && gameState.completedLevels) ? gameState.completedLevels : {};
            let earnedStarsInZone = 0;

            const miniStrip = document.getElementById('zone-stages-mini-strip');
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
            }

            // Populate Collapsible Theme Lore & Goal Drawer (Issue 5)
            const dBadge = document.getElementById('drawer-zone-badge');
            const dStars = document.getElementById('drawer-zone-stars');
            const dTitle = document.getElementById('drawer-theme-title');
            const dStory = document.getElementById('drawer-myth-story');
            const dHero = document.getElementById('drawer-hero-name');
            const dBoss = document.getElementById('drawer-boss-name');
            const dGoal = document.getElementById('drawer-theme-goal');

            if (dBadge) dBadge.innerText = \`BÖLGE \${currentViewingZone} (\${startLvl}-\${endLvl}) • \${(bLore.name || zData.title).toUpperCase()}\`;
            if (dStars) dStars.innerText = \`⭐ \${earnedStarsInZone} / 30 Yıldız\`;
            if (dTitle) dTitle.innerText = \`🏛️ \${bLore.title || zData.name}\`;
            if (dStory) dStory.innerText = \`"\${bLore.storyText}"\`;
            if (dHero) dHero.innerText = bLore.hero || heroData.name;
            if (dBoss) dBoss.innerText = bLore.bossName || bLore.villain || \`Bölüm \${endLvl} Boss\`;
            if (dGoal) {
                dGoal.innerHTML = \`<b>\${bLore.mechanicTitle}:</b> \${bLore.mechanicDesc} <br><span style="color:#ffe885;">🎯 Tema Hedefi:</span> Bu bölgedeki <b>Bölüm \${startLvl} - \${endLvl}</b> arasındaki tüm durakları tamamla ve <b>\${endLvl}. Bölüm Boss Savaşı</b>'nı kazan!\`;
            }

            // Dynamically update background artwork for the active zone
            if (typeof updateDynamicZoneBackground === 'function') {
                updateDynamicZoneBackground(currentViewingZone * 10 - 5, true);
            }
        }

        function navigateMapZone(delta) {
            let newZone = (currentViewingZone || 1) + delta;
            if (newZone < 1) newZone = 5;
            if (newZone > 5) newZone = 1;
            jumpToZone(newZone);
        }

        function cycleNextZone() {
            toggleZoneThemeDrawer();
        }

        function jumpToZone(zoneNum) {
            zoneNum = Math.max(1, Math.min(5, parseInt(zoneNum) || 1));
            if (currentMapTab !== 'visual') {
                setMapTab('visual', true);
            }
            updateZoneQuickNav(zoneNum);
            const screenWorldMap = document.getElementById('screen-worldmap');
            if (screenWorldMap) {
                // Frame all 10 stages of the selected zone cleanly from its 1st stage!
                const targetY = (zoneNum === 1) ? 0 : Math.max(0, (zoneNum - 1) * 640 - 6);
                isProgrammaticMapScroll = true;
                if (mapScrollTimer) clearTimeout(mapScrollTimer);
                mapScrollTimer = setTimeout(() => { isProgrammaticMapScroll = false; }, 550);
                screenWorldMap.scrollTop = targetY;
            }
        }

        function focusLevelOnMap(levelNum, openPreviewModal = false) {
            levelNum = Math.max(1, Math.min(50, parseInt(levelNum) || 1));
            const screenWorldMap = document.getElementById('screen-worldmap');

            const zone = (typeof getZoneForLevel === 'function') ? getZoneForLevel(levelNum) : Math.ceil(levelNum / 10);
            updateZoneQuickNav(zone);

            if (screenWorldMap) {
                // Keep all 10 stages of the active zone visible by aligning to the zone corridor top
                const zoneTopY = (zone === 1) ? 0 : Math.max(0, (zone - 1) * 640 - 6);
                const nodeY = getMapNodeY(levelNum);
                const viewH = screenWorldMap.clientHeight || 680;
                let targetY = zoneTopY;
                if (nodeY - zoneTopY > viewH - 180) {
                    targetY = Math.max(zoneTopY, nodeY - Math.round(viewH * 0.55));
                }
                isProgrammaticMapScroll = true;
                if (mapScrollTimer) clearTimeout(mapScrollTimer);
                mapScrollTimer = setTimeout(() => { isProgrammaticMapScroll = false; }, 550);
                screenWorldMap.scrollTop = targetY;
            }

            if (openPreviewModal) {
                gameState.currentPreviewLevel = levelNum;
                openLevelPreview(levelNum);
            }
        }`;

if (!html.includes(oldMapEngineBlock)) {
    throw new Error('Could not find oldMapEngineBlock in www/index.html');
}
html = html.replace(oldMapEngineBlock, newMapEngineBlock);

// ============================================================================
// 6. UPDATE openWorldMap BANNER POSITIONING, SVG VIEWBOX, SCROLL DETECTION & DRAG-TO-SCROLL
// ============================================================================
const oldBannerAndScrollBlock = `                    // 1. ZONE TRANSITION ARCHWAY BANNERS (Non-overlapping Dedicated Corridor)
                    if (i === 1 || i === 11 || i === 21 || i === 31 || i === 41) {
                        const zData = (typeof ZONE_DATA !== 'undefined' && ZONE_DATA[zone]) ? ZONE_DATA[zone] : { icon: "🏛️", levels: "1-10", desc: "Kadim Topraklar", name: "Bölge" };
                        const heroData = (typeof ZONE_HEROES !== 'undefined' && ZONE_HEROES[zone]) ? ZONE_HEROES[zone] : { name: "Kahraman", title: "Muhafız", avatar: "Assets/Art/hero_arkenya.jpg" };
                        const banner = document.createElement('div');
                        banner.className = \`zone-trail-banner zone-\${zone}\`;
                        banner.id = \`zone-anchor-\${zone}\`;
                        banner.setAttribute('data-level', String(i));
                        banner.style.top = (i === 1 ? '24px' : (y - 122) + 'px');
                        banner.onclick = (e) => {
                            if (e) e.stopPropagation();
                            openLevelPreview(i);
                        };
                        banner.innerHTML = \`
                            <div class="zone-trail-crest" style="background-image: url('\${heroData.avatar}'); background-size: cover; background-position: center top; width: 38px; height: 38px; border-radius: 50%; border: 2px solid var(--gold-primary); box-shadow: 0 0 8px rgba(245,197,66,0.5);" title="\${heroData.name} - \${heroData.title}"></div>
                            <div class="zone-trail-info">
                                <div class="zone-trail-subtitle">BÖLGE \${zone} (\${zData.levels}) • \${heroData.name}</div>
                                <div class="zone-trail-title">\${zData.name.toUpperCase()}</div>
                            </div>
                            <div class="zone-trail-jump-btn" title="Bölge Durağını Gör">\${zData.icon} \${zData.levels}</div>
                        \`;
                        frag.appendChild(banner);
                    }`;

const newBannerAndScrollBlock = `                    // 1. COMPACT NON-OVERLAPPING ZONE HEADER RIBBONS (Clicking opens Theme Info Drawer for that Zone)
                    if (i === 1 || i === 11 || i === 21 || i === 31 || i === 41) {
                        const zData = (typeof ZONE_DATA !== 'undefined' && ZONE_DATA[zone]) ? ZONE_DATA[zone] : { icon: "🏛️", levels: "1-10", desc: "Kadim Topraklar", name: "Bölge" };
                        const heroData = (typeof ZONE_HEROES !== 'undefined' && ZONE_HEROES[zone]) ? ZONE_HEROES[zone] : { name: "Kahraman", title: "Muhafız", avatar: "Assets/Art/hero_arkenya.jpg" };
                        const banner = document.createElement('div');
                        banner.className = \`zone-trail-banner zone-\${zone}\`;
                        banner.id = \`zone-anchor-\${zone}\`;
                        banner.setAttribute('data-zone', String(zone));
                        banner.style.top = (y - 48) + 'px';
                        banner.onclick = (e) => {
                            if (e) e.stopPropagation();
                            updateZoneQuickNav(zone);
                            toggleZoneThemeDrawer(true);
                        };
                        banner.innerHTML = \`
                            <div class="zone-trail-crest" style="background-image: url('\${heroData.avatar}'); background-size: cover; background-position: center top; width: 24px; height: 24px; border-radius: 50%; border: 1.5px solid var(--gold-primary);"></div>
                            <div class="zone-trail-info">
                                <div class="zone-trail-title">BÖLGE \${zone} (\${zData.levels}): \${zData.name.toUpperCase()}</div>
                            </div>
                            <div class="zone-trail-jump-btn" title="Tema Bilgisi ve Hedefini Aç">📜 Tema Bilgisi</div>
                        \`;
                        frag.appendChild(banner);
                    }`;

if (!html.includes(oldBannerAndScrollBlock)) {
    throw new Error('Could not find oldBannerAndScrollBlock in www/index.html');
}
html = html.replace(oldBannerAndScrollBlock, newBannerAndScrollBlock);

// Update SVG trail height from 5050 to 3320 and scroll thresholds + add Pointer Drag-to-Scroll Engine
const oldSvgAndScrollListener = `                    svgTrail.setAttribute("viewBox", \`0 0 \${cWidth} 5050\`);
                    svgTrail.setAttribute("preserveAspectRatio", "none");
                    const pathEl = document.createElementNS("http://www.w3.org/2000/svg", "path");
                    pathEl.setAttribute("d", dStr);
                    pathEl.setAttribute("class", "animated-map-trail");
                    pathEl.setAttribute("stroke", "#ffe885");
                    pathEl.setAttribute("stroke-width", "3.5");
                    pathEl.setAttribute("stroke-dasharray", "8,6");
                    pathEl.setAttribute("fill", "none");
                    pathEl.setAttribute("opacity", "0.85");
                    svgTrail.appendChild(pathEl);
                }

                __worldMapStateSignature = currentSignature;
                __stageCardsRendered = false;
            }

            setMapTab(currentMapTab || 'visual', true);

            // AUTOMATICALLY FOCUS ON ACTIVE PLAYABLE LEVEL
            if ((currentMapTab || 'visual') === 'visual') {
                focusLevelOnMap(unlockedLvl, autoOpenPreview);
            }

            // Add rAF-throttled scroll listener on worldmap to update zone chips on scroll (Requirement 7)
            const screenWorldMap = document.getElementById('screen-worldmap');
            if (screenWorldMap && !screenWorldMap.__hasMapScrollListener) {
                screenWorldMap.__hasMapScrollListener = true;
                screenWorldMap.addEventListener('scroll', () => {
                    if (currentMapTab !== 'visual' || isProgrammaticMapScroll || __mapScrollRafPending) return;
                    __mapScrollRafPending = true;
                    window.requestAnimationFrame(() => {
                        __mapScrollRafPending = false;
                        if (currentMapTab !== 'visual' || isProgrammaticMapScroll) return;
                        const st = screenWorldMap.scrollTop;
                        let detectedZone = 1;
                        if (st > 3650) detectedZone = 5;
                        else if (st > 2680) detectedZone = 4;
                        else if (st > 1710) detectedZone = 3;
                        else if (st > 740) detectedZone = 2;
                        else detectedZone = 1;

                        if (detectedZone !== currentViewingZone) {
                            updateZoneQuickNav(detectedZone);
                        }
                    });
                }, { passive: true });
            }`;

const newSvgAndScrollListener = `                    svgTrail.setAttribute("viewBox", \`0 0 \${cWidth} 3320\`);
                    svgTrail.setAttribute("preserveAspectRatio", "none");
                    const pathEl = document.createElementNS("http://www.w3.org/2000/svg", "path");
                    pathEl.setAttribute("d", dStr);
                    pathEl.setAttribute("class", "animated-map-trail");
                    pathEl.setAttribute("stroke", "#ffe885");
                    pathEl.setAttribute("stroke-width", "3.5");
                    pathEl.setAttribute("stroke-dasharray", "8,6");
                    pathEl.setAttribute("fill", "none");
                    pathEl.setAttribute("opacity", "0.85");
                    svgTrail.appendChild(pathEl);
                }

                __worldMapStateSignature = currentSignature;
                __stageCardsRendered = false;
            }

            setMapTab(currentMapTab || 'visual', true);

            // AUTOMATICALLY FOCUS ON ACTIVE PLAYABLE LEVEL
            if ((currentMapTab || 'visual') === 'visual') {
                focusLevelOnMap(unlockedLvl, autoOpenPreview);
            }

            // Add rAF-throttled scroll listener + Unified Mouse/Pointer/Touch Drag-to-Scroll Engine on #screen-worldmap
            const screenWorldMap = document.getElementById('screen-worldmap');
            if (screenWorldMap && !screenWorldMap.__hasMapScrollListener) {
                screenWorldMap.__hasMapScrollListener = true;
                screenWorldMap.addEventListener('scroll', () => {
                    if (currentMapTab !== 'visual' || isProgrammaticMapScroll || __mapScrollRafPending) return;
                    __mapScrollRafPending = true;
                    window.requestAnimationFrame(() => {
                        __mapScrollRafPending = false;
                        if (currentMapTab !== 'visual' || isProgrammaticMapScroll) return;
                        const st = screenWorldMap.scrollTop;
                        let detectedZone = 1;
                        if (st > 2350) detectedZone = 5;
                        else if (st > 1710) detectedZone = 4;
                        else if (st > 1070) detectedZone = 3;
                        else if (st > 430) detectedZone = 2;
                        else detectedZone = 1;

                        if (detectedZone !== currentViewingZone) {
                            updateZoneQuickNav(detectedZone);
                        }
                    });
                }, { passive: true });

                // Pointer/Mouse Drag-to-Scroll Engine (Enables effortless dragging in Android Emulator & Mobile)
                let isDraggingMap = false;
                let dragStartY = 0;
                let dragStartScrollTop = 0;
                let dragMovedDistance = 0;

                screenWorldMap.addEventListener('pointerdown', (e) => {
                    if (e.target && e.target.closest && e.target.closest('.map-top-bar, .map-zone-header-wrap, .map-floating-nav')) return;
                    isDraggingMap = true;
                    dragStartY = e.clientY;
                    dragStartScrollTop = screenWorldMap.scrollTop;
                    dragMovedDistance = 0;
                    screenWorldMap.classList.add('dragging-map');
                }, { passive: true });

                window.addEventListener('pointermove', (e) => {
                    if (!isDraggingMap) return;
                    const dy = e.clientY - dragStartY;
                    dragMovedDistance = Math.max(dragMovedDistance, Math.abs(dy));
                    if (dragMovedDistance > 8) {
                        screenWorldMap.scrollTop = Math.max(0, dragStartScrollTop - dy);
                    }
                }, { passive: true });

                const endMapDrag = (e) => {
                    if (!isDraggingMap) return;
                    isDraggingMap = false;
                    screenWorldMap.classList.remove('dragging-map');
                    if (dragMovedDistance <= 12 && e && e.target && e.target.closest) {
                        const hitLvl = e.target.closest('[data-level]');
                        if (hitLvl) {
                            const lvl = parseInt(hitLvl.getAttribute('data-level'), 10);
                            if (lvl >= 1 && lvl <= 50) {
                                openLevelPreview(lvl);
                            }
                        }
                    }
                };
                window.addEventListener('pointerup', endMapDrag, { passive: true });
                window.addEventListener('pointercancel', endMapDrag, { passive: true });
            }`;

if (!html.includes(oldSvgAndScrollListener)) {
    throw new Error('Could not find oldSvgAndScrollListener in www/index.html');
}
html = html.replace(oldSvgAndScrollListener, newSvgAndScrollListener);

// ============================================================================
// 7. UPGRADE openLevelPreview(levelId) FOR ISSUE 3 & 6
// ============================================================================
const oldOpenLevelPreviewStatusBlock = `            // 2. Story / Lore box with bespoke Mythic Stage Emblem
            const themeTitleEl = document.getElementById('preview-theme-title');
            if (themeTitleEl) {
                const lvlEmblem = (typeof LEVEL_ICONS !== 'undefined' && LEVEL_ICONS[levelId]) ? LEVEL_ICONS[levelId] : '';
                themeTitleEl.innerHTML = \`<span style="display:inline-flex;width:16px;height:16px;vertical-align:middle;margin-right:5px;color:#ffe885;">\${lvlEmblem}</span>DURAK EFSANESİ: \${levelInfo.title.toUpperCase()}\`;
            }`;

const newOpenLevelPreviewStatusBlock = `            // 2. Stage Emblem, Status Mode Card & Lore Box (Issue 3: İlk Kez Oynanacak vs Daha Önce Oynanmış Durak)
            const lvlEmblem = (typeof LEVEL_ICONS !== 'undefined' && LEVEL_ICONS[levelId]) ? LEVEL_ICONS[levelId] : '🏛️';
            const stageEmblemEl = document.getElementById('preview-stage-svg-emblem');
            const stageModeBadgeEl = document.getElementById('preview-stage-mode-badge');
            const stageGoalSummaryEl = document.getElementById('preview-stage-goal-summary');
            const statusCardEl = document.getElementById('preview-stage-status-card');
            const zoneNumForPreview = Math.ceil(levelId / 10);
            const biomeLoreForPreview = (typeof BIOME_LORE !== 'undefined' && BIOME_LORE[zoneNumForPreview]) ? BIOME_LORE[zoneNumForPreview] : { mechanicTitle: 'Saf Eşleştirme', mechanicDesc: '3 veya daha fazla taşı eşleştir.' };

            if (stageEmblemEl) stageEmblemEl.innerHTML = lvlEmblem;
            if (stageModeBadgeEl && stageGoalSummaryEl && statusCardEl) {
                if (!isUnlocked) {
                    statusCardEl.style.borderColor = 'rgba(239, 68, 68, 0.55)';
                    stageModeBadgeEl.style.color = '#fca5a5';
                    stageModeBadgeEl.textContent = \`🔒 KİLİTLİ DURAK • ÖN İZLEME BİLGİSİ\`;
                    stageGoalSummaryEl.innerHTML = \`Hedef: <b>\${(levelInfo.targetScore || 4000).toLocaleString()} Puan</b> (\${levelInfo.maxMoves || 22} Hamle) • Açmak için Bölüm \${unlockedLvl} tamamlanmalı.\`;
                } else if (isCompleted) {
                    const prevBest = (gameState.levelHighScores && gameState.levelHighScores[levelId]) ? gameState.levelHighScores[levelId] : Math.round((levelInfo.targetScore || 4000) * 1.15);
                    const prevStars = completedLvl[levelId] || 3;
                    statusCardEl.style.borderColor = 'rgba(74, 222, 128, 0.65)';
                    stageModeBadgeEl.style.color = '#4ade80';
                    stageModeBadgeEl.textContent = \`✅ TAMAMLANAN DURAK • ÖNCEKİ OYUN BİLGİLERİ & REKORUN\`;
                    stageGoalSummaryEl.innerHTML = \`Önceki Rekorun: <b style="color:#ffe885;">\${prevBest.toLocaleString()} Puan</b> (\${'⭐'.repeat(prevStars)}) • Rekorunu ve altınını artırmak için tekrar oyna!\`;
                } else {
                    statusCardEl.style.borderColor = 'rgba(56, 189, 248, 0.75)';
                    stageModeBadgeEl.style.color = '#38bdf8';
                    stageModeBadgeEl.textContent = \`🌟 İLK KEZ OYNANACAK • OYUN BİLGİLERİ & HEDEF\`;
                    stageGoalSummaryEl.innerHTML = \`Amaç: <b>\${levelInfo.maxMoves || 22} Hamlede \${(levelInfo.targetScore || 4000).toLocaleString()} Puan</b> topla! (\${biomeLoreForPreview.mechanicTitle})\`;
                }
            }

            const themeTitleEl = document.getElementById('preview-theme-title');
            if (themeTitleEl) {
                themeTitleEl.innerHTML = \`<span style="display:inline-flex;width:16px;height:16px;vertical-align:middle;margin-right:5px;color:#ffe885;">\${lvlEmblem}</span>DURAK EFSANESİ: \${levelInfo.title.toUpperCase()}\`;
            }`;

if (!html.includes(oldOpenLevelPreviewStatusBlock)) {
    throw new Error('Could not find oldOpenLevelPreviewStatusBlock in www/index.html');
}
html = html.replace(oldOpenLevelPreviewStatusBlock, newOpenLevelPreviewStatusBlock);

// ============================================================================
// 8. SYNCHRONIZE IN-GAME START CARD, HUD LEVEL BADGE, VICTORY & DEFEAT CARDS (ISSUE 6)
// ============================================================================

// 8A. openStoryScrollModal (Start Card)
const oldOpenStoryScroll = `            document.getElementById('story-scroll-icon').innerText = isBoss ? '👑' : (lore.icon || '📜');
            document.getElementById('story-scroll-badge').innerText = isBoss ? \`⚔️ BOSS SAVAŞI • BÖLÜM \${levelNum}\` : lore.badge;
            document.getElementById('story-scroll-title').innerText = isBoss ? \`⚔️ \${lore.bossName || lore.title}\` : \`🌟 YENİ BÖLGE: \${lore.title}\`;
            document.getElementById('story-scroll-text').innerText = currentStoryTextToSpeak;
            document.getElementById('story-scroll-hero').innerText = lore.hero;
            document.getElementById('story-scroll-villain').innerText = isBoss ? (lore.bossName || lore.villain) : lore.villain;
            document.getElementById('story-mechanic-title').innerText = '⚡ ' + lore.mechanicTitle;
            document.getElementById('story-mechanic-desc').innerText = lore.mechanicDesc;`;

const newOpenStoryScroll = `            const lvlInfoForStart = (typeof LEVEL_DATA !== 'undefined' && LEVEL_DATA[levelNum]) ? LEVEL_DATA[levelNum] : { title: \`Bölüm \${levelNum}\`, targetScore: 4000, maxMoves: 22 };
            const stageSvgIcon = (typeof LEVEL_ICONS !== 'undefined' && LEVEL_ICONS[levelNum]) ? LEVEL_ICONS[levelNum] : (isBoss ? '👑' : (lore.icon || '📜'));
            const iconWrap = document.getElementById('story-scroll-icon');
            if (iconWrap) {
                iconWrap.innerHTML = \`<span style="display:inline-flex;width:34px;height:34px;color:#ffe885;align-items:center;justify-content:center;">\${stageSvgIcon}</span>\`;
            }
            document.getElementById('story-scroll-badge').innerText = \`BÖLGE \${z} • BÖLÜM \${levelNum}: \${lvlInfoForStart.title.toUpperCase()}\`;
            document.getElementById('story-scroll-title').innerText = isBoss ? \`⚔️ \${lore.bossName || lore.title}\` : \`🌟 \${lore.title}\`;
            document.getElementById('story-scroll-text').innerText = currentStoryTextToSpeak;
            document.getElementById('story-scroll-hero').innerText = lore.hero;
            document.getElementById('story-scroll-villain').innerText = isBoss ? (lore.bossName || lore.villain) : lore.villain;
            document.getElementById('story-mechanic-title').innerText = '⚡ ' + lore.mechanicTitle + ':';
            document.getElementById('story-mechanic-desc').innerText = lore.mechanicDesc;
            const stTargetEl = document.getElementById('story-scroll-target-val');
            const stMovesEl = document.getElementById('story-scroll-moves-val');
            if (stTargetEl) stTargetEl.innerText = (lvlInfoForStart.targetScore || 4000).toLocaleString();
            if (stMovesEl) stMovesEl.innerText = lvlInfoForStart.maxMoves || 22;`;

if (!html.includes(oldOpenStoryScroll)) {
    throw new Error('Could not find oldOpenStoryScroll in www/index.html');
}
html = html.replace(oldOpenStoryScroll, newOpenStoryScroll);

// 8B. updateGameplayLevelBadge (In-Game HUD Level Badge — fixes LEVELS -> LEVEL_DATA and innerText -> innerHTML for SVG)
const oldUpdateGameplayLevelBadge = `        function updateGameplayLevelBadge() {
            const currentLvl = gameState.currentPlayingLevel || gameState.unlockedLevel || 1;
            const lvlDef = (typeof LEVELS !== 'undefined' && LEVELS[currentLvl]) ? LEVELS[currentLvl] : null;
            
            const badgeTitle = document.getElementById('gameplay-level-badge-title');
            const badgeTag = document.getElementById('gameplay-level-badge-tag');
            const badgeNext = document.getElementById('gameplay-level-badge-next');
            const badgeIcon = document.getElementById('gameplay-level-badge-icon');

            const nextLvl = currentLvl + 1;
            const nextLvlDef = (typeof LEVELS !== 'undefined' && LEVELS[nextLvl]) ? LEVELS[nextLvl] : null;

            if (badgeTitle) badgeTitle.innerText = lvlDef ? \`\${currentLvl}. \${lvlDef.name || 'Bölüm'}\` : \`Bölüm \${currentLvl}\`;
            if (badgeTag) badgeTag.innerText = lvlDef && lvlDef.targetScore ? \`HEDEF: \${lvlDef.targetScore.toLocaleString()}\` : "BÖLÜM HEDEFİ";
            if (badgeNext) badgeNext.innerText = nextLvlDef ? \`Sonraki: B.\${nextLvl} ➔\` : \`Sonraki: B.\${nextLvl} ➔\`;
            if (badgeIcon) {
                badgeIcon.innerText = (typeof LEVEL_ICONS !== 'undefined' && LEVEL_ICONS[currentLvl]) ? LEVEL_ICONS[currentLvl] : '🏛️';
            }
        }`;

const newUpdateGameplayLevelBadge = `        function updateGameplayLevelBadge() {
            const currentLvl = gameState.currentPlayingLevel || gameState.unlockedLevel || 1;
            const lvlDef = (typeof LEVEL_DATA !== 'undefined' && LEVEL_DATA[currentLvl]) ? LEVEL_DATA[currentLvl] : null;
            
            const badgeTitle = document.getElementById('gameplay-level-badge-title');
            const badgeTag = document.getElementById('gameplay-level-badge-tag');
            const badgeNext = document.getElementById('gameplay-level-badge-next');
            const badgeIcon = document.getElementById('gameplay-level-badge-icon');

            const nextLvl = Math.min(50, currentLvl + 1);
            const nextLvlDef = (typeof LEVEL_DATA !== 'undefined' && LEVEL_DATA[nextLvl]) ? LEVEL_DATA[nextLvl] : null;

            if (badgeTitle) badgeTitle.innerText = lvlDef ? \`\${currentLvl}. \${lvlDef.title || 'Bölüm'}\` : \`Bölüm \${currentLvl}\`;
            if (badgeTag) badgeTag.innerText = lvlDef && lvlDef.targetScore ? \`HEDEF: \${lvlDef.targetScore.toLocaleString()}\` : "BÖLÜM HEDEFİ";
            if (badgeNext) badgeNext.innerText = nextLvlDef ? \`Sonraki: \${nextLvl}. \${nextLvlDef.title}\` : \`Sonraki: B.\${nextLvl} ➔\`;
            if (badgeIcon) {
                const svgIcon = (typeof LEVEL_ICONS !== 'undefined' && LEVEL_ICONS[currentLvl]) ? LEVEL_ICONS[currentLvl] : '🏛️';
                badgeIcon.innerHTML = \`<span style="display:inline-flex;width:22px;height:22px;color:#ffe885;align-items:center;justify-content:center;">\${svgIcon}</span>\`;
            }
        }`;

if (!html.includes(oldUpdateGameplayLevelBadge)) {
    throw new Error('Could not find oldUpdateGameplayLevelBadge in www/index.html');
}
html = html.replace(oldUpdateGameplayLevelBadge, newUpdateGameplayLevelBadge);

// 8C. showVictory (Victory Summary Card 1-to-1 Stage Title & SVG Emblem)
const oldVictoryStageHeader = `            const stageChip = document.getElementById('victory-stage-chip');
            if (stageChip) {
                stageChip.innerText = \`BÖLÜM \${lvl} • \${biomeLore.name.toUpperCase()}\` + (isBoss ? " (BOSS)" : "");
            }

            const crestIcon = document.getElementById('victory-crest-icon');
            if (crestIcon) {
                crestIcon.innerText = (lvl === 50) ? '👑' : (isBoss ? '👾' : '🏆');
            }`;

const newVictoryStageHeader = `            const stageChip = document.getElementById('victory-stage-chip');
            if (stageChip) {
                stageChip.innerText = \`BÖLÜM \${lvl}: \${(levelInfo.title || '').toUpperCase()} • \${biomeLore.name.toUpperCase()}\` + (isBoss ? " (BOSS)" : "");
            }

            const crestIcon = document.getElementById('victory-crest-icon');
            if (crestIcon) {
                const vSvg = (typeof LEVEL_ICONS !== 'undefined' && LEVEL_ICONS[lvl]) ? LEVEL_ICONS[lvl] : '🏆';
                crestIcon.innerHTML = \`<div style="width:46px;height:46px;margin:0 auto;border-radius:50%;background:radial-gradient(circle,rgba(245,197,66,0.3) 0%,rgba(15,23,42,0.95) 100%);border:2px solid #f5c542;display:flex;align-items:center;justify-content:center;color:#ffe885;padding:8px;box-sizing:border-box;">\${vSvg}</div>\`;
            }`;

if (!html.includes(oldVictoryStageHeader)) {
    throw new Error('Could not find oldVictoryStageHeader in www/index.html');
}
html = html.replace(oldVictoryStageHeader, newVictoryStageHeader);

// 8D. declineSaveMe (Defeat Summary Card 1-to-1 Stage Title, SVG Emblem & Score vs Target)
const oldDeclineSaveMe = `            sfxDefeat();
            document.getElementById('modal-defeat').classList.add('active');
        }`;

const newDeclineSaveMe = `            sfxDefeat();
            const dLvl = gameState.currentPlayingLevel || 1;
            const dInfo = (typeof LEVEL_DATA !== 'undefined' && LEVEL_DATA[dLvl]) ? LEVEL_DATA[dLvl] : { title: \`Bölüm \${dLvl}\`, targetScore: gameTarget || 4000 };
            const dZone = (typeof getZoneForLevel === 'function') ? getZoneForLevel(dLvl) : Math.ceil(dLvl / 10);
            const dBiome = (typeof BIOME_LORE !== 'undefined' && BIOME_LORE[dZone]) ? BIOME_LORE[dZone] : { name: 'Kristal Vadi' };
            const dSvg = (typeof LEVEL_ICONS !== 'undefined' && LEVEL_ICONS[dLvl]) ? LEVEL_ICONS[dLvl] : '💔';
            const dChip = document.getElementById('defeat-stage-chip');
            const dCrest = document.getElementById('defeat-crest-icon');
            const dSummary = document.getElementById('defeat-score-summary');
            if (dChip) dChip.innerText = \`BÖLÜM \${dLvl}: \${(dInfo.title || '').toUpperCase()} • \${dBiome.name.toUpperCase()}\`;
            if (dCrest) dCrest.innerHTML = dSvg;
            if (dSummary) {
                dSummary.innerHTML = \`Ulaşılan Skor: <b style="color:#ffe885;">\${(gameScore || 0).toLocaleString()}</b> / Hedef Skor: <b style="color:#38bdf8;">\${(gameTarget || dInfo.targetScore || 4000).toLocaleString()}</b>\`;
            }
            document.getElementById('modal-defeat').classList.add('active');
        }`;

if (!html.includes(oldDeclineSaveMe)) {
    throw new Error('Could not find oldDeclineSaveMe in www/index.html');
}
html = html.replace(oldDeclineSaveMe, newDeclineSaveMe);

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Successfully applied all 6 World Map & Card Synchronization upgrades to www/index.html!');

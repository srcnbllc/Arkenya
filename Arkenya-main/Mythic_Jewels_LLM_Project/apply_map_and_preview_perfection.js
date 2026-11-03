const fs = require('fs');
const path = require('path');

console.log("=== APPLYING WORLD MAP & PREVIEW MODAL PERFECTION ===");

const indexPath = path.join(__dirname, 'www', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// 1. Ensure #zone-stages-mini-strip is completely hidden and empty
html = html.replace(/<div class="zone-stages-mini-strip"[^>]*>[\s\S]*?<\/div>/g, '<div class="zone-stages-mini-strip" id="zone-stages-mini-strip" style="display: none !important;"></div>');
if (!html.includes('id="zone-stages-mini-strip"')) {
    html = html.replace('<!-- COLLAPSIBLE THEME LORE', '<div class="zone-stages-mini-strip" id="zone-stages-mini-strip" style="display: none !important;"></div>\n                    <!-- COLLAPSIBLE THEME LORE');
}

// 2. Enhance CSS for #screen-worldmap, .map-bg-layers, and #modal-level-preview
const cssMarker = '/* =========================================================================\n           MODAL LEVEL PREVIEW: STICKY FOOTER, CRISP READABILITY & RETURN TO MAP';
const newCssBlock = `/* =========================================================================
           MODAL LEVEL PREVIEW: STICKY FOOTER, CRISP READABILITY & RETURN TO MAP
           ========================================================================= */
        #modal-level-preview.modal-overlay {
            z-index: 20000 !important;
            padding: max(env(safe-area-inset-top, 0px), 8px) 12px max(env(safe-area-inset-bottom, 0px), 10px) !important;
            box-sizing: border-box !important;
            display: none;
            align-items: center;
            justify-content: center;
            background: rgba(4, 7, 15, 0.82) !important;
            backdrop-filter: blur(6px) !important;
            -webkit-backdrop-filter: blur(6px) !important;
        }
        #modal-level-preview.modal-overlay.active {
            display: flex !important;
            visibility: visible !important;
            opacity: 1 !important;
        }
        #modal-level-preview .modal-card {
            max-height: 88vh !important;
            height: auto !important;
            width: 95% !important;
            max-width: 420px !important;
            display: flex !important;
            flex-direction: column !important;
            padding: 14px 14px 12px !important;
            box-sizing: border-box !important;
            overflow: hidden !important;
            border: 1.5px solid var(--gold-primary) !important;
            background: radial-gradient(circle at top, #151e33 0%, #090e1c 100%) !important;
            border-radius: 20px !important;
            box-shadow: 0 16px 45px rgba(0,0,0,0.92), 0 0 25px rgba(245,197,66,0.22) !important;
            pointer-events: auto !important;
        }
        #modal-level-preview .modal-preview-header {
            flex-shrink: 0 !important;
            width: 100% !important;
            border-bottom: 1px solid rgba(245, 197, 66, 0.22) !important;
            padding-bottom: 8px !important;
            margin-bottom: 8px !important;
        }
        #modal-level-preview .modal-preview-scroll-body {
            flex: 1 1 auto !important;
            min-height: 0 !important;
            overflow-y: auto !important;
            -webkit-overflow-scrolling: touch !important;
            padding-right: 4px !important;
            margin-bottom: 8px !important;
        }
        #modal-level-preview .modal-preview-footer-actions {
            flex-shrink: 0 !important;
            padding-top: 10px !important;
            border-top: 1.5px solid rgba(245, 197, 66, 0.35) !important;
            display: flex !important;
            flex-direction: column !important;
            gap: 8px !important;
            width: 100% !important;
            background: transparent !important;
        }
        #modal-level-preview .modal-preview-footer-actions button {
            margin-bottom: 0 !important;
            cursor: pointer !important;
            touch-action: manipulation !important;
            position: relative !important;
            z-index: 10 !important;
            pointer-events: auto !important;
        }
        #modal-level-preview #preview-story {
            font-size: 13px !important;
            line-height: 1.55 !important;
            color: #f8fafc !important;
            font-style: normal !important;
            max-height: none !important;
            overflow-y: visible !important;
            text-align: left !important;
        }
        .zone-stages-mini-strip {
            display: none !important;
            height: 0 !important;
            padding: 0 !important;
            margin: 0 !important;
            visibility: hidden !important;
        }`;

if (html.includes(cssMarker)) {
    const endMarker = '.zone-stages-mini-strip {';
    const nextClose = html.indexOf('}', html.indexOf(endMarker));
    const oldCss = html.substring(html.indexOf(cssMarker), nextClose + 1);
    html = html.replace(oldCss, newCssBlock);
    console.log("Updated Modal CSS Block.");
}

// 3. Replace the entire #modal-level-preview HTML with clean UTF-8 Greek mythological structure
const modalStartStr = '<!-- MODAL: LEVEL PREVIEW & THEME SAGA POPUP -->';
const modalEndStr = '<!-- MODAL: VICTORY (AAA Mythic Score, Star & Progression Showcase) -->';

const newModalHtml = `<!-- MODAL: LEVEL PREVIEW & THEME SAGA POPUP -->
            <div class="modal-overlay" id="modal-level-preview" onclick="if(event.target === this) closeModal('modal-level-preview', true);">
                <div class="modal-card">
                    <!-- Fixed Modal Header -->
                    <div class="modal-preview-header">
                        <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px;">
                            <button id="btn-preview-prev" class="btn-nav-arrow" onclick="navigatePreviewLevel(-1)" title="Önceki Durak">◀</button>
                            <div style="text-align: center; flex: 1; min-width: 0;">
                                <div id="preview-badge" style="font-size: 10px; font-weight: 800; color: var(--gold-light); letter-spacing: 0.8px; text-transform: uppercase;">BÖLGE 1 • KRİSTAL VADİ</div>
                                <div class="modal-title" id="preview-title" style="font-size: 16px; margin-top: 2px; color: #fff; text-shadow: 0 0 12px rgba(245, 197, 66, 0.45); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 900;">BÖLÜM 1</div>
                            </div>
                            <button id="btn-preview-next" class="btn-nav-arrow" onclick="navigatePreviewLevel(1)" title="Sonraki Durak">▶</button>
                            <button type="button" id="btn-preview-close" class="modal-close" style="position: static; width: 34px; height: 34px; border-radius: 50%; background: rgba(255,255,255,0.08); border: 1.5px solid rgba(245,197,66,0.5); font-size: 16px; font-weight: 900; cursor: pointer; color: #ffe885; display: flex; align-items: center; justify-content: center; padding: 0; flex-shrink: 0;" onclick="closeModal('modal-level-preview', true);" title="Kapat">✕</button>
                        </div>
                    </div>

                    <!-- Scrollable Content Body for Mobile Comfort -->
                    <div class="modal-preview-scroll-body">
                        <!-- Stage Status Mode Banner -->
                        <div id="preview-stage-status-card" style="display:flex; align-items:center; gap:10px; background:linear-gradient(135deg, rgba(245,197,66,0.14) 0%, rgba(15,23,42,0.95) 100%); border:1.5px solid rgba(245,197,66,0.45); border-radius:14px; padding:9px 12px; margin-bottom:10px; text-align:left;">
                            <div id="preview-stage-svg-emblem" style="width:40px; height:40px; border-radius:50%; background:radial-gradient(circle, rgba(245,197,66,0.28) 0%, rgba(15,23,42,0.95) 100%); border:1.5px solid #f5c542; display:flex; align-items:center; justify-content:center; color:#ffe885; flex-shrink:0; font-size:18px;">⚡</div>
                            <div style="flex:1; min-width:0;">
                                <div id="preview-stage-mode-badge" style="font-size:10px; font-weight:900; color:#38bdf8; text-transform:uppercase; letter-spacing:0.6px;">🌟 OYUN BİLGİSİ & HEDEF</div>
                                <div id="preview-stage-goal-summary" style="font-size:11.5px; color:#f1f5f9; line-height:1.35; margin-top:2px;">Hedefe ulaş ve bölümü tamamla.</div>
                            </div>
                        </div>

                        <!-- Mythic Lore Parchment Box -->
                        <div class="preview-saga-box" style="background: radial-gradient(circle at top, rgba(15, 23, 42, 0.95) 0%, rgba(4, 7, 15, 0.98) 100%); border: 1.5px solid rgba(245, 197, 66, 0.35); border-radius: 14px; padding: 11px 13px; margin-bottom: 10px; text-align: left; position: relative; box-shadow: inset 0 2px 10px rgba(0,0,0,0.5), 0 4px 15px rgba(0,0,0,0.3);">
                            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                                <span id="preview-theme-title" style="font-size: 11px; font-weight: 800; color: var(--gold-primary); text-transform: uppercase; letter-spacing: 0.5px;">📜 KADİM DESTAN</span>
                                <span id="preview-theme-status" style="font-size: 9.5px; background: rgba(245, 197, 66, 0.15); color: var(--gold-light); padding: 2px 7px; border-radius: 6px; font-weight: 700;">DURAK BİLGİSİ</span>
                            </div>
                            <div id="preview-story" style="font-size: 13px; color: #f8fafc; line-height: 1.55;">
                                "Olimpos'un kadim kristalleri bu durakta parıldıyor..."
                            </div>
                        </div>

                        <!-- Target & Moves Info Chips -->
                        <div style="display: flex; gap: 8px; margin-bottom: 10px; justify-content: space-between;">
                            <div style="flex: 1; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 8px 6px; text-align: center;">
                                <div style="font-size: 9.5px; color: #94a3b8; font-weight: 700; text-transform: uppercase;">🎯 HEDEF SKOR</div>
                                <div style="font-size: 15px; font-weight: 900; color: var(--gold-light); margin-top: 2px;" id="preview-target">4,000</div>
                            </div>
                            <div style="flex: 1; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 8px 6px; text-align: center;">
                                <div style="font-size: 9.5px; color: #94a3b8; font-weight: 700; text-transform: uppercase;">⏱️ TOPLAM HAMLE</div>
                                <div style="font-size: 15px; font-weight: 900; color: var(--accent-blue); margin-top: 2px;" id="preview-moves">22</div>
                            </div>
                        </div>

                        <!-- Expected Level Victory Rewards Banner -->
                        <div id="preview-reward-preview-box" style="background: rgba(245, 197, 66, 0.08); border: 1px solid rgba(245, 197, 66, 0.25); border-radius: 10px; padding: 8px 12px; margin-bottom: 10px; display: flex; align-items: center; justify-content: space-between;">
                            <div style="font-size: 11px; color: #cbd5e1; display: flex; align-items: center; gap: 6px;">
                                <span style="font-size: 15px;">🏆</span>
                                <span style="font-weight: 800; color: var(--gold-light);">Zafer Ödülü:</span>
                            </div>
                            <div id="preview-reward-preview-val" style="font-size: 12.5px; font-weight: 900; color: var(--gold-primary);">
                                +50 Altın • +1 Elmas
                            </div>
                        </div>

                        <!-- Hero Ability Announcement Card -->
                        <div id="preview-hero-ability-card" style="display: none; margin-bottom: 10px; background: radial-gradient(circle, rgba(245,197,66,0.15) 0%, rgba(15,23,42,0.85) 100%); border: 1.5px solid var(--gold-primary); border-radius: 12px; padding: 10px 12px; text-align: left;">
                            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                                <span style="font-size: 10px; font-weight: 800; color: #22c55e; letter-spacing: 0.5px; text-transform: uppercase;">⚡ KAHRAMAN YETENEĞİ</span>
                                <span id="preview-hero-tag" style="font-size: 9px; background: rgba(245,197,66,0.2); color: var(--gold-light); padding: 1px 6px; border-radius: 6px; font-weight: 800;">ARKENYA</span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <div id="preview-hero-icon" style="font-size: 22px;">⚡</div>
                                <div style="flex: 1;">
                                    <div id="preview-ability-title" style="font-size: 12px; font-weight: 900; color: #fff;">İLAHİ DARBE</div>
                                    <div id="preview-ability-desc" style="font-size: 10.5px; color: #cbd5e1; line-height: 1.3; margin-top: 2px;">
                                        Kombolarla sayacı %100 doldur, engelleri patlat!
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Optional Boosters -->
                        <div id="preview-preboosters-wrap" style="margin-bottom: 10px; background: rgba(0,0,0,0.3); border: 1px solid rgba(245, 197, 66, 0.2); border-radius: 12px; padding: 8px 10px;">
                            <div style="font-size: 10px; font-weight: 800; color: var(--gold-primary); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; display: flex; justify-content: space-between; align-items: center;">
                                <span>⚡ BÖLÜM TAKVİYELERİ</span>
                                <span style="font-size: 9px; color: #94a3b8; font-weight: 600;">İsteğe Bağlı</span>
                            </div>
                            <div style="display: flex; gap: 8px;">
                                <div id="chip-prebooster-moves" class="prebooster-chip" onclick="togglePreBooster('moves')" style="flex: 1; padding: 6px 6px; border-radius: 9px; border: 1px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.04); cursor: pointer; text-align: center; transition: all 0.2s;">
                                    <div style="font-size: 11px; font-weight: 700; color: #cbd5e1;">🏹 +3 Hamle</div>
                                    <div style="font-size: 9.5px; color: var(--gold-light); font-weight: 800; margin-top: 2px;">100 Altın</div>
                                </div>
                                <div id="chip-prebooster-bomb" class="prebooster-chip" onclick="togglePreBooster('bomb')" style="flex: 1; padding: 6px 6px; border-radius: 9px; border: 1px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.04); cursor: pointer; text-align: center; transition: all 0.2s;">
                                    <div style="font-size: 11px; font-weight: 700; color: #cbd5e1;">💣 Hazır Bomba</div>
                                    <div style="font-size: 9.5px; color: var(--gold-light); font-weight: 800; margin-top: 2px;">180 Altın</div>
                                </div>
                            </div>
                        </div>

                        <!-- Player Progress & Replay Record Box -->
                        <div id="preview-record-box" style="display: none; background: rgba(34, 197, 94, 0.12); border: 1.5px solid rgba(74, 222, 128, 0.4); border-radius: 14px; padding: 10px 14px; margin-bottom: 10px; text-align: left; box-shadow: 0 4px 16px rgba(0,0,0,0.5);">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                                <span style="font-size: 11px; font-weight: 800; color: #4ade80;">🌟 EN YÜKSEK SKORUN:</span>
                                <span id="preview-record-score" style="font-size: 14px; font-weight: 900; color: #fff;">0 PUAN</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                                <div id="preview-record-stars" style="font-size: 13px;">⭐⭐⭐ (Zafer Kazanıldı)</div>
                                <div id="preview-record-plays" style="font-size: 10.5px; font-weight: 800; color: #38bdf8;">🎮 1 Kez Oynandı</div>
                            </div>
                            <div style="display: flex; gap: 8px; margin-bottom: 6px; padding: 6px 8px; background: rgba(0,0,0,0.3); border-radius: 8px;">
                                <div style="flex: 1; font-size: 10.5px; color: #ffe885; font-weight: 700;">💰 Kazanılan: <span id="preview-record-gold">+150 Altın</span></div>
                                <div style="flex: 1; font-size: 10.5px; color: #38bdf8; font-weight: 700;">💎 Elmas: <span id="preview-record-gems">+2 Elmas</span></div>
                            </div>
                            <div style="font-size: 10.5px; color: #cbd5e1; line-height: 1.35;">
                                💡 <b>Zafer İpucu:</b> Bu bölümü tekrar oynayarak skor rekorunu kırabilir, ekstra altın ve lig puanı toplayabilirsin!
                            </div>
                        </div>

                        <!-- Locked Warning Banner -->
                        <div id="preview-locked-banner" style="display: none; background: rgba(239, 68, 68, 0.15); border: 1.5px dashed #ef4444; border-radius: 12px; padding: 12px; margin-bottom: 10px; text-align: center;">
                            <div style="font-size: 24px; margin-bottom: 2px;">🔒</div>
                            <div style="font-size: 13px; font-weight: 900; color: #fca5a5; letter-spacing: 0.5px;">BU DURAK HENÜZ KİLİTLİ!</div>
                            <div id="preview-locked-desc" style="font-size: 11px; color: #cbd5e1; margin-top: 4px;">
                                Bu mitolojik aşamaya geçmek için önce önceki bölümleri zaferle tamamlamalısın.
                            </div>
                        </div>
                    </div> <!-- end .modal-preview-scroll-body -->

                    <!-- Sticky Bottom Action Footer (Always Visible on Any Mobile Viewport) -->
                    <div class="modal-preview-footer-actions">
                        <button id="btn-preview-start-play" class="btn-action btn-action-gold" style="height: 48px; font-size: 14.5px; width: 100%; margin-bottom: 6px;" onclick="startGameplay();">⚔️ OYUNA BAŞLA (⚡ 1 Can)</button>
                        <button id="btn-preview-next-stage" class="btn-action-gold" style="display: none; height: 44px; font-size: 13.5px; width: 100%; margin-bottom: 6px; border-radius: 12px; background: linear-gradient(180deg, #38bdf8 0%, #0284c7 100%); border: 1.5px solid #7dd3fc; color: #ffffff;" onclick="playNextStageFromPreview();">⏩ SONRAKİ BÖLÜME GEÇ ➔</button>
                        <button class="btn-action-sub" id="btn-preview-map" style="min-height: 42px; height: auto; padding: 10px 14px; font-size: 13px; font-weight: 800; border-radius: 12px; width: 100%; display: flex; align-items: center; justify-content: center; letter-spacing: 0.5px; line-height: 1.25;" onclick="closeModal('modal-level-preview', true);">⬅️ GERİ / ANA HARİTAYA DÖN</button>
                    </div> <!-- end .modal-preview-footer-actions -->
                </div>
            </div>\n\n            `;

const pStart = html.indexOf(modalStartStr);
const pEnd = html.indexOf(modalEndStr);
if (pStart !== -1 && pEnd !== -1) {
    html = html.substring(0, pStart) + newModalHtml + html.substring(pEnd);
    console.log("Replaced #modal-level-preview HTML.");
}

// 4. Update the quick nav header in #screen-worldmap
// Replace the zone-pills-row with clean 5 thematic pills (No mini-stages)
const oldQuickNavStr = `<div class="zone-pills-row" id="zone-pills-row">`;
const quickNavEndStr = `<!-- Active Valley 10-Stage Quick Strip`; // or the drawer
const newPillsRow = `<div class="zone-pills-row" id="zone-pills-row">
                        <button type="button" class="zone-pill-btn active" id="zone-pill-1" onclick="event.stopPropagation(); jumpToZone(1);"><svg class="mythic-inline-svg" viewBox="0 0 24 24"><path d="M3 10L12 4L21 10H3Z" fill="currentColor" fill-opacity="0.25"/><path d="M6 10V18M12 10V18M18 10V18M3 18H21"/></svg>1. Vadi</button>
                        <button type="button" class="zone-pill-btn" id="zone-pill-2" onclick="event.stopPropagation(); jumpToZone(2);"><svg class="mythic-inline-svg" viewBox="0 0 24 24"><path d="M12 3V21M6 6V10C6 12.5 8.5 14 12 14C15.5 14 18 12.5 18 10V6"/></svg>2. Fırtına</button>
                        <button type="button" class="zone-pill-btn" id="zone-pill-3" onclick="event.stopPropagation(); jumpToZone(3);"><svg class="mythic-inline-svg" viewBox="0 0 24 24"><path d="M12 2C15.5 6 18 9.5 17 14C16 17.5 14 20 12 20C10 20 8 17.5 7 14C6 9.5 8.5 6 12 2Z" fill="currentColor" fill-opacity="0.28"/></svg>3. Yeraltı</button>
                        <button type="button" class="zone-pill-btn" id="zone-pill-4" onclick="event.stopPropagation(); jumpToZone(4);"><svg class="mythic-inline-svg" viewBox="0 0 24 24"><path d="M12 2L4 5V11C4 16.5 7.5 20.5 12 22C16.5 20.5 20 16.5 20 11V5L12 2Z" fill="currentColor" fill-opacity="0.22"/></svg>4. Titan</button>
                        <button type="button" class="zone-pill-btn" id="zone-pill-5" onclick="event.stopPropagation(); jumpToZone(5);"><svg class="mythic-inline-svg" viewBox="0 0 24 24"><path d="M13 2L6 13H12L10 22L19 10H13L13 2Z" fill="currentColor" fill-opacity="0.3"/></svg>5. Zirve</button>
                    </div>`;

// 5. Update updateZoneQuickNav in JavaScript
// Make sure titleEl displays clean "BÖLGE 1: KRİSTAL VADİ" without (1-10)
const oldZoneTitleMatch = "titleEl.innerText = `B-LGE ${zData.id}: ${zData.title} (${zData.levels})`;";
if (html.includes(oldZoneTitleMatch)) {
    html = html.replace(oldZoneTitleMatch, "titleEl.innerText = `BÖLGE ${zData.id}: ${zData.name.toUpperCase()}`;");
    console.log("Updated zone chip title formatting.");
}

// 6. Fix mouse drag distance threshold from 14 to 28 so normal clicks are never swallowed
html = html.replace(/totalDragDistance > 14/g, "totalDragDistance > 28");

// 7. In closeModal: if modal-level-preview, allow closing immediately without debounce wait
const oldCloseModalStr = "function closeModal(modalId, force = false) {\n            if (!force && (Date.now() - (window.lastModalOpenTime || lastModalOpenTime || 0) < 450)) {\n                return;\n            }";
const newCloseModalStr = "function closeModal(modalId, force = false) {\n            if (!force && modalId !== 'modal-level-preview' && (Date.now() - (window.lastModalOpenTime || lastModalOpenTime || 0) < 450)) {\n                return;\n            }";
if (html.includes(oldCloseModalStr)) {
    html = html.replace(oldCloseModalStr, newCloseModalStr);
    console.log("Allowed immediate close for modal-level-preview.");
}

// 8. Update openLevelPreview text injection in JavaScript to ensure pure UTF-8 strings
const oldStartPlayBtn1 = "startPlayBtn.textContent = 's OYUNA BA?LA (s 1 Can)';";
if (html.includes(oldStartPlayBtn1)) {
    html = html.replace(oldStartPlayBtn1, "startPlayBtn.textContent = '⚔️ OYUNA BAŞLA (⚡ 1 Can)';");
}
const oldStartPlayBtn2 = "startPlayBtn.textContent = 'Y\"\" TEKRAR OYNA (s 1 Can) - Rekor & Altn YǬkselt';";
if (html.includes(oldStartPlayBtn2)) {
    html = html.replace(oldStartPlayBtn2, "startPlayBtn.textContent = '⚔️ TEKRAR OYNA (⚡ 1 Can) - Rekor & Altın Yükselt';");
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log("Successfully wrote updated www/index.html");

// Synchronize all demo and mobile public files
const targets = [
    path.join(__dirname, 'www', 'Arkenya_Playable_Demo.html'),
    path.join(__dirname, 'android', 'app', 'src', 'main', 'assets', 'public', 'index.html'),
    path.join(__dirname, 'android', 'app', 'src', 'main', 'assets', 'public', 'Arkenya_Playable_Demo.html'),
    path.join(__dirname, 'ios', 'App', 'App', 'public', 'index.html'),
    path.join(__dirname, 'ios', 'App', 'App', 'public', 'Arkenya_Playable_Demo.html')
];

for (const target of targets) {
    if (fs.existsSync(path.dirname(target))) {
        fs.writeFileSync(target, html, 'utf8');
        console.log(`Synced to: ${target}`);
    }
}

console.log("=== ALL FILES UPGRADED & SYNCHRONIZED SUCCESSFULLY ===");

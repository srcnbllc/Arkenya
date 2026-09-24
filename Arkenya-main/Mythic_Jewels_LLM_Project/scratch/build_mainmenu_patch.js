const fs = require('fs');

console.log("=== BUILDING MAINMENU REFERENCE DESIGN PATCH ===");

let html = fs.readFileSync('www/index.html', 'utf8');

// 1. New screen-mainmenu markup
const newMainMenuHtml = `<div class="screen active" id="screen-mainmenu">
                <!-- 1080x1620 Referans Görsele Birebir Ana Menü Kapsayıcısı -->
                <div class="mainmenu-viewport-container">

                    <!-- ÜST BAR: KADER / Seviye / XP / Altın / Elmas / Ayarlar -->
                    <div class="mainmenu-top-bar">
                        <!-- Sol: Oyuncu Profili & XP -->
                        <div class="mainmenu-profile-pill" onclick="openProfileModal()" title="Kader & Oyuncu Profili">
                            <div class="profile-crest-avatar">
                                <svg class="avatar-helmet-svg" viewBox="0 0 24 24">
                                    <path d="M12 2C6.5 2 4 6 4 10c0 4 2 8 8 12 6-4 8-8 8-12 0-4-2.5-8-8-8z" fill="rgba(245,197,66,0.3)" stroke="url(#mythicGoldGrad)" stroke-width="1.8"/>
                                    <path d="M12 4v8M8 8l4 4 4-4" stroke="url(#mythicGoldGrad)" stroke-width="1.8" stroke-linecap="round"/>
                                    <circle cx="12" cy="7" r="1.5" fill="#ffe885"/>
                                </svg>
                                <div class="crest-laurel-wings"></div>
                            </div>
                            <div class="profile-info-col">
                                <div class="profile-name-row">
                                    <span class="player-name-txt" id="mainmenu-player-name">KADER</span>
                                    <span class="player-lvl-txt" id="mainmenu-player-level">Seviye 12</span>
                                </div>
                                <div class="profile-xp-bar-wrap">
                                    <div class="profile-xp-bar-fill" id="mainmenu-xp-bar" style="width: 49%;"></div>
                                    <span class="profile-xp-val-txt" id="mainmenu-xp-text">2450 / 5000</span>
                                </div>
                            </div>
                        </div>

                        <!-- Orta-Sol: Altın Pili -->
                        <div class="mainmenu-currency-pill gold-pill" onclick="openScreen('screen-store')" title="Altın Hazinesi">
                            <span class="currency-icon">🪙</span>
                            <span class="currency-amount" id="mainmenu-gold-val">12.450</span>
                            <button class="currency-plus-btn" aria-label="Altın Al">+</button>
                        </div>

                        <!-- Orta-Sağ: Elmas Pili -->
                        <div class="mainmenu-currency-pill gem-pill" onclick="openScreen('screen-store')" title="Kutsal Kristaller">
                            <span class="currency-icon">💎</span>
                            <span class="currency-amount" id="mainmenu-gems-val">320</span>
                            <button class="currency-plus-btn" aria-label="Elmas Al">+</button>
                        </div>

                        <!-- Sağ: Ayarlar Dişlisi -->
                        <button class="mainmenu-settings-btn" id="mainmenu-btn-settings" onclick="openModal('modal-settings')" title="Ayarlar">
                            <svg viewBox="0 0 24 24" style="width: 20px; height: 20px; fill: none; stroke: url(#mythicGoldGrad); stroke-width: 2;">
                                <circle cx="12" cy="12" r="3"></circle>
                                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                            </svg>
                            <span class="settings-notification-dot"></span>
                        </button>
                    </div>

                    <!-- İÇERİK KARTLARI (YÜZEN MİTOLOJİK KARTLAR) -->
                    <div class="mainmenu-content-cards-row">
                        <!-- Sol Üst: KRİSTAL LİG KARTI -->
                        <div class="mainmenu-card-league" id="mainmenu-card-league" onclick="openModal('modal-leaderboard')" title="Kristal Lig & Liderlik Tablosu">
                            <div class="league-card-header">
                                <div class="league-crest-badge">
                                    <svg viewBox="0 0 24 24" style="width:26px; height:26px;">
                                        <path d="M12 2L4 5v6.5C4 16.5 7.5 21 12 22c4.5-1 8-5.5 8-10.5V5L12 2z" fill="rgba(10,30,55,0.9)" stroke="url(#mythicGoldGrad)" stroke-width="1.8"/>
                                        <polygon points="12,6 16,11 12,16 8,11" fill="url(#mythicCyanGrad)" filter="drop-shadow(0 0 4px #00d2ff)"/>
                                    </svg>
                                </div>
                                <div class="league-info-body">
                                    <div class="league-title-row">
                                        <span class="league-name" id="mainmenu-league-name">Kristal Lig</span>
                                        <span class="league-info-icon" onclick="event.stopPropagation(); openModal('modal-leaderboard');" title="Lig Bilgisi">ⓘ</span>
                                    </div>
                                    <div class="league-progress-txt" id="mainmenu-league-progress-text">320 / 1000</div>
                                    <div class="league-progress-bar-wrap">
                                        <div class="league-progress-bar-fill" id="mainmenu-league-progress-fill" style="width: 32%;"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="league-card-reward-row">
                                <span class="reward-trophy-icon">🏆</span>
                                <div class="reward-text-col">
                                    <span class="reward-lbl">Sıradaki Ödül</span>
                                    <span class="reward-timer" id="mainmenu-league-timer">1 gün 4 saat</span>
                                </div>
                                <span class="reward-chest-icon">🎁</span>
                            </div>
                        </div>

                        <!-- Sağ Taraf Kolonu: HAZİNELER & GÜNLÜK GÖREVLER -->
                        <div class="mainmenu-right-cards-col">
                            <!-- Sağ Üst: HAZİNELER KARTI -->
                            <div class="mainmenu-card-treasures" id="mainmenu-card-treasures" onclick="openScreen('screen-store')" title="Hazineler & Mağaza">
                                <div class="treasures-chest-visual">
                                    <svg viewBox="0 0 64 48" class="chest-svg-glowing">
                                        <defs>
                                            <radialGradient id="chestGlowGrad" cx="50%" cy="50%" r="50%">
                                                <stop offset="0%" stop-color="#00ffff" stop-opacity="0.8"/>
                                                <stop offset="60%" stop-color="#ffd700" stop-opacity="0.4"/>
                                                <stop offset="100%" stop-color="#000" stop-opacity="0"/>
                                            </radialGradient>
                                        </defs>
                                        <circle cx="32" cy="24" r="22" fill="url(#chestGlowGrad)"/>
                                        <rect x="12" y="20" width="40" height="24" rx="3" fill="#8b5a2b" stroke="#f5c542" stroke-width="2"/>
                                        <path d="M10 20 Q32 8 54 20 Z" fill="#b8820c" stroke="#ffe885" stroke-width="2"/>
                                        <!-- Mücevherler -->
                                        <polygon points="26,16 32,10 38,16 32,22" fill="#00d2ff" filter="drop-shadow(0 0 3px #fff)"/>
                                        <polygon points="18,18 22,13 26,18 22,23" fill="#ffe885"/>
                                        <polygon points="38,18 42,13 46,18 42,23" fill="#00d2ff"/>
                                        <circle cx="32" cy="28" r="3" fill="#ffd700"/>
                                    </svg>
                                </div>
                                <div class="treasures-label-wrap">
                                    <span class="treasures-title">HAZİNELER</span>
                                    <span class="treasures-sub">Ödüllerini Topla ➔</span>
                                </div>
                            </div>

                            <!-- Orta Sağ: GÜNLÜK GÖREVLER KARTI -->
                            <div class="mainmenu-card-dailyquests" id="mainmenu-card-dailyquests" onclick="openDailyQuestsModal()" title="Günlük Görevler">
                                <div class="dailyquests-scroll-icon">
                                    <span class="scroll-icon-glyph">📜</span>
                                    <span class="dailyquests-red-dot"></span>
                                </div>
                                <div class="dailyquests-text-col">
                                    <span class="dailyquests-title">GÜNLÜK GÖREVLER ➔</span>
                                    <span class="dailyquests-sub">Tamamla ve Ödül Kazan</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- MERKEZ-ALT: ANA EYLEM BUTONU (OYUNA BAŞLA) -->
                    <div class="mainmenu-play-area">
                        <button class="mainmenu-play-cta" id="btn-main-play" onclick="startGameplay()">
                            <div class="play-cta-bevel-border"></div>
                            <div class="play-cta-flourish-left">✦</div>
                            <div class="play-cta-content">
                                <div class="play-cta-header-row">
                                    <span class="play-swords-icon">⚔️</span>
                                    <span class="play-title-txt" id="btn-mainmenu-play-text">OYUNA BAŞLA</span>
                                </div>
                                <div class="play-cta-divider-line">
                                    <span class="play-divider-diamond">◆</span>
                                    <span class="play-subtitle-txt">Yeni Macera Seni Bekliyor</span>
                                    <span class="play-divider-diamond">◆</span>
                                </div>
                            </div>
                            <div class="play-cta-flourish-right">✦</div>
                        </button>
                    </div>

                    <!-- ALT NAVİGASYON (3 BÜYÜK MİTOLOJİK KART) -->
                    <div class="mainmenu-bottom-cards-row">
                        <!-- 1. KAHRAMANLAR -->
                        <div class="mainmenu-nav-card" id="mainmenu-nav-heroes" onclick="openHeroScreen()" title="Kahramanlar Ekranı">
                            <div class="nav-card-icon-wrap">
                                <svg class="nav-card-svg" viewBox="0 0 24 24">
                                    <path d="M12 2C6.5 2 4 6 4 10c0 4 2 8 8 12 6-4 8-8 8-12 0-4-2.5-8-8-8z" fill="rgba(245,197,66,0.25)" stroke="url(#mythicGoldGrad)" stroke-width="1.8"/>
                                    <line x1="12" y1="4" x2="12" y2="12" stroke="url(#mythicGoldGrad)" stroke-width="1.8"/>
                                    <circle cx="12" cy="7" r="1.5" fill="#ffe885"/>
                                </svg>
                                <span class="nav-card-red-dot"></span>
                            </div>
                            <span class="nav-card-label">KAHRAMANLAR</span>
                        </div>

                        <!-- 2. HARİTA -->
                        <div class="mainmenu-nav-card" id="mainmenu-nav-map" onclick="openWorldMap()" title="Arkenya Dünya Haritası">
                            <div class="nav-card-icon-wrap">
                                <span class="nav-card-emoji-icon">🗺️</span>
                            </div>
                            <span class="nav-card-label">HARİTA</span>
                        </div>

                        <!-- 3. PANTEON -->
                        <div class="mainmenu-nav-card" id="mainmenu-nav-pantheon" onclick="openPantheonModal()" title="12 Olimposlu Panteon">
                            <div class="nav-card-icon-wrap">
                                <svg class="nav-card-svg" viewBox="0 0 24 24">
                                    <polygon points="12,3 2,8 22,8" fill="rgba(245,197,66,0.3)" stroke="url(#mythicGoldGrad)" stroke-width="1.8"/>
                                    <line x1="5" y1="9" x2="5" y2="18" stroke="url(#mythicGoldGrad)" stroke-width="2"/>
                                    <line x1="9.5" y1="9" x2="9.5" y2="18" stroke="url(#mythicGoldGrad)" stroke-width="2"/>
                                    <line x1="14.5" y1="9" x2="14.5" y2="18" stroke="url(#mythicGoldGrad)" stroke-width="2"/>
                                    <line x1="19" y1="9" x2="19" y2="18" stroke="url(#mythicGoldGrad)" stroke-width="2"/>
                                    <rect x="2" y="18" width="20" height="3" rx="0.5" fill="rgba(245,197,66,0.3)" stroke="url(#mythicGoldGrad)" stroke-width="1.8"/>
                                </svg>
                            </div>
                            <span class="nav-card-label">PANTEON</span>
                        </div>
                    </div>

                    <!-- EN ALT SÜSLEME ÇİZGİSİ -->
                    <div class="mainmenu-footer-sigil">
                        <span class="footer-sigil-line"></span>
                        <span class="footer-sigil-txt">✦ EFSANE SENİNLE BAŞLAR ✦</span>
                        <span class="footer-sigil-line"></span>
                    </div>

                </div>
            </div>`;

// Replace the old screen-mainmenu markup
const p1 = html.indexOf('id="screen-mainmenu"');
const start = html.lastIndexOf('<div class="screen', p1);
const nextScreen = html.indexOf('<!-- SCREEN 3: WORLD MAP', p1);

if (start !== -1 && nextScreen !== -1) {
    html = html.substring(0, start) + newMainMenuHtml + '\n\n            ' + html.substring(nextScreen);
    console.log("  [SUCCESS] Replaced screen-mainmenu HTML with reference design!");
} else {
    console.error("  [FAIL] Could not locate screen-mainmenu boundaries!");
    process.exit(1);
}

// 2. Add New Günlük Görevler Modal (#modal-daily-quests) before </main> or </body>
const dailyQuestsModalHtml = `
    <!-- MODAL: GÜNLÜK OLİMPOS GÖREVLERİ -->
    <div class="modal-overlay" id="modal-daily-quests" onclick="if(event.target===this)closeModal('modal-daily-quests')">
        <div class="modal-content" style="max-width: 420px; background: linear-gradient(135deg, rgba(14,20,32,0.98), rgba(6,10,18,0.98)); border: 2px solid var(--gold-primary); border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.8), 0 0 25px rgba(245,197,66,0.3); padding: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1.5px solid rgba(245,197,66,0.3); padding-bottom: 12px; margin-bottom: 15px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 22px;">📜</span>
                    <div>
                        <div style="font-size: 16px; font-weight: 900; color: var(--gold-light); letter-spacing: 0.8px;">GÜNLÜK GÖREVLER</div>
                        <div style="font-size: 10px; color: #94a3b8;">Her 24 saatte bir ilahi ödüller yenilenir</div>
                    </div>
                </div>
                <button onclick="closeModal('modal-daily-quests')" style="background: none; border: none; font-size: 20px; color: #aaa; cursor: pointer;">✕</button>
            </div>

            <!-- GÖREV LİSTESİ -->
            <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 18px;">
                <!-- Görev 1: 3 Bölüm Tamamla -->
                <div style="background: rgba(255,255,255,0.04); border: 1.5px solid rgba(245,197,66,0.3); border-radius: 12px; padding: 12px; display: flex; align-items: center; justify-content: space-between; gap: 10px;">
                    <div style="flex: 1;">
                        <div style="font-size: 12.5px; font-weight: 800; color: #fff;">🏛️ 3 Bölüm Zaferi Kazan</div>
                        <div style="font-size: 10px; color: #94a3b8; margin: 3px 0;">Ödül: <b style="color: #ffd700;">+250 Altın</b> 💰</div>
                        <div style="height: 6px; background: rgba(0,0,0,0.6); border-radius: 4px; overflow: hidden; width: 100%;">
                            <div style="height: 100%; width: 66%; background: linear-gradient(90deg, #f5c542, #ffe885); border-radius: 4px;"></div>
                        </div>
                    </div>
                    <button class="btn-action" style="min-width: 80px; height: 32px; font-size: 11px; padding: 0 10px;" onclick="claimDailyQuest(1, 250, 'gold', this)">ÖDÜLÜ AL</button>
                </div>

                <!-- Görev 2: 100 Taş Eşleştir -->
                <div style="background: rgba(255,255,255,0.04); border: 1.5px solid rgba(0,210,255,0.3); border-radius: 12px; padding: 12px; display: flex; align-items: center; justify-content: space-between; gap: 10px;">
                    <div style="flex: 1;">
                        <div style="font-size: 12.5px; font-weight: 800; color: #fff;">💎 100 Olimpos Taşı Eşleştir</div>
                        <div style="font-size: 10px; color: #94a3b8; margin: 3px 0;">Ödül: <b style="color: #00d2ff;">+15 Kutsal Elmas</b> 💎</div>
                        <div style="height: 6px; background: rgba(0,0,0,0.6); border-radius: 4px; overflow: hidden; width: 100%;">
                            <div style="height: 100%; width: 100%; background: linear-gradient(90deg, #00d2ff, #38bdf8); border-radius: 4px;"></div>
                        </div>
                    </div>
                    <button class="btn-action" style="min-width: 80px; height: 32px; font-size: 11px; padding: 0 10px; background: linear-gradient(180deg, #0284c7, #0369a1);" onclick="claimDailyQuest(2, 15, 'gems', this)">ÖDÜLÜ AL</button>
                </div>

                <!-- Görev 3: 1 Yetenek Kullan -->
                <div style="background: rgba(255,255,255,0.04); border: 1.5px solid rgba(245,197,66,0.3); border-radius: 12px; padding: 12px; display: flex; align-items: center; justify-content: space-between; gap: 10px;">
                    <div style="flex: 1;">
                        <div style="font-size: 12.5px; font-weight: 800; color: #fff;">⚡ 1 Kahraman Yeteneği Kullan</div>
                        <div style="font-size: 10px; color: #94a3b8; margin: 3px 0;">Ödül: <b style="color: #ff5555;">+1 Kutsal Can</b> ⚡</div>
                        <div style="height: 6px; background: rgba(0,0,0,0.6); border-radius: 4px; overflow: hidden; width: 100%;">
                            <div style="height: 100%; width: 100%; background: linear-gradient(90deg, #2ecc71, #4ade80); border-radius: 4px;"></div>
                        </div>
                    </div>
                    <button class="btn-action" style="min-width: 80px; height: 32px; font-size: 11px; padding: 0 10px;" onclick="claimDailyQuest(3, 1, 'energy', this)">ÖDÜLÜ AL</button>
                </div>
            </div>

            <button class="btn-action" style="width: 100%; height: 38px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #e2e8f0; font-size: 12px; font-weight: 800;" onclick="closeModal('modal-daily-quests')">KAPAT</button>
        </div>
    </div>
`;

if (!html.includes('id="modal-daily-quests"')) {
    const endBodyIdx = html.lastIndexOf('</body>');
    html = html.substring(0, endBodyIdx) + '\n' + dailyQuestsModalHtml + '\n' + html.substring(endBodyIdx);
    console.log("  [SUCCESS] Injected modal-daily-quests!");
}

// 3. CSS for 1080x1620 Reference Layout & Components
const mainmenuStyles = `
        /* ========================================================= */
        /* --- ARKENYA REFERANS ANA MENÜ (1080x1620) TASARIM STİLLERİ --- */
        /* ========================================================= */
        #screen-mainmenu {
            padding: 0 !important;
            overflow: hidden !important;
            display: none;
            flex-direction: column;
            justify-content: space-between;
            background-image: url('Assets/Art/main_menu_clean_bg.jpg') !important;
            background-size: cover !important;
            background-position: center !important;
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            z-index: 20;
        }

        #screen-mainmenu.active {
            display: flex !important;
        }

        /* Ana Menü Aktifken Global Alt Nav'ı ve Global HUD'ı Zarifçe Yönet */
        body.mainmenu-view #global-hud,
        body.mainmenu-view #global-bottom-nav {
            opacity: 0 !important;
            pointer-events: none !important;
        }

        .mainmenu-viewport-container {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: max(env(safe-area-inset-top, 0px), 12px) 14px max(env(safe-area-inset-bottom, 0px), 12px) 14px;
            box-sizing: border-box;
            position: relative;
        }

        /* 1. ÜST BAR */
        .mainmenu-top-bar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 6px;
            width: 100%;
            z-index: 30;
            margin-top: 4px;
        }

        /* Profil & XP Pill */
        .mainmenu-profile-pill {
            display: flex;
            align-items: center;
            gap: 8px;
            background: linear-gradient(135deg, rgba(8, 16, 28, 0.92) 0%, rgba(4, 8, 16, 0.95) 100%);
            border: 1.5px solid var(--gold-primary);
            border-radius: 24px;
            padding: 4px 10px 4px 4px;
            cursor: pointer;
            box-shadow: 0 4px 14px rgba(0,0,0,0.6), inset 0 1px 2px rgba(255,215,0,0.3);
            transition: transform 0.2s ease;
        }

        .mainmenu-profile-pill:active {
            transform: scale(0.97);
        }

        .profile-crest-avatar {
            width: 38px;
            height: 38px;
            border-radius: 50%;
            background: radial-gradient(circle, #2a1a08 0%, #100b03 100%);
            border: 2px solid var(--gold-light);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 10px rgba(255,215,0,0.5);
            position: relative;
        }

        .avatar-helmet-svg {
            width: 22px;
            height: 22px;
            filter: drop-shadow(0 0 3px rgba(255,215,0,0.8));
        }

        .profile-info-col {
            display: flex;
            flex-direction: column;
            gap: 2px;
            min-width: 85px;
        }

        .profile-name-row {
            display: flex;
            align-items: baseline;
            gap: 6px;
        }

        .player-name-txt {
            font-size: 13px;
            font-weight: 900;
            letter-spacing: 0.8px;
            color: #fff;
            text-shadow: 0 1px 3px rgba(0,0,0,0.9);
        }

        .player-lvl-txt {
            font-size: 9px;
            font-weight: 700;
            color: var(--gold-light);
        }

        .profile-xp-bar-wrap {
            position: relative;
            width: 90px;
            height: 8px;
            background: rgba(0,0,0,0.85);
            border-radius: 6px;
            border: 1px solid rgba(0,210,255,0.4);
            overflow: hidden;
            display: flex;
            align-items: center;
        }

        .profile-xp-bar-fill {
            height: 100%;
            background: linear-gradient(90deg, #0072ff, #00d2ff);
            border-radius: 6px;
            box-shadow: 0 0 6px #00d2ff;
            transition: width 0.3s ease;
        }

        .profile-xp-val-txt {
            position: absolute;
            width: 100%;
            text-align: center;
            font-size: 6.5px;
            font-weight: 800;
            color: #fff;
            text-shadow: 0 1px 2px #000;
        }

        /* Altın ve Elmas Pilleri */
        .mainmenu-currency-pill {
            display: flex;
            align-items: center;
            gap: 4px;
            background: linear-gradient(135deg, rgba(10, 18, 30, 0.94) 0%, rgba(4, 8, 14, 0.96) 100%);
            border: 1.5px solid var(--gold-primary);
            border-radius: 18px;
            padding: 3px 6px 3px 8px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,215,0,0.25);
            transition: transform 0.2s ease;
        }

        .mainmenu-currency-pill.gem-pill {
            border-color: #00d2ff;
            box-shadow: 0 4px 12px rgba(0,0,0,0.6), inset 0 1px 1px rgba(0,210,255,0.25);
        }

        .mainmenu-currency-pill:active {
            transform: scale(0.96);
        }

        .currency-icon {
            font-size: 14px;
        }

        .currency-amount {
            font-size: 12px;
            font-weight: 800;
            color: #fff;
            letter-spacing: 0.5px;
        }

        .currency-plus-btn {
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: linear-gradient(135deg, #ffd700, #b8820c);
            border: none;
            color: #000;
            font-weight: 900;
            font-size: 11px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 0 6px rgba(255,215,0,0.6);
            margin-left: 2px;
        }

        .gem-pill .currency-plus-btn {
            background: linear-gradient(135deg, #38bdf8, #0284c7);
            color: #fff;
            box-shadow: 0 0 6px rgba(0,210,255,0.6);
        }

        /* Ayarlar Dişli Butonu */
        .mainmenu-settings-btn {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: linear-gradient(135deg, rgba(24, 20, 10, 0.94) 0%, rgba(10, 8, 4, 0.96) 100%);
            border: 1.5px solid var(--gold-primary);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            position: relative;
            box-shadow: 0 4px 12px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,215,0,0.3);
            transition: transform 0.2s ease;
        }

        .mainmenu-settings-btn:active {
            transform: scale(0.94);
        }

        .settings-notification-dot {
            position: absolute;
            top: 2px;
            right: 2px;
            width: 8px;
            height: 8px;
            background: #ef4444;
            border-radius: 50%;
            border: 1.5px solid #fff;
            box-shadow: 0 0 6px #ef4444;
        }

        /* 2. İÇERİK KARTLARI ROW (KRİSTAL LİG & HAZİNELER & GÖREVLER) */
        .mainmenu-content-cards-row {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 10px;
            margin-top: 14px;
            z-index: 25;
        }

        /* Sol: Kristal Lig Kartı */
        .mainmenu-card-league {
            flex: 1.1;
            max-width: 195px;
            background: linear-gradient(145deg, rgba(10, 20, 36, 0.92) 0%, rgba(4, 10, 20, 0.96) 100%);
            border: 1.8px solid var(--gold-primary);
            border-radius: 16px;
            padding: 8px 10px;
            cursor: pointer;
            box-shadow: 0 6px 20px rgba(0,0,0,0.7), inset 0 1px 2px rgba(255,215,0,0.35);
            transition: transform 0.22s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .mainmenu-card-league:active {
            transform: scale(0.97);
        }

        .league-card-header {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .league-crest-badge {
            flex-shrink: 0;
            filter: drop-shadow(0 0 6px rgba(0,210,255,0.6));
        }

        .league-info-body {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 2px;
        }

        .league-title-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .league-name {
            font-size: 11.5px;
            font-weight: 900;
            color: #fff;
            letter-spacing: 0.5px;
        }

        .league-info-icon {
            font-size: 10px;
            color: var(--gold-light);
            opacity: 0.8;
            cursor: pointer;
        }

        .league-progress-txt {
            font-size: 8.5px;
            color: #94a3b8;
            font-weight: 700;
        }

        .league-progress-bar-wrap {
            width: 100%;
            height: 5px;
            background: rgba(0,0,0,0.8);
            border-radius: 4px;
            overflow: hidden;
            border: 0.5px solid rgba(0,210,255,0.4);
        }

        .league-progress-bar-fill {
            height: 100%;
            background: linear-gradient(90deg, #0072ff, #00d2ff);
            border-radius: 4px;
            box-shadow: 0 0 6px #00d2ff;
        }

        .league-card-reward-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 6px;
            padding-top: 5px;
            border-top: 1px solid rgba(255,255,255,0.1);
        }

        .reward-trophy-icon { font-size: 12px; }
        .reward-chest-icon { font-size: 13px; filter: drop-shadow(0 0 4px #ffd700); }

        .reward-text-col {
            display: flex;
            flex-direction: column;
        }

        .reward-lbl { font-size: 8px; color: #94a3b8; }
        .reward-timer { font-size: 8.5px; font-weight: 800; color: var(--gold-light); }

        /* Sağ Kolon: Hazineler & Günlük Görevler */
        .mainmenu-right-cards-col {
            flex: 0.95;
            display: flex;
            flex-direction: column;
            gap: 8px;
            align-items: flex-end;
        }

        /* Hazineler Kartı */
        .mainmenu-card-treasures {
            width: 140px;
            background: linear-gradient(145deg, rgba(14, 20, 34, 0.92) 0%, rgba(6, 10, 18, 0.96) 100%);
            border: 1.8px solid var(--gold-primary);
            border-radius: 14px;
            padding: 6px 8px;
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: pointer;
            box-shadow: 0 6px 18px rgba(0,0,0,0.7), inset 0 1px 2px rgba(255,215,0,0.3);
            transition: transform 0.22s ease;
        }

        .mainmenu-card-treasures:active {
            transform: scale(0.96);
        }

        .treasures-chest-visual {
            width: 100%;
            height: 38px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .chest-svg-glowing {
            width: 48px;
            height: 36px;
            filter: drop-shadow(0 0 8px rgba(0,210,255,0.7));
            animation: chestGlowPulse 2.5s infinite alternate ease-in-out;
        }

        @keyframes chestGlowPulse {
            0% { transform: scale(0.96); filter: drop-shadow(0 0 5px rgba(0,210,255,0.5)); }
            100% { transform: scale(1.04); filter: drop-shadow(0 0 12px rgba(255,215,0,0.8)); }
        }

        .treasures-label-wrap {
            text-align: center;
            display: flex;
            flex-direction: column;
            margin-top: 2px;
        }

        .treasures-title {
            font-size: 11px;
            font-weight: 900;
            color: var(--gold-light);
            letter-spacing: 0.8px;
            text-shadow: 0 1px 3px rgba(0,0,0,0.9);
        }

        .treasures-sub {
            font-size: 8px;
            color: #cbd5e1;
            font-weight: 700;
        }

        /* Günlük Görevler Kartı */
        .mainmenu-card-dailyquests {
            width: 140px;
            background: linear-gradient(135deg, rgba(16, 22, 36, 0.94) 0%, rgba(8, 12, 20, 0.96) 100%);
            border: 1.5px solid var(--gold-primary);
            border-radius: 12px;
            padding: 5px 8px;
            display: flex;
            align-items: center;
            gap: 7px;
            cursor: pointer;
            box-shadow: 0 4px 14px rgba(0,0,0,0.6);
            transition: transform 0.2s ease;
        }

        .mainmenu-card-dailyquests:active {
            transform: scale(0.96);
        }

        .dailyquests-scroll-icon {
            position: relative;
            font-size: 16px;
            filter: drop-shadow(0 0 4px rgba(255,215,0,0.6));
        }

        .dailyquests-red-dot {
            position: absolute;
            top: -2px;
            right: -2px;
            width: 7px;
            height: 7px;
            background: #ef4444;
            border-radius: 50%;
            border: 1px solid #fff;
            box-shadow: 0 0 4px #ef4444;
        }

        .dailyquests-text-col {
            display: flex;
            flex-direction: column;
        }

        .dailyquests-title {
            font-size: 8.5px;
            font-weight: 900;
            color: #fff;
            letter-spacing: 0.5px;
        }

        .dailyquests-sub {
            font-size: 7.5px;
            color: #94a3b8;
            font-weight: 600;
        }

        /* 3. MERKEZ-ALT: ANA EYLEM BUTONU (OYUNA BAŞLA) */
        .mainmenu-play-area {
            width: 100%;
            max-width: 360px;
            margin: 0 auto 12px auto;
            display: flex;
            justify-content: center;
            z-index: 30;
        }

        .mainmenu-play-cta {
            width: 100%;
            position: relative;
            background: linear-gradient(180deg, #162a45 0%, #0c1828 50%, #060e18 100%);
            border: 2.5px solid var(--gold-primary);
            border-radius: 20px;
            padding: 10px 16px;
            cursor: pointer;
            box-shadow: 0 0 25px rgba(245, 197, 66, 0.45), 0 8px 30px rgba(0,0,0,0.8), inset 0 2px 3px rgba(255,232,133,0.5);
            display: flex;
            align-items: center;
            justify-content: space-between;
            transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            outline: 1.5px solid rgba(255,215,0,0.4);
            outline-offset: -5px;
        }

        .mainmenu-play-cta:active {
            transform: scale(0.97);
            box-shadow: 0 0 35px rgba(255, 215, 0, 0.7);
        }

        .play-cta-flourish-left, .play-cta-flourish-right {
            font-size: 14px;
            color: var(--gold-light);
            text-shadow: 0 0 8px rgba(255,215,0,0.8);
            opacity: 0.85;
        }

        .play-cta-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 2px;
            flex: 1;
        }

        .play-cta-header-row {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .play-swords-icon {
            font-size: 20px;
            filter: drop-shadow(0 0 6px rgba(255,215,0,0.9));
        }

        .play-title-txt {
            font-size: 20px;
            font-weight: 900;
            letter-spacing: 1.5px;
            color: #ffe885;
            background: linear-gradient(180deg, #fff 0%, #ffe885 50%, #f5c542 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.9)) drop-shadow(0 0 10px rgba(245,197,66,0.6));
            text-transform: uppercase;
        }

        .play-cta-divider-line {
            display: flex;
            align-items: center;
            gap: 6px;
            margin-top: 1px;
        }

        .play-divider-diamond {
            font-size: 6px;
            color: var(--gold-light);
            opacity: 0.7;
        }

        .play-subtitle-txt {
            font-size: 9.5px;
            font-weight: 700;
            color: #cbd5e1;
            letter-spacing: 0.8px;
            text-shadow: 0 1px 2px rgba(0,0,0,0.9);
        }

        /* 4. ALT NAVİGASYON (3 BÜYÜK MİTOLOJİK KART) */
        .mainmenu-bottom-cards-row {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 10px;
            width: 100%;
            max-width: 390px;
            margin: 0 auto;
            z-index: 30;
        }

        .mainmenu-nav-card {
            background: linear-gradient(145deg, rgba(14, 22, 38, 0.94) 0%, rgba(6, 10, 18, 0.98) 100%);
            border: 1.8px solid var(--gold-primary);
            border-radius: 14px;
            padding: 8px 4px 7px 4px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 4px;
            cursor: pointer;
            box-shadow: 0 6px 16px rgba(0,0,0,0.7), inset 0 1px 2px rgba(255,215,0,0.3);
            transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .mainmenu-nav-card:active {
            transform: scale(0.95);
            border-color: #ffe885;
            box-shadow: 0 0 15px rgba(255,215,0,0.6);
        }

        .nav-card-icon-wrap {
            position: relative;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .nav-card-svg {
            width: 26px;
            height: 26px;
            filter: drop-shadow(0 0 5px rgba(255,215,0,0.7));
        }

        .nav-card-emoji-icon {
            font-size: 22px;
            filter: drop-shadow(0 0 5px rgba(255,215,0,0.5));
        }

        .nav-card-red-dot {
            position: absolute;
            top: 0;
            right: 0;
            width: 8px;
            height: 8px;
            background: #ef4444;
            border-radius: 50%;
            border: 1.5px solid #fff;
            box-shadow: 0 0 6px #ef4444;
        }

        .nav-card-label {
            font-size: 9.5px;
            font-weight: 900;
            color: #e2e8f0;
            letter-spacing: 0.8px;
            text-transform: uppercase;
            text-shadow: 0 1px 2px rgba(0,0,0,0.9);
        }

        /* En Alt Süsleme Çizgisi */
        .mainmenu-footer-sigil {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            margin-top: 8px;
            opacity: 0.8;
            z-index: 30;
        }

        .footer-sigil-line {
            width: 45px;
            height: 1px;
            background: linear-gradient(90deg, transparent, var(--gold-dark), transparent);
        }

        .footer-sigil-txt {
            font-size: 7.5px;
            font-weight: 800;
            letter-spacing: 1.5px;
            color: var(--gold-dark);
            text-transform: uppercase;
        }
`;

// Insert the CSS before </style>
const styleClosingTag = '</style>';
const lastStyleIdx = html.lastIndexOf(styleClosingTag);
if (lastStyleIdx !== -1) {
    html = html.substring(0, lastStyleIdx) + '\n' + mainmenuStyles + '\n' + html.substring(lastStyleIdx);
    console.log("  [SUCCESS] Injected Main Menu CSS into index.html!");
} else {
    console.error("  [FAIL] Could not find </style> tag!");
    process.exit(1);
}

// 4. Update JS Functions: updateMainMenuUI(), openDailyQuestsModal(), claimDailyQuest()
const mainmenuJs = `
        // --- ARKENYA REFERANS ANA MENÜ BAĞLANTI & GÖREV SİSTEMİ ---
        function updateMainMenuUI() {
            if (!gameState) return;
            const profile = gameState.playerProfile || {};
            const nameEl = document.getElementById('mainmenu-player-name');
            const lvlEl = document.getElementById('mainmenu-player-level');
            const xpBarEl = document.getElementById('mainmenu-xp-bar');
            const xpTxtEl = document.getElementById('mainmenu-xp-text');
            const goldEl = document.getElementById('mainmenu-gold-val');
            const gemsEl = document.getElementById('mainmenu-gems-val');

            if (nameEl) nameEl.innerText = profile.displayName || gameState.playerName || 'KADER';
            if (lvlEl) lvlEl.innerText = 'Seviye ' + (gameState.playerLevel || 12);
            
            const xp = gameState.playerXp !== undefined ? gameState.playerXp : 2450;
            const maxXp = gameState.maxXp !== undefined ? gameState.maxXp : 5000;
            if (xpBarEl) xpBarEl.style.width = Math.min(100, Math.round((xp / maxXp) * 100)) + '%';
            if (xpTxtEl) xpTxtEl.innerText = xp.toLocaleString('tr-TR') + ' / ' + maxXp.toLocaleString('tr-TR');

            const gold = gameState.gold !== undefined ? gameState.gold : 12450;
            const gems = gameState.gems !== undefined ? gameState.gems : 320;
            if (goldEl) goldEl.innerText = gold.toLocaleString('tr-TR');
            if (gemsEl) gemsEl.innerText = gems.toLocaleString('tr-TR');

            // Lig Bilgisi
            const leagueNameEl = document.getElementById('mainmenu-league-name');
            const leagueProgEl = document.getElementById('mainmenu-league-progress-text');
            const leagueFillEl = document.getElementById('mainmenu-league-progress-fill');
            if (leagueNameEl) leagueNameEl.innerText = 'Kristal Lig';
            if (leagueProgEl) leagueProgEl.innerText = '320 / 1000';
            if (leagueFillEl) leagueFillEl.style.width = '32%';
        }

        function openDailyQuestsModal() {
            sfxBtn();
            triggerHaptic('light');
            openModal('modal-daily-quests');
        }

        function claimDailyQuest(questId, amount, type, btnEl) {
            sfxWin();
            triggerHaptic('medium');
            if (type === 'gold') {
                gameState.gold = (gameState.gold || 0) + amount;
                spawnFloatingText('+' + amount + ' Altın!', '#ffd700');
            } else if (type === 'gems') {
                gameState.gems = (gameState.gems || 0) + amount;
                spawnFloatingText('+' + amount + ' Elmas!', '#00d2ff');
            } else if (type === 'energy') {
                gameState.energy = Math.min(5, (gameState.energy || 0) + amount);
                spawnFloatingText('+1 Can!', '#ff5555');
            }
            saveGameState();
            updateHUD();
            updateMainMenuUI();

            if (btnEl) {
                btnEl.innerText = 'ALINDI ✓';
                btnEl.style.background = '#475569';
                btnEl.style.cursor = 'default';
                btnEl.disabled = true;
            }
        }
`;

// Insert the JS functions right before function updateHUD()
const updateHudIdx = html.indexOf('function updateHUD(');
if (updateHudIdx !== -1) {
    html = html.substring(0, updateHudIdx) + mainmenuJs + '\n\n        ' + html.substring(updateHudIdx);
    console.log("  [SUCCESS] Injected updateMainMenuUI and daily quests JS!");
} else {
    console.error("  [FAIL] Could not find function updateHUD!");
    process.exit(1);
}

// 5. Connect updateMainMenuUI to updateHUD and showScreen
// Inside updateHUD(), add updateMainMenuUI();
html = html.replace('function updateHUD() {', 'function updateHUD() {\n            updateMainMenuUI();');
console.log("  [SUCCESS] Wired updateMainMenuUI inside updateHUD!");

// In showScreen, when screenId === 'screen-mainmenu', add class 'mainmenu-view' to document.body, otherwise remove it
const showScreenAnchor = "targetScreen.classList.add('active');";
const showScreenUpdate = `targetScreen.classList.add('active');
                if (screenId === 'screen-mainmenu') {
                    document.body.classList.add('mainmenu-view');
                    updateMainMenuUI();
                } else {
                    document.body.classList.remove('mainmenu-view');
                }`;

html = html.replace(showScreenAnchor, showScreenUpdate);
console.log("  [SUCCESS] Updated showScreen with mainmenu-view class toggling!");

// Write back to www/index.html
fs.writeFileSync('www/index.html', html, 'utf8');
console.log("  [SUCCESS] www/index.html updated successfully!");
console.log("  New File Size:", fs.statSync('www/index.html').size, "bytes");

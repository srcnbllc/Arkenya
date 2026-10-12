const fs = require('fs');

const path = 'www/index.html';
const content = fs.readFileSync(path, 'utf8');
const isCrlf = content.includes('\r\n');
const lines = content.split(/\r?\n/);

// 1. Replace modal-pause and modal-confirm-abandon (around line 4728 to 4756)
const pauseStart = lines.findIndex(l => l.includes('<!-- MODAL: PAUSE -->'));
const pauseEnd = lines.findIndex(l => l.includes('<!-- MODAL: MITOLOJİK HİKAYE VE SESLİ ANLATIM PARŞÖMENİ -->'));

if (pauseStart === -1 || pauseEnd === -1) {
    console.error("modal-pause boundary not found!");
    process.exit(1);
}

const replacementPause = [
    '            <!-- MODAL: PAUSE (Bütüncül Olimpos & Zafer Ekranı Teması) -->',
    '            <div class="modal-overlay" id="modal-pause">',
    '                <div class="modal-card" style="width: 90%; max-width: 380px; padding: 20px 18px; box-sizing: border-box; text-align: center; border: 1.5px solid var(--gold-primary); background: radial-gradient(circle at top, #151e33 0%, #090e1c 100%); box-shadow: 0 16px 45px rgba(0,0,0,0.9), 0 0 25px rgba(245,197,66,0.15); border-radius: 20px;">',
    '                    <!-- Top Chip Badge -->',
    '                    <div style="display: inline-block; background: rgba(245,197,66,0.14); border: 1px solid rgba(245,197,66,0.4); color: var(--gold-light); font-size: 10.5px; font-weight: 800; letter-spacing: 0.8px; padding: 3px 12px; border-radius: 20px; text-transform: uppercase; margin-bottom: 6px;">',
    '                        MOLA ZAMANI',
    '                    </div>',
    '',
    '                    <div style="font-size: 40px; margin: 2px 0;">⏸️</div>',
    '                    <div class="modal-title" style="color: var(--gold-light); font-size: 20px; margin-bottom: 4px; font-weight: 900; letter-spacing: 0.5px; text-shadow: 0 2px 8px rgba(245,197,66,0.4);">OYUN DURAKLATILDI</div>',
    '                    <div style="font-size: 11.5px; color: #94a3b8; font-weight: 700; margin-bottom: 16px;">Mücadele seni bekliyor, hazır olduğunda devam et.</div>',
    '                    ',
    '                    <!-- 1. HERO BUTTON: OYUNA DEVAM ET (btn-action-gold) -->',
    '                    <button class="btn-action-gold" style="height: 46px; font-size: 14.5px; font-weight: 900; margin-bottom: 10px; border-radius: 12px; width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px; letter-spacing: 0.5px;" onclick="closeModal(\'modal-pause\')">▶️ OYUNA DEVAM ET</button>',
    '',
    '                    <!-- 2. RESTART BUTTON: Altın çerçeveli mistik buton -->',
    '                    <button class="btn-action" style="height: 40px; font-size: 12.5px; font-weight: 800; margin-bottom: 10px; background: linear-gradient(180deg, rgba(245,197,66,0.16) 0%, rgba(212,154,29,0.26) 100%); border: 1.5px solid var(--gold-primary); color: var(--gold-light); border-radius: 11px; width: 100%; display: flex; align-items: center; justify-content: center; gap: 6px; box-shadow: 0 2px 10px rgba(245,197,66,0.15);" onclick="promptAbandonMatch(\'restart\')">🔄 TEKRAR BAŞLAT (-1 Can)</button>',
    '',
    '                    <!-- 3. QUIT / MAIN MENU BUTTON: Zarif lacivert/altın detaylı buton -->',
    '                    <button class="btn-action-sub" style="height: 36px; font-size: 12px; font-weight: 800; border-radius: 10px; width: 100%; display: flex; align-items: center; justify-content: center; margin-top: 0; background: rgba(255,255,255,0.05); border: 1px solid rgba(245,197,66,0.28); color: #cbd5e1;" onclick="promptAbandonMatch(\'quit\')">🗺️ ANA MENÜYE DÖN (-1 Can)</button>',
    '                </div>',
    '            </div>',
    '',
    '            <!-- MODAL: CONFIRM ABANDON / RESTART (-1 CAN UYARISI) -->',
    '            <div class="modal-overlay" id="modal-confirm-abandon" style="z-index: 99999;">',
    '                <div class="modal-card" style="width: 90%; max-width: 380px; padding: 20px 18px; box-sizing: border-box; text-align: center; border: 1.5px solid #ef4444; box-shadow: 0 16px 45px rgba(239, 68, 68, 0.4); background: radial-gradient(circle at top, #26111a 0%, #090e1c 100%); border-radius: 20px;">',
    '                    <div style="display: inline-block; background: rgba(239, 68, 68, 0.2); border: 1px solid #ef4444; color: #fca5a5; padding: 3px 12px; border-radius: 20px; font-size: 10.5px; font-weight: 800; margin-bottom: 6px; letter-spacing: 0.5px; text-transform: uppercase;">DİKKAT • CAN KAYBI</div>',
    '                    <div style="font-size: 40px; margin: 2px 0;">💔</div>',
    '                    <div class="modal-title" id="confirm-abandon-title" style="color: #ffffff; font-size: 19px; font-weight: 900; margin-bottom: 6px; letter-spacing: 0.5px;">MÜCADELEDEN AYRIL</div>',
    '                    <div id="confirm-abandon-desc" style="font-size: 12.5px; color: #cbd5e1; line-height: 1.45; margin-bottom: 12px; background: rgba(0,0,0,0.5); border-radius: 11px; padding: 10px 12px; border: 1px solid rgba(239, 68, 68, 0.35);">',
    '                        Mücadeleyi tamamlamadan çıkarsan <b>1 Kutsal Can kaybedeceksin! (-1 ❤️)</b><br><br>',
    '                        <span style="color: #fca5a5; font-weight: 700;">Ayrılmak istediğine emin misin?</span>',
    '                    </div>',
    '                    <div id="confirm-abandon-hearts-preview" style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 14px; font-size: 12.5px; font-weight: 800; color: #fca5a5;">',
    '                        <!-- Kalan Can Gösterimi -->',
    '                    </div>',
    '                    <button class="btn-action" id="btn-confirm-abandon-yes" style="height: 44px; font-size: 13.5px; margin-bottom: 8px; background: linear-gradient(180deg, #ef4444 0%, #b91c1c 100%); color: #fff; font-weight: 900; border-radius: 12px; width: 100%; border: 1px solid #fca5a5;" onclick="executeConfirmedAbandon()">💔 EVET, AYRIL (-1 CAN)</button>',
    '                    <button class="btn-action-sub" style="height: 36px; font-size: 12px; font-weight: 800; border-radius: 10px; width: 100%; margin-top: 0; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.2); color: #cbd5e1;" onclick="closeModal(\'modal-confirm-abandon\')">✕ HAYIR, OYUNA DEVAM ET</button>',
    '                </div>',
    '            </div>',
    ''
];

lines.splice(pauseStart, pauseEnd - pauseStart, ...replacementPause);
console.log("Successfully replaced modal-pause and modal-confirm-abandon!");

// 2. Replace modal-victory (around line 4885 to 4975)
const vicStart = lines.findIndex(l => l.includes('<!-- MODAL: VICTORY'));
const vicEnd = lines.findIndex(l => l.includes('<!-- MODAL: DEFEAT -->'));

if (vicStart === -1 || vicEnd === -1) {
    console.error("modal-victory boundary not found!");
    process.exit(1);
}

const replacementVictory = [
    '            <!-- MODAL: VICTORY (AAA Mythic Score, Star & Progression Showcase) -->',
    '            <div class="modal-overlay" id="modal-victory">',
    '                <div class="modal-card" style="width: 90%; max-width: 400px; padding: 14px 16px; box-sizing: border-box; border: 1.5px solid var(--gold-primary); background: radial-gradient(circle at top, #151e33 0%, #090e1c 100%); box-shadow: 0 16px 45px rgba(0,0,0,0.9), 0 0 30px rgba(245,197,66,0.18); border-radius: 20px; max-height: 94vh; overflow-y: auto;">',
    '                    <!-- Stage & Biome Crest Banner -->',
    '                    <div id="victory-stage-chip" style="display: inline-block; background: rgba(245,197,66,0.14); border: 1px solid rgba(245,197,66,0.4); color: var(--gold-light); font-size: 10.5px; font-weight: 800; letter-spacing: 0.8px; padding: 3px 12px; border-radius: 20px; text-transform: uppercase; margin-bottom: 3px;">',
    '                        BÖLÜM 1 • KRİSTAL VADİ',
    '                    </div>',
    '',
    '                    <div id="victory-crest-icon" style="font-size: 38px; margin: 1px 0;">🏆</div>',
    '                    <div class="modal-title" id="victory-main-title" style="color: var(--gold-light); font-size: 20px; margin-bottom: 2px; font-weight: 900; letter-spacing: 0.5px; text-shadow: 0 2px 8px rgba(245,197,66,0.4);">BÖLÜM GEÇİLDİ!</div>',
    '                    ',
    '                    <!-- 3 Stars Container with Rating Subtitle -->',
    '                    <div class="star-container" id="victory-stars-container" style="margin-bottom: 1px;">',
    '                        <div class="victory-star" id="v-star-1">⭐</div>',
    '                        <div class="victory-star" id="v-star-2">⭐</div>',
    '                        <div class="victory-star" id="v-star-3">⭐</div>',
    '                    </div>',
    '                    <div id="victory-rating-text" style="font-size: 11px; font-weight: 800; color: var(--gold-primary); margin-bottom: 8px; letter-spacing: 0.6px;">KUSURSUZ ZAFER!</div>',
    '',
    '                    <!-- Comprehensive Score & Details Dashboard Box -->',
    '                    <div style="background: radial-gradient(circle, rgba(245,197,66,0.14) 0%, rgba(10,16,30,0.7) 100%); border: 1.5px solid rgba(245,197,66,0.35); border-radius: 13px; padding: 8px 12px; margin-bottom: 8px;">',
    '                        <div style="display: flex; justify-content: space-between; align-items: center;">',
    '                            <span style="font-size: 10px; color: #94a3b8; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">Kazanılan Puan</span>',
    '                            <span id="victory-highscore-badge" style="display: none; font-size: 9px; background: linear-gradient(90deg, #f59e0b, #d97706); color: #fff; font-weight: 900; padding: 2px 6px; border-radius: 6px;">🏆 YENİ REKOR!</span>',
    '                        </div>',
    '                        <div style="font-size: 26px; font-weight: 900; color: #fff; text-shadow: 0 0 16px rgba(245,197,66,0.7); margin: 1px 0;">',
    '                            <span id="victory-score">0</span>',
    '                        </div>',
    '                        ',
    '                        <!-- 3-Column Performance Stats Breakdown -->',
    '                        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 5px; margin-top: 5px; padding-top: 5px; border-top: 1px solid rgba(255,255,255,0.08); font-size: 9.5px;">',
    '                            <div style="background: rgba(255,255,255,0.04); border-radius: 7px; padding: 4px 2px;">',
    '                                <div style="color: #64748b; font-weight: 700;">Hedef</div>',
    '                                <div style="font-weight: 800; color: #cbd5e1;" id="victory-target-score">4,000</div>',
    '                            </div>',
    '                            <div style="background: rgba(255,255,255,0.04); border-radius: 7px; padding: 4px 2px;">',
    '                                <div style="color: #64748b; font-weight: 700;">Kalan Hamle</div>',
    '                                <div style="font-weight: 800; color: #4ade80;" id="victory-moves-left">+5 (Bonus)</div>',
    '                            </div>',
    '                            <div style="background: rgba(255,255,255,0.04); border-radius: 7px; padding: 4px 2px;">',
    '                                <div style="color: #64748b; font-weight: 700;">Başarı Oranı</div>',
    '                                <div style="font-weight: 800; color: #38bdf8;" id="victory-accuracy">%130</div>',
    '                            </div>',
    '                        </div>',
    '                    </div>',
    '',
    '                    <!-- XP & Level-Up Progression Bar -->',
    '                    <div style="background: rgba(0,0,0,0.45); border: 1px solid rgba(245, 197, 66, 0.35); border-radius: 11px; padding: 7px 12px; margin-bottom: 8px;">',
    '                        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 10.5px; margin-bottom: 4px;">',
    '                            <span style="font-weight: 800; color: var(--gold-light);">🎖️ OYUNCU SEVİYESİ: <span id="victory-player-level" style="color:#00d2ff; font-size:12px;">1</span></span>',
    '                            <span style="color: #38bdf8; font-weight: 800;" id="victory-xp-earned">+0 XP</span>',
    '                        </div>',
    '                        <div style="background: rgba(255,255,255,0.1); border-radius: 10px; height: 8px; overflow: hidden; position: relative; box-shadow: inset 0 1px 3px rgba(0,0,0,0.5);">',
    '                            <div id="victory-xp-fill" style="height: 100%; width: 0%; background: linear-gradient(90deg, #00d2ff, #f5c542); border-radius: 10px; transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);"></div>',
    '                        </div>',
    '                        <div style="display: flex; justify-content: space-between; font-size: 9px; color: #94a3b8; margin-top: 3px;">',
    '                            <span id="victory-xp-label">0 / 500 XP</span>',
    '                            <span id="victory-level-up-tag" style="color: #2ecc71; font-weight: 800; display: none; animation: pulse 1s infinite;">✨ SEVİYE ATLADIN! ✨</span>',
    '                        </div>',
    '                    </div>',
    '',
    '                    <!-- 5-Level Milestone Chest Container -->',
    '                    <div id="victory-milestone-box" style="display: none; background: linear-gradient(90deg, rgba(245,197,66,0.22), rgba(155,89,182,0.3)); border: 1.5px solid var(--gold-primary); border-radius: 11px; padding: 7px 10px; margin-bottom: 8px; text-align: center; box-shadow: 0 4px 15px rgba(245,197,66,0.25);">',
    '                        <div style="font-size: 11.5px; font-weight: 800; color: var(--gold-light);" id="victory-milestone-title">🎁 5. BÖLÜM AŞAMA SANDIĞI AÇILDI!</div>',
    '                        <div style="font-size: 10px; color: #e2e8f0; margin-top: 2px;" id="victory-milestone-desc">+300 Altın, +15 Elmas ve Kutsal Güçlendirici!</div>',
    '                    </div>',
    '',
    '                    <!-- Earned Gold & Gems Showcase -->',
    '                    <div style="display: flex; justify-content: space-around; background: rgba(0,0,0,0.45); padding: 7px 10px; border-radius: 10px; border: 1px solid rgba(245,197,66,0.25); margin-bottom: 8px;">',
    '                        <div>',
    '                            <div style="font-size: 9.5px; color: var(--gold-light); font-weight: 700;">Kazanılan Altın</div>',
    '                            <div style="font-size: 15px; font-weight: bold; color: var(--gold-primary);">💰 <span id="victory-gold">0</span></div>',
    '                        </div>',
    '                        <div>',
    '                            <div style="font-size: 9.5px; color: #38bdf8; font-weight: 700;">Kazanılan Elmas</div>',
    '                            <div style="font-size: 15px; font-weight: bold; color: #00d2ff;">💎 <span id="victory-gems">0</span></div>',
    '                        </div>',
    '                    </div>',
    '',
    '                    <div style="font-size: 10.5px; color: var(--gold-light); font-weight: 800; margin-bottom: 9px; letter-spacing: 0.5px; text-align: center;" id="unlock-hero-notify">🔓 SONRAKİ BÖLÜMÜN KİLİDİ AÇILDI!</div>',
    '',
    '                    <!-- BUTTON GROUP (Bütüncül, Uyumlu ve Şık Tasarım) -->',
    '                    <!-- 1. HERO CALL TO ACTION: SONRAKİ BÖLÜME GEÇ (btn-action-gold) -->',
    '                    <button class="btn-action-gold" id="btn-victory-next" style="height: 44px; font-size: 14px; font-weight: 900; margin-bottom: 7px; border-radius: 12px; display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; letter-spacing: 0.5px;" onclick="playNextLevelDirectly()">⚡ SONRAKİ BÖLÜME GEÇ (Bölüm <span id="next-lvl-num-btn">2</span>) ➔</button>',
    '',
    '                    <!-- 2. REWARDED 2X DOUBLE AD BUTTON (Altın Amber Şık Parıltılı) -->',
    '                    <button class="btn-action" id="btn-victory-double-ad" style="background: linear-gradient(180deg, rgba(245,197,66,0.2) 0%, rgba(212,154,29,0.32) 100%); border: 1.5px solid var(--gold-primary); color: var(--gold-light); font-weight: 800; height: 38px; font-size: 12px; margin-bottom: 7px; box-shadow: 0 2px 10px rgba(245,197,66,0.2); display: flex; align-items: center; justify-content: center; gap: 6px; width: 100%; border-radius: 11px;" onclick="watchAdToDoubleVictoryRewards()">',
    '                        <span>🎬 2X ÖDÜL KAZAN (Ödüllü Video)</span>',
    '                    </button>',
    '',
    '                    <!-- 3. RETURN TO MAP BUTTON -->',
    '                    <button class="btn-action-sub" style="height: 34px; font-size: 11.5px; border-radius: 10px; display: flex; align-items: center; justify-content: center; width: 100%; margin-top: 0; background: rgba(255,255,255,0.05); border: 1px solid rgba(245,197,66,0.28); color: #cbd5e1; font-weight: 800;" onclick="nextLevelAndUnlock()">🗺️ HARİTAYA DÖN</button>',
    '                </div>',
    '            </div>',
    ''
];

lines.splice(vicStart, vicEnd - vicStart, ...replacementVictory);
console.log("Successfully replaced modal-victory!");

// 3. Update showVictory() button background styling override
const vicJsIdx = lines.findIndex(l => l.includes('doubleAdBtn.style.background = \'linear-gradient(180deg, #f59e0b'));
if (vicJsIdx !== -1) {
    lines[vicJsIdx] = '                doubleAdBtn.style.background = \'linear-gradient(180deg, rgba(245,197,66,0.2) 0%, rgba(212,154,29,0.32) 100%)\';\n                doubleAdBtn.style.border = \'1.5px solid var(--gold-primary)\';\n                doubleAdBtn.style.color = \'var(--gold-light)\';';
    console.log("Updated showVictory() doubleAdBtn style override");
}

const newline = isCrlf ? '\r\n' : '\n';
fs.writeFileSync(path, lines.join(newline), 'utf8');
console.log("Successfully applied unified modal styling to www/index.html!");

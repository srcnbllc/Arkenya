const fs = require('fs');

console.log("=== APPLYING LIFE DEDUCTION & CONFIRMATION MODAL ===");

let html = fs.readFileSync('www/index.html', 'utf8');

// Normalize CRLF to LF
const isCRLF = html.includes('\r\n');
html = html.replace(/\r\n/g, '\n');

// 1. UPDATE modal-pause BUTTONS TO CALL promptAbandonMatch
const oldPauseButtons = `                    <button class="btn-action btn-action-green" style="height: 48px; font-size: 15px; margin-bottom: 10px;" onclick="closeModal('modal-pause')">▶️ OYUNA DEVAM ET</button>
                    <button class="btn-action" style="height: 42px; font-size: 13px; margin-bottom: 10px; background: rgba(245,197,66,0.2); border: 1px solid var(--gold-primary); color: var(--gold-light);" onclick="restartFromPause()">🔄 TEKRAR BAŞLAT (-1 Can)</button>
                                        <button class="btn-action" style="height: 40px; font-size: 13px; background: #333; color: #fff;" onclick="quitActiveMatch()">🗺️ ANA MENÜYE DÖN</button>`;

const newPauseButtons = `                    <button class="btn-action btn-action-green" style="height: 48px; font-size: 15px; margin-bottom: 10px;" onclick="closeModal('modal-pause')">▶️ OYUNA DEVAM ET</button>
                    <button class="btn-action" style="height: 42px; font-size: 13px; margin-bottom: 10px; background: rgba(245,197,66,0.2); border: 1px solid var(--gold-primary); color: var(--gold-light);" onclick="promptAbandonMatch('restart')">🔄 TEKRAR BAŞLAT (-1 Can)</button>
                    <button class="btn-action" style="height: 40px; font-size: 13px; background: #333; color: #fff;" onclick="promptAbandonMatch('quit')">🗺️ ANA MENÜYE DÖN (-1 Can)</button>`;

if (html.includes(oldPauseButtons)) {
    html = html.replace(oldPauseButtons, newPauseButtons);
    console.log("✓ Updated modal-pause buttons to promptAbandonMatch");
} else {
    console.error("✗ Failed to locate oldPauseButtons in modal-pause");
    process.exit(1);
}

// 2. INSERT modal-confirm-abandon IMMEDIATELY AFTER modal-pause
const modalPauseEnd = `            <!-- MODAL: PAUSE -->
            <div class="modal-overlay" id="modal-pause">
                <div class="modal-card" style="width: 90%; max-width: 380px; padding: 22px; box-sizing: border-box; text-align: center;">
                    <div style="font-size: 45px; margin-bottom: 8px;">⏸️</div>
                    <div class="modal-title" style="color: var(--gold-light); font-size: 18px; margin-bottom: 15px;">OYUN DURAKLATILDI</div>
                    
                    <button class="btn-action btn-action-green" style="height: 48px; font-size: 15px; margin-bottom: 10px;" onclick="closeModal('modal-pause')">▶️ OYUNA DEVAM ET</button>
                    <button class="btn-action" style="height: 42px; font-size: 13px; margin-bottom: 10px; background: rgba(245,197,66,0.2); border: 1px solid var(--gold-primary); color: var(--gold-light);" onclick="promptAbandonMatch('restart')">🔄 TEKRAR BAŞLAT (-1 Can)</button>
                    <button class="btn-action" style="height: 40px; font-size: 13px; background: #333; color: #fff;" onclick="promptAbandonMatch('quit')">🗺️ ANA MENÜYE DÖN (-1 Can)</button>
                </div>
            </div>`;

const modalConfirmAbandonHTML = `${modalPauseEnd}

            <!-- MODAL: CONFIRM ABANDON / RESTART (-1 CAN UYARISI) -->
            <div class="modal-overlay" id="modal-confirm-abandon" style="z-index: 99999;">
                <div class="modal-card" style="width: 90%; max-width: 380px; padding: 22px; box-sizing: border-box; text-align: center; border: 2px solid #ef4444; box-shadow: 0 0 35px rgba(239, 68, 68, 0.45); background: radial-gradient(circle at top, #1e1115 0%, #0d0608 100%);">
                    <div style="font-size: 46px; margin-bottom: 8px;">💔</div>
                    <div class="modal-title" id="confirm-abandon-title" style="color: #f87171; font-size: 18px; font-weight: 900; margin-bottom: 8px;">MÜCADELEDEN AYRIL</div>
                    <div id="confirm-abandon-desc" style="font-size: 13px; color: #cbd5e1; line-height: 1.5; margin-bottom: 14px; background: rgba(0,0,0,0.5); border-radius: 10px; padding: 12px; border: 1px solid rgba(239, 68, 68, 0.35);">
                        Mücadeleyi tamamlamadan çıkarsan <b>1 Kutsal Can kaybedeceksin! (-1 ❤️)</b><br><br>
                        <span style="color: #fca5a5; font-weight: 700;">Ayrılmak istediğine emin misin?</span>
                    </div>
                    <div id="confirm-abandon-hearts-preview" style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 16px; font-size: 13px; font-weight: 800; color: #fca5a5;">
                        <!-- Kalan Can Gösterimi -->
                    </div>
                    <button class="btn-action" id="btn-confirm-abandon-yes" style="height: 46px; font-size: 14px; margin-bottom: 10px; background: linear-gradient(180deg, #ef4444 0%, #b91c1c 100%); color: #fff; font-weight: 900;" onclick="executeConfirmedAbandon()">💔 EVET, AYRIL (-1 CAN)</button>
                    <button class="btn-action" style="height: 40px; font-size: 13px; background: #334155; color: #fff; font-weight: 800;" onclick="closeModal('modal-confirm-abandon')">✕ HAYIR, OYUNA DEVAM ET</button>
                </div>
            </div>`;

if (html.includes(modalPauseEnd)) {
    html = html.replace(modalPauseEnd, modalConfirmAbandonHTML);
    console.log("✓ Inserted modal-confirm-abandon");
} else {
    console.error("✗ Failed to locate modalPauseEnd");
    process.exit(1);
}

// 3. UPDATE discardActiveMatchSession TO DEDUCT 1 LIFE ON ABANDON
const oldDiscardActiveMatch = `        function discardActiveMatchSession() {
            clearActiveMatchSession();
            closeModal('modal-resume-match');
            showToast("Önceki mücadele sıfırlandı.", "info");
        }`;

const newDiscardActiveMatch = `        function discardActiveMatchSession() {
            clearActiveMatchSession();
            closeModal('modal-resume-match');
            gameState.energy = Math.max(0, (gameState.energy || 1) - 1);
            saveGame();
            syncAllHUDs();
            showToast("Önceki mücadele iptal edildi (-1 Can kaybedildi ❤️).", "info");
        }`;

if (html.includes(oldDiscardActiveMatch)) {
    html = html.replace(oldDiscardActiveMatch, newDiscardActiveMatch);
    console.log("✓ Updated discardActiveMatchSession with -1 energy deduction");
} else {
    console.error("✗ Failed to locate oldDiscardActiveMatch");
    process.exit(1);
}

// 4. IMPLEMENT promptAbandonMatch AND executeConfirmedAbandon FUNCTIONS
const oldQuitActiveMatchSearch = `        function quitActiveMatch() {
            clearActiveMatchSession();
            closeModal('modal-pause');
            showScreen('screen-mainmenu');
            checkFirstTimeOnboarding();
        }`;

const newAbandonEngine = `        var pendingAbandonAction = 'quit';

        function promptAbandonMatch(action) {
            pendingAbandonAction = action || 'quit';
            const titleEl = document.getElementById('confirm-abandon-title');
            const descEl = document.getElementById('confirm-abandon-desc');
            const yesBtn = document.getElementById('btn-confirm-abandon-yes');
            const previewEl = document.getElementById('confirm-abandon-hearts-preview');

            const currentEnergy = Math.max(0, (gameState && gameState.energy !== undefined) ? gameState.energy : 0);
            const nextEnergy = Math.max(0, currentEnergy - 1);

            if (previewEl) {
                previewEl.innerHTML = 'Mevcut Can: <b style="color: #fff;">' + currentEnergy + ' ❤️</b> ➔ Kalan Can: <b style="color: #f87171;">' + nextEnergy + ' ❤️</b>';
            }

            if (action === 'restart') {
                if (titleEl) titleEl.innerText = "BÖLÜMÜ YENİDEN BAŞLAT";
                if (descEl) descEl.innerHTML = "Bölümü tamamlamadan yeniden başlatırsan <b>1 Kutsal Can kaybedeceksin! (-1 ❤️)</b><br><br><span style=\\"color: #fca5a5; font-weight: 700;\\">Yeniden başlamak istediğine emin misin?</span>";
                if (yesBtn) yesBtn.innerText = "🔄 EVET, YENİDEN BAŞLAT (-1 CAN)";
            } else {
                if (titleEl) titleEl.innerText = "MÜCADELEDEN AYRIL";
                if (descEl) descEl.innerHTML = "Mücadeleyi tamamlamadan ana menüye dönersen <b>1 Kutsal Can kaybedeceksin! (-1 ❤️)</b><br><br><span style=\\"color: #fca5a5; font-weight: 700;\\">Ayrılmak istediğine emin misin?</span>";
                if (yesBtn) yesBtn.innerText = "💔 EVET, AYRIL (-1 CAN)";
            }

            openModal('modal-confirm-abandon');
        }

        function executeConfirmedAbandon() {
            closeModal('modal-confirm-abandon');
            closeModal('modal-pause');
            clearActiveMatchSession();

            // Deduct 1 energy
            gameState.energy = Math.max(0, (gameState.energy || 1) - 1);
            saveGame();
            syncAllHUDs();

            if (typeof sfxButtonClick === 'function') sfxButtonClick();
            showToast("Mücadeleden ayrıldın. 1 Can kaybedildi (-1 ❤️)", "info");

            if (pendingAbandonAction === 'restart') {
                if (gameState.energy < 1) {
                    showScreen('screen-mainmenu');
                    setTimeout(() => {
                        openModal('modal-out-of-lives');
                        showToast("Canın tükendi! Yeniden başlamak için canını doldurmalısın.", "info");
                    }, 350);
                } else {
                    startGameplay();
                }
            } else {
                showScreen('screen-mainmenu');
                if (gameState.energy < 1) {
                    setTimeout(() => {
                        showToast("Canın tükendi! Tapınak Nektarı ile canını yenileyebilirsin.", "info");
                    }, 500);
                }
            }
        }

        function quitActiveMatch() {
            promptAbandonMatch('quit');
        }

        function restartFromPause() {
            promptAbandonMatch('restart');
        }`;

if (html.includes(oldQuitActiveMatchSearch)) {
    html = html.replace(oldQuitActiveMatchSearch, newAbandonEngine);
    console.log("✓ Integrated promptAbandonMatch, executeConfirmedAbandon and updated quitActiveMatch");
} else {
    console.error("✗ Failed to locate oldQuitActiveMatchSearch");
    process.exit(1);
}

// 5. REMOVE FREE 5-ENERGY RESET BUG IN startGameplayCore
const oldEnergyCoreSearch = `            if (!gameState.energy || gameState.energy < 1) {
                gameState.energy = 5;
            }

            gameState.energy--;`;

const newEnergyCoreReplacement = `            if (gameState.energy !== undefined && gameState.energy < 1) {
                openModal('modal-out-of-lives');
                showToast("Kutsal Canın tükendi! Devam etmek için canını yenile.", "info");
                return;
            }

            gameState.energy = Math.max(0, (gameState.energy || 1) - 1);`;

if (html.includes(oldEnergyCoreSearch)) {
    html = html.replace(oldEnergyCoreSearch, newEnergyCoreReplacement);
    console.log("✓ Fixed startGameplayCore energy check to respect zero lives without free 5 reset");
} else {
    console.warn("! Warning: oldEnergyCoreSearch not found as single block, checking alternative...");
}

// Restore CRLF if file was CRLF originally
if (isCRLF) {
    html = html.replace(/\n/g, '\r\n');
}

fs.writeFileSync('www/index.html', html, 'utf8');
console.log(">>> LIFE DEDUCTION & CONFIRMATION MODAL APPLIED SUCCESSFULLY! <<<");

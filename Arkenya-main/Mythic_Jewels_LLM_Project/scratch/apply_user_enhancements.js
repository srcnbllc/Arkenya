const fs = require('fs');

let html = fs.readFileSync('www/index.html', 'utf8');
const isCRLF = html.includes('\r\n');
html = html.replace(/\r\n/g, '\n');

console.log('--- 1. SCRUBBING TUNCEL KURTIZ MENTIONS ---');
html = html.replace(/Tuncel Kurtiz Style/g, 'Kadim Bilge');
html = html.replace(/Tuncel Kurtiz & Mythic Narrator/g, 'Kadim Bilge & Mistik Anlatıcı');
html = html.replace(/EFSANEYİ DİNLE \(Tuncel Kurtiz\)/g, 'KADİM EFSANEYİ DİNLE');
html = html.replace(/TUNCEL KURTIZ & LOTR STYLE/g, 'KADİM BİLGE & LOTR STYLE');
html = html.replace(/studio Tuncel Kurtiz narration/g, 'Kadim Bilge narration');
html = html.replace(/Tuncel Kurtiz voice/g, 'Kadim Bilge sesi');
html = html.replace(/Tuncel Kurtiz/g, 'Kadim Bilge');

console.log('--- 2. INLINING NEW ORGANIC AUDIO BASE64 ---');
const newAudioData = fs.readFileSync('www/assets/audio/narrator_audio_data.js', 'utf8').replace(/\r\n/g, '\n');
const audioScriptRegex = /<script id="inlined-narrator-audio">[\s\S]*?<\/script>/;
if (audioScriptRegex.test(html)) {
    html = html.replace(audioScriptRegex, `<script id="inlined-narrator-audio">\n${newAudioData}\n</script>`);
    console.log('Updated inlined-narrator-audio script');
} else {
    console.warn('inlined-narrator-audio not found!');
}

console.log('--- 3. REMOVING RESET BUTTON FROM MAIN MENU ---');
const oldMainMenuReset = `<button class="reset-btn-link" onclick="resetProgressToFresh()">🔄 Oyunu Sıfırla (Bölüm 1'den Başlat)</button>`;
if (html.includes(oldMainMenuReset)) {
    html = html.replace(oldMainMenuReset, '');
    console.log('Removed reset button from main menu');
}

console.log('--- 4. ADDING MODAL-CONFIRM-RESET AND SETTINGS/PROFILE RESET BUTTONS ---');
const modalConfirmResetHTML = `<!-- MODAL: CONFIRM RESET GAME -->
            <div class="modal-overlay" id="modal-confirm-reset">
                <div class="modal-card" style="width: 90%; max-width: 380px; padding: 22px; box-sizing: border-box; text-align: center; border: 2px solid #ef4444; box-shadow: 0 0 35px rgba(239, 68, 68, 0.4);">
                    <div style="font-size: 44px; margin-bottom: 8px;">⚠️</div>
                    <div class="modal-title" style="color: #f87171; font-size: 18px; margin-bottom: 8px;">OYUNU SIFIRLA</div>
                    <div style="font-size: 13px; color: #cbd5e1; line-height: 1.5; margin-bottom: 18px; background: rgba(0,0,0,0.35); border-radius: 10px; padding: 12px; border: 1px solid rgba(239, 68, 68, 0.3);">
                        Tüm bölüm ilerlemeleri, kazanılan yıldızlar, altınlar ve elmaslar kalıcı olarak silinecek ve <b>1. Bölümden sıfır puanla</b> yeniden başlayacaksın.<br><br><span style="color:#fca5a5; font-weight:700;">Bu işlem geri alınamaz. Emin misin?</span>
                    </div>
                    <button class="btn-action" style="height: 48px; font-size: 14.5px; margin-bottom: 10px; background: linear-gradient(180deg, #ef4444 0%, #b91c1c 100%); color: #fff; font-weight:800;" onclick="executeFullGameReset()">🔥 EVET, HER ŞEYİ SIFIRLA</button>
                    <button class="btn-action" style="height: 38px; font-size: 12.5px; background: #333; color: #fff;" onclick="closeModal('modal-confirm-reset')">✕ VAZGEÇ</button>
                </div>
            </div>

            <!-- MODAL: RESUME MATCH (CRASH & INTERRUPT RECOVERY) -->`;

if (html.includes('<!-- MODAL: RESUME MATCH (CRASH & INTERRUPT RECOVERY) -->') && !html.includes('id="modal-confirm-reset"')) {
    html = html.replace('<!-- MODAL: RESUME MATCH (CRASH & INTERRUPT RECOVERY) -->', modalConfirmResetHTML);
    console.log('Added modal-confirm-reset HTML');
}

// Add reset button inside Settings Modal
const oldSettingsClose = `<button class="btn-action btn-action-green" onclick="closeModal('modal-settings')">KAYDET VE KAPAT</button>`;
const newSettingsClose = `<div style="margin-top: 16px; margin-bottom: 14px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 14px;">
                        <button class="btn-action" style="height: 42px; font-size: 13px; background: rgba(239, 68, 68, 0.15); border: 1px solid #ef4444; color: #fca5a5; font-weight: 700;" onclick="openModal('modal-confirm-reset')">🔄 TÜM OYUN VERİLERİNİ SIFIRLA</button>
                    </div>
                    <button class="btn-action btn-action-green" onclick="closeModal('modal-settings')">KAYDET VE KAPAT</button>`;

if (html.includes(oldSettingsClose) && !html.includes('onclick="openModal(\'modal-confirm-reset\')"')) {
    html = html.replace(oldSettingsClose, newSettingsClose);
    console.log('Added Reset Game button inside Settings modal');
}

console.log('--- 5. MOVING GLOBAL-BOTTOM-NAV TO ROOT POSITION & FIXING STORE SCREEN ---');
// Fix screen-store inline style that caused stacking context overflow
const oldStoreStyle = `<div class="screen" id="screen-store" style="background: linear-gradient(180deg, #070b14 0%, #0d1527 50%, #060913 100%); position: relative; overflow: hidden; display: flex; flex-direction: column;">`;
const newStoreStyle = `<div class="screen" id="screen-store" style="background: linear-gradient(180deg, #070b14 0%, #0d1527 50%, #060913 100%);">`;
if (html.includes(oldStoreStyle)) {
    html = html.replace(oldStoreStyle, newStoreStyle);
    console.log('Fixed screen-store container style');
}

// Update .bottom-nav CSS rule
const oldBottomNavCss = `.bottom-nav {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 72px;
            background: linear-gradient(180deg, rgba(15, 22, 38, 0.98) 0%, rgba(4, 6, 10, 1) 100%);
            border-top: 2.5px solid var(--gold-primary);
            box-shadow: 0 -4px 25px rgba(245, 197, 66, 0.3), inset 0 1px 2px rgba(255,255,255,0.2);
            display: flex;
            justify-content: space-around;
            align-items: center;
            padding-bottom: 8px;
            z-index: 400;
            box-sizing: border-box;
        }`;

const newBottomNavCss = `.bottom-nav {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 72px;
            background: linear-gradient(180deg, rgba(15, 22, 38, 0.98) 0%, rgba(4, 6, 10, 1) 100%);
            border-top: 2.5px solid var(--gold-primary);
            box-shadow: 0 -4px 25px rgba(245, 197, 66, 0.35), inset 0 1px 2px rgba(255,255,255,0.2);
            display: flex;
            justify-content: space-around;
            align-items: center;
            padding-bottom: 8px;
            z-index: 500;
            box-sizing: border-box;
            pointer-events: auto;
        }`;

if (html.includes(oldBottomNavCss)) {
    html = html.replace(oldBottomNavCss, newBottomNavCss);
    console.log('Updated .bottom-nav CSS to z-index 500');
}

console.log('--- 6. BALANCING LEVEL 1 TARGET SCORE & 1-5 ONBOARDING FLOW ---');
// Level 1: Herkül'ün Uyanışı - Target 4000, maxMoves 30 (prevents single-combo accidental finish)
const oldLvl1 = `1: { title: "Herkül'ün Uyanışı", desc: "Olimpos'a ilk adım! 3 aynı taşı yan yana getirerek eşleştir.", targetScore: 2500, maxMoves: 35, tip: "👉 3 aynı taşı yan yana kaydırarak eşleştir!" },`;
const newLvl1 = `1: { title: "Herkül'ün Uyanışı", desc: "Olimpos'a ilk adım! 3 aynı taşı yan yana getirerek eşleştir.", targetScore: 4000, maxMoves: 30, tip: "👉 3 aynı taşı yan yana kaydırarak eşleştir!" },`;
if (html.includes(oldLvl1)) {
    html = html.replace(oldLvl1, newLvl1);
    console.log('Updated Level 1 targetScore to 4000');
}

// Update setupLevelTutorial to comprehensive 1-5 steps
const oldTutorialBlock = `        function setupLevelTutorial(lvl) {
            lvl = lvl || gameState.currentPlayingLevel || 1;
            if (!gameState.completedTutorials) gameState.completedTutorials = {};

            // If already completed or level > 4, do nothing
            if (gameState.completedTutorials[lvl] || lvl > 4) return;`;

const newTutorialBlock = `        function setupLevelTutorial(lvl) {
            lvl = lvl || gameState.currentPlayingLevel || 1;
            if (!gameState.completedTutorials) gameState.completedTutorials = {};

            // If already completed or level > 5, do nothing
            if (gameState.completedTutorials[lvl] || lvl > 5) return;`;

if (html.includes(oldTutorialBlock)) {
    html = html.replace(oldTutorialBlock, newTutorialBlock);
    console.log('Expanded tutorial to cover Level 5');
}

// Add Level 5 booster onboarding step in setupLevelTutorial
const oldLvl4Tutorial = `            } else if (lvl === 4) {
                // Level 4: Hero Ability & Gauge
                showOnboardingBanner("🛡️ 4. BÖLÜM: KAHRAMAN İLAHİ GÜCÜ!<br><span style='font-size: 11px; opacity:0.85;'>Eşleştirmelerle sol alttaki Kombo Barını doldur, %100 olunca 'Yetenek Kullan' ile gücünü patlat!</span>", 7000);
            }`;

const newLvl4Lvl5Tutorial = `            } else if (lvl === 4) {
                // Level 4: Hero Ability & Gauge
                showOnboardingBanner("🛡️ 4. BÖLÜM: KAHRAMAN İLAHİ GÜCÜ AÇILDI!<br><span style='font-size: 11px; opacity:0.85;'>Sol alttaki Kombo Barı açıldı! Eşleştirmelerle barı doldur, %100 olunca 'Yetenek Kullan' ile tahtayı sars!</span>", 8000);
            } else if (lvl === 5) {
                // Level 5: Boosters & Milestone Chest
                showOnboardingBanner("🎁 5. BÖLÜM: GÜÇLENDİRİCİLER & BÜYÜK SANDIK!<br><span style='font-size: 11px; opacity:0.85;'>Sıkıştığında üstteki Zeus Şimşeği ve Athena Kalkanını kullan! Bölüm bitiminde Büyük Aşama Sandığı açılacak!</span>", 8000);
            }`;

if (html.includes(oldLvl4Tutorial)) {
    html = html.replace(oldLvl4Tutorial, newLvl4Lvl5Tutorial);
    console.log('Added Level 5 Booster & Milestone tutorial step');
}

// Lock Hero Ability for Level 1-3
const oldStartCore = `            const heroKey = (gameState.selectedHero && HEROES[gameState.selectedHero]) ? gameState.selectedHero : 'asterion';
            const hero = HEROES[heroKey];
            if (hero) {
                const avatarEl = document.getElementById('game-hero-avatar-mini');
                const abilityEl = document.getElementById('game-ability-name');
                if (avatarEl) avatarEl.style.backgroundImage = \`url('\${hero.bg}')\`;
                if (abilityEl) abilityEl.innerText = hero.ability;
            }

            updateGameplayPowerups();`;

const newStartCore = `            const heroKey = (gameState.selectedHero && HEROES[gameState.selectedHero]) ? gameState.selectedHero : 'asterion';
            const hero = HEROES[heroKey];
            const btnUseAbility = document.getElementById('btn-use-ability');
            const gameGaugeTxt = document.getElementById('game-gauge-txt');

            if (hero) {
                const avatarEl = document.getElementById('game-hero-avatar-mini');
                const abilityEl = document.getElementById('game-ability-name');
                if (avatarEl) avatarEl.style.backgroundImage = \`url('\${hero.bg}')\`;
                if (abilityEl) abilityEl.innerText = hero.ability;
            }

            if (lvl < 4) {
                if (btnUseAbility) {
                    btnUseAbility.disabled = true;
                    btnUseAbility.innerText = "🔒 4. BÖLÜMDE AÇILIR";
                }
                if (gameGaugeTxt) {
                    gameGaugeTxt.innerText = "Kilitli (Bölüm 4)";
                }
            } else {
                if (btnUseAbility) {
                    btnUseAbility.disabled = (gameGauge < 100);
                    btnUseAbility.innerText = "YETENEK KULLAN";
                }
                if (gameGaugeTxt) {
                    gameGaugeTxt.innerText = \`\${gameGauge}% (Kombo)\`;
                }
            }

            updateGameplayPowerups();`;

if (html.includes(oldStartCore)) {
    html = html.replace(oldStartCore, newStartCore);
    console.log('Added Level 1-3 Hero Ability lock');
}

// Add executeFullGameReset function
const resetFunctions = `
        function executeFullGameReset() {
            closeModal('modal-confirm-reset');
            closeModal('modal-settings');
            closeModal('modal-profile');

            localStorage.removeItem('arkenya_save_v11');
            localStorage.removeItem('arkenya_active_match');

            gameState = Object.assign({}, defaultState);
            gameState.completedLevels = {};
            gameState.completedTutorials = {};
            gameState.unlockedLevel = 1;
            gameState.currentPlayingLevel = 1;
            gameState.totalScore = 0;
            gameState.gold = 0;
            gameState.gems = 0;
            gameState.energy = 5;
            gameState.hasSeenPrologue = false;

            saveGame();
            updateHUD();
            updateHeroLockBadges();
            renderMap();

            showToast("🔥 Tüm oyun verileri sıfırlandı! Yeni maceraya hoş geldin.", "success");
            showScreen('screen-mainmenu');
        }
`;

const oldResetFunc = `        function resetProgressToFresh() {`;
if (html.includes(oldResetFunc)) {
    html = html.replace(oldResetFunc, `${resetFunctions}\n        function resetProgressToFresh() {`);
    console.log('Added executeFullGameReset implementation');
}

if (isCRLF) {
    html = html.replace(/\n/g, '\r\n');
}

fs.writeFileSync('www/index.html', html, 'utf8');
console.log('Successfully updated www/index.html! Length:', html.length);

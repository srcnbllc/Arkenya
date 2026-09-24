const fs = require('fs');

let html = fs.readFileSync('www/index.html', 'utf8');

// 1. Add #modal-pantheon-lore modal HTML if missing
const pantheonModalHtml = `
    <!-- MODAL: 12 OLİMPOSLU PANTEON LORE & REHBERİ -->
    <div class="modal-overlay" id="modal-pantheon-lore" onclick="if(event.target===this)closeModal('modal-pantheon-lore')">
        <div class="modal-content" style="max-width: 440px; background: linear-gradient(135deg, rgba(14,20,34,0.98), rgba(6,10,18,0.98)); border: 2px solid var(--gold-primary); border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.8), 0 0 25px rgba(245,197,66,0.3); padding: 20px; max-height: 85vh; display: flex; flex-direction: column;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1.5px solid rgba(245,197,66,0.3); padding-bottom: 12px; margin-bottom: 15px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 24px;">🏛️</span>
                    <div>
                        <div style="font-size: 16px; font-weight: 900; color: var(--gold-light); letter-spacing: 0.8px;">12 OLİMPOSLU PANTEON</div>
                        <div style="font-size: 10px; color: #94a3b8;">Tanrıların kutsal alanları ve ilahi taşları</div>
                    </div>
                </div>
                <button onclick="closeModal('modal-pantheon-lore')" style="background: none; border: none; font-size: 20px; color: #aaa; cursor: pointer;">✕</button>
            </div>

            <!-- TANRILAR LİSTESİ (Dinamik renderPantheonLoreList() tarafından doldurulur) -->
            <div id="pantheon-gods-list" style="overflow-y: auto; display: flex; flex-direction: column; gap: 10px; padding-right: 4px; flex: 1;"></div>

            <button class="btn-action" style="width: 100%; height: 38px; margin-top: 15px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #e2e8f0; font-size: 12px; font-weight: 800;" onclick="closeModal('modal-pantheon-lore')">KAPAT</button>
        </div>
    </div>
`;

if (!html.includes('id="modal-pantheon-lore"')) {
    const endBodyIdx = html.lastIndexOf('</body>');
    html = html.substring(0, endBodyIdx) + '\n' + pantheonModalHtml + '\n' + html.substring(endBodyIdx);
    console.log("  [SUCCESS] Injected modal-pantheon-lore!");
}

// 2. Fix updateMainMenuUI to use textContent
const oldUpdateUI = `            if (nameEl) nameEl.innerText = profile.displayName || gameState.playerName || 'KADER';
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
            if (leagueFillEl) leagueFillEl.style.width = '32%';`;

const newUpdateUI = `            if (nameEl) nameEl.textContent = profile.displayName || gameState.playerName || 'KADER';
            if (lvlEl) lvlEl.textContent = 'Seviye ' + (gameState.playerLevel || 12);
            
            const xp = gameState.playerXp !== undefined ? gameState.playerXp : 2450;
            const maxXp = gameState.maxXp !== undefined ? gameState.maxXp : 5000;
            if (xpBarEl) xpBarEl.style.width = Math.min(100, Math.round((xp / maxXp) * 100)) + '%';
            if (xpTxtEl) xpTxtEl.textContent = xp.toLocaleString('tr-TR') + ' / ' + maxXp.toLocaleString('tr-TR');

            const gold = gameState.gold !== undefined ? gameState.gold : 12450;
            const gems = gameState.gems !== undefined ? gameState.gems : 320;
            if (goldEl) goldEl.textContent = gold.toLocaleString('tr-TR');
            if (gemsEl) gemsEl.textContent = gems.toLocaleString('tr-TR');

            // Lig Bilgisi
            const leagueNameEl = document.getElementById('mainmenu-league-name');
            const leagueProgEl = document.getElementById('mainmenu-league-progress-text');
            const leagueFillEl = document.getElementById('mainmenu-league-progress-fill');
            if (leagueNameEl) leagueNameEl.textContent = 'Kristal Lig';
            if (leagueProgEl) leagueProgEl.textContent = '320 / 1000';
            if (leagueFillEl) leagueFillEl.style.width = '32%';`;

if (html.includes(oldUpdateUI)) {
    html = html.replace(oldUpdateUI, newUpdateUI);
    console.log("  [SUCCESS] Updated updateMainMenuUI with textContent!");
} else {
    console.warn("  [WARN] oldUpdateUI exact string not found, doing regex replace...");
    html = html.replace(/nameEl\.innerText =/g, 'nameEl.textContent =');
    html = html.replace(/lvlEl\.innerText =/g, 'lvlEl.textContent =');
    html = html.replace(/xpTxtEl\.innerText =/g, 'xpTxtEl.textContent =');
    html = html.replace(/goldEl\.innerText =/g, 'goldEl.textContent =');
    html = html.replace(/gemsEl\.innerText =/g, 'gemsEl.textContent =');
    html = html.replace(/leagueNameEl\.innerText =/g, 'leagueNameEl.textContent =');
    html = html.replace(/leagueProgEl\.innerText =/g, 'leagueProgEl.textContent =');
    console.log("  [SUCCESS] Regex replace applied for textContent!");
}

// 3. Fix spawnFloatingText in claimDailyQuest
html = html.replace("spawnFloatingText('+' + amount + ' Altın!', '#ffd700');", "if (typeof spawnFloatingText === 'function') spawnFloatingText('+' + amount + ' Altın!', '#ffd700');");
html = html.replace("spawnFloatingText('+' + amount + ' Elmas!', '#00d2ff');", "if (typeof spawnFloatingText === 'function') spawnFloatingText('+' + amount + ' Elmas!', '#00d2ff');");
html = html.replace("spawnFloatingText('+1 Can!', '#ff5555');", "if (typeof spawnFloatingText === 'function') spawnFloatingText('+1 Can!', '#ff5555');");
html = html.replace("btnEl.innerText = 'ALINDI ✓';", "btnEl.textContent = 'ALINDI ✓';");

fs.writeFileSync('www/index.html', html, 'utf8');
console.log("  [SUCCESS] www/index.html updated with pantheon modal and textContent fixes!");

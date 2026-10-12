const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'www', 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. checkAndAwardComboJokerDrop level guard
const oldDropRegex = /function checkAndAwardComboJokerDrop\(comboMultiplier\)\s*\{[\r\n\s]*\/\/ Ender düşme kuralı: Bölüm başına maksimum 2 joker/;
const newDropCode = `function checkAndAwardComboJokerDrop(comboMultiplier) {
            // ONBOARDING KORUMASI: 1-5 seviyeleri arasında rastgele joker verilmez! Gerçek mücadele 6. seviyede başlar.
            const curLvl = gameState.currentPlayingLevel || 1;
            if (curLvl <= 5) return;

            // Ender düşme kuralı: Bölüm başına maksimum 2 joker`;

if (oldDropRegex.test(content)) {
    content = content.replace(oldDropRegex, newDropCode);
    console.log('✅ checkAndAwardComboJokerDrop guarded for levels 1-5');
} else {
    console.log('checkAndAwardComboJokerDrop already guarded or regex not matched.');
}

// 2. updateGameplayPowerups replacement
const pStart = content.indexOf('function updateGameplayPowerups() {');
const pEnd = content.indexOf('// BÖLÜM ÖNCESİ TAKVİYE', pStart);

const newPowerupsCode = `function updateGameplayPowerups() {
            updateGameplayLevelBadge();
            const dock = document.getElementById('gameplay-booster-vertical-dock');
            if (!dock) return;

            const currentLvl = gameState.currentPlayingLevel || gameState.unlockedLevel || 1;

            // ONBOARDING KORUMALARI:
            // Bölüm 1: Saf kutu kaydırma eğitimi (0 joker, dock tamamen temiz)
            // Bölüm 2: Özellik tanıtımı (Sadece 1x Deneme Zeus Şimşeği verilir ve gösterilir)
            // Bölüm 3-5: Kombo, Zeus Küresi ve Kahraman Yeteneği eğitimi
            if (currentLvl === 1) {
                if (gameState.inventory) {
                    gameState.inventory.zeus = 0;
                    gameState.inventory.athena = 0;
                    gameState.inventory.hermes = 0;
                    gameState.inventory.ares = 0;
                }
                dock.innerHTML = '';
                return;
            }

            if (currentLvl === 2) {
                // Seviye 2'de henüz deneme şimşeği kullanılmamışsa 1 hak tanımlanır
                if (gameState.inventory && (gameState.inventory.zeus || 0) < 1 && (!gameState.completedLevels || !gameState.completedLevels[2])) {
                    gameState.inventory.zeus = 1;
                }
                if (gameState.inventory) {
                    gameState.inventory.athena = 0;
                    gameState.inventory.hermes = 0;
                    gameState.inventory.ares = 0;
                }
            }

            const boosterMeta = [
                { id: 'zeus', icon: '⚡', title: 'Zeus Şimşeği (5 Taş Patlat)', border: '#f5c542', unlockLvl: 2 },
                { id: 'athena', icon: '🛡️', title: 'Athena Kalkanı (+5 Ekstra Hamle)', border: '#38bdf8', unlockLvl: 5 },
                { id: 'hermes', icon: '🌪️', title: 'Hermes Kasırgası (Tahtayı Karıştır)', border: '#4ade80', unlockLvl: 7 },
                { id: 'ares', icon: '💥', title: 'Ares Renk Bombası', border: '#f87171', unlockLvl: 10 }
            ];

            let html = '';
            boosterMeta.forEach(b => {
                if (currentLvl < b.unlockLvl) return;

                let count = (gameState.inventory && gameState.inventory[b.id]) || 0;
                if (count > 0) {
                    const isTrial = (currentLvl === 2 && b.id === 'zeus');
                    const badgeText = isTrial ? 'DENEME' : \`\${count}x\`;
                    const badgeBg = isTrial ? '#22c55e' : '#f5c542';
                    const badgeColor = isTrial ? '#ffffff' : '#000000';
                    const glowAnim = isTrial ? 'animation: tutorialPulse 1.2s infinite alternate;' : '';

                    html += \`
                        <div class="mythic-dock-booster-btn" 
                             id="dock-booster-\${b.id}"
                             onclick="usePowerup('\${b.id}')" 
                             title="\${b.title}"
                             style="width: 44px; height: 44px; border-radius: 10px; background: rgba(11, 16, 30, 0.95); border: 1.5px solid \${b.border}; display: flex; align-items: center; justify-content: center; position: relative; cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.6); transition: transform 0.15s ease, opacity 0.3s ease; \${glowAnim}"
                             onmousedown="this.style.transform='scale(0.92)'" 
                             onmouseup="this.style.transform='scale(1)'">
                            <span style="font-size: 20px; filter: drop-shadow(0 0 5px \${b.border});">\${b.icon}</span>
                            <span style="position: absolute; top: -5px; right: -5px; background: \${badgeBg}; color: \${badgeColor}; font-size: 8px; font-weight: 900; padding: 1px 4px; border-radius: 8px; border: 1px solid #ffffff; box-shadow: 0 2px 5px rgba(0,0,0,0.5);">\${badgeText}</span>
                        </div>
                    \`;
                }
            });

            dock.innerHTML = html;
        }\n\n        `;

if (pStart !== -1 && pEnd !== -1) {
    content = content.slice(0, pStart) + newPowerupsCode + content.slice(pEnd);
    console.log('✅ updateGameplayPowerups replaced successfully!');
} else {
    console.log('Warning: could not find updateGameplayPowerups start or end.');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('All changes written to www/index.html');

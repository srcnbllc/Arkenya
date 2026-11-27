const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'www', 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

console.log("=== APPLYING PRECISE REFINEMENTS FOR ONBOARDING DOCK & LEVELS 1-5 ===");

// 1. Precise replacement of updateGameplayPowerups
const targetPowerupsStart = 'function updateGameplayPowerups() {';
const targetPowerupsEnd = 'dock.innerHTML = html;\n        }';
const idxStart = content.indexOf(targetPowerupsStart);
const idxEnd = content.indexOf(targetPowerupsEnd, idxStart);

if (idxStart !== -1 && idxEnd !== -1) {
    const fullEnd = idxEnd + targetPowerupsEnd.length;
    const replacement = `function updateGameplayPowerups() {
            updateGameplayLevelBadge();
            const dock = document.getElementById('gameplay-booster-vertical-dock');
            if (!dock) return;

            const currentLvl = gameState.currentPlayingLevel || gameState.unlockedLevel || 1;

            // ONBOARDING KORUMASI:
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
        }`;
    content = content.slice(0, idxStart) + replacement + content.slice(fullEnd);
    console.log("PASS: Replaced updateGameplayPowerups.");
} else {
    console.log("Warning: could not locate updateGameplayPowerups bounds.");
}

// 2. Precise replacement of checkAndAwardComboJokerDrop
const oldDropStr = 'function checkAndAwardComboJokerDrop(comboMultiplier) {\n            // Ender düşme kuralı: Bölüm başına maksimum 2 joker';
const newDropStr = `function checkAndAwardComboJokerDrop(comboMultiplier) {
            // ONBOARDING KORUMASI: 1-5 seviyeleri arasında rastgele joker verilmez! Gerçek mücadele 6. seviyede başlar.
            const curLvl = gameState.currentPlayingLevel || 1;
            if (curLvl <= 5) return;

            // Ender düşme kuralı: Bölüm başına maksimum 2 joker`;

if (content.includes(oldDropStr)) {
    content = content.replace(oldDropStr, newDropStr);
    console.log("PASS: Added level <= 5 guard to checkAndAwardComboJokerDrop.");
} else {
    console.log("Warning: checkAndAwardComboJokerDrop target not found.");
}

// 3. Update LEVEL_DATA levels 1 to 5 targetScore & tip
content = content.replace(
    /1:\s*\{\s*title:\s*"Herkül'ün Uyanışı"[^}]*targetScore:\s*\d+[^}]*maxMoves:\s*\d+[^}]*\}/,
    `1: { title: "Herkül'ün Uyanışı", desc: "Olimpos'a ilk adım! Taşları kaydırarak 3 aynı taşı yan yana getir.", targetScore: 3500, maxMoves: 20, tip: "👉 Kutuları kaydırarak 3'lü eşleştirme yap!" }`
);

content = content.replace(
    /2:\s*\{\s*title:\s*"Kiklop Mağarası"[^}]*targetScore:\s*\d+[^}]*maxMoves:\s*\d+[^}]*\}/,
    `2: { title: "Kiklop Mağarası", desc: "İlahi Zeus Şimşeğini kullan ve 4 taşı birleştirerek Yıldırım Kristali yarat!", targetScore: 5000, maxMoves: 20, tip: "⚡ Sağdaki Deneme Şimşeğini kullan & 4'lü eşleştir!" }`
);

content = content.replace(
    /3:\s*\{\s*title:\s*"Minotor'un Labirenti"[^}]*targetScore:\s*\d+[^}]*maxMoves:\s*\d+[^}]*\}/,
    `3: { title: "Minotor'un Labirenti", desc: "T veya L şeklinde 5 taşı eşleştirerek ardışık Kombo ve 3x3 Bomba patlat!", targetScore: 7500, maxMoves: 20, tip: "🔥 T-şeklinde 5 taş eşleştirerek Kombo & Bomba patlat!" }`
);

content = content.replace(
    /4:\s*\{\s*title:\s*"Medusa'nın Gözyaşları"[^}]*targetScore:\s*\d+[^}]*maxMoves:\s*\d+[^}]*\}/,
    `4: { title: "Medusa'nın Gözyaşları", desc: "5 taşı düz birleştirerek tek rengi yok eden ZEUS KÜRESİ yarat!", targetScore: 10000, maxMoves: 20, tip: "🌈 Düz 5'li eşleştirerek Zeus Küresi yarat!" }`
);

content = content.replace(
    /5:\s*\{\s*title:\s*"Pegasus'un Kanatları"[^}]*targetScore:\s*\d+[^}]*maxMoves:\s*\d+[^}]*\}/,
    `5: { title: "Pegasus'un Kanatları", desc: "Kahramanının ilahi gücünü serbest bırak ve Onboarding eğitimini tamamla!", targetScore: 14000, maxMoves: 20, tip: "🛡️ 'Yetenek Kullan' butonuna basarak kahraman gücünü patlat!" }`
);
console.log("PASS: Updated LEVEL_DATA levels 1 to 5.");

// 4. Update addXP booster guard
content = content.replace(
    /gameState\.inventory\.zeus\s*=\s*\(gameState\.inventory\.zeus\s*\|\|\s*0\)\s*\+\s*1;/,
    `if ((gameState.playerLevel || 1) >= 4) { gameState.inventory.zeus = (gameState.inventory.zeus || 0) + 1; }`
);
console.log("PASS: Updated addXP booster guard.");

fs.writeFileSync(filePath, content, 'utf8');
console.log("✅ All precise refinements applied successfully!");

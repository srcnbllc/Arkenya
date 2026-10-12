const fs = require('fs');

const file = 'www/index.html';
let content = fs.readFileSync(file, 'utf8');

console.log("Applying Daily Quests, Video Ads, and In-game Bonus Scoring Rebalance...");

// 1. Store HTML adjustments for Free Gift, Ad Chest, Daily Quests Banner
content = content.replace(
    '150 💰 + 1x Nektar Canı ❤️',
    '40 💰 + 1x Nektar Canı ❤️'
);

content = content.replace(
    '<div style="font-size: 12px; font-weight: 900; color: var(--gold-light);">+50 Altın Sandığı</div>',
    '<div style="font-size: 12px; font-weight: 900; color: var(--gold-light);">+25 Altın Sandığı</div>'
);

content = content.replace(
    '50 💰 Altın (Günde 3 Kez: 150 💰)',
    '25 💰 Altın (Günde 3 Kez: 75 💰)'
);

content = content.replace(
    '3 Görevi tamamla: <b>+500 💰, +10 💎, +1 Athena 🛡️</b> kazan!',
    '3 Görevi tamamla: <b>+120 💰, +3 💎, +1 Athena 🛡️</b> kazan!'
);

// Level preview booster display matching actual logic (100 and 180)
content = content.replace(
    '<div style="font-size: 9.5px; color: var(--gold-light); font-weight: 800; margin-top: 2px;">150 💰 Altın</div>',
    '<div style="font-size: 9.5px; color: var(--gold-light); font-weight: 800; margin-top: 2px;">100 💰 Altın</div>'
);

content = content.replace(
    '<div style="font-size: 9.5px; color: var(--gold-light); font-weight: 800; margin-top: 2px;">300 💰 Altın</div>',
    '<div style="font-size: 9.5px; color: var(--gold-light); font-weight: 800; margin-top: 2px;">180 💰 Altın</div>'
);

// 2. DAILY_QUESTS_CONFIG rebalance
const oldQuestsConfigRegex = /const DAILY_QUESTS_CONFIG = \[[\s\S]*?id: 'q1'[\s\S]*?reward: \{ gold: 200, energy: 1 \},[\s\S]*?rewardText: '\+200 💰 \+ 1 Can ❤️'[\s\S]*?id: 'q2'[\s\S]*?reward: \{ gold: 300, items: \{ zeus: 1 \} \},[\s\S]*?rewardText: '\+300 💰 \+ 1x Zeus ⚡'[\s\S]*?id: 'q3'[\s\S]*?reward: \{ gems: 5 \},[\s\S]*?rewardText: '\+5 Elmas 💎'[\s\S]*?\];/;

const newQuestsConfig = `const DAILY_QUESTS_CONFIG = [
            {
                id: 'q1',
                title: '💎 100 Olimpos Taşı Patlat',
                desc: 'Oyun tahtasında 100 taş eşleştir veya patlat',
                target: 100,
                getCurrent: () => (gameState.dailyHub && gameState.dailyHub.quests ? (gameState.dailyHub.quests.q1_gems || 0) : 0),
                reward: { gold: 40, energy: 1 },
                rewardText: '+40 💰 + 1 Can ❤️'
            },
            {
                id: 'q2',
                title: '🏛️ 2 Bölüm Zaferi Kazan',
                desc: 'Bölümlerde hedef puana ulaşarak zafer kazan',
                target: 2,
                getCurrent: () => (gameState.dailyHub && gameState.dailyHub.quests ? (gameState.dailyHub.quests.q2_levels || 0) : 0),
                reward: { gold: 50, items: { zeus: 1 } },
                rewardText: '+50 💰 + 1x Zeus ⚡'
            },
            {
                id: 'q3',
                title: '⚡ 1 Kahraman Yeteneği Kullan',
                desc: 'Mücadele sırasında kahramanının özel yeteneğini kullan',
                target: 1,
                getCurrent: () => (gameState.dailyHub && gameState.dailyHub.quests ? (gameState.dailyHub.quests.q3_powers || 0) : 0),
                reward: { gems: 2 },
                rewardText: '+2 Elmas 💎'
            }
        ];`;

if (oldQuestsConfigRegex.test(content)) {
    content = content.replace(oldQuestsConfigRegex, newQuestsConfig);
    console.log("Updated DAILY_QUESTS_CONFIG!");
}

// Master chest text in renderDailyQuestsModal
content = content.replace(
    'Ödül: <b>+500 💰, +10 💎, +1 Athena Kalkanı 🛡️</b>',
    'Ödül: <b>+120 💰, +3 💎, +1 Athena Kalkanı 🛡️</b>'
);

// claimDailyMasterChest rewards
content = content.replace(
    'gameState.gold = (gameState.gold || 0) + 500;\n            gameState.gems = (gameState.gems || 0) + 10;',
    'gameState.gold = (gameState.gold || 0) + 120;\n            gameState.gems = (gameState.gems || 0) + 3;'
);
content = content.replace(
    'showToast("🏛️ Büyük Tapınak Sandığı Açıldı! (+500 💰, +10 💎, +1 Athena Kalkanı)", "success");',
    'showToast("🏛️ Büyük Tapınak Sandığı Açıldı! (+120 💰, +3 💎, +1 Athena Kalkanı)", "success");'
);

// claimStoreFreeGift rewards
content = content.replace(
    'gameState.gold = (gameState.gold || 0) + 150;\n            gameState.energy = Math.min(5, (gameState.energy || 0) + 1);',
    'gameState.gold = (gameState.gold || 0) + 40;\n            gameState.energy = Math.min(5, (gameState.energy || 0) + 1);'
);
content = content.replace(
    'showToast("🎁 Günün Hediyesi Alındı! (+150 Altın, +1 Can)", "success");',
    'showToast("🎁 Günün Hediyesi Alındı! (+40 Altın, +1 Can)", "success");'
);

// claimStoreAdChest rewards (25 gold instead of 50)
content = content.replace(
    'gameState.gold = (gameState.gold || 0) + 50;\n\n                const newCount = gameState.dailyHub.adChestCount;\n                showToast(`🎬 Sandık Açıldı! +50 Altın Kazandın! (3/${newCount})`, "success");',
    'gameState.gold = (gameState.gold || 0) + 25;\n\n                const newCount = gameState.dailyHub.adChestCount;\n                showToast(`🎬 Sandık Açıldı! +25 Altın Kazandın! (3/${newCount})`, "success");'
);

// 3. DAILY_REWARDS (7-day login streak) rebalance
const oldDailyRewardsRegex = /const DAILY_REWARDS = \[[\s\S]*?day: 1, gold: 300[\s\S]*?day: 7, gold: 1500, gems: 50[\s\S]*?\];/;

const newDailyRewards = `const DAILY_REWARDS = [
            { day: 1, gold: 40, gems: 0, items: { zeus: 1 }, text: '40 Altın + 1x Şimşek ⚡' },
            { day: 2, gold: 0, gems: 2, items: { athena: 1 }, text: '2 Elmas + 1x Kalkan 🛡️' },
            { day: 3, gold: 60, gems: 0, items: { hermes: 1 }, text: '60 Altın + 1x Kasırga 🌪️' },
            { day: 4, gold: 0, gems: 3, items: { ares: 1 }, text: '3 Elmas + 1x Ares Bombası 💥' },
            { day: 5, gold: 80, gems: 0, items: { energy: 1 }, text: '80 Altın + 1x Can İksiri 🧪' },
            { day: 6, gold: 0, gems: 4, items: { zeus: 1 }, text: '4 Elmas + 1x Şimşek ⚡' },
            { day: 7, gold: 150, gems: 6, items: { zeus: 1, athena: 1 }, text: '👑 150 Altın + 6 Elmas + 2 Güçlendirici' }
        ];`;

if (oldDailyRewardsRegex.test(content)) {
    content = content.replace(oldDailyRewardsRegex, newDailyRewards);
    console.log("Updated DAILY_REWARDS!");
}

// Second legacy DAILY_QUESTS rebalance
content = content.replace(
    `{ id: 'q1', title: 'Mitolojik Yıkım', desc: 'Oyunda 100 kırmızı taş patlat', target: 100, reward: { gems: 5 }, type: 'gemsBroken' },\n            { id: 'q2', title: 'İlahi Güç', desc: 'Özel yeteneğini 3 kez kullan', target: 3, reward: { gold: 500 }, type: 'powersUsed' },\n            { id: 'q3', title: 'Tüccar', desc: 'Mağazadan 1 eşya satın al', target: 1, reward: { gems: 10 }, type: 'itemsBought' }`,
    `{ id: 'q1', title: 'Mitolojik Yıkım', desc: 'Oyunda 100 kırmızı taş patlat', target: 100, reward: { gems: 2 }, type: 'gemsBroken' },\n            { id: 'q2', title: 'İlahi Güç', desc: 'Özel yeteneğini 3 kez kullan', target: 3, reward: { gold: 50 }, type: 'powersUsed' },\n            { id: 'q3', title: 'Tüccar', desc: 'Mağazadan 1 eşya satın al', target: 1, reward: { gems: 2 }, type: 'itemsBought' }`
);

// 4. Video Ad for Free Life (+1 Can & +15 Altın instead of +50)
content = content.replace(
    'window.AdGuard.showRewardedAd("+1 KUTSAL CAN & +50 ALTIN KAZAN"',
    'window.AdGuard.showRewardedAd("+1 KUTSAL CAN & +15 ALTIN KAZAN"'
);
content = content.replace(
    'gameState.energy = Math.min(maxE, (gameState.energy || 0) + 1);\n                gameState.gold = (gameState.gold || 0) + 50;\n                gameState.lastEnergyUpdate = Date.now();\n                saveGame();\n                syncAllHUDs();\n                closeModal(\'modal-out-of-lives\');\n                showToast("❤️ +1 Kutsal Can & 🪙 +50 Altın Eklendi! Olimpos seni bekliyor.", "success");',
    'gameState.energy = Math.min(maxE, (gameState.energy || 0) + 1);\n                gameState.gold = (gameState.gold || 0) + 15;\n                gameState.lastEnergyUpdate = Date.now();\n                saveGame();\n                syncAllHUDs();\n                closeModal(\'modal-out-of-lives\');\n                showToast("❤️ +1 Kutsal Can & 🪙 +15 Altın Eklendi! Olimpos seni bekliyor.", "success");'
);
content = content.replace(
    'gameState.energy = Math.min(maxE, (gameState.energy || 0) + 1);\n                gameState.gold = (gameState.gold || 0) + 50;\n                gameState.lastEnergyUpdate = Date.now();\n                saveGame();\n                syncAllHUDs();\n                closeModal(\'modal-out-of-lives\');\n                showToast("👑 VIP Reklamsız Pass: +1 Kutsal Can & +50 Altın hesabına aktarıldı!", "success");',
    'gameState.energy = Math.min(maxE, (gameState.energy || 0) + 1);\n                gameState.gold = (gameState.gold || 0) + 15;\n                gameState.lastEnergyUpdate = Date.now();\n                saveGame();\n                syncAllHUDs();\n                closeModal(\'modal-out-of-lives\');\n                showToast("👑 VIP Reklamsız Pass: +1 Kutsal Can & +15 Altın hesabına aktarıldı!", "success");'
);

// 5. In-game Bonus Scores Rebalance:
// A) Dual Special Combo: was destroyedCount * 75 -> now destroyedCount * 45
content = content.replace(
    'const earned = destroyedCount * 75;',
    'const earned = destroyedCount * 45;'
);

// B) Color Bomb: was destroyedCount * 250 -> now destroyedCount * 60
content = content.replace(
    'const earned = destroyedCount * 250;',
    'const earned = destroyedCount * 60;'
);

// C) Hero Ability: was blocksDestroyed * (500 + heroLvl * 100) -> now blocksDestroyed * (35 + heroLvl * 5)
content = content.replace(
    'const earned = blocksDestroyed * (500 + heroLvl * 100);',
    'const earned = blocksDestroyed * (35 + heroLvl * 5);'
);

fs.writeFileSync(file, content, 'utf8');
console.log("Successfully wrote rebalanced daily & bonus economy to www/index.html!");

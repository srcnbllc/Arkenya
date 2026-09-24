const fs = require('fs');

const filePath = 'www/index.html';
let content = fs.readFileSync(filePath, 'utf8');

const oldPool = `            const jokerPool = [
                { id: 'zeus', name: 'Zeus Şimşeği', icon: '⚡', desc: '5 Taş Patlat' },
                { id: 'athena', name: 'Athena Kalkanı', icon: '🛡️', desc: '+5 Hamle' },
                { id: 'hermes', name: 'Hermes Kasırgası', icon: '🌪️', desc: 'Tahtayı Karıştır' },
                { id: 'ares', name: 'Ares Gazabı', icon: '💥', desc: 'Renk Süpernovası' }
            ];
            const chosen = jokerPool[Math.floor(Math.random() * jokerPool.length)];`;

const newPool = `            const curLvl = gameState.currentPlayingLevel || gameState.unlockedLevel || 1;
            let availablePool = [
                { id: 'zeus', name: 'Zeus Şimşeği', icon: '⚡', desc: '5 Taş Patlat' }
            ];
            if (curLvl >= 4) availablePool.push({ id: 'athena', name: 'Athena Kalkanı', icon: '🛡️', desc: '+5 Hamle' });
            if (curLvl >= 7) availablePool.push({ id: 'hermes', name: 'Hermes Kasırgası', icon: '🌪️', desc: 'Tahtayı Karıştır' });
            if (curLvl >= 10) availablePool.push({ id: 'ares', name: 'Ares Gazabı', icon: '💥', desc: 'Renk Süpernovası' });
            const chosen = availablePool[Math.floor(Math.random() * availablePool.length)];`;

if (content.includes(oldPool)) {
    content = content.replace(oldPool, newPool);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('✅ SUCCESS: Updated availablePool in checkAndAwardComboJokerDrop based on unlocked levels.');
} else {
    console.warn('⚠️ oldPool string not found');
}

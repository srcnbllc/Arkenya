const fs = require('fs');
const html = fs.readFileSync('www/index.html', 'utf8');

console.log('modal-pantheon exists?', html.includes('id="modal-pantheon"'));
console.log('openPantheonModal exists?', html.includes('function openPantheonModal'));
console.log('modal-daily-quests exists?', html.includes('modal-daily-quests'));
console.log('openProfileModal exists?', html.includes('function openProfileModal'));
console.log('modal-settings exists?', html.includes('id="modal-settings"'));
console.log('modal-leaderboard exists?', html.includes('id="modal-leaderboard"'));

// Look for openPantheonModal implementation if exists
const pIdx = html.indexOf('function openPantheonModal');
if (pIdx !== -1) {
    console.log('=== openPantheonModal code ===');
    console.log(html.substring(pIdx, pIdx + 500));
}

// Look for updateTopHud or similar functions
const hudIdx = html.indexOf('function updateTopHud(');
if (hudIdx !== -1) {
    console.log('=== updateTopHud code ===');
    console.log(html.substring(hudIdx, hudIdx + 600));
} else {
    const updateStats = html.indexOf('function updateStatsUI(');
    if (updateStats !== -1) {
        console.log('=== updateStatsUI code ===');
        console.log(html.substring(updateStats, updateStats + 600));
    }
}

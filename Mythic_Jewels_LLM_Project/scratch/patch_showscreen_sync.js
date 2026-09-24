const fs = require('fs');

let html = fs.readFileSync('www/index.html', 'utf8');

// Find showScreen and updateHeroLockBadges
const pos = html.indexOf('function showScreen(');
if (pos === -1) {
    console.error("showScreen not found");
    process.exit(1);
}

const badgeCall = 'updateHeroLockBadges();';
const badgePos = html.indexOf(badgeCall, pos);
if (badgePos === -1) {
    console.error("updateHeroLockBadges not found after showScreen");
    process.exit(1);
}

const closeBracePos = html.indexOf('}', badgePos);
const replacement = `updateHeroLockBadges();\n            if (typeof syncMusicWithCurrentScreen === 'function') syncMusicWithCurrentScreen(screenId);`;

html = html.slice(0, badgePos) + replacement + html.slice(closeBracePos);
fs.writeFileSync('www/index.html', html, 'utf8');
console.log("Successfully injected syncMusicWithCurrentScreen into showScreen!");

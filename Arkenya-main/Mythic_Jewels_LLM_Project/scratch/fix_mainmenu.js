const fs = require('fs');

let html = fs.readFileSync('www/index.html', 'utf8');

// Replace openScreen with showScreen
html = html.replaceAll("openScreen('screen-store')", "showScreen('screen-store')");

// Fix sfx in openDailyQuestsModal and claimDailyQuest
html = html.replace('sfxBtn();', "if (typeof sfxButtonClick === 'function') sfxButtonClick();");
html = html.replace('sfxWin();', "if (typeof sfxVictory === 'function') sfxVictory();");

// Write back
fs.writeFileSync('www/index.html', html, 'utf8');
console.log("Fixed openScreen and sfx in www/index.html!");

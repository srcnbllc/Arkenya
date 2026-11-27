const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'www', 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

const duplicateLine = 'levelJokersDropped++;\r\n\r\n            const curLvl = gameState.currentPlayingLevel || gameState.unlockedLevel || 1;';
const duplicateLineLF = 'levelJokersDropped++;\n\n            const curLvl = gameState.currentPlayingLevel || gameState.unlockedLevel || 1;';

if (content.includes(duplicateLine)) {
    content = content.replace(duplicateLine, 'levelJokersDropped++;');
    console.log('✅ Removed duplicate curLvl (CRLF)');
} else if (content.includes(duplicateLineLF)) {
    content = content.replace(duplicateLineLF, 'levelJokersDropped++;');
    console.log('✅ Removed duplicate curLvl (LF)');
} else {
    console.log('Target not found directly, using regex');
    content = content.replace(/levelJokersDropped\+\+;\s*const curLvl = [^;]+;/, 'levelJokersDropped++;');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done!');

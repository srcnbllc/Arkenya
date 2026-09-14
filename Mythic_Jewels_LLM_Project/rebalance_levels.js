const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const regex = /const LEVEL_DATA = {([\s\S]*?)};\n/m;
const match = html.match(regex);
if(match) {
    let block = match[1];
    
    let newBlock = '';
    const lines = block.split('\n');
    for(let line of lines) {
        if(!line.trim()) continue;
        let lvlMatch = line.match(/^(\s*)(\d+):\s*{(.*)targetScore:\s*(\d+),\s*maxMoves:\s*(\d+)\s*},?/);
        if(lvlMatch) {
            let space = lvlMatch[1];
            let lvl = parseInt(lvlMatch[2]);
            let rest = lvlMatch[3];
            
            let rawScore = 5000 + (lvl - 1) * 1122.4489;
            let newScore = Math.round(rawScore / 250) * 250; 
            
            let newMoves = Math.round(35 - (lvl - 1) * 0.3061);
            
            newBlock += `${space}${lvl}: {${rest}targetScore: ${newScore}, maxMoves: ${newMoves} },\n`;
        } else {
            newBlock += line + '\n';
        }
    }
    
    let newHtml = html.replace(regex, `const LEVEL_DATA = {\n${newBlock}};\n`);
    fs.writeFileSync('index.html', newHtml);
    fs.writeFileSync('Arkenya_Playable_Demo.html', newHtml);
    console.log("SUCCESS");
} else {
    console.log("ERROR: LEVEL_DATA not found");
}

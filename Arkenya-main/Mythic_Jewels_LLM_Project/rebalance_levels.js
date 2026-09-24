const fs = require('fs');

let html = fs.readFileSync('www/index.html', 'utf8');

const regex = /const LEVEL_DATA = {([\s\S]*?)};\n/m;
const match = html.match(regex);
if(match) {
    let block = match[1];
    let newBlock = '';
    const lines = block.split('\n');
    
    for(let line of lines) {
        if(!line.trim()) continue;
        let lvlMatch = line.match(/^(\s*)(\d+):\s*{(.*?)targetScore:\s*(\d+),\s*maxMoves:\s*(\d+)\s*},?/);
        if(lvlMatch) {
            let space = lvlMatch[1];
            let lvl = parseInt(lvlMatch[2]);
            let rest = lvlMatch[3];
            
            // Base score progression (e.g. 5000 to 80000)
            let baseScore = 5000 + (lvl * 1500); 
            let scoreFluctuation = (Math.sin(lvl * 1.5) * 1000); // Rollercoaster
            
            let finalScore = baseScore + scoreFluctuation;
            
            // Bosses are spikes
            if (lvl % 10 === 0) {
                finalScore += 5000;
            }
            
            finalScore = Math.round(finalScore / 250) * 250;
            
            // Moves progression (35 down to 18)
            let baseMoves = 35 - (lvl * 0.35);
            let moveFluctuation = (Math.cos(lvl * 1.5) * 2);
            let finalMoves = Math.round(baseMoves + moveFluctuation);
            
            if (lvl % 10 === 0) {
                finalMoves -= 3; // Bosses have less moves
            }
            
            finalMoves = Math.max(15, finalMoves); // Cap minimum moves
            
            newBlock += `${space}${lvl}: {${rest}targetScore: ${finalScore}, maxMoves: ${finalMoves} },\n`;
        } else {
            newBlock += line + '\n';
        }
    }
    
    let newHtml = html.replace(regex, `const LEVEL_DATA = {\n${newBlock}};\n`);
    fs.writeFileSync('www/index.html', newHtml);
    console.log("SUCCESSFULLY REBALANCED LEVELS!");
} else {
    console.log("ERROR: LEVEL_DATA not found");
}

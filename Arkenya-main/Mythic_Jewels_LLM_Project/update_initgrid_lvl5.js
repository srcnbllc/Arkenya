const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'www', 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(
    'if (lvl <= 4 && (!gameState.completedTutorials || !gameState.completedTutorials[lvl]))',
    'if (lvl <= 5 && (!gameState.completedTutorials || !gameState.completedTutorials[lvl]))'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Updated initGrid to include Level 5 in progressive onboarding check');

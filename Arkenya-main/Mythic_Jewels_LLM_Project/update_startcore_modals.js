const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'www', 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

const oldCode = 'function startGameplayCore() {\n            activeTutorialLevel = null;\n            removeTutorialDOMVisuals();';
const oldCodeCRLF = 'function startGameplayCore() {\r\n            activeTutorialLevel = null;\r\n            removeTutorialDOMVisuals();';

const newCode = `function startGameplayCore() {\n            document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));\n            activeTutorialLevel = null;\n            removeTutorialDOMVisuals();`;
const newCodeCRLF = `function startGameplayCore() {\r\n            document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));\r\n            activeTutorialLevel = null;\r\n            removeTutorialDOMVisuals();`;

if (content.includes(oldCodeCRLF)) {
    content = content.replace(oldCodeCRLF, newCodeCRLF);
    console.log('✅ Added modal cleanup to startGameplayCore (CRLF)');
} else if (content.includes(oldCode)) {
    content = content.replace(oldCode, newCode);
    console.log('✅ Added modal cleanup to startGameplayCore (LF)');
} else {
    console.log('Target not found directly');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done!');

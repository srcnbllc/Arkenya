const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, 'www/index.html'), 'utf8');
const lines = content.split('\n');

function find(pattern) {
    console.log('=== SEARCH: ' + pattern + ' ===');
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(pattern)) {
            console.log((i + 1) + ': ' + lines[i].trim());
        }
    }
}

find('id="modal-victory"');
find('id="modal-defeat"');
find('function levelVictory');
find('function levelDefeat');
find('claimLeague');
find('OLYMPUS_LEAGUES');
find('renderLeague');

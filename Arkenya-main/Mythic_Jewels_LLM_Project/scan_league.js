const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, 'www/index.html'), 'utf8');
const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('screen-league') || lines[i].includes('initLeague') || lines[i].includes('OLYMPUS_LEAGUES')) {
        console.log((i + 1) + ': ' + lines[i]);
    }
}

const fs = require('fs');
const backup = fs.readFileSync('Arkenya_Playable_Demo.html', 'utf8');

const idx = backup.indexOf('id="modal-story-scroll"');
console.log('idx:', idx);
if (idx !== -1) {
    console.log(backup.substring(idx - 150, idx + 1000));
}

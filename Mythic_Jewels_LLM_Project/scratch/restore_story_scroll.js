const fs = require('fs');

const backup = fs.readFileSync('Arkenya_Playable_Demo.html', 'utf8');
let current = fs.readFileSync('www/index.html', 'utf8');

const sStart = backup.indexOf('<!-- MODAL: MYTHIC STORY SCROLL');
const sEnd = backup.indexOf('<!-- MODAL: PROLOGUE', sStart);

if (sStart !== -1 && sEnd !== -1) {
    const storyScrollBlock = backup.substring(sStart, sEnd);
    console.log('Extracted story scroll block length:', storyScrollBlock.length);

    // Insert it right before <!-- MODAL: LEVEL PREVIEW
    const insertIdx = current.indexOf('<!-- MODAL: LEVEL PREVIEW');
    current = current.substring(0, insertIdx) + storyScrollBlock + '\n            ' + current.substring(insertIdx);

    fs.writeFileSync('www/index.html', current, 'utf8');
    console.log('PASS: Re-inserted modal-story-scroll into www/index.html!');
} else {
    console.log('ERROR: Could not find story scroll block in backup!');
}

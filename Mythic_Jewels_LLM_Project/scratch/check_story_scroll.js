const fs = require('fs');
const html = fs.readFileSync('www/index.html', 'utf8');
console.log('Includes modal-story-scroll:', html.includes('id="modal-story-scroll"'));
console.log('Includes story-scroll-icon:', html.includes('id="story-scroll-icon"'));

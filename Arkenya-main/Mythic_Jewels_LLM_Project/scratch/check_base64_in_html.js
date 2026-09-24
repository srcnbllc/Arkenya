const fs = require('fs');
const html = fs.readFileSync('www/index.html', 'utf8');

console.log('Script tag narrator_audio_data:', html.includes('narrator_audio_data.js'));

const base64Idx = html.indexOf('window.NARRATOR_AUDIO_BASE64');
console.log('Inlined NARRATOR_AUDIO_BASE64 index:', base64Idx);

if (base64Idx !== -1) {
    const end = html.indexOf('};', base64Idx);
    const sub = html.substring(base64Idx, Math.min(base64Idx + 500, end));
    console.log('Inlined snippet:', sub);
}

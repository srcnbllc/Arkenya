const fs = require('fs');
const pack = fs.readFileSync('www/assets/audio/narrator_audio_data.js', 'utf8');

const keys = [];
const regex = /['"]([a-zA-Z0-9_\-]+)['"]\s*:\s*['"]data:audio/g;
let m;
while ((m = regex.exec(pack)) !== null) {
    keys.push(m[1]);
}
console.log('Total keys in narrator_audio_data.js:', keys.length);
console.log('Keys:', keys);

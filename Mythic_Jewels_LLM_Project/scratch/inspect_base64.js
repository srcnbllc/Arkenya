const fs = require('fs');
const html = fs.readFileSync('www/index.html', 'utf8');

global.window = {};

const start = html.indexOf('window.NARRATOR_AUDIO_BASE64 = {');
const end = html.indexOf('};', start);
const code = html.substring(start, end + 2);
eval(code);

console.log('window.NARRATOR_AUDIO_BASE64 keys and lengths:');
for (const k of Object.keys(window.NARRATOR_AUDIO_BASE64)) {
    const val = window.NARRATOR_AUDIO_BASE64[k];
    console.log(`Key: ${k}, Length: ${val.length}, startsWith: ${val.substring(0, 30)}...`);
}

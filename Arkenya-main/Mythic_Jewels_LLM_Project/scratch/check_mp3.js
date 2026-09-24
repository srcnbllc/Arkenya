const fs = require('fs');
const html = fs.readFileSync('www/index.html', 'utf8');

global.window = {};
const start = html.indexOf('window.NARRATOR_AUDIO_BASE64 = {');
const end = html.indexOf('};', start);
const code = html.substring(start, end + 2);
eval(code);

for (const k of Object.keys(window.NARRATOR_AUDIO_BASE64)) {
    const val = window.NARRATOR_AUDIO_BASE64[k];
    const b64 = val.replace(/^data:audio\/(mp3|mpeg);base64,/, '');
    const buf = Buffer.from(b64, 'base64');
    // Check first 10 bytes
    const hex = buf.subarray(0, 10).toString('hex');
    console.log(`Key: ${k}, Byte length: ${buf.length}, Hex start: ${hex}`);
}

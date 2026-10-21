const fs = require('fs');

const code = fs.readFileSync('www/assets/audio/narrator_audio_data.js', 'utf8');

const m = code.match(/['"]prologue['"]\s*:\s*['"]data:audio\/([^;]+);base64,([^'"]+)['"]/);
if (m) {
    const mime = m[1];
    const b64 = m[2];
    const buf = Buffer.from(b64, 'base64');
    console.log('Prologue audio found!');
    console.log('MIME:', mime);
    console.log('Base64 length:', b64.length);
    console.log('Byte size:', buf.length, 'bytes');
    fs.writeFileSync('tools/prologue_sample.mp3', buf);
    console.log('Saved to tools/prologue_sample.mp3');
} else {
    console.log('Prologue audio NOT found in pack!');
}

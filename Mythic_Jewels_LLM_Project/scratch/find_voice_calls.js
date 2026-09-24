const fs = require('fs');
const html = fs.readFileSync('www/index.html', 'utf8');
const lines = html.split('\n');

const keywords = ['playStoryVoice', 'playPrologueVoice', 'togglePreviewStoryAudio', 'playEpicCallout', 'previewStoryAudio', 'currentNarratorAudioInstance'];

keywords.forEach(kw => {
    console.log(`\n=== Keyword: ${kw} ===`);
    lines.forEach((l, idx) => {
        if (l.includes(kw)) {
            console.log(`L${idx+1}: ${l.trim().slice(0, 110)}`);
        }
    });
});

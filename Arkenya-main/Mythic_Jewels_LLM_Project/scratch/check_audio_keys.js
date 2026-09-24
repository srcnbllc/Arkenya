const fs = require('fs');
const html = fs.readFileSync('www/index.html', 'utf8');

const match = html.match(/window\.NARRATOR_AUDIO_BASE64\s*=\s*\{([\s\S]*?)\n\s*\};/);
if (match) {
    const lines = match[1].split('\n');
    const keys = [];
    lines.forEach(l => {
        const m = l.match(/"([^"]+)":\s*"data:audio/);
        if (m) keys.push(m[1]);
    });
    console.log('Keys in index.html NARRATOR_AUDIO_BASE64:', keys);
} else {
    console.log('NARRATOR_AUDIO_BASE64 not matched');
}

// Check narrator_audio_data.js
if (fs.existsSync('www/assets/audio/narrator_audio_data.js')) {
    const ext = fs.readFileSync('www/assets/audio/narrator_audio_data.js', 'utf8');
    const extMatch = ext.match(/window\.NARRATOR_AUDIO_BASE64\s*=\s*\{([\s\S]*?)\n\s*\};/);
    if (extMatch) {
        const lines = extMatch[1].split('\n');
        const extKeys = [];
        lines.forEach(l => {
            const m = l.match(/"([^"]+)":\s*"data:audio/);
            if (m) extKeys.push(m[1]);
        });
        console.log('Keys in narrator_audio_data.js:', extKeys);
    }
}

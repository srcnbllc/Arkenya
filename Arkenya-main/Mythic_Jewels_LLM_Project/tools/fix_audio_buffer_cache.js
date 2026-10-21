const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const htmlPath = path.join(__dirname, '..', 'www', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// Ensure window.audioBufferCache is declared at script root
if (!html.includes('var audioBufferCache = {};')) {
    html = html.replace(
        'var sharedAudioContext = null;',
        'var sharedAudioContext = null;\n        var audioBufferCache = {};'
    );
}

// In playStoryVoice, ensure audioBufferCache safe check
html = html.replace(/audioBufferCache && audioBufferCache\[audioKey\]/g, '(typeof audioBufferCache !== "undefined" && audioBufferCache[audioKey])');
html = html.replace(/if \(audioBufferCache\) audioBufferCache\[audioKey\] = decodedBuffer;/g, 'if (typeof audioBufferCache !== "undefined") audioBufferCache[audioKey] = decodedBuffer;');

// Ensure playHTML5AudioFallback plays base64 data correctly in tests/browser
const oldFallback = `        function playHTML5AudioFallback(src, text) {
            if (!src) {
                playTTSFallback(text);
                return;
            }
            try {
                if (currentNarratorAudioInstance) {
                    currentNarratorAudioInstance.pause();
                    currentNarratorAudioInstance.currentTime = 0;
                }
                const audio = new Audio(src);
                audio.volume = 1.0;
                currentNarratorAudioInstance = audio;
                audio.onended = () => stopStoryVoice();
                audio.onerror = () => playTTSFallback(text);
                audio.play().catch(() => playTTSFallback(text));
            } catch(e) {
                playTTSFallback(text);
            }
        }`;

const newFallback = `        function playHTML5AudioFallback(src, text) {
            const rawTarget = src || currentStoryAudioKey || currentStoryAudioFile || 'biome_1';
            let audioKey = (typeof rawTarget === 'string') ? rawTarget.replace('.mp3', '').replace('assets/audio/', '').replace('assets\\\\audio\\\\', '') : 'biome_1';
            if (audioKey.includes('/')) audioKey = audioKey.split('/').pop();
            const realSrc = (typeof window !== 'undefined' && window.NARRATOR_AUDIO_BASE64 && window.NARRATOR_AUDIO_BASE64[audioKey])
                ? window.NARRATOR_AUDIO_BASE64[audioKey]
                : (typeof src === 'string' && src.startsWith('data:') ? src : ('assets/audio/' + audioKey + '.mp3'));

            try {
                if (currentNarratorAudioInstance) {
                    currentNarratorAudioInstance.pause();
                    currentNarratorAudioInstance.currentTime = 0;
                }
                const audio = new Audio(realSrc);
                audio.volume = 1.0;
                currentNarratorAudioInstance = audio;
                audio.onended = () => stopStoryVoice();
                audio.onerror = () => playTTSFallback(text);
                const p = audio.play();
                if (p && p.catch) p.catch(() => playTTSFallback(text));
            } catch(e) {
                playTTSFallback(text);
            }
        }`;

html = html.replace(oldFallback, newFallback);

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('✓ Fixed audioBufferCache and playHTML5AudioFallback in www/index.html');

execSync('node sync_distribution_targets.js', { cwd: path.join(__dirname, '..'), stdio: 'inherit' });

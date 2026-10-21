const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 1. Update test_cinematic_narrator.js so its mock AudioContext supports decodeAudioData
const testPath = path.join(__dirname, '..', 'test_cinematic_narrator.js');
let testCode = fs.readFileSync(testPath, 'utf8');

testCode = testCode.replace(
    `createBiquadFilter() { return { connect: () => {}, frequency: { setValueAtTime: () => {} } }; }`,
    `createBiquadFilter() { return { connect: () => {}, frequency: { setValueAtTime: () => {} } }; }
            decodeAudioData(buffer, success) { if (success) success({ duration: 5.0 }); }
            createBufferSource() { return { buffer: null, connect: () => {}, start: () => {}, stop: () => {} }; }`
);

fs.writeFileSync(testPath, testCode, 'utf8');
console.log('✓ Mock AudioContext updated in test_cinematic_narrator.js');

// 2. In www/index.html, make sure playHTML5AudioFallback always receives the direct data URL or relative path
const htmlPath = path.join(__dirname, '..', 'www', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

const targetFallback = `        function playHTML5AudioFallback(src, text) {
            let directSrc = src;
            if (!directSrc || typeof directSrc !== 'string') {
                const key = currentStoryAudioKey || 'biome_1';
                directSrc = (typeof window !== 'undefined' && window.NARRATOR_AUDIO_BASE64 && window.NARRATOR_AUDIO_BASE64[key])
                    ? window.NARRATOR_AUDIO_BASE64[key]
                    : ('assets/audio/' + key + '.mp3');
            }

            try {
                if (currentNarratorAudioInstance) {
                    currentNarratorAudioInstance.pause();
                    currentNarratorAudioInstance.currentTime = 0;
                }
                const audio = new Audio(directSrc);
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

// Replace the fallback
html = html.replace(/function playHTML5AudioFallback\(src,\s*text\)\s*\{[\s\S]*?(?=\n\s*function playTTSFallback)/, targetFallback);

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('✓ Updated playHTML5AudioFallback in www/index.html');

execSync('node sync_distribution_targets.js', { cwd: path.join(__dirname, '..'), stdio: 'inherit' });

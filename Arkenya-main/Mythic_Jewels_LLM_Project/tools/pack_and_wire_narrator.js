const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('=== PACKING STORYTEL-STYLE NARRATION AUDIO & HOOKING WEB AUDIO API ===\n');

const projectRoot = path.join(__dirname, '..');
const audioDir = path.join(projectRoot, 'www', 'assets', 'audio');

// 1. Copy generated mp3s to distribution folders
const distributionDirs = [
    path.join(projectRoot, 'assets', 'audio'),
    path.join(projectRoot, 'android', 'app', 'src', 'main', 'assets', 'public', 'assets', 'audio'),
    path.join(projectRoot, 'ios', 'App', 'App', 'public', 'assets', 'audio')
];

const narrationKeys = ['prologue', 'biome_1', 'biome_2', 'biome_3', 'biome_4', 'biome_5'];

narrationKeys.forEach(k => {
    const srcFile = path.join(audioDir, k + '.mp3');
    if (fs.existsSync(srcFile)) {
        const data = fs.readFileSync(srcFile);
        distributionDirs.forEach(d => {
            fs.mkdirSync(d, { recursive: true });
            fs.writeFileSync(path.join(d, k + '.mp3'), data);
        });
        console.log(`✓ Synchronized ${k}.mp3 to all distribution folders (${data.length} bytes).`);
    } else {
        console.error(`! Missing audio file: ${srcFile}`);
    }
});

// 2. Recompile narrator_audio_data.js with all 29 keys
console.log('\n--- Recompiling narrator_audio_data.js ---');
const allAudioKeys = [
    "prologue", "biome_1", "biome_2", "biome_3", "biome_4", "biome_5",
    "hero_arkenya_ability", "hero_arkenya_victory", "hero_arkenya_greeting",
    "hero_asterion_ability", "hero_asterion_victory", "hero_asterion_greeting",
    "hero_nyra_ability", "hero_nyra_victory", "hero_nyra_greeting",
    "hero_thalor_ability", "hero_thalor_victory", "hero_thalor_greeting",
    "hero_athena_ability", "hero_athena_victory", "hero_athena_greeting",
    "hero_zeus_ability", "hero_zeus_victory", "hero_zeus_greeting",
    "callout_combo_2", "callout_combo_3", "callout_combo_4", "callout_clutch", "callout_victory"
];

const packData = {};
allAudioKeys.forEach(k => {
    const mp3Path = path.join(audioDir, k + '.mp3');
    if (fs.existsSync(mp3Path)) {
        const b64 = fs.readFileSync(mp3Path).toString('base64');
        packData[k] = `data:audio/mpeg;base64,${b64}`;
        console.log(`Packed: ${k} (${fs.statSync(mp3Path).size} bytes)`);
    } else {
        console.warn(`WARNING: Missing audio file for key: ${k}`);
    }
});

const packJsContent = `window.NARRATOR_AUDIO_BASE64 = ${JSON.stringify(packData)};\n`;
const packTargets = [
    path.join(audioDir, 'narrator_audio_data.js'),
    path.join(projectRoot, 'android', 'app', 'src', 'main', 'assets', 'public', 'assets', 'audio', 'narrator_audio_data.js'),
    path.join(projectRoot, 'ios', 'App', 'App', 'public', 'assets', 'audio', 'narrator_audio_data.js')
];

packTargets.forEach(pt => {
    fs.mkdirSync(path.dirname(pt), { recursive: true });
    fs.writeFileSync(pt, packJsContent, 'utf8');
    console.log(`✓ Saved ${pt} (${packJsContent.length} chars)`);
});

// 3. Update playStoryVoice in www/index.html to use pure Web Audio API decodeAudioData
console.log('\n--- Wiring playStoryVoice to Web Audio API Engine in www/index.html ---');
const htmlPath = path.join(projectRoot, 'www', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// Lower background drone gain to 0.02 so voice shines crystal clear like Storytel
html = html.replace('droneGain.gain.setValueAtTime(0.08, now);', 'droneGain.gain.setValueAtTime(0.015, now);');
html = html.replace('gongGain.gain.setValueAtTime(0.15, now);', 'gongGain.gain.setValueAtTime(0.04, now);');

// Replace playStoryVoice with high-fidelity Web Audio API buffer engine
const oldPlayStoryVoiceRegex = /function playStoryVoice\(text,\s*audioPathOrKey\)\s*\{[\s\S]*?(?=function playTTSFallback)/;

const newPlayStoryVoice = `function playStoryVoice(text, audioPathOrKey) {
            currentStoryTextToSpeak = text;
            startMysticalSoundscape();
            isStoryNarratorSpeaking = true;
            updateNarratorButtonUI(true);

            // Highlight story parchment
            const parchment = document.getElementById('story-scroll-text');
            if (parchment) parchment.style.borderLeft = "3px solid #00d2ff";

            const rawTarget = audioPathOrKey || currentStoryAudioKey || currentStoryAudioFile || 'biome_1';
            let audioKey = rawTarget.replace('.mp3', '').replace('assets/audio/', '').replace('assets\\\\audio\\\\', '');
            if (audioKey.includes('/')) audioKey = audioKey.split('/').pop();

            // Strategy 0: High-Fidelity Web Audio API Buffer Engine (0ms latency, Storytel clarity)
            const audioData = (typeof window !== 'undefined' && window.NARRATOR_AUDIO_BASE64 && window.NARRATOR_AUDIO_BASE64[audioKey]) 
                ? window.NARRATOR_AUDIO_BASE64[audioKey] : null;

            if (audioData) {
                try {
                    const ctx = getAudioContext();
                    if (ctx) {
                        if (ctx.state === 'suspended') {
                            ctx.resume().catch(() => {});
                        }

                        const playBuffer = (buffer) => {
                            if (currentNarratorAudioSource) {
                                try { currentNarratorAudioSource.stop(); } catch(e) {}
                                currentNarratorAudioSource = null;
                            }
                            const source = ctx.createBufferSource();
                            source.buffer = buffer;
                            const gainNode = ctx.createGain();
                            gainNode.gain.setValueAtTime(1.0, ctx.currentTime);
                            source.connect(gainNode);
                            gainNode.connect(ctx.destination);

                            source.onended = () => {
                                console.log("Kadim Bilge narration ended:", audioKey);
                                stopStoryVoice();
                            };

                            source.start(0);
                            currentNarratorAudioSource = source;
                            console.log("⚡ Playing in-memory Storytel narration via Web Audio API:", audioKey);
                        };

                        if (audioBufferCache && audioBufferCache[audioKey]) {
                            playBuffer(audioBufferCache[audioKey]);
                            return;
                        }

                        // Convert base64 data-url to ArrayBuffer for Web Audio decoding
                        const base64Clean = audioData.split(',')[1] || audioData;
                        const binaryStr = window.atob(base64Clean);
                        const len = binaryStr.length;
                        const bytes = new Uint8Array(len);
                        for (let i = 0; i < len; i++) {
                            bytes[i] = binaryStr.charCodeAt(i);
                        }

                        ctx.decodeAudioData(bytes.buffer, (decodedBuffer) => {
                            if (audioBufferCache) audioBufferCache[audioKey] = decodedBuffer;
                            playBuffer(decodedBuffer);
                        }, (decodeErr) => {
                            console.warn("Decode audio error, falling back to HTML5 Audio:", decodeErr);
                            playHTML5AudioFallback(audioData, text);
                        });
                        return;
                    }
                } catch(webAudioErr) {
                    console.warn("Web Audio failed, using HTML5 fallback:", webAudioErr);
                }
            }

            // Strategy 1: HTML5 Audio fallback
            playHTML5AudioFallback(audioData || audioPathOrKey, text);
        }

        var currentNarratorAudioSource = null;

        function playHTML5AudioFallback(src, text) {
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
        }
`;

html = html.replace(oldPlayStoryVoiceRegex, newPlayStoryVoice);

// In stopStoryVoice, stop Web Audio source as well
html = html.replace(
    'function stopStoryVoice() {',
    `function stopStoryVoice() {
            if (currentNarratorAudioSource) {
                try { currentNarratorAudioSource.stop(); } catch(e) {}
                currentNarratorAudioSource = null;
            }`
);

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('✓ www/index.html updated with Web Audio Storytel engine.');

// Sync all platforms
const syncOutput = execSync('node sync_distribution_targets.js', { cwd: projectRoot, encoding: 'utf8' });
console.log(syncOutput);

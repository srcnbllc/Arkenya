const fs = require('fs');

console.log("=== WIRING BASE64 IN-MEMORY AUDIO PACK INTO ALL TARGETS ===");

let html = fs.readFileSync('www/index.html', 'utf8');

// 1. Add script tag for narrator_audio_data.js in head
if (!html.includes('narrator_audio_data.js')) {
    html = html.replace('</head>', '    <script src="assets/audio/narrator_audio_data.js"></script>\n</head>');
    console.log("-> Added <script src='assets/audio/narrator_audio_data.js'> to <head>.");
}

// 2. Enhance playStoryVoice to prioritize Base64 Data URI from window.NARRATOR_AUDIO_BASE64
const oldPlayStoryVoiceRegex = /function playStoryVoice\(text, audioPath\) \{[\s\S]*?const fileToPlay = audioPath \|\| currentStoryAudioFile;[\s\S]*?\/\/ Strategy 1: Real Studio Audio File/;

const newPlayStoryVoiceStart = `function playStoryVoice(text, audioPathOrKey) {
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
            
            let audioSrcToPlay = null;
            // Strategy 0: High-Fidelity In-Memory Base64 (100% immune to file:// CORS & WebView restrictions)
            if (typeof window !== 'undefined' && window.NARRATOR_AUDIO_BASE64 && window.NARRATOR_AUDIO_BASE64[audioKey]) {
                audioSrcToPlay = window.NARRATOR_AUDIO_BASE64[audioKey];
                console.log("⚡ Playing in-memory studio Tuncel Kurtiz narration:", audioKey);
            } else {
                audioSrcToPlay = rawTarget.endsWith('.mp3') ? rawTarget : ('assets/audio/' + rawTarget + '.mp3');
                console.log("📁 Falling back to relative audio file:", audioSrcToPlay);
            }

            const fileToPlay = audioSrcToPlay;

            // Strategy 1: Real Studio Audio File`;

html = html.replace(oldPlayStoryVoiceRegex, newPlayStoryVoiceStart);

// 3. Fix playPrologueVoice to ensure currentStoryTextToSpeak and audioKey are set
const oldPrologueVoiceFunc = `        function playPrologueVoice() {
            const prologueText = "Dinle evlat... Dünya değişti. Kadim Olimpos'un kutsal kristalleri çalındığında, dağlar inledi, denizler taştı. Karanlığın efendisi Hades güldü sandılar... Ama bilmedikleri bir şey vardı: Kader dediğin şey, önüne serilen taşlar değildir yeğen... Kader, o taşlara vurduğun ilahi akıldır, yürektir! Şimdi kalkanını kuşan Asterion... Bu vadi, ışığı bekler!";
            toggleStoryVoice('assets/audio/prologue.mp3');
        }`;

const newPrologueVoiceFunc = `        function playPrologueVoice() {
            const prologueText = "Dinle evlat... Dünya değişti. Kadim Olimpos'un kutsal kristalleri çalındığında, dağlar inledi, denizler taştı. Karanlığın efendisi Hades güldü sandılar... Ama bilmedikleri bir şey vardı: Kader dediğin şey, önüne serilen taşlar değildir yeğen... Kader, o taşlara vurduğun ilahi akıldır, yürektir! Şimdi kalkanını kuşan Asterion... Bu vadi, ışığı bekler!";
            currentStoryTextToSpeak = prologueText;
            currentStoryAudioKey = 'prologue';
            currentStoryAudioFile = 'assets/audio/prologue.mp3';
            if (isStoryNarratorSpeaking) {
                stopStoryVoice();
            } else {
                playStoryVoice(prologueText, 'prologue');
            }
        }`;

if (html.includes('function playPrologueVoice() {')) {
    html = html.replace(oldPrologueVoiceFunc, newPrologueVoiceFunc);
    console.log("-> Updated playPrologueVoice to support in-memory key 'prologue'.");
}

// 4. Update openStoryScrollModal to set currentStoryAudioKey
html = html.replace(
    /currentStoryAudioFile = lore\.audioFile \|\| \('assets\/audio\/biome_' \+ \(getZoneForLevel\(levelNum\)\) \+ '\.mp3'\);/,
    "const z = getZoneForLevel(levelNum);\n            currentStoryAudioKey = 'biome_' + z;\n            currentStoryAudioFile = lore.audioFile || ('assets/audio/biome_' + z + '.mp3');"
);

// 5. Save all files
fs.writeFileSync('www/index.html', html, 'utf8');
console.log("-> Saved www/index.html");

const targets = [
    'index.html',
    'Arkenya_Playable_Demo.html',
    'android/app/src/main/assets/public/index.html'
];

targets.forEach(t => {
    fs.writeFileSync(t, html, 'utf8');
    console.log(`-> Synchronized: ${t}`);
});

console.log("=== ALL IN-MEMORY BASE64 NARRATOR HOOKS COMPLETE ===");

const fs = require('fs');
const { JSDOM } = require('jsdom');
const crypto = require('crypto');

console.log("=== COMPREHENSIVE CINEMATIC NARRATOR TEST SUITE ===");

const htmlContent = fs.readFileSync('www/index.html', 'utf8');

let mockAudioInstances = [];

const dom = new JSDOM(htmlContent, {
    url: "http://localhost",
    runScripts: "dangerously",
    beforeParse(window) {
        window.AudioContext = class {
            constructor() { this.state = 'running'; this.currentTime = 0; this.destination = {}; }
            createOscillator() { 
                return { 
                    connect: () => {}, 
                    frequency: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} }, 
                    start: () => {}, 
                    stop: () => {} 
                }; 
            }
            createGain() { 
                return { 
                    connect: () => {}, 
                    gain: { value: 0.1, setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} } 
                }; 
            }
            createBiquadFilter() { return { connect: () => {}, frequency: { setValueAtTime: () => {} } }; }
            resume() { return Promise.resolve(); }
        };
        window.webkitAudioContext = window.AudioContext;
        window.fetch = () => Promise.resolve({ ok: true, json: () => Promise.resolve([]) });

        // Mock HTML5 Audio
        window.Audio = class {
            constructor(src) {
                this.src = src;
                this.volume = 1.0;
                this.paused = true;
                this.currentTime = 0;
                mockAudioInstances.push(this);
            }
            play() {
                this.paused = false;
                return Promise.resolve();
            }
            pause() {
                this.paused = true;
            }
        };
    }
});

const { window } = dom;
const { document } = window;
const narratorJs = fs.readFileSync('www/assets/audio/narrator_audio_data.js', 'utf8');
window.eval(narratorJs);
const run = (code) => window.eval(code);

let total = 0;
let passed = 0;

function assert(cond, msg) {
    total++;
    if (cond) {
        passed++;
        console.log(`  [PASS] ${msg}`);
    } else {
        console.error(`  [FAIL] ${msg}`);
        process.exitCode = 1;
    }
}

// TEST 1: Physical File Verification
console.log("\n--- TEST 1: Audio Files on Disk ---");
const files = [
    'prologue.mp3',
    'biome_1.mp3',
    'biome_2.mp3',
    'biome_3.mp3',
    'biome_4.mp3',
    'biome_5.mp3'
];

const paths = [
    'www/assets/audio',
    'assets/audio',
    'android/app/src/main/assets/public/assets/audio'
];

paths.forEach(dir => {
    files.forEach(f => {
        const full = `${dir}/${f}`;
        const exists = fs.existsSync(full);
        const size = exists ? fs.statSync(full).size : 0;
        assert(exists && size > 50000, `${full} exists with valid size (${Math.round(size/1024)} KB)`);
    });
});

// TEST 2: BIOME_LORE Definition & Story Text
console.log("\n--- TEST 2: BIOME_LORE & Kadim Bilge / LOTR Lore ---");
const lore1 = run("BIOME_LORE[1]");
assert(lore1 && lore1.storyText.includes("Gözlerini aç evlat"), "Bölge 1 contains Kadim Bilge voice opening");
assert(lore1.audioFile === "assets/audio/biome_1.mp3", "Bölge 1 points to biome_1.mp3");

const lore5 = run("BIOME_LORE[5]");
assert(lore5 && lore5.storyText.includes("İşte geldik yolun sonuna yeğen"), "Bölge 5 contains epic climax lore");
assert(lore5.audioFile === "assets/audio/biome_5.mp3", "Bölge 5 points to biome_5.mp3");

// TEST 3: openStoryScrollModal & UI State
console.log("\n--- TEST 3: Story Scroll Modal Opening ---");
run("openStoryScrollModal(BIOME_LORE[1], 1)");
assert(run("currentStoryAudioFile") === "assets/audio/biome_1.mp3", "currentStoryAudioFile set to biome_1.mp3");
assert(document.getElementById('modal-story-scroll').classList.contains('active'), "modal-story-scroll is active");
const scrollText = document.getElementById('story-scroll-text');
assert(scrollText.innerText.includes("Gözlerini aç evlat"), "Modal displays epic Turkish story text");

// TEST 4: Studio Voice Audio Playback
console.log("\n--- TEST 4: Studio Voice Audio Playback ---");
mockAudioInstances = [];
run("toggleStoryVoice(); void 0;");
assert(run("isStoryNarratorSpeaking") === true, "isStoryNarratorSpeaking set to true");
const toggleBtn = document.getElementById('btn-narrator-toggle');
assert(toggleBtn && toggleBtn.innerHTML.includes("ANLATIMI DURDUR"), "Button toggled to 'ANLATIMI DURDUR'");
assert(mockAudioInstances.length > 0, "HTML5 Audio instance created");
assert(mockAudioInstances[0].src.startsWith("data:audio/mp3;base64,") || mockAudioInstances[0].src.includes("biome_1.mp3"), "Audio source is in-memory base64 or file path");
assert(mockAudioInstances[0].paused === false, "Audio is playing");

// TEST 5: stopStoryVoice & confirmStoryAndStart
console.log("\n--- TEST 5: Stopping Audio & Starting Gameplay ---");
run("confirmStoryAndStart(); void 0;");
assert(run("isStoryNarratorSpeaking") === false, "Narrator speaking stopped");
assert(mockAudioInstances[0].paused === true, "Audio playback paused");
assert(!document.getElementById('modal-story-scroll').classList.contains('active'), "modal-story-scroll closed");

// TEST 6: Prologue Voice Playback
console.log("\n--- TEST 6: Prologue Voice Playback ---");
mockAudioInstances = [];
run("playPrologueVoice(); void 0;");
assert(run("isStoryNarratorSpeaking") === true, "Prologue voice is active");
assert(mockAudioInstances.length > 0 && (mockAudioInstances[0].src.startsWith("data:audio/mp3;base64,") || mockAudioInstances[0].src.includes("prologue.mp3")), "Prologue audio playing in-memory");
run("stopStoryVoice(); void 0;");
assert(run("isStoryNarratorSpeaking") === false, "Prologue voice stopped");

// TEST 7: File Hash Synchronization
console.log("\n--- TEST 7: Multi-File Synchronization ---");
const h1 = crypto.createHash('sha256').update(fs.readFileSync('www/index.html')).digest('hex');
const h2 = crypto.createHash('sha256').update(fs.readFileSync('index.html')).digest('hex');
const h3 = crypto.createHash('sha256').update(fs.readFileSync('Arkenya_Playable_Demo.html')).digest('hex');
const h4 = crypto.createHash('sha256').update(fs.readFileSync('android/app/src/main/assets/public/index.html')).digest('hex');

assert(h1 === h2, "www/index.html matches index.html");
assert(h1 === h3, "www/index.html matches Arkenya_Playable_Demo.html");
assert(h1 === h4, "www/index.html matches android assets");

console.log(`\n=============================================================`);
console.log(`TEST SUMMARY: ${passed} / ${total} assertions PASSED.`);
console.log(`=============================================================`);

if (passed === total) {
    console.log(">>> ALL CINEMATIC NARRATOR TESTS PASSED! <<<");
} else {
    process.exit(1);
}

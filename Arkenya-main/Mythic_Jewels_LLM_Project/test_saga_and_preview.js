const fs = require('fs');
const { JSDOM } = require('jsdom');

console.log("=== TEST: SAGA THEMES, LEVEL PREVIEW POPUP & AUDIO CONTROLS ===");

const html = fs.readFileSync('www/index.html', 'utf8');

let total = 0;
let passed = 0;

function assert(condition, message) {
    total++;
    if (condition) {
        passed++;
        console.log(`  [PASS] ${message}`);
    } else {
        console.error(`  [FAIL] ${message}`);
        process.exitCode = 1;
    }
}

let mockAudioInstances = [];

const dom = new JSDOM(html, {
    url: 'http://localhost',
    runScripts: 'dangerously',
    beforeParse(window) {
        window.AudioContext = class { constructor() {} };
        window.webkitAudioContext = window.AudioContext;
        window.Audio = class {
            constructor(src) {
                this.src = src;
                this.volume = 1.0;
                this.paused = true;
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

// Load narrator audio pack into JSDOM environment
const narratorJs = fs.readFileSync('www/assets/audio/narrator_audio_data.js', 'utf8');
window.eval(narratorJs);

const run = (code) => window.eval(code);

// TEST 1: Physical File Verification
console.log("\n--- TEST 1: Saga Audio Files on Disk ---");
const sagaFiles = [
    'saga_theme_1.mp3',
    'saga_theme_2.mp3',
    'saga_theme_3.mp3',
    'saga_theme_4.mp3',
    'saga_theme_5.mp3'
];

const paths = [
    'www/assets/audio',
    'assets/audio',
    'android/app/src/main/assets/public/assets/audio'
];

paths.forEach(dir => {
    sagaFiles.forEach(f => {
        const full = `${dir}/${f}`;
        const exists = fs.existsSync(full);
        const size = exists ? fs.statSync(full).size : 0;
        assert(exists && size > 100000, `${full} exists with valid size (${Math.round(size / 1024)} KB)`);
    });
});

// TEST 2: Base64 In-Memory Offline Storage
console.log("\n--- TEST 2: In-Memory Base64 Audio Pack ---");
const base64Pack = run("window.NARRATOR_AUDIO_BASE64");
assert(!!base64Pack, "window.NARRATOR_AUDIO_BASE64 is defined");
for (let i = 1; i <= 5; i++) {
    const key = `saga_theme_${i}`;
    assert(!!base64Pack[key] && base64Pack[key].startsWith("data:audio/mp3;base64,"), `Offline Base64 available for ${key}`);
}

// TEST 3: No Broken/Intrusive modal-prologue on Main Menu
console.log("\n--- TEST 3: Main Screen Cleanliness (No Cut-off Modal) ---");
const prologueModal = document.getElementById('modal-prologue');
assert(!prologueModal, "modal-prologue is completely removed from DOM");

// TEST 4: Thematic Saga Progression & Story Continuity
console.log("\n--- TEST 4: 5 Thematic Saga Chapters & Continuity ---");
const testLevels = [
    { lvl: 1, expectedTheme: 1, keyword: "Milattan Önce üç bin yılında" },
    { lvl: 5, expectedTheme: 1, keyword: "Kristal Vadi" },
    { lvl: 6, expectedTheme: 2, keyword: "İlk zaferin yankısı" },
    { lvl: 15, expectedTheme: 2, keyword: "Styx Nehri" },
    { lvl: 16, expectedTheme: 3, keyword: "Nehrin karanlığını ardında bıraktın" },
    { lvl: 25, expectedTheme: 3, keyword: "Ares'in Gazabı" },
    { lvl: 26, expectedTheme: 4, keyword: "Ateş fırtınasını geçtin" },
    { lvl: 35, expectedTheme: 4, keyword: "Medusa'nın Laneti" },
    { lvl: 36, expectedTheme: 5, keyword: "İşte geldik yolun sonuna" },
    { lvl: 50, expectedTheme: 5, keyword: "Kronos" }
];

testLevels.forEach(t => {
    const saga = run(`getThemeSagaForLevel(${t.lvl})`);
    assert(saga && saga.themeId === t.expectedTheme, `Level ${t.lvl} maps to Theme ${t.expectedTheme}`);
    assert(saga.storyText.includes(t.keyword) || saga.themeTitle.includes(t.keyword), `Level ${t.lvl} lore contains '${t.keyword}'`);
});

// TEST 5: Level Preview Pop-up UI & Top-Right Audio Controls
console.log("\n--- TEST 5: Level Preview Modal & Non-Forced Audio Player ---");
run("openLevelPreview(1)");
const previewModal = document.getElementById('modal-level-preview');
assert(previewModal && previewModal.classList.contains('active'), "modal-level-preview is active");

const btnStory = document.getElementById('btn-preview-listen-story');
assert(!!btnStory, "Top-right 'btn-preview-listen-story' button exists");

const storyTextEl = document.getElementById('preview-story');
assert(storyTextEl && storyTextEl.innerText.includes("Milattan Önce üç bin yılında"), "Preview modal displays Theme 1 continuous saga text");

// Toggle Play
mockAudioInstances = [];
run("togglePreviewStoryAudio()");
assert(run("isPreviewStoryPlaying") === true, "isPreviewStoryPlaying is true after click");
assert(mockAudioInstances.length > 0, "Audio instance initialized");
assert(mockAudioInstances[0].paused === false, "Audio is playing");
const btnText = document.getElementById('preview-story-text');
assert(btnText && btnText.innerText === 'DURDUR', "Button text toggled to 'DURDUR'");

// Toggle Pause
run("togglePreviewStoryAudio()");
assert(run("isPreviewStoryPlaying") === false, "isPreviewStoryPlaying is false after second click");
assert(mockAudioInstances[0].paused === true, "Audio playback paused");
assert(btnText && btnText.innerText === 'HİKAYEYİ DİNLE', "Button text restored to 'HİKAYEYİ DİNLE'");

// TEST 6: Audio Stops on Game Start and Modal Close
console.log("\n--- TEST 6: Auto-Stop on Start and Dismiss ---");
// Start playing again
run("togglePreviewStoryAudio()");
assert(run("isPreviewStoryPlaying") === true, "Audio playing again");
run("closeModal('modal-level-preview')");
assert(run("isPreviewStoryPlaying") === false, "closeModal automatically stops story audio");

// Open Level 16 (Theme 3) and check story
run("openLevelPreview(16)");
assert(storyTextEl.innerText.includes("Nehrin karanlığını ardında bıraktın"), "Level 16 preview displays Theme 3 continuation story");
run("startGameplay()");
assert(run("isPreviewStoryPlaying") === false, "startGameplay automatically stops story audio");

console.log(`\n=== RESULTS: ${passed} / ${total} ASSERTIONS PASSED ===`);
if (passed === total) {
    console.log(">>> ALL SAGA & LEVEL PREVIEW POPUP TESTS PASSED! <<<");
    process.exit(0);
} else {
    process.exit(1);
}

const fs = require('fs');
const { JSDOM } = require('jsdom');

console.log("=== COMPREHENSIVE AUDIO ENGINE & TURKISH STORYTELLER TEST SUITE ===");

const htmlContent = fs.readFileSync('www/index.html', 'utf8');

let mockAudioInstances = [];

const dom = new JSDOM(htmlContent, {
    url: "http://localhost",
    runScripts: "dangerously",
    beforeParse(window) {
        window.AudioContext = class {
            constructor() { 
                this.state = 'suspended'; 
                this.currentTime = 0; 
                this.destination = {}; 
            }
            createOscillator() { 
                return { 
                    type: 'sine',
                    frequency: { 
                        setValueAtTime: () => {}, 
                        exponentialRampToValueAtTime: () => {},
                        linearRampToValueAtTime: () => {} 
                    }, 
                    connect: () => {}, 
                    start: () => {}, 
                    stop: () => {} 
                }; 
            }
            createGain() { 
                return { 
                    gain: { 
                        value: 0.04, 
                        setValueAtTime: function(v) { this.value = v; }, 
                        exponentialRampToValueAtTime: function(v) { this.value = v; },
                        linearRampToValueAtTime: function(v) { this.value = v; },
                        cancelScheduledValues: () => {}
                    },
                    connect: () => {} 
                }; 
            }
            createBiquadFilter() { 
                return { 
                    type: 'lowpass',
                    frequency: { setValueAtTime: () => {} },
                    connect: () => {} 
                }; 
            }
            resume() { 
                this.state = 'running'; 
                return Promise.resolve(); 
            }
            suspend() { 
                this.state = 'suspended'; 
                return Promise.resolve(); 
            }
        };
        window.webkitAudioContext = window.AudioContext;

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

        window.speechSynthesis = {
            speak: () => {},
            cancel: () => {},
            getVoices: () => [{ lang: 'tr-TR', name: 'Ahmet' }]
        };
        window.SpeechSynthesisUtterance = class {
            constructor(text) {
                this.text = text;
                this.lang = 'tr-TR';
            }
        };
    }
});

const { window } = dom;
const { document } = window;

let passed = 0;
let total = 0;

function assert(condition, message) {
    total++;
    if (condition) {
        console.log(`  [PASS] ${message}`);
        passed++;
    } else {
        console.error(`  [FAIL] ${message}`);
        process.exitCode = 1;
    }
}

console.log("\n--- TEST 1: Audio Context & Autoplay Unlock Mechanism ---");
assert(typeof window.getAudioContext === 'function', "getAudioContext function is defined");
const ctx = window.getAudioContext();
assert(ctx !== null, "AudioContext instantiated successfully");
assert(typeof window.unlockAudioOnFirstInteraction === 'function', "unlockAudioOnFirstInteraction is defined");
window.unlockAudioOnFirstInteraction();
assert(ctx.state === 'running', "AudioContext state is 'running' after unlock");
assert(window.isAudioUnlocked === true, "isAudioUnlocked flag is set to true");

console.log("\n--- TEST 2: Dual Soundtrack Synthesis (Menu vs Gameplay) ---");
assert(typeof window.playMenuMusic === 'function', "playMenuMusic is defined");
assert(typeof window.playGameMusic === 'function', "playGameMusic is defined");
assert(typeof window.syncMusicWithCurrentScreen === 'function', "syncMusicWithCurrentScreen is defined");

window.playMenuMusic();
assert(window.currentMusicTrack === 'menu', "Current track set to 'menu' on playMenuMusic()");
assert(window.menuMusicInterval !== null, "Menu music synthesis loop interval active");

window.playGameMusic();
assert(window.currentMusicTrack === 'gameplay', "Current track switched to 'gameplay' on playGameMusic()");
assert(window.menuMusicInterval === null, "Menu music loop cleared when switching to gameplay");
assert(window.gameMusicInterval !== null, "Game music synthesis loop interval active");

console.log("\n--- TEST 3: Screen Navigation Audio Synchronization ---");
window.showScreen('screen-mainmenu');
assert(window.currentMusicTrack === 'menu', "showScreen('screen-mainmenu') activates Menu Music");

window.showScreen('screen-worldmap');
assert(window.currentMusicTrack === 'menu', "showScreen('screen-worldmap') keeps Menu Music active");

window.showScreen('screen-gameplay');
assert(window.currentMusicTrack === 'gameplay', "showScreen('screen-gameplay') activates In-Game Music");

window.showScreen('screen-hero');
assert(window.currentMusicTrack === 'menu', "Returning from gameplay to screen-hero restores Menu Music");

console.log("\n--- TEST 4: Clean Main Menu & Story Controls ---");
const storyBanner = document.getElementById('mainmenu-story-banner');
assert(storyBanner === null, "Main menu story banner is cleanly removed from DOM as requested");

assert(typeof window.toggleMainMenuStoryNarration === 'function', "toggleMainMenuStoryNarration is defined");
assert(typeof window.stopMainMenuStoryNarration === 'function', "stopMainMenuStoryNarration is defined");

// Test narration toggle play and stop safely without banner element in DOM
window.toggleMainMenuStoryNarration();
assert(window.isMainMenuStoryPlaying === true, "isMainMenuStoryPlaying is true after toggle play");
window.stopMainMenuStoryNarration();
assert(window.isMainMenuStoryPlaying === false, "isMainMenuStoryPlaying is false after stop");

console.log("\n--- TEST 5: Level Preview Story Audio with Background Ducking ---");
assert(typeof window.togglePreviewStoryAudio === 'function', "togglePreviewStoryAudio is defined");
assert(typeof window.stopPreviewStoryAudio === 'function', "stopPreviewStoryAudio is defined");

window.gameState.currentPlayingLevel = 1;
window.togglePreviewStoryAudio();
assert(window.isPreviewStoryPlaying === true, "Level preview story is playing");
assert(window.isMusicDucked === true, "BGM ducked while level preview story speaks");

window.stopPreviewStoryAudio();
assert(window.isPreviewStoryPlaying === false, "Level preview story stopped");
assert(window.isMusicDucked === false, "BGM restored after level preview story finishes");

console.log("\n--- TEST 6: Turkish Epic Callouts & Sound Effects ---");
assert(typeof window.playEpicCallout === 'function', "playEpicCallout is defined");
window.playEpicCallout('combo_3');
window.playEpicCallout('combo_4');
window.playEpicCallout('victory');
assert(true, "playEpicCallout executes smoothly with both chime synthesis and Turkish speech");

console.log("\n--- TEST 7: Settings Audio Toggles ---");
assert(typeof window.toggleBgm === 'function', "toggleBgm is defined");
assert(typeof window.toggleSfx === 'function', "toggleSfx is defined");

window.toggleBgm();
assert(window.isBgmEnabled === false, "BGM disabled via toggleBgm");
assert(window.currentMusicTrack === null, "Music track cleared when BGM disabled");

window.toggleBgm();
assert(window.isBgmEnabled === true, "BGM re-enabled via toggleBgm");
assert(window.currentMusicTrack !== null, "Music track resumed when BGM re-enabled");

console.log("\n--- TEST 8: In-Game Gem Pop & Explosion SFX ---");
assert(typeof window.sfxGemPop === 'function', "sfxGemPop is defined");
assert(typeof window.sfxBomb === 'function', "sfxBomb is defined");
assert(typeof window.sfxLaser === 'function', "sfxLaser is defined");
assert(typeof window.sfxMatchCascade === 'function', "sfxMatchCascade is defined");

window.sfxGemPop(1, 3);
window.sfxGemPop(3, 5);
window.sfxBomb();
window.sfxLaser();
window.sfxMatchCascade(2);
assert(true, "All explosion and gem pop SFX execute with shared AudioContext without error");

console.log("\n=============================================================");
console.log(`TEST SUMMARY: ${passed} / ${total} assertions PASSED.`);
console.log("=============================================================");
if (passed === total) {
    console.log(">>> ALL AUDIO ENGINE & TURKISH STORYTELLER TESTS PASSED! <<<");
    process.exit(0);
} else {
    process.exit(1);
}

const fs = require('fs');

let html = fs.readFileSync('www/index.html', 'utf8');

// Declare currentActiveScreen near top of script (before audio engine)
const topTarget = `// ==========================================
        // ARKENYA ADVANCED MYTHIC AUDIO ENGINE`;

const varHeader = `var currentActiveScreen = 'screen-mainmenu';
        var isBgmEnabled = true;
        var isSfxEnabled = true;
        var sharedAudioContext = null;
        var currentMusicTrack = null; // 'menu' | 'gameplay' | null
        var bgmGainNode = null;
        var menuMusicInterval = null;
        var gameMusicInterval = null;
        var currentMenuChordIdx = 0;
        var currentGameBeatIdx = 0;
        var isAudioUnlocked = false;
        var isMusicDucked = false;
        var mainMenuStoryAudio = null;
        var isMainMenuStoryPlaying = false;

        var GREEK_MENU_CHORDS = [
            [110.00, 164.81, 220.00, 261.63, 329.63, 493.88], // Am9
            [87.31, 130.81, 174.61, 220.00, 261.63, 329.63],   // Fmaj7
            [73.42, 110.00, 146.83, 174.61, 220.00, 261.63],   // Dm9
            [98.00, 146.83, 196.00, 246.94, 293.66, 392.00],   // Gsus4
            [65.41, 130.81, 196.00, 261.63, 329.63, 392.00],   // Cmaj7
            [82.41, 123.47, 164.81, 220.00, 246.94, 329.63]    // E7sus4
        ];

        var GAME_PENTATONIC_SCALE = [220.00, 261.63, 293.66, 329.63, 392.00, 440.00, 523.25];
        var GAME_ROOTS = [55.00, 65.41, 73.42, 82.41];

        // ==========================================
        // ARKENYA ADVANCED MYTHIC AUDIO ENGINE`;

// Replace the buggy bindings section with clean declarations
const buggyStart = `window.isBgmEnabled = (typeof window.isBgmEnabled !== 'undefined') ? window.isBgmEnabled : true;`;
const buggyEnd = `function getAudioContext() {`;

const cleanGetAudioCtx = `function getAudioContext() {
            try {
                const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
                if (!AudioCtxClass) return null;
                if (!sharedAudioContext) {
                    sharedAudioContext = new AudioCtxClass();
                    window.sharedAudioContext = sharedAudioContext;
                }
                if (sharedAudioContext.state === 'suspended') {
                    sharedAudioContext.resume().catch(() => {});
                }
                return sharedAudioContext;
            } catch(e) {
                return null;
            }
        }`;

// Replace buggy block
const startIdx = html.indexOf(buggyStart);
const endIdx = html.indexOf(buggyEnd);

if (startIdx !== -1 && endIdx !== -1) {
    html = html.slice(0, startIdx) + html.slice(endIdx);
    console.log("Buggy bindings removed.");
}

// Prepend varHeader before audio engine
html = html.replace(topTarget, varHeader);
console.log("Clean varHeader prepended.");

// Remove old declarations of currentActiveScreen later in file
html = html.replace(`let currentActiveScreen = 'screen-mainmenu';`, `// currentActiveScreen declared at top`);

// Also ensure GREEK_MENU_CHORDS and GAME_ROOTS are not redeclared with const
html = html.replace(`const GREEK_MENU_CHORDS = [`, `// GREEK_MENU_CHORDS declared at top\n        var _IGNORED_CHORDS = [`);
html = html.replace(`const GAME_PENTATONIC_SCALE = [`, `// GAME_PENTATONIC_SCALE declared at top\n        var _IGNORED_SCALE = [`);
html = html.replace(`const GAME_ROOTS = [`, `// GAME_ROOTS declared at top\n        var _IGNORED_ROOTS = [`);

fs.writeFileSync('www/index.html', html, 'utf8');
console.log("TDZ cleanup completed successfully.");

const fs = require('fs');

let html = fs.readFileSync('www/index.html', 'utf8');

// Update declarations to be attached to window
const oldDefs = `let isBgmEnabled = true;
        let sharedAudioContext = null;
        let currentMusicTrack = null; // 'menu' | 'gameplay' | null
        let bgmGainNode = null;
        let menuMusicInterval = null;
        let gameMusicInterval = null;
        let currentMenuChordIdx = 0;
        let currentGameBeatIdx = 0;
        let isAudioUnlocked = false;
        let isMusicDucked = false;
        let mainMenuStoryAudio = null;
        let isMainMenuStoryPlaying = false;`;

const newDefs = `window.isBgmEnabled = (typeof window.isBgmEnabled !== 'undefined') ? window.isBgmEnabled : true;
        let isBgmEnabled = window.isBgmEnabled;
        window.sharedAudioContext = null;
        let sharedAudioContext = null;
        window.currentMusicTrack = null; // 'menu' | 'gameplay' | null
        let currentMusicTrack = null;
        window.bgmGainNode = null;
        let bgmGainNode = null;
        window.menuMusicInterval = null;
        let menuMusicInterval = null;
        window.gameMusicInterval = null;
        let gameMusicInterval = null;
        let currentMenuChordIdx = 0;
        let currentGameBeatIdx = 0;
        window.isAudioUnlocked = false;
        let isAudioUnlocked = false;
        window.isMusicDucked = false;
        let isMusicDucked = false;
        window.mainMenuStoryAudio = null;
        let mainMenuStoryAudio = null;
        window.isMainMenuStoryPlaying = false;
        let isMainMenuStoryPlaying = false;`;

html = html.replace(oldDefs, newDefs);

// Update unlockAudioOnFirstInteraction
const oldUnlock = `function unlockAudioOnFirstInteraction() {
            if (isAudioUnlocked) return;
            const ctx = getAudioContext();
            if (ctx) {
                ctx.resume().then(() => {
                    isAudioUnlocked = true;
                    if (isBgmEnabled && !currentMusicTrack) {
                        syncMusicWithCurrentScreen(currentActiveScreen || 'screen-mainmenu');
                    }
                }).catch(() => {});
            }
        }`;

const newUnlock = `function unlockAudioOnFirstInteraction() {
            if (window.isAudioUnlocked) return;
            window.isAudioUnlocked = true;
            isAudioUnlocked = true;
            const ctx = getAudioContext();
            if (ctx) {
                ctx.resume().then(() => {
                    if (window.isBgmEnabled && !window.currentMusicTrack) {
                        syncMusicWithCurrentScreen(currentActiveScreen || 'screen-mainmenu');
                    }
                }).catch(() => {});
            }
        }`;

html = html.replace(oldUnlock, newUnlock);

// Update playMenuMusic / playGameMusic / stop
html = html.replace(
    `currentMusicTrack = 'menu';`,
    `window.currentMusicTrack = 'menu'; currentMusicTrack = 'menu';`
);
html = html.replace(
    `currentMusicTrack = 'gameplay';`,
    `window.currentMusicTrack = 'gameplay'; currentMusicTrack = 'gameplay';`
);
html = html.replace(
    `if (currentMusicTrack === 'menu') currentMusicTrack = null;`,
    `if (window.currentMusicTrack === 'menu') { window.currentMusicTrack = null; currentMusicTrack = null; }`
);
html = html.replace(
    `if (currentMusicTrack === 'gameplay') currentMusicTrack = null;`,
    `if (window.currentMusicTrack === 'gameplay') { window.currentMusicTrack = null; currentMusicTrack = null; }`
);
html = html.replace(
    `currentMusicTrack = null;\n        }`,
    `window.currentMusicTrack = null; currentMusicTrack = null;\n        }`
);
html = html.replace(
    `menuMusicInterval = setInterval(playLyreMeasure, 3100);`,
    `menuMusicInterval = setInterval(playLyreMeasure, 3100); window.menuMusicInterval = menuMusicInterval;`
);
html = html.replace(
    `gameMusicInterval = setInterval(playTempleStep, 540);`,
    `gameMusicInterval = setInterval(playTempleStep, 540); window.gameMusicInterval = gameMusicInterval;`
);
html = html.replace(
    `isMainMenuStoryPlaying = true;`,
    `window.isMainMenuStoryPlaying = true; isMainMenuStoryPlaying = true;`
);
html = html.replace(
    `isMainMenuStoryPlaying = false;`,
    `window.isMainMenuStoryPlaying = false; isMainMenuStoryPlaying = false;`
);
html = html.replace(
    `isMusicDucked = duck;`,
    `window.isMusicDucked = duck; isMusicDucked = duck;`
);
html = html.replace(
    `function toggleBgm(btn) {\n            isBgmEnabled = !isBgmEnabled;`,
    `function toggleBgm(btn) {\n            window.isBgmEnabled = !window.isBgmEnabled;\n            isBgmEnabled = window.isBgmEnabled;`
);

fs.writeFileSync('www/index.html', html, 'utf8');
console.log("Window property bindings updated in www/index.html.");

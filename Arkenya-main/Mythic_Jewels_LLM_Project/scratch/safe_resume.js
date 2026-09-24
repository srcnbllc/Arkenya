const fs = require('fs');

let html = fs.readFileSync('www/index.html', 'utf8');

const oldUnlock = `const ctx = getAudioContext();
            if (ctx) {
                ctx.resume().then(() => {
                    if (window.isBgmEnabled && !window.currentMusicTrack) {
                        syncMusicWithCurrentScreen(currentActiveScreen || 'screen-mainmenu');
                    }
                }).catch(() => {});
            }`;

const newUnlock = `const ctx = getAudioContext();
            if (ctx && typeof ctx.resume === 'function') {
                ctx.resume().then(() => {
                    if (window.isBgmEnabled && !window.currentMusicTrack) {
                        syncMusicWithCurrentScreen(currentActiveScreen || 'screen-mainmenu');
                    }
                }).catch(() => {});
            } else if (window.isBgmEnabled && !window.currentMusicTrack) {
                syncMusicWithCurrentScreen(currentActiveScreen || 'screen-mainmenu');
            }`;

html = html.replace(oldUnlock, newUnlock);
fs.writeFileSync('www/index.html', html, 'utf8');
console.log("Safe resume guard updated.");

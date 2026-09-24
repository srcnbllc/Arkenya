const fs = require('fs');

let html = fs.readFileSync('www/index.html', 'utf8');

// 1. In the first section, remove duplicate `let isSfxEnabled = true;\n        let sharedAudioContext = null;`
// We already have `let isSfxEnabled = true;` before it.
html = html.replace(
    `let isBgmEnabled = true;\n        let isSfxEnabled = true;\n        let sharedAudioContext = null;`,
    `let isBgmEnabled = true;\n        let sharedAudioContext = null;`
);

// 2. Around line 6835, remove the second declaration of sharedAudioContext and getAudioContext
const secondGetAudioCtx = `let sharedAudioContext = null;

        function getAudioContext() {
            try {
                const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
                if (!AudioCtxClass) return null;
                if (!sharedAudioContext) {
                    sharedAudioContext = new AudioCtxClass();
                }
                if (sharedAudioContext.state === 'suspended') {
                    sharedAudioContext.resume();
                }
                return sharedAudioContext;
            } catch(e) {
                return null;
            }
        }`;

if (html.includes(secondGetAudioCtx)) {
    html = html.replace(secondGetAudioCtx, `// sharedAudioContext and getAudioContext hoisted and declared in ArkenyaAudioEngine above`);
    console.log("Second declaration of getAudioContext removed.");
} else {
    // try looser match
    const pos = html.lastIndexOf('function getAudioContext()');
    if (pos > 1000000) { // late in file
        const startPos = html.lastIndexOf('let sharedAudioContext = null;', pos);
        const endPos = html.indexOf('function sfxMatchCascade', pos);
        if (startPos !== -1 && endPos !== -1) {
            html = html.slice(0, startPos) + `// getAudioContext declared in audio engine above\n        ` + html.slice(endPos);
            console.log("Second declaration replaced via slice.");
        }
    }
}

fs.writeFileSync('www/index.html', html, 'utf8');
console.log("Duplicate declaration cleanup completed.");

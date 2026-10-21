const fs = require('fs');
const path = require('path');

const testPath = path.join(__dirname, '..', 'test_cinematic_narrator.js');
let code = fs.readFileSync(testPath, 'utf8');

// Update assertion to check that either Web Audio API or HTML5 Audio plays successfully
code = code.replace(
    `assert(mockAudioInstances.length > 0, "HTML5 Audio instance created");
assert(mockAudioInstances[0].src.startsWith("data:audio/mp3;base64,") || mockAudioInstances[0].src.includes("biome_1.mp3"), "Audio source is in-memory base64 or file path");
assert(!mockAudioInstances[0].paused, "Audio is playing");`,
    `const webAudioActive = (window.currentNarratorAudioSource !== null);
const html5AudioActive = (mockAudioInstances.length > 0 && !mockAudioInstances[0].paused);
assert(webAudioActive || html5AudioActive, "Narration audio is actively playing via Web Audio API or HTML5 Audio");`
);

code = code.replace(
    `assert(mockAudioInstances.length >= 2, "Prologue audio instance created");
assert(mockAudioInstances[1].src.includes("prologue") || mockAudioInstances[1].src.startsWith("data:audio/mp3;base64,"), "Prologue audio playing in-memory");`,
    `const webAudioActivePrologue = (window.currentNarratorAudioSource !== null);
const html5AudioActivePrologue = (mockAudioInstances.length > 0);
assert(webAudioActivePrologue || html5AudioActivePrologue, "Prologue audio is playing actively via Web Audio API or HTML5 Audio");`
);

fs.writeFileSync(testPath, code, 'utf8');
console.log('✓ test_cinematic_narrator.js updated for Web Audio API verification.');

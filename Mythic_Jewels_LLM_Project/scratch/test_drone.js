const fs = require('fs');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync('www/index.html', 'utf8');

const dom = new JSDOM(html, {
    url: 'http://localhost',
    runScripts: 'dangerously',
    beforeParse(window) {
        window.AudioContext = class {
            constructor() { this.state = 'running'; this.currentTime = 0; }
            createGain() { return { gain: { setValueAtTime: () => {}, linearRampToValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} }, connect: () => {} }; }
            createOscillator() { return { frequency: { setValueAtTime: () => {} }, connect: () => {}, start: () => {}, stop: () => {} }; }
            createBiquadFilter() { return { frequency: { setValueAtTime: () => {} }, connect: () => {} }; }
            resume() { return Promise.resolve(); }
        };
        window.webkitAudioContext = window.AudioContext;
        window.Audio = class {
            constructor(src) { this.src = src; this.volume = 1; }
            play() { return Promise.resolve(); }
            pause() {}
        };
    }
});

const { window } = dom;

console.log('Testing startStoryAtmosphereDrone():');
try {
    window.startStoryAtmosphereDrone();
    console.log('startStoryAtmosphereDrone: SUCCESS');
} catch(e) {
    console.error('startStoryAtmosphereDrone: ERROR ->', e.message);
}

console.log('Testing togglePreviewStoryAudio():');
try {
    window.togglePreviewStoryAudio();
    console.log('togglePreviewStoryAudio: SUCCESS');
} catch(e) {
    console.error('togglePreviewStoryAudio: ERROR ->', e.message);
}

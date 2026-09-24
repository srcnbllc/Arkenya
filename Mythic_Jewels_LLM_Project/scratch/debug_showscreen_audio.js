const fs = require('fs');
const { JSDOM } = require('jsdom');

const htmlContent = fs.readFileSync('www/index.html', 'utf8');

const dom = new JSDOM(htmlContent, {
    url: "http://localhost",
    runScripts: "dangerously",
    beforeParse(window) {
        window.AudioContext = class {
            constructor() { this.state = 'running'; this.currentTime = 0; this.destination = {}; }
            createOscillator() { return { frequency: { setValueAtTime: () => {} }, connect: () => {}, start: () => {}, stop: () => {} }; }
            createGain() { return { gain: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {}, linearRampToValueAtTime: () => {}, cancelScheduledValues: () => {} }, connect: () => {} }; }
            createBiquadFilter() { return { frequency: { setValueAtTime: () => {} }, connect: () => {} }; }
            resume() { return Promise.resolve(); }
        };
        window.webkitAudioContext = window.AudioContext;
        window.Audio = class {
            constructor(src) { this.src = src; }
            play() { return Promise.resolve(); }
            pause() {}
        };
    }
});

const { window } = dom;

console.log("Initial isBgmEnabled:", window.isBgmEnabled);
console.log("Initial currentMusicTrack:", window.currentMusicTrack);

window.playGameMusic();
console.log("After playGameMusic, currentMusicTrack:", window.currentMusicTrack);

console.log("Calling showScreen('screen-mainmenu')...");
window.showScreen('screen-mainmenu');
console.log("After showScreen('screen-mainmenu'), currentMusicTrack:", window.currentMusicTrack);
console.log("menuMusicInterval:", window.menuMusicInterval);
console.log("isBgmEnabled:", window.isBgmEnabled);

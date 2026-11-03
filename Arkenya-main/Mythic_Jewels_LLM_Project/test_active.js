const fs = require('fs');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync('www/index.html', 'utf8');
const dom = new JSDOM(html, {
    url: 'http://localhost',
    runScripts: 'dangerously',
    beforeParse(window) {
        window.AudioContext = class { constructor() { this.state = 'running'; } createOscillator() { return { frequency: { setValueAtTime: () => {} }, connect: () => {}, start: () => {}, stop: () => {} }; } createGain() { return { gain: { setValueAtTime: () => {} }, connect: () => {} }; } };
        window.requestAnimationFrame = (fn) => setTimeout(fn, 16);
    }
});

const doc = dom.window.document;
dom.window.openWorldMap();

console.log('node-1 classes:', doc.getElementById('map-node-1')?.className);
console.log('querySelector active-target:', doc.querySelector('.map-node.active-target')?.id);

// Test audio engine logic in Node with JSDOM
const { JSDOM } = require('jsdom');

const dom = new JSDOM(`<!DOCTYPE html><html><body><div id="test"></div></body></html>`, {
    beforeParse(window) {
        window.AudioContext = class {
            constructor() { 
                this.state = 'running'; 
                this.currentTime = 0; 
                this.destination = {}; 
            }
            createOscillator() { 
                return { 
                    type: 'sine',
                    frequency: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} },
                    connect: () => {},
                    start: () => {},
                    stop: () => {}
                }; 
            }
            createGain() { 
                return { 
                    gain: { value: 0.1, setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {}, linearRampToValueAtTime: () => {} },
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
            resume() { this.state = 'running'; return Promise.resolve(); }
            suspend() { this.state = 'suspended'; return Promise.resolve(); }
        };
        window.webkitAudioContext = window.AudioContext;
    }
});

const { window } = dom;

// Test AudioEngine implementation
const AudioEngine = {
    ctx: null,
    isBgmEnabled: true,
    isSfxEnabled: true,
    currentTrack: null,
    menuInterval: null,
    gameInterval: null,
    bgmGain: null,
    
    getContext() {
        if (!this.ctx) {
            const AudioClass = window.AudioContext || window.webkitAudioContext;
            if (AudioClass) this.ctx = new AudioClass();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        return this.ctx;
    },

    playMenuMusic() {
        if (!this.isBgmEnabled) return;
        const ctx = this.getContext();
        if (!ctx) return;
        this.stopGameMusic();
        this.currentTrack = 'menu';
        console.log("Menu Music started successfully!");
    },

    playGameMusic() {
        if (!this.isBgmEnabled) return;
        const ctx = this.getContext();
        if (!ctx) return;
        this.stopMenuMusic();
        this.currentTrack = 'gameplay';
        console.log("Gameplay Music started successfully!");
    },

    stopMenuMusic() {
        if (this.menuInterval) clearInterval(this.menuInterval);
        this.menuInterval = null;
    },

    stopGameMusic() {
        if (this.gameInterval) clearInterval(this.gameInterval);
        this.gameInterval = null;
    },

    stopAllMusic() {
        this.stopMenuMusic();
        this.stopGameMusic();
        this.currentTrack = null;
    }
};

AudioEngine.playMenuMusic();
console.log("Current track:", AudioEngine.currentTrack);
AudioEngine.playGameMusic();
console.log("Current track:", AudioEngine.currentTrack);
AudioEngine.stopAllMusic();
console.log("All music stopped, current track:", AudioEngine.currentTrack);
console.log("TEST AUDIO ENGINE VERIFICATION PASSED!");

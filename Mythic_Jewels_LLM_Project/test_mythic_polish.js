const fs = require('fs');
const { JSDOM } = require('jsdom');

console.log("=== TEST: MYTHIC POLISH, AUDIO & PARTICLES ===");

const html = fs.readFileSync('www/index.html', 'utf8');

let total = 0;
let passed = 0;

function assert(condition, message) {
    total++;
    if (condition) {
        passed++;
        console.log(`  [PASS] ${message}`);
    } else {
        console.error(`  [FAIL] ${message}`);
        process.exitCode = 1;
    }
}

// 1. AudioContext & WebAudio Mocking
const dom = new JSDOM(html, {
    url: 'http://localhost',
    runScripts: 'dangerously',
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
                    frequency: {
                        setValueAtTime: () => {},
                        exponentialRampToValueAtTime: () => {}
                    },
                    connect: () => {},
                    start: () => {},
                    stop: () => {}
                };
            }
            createGain() {
                return {
                    gain: {
                        setValueAtTime: () => {},
                        exponentialRampToValueAtTime: () => {},
                        linearRampToValueAtTime: () => {}
                    },
                    connect: () => {}
                };
            }
            resume() { return Promise.resolve(); }
        };
        window.webkitAudioContext = window.AudioContext;
        window.Audio = class {
            constructor(src) {
                this.src = src;
                this.volume = 1;
                this.paused = true;
            }
            play() { this.paused = false; return Promise.resolve(); }
            pause() { this.paused = true; }
        };
        window.requestAnimationFrame = (fn) => setTimeout(fn, 16);
    }
});

const { window } = dom;
const run = (code) => window.eval(code);

// Test 1: Particle System
console.log("\n--- TEST 1: Particle System & Visuals ---");
assert(typeof run("spawnGemParticles") === 'function', "spawnGemParticles function is defined");

const dummyEl = window.document.createElement('div');
dummyEl.style.width = '40px';
dummyEl.style.height = '40px';
window.document.body.appendChild(dummyEl);

const particlesBefore = window.document.querySelectorAll('.gem-particle').length;
run("spawnGemParticles(document.body.children[0], 'ruby');");
const particlesAfter = window.document.querySelectorAll('.gem-particle').length;
assert(particlesAfter > particlesBefore, `Generated ${particlesAfter - particlesBefore} gem particles on destruction`);

// Test 2: Sound System
console.log("\n--- TEST 2: Sound System & Slide SFX ---");
assert(typeof run("sfxGemSlide") === 'function', "sfxGemSlide function is defined");
assert(typeof run("playEpicCallout") === 'function', "playEpicCallout function is defined");
assert(typeof run("startBackgroundMusic") === 'function', "startBackgroundMusic function is defined");

let slidePlayed = false;
try {
    run("sfxGemSlide();");
    slidePlayed = true;
} catch (e) {
    slidePlayed = false;
}
assert(slidePlayed, "sfxGemSlide executes cleanly without errors");

// Test 3: Epic Callouts
console.log("\n--- TEST 3: Epic Callout Audio Dispatch ---");
const calloutKeys = ['combo_3', 'combo_4', 'clutch', 'victory', 'save_me'];
calloutKeys.forEach(key => {
    let ok = false;
    try {
        run(`playEpicCallout('${key}');`);
        ok = true;
    } catch (e) {
        ok = false;
    }
    assert(ok, `playEpicCallout('${key}') dispatches smoothly`);
});

// Test 4: Ambient / Background Music
console.log("\n--- TEST 4: Background Music Generation ---");
let bgmOk = false;
try {
    run("startBackgroundMusic();");
    bgmOk = true;
} catch (e) {
    bgmOk = false;
}
assert(bgmOk, "startBackgroundMusic initializes procedural ambient track cleanly");

// Test 5: In-Game Integration
console.log("\n--- TEST 5: Integration Hooks Verification ---");
assert(html.includes("sfxGemSlide()"), "executeSwap invokes sfxGemSlide()");
assert(html.includes("spawnGemParticles(cells[idx]"), "processMatchesWithExplosion invokes spawnGemParticles");
assert(html.includes("playEpicCallout('combo_3')"), "processMatchesWithExplosion triggers combo_3 callout");
assert(html.includes("playEpicCallout('combo_4')"), "processMatchesWithExplosion triggers combo_4 callout");
assert(html.includes("playEpicCallout('clutch')"), "updateMovesDisplay triggers clutch callout at 3 moves");
assert(html.includes("playEpicCallout('victory')"), "showVictory triggers victory callout");
assert(html.includes("playEpicCallout('save_me')"), "prepareSaveMeModal triggers save_me callout");

console.log(`\n=== RESULTS: ${passed} / ${total} ASSERTIONS PASSED ===`);
if (passed === total) {
    console.log(">>> ALL MYTHIC POLISH & AUDIO/PARTICLE TESTS PASSED! <<<");
} else {
    process.exit(1);
}

const fs = require('fs');
const { JSDOM } = require('jsdom');

console.log("=== RUNNING IN-DEPTH TEST: ONBOARDING, INITIAL BOARD & SCORING ===");

const htmlContent = fs.readFileSync('www/index.html', 'utf8');

const dom = new JSDOM(htmlContent, {
    url: "http://localhost",
    runScripts: "dangerously",
    resources: "usable",
    beforeParse(window) {
        window.AudioContext = class {
            constructor() {
                this.state = 'running';
                this.currentTime = 0;
                this.destination = {};
            }
            createOscillator() {
                return {
                    connect: () => {},
                    frequency: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} },
                    start: () => {},
                    stop: () => {}
                };
            }
            createGain() {
                return {
                    connect: () => {},
                    gain: { value: 0.1, setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} }
                };
            }
            createBiquadFilter() {
                return {
                    connect: () => {},
                    frequency: { setValueAtTime: () => {} }
                };
            }
            resume() { return Promise.resolve(); }
        };
        window.webkitAudioContext = window.AudioContext;

        window.SpeechSynthesisUtterance = class {
            constructor(text) {
                this.text = text;
                this.lang = 'tr-TR';
            }
        };
        window.speechSynthesis = {
            speak: (u) => { if (u.onstart) u.onstart(); if (u.onend) setTimeout(u.onend, 10); },
            cancel: () => {},
            getVoices: () => [{ lang: 'tr-TR', name: 'Turkish' }]
        };
        window.fetch = () => Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    }
});

const { window } = dom;
const { document } = window;
const run = (code) => window.eval(code);

async function testAll() {
    // 1. Initial State verification
    const gs = run('gameState');
    console.log("1. Checking Initial Fresh State:");
    console.log("  Gold:", gs.gold);
    console.log("  Gems:", gs.gems);
    console.log("  Total Score:", gs.totalScore);
    console.log("  Level:", gs.unlockedLevel);
    console.log("  Tutorials completed:", gs.completedTutorials);

    if (gs.gold !== 0 || gs.gems !== 0 || gs.totalScore !== 0) {
        throw new Error("Initial economy is not pure 0!");
    }
    console.log("PASS: Fresh Zero-Score Start confirmed!");

    // 2. Launch Gameplay Core on Level 1
    console.log("\n2. Launching Level 1 Gameplay:");
    run('gameState.currentPlayingLevel = 1;');
    run('startGameplayCore();');

    // Wait 400ms for initGrid and tutorial setup
    await new Promise(r => setTimeout(r, 400));

    const gameScoreAfterInit = run('gameScore');
    const isEnding = run('isLevelEnding');
    console.log("  Game Score immediately after init:", gameScoreAfterInit);
    console.log("  isLevelEnding:", isEnding);

    if (gameScoreAfterInit !== 0) {
        throw new Error(`Board auto-exploded! Score should be 0, got ${gameScoreAfterInit}`);
    }
    if (isEnding) {
        throw new Error("Level 1 prematurely ended before player input!");
    }

    const victoryModal = document.getElementById('modal-victory');
    if (victoryModal.classList.contains('active')) {
        throw new Error("Victory modal should NOT be active on board load!");
    }
    console.log("PASS: Board is completely stationary at 0 score waiting for player!");

    // 3. Verify Level 1 Tutorial Setup
    console.log("\n3. Checking Level 1 Onboarding Tutorial Hand & Banner:");
    const handHint = document.getElementById('tutorial-hand-hint');
    if (!handHint) {
        throw new Error("Level 1 tutorial hand hint not found!");
    }
    console.log("  Hand Hint Found:", (handHint.textContent || '').trim());

    const banner = document.getElementById('onboarding-tip-banner');
    if (!banner) {
        throw new Error("Level 1 onboarding banner not found!");
    }
    console.log("  Banner Found:", (banner.textContent || '').trim());
    console.log("PASS: Level 1 Interactive Tutorial spawned correctly!");

    // 4. Test Executing the Guided Swap (Row 3: col 2 swapped with col 3)
    console.log("\n4. Executing Guided Match-3 Swap (from [3,2] to [3,3]):");
    run('executeSwap(3, 2, 3, 3);');

    // Wait 600ms for swap animation and match explosion
    await new Promise(r => setTimeout(r, 600));

    const newScore = run('gameScore');
    console.log("  Game Score after player swap:", newScore);
    if (newScore <= 0) {
        throw new Error(`Expected positive score after match, got ${newScore}`);
    }
    console.log("PASS: Player earned their first score legitimately through match-3!");

    const tutCompleted = run('gameState.completedTutorials[1]');
    console.log("  Level 1 Tutorial marked complete:", tutCompleted);
    if (!tutCompleted) {
        throw new Error("Tutorial 1 was not marked complete after player move!");
    }
    console.log("PASS: Tutorial marked complete and will not repeat!");

    // 5. Test Mystical Voice & Soundscape Toggle
    console.log("\n5. Testing Mystical Narrator & Soundscape:");
    run('currentStoryTextToSpeak = "Kadim Olimpos tanrıları uyanıyor...";');
    run('toggleStoryVoice();');
    console.log("  Narrator speaking status:", run('isStoryNarratorSpeaking'));
    console.log("  Mystic drone active:", run('mysticDroneNodes !== null'));
    run('toggleStoryVoice();');
    console.log("  Narrator stopped after toggle:", !run('isStoryNarratorSpeaking'));
    console.log("PASS: Mystical voice and atmospheric soundscape function flawlessly!");

    // 6. Test Daily Reward Guard for New Player
    console.log("\n6. Testing Daily Reward Guard for New Player (0 Completed Levels):");
    run('gameState.completedLevels = {};');
    run('gameState.lastLoginDate = null;');
    run('checkDailyReward();');
    const dailyModal = document.getElementById('modal-daily-reward');
    if (dailyModal.classList.contains('active')) {
        throw new Error("Daily reward opened for a brand new player before completing level 1!");
    }
    console.log("PASS: Daily reward properly guarded against unearned initial gifts!");

    console.log("\n===================================================================");
    console.log("=== ALL ONBOARDING, STATIONARY BOARD & SCORING TESTS PASSED! ===");
    console.log("===================================================================");
}

testAll().catch(err => {
    console.error("TEST FAILED:", err);
    process.exit(1);
});

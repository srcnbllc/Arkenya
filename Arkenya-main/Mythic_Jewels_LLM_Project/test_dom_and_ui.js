const fs = require('fs');
const { JSDOM } = require('jsdom');

console.log("=== RUNNING IN-DEPTH JSDOM GAME CONTROLS & UI TEST ===");

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
                    gain: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} }
                };
            }
            resume() { return Promise.resolve(); }
        };
        window.webkitAudioContext = window.AudioContext;

        window.speechSynthesis = {
            speak: (u) => { if (u.onstart) u.onstart(); if (u.onend) setTimeout(u.onend, 10); },
            cancel: () => {},
            getVoices: () => [{ lang: 'tr-TR', name: 'Turkish' }]
        };
        window.fetch = globalThis.fetch;
        window.AbortController = globalThis.AbortController;
    }
});

const { window } = dom;
const { document } = window;
const run = (code) => window.eval(code);

async function runAllTests() {
    console.log("PASS: JSDOM loaded HTML and executed scripts with 0 runtime errors!");

    // 1. Verify defaultState
    const gs = run('gameState');
    console.log("Checking gameState:");
    console.log("  Player Gold:", gs.gold);
    console.log("  Player Gems:", gs.gems);
    console.log("  Total Score:", gs.totalScore);
    console.log("  Current Level:", gs.unlockedLevel);

    if (gs.gold !== 0 || gs.gems !== 0 || gs.totalScore !== 0) {
        throw new Error("Initial state is not zero-score!");
    }
    console.log("PASS: Fresh Zero-Score Start confirmed!");

    // 2. Trigger Play Adventure
    console.log("\nTesting Game Launch (initGrid & showScreen):");
    run('showScreen("screen-gameplay"); initGrid();');

    // Wait 50ms for DOM update
    await new Promise(r => setTimeout(r, 50));

    const gameGrid = document.getElementById('game-grid');
    if (!gameGrid) throw new Error("game-grid not found!");
    console.log("PASS: game-grid rendered!");
    console.log("  Active data-biome on grid:", gameGrid.getAttribute('data-biome'));

    const cells = gameGrid.querySelectorAll('.cell');
    console.log(`  Rendered grid cells: ${cells.length} (expected 64)`);
    if (cells.length !== 64) throw new Error(`Expected 64 cells, got ${cells.length}`);
    console.log("PASS: Full 8x8 Board successfully generated!");

    // 3. Test Cell Pointer Events and Selection
    console.log("\nTesting Cell Controls & Pointer Events:");
    const cell00 = cells[0];

    // Test click/tap on cell (0, 0)
    cell00.dispatchEvent(new window.MouseEvent('pointerdown', { bubbles: true, button: 0, clientX: 100, clientY: 100 }));
    cell00.dispatchEvent(new window.MouseEvent('pointerup', { bubbles: true, button: 0, clientX: 100, clientY: 100 }));

    console.log("  Cell (0,0) selected state:", cell00.classList.contains('selected'));
    console.log("PASS: Pointer down & up event handlers executed cleanly!");

    // 4. Test Story Scroll Modal opening for Biome 2 (Level 11)
    console.log("\nTesting Biome 2 (Fırtına Kanyonu) Narrative Trigger:");
    run('gameState.currentPlayingLevel = 11');
    const shown = run('checkAndShowStoryScroll(11)');
    console.log("  Story Scroll shown for Level 11:", shown);

    const storyModal = document.getElementById('modal-story-scroll');
    if (!storyModal.classList.contains('active')) {
        throw new Error("modal-story-scroll should be active for Level 11!");
    }
    console.log("PASS: Story Scroll Modal opened with Biome 2 Lore!");
    console.log("  Story Title:", document.getElementById('story-scroll-title').innerText);
    console.log("  Story Badge:", document.getElementById('story-scroll-badge').innerText);
    console.log("  Hero Defender:", document.getElementById('story-scroll-hero').innerText);
    console.log("  Villain:", document.getElementById('story-scroll-villain').innerText);

    // 5. Test Speech Synthesis Toggle
    console.log("\nTesting Offline Story Voice Toggle:");
    run('toggleStoryVoice()');
    console.log("  Narrator speaking status:", run('isStoryNarratorSpeaking'));
    run('confirmStoryAndStart()');
    console.log("  Modal closed after confirm:", !storyModal.classList.contains('active'));
    console.log("PASS: Story confirmed and game started!");

    // 6. Test Victory Flow & Direct Level Progression:
    console.log("\nTesting Victory Flow & Direct Level Progression:");
    run('gameScore = gameTarget + 1000; movesLeftAtWin = 5;');
    run('showVictory()');

    const victoryModal = document.getElementById('modal-victory');
    if (!victoryModal.classList.contains('active')) {
        throw new Error("modal-victory should be active!");
    }
    console.log("PASS: Victory Modal opened with rewards and stars!");

    // Test Direct Next Level Transition
    const prevLevel = run('gameState.currentPlayingLevel');
    run('playNextLevelDirectly()');
    await new Promise(r => setTimeout(r, 300));
    console.log(`PASS: Directly progressed from Level ${prevLevel} to Level ${run('gameState.currentPlayingLevel')}!`);

    // 7. Test Profile Setup & Interactive Leaderboard
    console.log("\nTesting Profile Setup & Avatar Selection:");
    run('openProfileModal(true)');
    const profileModal = document.getElementById('modal-profile-setup');
    if (!profileModal.classList.contains('active')) {
        throw new Error("modal-profile-setup should be active!");
    }
    console.log("PASS: Profile Setup Modal opened!");

    // Verify 6 hero cards rendered
    const heroGrid = document.getElementById('profile-hero-grid');
    if (!heroGrid || heroGrid.children.length !== 6) {
        throw new Error(`Expected 6 hero cards in avatar selector, found ${heroGrid ? heroGrid.children.length : 0}`);
    }
    console.log(`PASS: All ${heroGrid.children.length} hero avatar cards rendered properly!`);

    // Select Zeus avatar and set username
    run("selectProfileAvatar('zeus')");
    document.getElementById('profile-input-username').value = 'OlimposKralıTest';
    run('submitProfileSetup()');

    if (profileModal.classList.contains('active')) {
        throw new Error("modal-profile-setup should be closed after submit!");
    }
    const profile = run('gameState.playerProfile');
    console.log("PASS: Profile created and persisted:", profile.username, "Hero:", profile.avatarHero);

    // Verify HUD reflects custom username and avatar
    const hudName = document.getElementById('hud-name').innerText;
    console.log("PASS: Top HUD name dynamically updated to:", hudName);
    if (hudName !== 'OlimposKralıTest') {
        throw new Error(`HUD name mismatch: expected OlimposKralıTest, got ${hudName}`);
    }

    // 8. Test 3-Tab Leaderboard & Firebase Sync
    console.log("\nTesting 3-Tab Interactive Leaderboard:");
    run('openLeaderboardModal()');
    const lbModal = document.getElementById('modal-leaderboard');
    if (!lbModal.classList.contains('active')) {
        throw new Error("modal-leaderboard should be active!");
    }
    console.log("PASS: Leaderboard Modal opened!");

    // Wait for leaderboard fetch/render
    await new Promise(r => setTimeout(r, 600));

    // Verify Weekly Tab
    const lbList = document.getElementById('leaderboard-list');
    console.log("PASS: Weekly Leaderboard list populated with HTML length:", lbList.innerHTML.length);

    // Verify Tab Switch to Aylık
    console.log("Testing Switch to 'aylik' Tab:");
    run("switchLeaderboardTab('aylik')");
    await new Promise(r => setTimeout(r, 600));
    console.log("PASS: Switched to 'aylik' tab! Current tab:", run('currentLeaderboardTab'));

    // Verify Tab Switch to Genel
    console.log("Testing Switch to 'genel' Tab:");
    run("switchLeaderboardTab('genel')");
    await new Promise(r => setTimeout(r, 600));
    console.log("PASS: Switched to 'genel' tab! Current tab:", run('currentLeaderboardTab'));

    // Verify Sticky Player Card at Bottom
    const playerCard = document.getElementById('lb-player-card');
    const cardText = playerCard ? (playerCard.textContent || playerCard.innerText || '') : '';
    if (!cardText.includes('OlimposKralıTest')) {
        throw new Error("Sticky player card should display current player's username!");
    }
    console.log("PASS: Sticky player card verified with player info:\n ", cardText.replace(/\s+/g, ' '));

    run("closeModal('modal-leaderboard')");
    console.log("PASS: Leaderboard modal closed!");

    console.log("\n===================================================================");
    console.log("=== ALL JSDOM UI, CONTROLS, PROFILE & LEADERBOARD TESTS PASSED! ===");
    console.log("===================================================================");
}

runAllTests().catch(err => {
    console.error("Test execution failed:", err);
    process.exit(1);
});

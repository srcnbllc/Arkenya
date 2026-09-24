const fs = require('fs');
const { JSDOM } = require('jsdom');
const html = fs.readFileSync('www/index.html', 'utf8');

const dom = new JSDOM(html, {
    url: 'http://localhost',
    runScripts: 'dangerously',
    resources: 'usable'
});
const win = dom.window;

async function run() {
    console.log('=== ASYNC TEST: LEVEL & BIOME TRANSITION WITH TIMERS ===');

    win.eval(`
        gameState.currentPlayingLevel = 1;
        gameState.unlockedLevel = 1;
        gameScore = 5200;
        gameTarget = 4000;
        gameMoves = 5;
        movesLeftAtWin = 5;
        showVictory();
    `);

    console.log('After Level 1 Victory:');
    console.log('unlockedLevel:', win.eval('gameState.unlockedLevel'));

    // Call playNextLevelDirectly()
    win.eval('playNextLevelDirectly()');
    // Wait for screen wipe (500ms)
    await new Promise(r => setTimeout(r, 600));

    console.log('After playNextLevelDirectly() executed:');
    console.log('currentPlayingLevel:', win.eval('gameState.currentPlayingLevel'), '(Expected: 2)');

    // Now test Level 10 Boss victory
    win.eval(`
        gameState.currentPlayingLevel = 10;
        gameState.unlockedLevel = 10;
        gameScore = 28000;
        gameTarget = 24000;
        gameMoves = 6;
        movesLeftAtWin = 6;
        showVictory();
    `);
    console.log('\nAfter Level 10 Victory:');
    console.log('unlockedLevel:', win.eval('gameState.unlockedLevel'), '(Expected: 11)');

    // Next level to 11 (Biome 2 transition!)
    win.eval('playNextLevelDirectly()');
    await new Promise(r => setTimeout(r, 600));

    console.log('After playNextLevelDirectly() to Level 11:');
    console.log('currentPlayingLevel:', win.eval('gameState.currentPlayingLevel'), '(Expected: 11)');
    const storyModal = win.document.getElementById('modal-story-scroll');
    console.log('Story scroll modal active?', storyModal.classList.contains('active'));
    console.log('Story scroll badge:', win.document.getElementById('story-scroll-badge')?.innerText);
    console.log('Story scroll title:', win.document.getElementById('story-scroll-title')?.innerText);
    console.log('Current zone:', win.eval('getZoneForLevel(11)'), '(Expected: 2)');
    console.log('Active data-biome:', win.document.body.getAttribute('data-biome'), '(Expected: 2)');

    // Now confirm story and start level 11
    win.eval('confirmStoryAndStart()');
    console.log('Story scroll active after confirm?', storyModal.classList.contains('active'), '(Expected: false)');
    console.log('Game moves for level 11:', win.eval('gameMoves'), '(Expected: 29)');
    console.log('Game target for level 11:', win.eval('gameTarget'), '(Expected: 20500)');

    // Now test Level 50 victory
    win.eval(`
        gameState.currentPlayingLevel = 50;
        gameState.unlockedLevel = 50;
        gameScore = 90000;
        gameTarget = 82000;
        gameMoves = 3;
        movesLeftAtWin = 3;
        showVictory();
    `);
    console.log('\nAfter Level 50 Victory:');
    console.log('next-lvl-num-btn:', win.document.getElementById('next-lvl-num-btn')?.innerText);
    await new Promise(r => setTimeout(r, 2200));
    const finalCelebration = win.document.getElementById('modal-final-celebration');
    console.log('modal-final-celebration active after 2s?', finalCelebration.classList.contains('active'));
}

run();

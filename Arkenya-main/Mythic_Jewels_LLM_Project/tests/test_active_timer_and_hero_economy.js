const fs = require('fs');
const { JSDOM } = require('jsdom');

console.log('=== TEST SUITE: ACTIVE-ONLY TIMER, 5 LIVES DEFAULT & HERO PROGRESSION ===');

const html = fs.readFileSync('www/index.html', 'utf8');

const dom = new JSDOM(html, {
    url: 'http://localhost',
    runScripts: 'dangerously',
    beforeParse(win) {
        win.requestAnimationFrame = (cb) => setTimeout(cb, 16);
    }
});

const win = dom.window;
const doc = win.document;

function assert(condition, message) {
    if (!condition) {
        console.error('FAIL:', message);
        process.exit(1);
    }
    console.log('✓', message);
}

// 1. Initial State & 5 Lives Default
assert(win.gameState.energy === 5, 'Initial energy is 5 full lives (got ' + win.gameState.energy + ')');
assert(win.gameState.maxEnergy === 5, 'Max energy is 5');
assert(win.gameState.energyRegenSecondsRemaining === 1800, 'Initial energy timer seconds is 1800s (30m)');

// 2. Timer Visibility Toggle
// At 5 lives: Timer must be HIDDEN (display: none)
win.renderAllHeartsAndTimers();
const gameplayTimer = doc.getElementById('hud-game-energy-timer');
const globalTimer = doc.getElementById('hud-energy-timer');
assert(gameplayTimer.style.display === 'none', 'Gameplay timer is HIDDEN when energy is 5/5');
assert(globalTimer.style.display === 'none', 'Global top HUD timer is HIDDEN when energy is 5/5');

// When 1 life is lost (energy = 4): Timer must be VISIBLE (display: block)
win.gameState.energy = 4;
win.gameState.energyRegenSecondsRemaining = 1750; // 29:10
win.renderAllHeartsAndTimers();
assert(gameplayTimer.style.display === 'block', 'Gameplay timer is SHOWN when energy drops to 4');
assert(globalTimer.style.display === 'block', 'Global timer is SHOWN when energy drops to 4');
assert(gameplayTimer.innerText.includes('29:10'), 'Gameplay timer displays accurate live time (got ' + gameplayTimer.innerText + ')');

// 3. Active-Only Timer (No Offline Background Cheating)
// Simulate document.hidden = true (phone screen off / background)
Object.defineProperty(doc, 'hidden', { value: true, configurable: true });
win.checkEnergyRegen();
assert(win.gameState.energyRegenSecondsRemaining === 1750, 'Timer did NOT decrement while document.hidden is true');

// Re-activate screen (document.hidden = false)
Object.defineProperty(doc, 'hidden', { value: false, configurable: true });
win.checkEnergyRegen();
assert(win.gameState.energyRegenSecondsRemaining === 1749, 'Timer decremented by exactly 1s while game is active');

// Simulate timer completing to grant 1 life
win.gameState.energyRegenSecondsRemaining = 1;
win.checkEnergyRegen();
assert(win.gameState.energy === 5, 'Energy regenerated back to 5 when timer reached 0');
assert(gameplayTimer.style.display === 'none', 'Gameplay timer automatically HIDDEN once refilled to 5/5');
assert(globalTimer.style.display === 'none', 'Global timer automatically HIDDEN once refilled to 5/5');

// 4. Hero Screen Tabs & Progression Config
const tabArkenya = doc.getElementById('tab-arkenya');
const tabAsterion = doc.getElementById('tab-asterion');
const tabNyra = doc.getElementById('tab-nyra');
const tabThalor = doc.getElementById('tab-thalor');
const tabAthena = doc.getElementById('tab-athena');
const tabZeus = doc.getElementById('tab-zeus');
assert(tabArkenya && tabAsterion && tabNyra && tabThalor && tabAthena && tabZeus, 'All 6 hero tabs exist in DOM');

// 5. Hero Unlock System
assert(win.isHeroUnlocked('arkenya') === true, 'Arkenya is unlocked by default');
assert(win.isHeroUnlocked('asterion') === false, 'Asterion is initially locked');
assert(win.HEROES.asterion.unlockReqLvl === 5, 'Asterion unlocks at level 5');
assert(win.HEROES.asterion.unlockGoldCost === 1500, 'Asterion costs 1,500 gold');
assert(win.HEROES.nyra.unlockReqLvl === 15, 'Nyra unlocks at level 15');
assert(win.HEROES.thalor.unlockReqLvl === 25, 'Thalor unlocks at level 25');
assert(win.HEROES.athena.unlockReqLvl === 35, 'Athena unlocks at level 35');
assert(win.HEROES.zeus.unlockReqLvl === 45, 'Zeus unlocks at level 45');

// Attempt to unlock Asterion before level 5 (level 3)
win.gameState.unlockedLevel = 3;
win.gameState.gold = 5000;
win.unlockHero('asterion');
assert(win.isHeroUnlocked('asterion') === false, 'Cannot unlock Asterion before reaching Level 5');
assert(win.gameState.gold === 5000, 'Gold untouched when level requirement not met');

// Reach Level 5 with insufficient gold (100 gold)
win.gameState.unlockedLevel = 5;
win.gameState.gold = 100;
win.unlockHero('asterion');
assert(win.isHeroUnlocked('asterion') === false, 'Cannot unlock Asterion without 1,500 gold');

// Reach Level 5 with 2000 gold
win.gameState.gold = 2000;
win.unlockHero('asterion');
assert(win.isHeroUnlocked('asterion') === true, 'Asterion successfully unlocked with level 5 + gold');
assert(win.gameState.gold === 500, '1,500 gold deducted for recruiting Asterion (2000 - 1500 = 500)');
assert(win.gameState.selectedHero === 'asterion', 'Asterion is now selected hero');

// 6. Hero Upgrades (Gold Sink & Power Scaling)
win.gameState.gold = 2500;
win.upgradeSelectedHero();
assert(win.gameState.heroLevels.asterion === 2, 'Asterion upgraded to Level 2');
assert(win.gameState.gold === 500, '2,000 gold deducted for Level 2 upgrade');

// 7. Functional Gameplay Abilities in useAbility()
win.eval(`
    gameState.selectedHero = 'thalor';
    gameState.currentPlayingLevel = 5;
    if (!gameState.heroLevels) gameState.heroLevels = {};
    gameState.heroLevels.thalor = 1;
    gameGauge = 100;
    isSwapping = false;
    isCascading = false;
    isLevelEnding = false;
    gameMoves = 20;
    gridData = Array(8).fill(null).map(function() { return Array(8).fill(1); });
    useAbility();
`);
const finalMoves = win.eval('gameMoves');
const finalGauge = win.eval('gameGauge');
assert(finalMoves === 25, 'Thalor Tide Shield added +5 extra moves (got ' + finalMoves + ')');
assert(finalGauge === 0, 'Game gauge reset to 0 after using hero ability');

console.log('\n>>> ALL 20 ACTIVE TIMER & HERO PROGRESSION TESTS PASSED! <<<');
process.exit(0);

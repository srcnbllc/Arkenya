const fs = require('fs');
const html = fs.readFileSync('www/index.html', 'utf8');

function checkPattern(name, regex) {
    const matches = html.match(regex) || [];
    console.log(`[${name}]: ${matches.length} matches`);
    if (matches.length > 0 && matches.length <= 10) {
        matches.forEach(m => console.log('   ->', m.substring(0, 120).replace(/\n/g, ' ')));
    }
}

console.log('=== 1. TOUCH & POINTER & INPUT ===');
checkPattern('pointer events', /addEventListener\(['"]pointer[a-z]+['"]/gi);
checkPattern('touch events', /addEventListener\(['"]touch[a-z]+['"]/gi);
checkPattern('mouse events', /addEventListener\(['"]mouse[a-z]+['"]/gi);
checkPattern('click events', /addEventListener\(['"]click['"]/gi);
checkPattern('inline onclick/ontouch', /on(click|touchstart|pointerdown)=/gi);
checkPattern('touch-action in CSS', /touch-action\s*:[^;]+;/gi);

console.log('=== 2. TIMING & RENDER LOOPS ===');
checkPattern('requestAnimationFrame', /requestAnimationFrame/gi);
checkPattern('setInterval', /setInterval/gi);
checkPattern('setTimeout', /setTimeout/gi);

console.log('=== 3. LIFECYCLE & PAUSE ===');
checkPattern('visibilitychange', /visibilitychange/gi);
checkPattern('pagehide/freeze', /pagehide|freeze/gi);
checkPattern('pause functions', /function\s+.*pause.*\(|pauseGame|togglePause|resumeGame/gi);
checkPattern('blur/focus', /addEventListener\(['"](blur|focus)['"]/gi);
checkPattern('Capacitor App listener', /App\.addListener|Capacitor\.Plugins/gi);

console.log('=== 4. STATE PERSISTENCE & STORAGE ===');
checkPattern('localStorage get/set', /localStorage\.(getItem|setItem|removeItem)/gi);
checkPattern('saveGameState/load', /saveGameState|saveState|loadGameState|loadState/gi);

console.log('=== 5. AD INTEGRATION ===');
checkPattern('ads / admob', /admob|interstitial|rewarded|showAd|loadAd|reklam/gi);

console.log('=== 6. BOARD INTERACTION & SELECTION ===');
checkPattern('board/tile click/tap handler', /tile.*click|handleTileClick|selectTile|swapTiles/gi);

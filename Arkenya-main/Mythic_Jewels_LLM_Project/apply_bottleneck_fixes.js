const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'www', 'index.html');
let html = fs.readFileSync(filePath, 'utf8');

console.log('1. Fixing theme chips and arrows onclick in HTML...');
// Remove if(window.event)window.event.stopPropagation(); from chips and nav arrows
html = html.replace(/onclick="if\(window\.event\)window\.event\.stopPropagation\(\);\s*jumpToZone\((\d+)\);"/g, 'onclick="jumpToZone($1);"');
html = html.replace(/onclick="if\(window\.event\)window\.event\.stopPropagation\(\);\s*navigateMapZone\((-?\d+)\);"/g, 'onclick="navigateMapZone($1);"');
html = html.replace(/onclick="if\(window\.event\)window\.event\.stopPropagation\(\);\s*toggleZoneThemeDrawer\(\);"/g, 'onclick="toggleZoneThemeDrawer();"');

console.log('2. Bulletproofing jumpToZone with direct scrollTop assignment...');
const oldJumpToZone = /function jumpToZone\(zoneNum\) \{[\s\S]*?updateDynamicZoneBackground\(startLvl\);\s*\}/;
const newJumpToZone = `function jumpToZone(zoneNum) {
            zoneNum = Math.max(1, Math.min(5, parseInt(zoneNum) || 1));
            currentViewingZone = zoneNum;
            const startLvl = (zoneNum - 1) * 10 + 1;
            const targetY = (zoneNum === 1) ? 0 : Math.max(0, getMapNodeY(startLvl) - 60);
            const screenWorldMap = document.getElementById('screen-worldmap');
            if (screenWorldMap) {
                // Direct scrollTop ensures instant 100% reliable scroll on Android WebView & iOS
                screenWorldMap.scrollTop = targetY;
                try {
                    screenWorldMap.scrollTo({ top: targetY, behavior: 'auto' });
                } catch(e) {}
            }
            updateZoneQuickNav(zoneNum);
            updateDynamicZoneBackground(startLvl);
        }`;

if (oldJumpToZone.test(html)) {
    html = html.replace(oldJumpToZone, newJumpToZone);
    console.log('  [+] jumpToZone updated with direct scrollTop assignment.');
} else {
    console.warn('  [-] oldJumpToZone pattern not matched.');
}

console.log('3. Removing bottleneck __hasRecentlyDragged tap rejection in openWorldMap...');
const oldStopTap = /const handleStopTap = function\(e\) \{[\s\S]*?openLevelPreview\(i\);\s*\};/;
const newStopTap = `const handleStopTap = function(e) {
                        if (e && e.stopPropagation) e.stopPropagation();
                        openLevelPreview(i);
                    };`;

if (oldStopTap.test(html)) {
    html = html.replace(oldStopTap, newStopTap);
    console.log('  [+] handleStopTap updated to remove tap rejection bottleneck.');
} else {
    console.warn('  [-] oldStopTap pattern not matched.');
}

console.log('4. Removing backdrop instant-kill onclick from #modal-level-preview...');
html = html.replace(/<div class="modal-overlay" id="modal-level-preview" onclick="if\(event\.target === this\) closeModal\('modal-level-preview', true\);">/g, '<div class="modal-overlay" id="modal-level-preview">');

console.log('5. Ensuring #modal-level-preview has top z-index & pointer-events...');
html = html.replace(/#modal-level-preview\.modal-overlay\s*\{[\s\S]*?z-index:\s*\d+[\s\S]*?\}/, `#modal-level-preview.modal-overlay {
            z-index: 99999 !important;
            padding: max(env(safe-area-inset-top, 0px), 8px) 12px max(env(safe-area-inset-bottom, 0px), 10px) !important;
            box-sizing: border-box !important;
            display: none;
            align-items: center;
            justify-content: center;
            background: rgba(4, 7, 15, 0.88) !important;
            backdrop-filter: blur(8px) !important;
            -webkit-backdrop-filter: blur(8px) !important;
        }`);

html = html.replace(/#modal-level-preview\.modal-overlay\.active\s*\{[\s\S]*?\}/, `#modal-level-preview.modal-overlay.active {
            display: flex !important;
            visibility: visible !important;
            opacity: 1 !important;
            pointer-events: auto !important;
        }`);

console.log('6. Ensuring startGameplay always launches selected/previewed level...');
const oldStartGameplayLvl = /if \(!gameState\.currentPlayingLevel\) \{\s*gameState\.currentPlayingLevel = gameState\.unlockedLevel \|\| 1;\s*\}/;
const newStartGameplayLvl = `gameState.currentPlayingLevel = gameState.currentPreviewLevel || gameState.currentPlayingLevel || gameState.unlockedLevel || 1;`;
if (oldStartGameplayLvl.test(html)) {
    html = html.replace(oldStartGameplayLvl, newStartGameplayLvl);
    console.log('  [+] startGameplay level binding updated.');
}

fs.writeFileSync(filePath, html, 'utf8');
console.log('Successfully applied all fixes to www/index.html');

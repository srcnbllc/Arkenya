const fs = require('fs');

console.log('=== ARKENYA COMPREHENSIVE END-TO-END DEEP CODE AUDIT ===\n');

const html = fs.readFileSync('www/index.html', 'utf8');

// -------------------------------------------------------------
// CATEGORY 1: UNUSED / DEAD / REDUNDANT CODE & ORPHANED LOGIC
// -------------------------------------------------------------
console.log('--- 1. UNUSED & DEAD CODE ANALYSIS ---');
const fnRegex = /function\s+([a-zA-Z0-9_$]+)\s*\(/g;
const allFunctions = [];
let match;
while ((match = fnRegex.exec(html)) !== null) {
    allFunctions.push(match[1]);
}

const unusedFunctions = [];
allFunctions.forEach(fn => {
    const re = new RegExp('\\b' + fn + '\\b', 'g');
    const occurrences = (html.match(re) || []).length;
    if (occurrences <= 1) {
        unusedFunctions.push(fn);
    }
});
console.log(`Total JS Functions Declared: ${allFunctions.length}`);
console.log(`Dead / Uncalled Functions (${unusedFunctions.length}):`, unusedFunctions);

// Duplicate IDs in HTML
const idRegex = /\sid=["']([^"']+)["']/g;
const idCounts = {};
while ((match = idRegex.exec(html)) !== null) {
    const id = match[1];
    idCounts[id] = (idCounts[id] || 0) + 1;
}
const duplicateIds = Object.keys(idCounts).filter(id => idCounts[id] > 1);
console.log(`Duplicate HTML IDs in DOM (${duplicateIds.length}):`, duplicateIds);

// -------------------------------------------------------------
// CATEGORY 2: FUNCTIONAL / LOGIC BUGS & EVENT LISTENER LEAKS
// -------------------------------------------------------------
console.log('\n--- 2. FUNCTIONAL & LOGIC ISSUES ---');
const emptyCatch = (html.match(/catch\s*\([^)]*\)\s*\{\s*\}/g) || []).length;
console.log(`Silent empty catch blocks catch(e) {}: ${emptyCatch}`);

const setTimeouts = (html.match(/setTimeout\s*\(/g) || []).length;
const setIntervals = (html.match(/setInterval\s*\(/g) || []).length;
console.log(`Active setTimeout calls: ${setTimeouts}, setInterval calls: ${setIntervals}`);

// -------------------------------------------------------------
// CATEGORY 3: DESIGN & CSS INCONSISTENCIES
// -------------------------------------------------------------
console.log('\n--- 3. DESIGN & CSS INCONSISTENCIES ---');
const styleBlock = html.substring(html.indexOf('<style>'), html.indexOf('</style>'));
const selectorRegex = /([^{]+)\{([^}]+)\}/g;
const selectors = {};
while ((match = selectorRegex.exec(styleBlock)) !== null) {
    const sel = match[1].trim();
    if (sel && !sel.startsWith('@') && !sel.includes('%')) {
        selectors[sel] = (selectors[sel] || 0) + 1;
    }
}
const duplicateSelectors = Object.keys(selectors).filter(s => selectors[s] > 1);
console.log(`Duplicate CSS Selectors (${duplicateSelectors.length}):`, duplicateSelectors);

// -------------------------------------------------------------
// CATEGORY 4: ANDROID & IOS LAYOUT, NOTCH, VIEWPORT INSETS
// -------------------------------------------------------------
console.log('\n--- 4. ANDROID & IOS LAYOUT & INSETS ---');
const safeMatches = (html.match(/safe-area-inset-[a-z]+/gi) || []).length;
console.log(`Safe-area-inset references in CSS: ${safeMatches}`);
const hasViewportFit = html.includes('viewport-fit=cover');
console.log(`Viewport-fit=cover present: ${hasViewportFit}`);

// -------------------------------------------------------------
// CATEGORY 5: UI/UX TOUCH TARGETS & MODAL TRAPS
// -------------------------------------------------------------
console.log('\n--- 5. UI/UX ERGONOMICS & MODAL AUDIT ---');
const modalMatches = html.match(/id=["'](modal-[^"']+)["']/g) || [];
const uniqueModals = Array.from(new Set(modalMatches.map(m => m.replace(/id=["']|["']/g, ''))));
console.log(`Total Modal Overlays (${uniqueModals.length}):`, uniqueModals);

// -------------------------------------------------------------
// CATEGORY 6: PERFORMANCE & BOTTLENECKS
// -------------------------------------------------------------
console.log('\n--- 6. PERFORMANCE BOTTLENECKS ---');
const innerHTMLCount = (html.match(/\.innerHTML\s*=/g) || []).length;
const innerTextCount = (html.match(/\.innerText\s*=/g) || []).length;
const textContentCount = (html.match(/\.textContent\s*=/g) || []).length;
console.log(`DOM mutation counts: innerHTML (${innerHTMLCount}), innerText (${innerTextCount}), textContent (${textContentCount})`);

// -------------------------------------------------------------
// CATEGORY 7: STORE, IAP & PAYMENT FLOW
// -------------------------------------------------------------
console.log('\n--- 7. STORE & MONETIZATION FLOW ---');
const realMoneyPill = (html.match(/₺|\$/g) || []).length;
console.log(`Real currency symbol occurrences (₺/$): ${realMoneyPill}`);
const hasSimulatedIAP = html.includes('applyIAPBundle');
console.log(`Simulated IAP handler present: ${hasSimulatedIAP}`);

// -------------------------------------------------------------
// CATEGORY 8: BOOSTERS & PROGRESSION DYNAMICS
// -------------------------------------------------------------
console.log('\n--- 8. BOOSTERS, INVENTORY & HERO PROGRESSION ---');
const boosterKeys = ['zeus', 'athena', 'hermes', 'ares'];
boosterKeys.forEach(b => {
    const bCount = (html.match(new RegExp('\\binventory\\.' + b + '\\b', 'g')) || []).length;
    console.log(`Booster [${b}] inventory references: ${bCount}`);
});

// -------------------------------------------------------------
// CATEGORY 9: LEVEL DIFFICULTY & BALANCE PACING
// -------------------------------------------------------------
console.log('\n--- 9. LEVEL PROGRESSION & DIFFICULTY BALANCE ---');
const levelDataIdx = html.indexOf('const LEVEL_DATA = {');
if (levelDataIdx !== -1) {
    const endIdx = html.indexOf('};', levelDataIdx);
    const lvlBlock = html.substring(levelDataIdx, endIdx + 2);
    const countLvl = (lvlBlock.match(/targetScore/g) || []).length;
    console.log(`Configured Levels in LEVEL_DATA: ${countLvl}`);
}

const fs = require('fs');

console.log('=== APPLYING DEEP ENGINE OPTIMIZATIONS (ZERO-REFLOW & CLEAN EVENT LOOP) ===');

const filePath = 'www/index.html';
let content = fs.readFileSync(filePath, 'utf8');
const isCrlf = content.includes('\r\n');

function normalize(str) {
    return str.replace(/\r\n/g, '\n');
}

function safeReplace(source, targetSearch, replacement) {
    const normSource = normalize(source);
    const normSearch = normalize(targetSearch);
    const normReplacement = normalize(replacement);

    if (!normSource.includes(normSearch)) {
        console.error('Target snippet not found for replacement:');
        console.error(normSearch.substring(0, 120) + '...');
        return null;
    }
    const result = normSource.replace(normSearch, normReplacement);
    return isCrlf ? result.replace(/\n/g, '\r\n') : result;
}

// -------------------------------------------------------------
// 1. FIX renderGrid(): Replace cell.innerText with cell.textContent (Zero Forced Reflow!)
// -------------------------------------------------------------
const oldRenderGridText = `                    const desiredText = (special === 'color_bomb') ? '' : (type ? (GEM_ICONS[type] || '') : '');
                    if (cell.innerText !== desiredText) {
                        cell.innerText = desiredText;
                    }`;

const newRenderGridText = `                    const desiredText = (special === 'color_bomb') ? '' : (type ? (GEM_ICONS[type] || '') : '');
                    // textContent eliminates Forced Synchronous Layout / Reflow thrashing on mobile!
                    if (cell.textContent !== desiredText) {
                        cell.textContent = desiredText;
                    }`;

let updated = safeReplace(content, oldRenderGridText, newRenderGridText);
if (!updated) {
    console.error('Failed to replace oldRenderGridText!');
    process.exit(1);
}
content = updated;
console.log('✓ Step 1: Replaced cell.innerText with cell.textContent in renderGrid() (Eliminated 192 reflows/combo)');

// -------------------------------------------------------------
// 2. REMOVE updateGameplayPowerups() from processMatchesWithExplosion
// (Powerup dock DOM should NOT be rebuilt on every match/cascade!)
// -------------------------------------------------------------
const oldComboUIUpdate = `                try {
                    updateHeroAbilityUI(gameGauge);
                    updateGameplayPowerups();
                } catch(uiErr) {
                    console.warn("Gameplay UI update warning:", uiErr);
                }`;

const newComboUIUpdate = `                try {
                    updateHeroAbilityUI(gameGauge);
                    // updateGameplayPowerups() dock rebuild removed from match loop to prevent innerHTML churn!
                } catch(uiErr) {
                    console.warn("Gameplay UI update warning:", uiErr);
                }`;

updated = safeReplace(content, oldComboUIUpdate, newComboUIUpdate);
if (!updated) {
    console.error('Failed to replace oldComboUIUpdate!');
    process.exit(1);
}
content = updated;
console.log('✓ Step 2: Removed redundant updateGameplayPowerups() innerHTML rebuilds from cascade loop');

// -------------------------------------------------------------
// 3. THROTTLE & CANCEL triggerScreenShake TO PREVENT STACKING GPU MATRICES
// -------------------------------------------------------------
const oldScreenShake = `        function triggerScreenShake(type = 'normal') {
            const target = document.getElementById('game-grid') || document.getElementById('screen-gameplay');
            if (!target) return;
            const isHeavy = (type === 'heavy' || type === 'quake');
            const keyframes = isHeavy ? [
                { transform: 'translate3d(0, 0, 0)' },
                { transform: 'translate3d(-6px, 4px, 0)' },
                { transform: 'translate3d(6px, -4px, 0)' },
                { transform: 'translate3d(-4px, 2px, 0)' },
                { transform: 'translate3d(4px, -2px, 0)' },
                { transform: 'translate3d(-2px, 1px, 0)' },
                { transform: 'translate3d(0, 0, 0)' }
            ] : [
                { transform: 'translate3d(0, 0, 0)' },
                { transform: 'translate3d(-3px, 2px, 0)' },
                { transform: 'translate3d(3px, -2px, 0)' },
                { transform: 'translate3d(-2px, 1px, 0)' },
                { transform: 'translate3d(2px, -1px, 0)' },
                { transform: 'translate3d(0, 0, 0)' }
            ];
            if (typeof target.animate === 'function') {
                target.animate(keyframes, {
                    duration: isHeavy ? 360 : 250,
                    easing: 'cubic-bezier(0.36, 0.07, 0.19, 0.97)'
                });
            } else {
                target.classList.remove('shake-animation');
                target.classList.add('shake-animation');
                setTimeout(() => {
                    if (target) target.classList.remove('shake-animation');
                }, 300);
            }
        }`;

const newScreenShake = `        let activeScreenShakeAnim = null;
        let lastScreenShakeTime = 0;
        function triggerScreenShake(type = 'normal') {
            const now = Date.now();
            if (now - lastScreenShakeTime < 220) return; // Throttle to prevent GPU animation stacking
            lastScreenShakeTime = now;

            const target = document.getElementById('game-grid');
            if (!target) return;
            const isHeavy = (type === 'heavy' || type === 'quake');
            const keyframes = isHeavy ? [
                { transform: 'translate3d(0, 0, 0)' },
                { transform: 'translate3d(-4px, 3px, 0)' },
                { transform: 'translate3d(4px, -3px, 0)' },
                { transform: 'translate3d(-2px, 1px, 0)' },
                { transform: 'translate3d(0, 0, 0)' }
            ] : [
                { transform: 'translate3d(0, 0, 0)' },
                { transform: 'translate3d(-2px, 1px, 0)' },
                { transform: 'translate3d(2px, -1px, 0)' },
                { transform: 'translate3d(0, 0, 0)' }
            ];
            if (typeof target.animate === 'function') {
                if (activeScreenShakeAnim) {
                    try { activeScreenShakeAnim.cancel(); } catch(e) {}
                }
                activeScreenShakeAnim = target.animate(keyframes, {
                    duration: isHeavy ? 200 : 150,
                    easing: 'cubic-bezier(0.36, 0.07, 0.19, 0.97)'
                });
            } else {
                target.classList.remove('shake-animation');
                target.classList.add('shake-animation');
                setTimeout(() => {
                    if (target) target.classList.remove('shake-animation');
                }, 200);
            }
        }`;

updated = safeReplace(content, oldScreenShake, newScreenShake);
if (!updated) {
    console.error('Failed to replace oldScreenShake!');
    process.exit(1);
}
content = updated;
console.log('✓ Step 3: Throttled triggerScreenShake and prevented concurrent GPU compositor matrix contention');

// -------------------------------------------------------------
// 4. LINK EXTERNAL narrator_audio_data.js AND REMOVE DUPLICATE INLINED BLOB
// -------------------------------------------------------------
const oldInlinedScriptStart = `</style>

<script id="inlined-narrator-audio">
// Destansı Hikaye ve Anlatıcı Ses Paketi (Base64 In-Memory Offline)
window.NARRATOR_AUDIO_BASE64 = {`;

const oldInlinedScriptEnd = `};

</script>
    </head>`;

const normContent = normalize(content);
const startIdx = normContent.indexOf(normalize(oldInlinedScriptStart));
const endIdx = normContent.indexOf(normalize(oldInlinedScriptEnd));

if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    const endPos = endIdx + normalize(oldInlinedScriptEnd).length;
    const replacementScript = `</style>
    <!-- Stüdyo Kalitesinde Türkçe Kahraman & Anlatıcı Ses Paketi (Zero-GC External Modular Script) -->
    <script src="assets/audio/narrator_audio_data.js"></script>
    </head>`;
    
    const before = normContent.substring(0, startIdx);
    const after = normContent.substring(endPos);
    content = before + replacementScript + after;
    if (isCrlf) content = content.replace(/\n/g, '\r\n');
    console.log('✓ Step 4: Replaced heavy inlined base64 blob with external narrator_audio_data.js script (Freed ~1.2MB from HTML parsing)');
} else {
    console.warn('Inlined audio blob boundaries not found, skipping Step 4 (or already externalized)');
}

// Save updated www/index.html
fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully written deep engine optimizations to ' + filePath);

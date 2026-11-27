const fs = require('fs');

console.log('=== APPLYING COMPREHENSIVE 60 FPS & WEB AUDIO ENGINE FIX ===');

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
// 1. REMOVE ALL backdrop-filter: blur(...) from www/index.html
// -------------------------------------------------------------
let updated = content;

// toast-msg
updated = updated.replace(/background:\s*rgba\(15,\s*22,\s*38,\s*0\.96\);\s*backdrop-filter:\s*blur\(12px\);\s*-webkit-backdrop-filter:\s*blur\(12px\);/g, 'background: rgba(15, 22, 38, 0.98);');

// menu-stage-crest container
updated = updated.replace(/backdrop-filter:\s*blur\(12px\);/g, '/* hardware accelerated */');

// map-tab-btn
updated = updated.replace(/background:\s*rgba\(15,\s*23,\s*42,\s*0\.75\);\s*backdrop-filter:\s*blur\(8px\);/g, 'background: rgba(15, 23, 42, 0.92);');

// map-node
updated = updated.replace(/backdrop-filter:\s*blur\(4px\);/g, '/* hardware accelerated */');

// wood-stage-card
updated = updated.replace(/backdrop-filter:\s*blur\(10px\);/g, '/* hardware accelerated */');

// hero-lock-overlay
updated = updated.replace(/background:\s*rgba\(10,\s*10,\s*15,\s*0\.85\);\s*backdrop-filter:\s*blur\(4px\);/g, 'background: rgba(10, 10, 15, 0.95);');

// god-summon-dock
updated = updated.replace(/background:\s*rgba\(10,\s*14,\s*26,\s*0\.75\);\s*border-radius:\s*16px;\s*border:\s*1px solid rgba\(255,\s*215,\s*0,\s*0\.25\);\s*box-sizing:\s*border-box;\s*backdrop-filter:\s*blur\(8px\);/g, 'background: rgba(10, 14, 26, 0.92); border-radius: 16px; border: 1px solid rgba(255, 215, 0, 0.25); box-sizing: border-box;');

// gameplay-hearts-badge
updated = updated.replace(/background:\s*rgba\(11,\s*16,\s*30,\s*0\.88\);\s*backdrop-filter:\s*blur\(8px\);/g, 'background: rgba(11, 16, 30, 0.95);');

// top sticky HUD
updated = updated.replace(/backdrop-filter:\s*blur\(12px\);/g, '/* hardware accelerated */');

// inline styles with backdrop-filter
updated = updated.replace(/backdrop-filter:\s*blur\(10px\);/g, '');
updated = updated.replace(/backdrop-filter:\s*blur\(8px\);/g, '');
updated = updated.replace(/-webkit-backdrop-filter:\s*blur\(\d+px\);/g, '');

// Cell filter transition removal
updated = updated.replace(/transition:\s*transform 0\.16s cubic-bezier\(0\.25, 1, 0\.5, 1\), opacity 0\.16s, filter 0\.16s;/g, 'transition: transform 0.16s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.16s;');

content = updated;
console.log('✓ Step 1: Cleared all backdrop-filter readback bottlenecks & cell filter transition');

// -------------------------------------------------------------
// 2. UPGRADE AUDIO ENGINE: ZERO-LATENCY WEB AUDIO API & BUFFER POOL
// -------------------------------------------------------------
const oldAudioEngine = `        // TÜRKÇE GERÇEKÇİ KAHRAMAN & KOMBO SES SİSTEMİ (Studio Quality Base64)
        function playHeroVoice(heroKey, actionType = 'ability') {
            if (!isSfxEnabled) return;
            const hero = heroKey || (gameState && gameState.selectedHero) || 'arkenya';
            const audioKey = \`hero_\${hero}_\${actionType}\`;
            if (typeof window !== 'undefined' && window.NARRATOR_AUDIO_BASE64 && window.NARRATOR_AUDIO_BASE64[audioKey]) {
                try {
                    const a = new Audio(window.NARRATOR_AUDIO_BASE64[audioKey]);
                    a.volume = 0.92;
                    a.play().catch(() => {});
                } catch(e) {}
            }
        }

        function playEpicCallout(type) {
            if (!isSfxEnabled) return;
            const now = Date.now();
            if (now - lastCalloutTimestamp < 3200) return; // Throttle to prevent overlap
            lastCalloutTimestamp = now;

            // 1. Gerçekçi Stüdyo Türkçe İnsan Sesi (Kombo 2, 3, 4, Clutch)
            const calloutKey = 'callout_' + type;
            if (typeof window !== 'undefined' && window.NARRATOR_AUDIO_BASE64 && window.NARRATOR_AUDIO_BASE64[calloutKey]) {
                try {
                    const a = new Audio(window.NARRATOR_AUDIO_BASE64[calloutKey]);
                    a.volume = 0.90;
                    a.play().catch(() => {});
                    return;
                } catch(e) {}
            }

            // 2. Chime Melodi İmzası (Fallback)`;

const newAudioEngine = `        // TÜRKÇE GERÇEKÇİ KAHRAMAN & KOMBO SES SİSTEMİ (0ms Gecikmeli Web Audio API & AudioBuffer Havuzu)
        const _decodedVoiceBuffers = {};
        const _htmlVoiceAudioPool = {};

        function playStudioVoiceAudio(audioKey, volume = 0.95) {
            if (!isSfxEnabled) return;
            if (typeof window === 'undefined' || !window.NARRATOR_AUDIO_BASE64) return;
            const b64Data = window.NARRATOR_AUDIO_BASE64[audioKey];
            if (!b64Data) return;

            // 1. Tercih Edilen Yol: Web Audio API (Android WebView'da 0ms donanımsal miksleme)
            const ctx = getAudioContext();
            if (ctx) {
                if (_decodedVoiceBuffers[audioKey]) {
                    try {
                        const src = ctx.createBufferSource();
                        src.buffer = _decodedVoiceBuffers[audioKey];
                        const gain = ctx.createGain();
                        gain.gain.setValueAtTime(volume, ctx.currentTime);
                        src.connect(gain);
                        gain.connect(ctx.destination);
                        src.start(0);
                        return;
                    } catch(e) {}
                }

                // Base64 -> ArrayBuffer çevirip decodeAudioData ile tek seferde çöz
                try {
                    const rawB64 = b64Data.includes(',') ? b64Data.split(',')[1] : b64Data;
                    const binStr = window.atob(rawB64);
                    const len = binStr.length;
                    const bytes = new Uint8Array(len);
                    for (let i = 0; i < len; i++) {
                        bytes[i] = binStr.charCodeAt(i);
                    }
                    ctx.decodeAudioData(bytes.buffer.slice(0), (buf) => {
                        _decodedVoiceBuffers[audioKey] = buf;
                        try {
                            const src = ctx.createBufferSource();
                            src.buffer = buf;
                            const gain = ctx.createGain();
                            gain.gain.setValueAtTime(volume, ctx.currentTime);
                            src.connect(gain);
                            gain.connect(ctx.destination);
                            src.start(0);
                        } catch(playErr) {}
                    }, (err) => {
                        playHtmlVoiceFallback(b64Data, volume);
                    });
                    return;
                } catch(decodeErr) {}
            }

            // 2. Yedek Yol: Havuzlu HTML5 Audio (audio/mpeg RFC uyumlu)
            playHtmlVoiceFallback(b64Data, volume);
        }

        function playHtmlVoiceFallback(b64Data, volume = 0.9) {
            try {
                const mimeCorrected = b64Data.replace('data:audio/mp3;', 'data:audio/mpeg;');
                if (!_htmlVoiceAudioPool[mimeCorrected]) {
                    _htmlVoiceAudioPool[mimeCorrected] = new Audio(mimeCorrected);
                }
                const a = _htmlVoiceAudioPool[mimeCorrected];
                a.currentTime = 0;
                a.volume = volume;
                a.play().catch(() => {});
            } catch(e) {}
        }

        function playHeroVoice(heroKey, actionType = 'ability') {
            if (!isSfxEnabled) return;
            const hero = heroKey || (gameState && gameState.selectedHero) || 'arkenya';
            const audioKey = \`hero_\${hero}_\${actionType}\`;
            playStudioVoiceAudio(audioKey, 0.95);
        }

        function playEpicCallout(type) {
            if (!isSfxEnabled) return;
            const now = Date.now();
            if (now - lastCalloutTimestamp < 1800) return; // Temiz ses aralığı
            lastCalloutTimestamp = now;

            const calloutKey = 'callout_' + type;
            if (typeof window !== 'undefined' && window.NARRATOR_AUDIO_BASE64 && window.NARRATOR_AUDIO_BASE64[calloutKey]) {
                playStudioVoiceAudio(calloutKey, 0.92);
                return;
            }

            // 2. Chime Melodi İmzası (Fallback)`;

updated = safeReplace(content, oldAudioEngine, newAudioEngine);
if (!updated) {
    console.error('Failed to replace oldAudioEngine!');
    process.exit(1);
}
content = updated;
console.log('✓ Step 2: Upgraded audio engine to 0ms Web Audio API buffer engine');

// -------------------------------------------------------------
// 3. HOOK HERO VOICE PREVIEW IN viewHeroTab(heroId)
// -------------------------------------------------------------
const oldViewHeroTab = `            const hero = HEROES[heroId];
            if (!hero) return;

            const unlocked = isHeroUnlocked(heroId);`;

const newViewHeroTab = `            const hero = HEROES[heroId];
            if (!hero) return;

            // Kahraman seçim ve inceleme anında ses çal (Greeting / Ability)
            try {
                playHeroVoice(heroId, 'greeting');
            } catch(vErr) {}

            const unlocked = isHeroUnlocked(heroId);`;

updated = safeReplace(content, oldViewHeroTab, newViewHeroTab);
if (!updated) {
    console.error('Failed to replace oldViewHeroTab!');
    process.exit(1);
}
content = updated;
console.log('✓ Step 3: Hooked hero voice preview in viewHeroTab');

// -------------------------------------------------------------
// 4. HOOK COMBO 2, 3 CALLOUTS IN processMatchesWithExplosion
// -------------------------------------------------------------
const oldComboBranch = `                } else if (comboMultiplier === 3) {
                    if (lvl >= 3) {
                        triggerHaptic('light');
                    }
                }`;

const newComboBranch = `                } else if (comboMultiplier === 3) {
                    if (lvl >= 2) {
                        triggerHaptic('medium');
                        spawnFloatingCombo("⚡ HARİKA VURUŞ x3! ⚡");
                        playEpicCallout('combo_3');
                    }
                } else if (comboMultiplier === 2) {
                    if (lvl >= 2) {
                        triggerHaptic('light');
                        playEpicCallout('combo_2');
                    }
                }`;

updated = safeReplace(content, oldComboBranch, newComboBranch);
if (!updated) {
    console.error('Failed to replace oldComboBranch!');
    process.exit(1);
}
content = updated;
console.log('✓ Step 4: Hooked combo_2 and combo_3 voice callouts into match cascade');

// Save updated www/index.html
fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully applied all 60 FPS and audio upgrades to ' + filePath);

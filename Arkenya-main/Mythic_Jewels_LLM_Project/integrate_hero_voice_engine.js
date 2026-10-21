const fs = require('fs');

console.log('=== INTEGRATING TURKISH HERO VOICES & EPIC AUDIO ENGINE ===');

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

// 1. UPDATE playEpicCallout to use compiled studio Base64 voice lines with Web Audio fallback
const oldEpicCallout = `        function playEpicCallout(type) {
            if (!isSfxEnabled) return;
            const now = Date.now();
            if (now - lastCalloutTimestamp < 3500) return; // Throttle to prevent overlap
            lastCalloutTimestamp = now;

            const lines = EPIC_CALLOUT_LINES[type];
            if (!lines || !lines.length) return;
            const line = lines[Math.floor(Math.random() * lines.length)];

            // 1. Mythological triumphant chime signature
            try {
                const ctx = getAudioContext();
                if (ctx) {
                    const freqs = (type === 'victory') ? [523.25, 659.25, 783.99, 1046.50] :
                                  (type === 'combo_4') ? [440.00, 554.37, 659.25, 880.00] :
                                  (type === 'clutch') ? [293.66, 349.23, 440.00] :
                                  [392.00, 493.88, 587.33];
                    freqs.forEach((f, idx) => {
                        const osc = ctx.createOscillator();
                        const g = ctx.createGain();
                        osc.type = 'triangle';
                        const t = ctx.currentTime + (idx * 0.08);
                        osc.frequency.setValueAtTime(f, t);
                        g.gain.setValueAtTime(0.001, t);
                        g.gain.exponentialRampToValueAtTime(0.08, t + 0.04);
                        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);
                        osc.connect(g);
                        g.connect(ctx.destination);
                        osc.start(t);
                        osc.stop(t + 0.48);
                    });
                }
            } catch(e) {}

            // 2. Spoken speech: Android WebView IPC kilitlenmesini önlemek için mobil cihazlarda Web Audio osilatörleri kullanılır
            const isNativeMobile = !!(window.Capacitor || (window.navigator && /android|iphone|ipad|ipod/i.test(navigator.userAgent)));
            if (!isNativeMobile && typeof window !== 'undefined' && 'speechSynthesis' in window) {
                try {
                    const u = new SpeechSynthesisUtterance(line);
                    u.lang = 'tr-TR';
                    u.rate = 0.88;
                    u.pitch = 0.82;
                    u.volume = 0.8;
                    const voices = window.speechSynthesis.getVoices();
                    const trVoice = voices.find(v => v.lang && (v.lang === 'tr-TR' || v.lang.toLowerCase().startsWith('tr')));
                    if (trVoice) u.voice = trVoice;
                    window.speechSynthesis.speak(u);
                } catch(e) {}
            }
        }`;

const newEpicCallout = `        // TÜRKÇE GERÇEKÇİ KAHRAMAN & KOMBO SES SİSTEMİ (Studio Quality Base64)
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

            // 2. Chime Melodi İmzası (Fallback)
            try {
                const ctx = getAudioContext();
                if (ctx) {
                    const freqs = (type === 'victory') ? [523.25, 659.25, 783.99, 1046.50] :
                                  (type === 'combo_4') ? [440.00, 554.37, 659.25, 880.00] :
                                  (type === 'clutch') ? [293.66, 349.23, 440.00] :
                                  [392.00, 493.88, 587.33];
                    freqs.forEach((f, idx) => {
                        const osc = ctx.createOscillator();
                        const g = ctx.createGain();
                        osc.type = 'triangle';
                        const t = ctx.currentTime + (idx * 0.08);
                        osc.frequency.setValueAtTime(f, t);
                        g.gain.setValueAtTime(0.001, t);
                        g.gain.exponentialRampToValueAtTime(0.08, t + 0.04);
                        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);
                        osc.connect(g);
                        g.connect(ctx.destination);
                        osc.start(t);
                        osc.stop(t + 0.48);
                    });
                }
            } catch(e) {}
        }`;

let updated = safeReplace(content, oldEpicCallout, newEpicCallout);
if (!updated) {
    console.error('Failed to replace oldEpicCallout!');
    process.exit(1);
}
content = updated;
console.log('✓ Step 1: Integrated playHeroVoice and studio callout playback');

// 2. Hook playHeroVoice into useAbility()
const oldUseAbilityStart = `            gameGauge = 0;
            updateHeroAbilityUI(0);
            triggerHaptic('heavy');`;

const newUseAbilityStart = `            gameGauge = 0;
            updateHeroAbilityUI(0);
            triggerHaptic('heavy');
            playHeroVoice(gameState.selectedHero, 'ability');`;

updated = safeReplace(content, oldUseAbilityStart, newUseAbilityStart);
if (!updated) {
    console.error('Failed to replace oldUseAbilityStart!');
    process.exit(1);
}
content = updated;
console.log('✓ Step 2: Hooked playHeroVoice into useAbility');

// 3. Hook playHeroVoice into showVictory()
const oldVictoryCallout = `            document.getElementById('modal-victory').classList.add('active');
            playEpicCallout('victory');`;

const newVictoryCallout = `            document.getElementById('modal-victory').classList.add('active');
            playHeroVoice(gameState.selectedHero, 'victory');
            playEpicCallout('victory');`;

updated = safeReplace(content, oldVictoryCallout, newVictoryCallout);
if (!updated) {
    console.error('Failed to replace oldVictoryCallout!');
    process.exit(1);
}
content = updated;
console.log('✓ Step 3: Hooked hero victory line into showVictory');

// Save updated www/index.html
fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully written hero voice integration to ' + filePath);

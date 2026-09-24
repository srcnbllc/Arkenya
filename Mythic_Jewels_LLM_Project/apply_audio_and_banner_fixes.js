const fs = require('fs');

console.log('=== APPLYING AUDIO FIXES AND MAIN MENU STORY BANNER REMOVAL ===');

let html = fs.readFileSync('www/index.html', 'utf8');
const isCrlf = html.includes('\r\n');

function clean(str) {
    return str.replace(/\r\n/g, '\n');
}

function replaceBlock(targetHtml, searchStr, replaceStr) {
    const cleanHtml = clean(targetHtml);
    const cleanSearch = clean(searchStr);
    const cleanReplace = clean(replaceStr);
    
    if (!cleanHtml.includes(cleanSearch)) {
        return null;
    }
    const result = cleanHtml.replace(cleanSearch, cleanReplace);
    return isCrlf ? result.replace(/\n/g, '\r\n') : result;
}

// 1. REMOVE MAIN MENU "KADİM DESTANI DİNLE" BANNER
const oldBannerHtml = `                    <!-- ALT NAVİGASYON (3 BÜYÜK MİTOLOJİK KART) -->
                    <!-- MİTOLOJİK TÜRKÇE MASALCI SESLENDİRME BANNERI -->
                    <div class="mainmenu-story-banner" id="mainmenu-story-banner" onclick="toggleMainMenuStoryNarration()" title="Kadim Masalı Dinle">
                        <div class="story-banner-inner">
                            <span class="story-banner-icon" id="mainmenu-story-icon">📜</span>
                            <div class="story-banner-text">
                                <span class="story-banner-title" id="mainmenu-story-title">KADİM DESTANI DİNLE</span>
                                <span class="story-banner-sub">Mitolojik Türkçe Masalcı & Olimpos Efsanesi</span>
                            </div>
                            <div class="story-banner-soundwave" id="mainmenu-story-wave" style="display: none;">
                                <span></span><span></span><span></span><span></span>
                            </div>
                            <span class="story-banner-btn-play" id="mainmenu-story-playbtn">▶ DİNLE</span>
                        </div>
                    </div>

                    <div class="mainmenu-bottom-cards-row">`;

const newBannerHtml = `                    <!-- ALT NAVİGASYON (3 BÜYÜK MİTOLOJİK KART) -->
                    <div class="mainmenu-bottom-cards-row">`;

let nextHtml = replaceBlock(html, oldBannerHtml, newBannerHtml);
if (!nextHtml) {
    console.error('FAIL: oldBannerHtml not found!');
    process.exit(1);
}
html = nextHtml;
console.log('✓ Step 1: Removed main menu "Kadim Destanı Dinle" banner');

// 2. FIX sfxLaser AND sfxBomb TO USE getAudioContext() AND ENHANCE EXPLOSION SOUNDS
const oldLaserAndBomb = `        // ENHANCED SFX FOR SPECIAL GEMS
        function sfxLaser() {
            try {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(880, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.3);
                gain.gain.setValueAtTime(0.3, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
                osc.start();
                osc.stop(ctx.currentTime + 0.3);
            } catch(e) {}
        }

        function sfxBomb() {
            try {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(140, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.45);
                gain.gain.setValueAtTime(0.4, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);
                osc.start();
                osc.stop(ctx.currentTime + 0.45);
            } catch(e) {}
        }`;

const newLaserAndBomb = `        // ENHANCED SFX FOR SPECIAL GEMS & EXPLOSIONS
        function sfxLaser() {
            if (!isSfxEnabled) return;
            try {
                const ctx = getAudioContext();
                if (!ctx) return;
                if (ctx.state === 'suspended') ctx.resume().catch(() => {});
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(920, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(130, ctx.currentTime + 0.28);
                gain.gain.setValueAtTime(0.3, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.28);
            } catch(e) {}
        }

        function sfxBomb() {
            if (!isSfxEnabled) return;
            try {
                const ctx = getAudioContext();
                if (!ctx) return;
                if (ctx.state === 'suspended') ctx.resume().catch(() => {});

                // Deep booming sub-bass punch
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.type = 'sine';
                osc.frequency.setValueAtTime(180, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(28, ctx.currentTime + 0.48);
                gain.gain.setValueAtTime(0.55, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.48);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.48);

                // Explosive thunder crackle
                const osc2 = ctx.createOscillator();
                const gain2 = ctx.createGain();
                osc2.connect(gain2);
                gain2.connect(ctx.destination);
                osc2.type = 'triangle';
                osc2.frequency.setValueAtTime(240, ctx.currentTime);
                osc2.frequency.exponentialRampToValueAtTime(42, ctx.currentTime + 0.32);
                gain2.gain.setValueAtTime(0.35, ctx.currentTime);
                gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.32);
                osc2.start(ctx.currentTime);
                osc2.stop(ctx.currentTime + 0.32);
            } catch(e) {}
        }

        function sfxGemPop(comboMultiplier = 1, gemCount = 3) {
            if (!isSfxEnabled) return;
            try {
                const ctx = getAudioContext();
                if (!ctx) return;
                if (ctx.state === 'suspended') ctx.resume().catch(() => {});

                // Crisp snappy crystal shattering / pop transient
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.type = 'triangle';
                const basePitch = 460 + Math.min(comboMultiplier * 75, 650);
                osc.frequency.setValueAtTime(basePitch, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.12);

                const vol = Math.min(0.32, 0.18 + (gemCount * 0.02));
                gain.gain.setValueAtTime(vol, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);

                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.14);

                // Ascending pentatonic melody cascade
                sfxMatchCascade(comboMultiplier);
            } catch(e) {}
        }`;

nextHtml = replaceBlock(html, oldLaserAndBomb, newLaserAndBomb);
if (!nextHtml) {
    console.error('FAIL: oldLaserAndBomb not found!');
    process.exit(1);
}
html = nextHtml;
console.log('✓ Step 2: Upgraded sfxLaser & sfxBomb with singleton AudioContext and added sfxGemPop');

// 3. HOOK sfxGemPop INTO processMatchesWithExplosion
const oldPopScoring = `            // Scoring with Multiplier & Feedback
            const baseEarned = finalPopArray.length * 60;
            const earned = baseEarned * comboMultiplier;
            gameScore += earned;`;

const newPopScoring = `            // Scoring with Multiplier & Feedback
            const baseEarned = finalPopArray.length * 60;
            const earned = baseEarned * comboMultiplier;
            gameScore += earned;

            // Trigger In-Game Gem Pop & Match Explosion SFX
            sfxGemPop(comboMultiplier, finalPopArray.length);`;

nextHtml = replaceBlock(html, oldPopScoring, newPopScoring);
if (!nextHtml) {
    console.error('FAIL: oldPopScoring not found!');
    process.exit(1);
}
html = nextHtml;
console.log('✓ Step 3: Hooked sfxGemPop into processMatchesWithExplosion');

// 4. ADD getPlayableAudioUrl HELPER AND UPGRADE togglePreviewStoryAudio FOR 100% RELIABLE PLAYBACK
const oldPreviewAudioCode = `            stopPreviewStoryAudio();

            const audioKey = saga.audioKey;
            let audioSrc = saga.audioFile;
            if (typeof window.NARRATOR_AUDIO_BASE64 !== 'undefined' && window.NARRATOR_AUDIO_BASE64[audioKey]) {
                audioSrc = window.NARRATOR_AUDIO_BASE64[audioKey];
            }

            try {
                previewStoryAudio = new Audio(audioSrc);
                previewStoryAudio.volume = (typeof sfxVolume !== 'undefined') ? sfxVolume : 1.0;
                previewStoryAudio.onended = () => {
                    stopPreviewStoryAudio();
                };

                startStoryAtmosphereDrone();
                duckBackgroundMusic(true);

                isPreviewStoryPlaying = true; window.isPreviewStoryPlaying = true;
                const btnText = document.getElementById('preview-story-text');
                const btnIcon = document.getElementById('preview-story-icon');
                const wave = document.getElementById('preview-soundwave');
                if (btnText) { btnText.textContent = 'DURDUR'; btnText.innerText = 'DURDUR'; }
                if (btnIcon) { btnIcon.textContent = '⏸️'; btnIcon.innerText = '⏸️'; }
                if (wave) wave.style.display = 'inline-flex';

                const playPromise = previewStoryAudio.play();
                if (playPromise && playPromise.catch) {
                    playPromise.catch(err => {
                        console.warn("Audio play blocked or unavailable, falling back to TTS:", err);
                        playTTSFallback(saga.storyText);
                    });
                }
            } catch(err) {
                console.error("Failed to play preview story audio:", err);
                stopPreviewStoryAudio();
            }`;

const newPreviewAudioCode = `            stopPreviewStoryAudio();

            // Resume audio context if needed
            const audioCtx = getAudioContext();
            if (audioCtx && audioCtx.state === 'suspended') {
                audioCtx.resume().catch(() => {});
            }

            const audioKey = saga.audioKey;
            let audioSrc = saga.audioFile;
            if (typeof window.NARRATOR_AUDIO_BASE64 !== 'undefined' && window.NARRATOR_AUDIO_BASE64[audioKey]) {
                audioSrc = window.NARRATOR_AUDIO_BASE64[audioKey];
            }

            const playableUrl = getPlayableAudioUrl(audioSrc) || audioSrc;

            try {
                previewStoryAudio = new Audio();
                previewStoryAudio.src = playableUrl;
                previewStoryAudio.volume = (typeof sfxVolume !== 'undefined') ? sfxVolume : 1.0;
                previewStoryAudio.onended = () => {
                    stopPreviewStoryAudio();
                };
                previewStoryAudio.onerror = (err) => {
                    console.warn("Audio playback error, trying direct relative file:", err);
                    if (saga.audioFile && previewStoryAudio.src !== saga.audioFile) {
                        previewStoryAudio.src = saga.audioFile;
                        previewStoryAudio.play().catch(() => {
                            stopPreviewStoryAudio();
                        });
                    } else {
                        stopPreviewStoryAudio();
                    }
                };

                startStoryAtmosphereDrone();
                duckBackgroundMusic(true);

                isPreviewStoryPlaying = true; window.isPreviewStoryPlaying = true;
                const btnText = document.getElementById('preview-story-text');
                const btnIcon = document.getElementById('preview-story-icon');
                const wave = document.getElementById('preview-soundwave');
                if (btnText) { btnText.textContent = 'DURDUR'; btnText.innerText = 'DURDUR'; }
                if (btnIcon) { btnIcon.textContent = '⏸️'; btnIcon.innerText = '⏸️'; }
                if (wave) wave.style.display = 'inline-flex';

                const playPromise = previewStoryAudio.play();
                if (playPromise && playPromise.catch) {
                    playPromise.catch(err => {
                        console.warn("Audio play promise catch:", err);
                        if (saga.audioFile) {
                            previewStoryAudio.src = saga.audioFile;
                            previewStoryAudio.play().catch(() => {
                                stopPreviewStoryAudio();
                            });
                        } else {
                            stopPreviewStoryAudio();
                        }
                    });
                }
            } catch(err) {
                console.error("Failed to play preview story audio:", err);
                stopPreviewStoryAudio();
            }`;

nextHtml = replaceBlock(html, oldPreviewAudioCode, newPreviewAudioCode);
if (!nextHtml) {
    console.error('FAIL: oldPreviewAudioCode not found!');
    process.exit(1);
}
html = nextHtml;
console.log('✓ Step 4: Upgraded togglePreviewStoryAudio with Blob URL streaming and robust recovery');

// 5. INSERT getPlayableAudioUrl HELPER
const oldGetThemeSaga = `        function getThemeSagaForLevel(levelId) {`;

const newGetThemeSaga = `        const _blobUrlCache = {};
        function getPlayableAudioUrl(rawSrcOrKey) {
            if (!rawSrcOrKey) return null;
            if (_blobUrlCache[rawSrcOrKey]) return _blobUrlCache[rawSrcOrKey];

            let base64Data = null;
            if (typeof window !== 'undefined' && window.NARRATOR_AUDIO_BASE64) {
                if (window.NARRATOR_AUDIO_BASE64[rawSrcOrKey]) {
                    base64Data = window.NARRATOR_AUDIO_BASE64[rawSrcOrKey];
                }
            }
            if (rawSrcOrKey.startsWith && rawSrcOrKey.startsWith('data:audio')) {
                base64Data = rawSrcOrKey;
            }

            if (base64Data) {
                try {
                    if (typeof Blob !== 'undefined' && typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function') {
                        const pureB64 = base64Data.replace(/^data:[^;]+;base64,/, '');
                        const byteChars = atob(pureB64);
                        const byteNums = new Uint8Array(byteChars.length);
                        for (let i = 0; i < byteChars.length; i++) {
                            byteNums[i] = byteChars.charCodeAt(i);
                        }
                        const blob = new Blob([byteNums], { type: 'audio/mpeg' });
                        const blobUrl = URL.createObjectURL(blob);
                        _blobUrlCache[rawSrcOrKey] = blobUrl;
                        return blobUrl;
                    }
                } catch(e) {
                    console.warn("Blob URL generation error:", e);
                }
                return base64Data;
            }
            return rawSrcOrKey;
        }

        function getThemeSagaForLevel(levelId) {`;

nextHtml = replaceBlock(html, oldGetThemeSaga, newGetThemeSaga);
if (!nextHtml) {
    console.error('FAIL: oldGetThemeSaga not found!');
    process.exit(1);
}
html = nextHtml;
console.log('✓ Step 5: Added getPlayableAudioUrl helper for Base64-to-Blob audio streaming');

// 6. ALSO UPGRADE playStoryVoice (story scroll modal) TO USE getPlayableAudioUrl
const oldPlayStoryVoice = `            const fileToPlay = audioSrcToPlay;`;
const newPlayStoryVoice = `            const fileToPlay = getPlayableAudioUrl(audioSrcToPlay) || audioSrcToPlay;`;

nextHtml = replaceBlock(html, oldPlayStoryVoice, newPlayStoryVoice);
if (!nextHtml) {
    console.error('FAIL: oldPlayStoryVoice not found!');
    process.exit(1);
}
html = nextHtml;
console.log('✓ Step 6: Upgraded playStoryVoice to use getPlayableAudioUrl');

fs.writeFileSync('www/index.html', html, 'utf8');
console.log('SUCCESS: All audio fixes and banner removal applied to www/index.html!');

const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'www', 'index.html');
let content = fs.readFileSync(targetPath, 'utf8');

console.log("=== ENHANCING MYSTICAL DUBBED STORY NARRATOR & SOUNDSCAPE ===");

const oldVoiceBlockRegex = /\/\/\s*---\s*OFFLINE VOICE \/ SPEECH NARRATOR ENGINE\s*---[\s\S]*?function updateNarratorButtonUI\(speaking\) \{[\s\S]*?\}\s*\}/;

const newMysticalNarratorEngine = `// --- OFFLINE MYSTICAL VOICE & DUBBED SOUNDSCAPE ENGINE ---
        let isStoryNarratorSpeaking = false;
        let currentStoryTextToSpeak = "";
        let cachedSpeechVoices = [];
        let mysticDroneNodes = null;

        // Pre-cache voices when speech engine initializes
        if ('speechSynthesis' in window) {
            try {
                cachedSpeechVoices = window.speechSynthesis.getVoices();
                window.speechSynthesis.onvoiceschanged = () => {
                    cachedSpeechVoices = window.speechSynthesis.getVoices();
                };
            } catch(e) {}
        }

        function startMysticalSoundscape() {
            try {
                if (!audioCtx) initAudio();
                if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
                if (!audioCtx) return;

                // Stop any previous drone
                stopMysticalSoundscape();

                const now = audioCtx.currentTime;

                // 1. Deep cinematic sub drone (F minor ancient scale: 87.3 Hz & 130.8 Hz)
                const oscSub = audioCtx.createOscillator();
                const oscHarmonic = audioCtx.createOscillator();
                const filter = audioCtx.createBiquadFilter();
                const droneGain = audioCtx.createGain();

                oscSub.type = 'sine';
                oscSub.frequency.setValueAtTime(87.31, now); // F2
                oscHarmonic.type = 'triangle';
                oscHarmonic.frequency.setValueAtTime(130.81, now); // C3

                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(260, now);

                droneGain.gain.setValueAtTime(0.001, now);
                droneGain.gain.exponentialRampToValueAtTime(0.08, now + 1.2);

                oscSub.connect(filter);
                oscHarmonic.connect(filter);
                filter.connect(droneGain);
                droneGain.connect(audioCtx.destination);

                oscSub.start(now);
                oscHarmonic.start(now);

                // 2. Initial ancient temple bell chime
                [349.23, 523.25, 698.46].forEach((f, i) => {
                    const bellOsc = audioCtx.createOscillator();
                    const bellGain = audioCtx.createGain();
                    bellOsc.type = 'sine';
                    bellOsc.frequency.setValueAtTime(f, now + (i * 0.12));
                    bellGain.gain.setValueAtTime(0.12, now + (i * 0.12));
                    bellGain.gain.exponentialRampToValueAtTime(0.0001, now + (i * 0.12) + 2.5);
                    bellOsc.connect(bellGain);
                    bellGain.connect(audioCtx.destination);
                    bellOsc.start(now + (i * 0.12));
                    bellOsc.stop(now + (i * 0.12) + 2.6);
                });

                mysticDroneNodes = { oscSub, oscHarmonic, droneGain };
            } catch(e) {
                console.log("Mystical soundscape error:", e);
            }
        }

        function stopMysticalSoundscape() {
            if (mysticDroneNodes) {
                try {
                    const { oscSub, oscHarmonic, droneGain } = mysticDroneNodes;
                    if (audioCtx) {
                        droneGain.gain.setValueAtTime(droneGain.gain.value, audioCtx.currentTime);
                        droneGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.6);
                        setTimeout(() => {
                            try { oscSub.stop(); oscHarmonic.stop(); } catch(e) {}
                        }, 650);
                    }
                } catch(e) {}
                mysticDroneNodes = null;
            }
        }

        function playStoryVoice(text) {
            currentStoryTextToSpeak = text;
            startMysticalSoundscape();

            if (!('speechSynthesis' in window)) {
                console.log("SpeechSynthesis not available, playing mystical soundscape ambience.");
                isStoryNarratorSpeaking = true;
                updateNarratorButtonUI(true);
                return;
            }

            try {
                window.speechSynthesis.cancel();

                const cleanText = text.replace(/<[^>]*>/g, '').trim();
                const utterance = new SpeechSynthesisUtterance(cleanText);
                utterance.lang = 'tr-TR';
                utterance.rate = 0.86; // Deep, slow, dramatic mythological storytelling pace
                utterance.pitch = 0.80; // Resonant mystic tone
                utterance.volume = 1.0;

                // Pick best Turkish voice available
                let voices = cachedSpeechVoices.length ? cachedSpeechVoices : window.speechSynthesis.getVoices();
                let trVoice = voices.find(v => v.lang && (v.lang === 'tr-TR' || v.lang.toLowerCase().startsWith('tr')));
                if (trVoice) {
                    utterance.voice = trVoice;
                }

                utterance.onstart = () => {
                    isStoryNarratorSpeaking = true;
                    updateNarratorButtonUI(true);
                };

                utterance.onend = () => {
                    isStoryNarratorSpeaking = false;
                    stopMysticalSoundscape();
                    updateNarratorButtonUI(false);
                };

                utterance.onerror = (err) => {
                    console.log("SpeechSynthesis error:", err);
                    isStoryNarratorSpeaking = false;
                    stopMysticalSoundscape();
                    updateNarratorButtonUI(false);
                };

                window.speechSynthesis.speak(utterance);
            } catch(err) {
                console.log("Speech error:", err);
                isStoryNarratorSpeaking = false;
                stopMysticalSoundscape();
                updateNarratorButtonUI(false);
            }
        }

        function stopStoryVoice() {
            if ('speechSynthesis' in window) {
                try { window.speechSynthesis.cancel(); } catch(e) {}
            }
            stopMysticalSoundscape();
            isStoryNarratorSpeaking = false;
            updateNarratorButtonUI(false);
        }

        function toggleStoryVoice() {
            if (isStoryNarratorSpeaking) {
                stopStoryVoice();
            } else {
                if (currentStoryTextToSpeak) {
                    playStoryVoice(currentStoryTextToSpeak);
                }
            }
        }

        function updateNarratorButtonUI(speaking) {
            const btn = document.getElementById('btn-narrator-toggle');
            if (btn) {
                btn.innerHTML = speaking ? '⏹️ ANLATIMI DURDUR' : '🎙️ MİSTİK ANLATICIYI DİNLE';
                btn.style.background = speaking ? 'linear-gradient(135deg, #e74c3c, #c0392b)' : 'linear-gradient(135deg, #ffd700, #ff9900)';
                btn.style.color = speaking ? '#fff' : '#000';
                btn.style.boxShadow = speaking ? '0 0 20px rgba(231,76,60,0.8)' : '0 0 20px rgba(255,215,0,0.6)';
            }
        }`;

if (oldVoiceBlockRegex.test(content)) {
    content = content.replace(oldVoiceBlockRegex, newMysticalNarratorEngine);
    console.log("PASS: Successfully replaced voice engine with Mystical Dubbed Soundscape Engine!");
} else {
    console.log("FAIL: oldVoiceBlockRegex did not match.");
}

fs.writeFileSync(targetPath, content, 'utf8');
console.log("Updated www/index.html with Mystical Narrator!");

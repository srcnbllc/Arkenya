const fs = require('fs');

console.log("=== INTEGRATING CINEMATIC TUNCEL KURTIZ / LORD OF THE RINGS NARRATION ===");

let html = fs.readFileSync('www/index.html', 'utf8');

// 1. UPDATE BIOME_LORE WITH EPIC TUNCEL KURTIZ LORE & AUDIO PATHS
const newBiomeLore = `        var BIOME_LORE = {
            1: {
                name: "Kristal Vadi",
                chapter: 1,
                levels: "1 - 10",
                icon: "✨",
                hero: "Arkenya & Asterion (Işığın Muhafızları)",
                villain: "Hades'in Öncüleri",
                badge: "BÖLGE 1 • KRİSTAL VADİ",
                title: "IŞIĞIN ŞAFAĞI",
                mechanicTitle: "Saf Eşleştirme & Kaskad:",
                mechanicDesc: "Rahatlatıcı ve akıcı ritim. 3'lü ve 4'lü taşları birleştirerek kadim güçleri uyandır.",
                storyText: "Gözlerini aç evlat... Kristal Vadi burası. Sessizliğe sakın aldanma; her taşın altında uyuyan kadim bir güç var. Üç taşı yan yana getirmek kolaydır... Mesele, fırtına koptuğunda o zinciri kurabilmektir! Hades'in gölgeleri kapıda bekler. Vur taşlara, ışık yayılsın vadinin bağrına!",
                audioFile: "assets/audio/biome_1.mp3",
                bossLevel: 10,
                bossName: "Hades'in Kapı Bekçisi"
            },
            2: {
                name: "Fırtına Kanyonu",
                chapter: 2,
                levels: "11 - 20",
                icon: "⚡",
                hero: "Nyra (Fırtına Avcısı)",
                villain: "Poseidon'un Hortumları",
                badge: "BÖLGE 2 • FIRTINA KANYONU",
                title: "ŞİMŞEK REZONANSI",
                mechanicTitle: "Şimşek Akımı Mekaniği:",
                mechanicDesc: "4'lü ve 5'li eşleşmeler zincirleme elektrik arkı yayarak komşu taşları patlatır.",
                storyText: "Duyuyor musun o rüzgarı yeğen? Fırtına Kanyonu burası! Poseidon öfkesini saldı üzerimize; gök delindi, şimşekler toprağı dövüyor. Hızlı avcı Nyra katıldı safımıza. Şimdi durma zamanı değil; yıldırımı arkana alacaksın ki, karanlık kaçacak delik arasın!",
                audioFile: "assets/audio/biome_2.mp3",
                bossLevel: 20,
                bossName: "Poseidon'un Öfkesi"
            },
            3: {
                name: "Yeraltı Lav Mağarası",
                chapter: 3,
                levels: "21 - 30",
                icon: "🌋",
                hero: "Thalor (Derinliklerin Devi)",
                villain: "Hades ve Obsidyen Muhafızları",
                badge: "BÖLGE 3 • YERALTI MAĞARASI",
                title: "OBSİDYEN VE KOR ATEŞ",
                mechanicTitle: "Obsidyen Zırh Mekaniği:",
                mechanicDesc: "Lav kalkanlı taşlar komşularında eşleşme yapılmadan kırılmaz; taş devi Thalor'un gücünü kullan.",
                storyText: "Yerin yedi kat dibindeyiz şimdi... Burası korkakların değil, yüreği kor ateşle yananların mekanı. Lavlar akıyor önümüzden, taş devi Thalor duruyor yanımızda. Hades kalkan kurmuş obsidyenden... Kır o kalkanı evlat, kır ki yerin dibi bile adaleti görsün!",
                audioFile: "assets/audio/biome_3.mp3",
                bossLevel: 30,
                bossName: "Hades'in Karanlık Tahtı"
            },
            4: {
                name: "Donmuş Titan Geçidi",
                chapter: 4,
                levels: "31 - 40",
                icon: "❄️",
                hero: "Olimpos Kahramanları",
                villain: "Medusa ve Buzul Titanları",
                badge: "BÖLGE 4 • DONMUŞ TİTAN GEÇİDİ",
                title: "BUZUL KİLİDİ",
                mechanicTitle: "Dondurulmuş Taş Mekaniği:",
                mechanicDesc: "Medusa'nın buz bakışıyla donmuş kristaller çift darbeyle veya bomba patlamalarıyla çözülür.",
                storyText: "Nefesin buza kesiyor değil mi? Donmuş Titan Geçidi burası... Medusa'nın soğuk bakışları taş etmiş zamanı. Ama unutma evlat; hiçbir kış sonsuza dek sürmez! İçindeki inancı kaybetmezsen, en sert buzul bile bir tek kıvılcımla erir gider. Yürü zirveye doğru!",
                audioFile: "assets/audio/biome_4.mp3",
                bossLevel: 40,
                bossName: "Medusa ve Buzul Devi"
            },
            5: {
                name: "Olimpos İlahi Zirvesi",
                chapter: 5,
                levels: "41 - 50",
                icon: "👑",
                hero: "Zeus ve Tüm Panteon",
                villain: "Kaos Lordu Kronos",
                badge: "BÖLGE 5 • OLİMPOS ZİRVESİ",
                title: "İLÂHİ ZEUS ÇARPANI",
                mechanicTitle: "x2, x3, x5 İlahi Çarpan:",
                mechanicDesc: "Her kaskadda puan çarpanı katlanır! Ekran Zeus'un altın şimşekleriyle aydınlanır.",
                storyText: "İşte geldik yolun sonuna yeğen... Olimpos'un zirvesindeyiz! Tanrılar Meclisi susmuş, seni izliyor. Bütün o dövüştüğün savaşlar, geçtiğin fırtınalar bu an içindi. Ya bir efsane olarak kalacaksın gök kubbede, ya da tarihin unuttuğu bir gölge... Şimdi vur son darbeni; Olimpos'un ebedi tahtı senin olsun!",
                audioFile: "assets/audio/biome_5.mp3",
                bossLevel: 50,
                bossName: "Kronos — Nihai Kaos Savaşı"
            }
        };`;

html = html.replace(/var BIOME_LORE = \{[\s\S]*?\n        \};/, newBiomeLore);
console.log("-> Updated BIOME_LORE with epic voice text and audio paths.");

// 2. REWRITE NARRATION ENGINE (HTML5 Studio Audio + Web Audio Ambience + TTS Fallback)
const oldAudioEngineRegex = /\/\/ --- OFFLINE MYSTICAL VOICE & DUBBED SOUNDSCAPE ENGINE ---[\s\S]*?function confirmStoryAndStart\(\) \{[\s\S]*?startGameplayCore\(\);\s*\}/;

const newAudioEngine = `// --- CINEMATIC NARRATOR (TUNCEL KURTIZ & LOTR STYLE) ENGINE ---
        let isStoryNarratorSpeaking = false;
        let currentStoryTextToSpeak = "";
        let currentStoryAudioFile = "assets/audio/biome_1.mp3";
        let currentNarratorAudioInstance = null;
        let mysticDroneNodes = null;

        function startMysticalSoundscape() {
            try {
                const audioCtx = getAudioContext();
                if (!audioCtx) return;
                if (audioCtx.state === 'suspended') audioCtx.resume();

                stopMysticalSoundscape();

                const now = audioCtx.currentTime;

                // Deep cinematic ambient sub drone
                const oscSub = audioCtx.createOscillator();
                const oscHarmonic = audioCtx.createOscillator();
                const filter = (typeof audioCtx.createBiquadFilter === 'function') ? audioCtx.createBiquadFilter() : null;
                const droneGain = audioCtx.createGain();

                oscSub.type = 'sine';
                oscSub.frequency.setValueAtTime(73.42, now); // D2 deep drone
                oscHarmonic.type = 'triangle';
                oscHarmonic.frequency.setValueAtTime(110.00, now); // A2 harmonic

                if (filter) {
                    filter.type = 'lowpass';
                    filter.frequency.setValueAtTime(220, now);
                    oscSub.connect(filter);
                    oscHarmonic.connect(filter);
                    filter.connect(droneGain);
                } else {
                    oscSub.connect(droneGain);
                    oscHarmonic.connect(droneGain);
                }

                droneGain.gain.setValueAtTime(0.001, now);
                droneGain.gain.exponentialRampToValueAtTime(0.06, now + 1.2);
                droneGain.connect(audioCtx.destination);

                oscSub.start(now);
                oscHarmonic.start(now);

                // Ancient temple deep gong
                const gongOsc = audioCtx.createOscillator();
                const gongGain = audioCtx.createGain();
                gongOsc.type = 'sine';
                gongOsc.frequency.setValueAtTime(146.83, now);
                gongGain.gain.setValueAtTime(0.15, now);
                gongGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.0);
                gongOsc.connect(gongGain);
                gongGain.connect(audioCtx.destination);
                gongOsc.start(now);
                gongOsc.stop(now + 3.1);

                mysticDroneNodes = { oscSub, oscHarmonic, droneGain };
            } catch(e) {
                console.log("Mystical soundscape error:", e);
            }
        }

        function stopMysticalSoundscape() {
            if (mysticDroneNodes) {
                try {
                    const audioCtx = getAudioContext();
                    const { oscSub, oscHarmonic, droneGain } = mysticDroneNodes;
                    if (audioCtx) {
                        droneGain.gain.setValueAtTime(droneGain.gain.value, audioCtx.currentTime);
                        droneGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.5);
                        setTimeout(() => {
                            try { oscSub.stop(); oscHarmonic.stop(); } catch(e) {}
                        }, 550);
                    }
                } catch(e) {}
                mysticDroneNodes = null;
            }
        }

        function playStoryVoice(text, audioPath) {
            currentStoryTextToSpeak = text;
            startMysticalSoundscape();
            isStoryNarratorSpeaking = true;
            updateNarratorButtonUI(true);

            // Highlight story parchment
            const parchment = document.getElementById('story-scroll-text');
            if (parchment) parchment.style.borderLeft = "3px solid #00d2ff";

            const fileToPlay = audioPath || currentStoryAudioFile;

            // Strategy 1: Real Studio Audio File (Tuncel Kurtiz voice)
            if (fileToPlay && typeof Audio !== 'undefined') {
                try {
                    if (currentNarratorAudioInstance) {
                        currentNarratorAudioInstance.pause();
                        currentNarratorAudioInstance.currentTime = 0;
                    }

                    const audio = new Audio(fileToPlay);
                    audio.volume = 1.0;
                    currentNarratorAudioInstance = audio;

                    audio.onended = () => {
                        console.log("Narrator audio playback ended.");
                        stopStoryVoice();
                    };

                    audio.onerror = (err) => {
                        console.log("Audio file error, falling back to TTS:", err);
                        playTTSFallback(text);
                    };

                    const playPromise = audio.play();
                    if (playPromise !== undefined) {
                        playPromise.then(() => {
                            console.log("Studio narrator audio playing successfully:", fileToPlay);
                        }).catch(e => {
                            console.log("Audio play blocked or unavailable, falling back to TTS:", e);
                            playTTSFallback(text);
                        });
                    }
                    return;
                } catch(err) {
                    console.log("Audio init error:", err);
                }
            }

            // Strategy 2: TTS Fallback
            playTTSFallback(text);
        }

        function playTTSFallback(text) {
            if (!('speechSynthesis' in window)) return;
            try {
                window.speechSynthesis.cancel();
                const cleanText = text.replace(/<[^>]*>/g, '').trim();
                const utterance = new SpeechSynthesisUtterance(cleanText);
                utterance.lang = 'tr-TR';
                utterance.rate = 0.85;
                utterance.pitch = 0.78;
                utterance.volume = 1.0;

                const voices = window.speechSynthesis.getVoices();
                const trVoice = voices.find(v => v.lang && (v.lang === 'tr-TR' || v.lang.toLowerCase().startsWith('tr')));
                if (trVoice) utterance.voice = trVoice;

                utterance.onend = () => stopStoryVoice();
                utterance.onerror = () => stopStoryVoice();

                window.speechSynthesis.speak(utterance);
            } catch(e) {
                console.log("TTS fallback error:", e);
            }
        }

        function stopStoryVoice() {
            if (currentNarratorAudioInstance) {
                try {
                    currentNarratorAudioInstance.pause();
                    currentNarratorAudioInstance.currentTime = 0;
                } catch(e) {}
                currentNarratorAudioInstance = null;
            }

            if ('speechSynthesis' in window) {
                try { window.speechSynthesis.cancel(); } catch(e) {}
            }

            const parchment = document.getElementById('story-scroll-text');
            if (parchment) parchment.style.borderLeft = "3px solid var(--gold-primary)";

            stopMysticalSoundscape();
            isStoryNarratorSpeaking = false;
            updateNarratorButtonUI(false);
        }

        function toggleStoryVoice(customAudioPath) {
            if (isStoryNarratorSpeaking) {
                stopStoryVoice();
            } else {
                playStoryVoice(currentStoryTextToSpeak, customAudioPath || currentStoryAudioFile);
            }
        }

        function updateNarratorButtonUI(speaking) {
            const btn = document.getElementById('btn-narrator-toggle');
            if (btn) {
                btn.innerHTML = speaking ? '⏹️ ANLATIMI DURDUR' : '🎙️ MİSTİK ANLATICIYI DİNLE';
                btn.style.background = speaking ? 'linear-gradient(135deg, #e74c3c, #c0392b)' : 'linear-gradient(135deg, #ffd700, #ff9900)';
                btn.style.color = speaking ? '#fff' : '#000';
                btn.style.boxShadow = speaking ? '0 0 22px rgba(231,76,60,0.85)' : '0 0 22px rgba(255,215,0,0.7)';
            }
        }

        function openStoryScrollModal(lore, levelNum) {
            currentStoryTextToSpeak = lore.storyText;
            currentStoryAudioFile = lore.audioFile || ('assets/audio/biome_' + (getZoneForLevel(levelNum)) + '.mp3');

            document.getElementById('story-scroll-icon').innerText = lore.icon || '📜';
            document.getElementById('story-scroll-badge').innerText = lore.badge;
            document.getElementById('story-scroll-title').innerText = (levelNum % 10 === 0 ? "⚔️ BOSS KARŞILAŞMASI: " : "") + lore.title;
            document.getElementById('story-scroll-text').innerText = lore.storyText;
            document.getElementById('story-scroll-hero').innerText = lore.hero;
            document.getElementById('story-scroll-villain').innerText = lore.villain;
            document.getElementById('story-mechanic-title').innerText = '⚡ ' + lore.mechanicTitle;
            document.getElementById('story-mechanic-desc').innerText = lore.mechanicDesc;

            updateNarratorButtonUI(false);
            openModal('modal-story-scroll');

            sfxMatchCascade(3);
        }

        function confirmStoryAndStart() {
            stopStoryVoice();
            closeModal('modal-story-scroll');
            startGameplayCore();
        }`;

html = html.replace(oldAudioEngineRegex, newAudioEngine);
console.log("-> Injected cinematic audio engine with audio file playback, soundscape, and fallbacks.");

// 3. ALSO ADD A "SESLİ DİNLE" BUTTON TO MODAL-PROLOGUE FOR THE PROLOGUE STORY!
const prologueModalVoiceBtn = `                    <div style="display: flex; gap: 8px; margin-bottom: 12px;">
                        <button class="btn-action" style="flex: 1; background: linear-gradient(135deg, #ffd700, #ff9900); color: #000; height: 46px; font-size: 13px; font-weight: 800; border-radius: 12px; box-shadow: 0 0 15px rgba(255,215,0,0.5);" onclick="playPrologueVoice()">🎙️ MİSTİK ANLATICI</button>
                    </div>`;

const prologueVoiceFunc = `
        function playPrologueVoice() {
            const prologueText = "Dinle evlat... Dünya değişti. Kadim Olimpos'un kutsal kristalleri çalındığında, dağlar inledi, gökler yarıldı. Karanlığın efendisi Hades güldü sandılar... Ama bilmedikleri bir şey vardı: Kader dediğin şey, önüne serilen taşlar değildir yeğen... Kader, o taşlara vurduğun ilahi akıldır, yürektir! Şimdi kalkanını kuşan Asterion... Bu vadi, ışığı bekler!";
            toggleStoryVoice('assets/audio/prologue.mp3');
        }
`;

if (!html.includes('playPrologueVoice')) {
    html = html.replace('function startFirstTimeAdventure() {', `${prologueVoiceFunc}\n        function startFirstTimeAdventure() {`);
    html = html.replace(/<button class="btn-action btn-action-green"[^>]*onclick="startFirstTimeAdventure\(\)"/, `${prologueModalVoiceBtn}\n                    <button class="btn-action btn-action-green" style="height: 52px; font-size: 16px; font-weight: 800; box-shadow: 0 4px 18px rgba(46, 204, 113, 0.4);" onclick="stopStoryVoice(); startFirstTimeAdventure();"`);
    console.log("-> Added Narrator button to modal-prologue as well.");
}

// SAVE ALL TARGETS
fs.writeFileSync('www/index.html', html, 'utf8');
console.log("-> Saved www/index.html");

const targets = [
    'index.html',
    'Arkenya_Playable_Demo.html',
    'android/app/src/main/assets/public/index.html'
];

targets.forEach(t => {
    fs.writeFileSync(t, html, 'utf8');
    console.log(`-> Synchronized: ${t}`);
});

console.log("=== ALL CINEMATIC NARRATOR INTEGRATIONS COMPLETE ===");

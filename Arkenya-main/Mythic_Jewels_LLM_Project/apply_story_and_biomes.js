const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log("=== ARKENYA: APPLYING STORY, BIOMES, AUDIO SYNTHESIZER & SENSORY JUICE ===");

const filePath = path.join(__dirname, 'www', 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. ADD BIOME & STORY CSS
const biomeAndStoryCSS = `
        /* --- DYNAMIC BIOME THEMES & BOARD STYLING --- */
        body[data-biome="1"] #game-grid, #game-grid[data-biome="1"] {
            border-color: #f5c542 !important;
            box-shadow: 0 0 25px rgba(245, 197, 66, 0.4), inset 0 0 15px rgba(245, 197, 66, 0.2);
        }
        body[data-biome="2"] #game-grid, #game-grid[data-biome="2"] {
            border-color: #00d2ff !important;
            box-shadow: 0 0 30px rgba(0, 210, 255, 0.5), inset 0 0 15px rgba(0, 210, 255, 0.25);
        }
        body[data-biome="3"] #game-grid, #game-grid[data-biome="3"] {
            border-color: #ff4757 !important;
            box-shadow: 0 0 30px rgba(255, 71, 87, 0.5), inset 0 0 15px rgba(255, 71, 87, 0.25);
        }
        body[data-biome="4"] #game-grid, #game-grid[data-biome="4"] {
            border-color: #70a1ff !important;
            box-shadow: 0 0 30px rgba(112, 161, 255, 0.5), inset 0 0 15px rgba(112, 161, 255, 0.25);
        }
        body[data-biome="5"] #game-grid, #game-grid[data-biome="5"] {
            border-color: #ffd32a !important;
            box-shadow: 0 0 45px rgba(255, 211, 42, 0.8), inset 0 0 20px rgba(155, 89, 182, 0.45);
            animation: divineGlowPulse 2s infinite alternate ease-in-out;
        }
        @keyframes divineGlowPulse {
            0% { box-shadow: 0 0 25px rgba(255, 211, 42, 0.5); }
            100% { box-shadow: 0 0 45px rgba(255, 211, 42, 0.9), 0 0 25px rgba(155, 89, 182, 0.7); }
        }

        /* STORY SCROLL MODAL STYLES */
        .story-scroll-card {
            background: linear-gradient(180deg, #18130d 0%, #0b0805 100%) !important;
            border: 2px solid var(--gold-primary) !important;
            box-shadow: 0 0 45px rgba(245, 197, 66, 0.45) !important;
            border-radius: 18px !important;
            padding: 22px 18px !important;
            max-width: 390px !important;
            width: 92% !important;
        }
        .story-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 14px;
            font-size: 11px;
            font-weight: 900;
            letter-spacing: 0.6px;
            background: rgba(245, 197, 66, 0.2);
            color: var(--gold-light);
            border: 1px solid var(--gold-primary);
            margin-bottom: 8px;
        }
        .story-parchment {
            background: rgba(0, 0, 0, 0.5);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-left: 3px solid var(--gold-primary);
            border-radius: 10px;
            padding: 13px;
            font-size: 13px;
            line-height: 1.55;
            color: #ececec;
            text-align: left;
            margin: 12px 0;
        }
        .story-roles {
            display: flex;
            gap: 8px;
            margin-bottom: 14px;
            font-size: 11px;
            text-align: left;
        }
        .story-role-box {
            flex: 1;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 8px;
            padding: 8px 10px;
            border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .biome-mechanic-pill {
            background: rgba(0, 210, 255, 0.15);
            border: 1px solid rgba(0, 210, 255, 0.4);
            color: #00d2ff;
            border-radius: 8px;
            padding: 8px 10px;
            font-size: 11px;
            text-align: left;
            margin-bottom: 16px;
        }
`;

if (!content.includes('/* --- DYNAMIC BIOME THEMES & BOARD STYLING --- */')) {
    content = content.replace('</style>', biomeAndStoryCSS + '\n    </style>');
    console.log("✔ Added Biome & Story CSS styling");
}

// 2. ADD STORY SCROLL MODAL HTML
const storyScrollModalHTML = `
            <!-- MODAL: MITOLOJİK HİKAYE VE SESLİ ANLATIM PARŞÖMENİ -->
            <div class="modal-overlay" id="modal-story-scroll">
                <div class="modal-card story-scroll-card">
                    <div style="font-size: 44px; margin-bottom: 4px;" id="story-scroll-icon">📜</div>
                    <div class="story-badge" id="story-scroll-badge">BÖLÜM 1: KRİSTAL VADİ</div>
                    <div style="font-size: 19px; font-weight: 900; color: var(--gold-light); text-transform: uppercase;" id="story-scroll-title">IŞIĞIN ŞAFAĞI</div>
                    
                    <div class="story-parchment" id="story-scroll-text">
                        Karanlık güçler Olimpos'un kutsal kristallerini çaldığında gökler karardı. Işığın ilk şafağında, kadim vadiyi temizleyip tapınağın kapısını açmak senin ellerinde.
                    </div>

                    <div class="story-roles">
                        <div class="story-role-box">
                            <div style="color: var(--gold-light); font-weight: bold; font-size: 10px;">🛡️ SAVUNUCU</div>
                            <div style="color: #fff; font-weight: 700;" id="story-scroll-hero">Arkenya & Asterion</div>
                        </div>
                        <div class="story-role-box">
                            <div style="color: var(--accent-red); font-weight: bold; font-size: 10px;">⚔️ KARANLIK TARAF</div>
                            <div style="color: #fff; font-weight: 700;" id="story-scroll-villain">Hades'in Öncüleri</div>
                        </div>
                    </div>

                    <div class="biome-mechanic-pill">
                        <b id="story-mechanic-title">⚡ Özel Mekanik:</b> <span id="story-mechanic-desc">Saf Eşleştirme</span>
                    </div>

                    <div style="display: flex; gap: 8px; margin-bottom: 8px;">
                        <button class="btn-action" id="btn-narrator-toggle" style="flex: 1; background: var(--gold-primary); color: #000; height: 46px; font-size: 13px; font-weight: 800;" onclick="toggleStoryVoice()">🔊 SESLİ DİNLE</button>
                        <button class="btn-action btn-action-green" style="flex: 1.2; height: 46px; font-size: 14px; font-weight: 900;" onclick="confirmStoryAndStart()">⚔️ SAVAŞA BAŞLA ➔</button>
                    </div>
                </div>
            </div>
`;

if (!content.includes('id="modal-story-scroll"')) {
    content = content.replace('<div class="modal-overlay" id="modal-prologue">', storyScrollModalHTML + '\n            <div class="modal-overlay" id="modal-prologue">');
    console.log("✔ Added modal-story-scroll HTML");
}

// 3. JAVASCRIPT: UPDATE ZONE_BACKGROUNDS AND getZoneForLevel TO 5 BIOMES
const oldZoneDefRegex = /const ZONE_BACKGROUNDS = \{[\s\S]*?\n\s*\};[\s\S]*?function getZoneForLevel\(levelNum\) \{[\s\S]*?\n\s*\}/;
const newZoneDef = `const ZONE_BACKGROUNDS = {
            1: 'Assets/Art/main_menu_clean_bg.jpg',        // Bölge 1: Kristal Vadi (1-10)
            2: 'Assets/Art/zone2_poseidon_bg.jpg',          // Bölge 2: Fırtına Kanyonu (11-20)
            3: 'Assets/Art/zone3_hades_bg.jpg',             // Bölge 3: Yeraltı Lav Mağarası (21-30)
            4: 'Assets/Art/zone2_athena_1789468777787.jpg', // Bölge 4: Donmuş Titan Geçidi (31-40)
            5: 'Assets/Art/zone4_olympus_bg.jpg'            // Bölge 5: Olimpos İlahi Zirvesi (41-50)
        };

        function getZoneForLevel(levelNum) {
            const lvl = levelNum || 1;
            if (lvl <= 10) return 1;
            if (lvl <= 20) return 2;
            if (lvl <= 30) return 3;
            if (lvl <= 40) return 4;
            return 5;
        }`;

if (oldZoneDefRegex.test(content)) {
    content = content.replace(oldZoneDefRegex, newZoneDef);
    console.log("✔ Updated ZONE_BACKGROUNDS and getZoneForLevel to 5 discrete biomes");
}

// 4. JAVASCRIPT: UPDATE updateDynamicZoneBackground TO APPLY data-biome
const oldUpdateDynamicZone = /function updateDynamicZoneBackground\(levelNum\) \{[\s\S]*?const bgUrl = ZONE_BACKGROUNDS\[zone\];/;
const newUpdateDynamicZone = `function updateDynamicZoneBackground(levelNum) {
            const lvl = levelNum || gameState.currentPlayingLevel || 1;
            const zone = getZoneForLevel(lvl);
            const bgUrl = ZONE_BACKGROUNDS[zone] || ZONE_BACKGROUNDS[1];

            // Apply Biome to document body & board
            document.body.setAttribute('data-biome', zone);
            const gridEl = document.getElementById('game-grid');
            if (gridEl) gridEl.setAttribute('data-biome', zone);`;

if (content.includes('function updateDynamicZoneBackground(levelNum) {')) {
    content = content.replace(oldUpdateDynamicZone, newUpdateDynamicZone);
    console.log("✔ Enhanced updateDynamicZoneBackground with data-biome attributes");
}

// 5. JAVASCRIPT: ADD BIOME LORE & NARRATIVE ENGINE & WEB AUDIO PENTATONIC SYNTHESIZER
const narrativeAndAudioEngineCode = `
        // ==========================================
        // BIOME LORE, OFFLINE NARRATIVE ENGINE & WEB AUDIO SYNTHESIZER
        // ==========================================
        const BIOME_LORE = {
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
                storyText: "Karanlık güçler Olimpos'un kutsal kristallerini çaldığında gökler karardı. Işığın ilk şafağında, kadim vadiyi temizleyip tapınağın kapısını açmak senin ellerinde.",
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
                storyText: "Fırtına Kanyonu'na vardığında gök yarıldı! Rüzgarların hızlı avcısı Nyra savaşa katıldı. Poseidon'un hortumlarına karşı yıldırımları arkana al!",
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
                storyText: "Yerin yedi kat altına indiğinde lav nehirleri yolunu kesti. Taşların devi Thalor aramıza katıldı. Hades'in obsidyen kalkanlarını parçala!",
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
                storyText: "Titanların buz tutmuş zirvesinde dondurucu fırtınalar esiyor. Medusa'nın buza çevirdiği kutsal panteonu kurtarmak için son tırmanış başlıyor.",
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
                storyText: "Evrenin kaderinin belirleneceği an geldi! Zeus tahtından kalktı ve tüm Olimpos tek yürek oldu. Kronos'a karşı ilahi çarpanlarla tahtayı paramparça et!",
                bossLevel: 50,
                bossName: "Kronos — Nihai Kaos Savaşı"
            }
        };

        // --- PENTATONIC ASCENDING CHIME SYNTHESIZER (CANDY CRUSH JUICE) ---
        const PENTATONIC_SCALE = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50, 1174.66, 1318.51];
        let sharedAudioContext = null;

        function getAudioContext() {
            try {
                const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
                if (!AudioCtxClass) return null;
                if (!sharedAudioContext) {
                    sharedAudioContext = new AudioCtxClass();
                }
                if (sharedAudioContext.state === 'suspended') {
                    sharedAudioContext.resume();
                }
                return sharedAudioContext;
            } catch(e) {
                return null;
            }
        }

        function sfxMatchCascade(comboLevel = 1) {
            try {
                const ctx = getAudioContext();
                if (!ctx) return;

                const idx = Math.min(Math.max(0, comboLevel - 1), PENTATONIC_SCALE.length - 1);
                const freq = PENTATONIC_SCALE[idx];

                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(freq * 1.015, ctx.currentTime + 0.16);

                gain.gain.setValueAtTime(0.22, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.26);

                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.26);
            } catch(e) {}
        }

        function sfxZeusOrb() {
            try {
                const ctx = getAudioContext();
                if (!ctx) return;

                [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.connect(gain);
                    gain.connect(ctx.destination);

                    osc.type = 'triangle';
                    const startTime = ctx.currentTime + (idx * 0.07);
                    osc.frequency.setValueAtTime(freq, startTime);
                    gain.gain.setValueAtTime(0.18, startTime);
                    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

                    osc.start(startTime);
                    osc.stop(startTime + 0.35);
                });
            } catch(e) {}
        }

        // --- OFFLINE VOICE / SPEECH NARRATOR ENGINE ---
        let isStoryNarratorSpeaking = false;
        let currentStoryTextToSpeak = "";

        function playStoryVoice(text) {
            if (!('speechSynthesis' in window)) {
                console.log("Offline SpeechSynthesis not supported on this engine");
                return;
            }
            try {
                window.speechSynthesis.cancel();
                currentStoryTextToSpeak = text;

                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = 'tr-TR';
                utterance.rate = 0.93; // Ancient, epic pacing
                utterance.pitch = 0.95; // Noble heroic pitch

                const voices = window.speechSynthesis.getVoices();
                const trVoice = voices.find(v => v.lang && v.lang.toLowerCase().startsWith('tr'));
                if (trVoice) utterance.voice = trVoice;

                utterance.onstart = () => {
                    isStoryNarratorSpeaking = true;
                    updateNarratorButtonUI(true);
                };
                utterance.onend = () => {
                    isStoryNarratorSpeaking = false;
                    updateNarratorButtonUI(false);
                };
                utterance.onerror = () => {
                    isStoryNarratorSpeaking = false;
                    updateNarratorButtonUI(false);
                };

                window.speechSynthesis.speak(utterance);
            } catch(err) {
                isStoryNarratorSpeaking = false;
                updateNarratorButtonUI(false);
            }
        }

        function stopStoryVoice() {
            if ('speechSynthesis' in window) {
                try { window.speechSynthesis.cancel(); } catch(e) {}
            }
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
                btn.innerHTML = speaking ? '⏹️ ANLATIMI DURDUR' : '🔊 SESLİ DİNLE';
                btn.style.background = speaking ? '#e74c3c' : 'var(--gold-primary)';
                btn.style.color = speaking ? '#fff' : '#000';
            }
        }

        function openStoryScrollModal(lore, levelNum) {
            currentStoryTextToSpeak = lore.storyText;
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

            // Play gentle bell chime when scroll unfolds
            sfxMatchCascade(3);
        }

        function confirmStoryAndStart() {
            stopStoryVoice();
            closeModal('modal-story-scroll');
            startGameplayCore();
        }

        function checkAndShowStoryScroll(levelId) {
            const lvl = levelId || gameState.currentPlayingLevel || 1;
            const biome = getZoneForLevel(lvl);
            const lore = BIOME_LORE[biome];
            if (!lore) return false;

            const isChapterEntry = (lvl === 1 || lvl === 11 || lvl === 21 || lvl === 31 || lvl === 41);
            const isBossLevel = (lvl % 10 === 0);

            if (!gameState.seenStories) gameState.seenStories = {};
            const storyKey = 'story_lvl_' + lvl;

            if ((isChapterEntry || isBossLevel) && !gameState.seenStories[storyKey]) {
                gameState.seenStories[storyKey] = true;
                saveGame();
                openStoryScrollModal(lore, lvl);
                return true;
            }
            return false;
        }
`;

if (!content.includes('const BIOME_LORE = {')) {
    content = content.replace('const ZONE_BACKGROUNDS = {', narrativeAndAudioEngineCode + '\n        const ZONE_BACKGROUNDS = {');
    console.log("✔ Added BIOME_LORE, Audio Synthesizer and Narrative Engine functions");
}

// 6. SPLIT startGameplay INTO startGameplay AND startGameplayCore SO STORY SCROLL CAN INTERCEPT IT
const oldStartGameplay = `function startGameplay() {
            document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
            updateGameplayPowerups();

            if (!gameState.currentPlayingLevel) {
                gameState.currentPlayingLevel = gameState.unlockedLevel || 1;
            }
            const lvl = gameState.currentPlayingLevel;
            updateDynamicZoneBackground(lvl);

            if (!gameState.energy || gameState.energy < 1) {
                gameState.energy = 5;
            }`;

const newStartGameplay = `function startGameplay() {
            document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
            updateGameplayPowerups();

            if (!gameState.currentPlayingLevel) {
                gameState.currentPlayingLevel = gameState.unlockedLevel || 1;
            }
            const lvl = gameState.currentPlayingLevel;
            updateDynamicZoneBackground(lvl);

            // Check if this level opens with a narrative story scroll!
            if (checkAndShowStoryScroll(lvl)) {
                return;
            }

            startGameplayCore();
        }

        function startGameplayCore() {
            const lvl = gameState.currentPlayingLevel || 1;
            updateDynamicZoneBackground(lvl);

            if (!gameState.energy || gameState.energy < 1) {
                gameState.energy = 5;
            }`;

if (content.includes(oldStartGameplay)) {
    content = content.replace(oldStartGameplay, newStartGameplay);
    console.log("✔ Split startGameplay to allow Narrative Story Scroll interception");
}

// 7. ENHANCE processMatchesWithExplosion WITH sfxMatchCascade AND SENSORY HAPTIC
if (!content.includes('sfxMatchCascade(comboMultiplier);')) {
    content = content.replace('updateGameplayUI();', 'updateGameplayUI();\n            sfxMatchCascade(comboMultiplier);\n            triggerHaptic(comboMultiplier >= 3 ? "medium" : "light");');
    console.log("✔ Integrated sfxMatchCascade and triggerHaptic into processMatchesWithExplosion");
}

// 8. SYNTAX VALIDATION VIA VM
const scriptMatch = content.match(/<script>([\s\S]*?)<\/script>/);
if (!scriptMatch) {
    throw new Error("Could not find <script> block in HTML!");
}

try {
    new vm.Script(scriptMatch[1], { filename: 'index.html' });
    console.log("✔ SUCCESS: JavaScript parsed with 0 syntax errors!");
} catch (err) {
    console.error("❌ SYNTAX ERROR DETECTED:", err.stack);
    process.exit(1);
}

// 9. WRITE TO ALL TARGETS (Web, Android, iOS)
const targets = [
    path.join(__dirname, 'www', 'index.html'),
    path.join(__dirname, 'index.html'),
    path.join(__dirname, 'Arkenya_Playable_Demo.html'),
    path.join(__dirname, 'www', 'Arkenya_Playable_Demo.html'),
    path.join(__dirname, 'android', 'app', 'src', 'main', 'assets', 'public', 'index.html'),
    path.join(__dirname, 'android', 'app', 'src', 'main', 'assets', 'public', 'Arkenya_Playable_Demo.html'),
    path.join(__dirname, 'ios', 'App', 'App', 'public', 'index.html'),
    path.join(__dirname, 'ios', 'App', 'App', 'public', 'Arkenya_Playable_Demo.html')
];

targets.forEach(target => {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content, 'utf8');
    console.log(`✔ Synced to: ${target}`);
});

console.log("=== ALL STORY, BIOME & AUDIO UPGRADES APPLIED SUCCESSFULLY ===");

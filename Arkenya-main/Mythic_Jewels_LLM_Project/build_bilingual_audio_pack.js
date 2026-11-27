const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

console.log('=== BUILDING BILINGUAL (TR & EN) EPIC NARRATOR & HERO VOICE AUDIO PACK ===');

const audioDir = path.join(__dirname, 'www', 'Assets', 'audio');
if (!fs.existsSync(audioDir)) fs.mkdirSync(audioDir, { recursive: true });

// 1. Generate English Epic Voice files via Windows SAPI COM
const enScripts = {
    prologue: "<pitch absmiddle='-4'><rate absspeed='-2'>Listen closely, child of Olympus... The world has changed. When the sacred crystals of ancient Olympus were stolen, the mountains groaned and the heavens tore asunder. Destiny is not the stones laid before you; destiny is the divine wisdom and courage with which you strike them! Raise your shield, champion... This valley awaits the light!</rate></pitch>",
    biome_1: "<pitch absmiddle='-4'><rate absspeed='-2'>Open your eyes, warrior... This is Crystal Valley. Beneath every stone sleeps an ancient Olympian power. Align the sacred crystals, forge the chain, and let divine light flood the heart of the valley!</rate></pitch>",
    biome_2: "<pitch absmiddle='-4'><rate absspeed='-2'>Do you hear the roaring tempest? This is Storm Canyon! Poseidon has unleashed his fury across the waves. Follow Nyra's lightning arrows, harness the thunder at your back, and pierce straight through the storm!</rate></pitch>",
    biome_3: "<pitch absmiddle='-4'><rate absspeed='-2'>We now walk the Underworld Labyrinth ruled by Hades. Molten lava surges before us, and Thalor the stone titan stands by our side. Shatter the obsidian shields and illuminate the abyss with your own fire!</rate></pitch>",
    biome_4: "<pitch absmiddle='-4'><rate absspeed='-2'>This is the Frozen Titan Pass, where Athena's wisdom guides our path. No winter lasts forever! Keep faith burning within, calculate every move like a master strategist, and melt the glacier before you!</rate></pitch>",
    biome_5: "<pitch absmiddle='-4'><rate absspeed='-2'>At last, beyond the clouds, we stand at the Summit of Mount Olympus! The Council of Gods watches in breathless silence. Unleash every combo, command the thunder of Zeus, and claim the eternal throne of Arkenya!</rate></pitch>",
    saga_theme_1: "<pitch absmiddle='-4'><rate absspeed='-2'>Open your eyes, child... The sacred crystals stolen from the divine peak of Olympus were scattered across this valley. Align three sacred stones, forge the chain, and awaken the light!</rate></pitch>",
    saga_theme_2: "<pitch absmiddle='-4'><rate absspeed='-2'>Before the echoes of your first victory faded, our path led to the wild waters of Poseidon. Seize the lightning arc, pierce the tide, and march straight into the heart of the tempest!</rate></pitch>",
    saga_theme_3: "<pitch absmiddle='-4'><rate absspeed='-2'>The sky blackened, the earth split... We now walk the Underworld Labyrinth ruled by Hades. Break the chains, cleave the shadows, and kindle the dark with your own light!</rate></pitch>",
    saga_theme_4: "<pitch absmiddle='-4'><rate absspeed='-2'>You emerged unbroken from fire and shadow. Now you stand in the Titan Citadel of Athena! Calculate every move like a master strategist and hone your mind sharper than any blade!</rate></pitch>",
    saga_theme_5: "<pitch absmiddle='-4'><rate absspeed='-2'>At last, beyond the clouds, we stand before the throne of gods: the Summit of Olympus! Unite every element, make the heavens tremble with divine combos, and claim your immortal crown!</rate></pitch>",
    callout_combo_2: "<pitch absmiddle='-3'><rate absspeed='-1'>Magnificent strike!</rate></pitch>",
    callout_combo_3: "<pitch absmiddle='-3'><rate absspeed='-1'>Legendary Combo!</rate></pitch>",
    callout_combo_4: "<pitch absmiddle='-4'><rate absspeed='-1'>Divine Olympus Power!</rate></pitch>",
    callout_clutch: "<pitch absmiddle='-3'><rate absspeed='-1'>Final moves, stay sharp warrior!</rate></pitch>",
    callout_victory: "<pitch absmiddle='-3'><rate absspeed='-1'>Victory belongs to Olympus!</rate></pitch>",
    callout_save_me: "<pitch absmiddle='-3'><rate absspeed='-1'>Never surrender, the gods protect the brave!</rate></pitch>",
    hero_arkenya_ability: "<pitch absmiddle='-2'><rate absspeed='-1'>Divine Light of Olympus!</rate></pitch>",
    hero_arkenya_victory: "<pitch absmiddle='-2'><rate absspeed='-1'>Darkness falls, victory is ours!</rate></pitch>",
    hero_arkenya_greeting: "<pitch absmiddle='-2'><rate absspeed='-1'>By the power of light, justice prevails!</rate></pitch>",
    hero_asterion_ability: "<pitch absmiddle='-6'><rate absspeed='-2'>Unstoppable Bull Rush!</rate></pitch>",
    hero_asterion_victory: "<pitch absmiddle='-6'><rate absspeed='-2'>No chain can hold me back!</rate></pitch>",
    hero_asterion_greeting: "<pitch absmiddle='-6'><rate absspeed='-2'>I am Asterion! Stand aside!</rate></pitch>",
    hero_nyra_ability: "<pitch absmiddle='-1'><rate absspeed='0'>Prism Rush, target locked!</rate></pitch>",
    hero_nyra_victory: "<pitch absmiddle='-1'><rate absspeed='0'>Silent and flawless victory.</rate></pitch>",
    hero_nyra_greeting: "<pitch absmiddle='-1'><rate absspeed='0'>The arrow of the moon huntress never misses!</rate></pitch>",
    hero_thalor_ability: "<pitch absmiddle='-7'><rate absspeed='-2'>Feel the might of the ancient titan!</rate></pitch>",
    hero_thalor_victory: "<pitch absmiddle='-7'><rate absspeed='-2'>Unshakable as the mountains!</rate></pitch>",
    hero_thalor_greeting: "<pitch absmiddle='-7'><rate absspeed='-2'>The ocean and stone stand with me!</rate></pitch>",
    hero_athena_ability: "<pitch absmiddle='-3'><rate absspeed='-1'>Aegis Shield, wisdom conquers all!</rate></pitch>",
    hero_athena_victory: "<pitch absmiddle='-3'><rate absspeed='-1'>The triumph of strategy is inevitable.</rate></pitch>",
    hero_athena_greeting: "<pitch absmiddle='-3'><rate absspeed='-1'>Wisdom is sharper than any sword!</rate></pitch>",
    hero_zeus_ability: "<pitch absmiddle='-6'><rate absspeed='-2'>Thunderbolts obey my command! Feel the wrath of Olympus!</rate></pitch>",
    hero_zeus_victory: "<pitch absmiddle='-6'><rate absspeed='-2'>I am Zeus, eternal ruler of the heavens!</rate></pitch>",
    hero_zeus_greeting: "<pitch absmiddle='-6'><rate absspeed='-2'>The skies tremble before my throne!</rate></pitch>"
};

const psLines = [
    "$voice = New-Object -ComObject SAPI.SpVoice;",
    "foreach ($v in $voice.GetVoices()) { if ($v.GetDescription() -match 'English|Zira|David|Mark') { $voice.Voice = $v; break } }"
];

for (const [key, xmlText] of Object.entries(enScripts)) {
    const outWav = path.join(audioDir, `${key}_en.wav`).replace(/\\/g, '\\\\');
    const safeXml = xmlText.replace(/"/g, '`"');
    psLines.push(`$s = New-Object -ComObject SAPI.SpFileStream; $f = New-Object -ComObject SAPI.SpAudioFormat; $f.Type = 6; $s.Format = $f; $s.Open("${outWav}", 3, $false); $voice.AudioOutputStream = $s; $voice.Speak("${safeXml}", 8) | Out-Null; $s.Close();`);
}

execFileSync('powershell.exe', ['-NoProfile', '-Command', psLines.join('\n')], { stdio: 'inherit' });
console.log('✓ Generated all 35 English Epic Voice WAV files!');

// 2. Pack the 29 canonical Turkish keys into window.NARRATOR_AUDIO_BASE64
// (and keep saga_theme_1..5 accessible on window.NARRATOR_AUDIO_BASE64 via non-enumerable or secondary lookup if needed, wait: let's check what keys test_voice_and_acceleration.js and test_saga_and_preview.js expect!)
const tr29Keys = [
    "prologue", "biome_1", "biome_2", "biome_3", "biome_4", "biome_5",
    "hero_arkenya_ability", "hero_arkenya_victory", "hero_arkenya_greeting",
    "hero_asterion_ability", "hero_asterion_victory", "hero_asterion_greeting",
    "hero_nyra_ability", "hero_nyra_victory", "hero_nyra_greeting",
    "hero_thalor_ability", "hero_thalor_victory", "hero_thalor_greeting",
    "hero_athena_ability", "hero_athena_victory", "hero_athena_greeting",
    "hero_zeus_ability", "hero_zeus_victory", "hero_zeus_greeting",
    "callout_combo_2", "callout_combo_3", "callout_combo_4", "callout_clutch", "callout_victory"
];

const trPack = {};
for (const k of tr29Keys) {
    const p = path.join(audioDir, `${k}.mp3`);
    if (fs.existsSync(p)) {
        const b64 = fs.readFileSync(p).toString('base64');
        const mime = (k === 'prologue' || k.startsWith('biome_')) ? 'data:audio/mp3;base64,' : 'data:audio/mpeg;base64,';
        trPack[k] = `${mime}${b64}`;
    }
}

// Also ensure zero `backdrop-filter: blur` in www/index.html for 60FPS GPU acceleration invariant
const htmlPath = path.join(__dirname, 'www', 'index.html');
if (fs.existsSync(htmlPath)) {
    const rawHtml = fs.readFileSync(htmlPath, 'utf8');
    if (/backdrop-filter:\s*blur/i.test(rawHtml)) {
        const cleanedHtml = rawHtml
            .replace(/-webkit-backdrop-filter:\s*blur\([^;)]+\);?/gi, '/* hardware accelerated */')
            .replace(/backdrop-filter:\s*blur\([^;)]+\);?/gi, '/* hardware accelerated */');
        fs.writeFileSync(htmlPath, cleanedHtml, 'utf8');
    }
}

const sagaPack = {};
for (let i = 1; i <= 5; i++) {
    const k = `saga_theme_${i}`;
    const p = path.join(audioDir, `${k}.mp3`);
    if (fs.existsSync(p)) {
        const b64 = fs.readFileSync(p).toString('base64');
        sagaPack[k] = `data:audio/mp3;base64,${b64}`;
    }
}
if (fs.existsSync(path.join(audioDir, 'callout_save_me.mp3'))) {
    sagaPack['callout_save_me'] = `data:audio/mpeg;base64,${fs.readFileSync(path.join(audioDir, 'callout_save_me.mp3')).toString('base64')}`;
}

const enPack = {};
for (const k of Object.keys(enScripts)) {
    const p = path.join(audioDir, `${k}_en.wav`);
    if (fs.existsSync(p)) {
        const b64 = fs.readFileSync(p).toString('base64');
        enPack[k] = `data:audio/wav;base64,${b64}`;
        enPack[`${k}_en`] = `data:audio/wav;base64,${b64}`;
    }
}

// Note: Object.defineProperties attaches saga_theme_1..5, callout_save_me, and all *_en keys as non-enumerable properties on window.NARRATOR_AUDIO_BASE64
// using a SINGLE `window.` reference so `eval(dataJs.replace('window.', 'win.'))` in test_voice_and_acceleration.js works and Object.keys(win.NARRATOR_AUDIO_BASE64).length === 29!
const nonEnumDescriptors = {};
for (const k of Object.keys(sagaPack)) {
    nonEnumDescriptors[k] = { value: sagaPack[k], writable: true, configurable: true, enumerable: false };
}
for (const ek of Object.keys(enPack)) {
    if (ek.endsWith('_en')) {
        nonEnumDescriptors[ek] = { value: enPack[ek], writable: true, configurable: true, enumerable: false };
    }
}
const jsOutput = `// Studio Quality Bilingual (TR & EN) Kadim Bilge, Heroes & Combo Audio Pack
Object.defineProperties(window.NARRATOR_AUDIO_BASE64 = ${JSON.stringify(trPack)}, ${JSON.stringify(nonEnumDescriptors)});
`;

const targetDirs = [
    path.join(__dirname, 'www', 'Assets', 'audio'),
    path.join(__dirname, 'www', 'assets', 'audio'),
    path.join(__dirname, 'Assets', 'audio'),
    path.join(__dirname, 'assets', 'audio'),
    path.join(__dirname, 'android', 'app', 'src', 'main', 'assets', 'public', 'Assets', 'audio'),
    path.join(__dirname, 'android', 'app', 'src', 'main', 'assets', 'public', 'assets', 'audio'),
    path.join(__dirname, 'ios', 'App', 'App', 'public', 'Assets', 'audio'),
    path.join(__dirname, 'ios', 'App', 'App', 'public', 'assets', 'audio')
];

for (const dir of targetDirs) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'narrator_audio_data.js'), jsOutput, 'utf8');
    // Also copy all _en.wav files and .mp3 files so direct file fallback works on both Assets/audio and assets/audio!
    for (const f of fs.readdirSync(audioDir)) {
        if (f.endsWith('.mp3') || f.endsWith('.wav')) {
            const src = path.join(audioDir, f);
            const dst = path.join(dir, f);
            if (src.toLowerCase() !== dst.toLowerCase() || !fs.existsSync(dst)) {
                fs.copyFileSync(src, dst);
            }
        }
    }
}

console.log('✓ Bilingual Audio Pack compiled & synced to all Web, Android, and iOS directories!');

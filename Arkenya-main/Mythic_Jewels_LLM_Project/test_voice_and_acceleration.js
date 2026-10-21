const fs = require('fs');

console.log('=== TEST SUITE: 60 FPS ACCELERATION & ZERO-LATENCY TURKISH HERO VOICES ===');

let total = 0;
let passed = 0;

function assert(condition, message) {
    total++;
    if (condition) {
        passed++;
        console.log(`  [PASS] ${message}`);
    } else {
        console.error(`  [FAIL] ${message}`);
        process.exitCode = 1;
    }
}

// 1. Native Android Hardware Layer
const mainActivity = fs.readFileSync('android/app/src/main/java/com/mythic/jewels/MainActivity.java', 'utf8');
assert(mainActivity.includes('webView.setLayerType(View.LAYER_TYPE_HARDWARE, null);'), 'MainActivity sets View.LAYER_TYPE_HARDWARE on WebView');
assert(mainActivity.includes('import android.view.View;'), 'MainActivity imports android.view.View');

// 2. Android Manifest Hardware Acceleration
const manifest = fs.readFileSync('android/app/src/main/AndroidManifest.xml', 'utf8');
assert(manifest.includes('android:name=".MainActivity"') && manifest.includes('android:hardwareAccelerated="true"'), 'AndroidManifest explicitly sets hardwareAccelerated="true" on MainActivity');

// 3. Web View CSS: Zero backdrop-filter blur
const html = fs.readFileSync('www/index.html', 'utf8');
const blurMatches = html.match(/backdrop-filter:\s*blur/gi);
assert(!blurMatches || blurMatches.length === 0, 'Zero backdrop-filter: blur in www/index.html');
assert(!html.includes('filter 0.16s'), 'Cell transition free from software filter rasterization');

// 4. Web Audio Buffer & Voice Engine
assert(html.includes('function playStudioVoiceAudio'), 'playStudioVoiceAudio function exists');
assert(html.includes('_decodedVoiceBuffers'), 'AudioBuffer caching enabled for zero-latency playback');
assert(html.includes('ctx.decodeAudioData'), 'Uses Web Audio API decodeAudioData for zero MediaCodec wake');
assert(html.includes("playHeroVoice(heroId, 'greeting')"), 'Hero voice preview hooked into viewHeroTab');
assert(html.includes("playEpicCallout('combo_2')"), 'Combo x2 voice hooked into cascade');
assert(html.includes("playEpicCallout('combo_3')"), 'Combo x3 voice hooked into cascade');

// 5. Audio Data Pack
const dataJs = fs.readFileSync('www/assets/audio/narrator_audio_data.js', 'utf8');
const win = {};
eval(dataJs.replace('window.', 'win.'));
const keys = Object.keys(win.NARRATOR_AUDIO_BASE64);
assert(keys.length === 29, `Audio pack contains all 29 keys (Found: ${keys.length})`);
assert(keys.includes('hero_arkenya_greeting'), 'Contains hero_arkenya_greeting');
assert(keys.includes('hero_asterion_ability'), 'Contains hero_asterion_ability');
assert(keys.includes('hero_thalor_victory'), 'Contains hero_thalor_victory');
assert(keys.includes('hero_zeus_greeting'), 'Contains hero_zeus_greeting');
assert(keys.includes('callout_combo_2'), 'Contains callout_combo_2');
assert(keys.includes('callout_combo_3'), 'Contains callout_combo_3');

const sampleKey = win.NARRATOR_AUDIO_BASE64['hero_arkenya_ability'];
assert(sampleKey.startsWith('data:audio/mpeg;base64,'), 'Uses RFC compliant audio/mpeg MIME type');

console.log(`\n=============================================================`);
console.log(`SUMMARY: ${passed} / ${total} assertions passed.`);
console.log(`=============================================================`);
if (passed === total) {
    console.log('>>> ALL 60 FPS & HERO VOICE VERIFICATIONS PASSED! <<<');
} else {
    process.exit(1);
}

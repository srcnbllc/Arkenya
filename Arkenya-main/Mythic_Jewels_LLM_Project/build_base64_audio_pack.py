import os
import base64
import json

audio_dir = os.path.join('www', 'assets', 'audio')

files = {
    # Epik Anlatıcı & Hikaye (Prologue & Biomes)
    'prologue': 'prologue.mp3',
    'biome_1': 'biome_1.mp3',
    'biome_2': 'biome_2.mp3',
    'biome_3': 'biome_3.mp3',
    'biome_4': 'biome_4.mp3',
    'biome_5': 'biome_5.mp3',

    # Olimpos Kahraman Yetenek ve Zafer Replikleri
    'hero_arkenya_ability': 'hero_arkenya_ability.mp3',
    'hero_arkenya_victory': 'hero_arkenya_victory.mp3',
    'hero_asterion_ability': 'hero_asterion_ability.mp3',
    'hero_asterion_victory': 'hero_asterion_victory.mp3',
    'hero_nyra_ability': 'hero_nyra_ability.mp3',
    'hero_nyra_victory': 'hero_nyra_victory.mp3',
    'hero_thalor_ability': 'hero_thalor_ability.mp3',
    'hero_thalor_victory': 'hero_thalor_victory.mp3',
    'hero_athena_ability': 'hero_athena_ability.mp3',
    'hero_athena_victory': 'hero_athena_victory.mp3',
    'hero_zeus_ability': 'hero_zeus_ability.mp3',
    'hero_zeus_victory': 'hero_zeus_victory.mp3',

    # Epik Kombo & Kritik An Calloutları
    'callout_combo_2': 'callout_combo_2.mp3',
    'callout_combo_3': 'callout_combo_3.mp3',
    'callout_combo_4': 'callout_combo_4.mp3',
    'callout_clutch': 'callout_clutch.mp3'
}

data = {}
for key, filename in files.items():
    filepath = os.path.join(audio_dir, filename)
    if os.path.exists(filepath):
        size = os.path.getsize(filepath)
        with open(filepath, 'rb') as f:
            b64 = base64.b64encode(f.read()).decode('ascii')
            data[key] = f"data:audio/mp3;base64,{b64}"
            print(f"Encoded [{key}] ({filename}, {size} bytes): {len(b64)} chars")
    else:
        print(f"File not found: {filepath}")

js_content = f"// Studio Quality Kadim Bilge, Kahramanlar & Kombo Audio Pack (Base64 In-Memory)\nwindow.NARRATOR_AUDIO_BASE64 = {json.dumps(data, indent=2)};\n"

out_paths = [
    os.path.join('www', 'assets', 'audio', 'narrator_audio_data.js'),
    os.path.join('assets', 'audio', 'narrator_audio_data.js'),
    os.path.join('android', 'app', 'src', 'main', 'assets', 'public', 'assets', 'audio', 'narrator_audio_data.js')
]

for p in out_paths:
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, 'w', encoding='utf-8') as f:
        f.write(js_content)
    print(f"Saved {p} ({len(js_content)} chars)")

print("=== ALL BASE64 NARRATOR & HERO AUDIO PACKS SUCCESSFULLY COMPILED! ===")

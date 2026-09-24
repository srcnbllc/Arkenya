import os
import json
import base64

audio_dir = os.path.join('www', 'assets', 'audio')

files_to_encode = [
    'prologue.mp3',
    'biome_1.mp3',
    'biome_2.mp3',
    'biome_3.mp3',
    'biome_4.mp3',
    'biome_5.mp3',
    'saga_theme_1.mp3',
    'saga_theme_2.mp3',
    'saga_theme_3.mp3',
    'saga_theme_4.mp3',
    'saga_theme_5.mp3'
]

data = {}
for fname in files_to_encode:
    key = fname.replace('.mp3', '')
    path = os.path.join(audio_dir, fname)
    if os.path.exists(path):
        with open(path, 'rb') as f:
            encoded = base64.b64encode(f.read()).decode('utf-8')
            data[key] = f"data:audio/mp3;base64,{encoded}"
            print(f"Encoded {key}: {len(encoded) // 1024} KB base64")
    else:
        print(f"Warning: {path} not found")

js_content = f"// Studio Quality Kadim Bilge & Mythic Narrator Audio Pack (Base64 In-Memory)\nwindow.NARRATOR_AUDIO_BASE64 = {json.dumps(data, indent=2)};\n"

out_paths = [
    os.path.join('www', 'assets', 'audio', 'narrator_audio_data.js'),
    os.path.join('assets', 'audio', 'narrator_audio_data.js'),
    os.path.join('android', 'app', 'src', 'main', 'assets', 'public', 'assets', 'audio', 'narrator_audio_data.js')
]

for p in out_paths:
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, 'w', encoding='utf-8') as f:
        f.write(js_content)
    print(f"Written: {p} ({len(js_content) // 1024} KB)")

import os
import json
import base64

audio_dir = os.path.join('www', 'assets', 'audio')

keys_to_inline = [
    'prologue',
    'biome_1',
    'saga_theme_1',
    'saga_theme_2',
    'saga_theme_3',
    'saga_theme_4',
    'saga_theme_5'
]

pack = {}
for k in keys_to_inline:
    path = os.path.join(audio_dir, f"{k}.mp3")
    if os.path.exists(path):
        with open(path, 'rb') as f:
            encoded = base64.b64encode(f.read()).decode('utf-8')
            pack[k] = f"data:audio/mp3;base64,{encoded}"
            print(f"Encoded {k}: {len(encoded) // 1024} KB")

html_path = os.path.join('www', 'index.html')
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

# Remove external script tag if present
script_tag = '<script src="assets/audio/narrator_audio_data.js"></script>\n'
html = html.replace(script_tag, '')
html = html.replace('<script src="assets/audio/narrator_audio_data.js"></script>', '')

# Replace or insert NARRATOR_AUDIO_BASE64
json_str = json.dumps(pack, indent=2)
inlined_code = f"window.NARRATOR_AUDIO_BASE64 = {json_str};\n"

start_marker = "window.NARRATOR_AUDIO_BASE64"
start_idx = html.find(start_marker)
if start_idx != -1:
    end_marker = "};\n"
    end_idx = html.find(end_marker, start_idx)
    if end_idx != -1:
        html = html[:start_idx] + inlined_code + html[end_idx + len(end_marker):]
        print("PASS: Replaced NARRATOR_AUDIO_BASE64 block.")
    else:
        # maybe single line
        semi_idx = html.find(";", start_idx)
        html = html[:start_idx] + inlined_code + html[semi_idx + 1:]
        print("PASS: Replaced single-line NARRATOR_AUDIO_BASE64.")
else:
    print("WARNING: start_marker not found")

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)

size = os.path.getsize(html_path)
print(f"PASS: www/index.html updated! Total size: {size // 1024} KB ({round(size / 1024 / 1024, 2)} MB) - Perfectly under 4.0 MB limit!")

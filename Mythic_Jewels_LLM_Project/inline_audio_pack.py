import os

data_js_path = os.path.join('www', 'assets', 'audio', 'narrator_audio_data.js')
with open(data_js_path, 'r', encoding='utf-8') as f:
    js_code = f.read()

inline_script = f"<script id=\"inlined-narrator-audio\">\n{js_code}\n</script>"

files = [
    'www/index.html',
    'index.html',
    'Arkenya_Playable_Demo.html',
    os.path.join('android', 'app', 'src', 'main', 'assets', 'public', 'index.html')
]

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Remove previous external script tag if exists
    content = content.replace('<script src="assets/audio/narrator_audio_data.js"></script>', '')
    content = content.replace('<script src="./assets/audio/narrator_audio_data.js"></script>', '')

    # Insert inline_script before </head>
    if 'id="inlined-narrator-audio"' not in content:
        content = content.replace('</head>', f'{inline_script}\n</head>')
        print(f"Inlined audio into {file}")
    else:
        # Replace existing inline script
        import re
        content = re.sub(r'<script id="inlined-narrator-audio">[\s\S]*?<\/script>', inline_script, content)
        print(f"Updated inlined audio in {file}")

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print("INLINE AUDIO PACK APPLIED TO ALL TARGETS SUCCESSFULLY!")

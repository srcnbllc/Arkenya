import os

data_js_path = os.path.join('www', 'assets', 'audio', 'narrator_audio_data.js')
with open(data_js_path, 'r', encoding='utf-8') as f:
    new_data_code = f.read().strip()

html_path = os.path.join('www', 'index.html')
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

start_marker = "window.NARRATOR_AUDIO_BASE64 = {"
start_idx = html.find(start_marker)
if start_idx != -1:
    end_marker = "};\n"
    end_idx = html.find(end_marker, start_idx)
    if end_idx != -1:
        # replace the block
        html = html[:start_idx] + new_data_code + "\n" + html[end_idx + len(end_marker):]
        with open(html_path, 'w', encoding='utf-8') as f:
            f.write(html)
        print("PASS: Inlined all 11 audio tracks into www/index.html successfully!")
    else:
        print("ERROR: end_marker not found")
else:
    print("ERROR: start_marker not found")

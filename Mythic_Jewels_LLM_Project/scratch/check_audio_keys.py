import json
import re

c = open('www/assets/audio/narrator_audio_data.js', encoding='utf-8').read()
keys = re.findall(r'"([a-zA-Z0-9_-]+)":\s*"data:audio', c)
print("Keys in narrator_audio_data.js:", keys)

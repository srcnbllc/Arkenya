import base64
import os
import json

def update_base64():
    audio_keys = ["prologue", "biome_1", "biome_2", "biome_3", "biome_4", "biome_5"]
    b64_map = {}
    for key in audio_keys:
        path = f"www/assets/audio/{key}.mp3"
        if os.path.exists(path):
            with open(path, "rb") as f:
                encoded = base64.b64encode(f.read()).decode("utf-8")
                b64_map[key] = f"data:audio/mp3;base64,{encoded}"
                print(f"Encoded {key}: {len(encoded)} base64 chars")
        else:
            print(f"Warning: {path} not found")

    js_content = f"// Kadim Bilge & Mistik Anlatıcı Ses Paketi (Base64 In-Memory)\nwindow.NARRATOR_AUDIO_BASE64 = {json.dumps(b64_map, indent=2)};\n"
    
    with open("www/assets/audio/narrator_audio_data.js", "w", encoding="utf-8") as f:
        f.write(js_content)
    with open("assets/audio/narrator_audio_data.js", "w", encoding="utf-8") as f:
        f.write(js_content)
    with open("android/app/src/main/assets/public/assets/audio/narrator_audio_data.js", "w", encoding="utf-8") as f:
        f.write(js_content)
    print("Updated narrator_audio_data.js in all 3 locations!")

if __name__ == "__main__":
    update_base64()

import asyncio
import os
import json
import base64
import edge_tts

OUTPUT_DIRS = [
    os.path.join('www', 'assets', 'audio'),
    os.path.join('assets', 'audio'),
    os.path.join('android', 'app', 'src', 'main', 'assets', 'public', 'assets', 'audio'),
    os.path.join('ios', 'App', 'App', 'public', 'assets', 'audio')
]

MISSING = {
    "hero_asterion_ability.mp3": {
        "text": "Ezilmeye hazır olun!",
        "voice": "tr-TR-AhmetNeural"
    },
    "hero_thalor_victory.mp3": {
        "text": "Sarsılmaz bir zafer!",
        "voice": "tr-TR-AhmetNeural"
    },
    "hero_zeus_victory.mp3": {
        "text": "Olimpos'un mutlak zaferi!",
        "voice": "tr-TR-AhmetNeural"
    }
}

async def generate():
    for fn, cfg in MISSING.items():
        primary_path = os.path.join(OUTPUT_DIRS[0], fn)
        for attempt in range(1, 6):
            try:
                print(f"Generating {fn} (Attempt {attempt})...")
                communicator = edge_tts.Communicate(cfg["text"], cfg["voice"])
                await communicator.save(primary_path)
                with open(primary_path, "rb") as f:
                    data = f.read()
                if len(data) > 500:
                    for d in OUTPUT_DIRS[1:]:
                        with open(os.path.join(d, fn), "wb") as f:
                            f.write(data)
                    print(f"SUCCESS: {fn} ({len(data)} bytes)")
                    break
            except Exception as e:
                print(f"Retry {fn}: {e}")
                await asyncio.sleep(2.5 * attempt)
        await asyncio.sleep(1.5)

    # Base64 pack compilation
    audio_dir = os.path.join('www', 'assets', 'audio')
    pack_data = {}
    
    all_keys = [
        "prologue", "biome_1", "biome_2", "biome_3", "biome_4", "biome_5",
        "hero_arkenya_ability", "hero_arkenya_victory", "hero_arkenya_greeting",
        "hero_asterion_ability", "hero_asterion_victory", "hero_asterion_greeting",
        "hero_nyra_ability", "hero_nyra_victory", "hero_nyra_greeting",
        "hero_thalor_ability", "hero_thalor_victory", "hero_thalor_greeting",
        "hero_athena_ability", "hero_athena_victory", "hero_athena_greeting",
        "hero_zeus_ability", "hero_zeus_victory", "hero_zeus_greeting",
        "callout_combo_2", "callout_combo_3", "callout_combo_4", "callout_clutch", "callout_victory"
    ]
    
    for key in all_keys:
        fn = f"{key}.mp3"
        fp = os.path.join(audio_dir, fn)
        if os.path.exists(fp) and os.path.getsize(fp) > 500:
            with open(fp, "rb") as f:
                b64 = base64.b64encode(f.read()).decode('utf-8')
                pack_data[key] = f"data:audio/mpeg;base64,{b64}"
                print(f"Added to pack: {key} ({len(b64)} chars)")
        else:
            print(f"WARNING: Missing or empty {fn}")

    js_content = f"// Studio Quality Kadim Bilge, Kahramanlar & Kombo Audio Pack (Base64 In-Memory, RFC audio/mpeg)\nwindow.NARRATOR_AUDIO_BASE64 = {json.dumps(pack_data, indent=2)};\n"
    
    target_js_files = [
        os.path.join('www', 'assets', 'audio', 'narrator_audio_data.js'),
        os.path.join('assets', 'audio', 'narrator_audio_data.js'),
        os.path.join('android', 'app', 'src', 'main', 'assets', 'public', 'assets', 'audio', 'narrator_audio_data.js'),
        os.path.join('ios', 'App', 'App', 'public', 'assets', 'audio', 'narrator_audio_data.js')
    ]
    
    for tp in target_js_files:
        os.makedirs(os.path.dirname(tp), exist_ok=True)
        with open(tp, "w", encoding="utf-8") as f:
            f.write(js_content)
        print(f"Saved: {tp}")

if __name__ == "__main__":
    asyncio.run(generate())

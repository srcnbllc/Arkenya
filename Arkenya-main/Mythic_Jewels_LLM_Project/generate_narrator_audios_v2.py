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

for d in OUTPUT_DIRS:
    os.makedirs(d, exist_ok=True)

# Deep, mature, authentic Turkish storytelling male voice
VOICE = "tr-TR-AhmetNeural"

NARRATIONS = {
    "prologue.mp3": (
        "Dinle evlat... Kader dediğin şey, önüne serilen taşlar değildir... "
        "Kader, o taşlara vurduğun ilahi akıldır, yürektir! "
        "Olimpos'un kutsal mühürlerini uyandır ve zirveye yürü!"
    ),
    "biome_1.mp3": (
        "Gözlerini aç evlat... Kristal Vadi burası. Sessizliğe sakın aldanma; her taşın altında uyuyan kadim bir güç var. "
        "Üç taşı yan yana getirmek kolaydır... Mesele, fırtına koptuğunda o zinciri kurabilmektir! "
        "Hades'in gölgeleri kapıda bekler. Vur taşlara, ışık yayılsın vadinin bağrına!"
    ),
    "biome_2.mp3": (
        "Duyuyor musun o rüzgarı yeğen? Fırtına Kanyonu burası! "
        "Poseidon öfkesini saldı üzerimize; gök delindi, şimşekler toprağı dövüyor. "
        "Hızlı avcı Nyra katıldı safımıza. Şimdi durma zamanı değil; yıldırımı arkana alacaksın ki, karanlık kaçacak delik arasın!"
    ),
    "biome_3.mp3": (
        "Yerin yedi kat dibindeyiz şimdi... Burası korkakların değil, yüreği kor ateşle yananların mekanı. "
        "Lavlar akıyor önümüzden, taş devi Thalor duruyor yanımızda. "
        "Hades kalkan kurmuş obsidyenden... Kır o kalkanı evlat, kır ki yerin dibi bile adaleti görsün!"
    ),
    "biome_4.mp3": (
        "Nefesin buza kesiyor değil mi? Donmuş Titan Geçidi burası... "
        "Medusa'nın soğuk bakışları taş etmiş zamanı. "
        "Ama unutma evlat; hiçbir kış sonsuza dek sürmez! İçindeki inancı kaybetmezsen, en sert buzul bile bir tek kıvılcımla erir gider. Yürü zirveye doğru!"
    ),
    "biome_5.mp3": (
        "İşte geldik yolun sonuna yeğen... Olimpos'un zirvesindeyiz! "
        "Tanrılar Meclisi susmuş, seni izliyor. Bütün o dövüştüğün savaşlar, geçtiğin fırtınalar bu an içindi. "
        "Ya bir efsane olarak kalacaksın gök kubbede, ya da tarihin unuttuğu bir gölge... "
        "Şimdi vur son darbeni; Olimpos'un ebedi tahtı senin olsun!"
    )
}

async def generate():
    print(f"Generating narrative audio using {VOICE}...")
    for fn, text in NARRATIONS.items():
        primary_path = os.path.join(OUTPUT_DIRS[0], fn)
        for attempt in range(1, 6):
            try:
                print(f"-> Generating {fn} (Attempt {attempt})...")
                communicator = edge_tts.Communicate(text, VOICE)
                await communicator.save(primary_path)
                with open(primary_path, "rb") as f:
                    data = f.read()
                if len(data) > 1000:
                    for d in OUTPUT_DIRS[1:]:
                        with open(os.path.join(d, fn), "wb") as df:
                            df.write(data)
                    print(f"   ✓ SUCCESS: {fn} ({len(data)} bytes)")
                    break
            except Exception as e:
                print(f"   Retry {fn}: {e}")
                await asyncio.sleep(2.0 * attempt)
        await asyncio.sleep(1.0)

    # Re-compile the master Base64 audio pack
    print("\n--- Compiling all 29 Base64 audio assets into narrator_audio_data.js ---")
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
    
    for k in all_keys:
        fpath = os.path.join(audio_dir, k + ".mp3")
        if os.path.exists(fpath):
            with open(fpath, "rb") as f:
                b64 = base64.b64encode(f.read()).decode('utf-8')
                pack_data[k] = "data:audio/mpeg;base64," + b64
                print(f"Packed key: {k} ({os.path.getsize(fpath)} bytes)")
        else:
            print(f"WARNING: File missing for key: {k}")

    js_content = "window.NARRATOR_AUDIO_BASE64 = " + json.dumps(pack_data) + ";\n"
    
    # Save to all distribution paths
    dist_paths = [
        os.path.join('www', 'assets', 'audio', 'narrator_audio_data.js'),
        os.path.join('android', 'app', 'src', 'main', 'assets', 'public', 'assets', 'audio', 'narrator_audio_data.js'),
        os.path.join('ios', 'App', 'App', 'public', 'assets', 'audio', 'narrator_audio_data.js')
    ]
    for dp in dist_paths:
        os.makedirs(os.path.dirname(dp), exist_ok=True)
        with open(dp, 'w', encoding='utf-8') as f:
            f.write(js_content)
        print(f"Saved compiled pack: {dp} ({len(js_content)} chars, {len(pack_data)} keys)")

if __name__ == "__main__":
    asyncio.run(generate())

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

# 6 Olimpos Kahramanı + Epik Kombo Callout'ları
# Doğal insan sesi için pitch = +0Hz, rate = +0%
VOICE_SCRIPTS = {
    # --- ARKENYA (Cesur Işık Şampiyonu - Asil Kadın) ---
    "hero_arkenya_ability.mp3": {
        "text": "İlahi Işık!",
        "voice": "tr-TR-EmelNeural",
        "rate": "+0%",
        "pitch": "+0Hz"
    },
    "hero_arkenya_victory.mp3": {
        "text": "Karanlık yenildi, zafer bizim!",
        "voice": "tr-TR-EmelNeural",
        "rate": "+0%",
        "pitch": "+0Hz"
    },
    "hero_arkenya_greeting.mp3": {
        "text": "Işığın gücüyle adalet yerini bulacak!",
        "voice": "tr-TR-EmelNeural",
        "rate": "+0%",
        "pitch": "+0Hz"
    },

    # --- ASTERION (Vahşi Minotor - Güçlü Tok Erkek) ---
    "hero_asterion_ability.mp3": {
        "text": "Ezilmeye hazır olun!",
        "voice": "tr-TR-AhmetNeural",
        "rate": "+0%",
        "pitch": "+0Hz"
    },
    "hero_asterion_victory.mp3": {
        "text": "Beni hiçbir güç durduramaz!",
        "voice": "tr-TR-AhmetNeural",
        "rate": "+0%",
        "pitch": "+0Hz"
    },
    "hero_asterion_greeting.mp3": {
        "text": "Benim adım Asterion! Yolumdan çekilin!",
        "voice": "tr-TR-AhmetNeural",
        "rate": "+0%",
        "pitch": "+0Hz"
    },

    # --- NYRA (Ay Avcısı - Hızlı & Çevik Kadın) ---
    "hero_nyra_ability.mp3": {
        "text": "Hedef kilitlendi!",
        "voice": "tr-TR-EmelNeural",
        "rate": "+0%",
        "pitch": "+0Hz"
    },
    "hero_nyra_victory.mp3": {
        "text": "Sessiz ve kusursuz.",
        "voice": "tr-TR-EmelNeural",
        "rate": "+0%",
        "pitch": "+0Hz"
    },
    "hero_nyra_greeting.mp3": {
        "text": "Ay ışığı avcısının oku asla şaşmaz!",
        "voice": "tr-TR-EmelNeural",
        "rate": "+0%",
        "pitch": "+0Hz"
    },

    # --- THALOR (Taş Devi / Titan - Tok Kararlı Erkek) ---
    "hero_thalor_ability.mp3": {
        "text": "Taşın kudretini hissedin!",
        "voice": "tr-TR-AhmetNeural",
        "rate": "+0%",
        "pitch": "+0Hz"
    },
    "hero_thalor_victory.mp3": {
        "text": "Sarsılmaz bir zafer!",
        "voice": "tr-TR-AhmetNeural",
        "rate": "+0%",
        "pitch": "+0Hz"
    },
    "hero_thalor_greeting.mp3": {
        "text": "Dağların kadim gücü benimle!",
        "voice": "tr-TR-AhmetNeural",
        "rate": "+0%",
        "pitch": "+0Hz"
    },

    # --- ATHENA (Bilgelik & Strateji Tanrıçası - Kararlı Asil Kadın) ---
    "hero_athena_ability.mp3": {
        "text": "Aegis Kalkanı!",
        "voice": "tr-TR-EmelNeural",
        "rate": "+0%",
        "pitch": "+0Hz"
    },
    "hero_athena_victory.mp3": {
        "text": "Zafer akılla kazanılır!",
        "voice": "tr-TR-EmelNeural",
        "rate": "+0%",
        "pitch": "+0Hz"
    },
    "hero_athena_greeting.mp3": {
        "text": "Strateji ve bilgelik, kaba kuvveti daima yener.",
        "voice": "tr-TR-EmelNeural",
        "rate": "+0%",
        "pitch": "+0Hz"
    },

    # --- ZEUS (Olimpos'un Hükümdarı - Otoriter Erkek) ---
    "hero_zeus_ability.mp3": {
        "text": "Yıldırımlar emrimde!",
        "voice": "tr-TR-AhmetNeural",
        "rate": "+0%",
        "pitch": "+0Hz"
    },
    "hero_zeus_victory.mp3": {
        "text": "Olimpos'un mutlak zaferi!",
        "voice": "tr-TR-AhmetNeural",
        "rate": "+0%",
        "pitch": "+0Hz"
    },
    "hero_zeus_greeting.mp3": {
        "text": "Ben Zeus! Gök kubbenin tek ve ebedi hakimi!",
        "voice": "tr-TR-AhmetNeural",
        "rate": "+0%",
        "pitch": "+0Hz"
    },

    # --- EPİK KOMBO CALLOUTLARI ---
    "callout_combo_2.mp3": {
        "text": "Harika!",
        "voice": "tr-TR-AhmetNeural",
        "rate": "+0%",
        "pitch": "+0Hz"
    },
    "callout_combo_3.mp3": {
        "text": "Muhteşem vuruş!",
        "voice": "tr-TR-AhmetNeural",
        "rate": "+0%",
        "pitch": "+0Hz"
    },
    "callout_combo_4.mp3": {
        "text": "İlahi güç seninle!",
        "voice": "tr-TR-AhmetNeural",
        "rate": "+0%",
        "pitch": "+0Hz"
    },
    "callout_clutch.mp3": {
        "text": "Dikkat et, kader anı yaklaşıyor!",
        "voice": "tr-TR-AhmetNeural",
        "rate": "+0%",
        "pitch": "+0Hz"
    },
    "callout_victory.mp3": {
        "text": "Tebrikler kadim savaşçı!",
        "voice": "tr-TR-AhmetNeural",
        "rate": "+0%",
        "pitch": "+0Hz"
    }
}

async def generate_file(filename, config):
    primary_path = os.path.join(OUTPUT_DIRS[0], filename)
    for attempt in range(1, 5):
        try:
            print(f"Generating: {filename} -> '{config['text']}' (Attempt {attempt})...")
            communicator = edge_tts.Communicate(
                text=config["text"],
                voice=config["voice"],
                rate=config["rate"],
                pitch=config["pitch"]
            )
            await communicator.save(primary_path)
            
            with open(primary_path, "rb") as f:
                data = f.read()
            if len(data) > 500:
                for d in OUTPUT_DIRS[1:]:
                    with open(os.path.join(d, filename), "wb") as f:
                        f.write(data)
                print(f"  -> SUCCESS: {filename} ({len(data)} bytes)")
                return
        except Exception as e:
            print(f"  -> Warning attempt {attempt} for {filename}: {e}")
            await asyncio.sleep(1.5 * attempt)
    print(f"  -> ERROR: Failed to generate {filename}")

async def generate_all():
    print("=== SESLERİ ÜRETİYOR (EDGE-TTS 100% DOĞAL İNSAN SESİ) ===")
    for filename, cfg in VOICE_SCRIPTS.items():
        await generate_file(filename, cfg)
        await asyncio.sleep(0.8)
                
    print("✓ Tüm ses dosyaları başarıyla üretildi!")

    print("=== BASE64 SES PAKETİ DERLENİYOR (audio/mpeg RFC UYUMLU) ===")
    audio_dir = os.path.join('www', 'assets', 'audio')
    pack_data = {}
    
    all_audio_keys = [
        "prologue", "biome_1", "biome_2", "biome_3", "biome_4", "biome_5"
    ]
    for key in all_audio_keys:
        fn = f"{key}.mp3"
        fp = os.path.join(audio_dir, fn)
        if os.path.exists(fp):
            with open(fp, "rb") as f:
                b64 = base64.b64encode(f.read()).decode('utf-8')
                pack_data[key] = f"data:audio/mpeg;base64,{b64}"

    for filename in VOICE_SCRIPTS.keys():
        key = filename.replace('.mp3', '')
        fp = os.path.join(audio_dir, filename)
        if os.path.exists(fp):
            with open(fp, "rb") as f:
                b64 = base64.b64encode(f.read()).decode('utf-8')
                pack_data[key] = f"data:audio/mpeg;base64,{b64}"

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
        print(f"✓ Yazıldı: {tp}")

if __name__ == "__main__":
    asyncio.run(generate_all())

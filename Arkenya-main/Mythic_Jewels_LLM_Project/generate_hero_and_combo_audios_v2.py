import asyncio
import os
import edge_tts

OUTPUT_DIRS = [
    os.path.join('www', 'assets', 'audio'),
    os.path.join('assets', 'audio'),
    os.path.join('android', 'app', 'src', 'main', 'assets', 'public', 'assets', 'audio')
]

for d in OUTPUT_DIRS:
    os.makedirs(d, exist_ok=True)

# 6 Olimpos Kahramanı + Epik Kombo Callout Sesleri
VOICE_SCRIPTS = {
    # --- ARKENYA (Cesur Işık Savaşçısı - Asil Kadın) ---
    "hero_arkenya_ability.mp3": {
        "text": "Olimpos'un ilahi ışığı yolumuzu aydınlatsın!",
        "voice": "tr-TR-EmelNeural",
        "rate": "+0%",
        "pitch": "+0Hz"
    },
    "hero_arkenya_victory.mp3": {
        "text": "Karanlık bir kez daha geri çekildi. Zafer bizim!",
        "voice": "tr-TR-EmelNeural",
        "rate": "+0%",
        "pitch": "+0Hz"
    },

    # --- ASTERION (Vahşi Minotor - Güçlü Tok Erkek) ---
    "hero_asterion_ability.mp3": {
        "text": "Vahşi güç serbest kaldı! Ezilmeye hazır olun!",
        "voice": "tr-TR-AhmetNeural",
        "rate": "-5%",
        "pitch": "-5Hz"
    },
    "hero_asterion_victory.mp3": {
        "text": "Hiçbir zincir beni durduramaz! Zafer, boyun eğmeyenlerindir!",
        "voice": "tr-TR-AhmetNeural",
        "rate": "-5%",
        "pitch": "-5Hz"
    },

    # --- NYRA (Ay Avcısı - Hızlı & Çevik Kadın) ---
    "hero_nyra_ability.mp3": {
        "text": "Ay ışığı oku hedefi asla şaşmaz!",
        "voice": "tr-TR-EmelNeural",
        "rate": "+4%",
        "pitch": "+2Hz"
    },
    "hero_nyra_victory.mp3": {
        "text": "Sessiz ve ölümcül... Av tamamlandı.",
        "voice": "tr-TR-EmelNeural",
        "rate": "+2%",
        "pitch": "+2Hz"
    },

    # --- THALOR (Taş Devi / Titan - Çok Derin Bas Bariton) ---
    "hero_thalor_ability.mp3": {
        "text": "Yeryüzü titresin! Kadim taşın gücüne tanık olun!",
        "voice": "tr-TR-AhmetNeural",
        "rate": "-10%",
        "pitch": "-10Hz"
    },
    "hero_thalor_victory.mp3": {
        "text": "Dağlar gibi sarsılmaz... Biz yıkılmayız!",
        "voice": "tr-TR-AhmetNeural",
        "rate": "-8%",
        "pitch": "-8Hz"
    },

    # --- ATHENA (Bilgelik & Strateji Tanrıçası - Kararlı, Otoriter) ---
    "hero_athena_ability.mp3": {
        "text": "Kutsal kalkan kalktı! Zafer kaba kuvvetle değil, akılla kazanılır!",
        "voice": "tr-TR-EmelNeural",
        "rate": "-2%",
        "pitch": "-2Hz"
    },
    "hero_athena_victory.mp3": {
        "text": "Aklın ve adaletin zaferi daima kaçınılmazdır.",
        "voice": "tr-TR-EmelNeural",
        "rate": "-2%",
        "pitch": "-2Hz"
    },

    # --- ZEUS (Olimpos'un Hükümdarı - Gürleyen Tanrısal Ses) ---
    "hero_zeus_ability.mp3": {
        "text": "Şimşekler emrimde! Olimpos'un gazabını hissedin!",
        "voice": "tr-TR-AhmetNeural",
        "rate": "-5%",
        "pitch": "-8Hz"
    },
    "hero_zeus_victory.mp3": {
        "text": "Ben Zeus! Gök kubbenin tek ve ebedi hakimi!",
        "voice": "tr-TR-AhmetNeural",
        "rate": "-5%",
        "pitch": "-8Hz"
    },

    # --- EPİK KOMBO CALLOUTLARI (Türkçe Stüdyo Kalitesi) ---
    "callout_combo_2.mp3": {
        "text": "Mükemmel!",
        "voice": "tr-TR-AhmetNeural",
        "rate": "+5%",
        "pitch": "-2Hz"
    },
    "callout_combo_3.mp3": {
        "text": "Efsanevi Kombo!",
        "voice": "tr-TR-AhmetNeural",
        "rate": "+2%",
        "pitch": "-4Hz"
    },
    "callout_combo_4.mp3": {
        "text": "Tanrısal Kombo!",
        "voice": "tr-TR-AhmetNeural",
        "rate": "-2%",
        "pitch": "-6Hz"
    },
    "callout_clutch.mp3": {
        "text": "Son hamlelerin, dikkat et!",
        "voice": "tr-TR-EmelNeural",
        "rate": "-2%",
        "pitch": "-2Hz"
    }
}

async def generate_file(filename, config):
    primary_path = os.path.join(OUTPUT_DIRS[0], filename)
    if os.path.exists(primary_path) and os.path.getsize(primary_path) > 1000:
        print(f"Skipping {filename} (already exists: {os.path.getsize(primary_path)} bytes)")
        return

    for attempt in range(1, 4):
        try:
            print(f"Generating {filename} (Attempt {attempt})...")
            communicate = edge_tts.Communicate(
                config['text'],
                config['voice'],
                rate=config['rate'],
                pitch=config['pitch']
            )
            await communicate.save(primary_path)
            
            with open(primary_path, 'rb') as f:
                data = f.read()
                
            for d in OUTPUT_DIRS[1:]:
                target_path = os.path.join(d, filename)
                with open(target_path, 'wb') as out_f:
                    out_f.write(data)
                    
            print(f"  -> SUCCESS: Saved {filename} ({len(data)} bytes) to all destinations.")
            return
        except Exception as e:
            print(f"  -> Attempt {attempt} failed for {filename}: {e}")
            await asyncio.sleep(2.0)

async def generate_all():
    print(f"=== GENERATING {len(VOICE_SCRIPTS)} HERO & CALLOUT AUDIOS VIA EDGE-TTS ===")
    for filename, config in VOICE_SCRIPTS.items():
        await generate_file(filename, config)
        await asyncio.sleep(1.0)
    print("ALL HERO & CALLOUT AUDIO FILES PROCESSED SUCCESSFULLY!")

if __name__ == '__main__':
    asyncio.run(generate_all())

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

NARRATIONS = {
    "prologue.mp3": (
        "Dinle evlat... Bak ne anlatacağım sana. Dünya değişti... Toprak unuttu eski günleri, gökler unuttu tanrıların adını. "
        "Kadim Olimpos'un kutsal kristalleri çalındığında, dağlar inledi, denizler taştı. "
        "Karanlığın efendisi Hades güldü sandılar... Ama bilmedikleri bir şey vardı: "
        "Kader dediğin şey, önüne serilen taşlar değildir yeğen... Kader, o taşlara vurduğun ilahi akıldır, yürektir! "
        "Şimdi kalkanını kuşan Asterion... Bu vadi, ışığı bekler!"
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
    voice = "tr-TR-AhmetNeural"
    # Deep, cinematic, mature baritone
    rate = "-12%"
    pitch = "-16Hz"

    for filename, text in NARRATIONS.items():
        print(f"Generating {filename}...")
        communicate = edge_tts.Communicate(text, voice, rate=rate, pitch=pitch)
        
        # Save to primary directory first
        primary_path = os.path.join(OUTPUT_DIRS[0], filename)
        await communicate.save(primary_path)
        
        # Copy to the other targets
        with open(primary_path, 'rb') as f:
            data = f.read()
            
        for d in OUTPUT_DIRS[1:]:
            target_path = os.path.join(d, filename)
            with open(target_path, 'wb') as out_f:
                out_f.write(data)
                
        print(f"Saved {filename} ({len(data)} bytes) to all target directories.")

if __name__ == '__main__':
    asyncio.run(generate())

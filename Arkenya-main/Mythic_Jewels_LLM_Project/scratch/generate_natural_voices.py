import asyncio
import os
import edge_tts

VOICEOVERS = {
    "prologue": (
        '<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="tr-TR">'
        '<voice name="tr-TR-AhmetNeural">'
        '<prosody rate="-5%" pitch="-2Hz">'
        'Dinle evlat... <break time="650ms"/> '
        'Dünya değişti. <break time="500ms"/> '
        'Bunu suda hissediyorum... <break time="450ms"/> toprakta hissediyorum... <break time="550ms"/> '
        'Olimpos\'un kadim mücevherleri parçalandı. <break time="500ms"/> '
        'Şimdi kader... <break time="400ms"/> senin ellerinde.'
        '</prosody>'
        '</voice>'
        '</speak>'
    ),
    "biome_1": (
        '<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="tr-TR">'
        '<voice name="tr-TR-AhmetNeural">'
        '<prosody rate="-5%" pitch="-2Hz">'
        'Gözlerini aç yolcu... <break time="600ms"/> '
        'Burası Kristal Vadi. <break time="500ms"/> '
        'İlk adımını sağlam at ki yer sarsılmasın. <break time="550ms"/> '
        'Taşları diz, <break time="300ms"/> ışığı yak... <break time="500ms"/> '
        'Unutma evlat, sabır zaferin anasıdır.'
        '</prosody>'
        '</voice>'
        '</speak>'
    ),
    "biome_2": (
        '<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="tr-TR">'
        '<voice name="tr-TR-AhmetNeural">'
        '<prosody rate="-5%" pitch="-2Hz">'
        'Duyuyor musun o rüzgarı? <break time="600ms"/> '
        'Fırtına Kanyonu burası. <break time="500ms"/> '
        'Rüzgar sadece güçlü duranların arkasından eser. <break time="550ms"/> '
        'Hızlı düşün, <break time="350ms"/> sert vur!'
        '</prosody>'
        '</voice>'
        '</speak>'
    ),
    "biome_3": (
        '<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="tr-TR">'
        '<voice name="tr-TR-AhmetNeural">'
        '<prosody rate="-5%" pitch="-2Hz">'
        'Yerin yedi kat dibindeyiz şimdi... <break time="650ms"/> '
        'Hades\'in ayak sesleri bunlar. <break time="500ms"/> '
        'Korku iyi bir danışman değildir. <break time="550ms"/> '
        'Lavların arasından yolunu bul!'
        '</prosody>'
        '</voice>'
        '</speak>'
    ),
    "biome_4": (
        '<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="tr-TR">'
        '<voice name="tr-TR-AhmetNeural">'
        '<prosody rate="-5%" pitch="-2Hz">'
        'Nefesin buza kesiyor değil mi? <break time="600ms"/> '
        'Titanların dondurucu nefesi bu. <break time="500ms"/> '
        'Çeliği döven çekiç gibi, <break time="400ms"/> zorluk da insanı parlatır. <break time="500ms"/> İlerle!'
        '</prosody>'
        '</voice>'
        '</speak>'
    ),
    "biome_5": (
        '<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="tr-TR">'
        '<voice name="tr-TR-AhmetNeural">'
        '<prosody rate="-5%" pitch="-2Hz">'
        'İşte geldik yolun sonuna... <break time="650ms"/> '
        'Olimpos\'un doruğu burası. <break time="500ms"/> '
        'Tanrılar tahtlarından seni izliyor. <break time="550ms"/> '
        'Ya bir efsane olacaksın, <break time="400ms"/> ya da unutulup gideceksin...'
        '</prosody>'
        '</voice>'
        '</speak>'
    ),
}

async def generate():
    os.makedirs("www/assets/audio", exist_ok=True)
    os.makedirs("assets/audio", exist_ok=True)
    os.makedirs("android/app/src/main/assets/public/assets/audio", exist_ok=True)

    for key, ssml in VOICEOVERS.items():
        out_path = f"www/assets/audio/{key}.mp3"
        print(f"Generating organic narrative voice for {key}...")
        communicate = edge_tts.Communicate(ssml, voice="tr-TR-AhmetNeural")
        await communicate.save(out_path)

        # Copy to sibling audio folders
        with open(out_path, "rb") as f:
            data = f.read()
        with open(f"assets/audio/{key}.mp3", "wb") as f:
            f.write(data)
        with open(f"android/app/src/main/assets/public/assets/audio/{key}.mp3", "wb") as f:
            f.write(data)
        print(f"  [OK] Saved {key}.mp3 ({len(data)} bytes)")

if __name__ == "__main__":
    asyncio.run(generate())

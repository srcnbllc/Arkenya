import os
import asyncio
import edge_tts
import base64
import json
import re

# PURE, HUMAN-LIKE, DRAMATIC TURKISH NARRATION TEXTS
# Carefully crafted with natural punctuation (..., ,, ;, !) to evoke breathing, 
# emotional cadence and theatrical storytelling pause points.
# ZERO XML, ZERO SSML, ZERO META-TAGS, ZERO NOISE.

CLEAN_SAGAS = {
    "saga_theme_1": (
        "Gözlerini aç evlat... "
        "Milattan önce üç bin yılında, Olimpos'un ilahi zirvesinden çalınan kutsal ateş, bu topraklara düştü. "
        "Kadim mühürler kırıldı; gök yarıldı ve tanrıların kudreti mücevherlerin içine hapsoldu. "
        "Şimdi önünde uzanan bu Kristal Vadi, senin ilk büyük sınavındır. "
        "Üç kutsal taşı yan yana getir, zinciri kur ve uyanışı başlat... "
        "Çünkü kader; önüne serilen taşlar değil, o taşlara vurduğun akıl ve yürektir!"
    ),
    "saga_theme_2": (
        "İlk zaferin yankısı henüz dinmeden, yolumuz yerin yedi kat altına uzandı... "
        "Kristal Vadi'yi aştın; lâkin şimdi karşında ölüler diyarı ve Stiks Nehri uzanıyor. "
        "Sular zifiri karanlık, taşlar buz gibi soğuktur. "
        "Kharon'un kadim kayığı kıyıda beklerken, Hades'in bekçileri her köşede pusuda. "
        "Korkma evlat! Poseydon'un sularını yar, mızrağını taşa vur ve bu karanlık nehrin akışını tersine çevir!"
    ),
    "saga_theme_3": (
        "Nehrin karanlığını ardında bıraktın; lâkin ateşin ve kılıcın çağı yeni başlıyor! "
        "Göğü kızıla boyayan volkanlar patlıyor; savaş tanrısı Ares'in gazabı dağları titretiyor. "
        "Kadim titanlar zincirlerinden kurtulmak için yeri göğü sarsıyor... "
        "Şimdi tereddüt zamanı değildir! "
        "Şimşekleri kuşan, patlamalarla tahtayı inlet. "
        "Olimpos'un ebedi kaderi, bu kızıl savaş meydanında yazılacak!"
    ),
    "saga_theme_4": (
        "Ateş fırtınasını geçtin; fakat zirveye giden yol, zamanın bile donduğu bu amansız labirentten geçiyor. "
        "Gorgon Medusa'nın soğuk bakışları altında taşlar kaskatı kesilmiş... "
        "En ufak bir dikkatsizlik, seni de sonsuz bir buz heykeline çevirebilir. "
        "Zihnini toparla, Athena'nın bilgeliğini kalkan yap! "
        "Hamlelerini sabırla hesapla ve donmuş buzları parçalayarak ilahi kapıyı arala!"
    ),
    "saga_theme_5": (
        "İşte geldik yolun sonuna... "
        "Bulutları yaran Olimpos'un altın zirvesi gözlerinin önünde parıldıyor. "
        "Ancak kutsal tahtın üzerinde, zamanın efendisi titan Kronos seni bekliyor... "
        "Bu son savaş; yalnızca senin değil, tüm tanrıların ve ölümlülerin savaşıdır. "
        "Kalbindeki sönmeyen inancı taşlara vur, gök gürültüsünü çağır ve altın tacı başına tak. "
        "Zafer senin ellerinde evlat... Efsaneni tamamla!"
    ),
    "prologue": (
        "Dinle evlat... Dünya değişti. "
        "Bunu suda hissediyorum... Toprakta hissediyorum... "
        "Olimpos'un kadim mücevherleri parçalandı ve kadim bir karanlık uyandı. "
        "Şimdi bu efsanevi topraklarda ışığı yeniden yakmak, senin ellerinde!"
    ),
    "biome_1": (
        "Gözlerini aç yolcu... Burası Kristal Vadi. "
        "İlk adımını sağlam at ki yer sarsılmasın. "
        "Taşları diz, ışığı yak... Unutma evlat, sabır zaferin anasıdır."
    ),
    "biome_2": (
        "Duyuyor musun o rüzgarı? Fırtına Kanyonu burası! "
        "Rüzgar sadece güçlü duranların arkasından eser. "
        "Hızlı düşün, sert vur ve fırtınayı yönet!"
    ),
    "biome_3": (
        "Yerin yedi kat dibindeyiz şimdi... "
        "Hades'in ayak sesleri yankılanıyor. "
        "Korku iyi bir danışman değildir evlat; lavların arasından yolunu bul ve ilerle!"
    ),
    "biome_4": (
        "Nefesin buza kesiyor değil mi? "
        "Titanların dondurucu nefesi bu labirenti sardı. "
        "Çeliği döven çekiç gibi, zorluk da insanı parlatır. İlerle ve buzları kır!"
    ),
    "biome_5": (
        "İşte geldik yolun sonuna... Olimpos'un doruğu burası. "
        "Tanrılar tahtlarından seni izliyor. "
        "Ya bir efsane olacaksın, ya da unutulup gideceksin... Göster kendini!"
    )
}

OUTPUT_DIRS = [
    os.path.join("www", "assets", "audio"),
    os.path.join("assets", "audio"),
    os.path.join("android", "app", "src", "main", "assets", "public", "assets", "audio")
]

for d in OUTPUT_DIRS:
    os.makedirs(d, exist_ok=True)

async def generate_all_clean_audios():
    print("=== GENERATING STUDIO-QUALITY CLEAN TURKISH NARRATION AUDIOS ===")
    b64_map = {}

    for key, text in CLEAN_SAGAS.items():
        print(f"\n[+] Generating {key}...")
        primary_file = os.path.join("www", "assets", "audio", f"{key}.mp3")

        # Microsoft Neural Voice: tr-TR-AhmetNeural (Deep, warm, natural audiobook dubbing tone)
        # rate: -4% for contemplative, deliberate epic cadence
        # pitch: -1Hz for grounded, masculine warmth
        # NO SSML TAGS AT ALL
        comm = edge_tts.Communicate(
            text=text,
            voice="tr-TR-AhmetNeural",
            rate="-4%",
            pitch="-1Hz"
        )
        await comm.save(primary_file)
        
        with open(primary_file, "rb") as f:
            audio_bytes = f.read()

        size_kb = len(audio_bytes) // 1024
        print(f"    Clean MP3 saved: {size_kb} KB")

        # Copy to other targets
        for out_dir in OUTPUT_DIRS[1:]:
            target_path = os.path.join(out_dir, f"{key}.mp3")
            with open(target_path, "wb") as f:
                f.write(audio_bytes)

        # Base64 encode for in-memory offline instant playback
        encoded = base64.b64encode(audio_bytes).decode("ascii")
        b64_map[key] = f"data:audio/mp3;base64,{encoded}"

    # Build updated narrator_audio_data.js
    js_content = f"// Destansı Hikaye ve Anlatıcı Ses Paketi (Base64 In-Memory Offline)\nwindow.NARRATOR_AUDIO_BASE64 = {json.dumps(b64_map, indent=2)};\n"
    
    js_paths = [
        os.path.join("www", "assets", "audio", "narrator_audio_data.js"),
        os.path.join("assets", "audio", "narrator_audio_data.js"),
        os.path.join("android", "app", "src", "main", "assets", "public", "assets", "audio", "narrator_audio_data.js")
    ]
    for jp in js_paths:
        with open(jp, "w", encoding="utf-8") as f:
            f.write(js_content)
        print(f"[OK] Saved {jp}")

    # Now inline into the 4 html targets
    inline_script = f"<script id=\"inlined-narrator-audio\">\n{js_content}\n</script>"
    html_targets = [
        "www/index.html",
        "index.html",
        "Arkenya_Playable_Demo.html",
        os.path.join("android", "app", "src", "main", "assets", "public", "index.html")
    ]

    for hpath in html_targets:
        if not os.path.exists(hpath):
            continue
        with open(hpath, "r", encoding="utf-8") as f:
            content = f.read()

        if 'id="inlined-narrator-audio"' in content:
            content = re.sub(r'<script id="inlined-narrator-audio">[\s\S]*?<\/script>', inline_script, content)
        else:
            content = content.replace('</head>', f'{inline_script}\n</head>')

        with open(hpath, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"[OK] Inlined clean base64 pack into {hpath}")

    print("\n>>> ALL CLEAN NARRATION AUDIOS GENERATED & INLINED SUCCESSFULLY! <<<")

if __name__ == "__main__":
    asyncio.run(generate_all_clean_audios())

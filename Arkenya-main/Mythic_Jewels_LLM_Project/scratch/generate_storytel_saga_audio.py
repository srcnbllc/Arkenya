import os
import asyncio
import edge_tts

# High-Precision Storytel-grade Turkish SSML Scripting
# - Dignified pacing: rate='-9%'
# - Resonant elder baritone: pitch='-3.5Hz'
# - Natural human pauses & breath intervals
# - 100% Correct Turkish phrasing, phonetics, and grammar (No abbreviations)

STORYTEL_SAGAS = {
    "saga_theme_1": (
        "<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='tr-TR'>"
        "<voice name='tr-TR-AhmetNeural'>"
        "<prosody rate='-9%' pitch='-3.5Hz'>"
        "Gözlerini aç evlat... <break time='750ms'/> "
        "Milattan Önce üç bin yılında, <break time='350ms'/> "
        "Olimpos'un ilahi zirvesinden çalınan kutsal ateş, <break time='250ms'/> bu topraklara düştü. <break time='700ms'/> "
        "Kadim mühürler kırıldı, <break time='300ms'/> gök yarıldı <break time='300ms'/> "
        "ve tanrıların gücü mücevherlerin içine hapsoldu. <break time='750ms'/> "
        "Şimdi önünde uzanan bu Kristal Vadi, <break time='250ms'/> senin ilk sınavındır. <break time='600ms'/> "
        "Üç kutsal taşı yan yana getir, <break time='250ms'/> zinciri kur ve uyanışı başlat! <break time='700ms'/> "
        "Unutma... <break time='400ms'/> "
        "Kader dediğin, <break time='250ms'/> önüne serilen taşlar değil; <break time='400ms'/> "
        "o taşlara vurduğun akıl ve yürektir!"
        "</prosody>"
        "</voice>"
        "</speak>"
    ),
    "saga_theme_2": (
        "<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='tr-TR'>"
        "<voice name='tr-TR-AhmetNeural'>"
        "<prosody rate='-9%' pitch='-3.5Hz'>"
        "İlk zaferin yankısı henüz dinmeden, <break time='400ms'/> "
        "yolumuz yerin yedi kat altına uzandı. <break time='750ms'/> "
        "Kristal Vadi'yi aştın; <break time='300ms'/> "
        "lâkin şimdi karşında ölüler diyarı ve Stiks Nehri uzanıyor... <break time='700ms'/> "
        "Sular zifiri karanlık, <break time='300ms'/> taşlar buz gibi soğuktur. <break time='650ms'/> "
        "Karon'un kadim kayığı kıyıda beklerken, <break time='350ms'/> "
        "Hades'in bekçileri her köşede pusuda! <break time='700ms'/> "
        "Korkma! <break time='500ms'/> "
        "Poseydon'un sularını yar, <break time='300ms'/> "
        "mızrağın gücünü taşlara vur ve karanlık nehrin akışını tersine çevir!"
        "</prosody>"
        "</voice>"
        "</speak>"
    ),
    "saga_theme_3": (
        "<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='tr-TR'>"
        "<voice name='tr-TR-AhmetNeural'>"
        "<prosody rate='-9%' pitch='-3.5Hz'>"
        "Nehrin karanlığını ardında bıraktın; <break time='450ms'/> "
        "lâkin ateşin ve kılıcın çağı yeni başlıyor! <break time='750ms'/> "
        "Göğü kızıla boyayan volkanlar patlıyor; <break time='350ms'/> "
        "savaş tanrısı Ares'in öfkesi vadileri titretiyor. <break time='650ms'/> "
        "Kadim titanlar, <break time='250ms'/> zincirlerinden kurtulmak için tahtayı sarsıyor. <break time='700ms'/> "
        "Şimdi tereddüt zamanı değildir! <break time='550ms'/> "
        "Şimşekleri kuşan, <break time='300ms'/> "
        "dörtlü ve beşli patlamalarla yeri göğü inlet! <break time='650ms'/> "
        "Olimpos'un kaderi, <break time='250ms'/> bu kızıl savaş meydanında yazılacak!"
        "</prosody>"
        "</voice>"
        "</speak>"
    ),
    "saga_theme_4": (
        "<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='tr-TR'>"
        "<voice name='tr-TR-AhmetNeural'>"
        "<prosody rate='-9%' pitch='-3.5Hz'>"
        "Ateş fırtınasını geçtin; <break time='400ms'/> "
        "fakat zirveye giden yol, <break time='250ms'/> "
        "zamanın bile donduğu bu amansız labirentten geçiyor. <break time='750ms'/> "
        "Gorgon Medusa'nın bakışları altındaki taşlar kaskatı kesilmiş... <break time='700ms'/> "
        "En ufak bir dikkatsizlik, <break time='300ms'/> "
        "seni de sonsuz bir taş heykele çevirebilir. <break time='650ms'/> "
        "Zihnini toparla, <break time='300ms'/> "
        "tanrıça Athena'nın bilgeliğini kalkan yap! <break time='550ms'/> "
        "Hamlelerini iyi hesapla <break time='300ms'/> "
        "ve donmuş buzları parçalayarak ilahi kapıyı arala!"
        "</prosody>"
        "</voice>"
        "</speak>"
    ),
    "saga_theme_5": (
        "<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='tr-TR'>"
        "<voice name='tr-TR-AhmetNeural'>"
        "<prosody rate='-9%' pitch='-3.5Hz'>"
        "İşte geldik yolun sonuna... <break time='800ms'/> "
        "Bulutları yaran Olimpos'un altın zirvesi gözlerinin önünde parıldıyor. <break time='750ms'/> "
        "Ancak kutsal tahtın üzerinde, <break time='300ms'/> "
        "zamanın efendisi titan Kronos bekliyor... <break time='700ms'/> "
        "Bu son savaş, <break time='250ms'/> yalnızca senin değil; <break time='350ms'/> "
        "tüm tanrıların ve ölümlülerin savaşıdır! <break time='650ms'/> "
        "Kalbindeki inancı son taşlara vur, <break time='300ms'/> "
        "gök gürültüsünü çağır ve altın zafer tacını kuşan! <break time='700ms'/> "
        "Zafer senin ellerinde evlat; <break time='400ms'/> efsaneni tamamla!"
        "</prosody>"
        "</voice>"
        "</speak>"
    )
}

output_dirs = [
    os.path.join("www", "assets", "audio"),
    os.path.join("assets", "audio"),
    os.path.join("android", "app", "src", "main", "assets", "public", "assets", "audio")
]

async def generate():
    for name, ssml in STORYTEL_SAGAS.items():
        primary_file = os.path.join("www", "assets", "audio", f"{name}.mp3")
        print(f"Generating Storytel-grade voice for {name}...")
        communicate = edge_tts.Communicate(text=ssml, voice="tr-TR-AhmetNeural")
        await communicate.save(primary_file)
        size = os.path.getsize(primary_file)
        print(f"  -> Generated: {primary_file} ({size // 1024} KB)")

        # Copy to other directories
        with open(primary_file, "rb") as f:
            data = f.read()
        for d in output_dirs[1:]:
            target_path = os.path.join(d, f"{name}.mp3")
            with open(target_path, "wb") as f:
                f.write(data)
            print(f"  -> Synced to: {target_path}")

if __name__ == "__main__":
    asyncio.run(generate())

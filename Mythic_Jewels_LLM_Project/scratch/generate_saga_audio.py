import os
import asyncio
import edge_tts

# Continuous Epic Turkish Saga Chapters (Tolkien / Mythological style)
# Absolutely no confusing acronyms (spelled out: Milattan Önce, etc.)
# Flawless Turkish phonetic spelling for gods and places
SAGAS = {
    "saga_theme_1": (
        "<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='tr-TR'>"
        "<voice name='tr-TR-AhmetNeural'>"
        "<prosody rate='-5%' pitch='-2Hz'>"
        "Gözlerini aç evlat... <break time='600ms'/>"
        "Milattan Önce üç bin yılında, <break time='300ms'/> "
        "Olimpos'un ilahi zirvesinden çalınan kutsal ateş, bu topraklara düştü. <break time='500ms'/> "
        "Kadim mühürler kırıldı, gök yarıldı ve tanrıların gücü mücevherlerin içine hapsoldu. <break time='600ms'/> "
        "Şimdi önünde uzanan bu Kristal Vadi, senin ilk sınavındır. <break time='400ms'/> "
        "Üç kutsal taşı yan yana getir, zinciri kur ve uyanışı başlat. <break time='500ms'/> "
        "Çünkü kader, önüne serilen taşlar değil; o taşlara vurduğun akıl ve yürektir!"
        "</prosody>"
        "</voice>"
        "</speak>"
    ),
    "saga_theme_2": (
        "<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='tr-TR'>"
        "<voice name='tr-TR-AhmetNeural'>"
        "<prosody rate='-5%' pitch='-2Hz'>"
        "İlk zaferin yankısı henüz dinmeden, <break time='400ms'/> yolumuz yerin yedi kat altına uzandı. <break time='600ms'/> "
        "Kristal Vadi'yi aştın; lâkin şimdi karşında ölüler diyarı ve Stiks Nehri uzanıyor. <break time='500ms'/> "
        "Sular zifiri karanlık, taşlar buz gibi soğuktur. <break time='500ms'/> "
        "Karon'un kadim kayığı kıyıda beklerken, Hades'in bekçileri her köşede pusuda. <break time='600ms'/> "
        "Korkma! Poseydon'un sularını yar, mızrağın gücünü taşlara vur ve karanlık nehrin akışını tersine çevir!"
        "</prosody>"
        "</voice>"
        "</speak>"
    ),
    "saga_theme_3": (
        "<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='tr-TR'>"
        "<voice name='tr-TR-AhmetNeural'>"
        "<prosody rate='-5%' pitch='-2Hz'>"
        "Nehrin karanlığını ardında bıraktın; <break time='400ms'/> lâkin ateşin ve kılıcın çağı yeni başlıyor! <break time='600ms'/> "
        "Göğü kızıla boyayan volkanlar patlıyor; savaş tanrısı Ares'in öfkesi vadileri titretiyor. <break time='500ms'/> "
        "Kadim titanlar zincirlerinden kurtulmak için tahtayı sarsıyor. <break time='500ms'/> "
        "Şimdi tereddüt zamanı değildir! <break time='400ms'/> "
        "Şimşekleri kuşan, dörtlü ve beşli patlamalarla yeri göğü inlet. <break time='500ms'/> "
        "Olimpos'un kaderi bu kızıl savaş meydanında yazılacak!"
        "</prosody>"
        "</voice>"
        "</speak>"
    ),
    "saga_theme_4": (
        "<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='tr-TR'>"
        "<voice name='tr-TR-AhmetNeural'>"
        "<prosody rate='-5%' pitch='-2Hz'>"
        "Ateş fırtınasını geçtin; <break time='400ms'/> fakat zirveye giden yol, zamanın bile donduğu bu amansız labirentten geçiyor. <break time='600ms'/> "
        "Gorgon Medusa'nın bakışları altındaki taşlar kaskatı kesilmiş. <break time='500ms'/> "
        "En ufak bir dikkatsizlik, seni de sonsuz bir taş heykele çevirebilir. <break time='500ms'/> "
        "Zihnini toparla, Athena'nın bilgeliğini kalkan yap! <break time='400ms'/> "
        "Hamlelerini iyi hesapla ve donmuş buzları parçalayarak ilahi kapıyı arala!"
        "</prosody>"
        "</voice>"
        "</speak>"
    ),
    "saga_theme_5": (
        "<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='tr-TR'>"
        "<voice name='tr-TR-AhmetNeural'>"
        "<prosody rate='-5%' pitch='-2Hz'>"
        "İşte geldik yolun sonuna... <break time='600ms'/> "
        "Bulutları yaran Olimpos'un altın zirvesi gözlerinin önünde parıldıyor. <break time='600ms'/> "
        "Ancak kutsal tahtın üzerinde, zamanın efendisi titan Kronos bekliyor. <break time='600ms'/> "
        "Bu son savaş, yalnızca senin değil; tüm tanrıların ve ölümlülerin savaşıdır. <break time='500ms'/> "
        "Kalbindeki inancı son taşlara vur, gök gürültüsünü çağır ve altın tacı başına tak. <break time='500ms'/> "
        "Zafer senin ellerinde evlat; efsaneni tamamla!"
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

for d in output_dirs:
    os.makedirs(d, exist_ok=True)

async def generate():
    for name, ssml in SAGAS.items():
        primary_file = os.path.join("www", "assets", "audio", f"{name}.mp3")
        print(f"Generating {name}...")
        communicate = edge_tts.Communicate(text=ssml, voice="tr-TR-AhmetNeural")
        await communicate.save(primary_file)
        size = os.path.getsize(primary_file)
        print(f"  Saved {primary_file} ({size // 1024} KB)")

        # Copy to other directories
        with open(primary_file, "rb") as f:
            data = f.read()
        for d in output_dirs[1:]:
            target_path = os.path.join(d, f"{name}.mp3")
            with open(target_path, "wb") as f:
                f.write(data)
            print(f"  Copied to {target_path}")

if __name__ == "__main__":
    asyncio.run(generate())

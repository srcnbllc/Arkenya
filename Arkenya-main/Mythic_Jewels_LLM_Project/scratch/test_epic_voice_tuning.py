import asyncio
import edge_tts
import os

# Test 3 different dramatic/theatrical styles for AhmetNeural:
# Style A: Heavy, slow, grave elder (Gandalf / Ancient Sage)
# Style B: Resonant, commanding, trailer style (LOTR Narrator)
# Style C: Whispered solemn mystery (Storytel opening)

text = (
    "Gözlerini aç evlat... Milattan Önce üç bin yılında, "
    "Olimpos'un ilahi zirvesinden çalınan kutsal ateş bu topraklara düştü. "
    "Kadim mühürler kırıldı, gök yarıldı ve tanrıların gücü mücevherlerin içine hapsoldu!"
)

STYLES = {
    "style_a_sage": (
        "<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='tr-TR'>"
        "<voice name='tr-TR-AhmetNeural'>"
        "<prosody rate='-12%' pitch='-4Hz' volume='+5%'>"
        "Gözlerini aç evlat... <break time='750ms'/> "
        "Milattan Önce üç bin yılında... <break time='600ms'/> "
        "Olimpos'un ilahi zirvesinden çalınan kutsal ateş, <break time='400ms'/> bu topraklara düştü. <break time='750ms'/> "
        "Kadim mühürler kırıldı! <break time='500ms'/> Gök yarıldı... <break time='600ms'/> "
        "Ve tanrıların gücü, mücevherlerin içine hapsoldu! <break time='700ms'/> "
        "Şimdi kader senin ellerinde..."
        "</prosody>"
        "</voice>"
        "</speak>"
    ),
    "style_b_epic": (
        "<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='tr-TR'>"
        "<voice name='tr-TR-AhmetNeural'>"
        "<prosody rate='-7%' pitch='-2.5Hz'>"
        "Gözlerini aç evlat! <break time='600ms'/> "
        "Milattan Önce üç bin yılında... <break time='500ms'/> "
        "Olimpos'un ilahi zirvesinden çalınan kutsal ateş, bu topraklara düştü! <break time='700ms'/> "
        "Kadim mühürler kırıldı, gök yarıldı... <break time='600ms'/> "
        "Ve tanrıların gücü mücevherlerin içine hapsoldu! <break time='600ms'/> "
        "Kader, önüne serilen taşlar değil; o taşlara vurduğun akıl ve yürektir!"
        "</prosody>"
        "</voice>"
        "</speak>"
    )
}

async def run_tests():
    for name, ssml in STYLES.items():
        out = f"scratch/{name}.mp3"
        comm = edge_tts.Communicate(text=ssml, voice="tr-TR-AhmetNeural")
        await comm.save(out)
        print(f"Generated {out}: {os.path.getsize(out)} bytes")

if __name__ == '__main__':
    asyncio.run(run_tests())

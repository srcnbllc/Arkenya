import asyncio
import edge_tts
import os

sample_text = (
    "Gözlerini aç evlat... "
    "Milattan önce üç bin yılında, Olimpos'un ilahi zirvesinden çalınan kutsal ateş, bu topraklara düştü. "
    "Kadim mühürler kırıldı; gök yarıldı ve tanrıların kudreti mücevherlerin içine hapsoldu. "
    "Şimdi önünde uzanan bu Kristal Vadi, senin ilk sınavındır. "
    "Üç kutsal taşı yan yana getir, zinciri kur ve uyanışı başlat. "
    "Çünkü kader... Önüne serilen taşlar değil; o taşlara vurduğun akıl ve yürektir!"
)

async def test():
    out = "scratch/test_clean_dubbing.mp3"
    comm = edge_tts.Communicate(sample_text, voice="tr-TR-AhmetNeural", rate="-5%", pitch="-1Hz")
    await comm.save(out)
    print("Saved clean dubbing test to", out, "size:", os.path.getsize(out))

asyncio.run(test())

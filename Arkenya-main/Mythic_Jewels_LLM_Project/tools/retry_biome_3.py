import asyncio
import os
import edge_tts

text = (
    "Yerin yedi kat dibindeyiz şimdi... "
    "Burası korkakların değil, yüreği kor ateşle yananların mekanı. "
    "Lavlar akıyor önümüzden... Taş devi Thalor duruyor yanımızda. "
    "Hades kalkan kurmuş obsidyenden... Kır o kalkanı evlat, kır ki yerin dibi bile adaleti görsün!"
)

async def main():
    communicate = edge_tts.Communicate(text, "tr-TR-AhmetNeural")
    out_file = os.path.join('www', 'assets', 'audio', 'biome_3.mp3')
    await communicate.save(out_file)
    print(f"Biome 3 saved: {os.path.getsize(out_file)} bytes")

asyncio.run(main())

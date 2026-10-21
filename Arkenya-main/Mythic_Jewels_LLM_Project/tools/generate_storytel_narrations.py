import asyncio
import os
import sys
import base64
import json
import edge_tts

# Storytel-grade dramatic pauses, pacing and breath intervals
STORYTEL_NARRATIONS = {
    "prologue": (
        "Dinle evlat... "
        "Kader dediğin şey... önüne serilen taşlar değildir. "
        "Kader... o taşlara vurduğun ilahi akıldır, yürektir! "
        "Olimpos'un kutsal mühürlerini uyandır... ve zirveye yürü!"
    ),
    "biome_1": (
        "Gözlerini aç evlat... Kristal Vadi burası. "
        "Sessizliğe sakın aldanma... Her taşın altında uyuyan kadim bir güç var. "
        "Üç taşı yan yana getirmek kolaydır... Mesele, fırtına koptuğunda o zinciri kurabilmektir! "
        "Hades'in gölgeleri kapıda bekler... Vur taşlara... ışık yayılsın vadinin bağrına!"
    ),
    "biome_2": (
        "Duyuyor musun o rüzgarı yeğen? Fırtına Kanyonu burası! "
        "Poseidon öfkesini saldı üzerimize... Gök delindi, şimşekler toprağı dövüyor. "
        "Hızlı avcı Nyra katıldı safımıza. Şimdi durma zamanı değil... Yıldırımı arkana alacaksın ki, karanlık kaçacak delik arasın!"
    ),
    "biome_3": (
        "Yerin yedi kat dibindeyiz şimdi... "
        "Burası korkakların değil, yüreği kor ateşle yananların mekanı! "
        "Lavlar akıyor önümüzden... Taş devi Thalor duruyor yanımızda. "
        "Hades kalkan kurmuş obsidyenden... Kır o kalkanı evlat! Kır ki yerin dibi bile adaleti görsün!"
    ),
    "biome_4": (
        "Nefesin buza kesiyor değil mi? Donmuş Titan Geçidi burası... "
        "Medusa'nın soğuk bakışları... taş etmiş zamanı. "
        "Ama unutma evlat... Hiçbir kış sonsuza dek sürmez! "
        "İçindeki inancı kaybetmezsen... en sert buzul bile bir tek kıvılcımla erir gider. Yürü zirveye doğru!"
    ),
    "biome_5": (
        "İşte geldik yolun sonuna yeğen... Olimpos'un zirvesindeyiz! "
        "Tanrılar Meclisi susmuş... seni izliyor. "
        "Bütün o dövüştüğün savaşlar, geçtiğin fırtınalar... bu an içindi. "
        "Ya bir efsane olarak kalacaksın gök kubbede... ya da tarihin unuttuğu bir gölge... "
        "Şimdi vur son darbeni! Olimpos'un ebedi tahtı senin olsun!"
    )
}

VOICE = "tr-TR-AhmetNeural"

async def generate_single(key, text):
    out_dir = os.path.join('www', 'assets', 'audio')
    os.makedirs(out_dir, exist_ok=True)
    out_file = os.path.join(out_dir, f"{key}.mp3")
    
    print(f"Synthesizing {key}...", flush=True)
    communicate = edge_tts.Communicate(text, VOICE)
    await communicate.save(out_file)
    size = os.path.getsize(out_file)
    print(f"Saved {out_file} ({size} bytes)", flush=True)
    return out_file

async def main():
    print("=== GENERATING STORYTEL-STYLE DRAMATIC TURKISH NARRATOR VOICES ===", flush=True)
    for key, text in STORYTEL_NARRATIONS.items():
        try:
            await generate_single(key, text)
            await asyncio.sleep(0.5)
        except Exception as e:
            print(f"Error generating {key}: {e}", flush=True)
            
    print("All narration audios generated successfully!", flush=True)

if __name__ == "__main__":
    asyncio.run(main())

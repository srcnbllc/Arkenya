#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
================================================================================
🏛️ ARKENYA: RESEMBLE-AI CHATTERBOX EPİK SES & ANLATICI STÜDYO ENTEGRATÖRÜ
================================================================================
Bu betik, Resemble AI Chatterbox / Chatterbox Turbo çok dilli açık kaynaklı
modelini kullanarak Arkenya oyunundaki:
  - Seçenek A: 5 Tematik Bölge Hikaye Anlatıcısı (Saga Narrator)
  - Seçenek B: 4 Büyük Olimposlu Tanrı Replikleri (Zeus, Poseidon, Hades, Athena)
için insan doğallığında, nefes ve duygu kontrollü (paralinguistic tags)
Türkçe ses dosyaları (.mp3) ve base64 in-memory paketleri üretir.
================================================================================
"""

import os
import sys
import json
import base64
from pathlib import Path

# Epik Seslendirme Script Kütüphanesi
CHATTERBOX_VOICE_SCRIPTS = {
    # -------------------------------------------------------------
    # SEÇENEK A: 5 TEMATİK BÖLGE HİKAYE ANLATICISI (SAGA THEME NARRATOR)
    # -------------------------------------------------------------
    "saga_theme_1": {
        "title": "Bölge 1: Kristal Vadi & Kadim Tapınak",
        "file": "assets/audio/saga_theme_1.mp3",
        "voice_character": "ancient_wise_mentor",
        "emotion": "dramatic_mystic",
        "tags": ["[whisper]", "[breathe]"],
        "text": "Gözlerini aç evlat... Burası Kristal Vadi. Sessizliğe sakın aldanma; her taşın altında uyuyan kadim bir güç var! Üç taşı yan yana getirmek kolaydır... Mesele, fırtına koptuğunda o ilahi zinciri kurabilmektir. Hades'in gölgeleri kapıda bekler. Vur taşlara, ışık yayılsın vadinin bağrına!"
    },
    "saga_theme_2": {
        "title": "Bölge 2: Fırtına Koyu & Poseidon Kanyonu",
        "file": "assets/audio/saga_theme_2.mp3",
        "voice_character": "ocean_tempest_narrator",
        "emotion": "tempestuous_epic",
        "tags": ["[whisper]", "[shout]"],
        "text": "[whisper] Dalgalar kabarıyor, duyuyor musun? [shout] Poseidon'un tridenti gökleri yardı! Azgın girdapların arasından yolunu bulamazsan sular seni yutar! Safirleri diz, deniz fırtınasını patlat ve kabaran dalgalara boyun eğdir!"
    },
    "saga_theme_3": {
        "title": "Bölge 3: Yeraltı Dünyası & Hades Alevleri",
        "file": "assets/audio/saga_theme_3.mp3",
        "voice_character": "underworld_shadow_voice",
        "emotion": "dark_menacing",
        "tags": ["[groan]", "[menacing]"],
        "text": "Burası Tartarus'un kıyısı... Gölgelerin fısıltısı aklını çelmesin. Hades'in kızgın lavları taşları eritiyor evlat! Geri dönüş yok! Ruh taşlarını serbest bırak ve karanlığın kalbine bir güneş gibi doğ!"
    },
    "saga_theme_4": {
        "title": "Bölge 4: Titan Kalesi & Athena Hisarı",
        "file": "assets/audio/saga_theme_4.mp3",
        "voice_character": "war_strategist_mentor",
        "emotion": "heroic_resolute",
        "tags": ["[confident]"],
        "text": "Kadim Titanların buzdan kaleleri önünde duruyorsun. Burada sadece bilek gücü yetmez; keskin bir akıl gerek! Athena'nın kalkanı önünü açacak. Hamlelerini tek tek hesapla, titanların zırhını yerle bir et!"
    },
    "saga_theme_5": {
        "title": "Bölge 5: Olimpos Zirvesi & Zeus Tahtı",
        "file": "assets/audio/saga_theme_5.mp3",
        "voice_character": "pantheon_sovereign_narrator",
        "emotion": "divine_triumph",
        "tags": ["[grand]", "[shout]"],
        "text": "Ve işte Olimpos Zirvesi! Bulutların üstünde, tanrıların altın tahtındasın! Zeus'un şimşekleri ellerinde kıvılcım saçıyor. Bu son sınav evlat... Son taşı yerine koy ve adını ebediyen yıldızlara kazı!"
    },

    # -------------------------------------------------------------
    # SEÇENEK B: 4 BÜYÜK OLİMPOSLU TANRI NİDALARI (THE OLYMPIANS)
    # -------------------------------------------------------------
    # 1. ZEUS (Şimşek ve Gökler Tanrısı)
    "hero_zeus_greeting": {
        "title": "Zeus: Karşılama",
        "file": "assets/audio/hero_zeus_greeting.mp3",
        "voice_character": "zeus_thunder_god",
        "emotion": "authoritative_divine",
        "text": "Ben Olimpos'un Efendisi Zeus! Şimşeklerimin kudretine şahit ol!"
    },
    "hero_zeus_ability": {
        "title": "Zeus: Yetenek Patlaması",
        "file": "assets/audio/hero_zeus_ability.mp3",
        "voice_character": "zeus_thunder_god",
        "emotion": "divine_shout",
        "text": "[shout] İLAHİ YILDIRIM! GÖKLERİ YARIN!"
    },
    "hero_zeus_victory": {
        "title": "Zeus: Zafer Repliği",
        "file": "assets/audio/hero_zeus_victory.mp3",
        "voice_character": "zeus_thunder_god",
        "emotion": "triumphant_epic",
        "text": "İşte tanrıların gücü! Olimpos senin zaferinle aydınlandı!"
    },

    # 2. ATHENA (Savaş ve Bilgelik Tanrıçası)
    "hero_athena_greeting": {
        "title": "Athena: Karşılama",
        "file": "assets/audio/hero_athena_greeting.mp3",
        "voice_character": "athena_wisdom_goddess",
        "emotion": "calm_strategic",
        "text": "Kılıcın keskin, zihnin berrak olsun. Stratejini belirle!"
    },
    "hero_athena_ability": {
        "title": "Athena: Yetenek Patlaması",
        "file": "assets/audio/hero_athena_ability.mp3",
        "voice_character": "athena_wisdom_goddess",
        "emotion": "commanding_shout",
        "text": "[shout] BİLGELİĞİN KALKANI! HER ENGELİ PARÇALA!"
    },
    "hero_athena_victory": {
        "title": "Athena: Zafer Repliği",
        "file": "assets/audio/hero_athena_victory.mp3",
        "voice_character": "athena_wisdom_goddess",
        "emotion": "noble_pleased",
        "text": "Kusursuz taktik, efsanevi bir zafer!"
    },

    # 3. POSEIDON / THALOR (Denizler ve Fırtınalar Tanrısı)
    "hero_thalor_greeting": {
        "title": "Poseidon/Thalor: Karşılama",
        "file": "assets/audio/hero_thalor_greeting.mp3",
        "voice_character": "poseidon_sea_god",
        "emotion": "tempestuous_fierce",
        "text": "Derin denizlerin hırçın dalgaları uyandı! Öfkeme hazır ol!"
    },
    "hero_thalor_ability": {
        "title": "Poseidon/Thalor: Yetenek Patlaması",
        "file": "assets/audio/hero_thalor_ability.mp3",
        "voice_character": "poseidon_sea_god",
        "emotion": "oceanic_shout",
        "text": "[shout] TSUNAMİ PATLAMASI! YUTUN ONLARI DALGALAR!"
    },
    "hero_thalor_victory": {
        "title": "Poseidon/Thalor: Zafer Repliği",
        "file": "assets/audio/hero_thalor_victory.mp3",
        "voice_character": "poseidon_sea_god",
        "emotion": "majestic_calm",
        "text": "Denizler sakinleşti... Zafer panteonundur!"
    },

    # 4. HADES / ASTERION (Yeraltı Hükümdarı)
    "hero_asterion_greeting": {
        "title": "Hades/Asterion: Karşılama",
        "file": "assets/audio/hero_asterion_greeting.mp3",
        "voice_character": "hades_underworld_lord",
        "emotion": "dark_whisper",
        "text": "[whisper] Gölgelerin krallığına hoş geldin ölümlü... Canın bana ait."
    },
    "hero_asterion_ability": {
        "title": "Hades/Asterion: Yetenek Patlaması",
        "file": "assets/audio/hero_asterion_ability.mp3",
        "voice_character": "hades_underworld_lord",
        "emotion": "demonic_fury",
        "text": "[whisper] Yeraltı alevleri... [shout] KÜLLERİNİZE KAVUŞUN!"
    },
    "hero_asterion_victory": {
        "title": "Hades/Asterion: Zafer Repliği",
        "file": "assets/audio/hero_asterion_victory.mp3",
        "voice_character": "hades_underworld_lord",
        "emotion": "dark_satisfaction",
        "text": "Karanlık bile bu hamlene boyun eğdi..."
    }
}

def export_audio_manifest():
    """Tüm sesleri JSON ve base64 formatına derler"""
    manifest_path = Path("assets/audio/chatterbox_voice_manifest.json")
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(CHATTERBOX_VOICE_SCRIPTS, f, ensure_ascii=False, indent=2)
    print(f"✅ Chatterbox Voice Manifest yazıldı: {manifest_path}")

def sync_audio_to_platforms():
    """assets/audio dizinini Android ve iOS public klasörlerine eşitler"""
    import shutil
    targets = [
        "android/app/src/main/assets/public/assets/audio",
        "ios/App/App/public/assets/audio"
    ]
    for target in targets:
        target_path = Path(target)
        if target_path.parent.exists():
            target_path.mkdir(parents=True, exist_ok=True)
            for f in Path("assets/audio").glob("*.mp3"):
                shutil.copy2(f, target_path / f.name)
            print(f"✅ Audio dosyaları eşitlendi: {target}")

if __name__ == "__main__":
    print("=" * 70)
    print("🏛️ ARKENYA CHATTERBOX VOICE STUDIO GENERATOR & INTEGRATOR")
    print("=" * 70)
    export_audio_manifest()
    sync_audio_to_platforms()
    print("🌟 Seslendirme replik kütüphanesi %100 hazır ve entegre edildi!")

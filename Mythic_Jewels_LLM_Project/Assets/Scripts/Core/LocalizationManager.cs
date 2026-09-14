using System;
using System.Collections.Generic;
using UnityEngine;

namespace MythicJewels.Core
{
    public class LocalizationManager
    {
        public string CurrentLanguage { get; private set; } = "tr";

        private readonly Dictionary<string, Dictionary<string, string>> _localizedText = 
            new Dictionary<string, Dictionary<string, string>>();

        public event Action OnLanguageChanged;

        public LocalizationManager()
        {
            InitializeTranslations();
        }

        private void InitializeTranslations()
        {
            // Turkish
            var tr = new Dictionary<string, string>
            {
                { "app_name", "Arkenya: Mythic Jewels" },
                { "btn_play", "OYNA" },
                { "btn_shop", "MAĞAZA" },
                { "btn_heroes", "KAHRAMANLAR" },
                { "btn_settings", "AYARLAR" },
                { "level_title", "Bölüm" },
                { "moves_left", "Kalan Hamle" },
                { "target_score", "Hedef Skor" },
                { "victory_title", "ZAFER!" },
                { "defeat_title", "YENİLGİ!" },
                { "boss_warning", "TEHLİKE: BOSS YAKLAŞIYOR!" },
                { "currency_gold", "Altın" },
                { "currency_gems", "Elmas" },
                { "currency_energy", "Enerji" },
                { "hero_asterion_name", "Asterion" },
                { "hero_asterion_desc", "Yıldız Yağmuru ile 3x3 alanı yok eder." },
                { "hero_nyra_name", "Nyra" },
                { "hero_nyra_desc", "Prizma Akını ile özel taşlar üretir." },
                { "hero_thalor_name", "Thalor" },
                { "hero_thalor_desc", "Dalga Kalkanı ile boss saldırısını engeller." }
            };

            // English
            var en = new Dictionary<string, string>
            {
                { "app_name", "Arkenya: Mythic Jewels" },
                { "btn_play", "PLAY" },
                { "btn_shop", "SHOP" },
                { "btn_heroes", "HEROES" },
                { "btn_settings", "SETTINGS" },
                { "level_title", "Level" },
                { "moves_left", "Moves Left" },
                { "target_score", "Target Score" },
                { "victory_title", "VICTORY!" },
                { "defeat_title", "DEFEAT!" },
                { "boss_warning", "WARNING: BOSS APPROACHING!" },
                { "currency_gold", "Gold" },
                { "currency_gems", "Gems" },
                { "currency_energy", "Energy" },
                { "hero_asterion_name", "Asterion" },
                { "hero_asterion_desc", "Destroys a 3x3 area with Starfall." },
                { "hero_nyra_name", "Nyra" },
                { "hero_nyra_desc", "Spawns special tiles with Prism Rush." },
                { "hero_thalor_name", "Thalor" },
                { "hero_thalor_desc", "Blocks boss attacks with Tide Shield." }
            };

            _localizedText["tr"] = tr;
            _localizedText["en"] = en;
        }

        public void SetLanguage(string langCode)
        {
            if (_localizedText.ContainsKey(langCode))
            {
                CurrentLanguage = langCode;
                OnLanguageChanged?.Invoke();
            }
        }

        public string GetText(string key)
        {
            if (_localizedText.TryGetValue(CurrentLanguage, out var dict))
            {
                if (dict.TryGetValue(key, out var localized))
                {
                    return localized;
                }
            }
            return $"[{key}]";
        }
    }
}

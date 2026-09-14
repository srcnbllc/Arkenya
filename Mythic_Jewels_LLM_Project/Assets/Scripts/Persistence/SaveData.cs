using System;
using System.Collections.Generic;

namespace MythicJewels.Persistence
{
    [Serializable]
    public class LevelProgressData
    {
        public int levelId;
        public bool isUnlocked;
        public bool isCompleted;
        public int starsEarned; // 0 to 3
        public int highScore;
    }

    [Serializable]
    public class CurrencyData
    {
        public int gold = 500;
        public int gems = 50;
        public int energy = 5;
        public int maxEnergy = 5;
        public long lastEnergyRefillTimeTicks = DateTime.UtcNow.Ticks;
    }

    [Serializable]
    public class SettingsData
    {
        public float masterVolume = 1.0f;
        public float musicVolume = 0.8f;
        public float sfxVolume = 1.0f;
        public string language = "tr"; // "tr" or "en"
        public bool hapticFeedback = true;
    }

    [Serializable]
    public class SaveData
    {
        public int profileVersion = 1;
        public string playerId = Guid.NewGuid().ToString();
        public int playerXP = 0;
        public int playerLevel = 1;

        public CurrencyData currencies = new CurrencyData();
        public SettingsData settings = new SettingsData();

        public string selectedHeroId = "hero_asterion";
        public List<string> unlockedHeroIds = new List<string> { "hero_asterion" };

        public Dictionary<int, LevelProgressData> levelProgress = new Dictionary<int, LevelProgressData>();
        public Dictionary<string, int> inventoryBoosters = new Dictionary<string, int>();

        public SaveData()
        {
            // Level 1 unlocked by default
            levelProgress[1] = new LevelProgressData
            {
                levelId = 1,
                isUnlocked = true,
                isCompleted = false,
                starsEarned = 0,
                highScore = 0
            };

            // Boosters default count
            inventoryBoosters["hammer"] = 3;
            inventoryBoosters["bomb"] = 2;
            inventoryBoosters["lightning"] = 1;
        }
    }
}

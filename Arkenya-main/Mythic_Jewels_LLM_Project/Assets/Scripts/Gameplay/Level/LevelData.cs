using System;
using System.Collections.Generic;

namespace MythicJewels.Gameplay
{
    public enum LevelDifficulty
    {
        Normal,
        Hard,
        SuperHard,
        Boss
    }

    [Serializable]
    public class LevelData
    {
        public int levelId;
        public int worldId = 1;
        public LevelDifficulty difficulty = LevelDifficulty.Normal;
        public int maxMoves = 25;
        public int targetScore = 5000;

        public int star1Score = 5000;
        public int star2Score = 8000;
        public int star3Score = 12000;

        public bool isBossLevel = false;
        public string bossId = "";

        public static LevelData GenerateLevelConfig(int levelId)
        {
            var config = new LevelData
            {
                levelId = levelId,
                worldId = 1,
                maxMoves = Math.Max(15, 30 - (levelId / 5)),
                targetScore = 3000 + (levelId * 800),
                star1Score = 3000 + (levelId * 800),
                star2Score = (int)((3000 + (levelId * 800)) * 1.5f),
                star3Score = (int)((3000 + (levelId * 800)) * 2.2f)
            };

            // Every 10th level is a Boss Level
            if (levelId % 10 == 0)
            {
                config.isBossLevel = true;
                config.difficulty = LevelDifficulty.Boss;
                config.bossId = GetBossForLevel(levelId);
            }
            else if (levelId % 5 == 0)
            {
                config.difficulty = LevelDifficulty.Hard;
            }

            return config;
        }

        private static string GetBossForLevel(int levelId)
        {
            switch (levelId)
            {
                case 10: return "boss_stone_colossus";
                case 20: return "boss_ember_wyrm";
                case 30: return "boss_sea_leviathan";
                case 40: return "boss_shadow_titan";
                case 50: return "boss_sky_tyrant";
                default: return "boss_stone_colossus";
            }
        }
    }
}

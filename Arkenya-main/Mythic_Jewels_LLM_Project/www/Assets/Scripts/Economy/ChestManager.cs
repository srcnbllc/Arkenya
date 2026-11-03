using System;
using System.Collections.Generic;
using UnityEngine;

namespace MythicJewels.Economy
{
    public enum ChestType
    {
        Wood,
        Silver,
        Mythic
    }

    public class ChestRewardResult
    {
        public ChestType chestType;
        public int goldReward;
        public int gemReward;
        public Dictionary<string, int> boosterRewards = new Dictionary<string, int>();
        public bool isJackpot;
    }

    public class ChestManager
    {
        private readonly System.Random _random = new System.Random();

        public event Action<ChestRewardResult> OnChestOpened;
        public event Action OnJackpotVisualTriggered;

        public ChestRewardResult OpenChest(ChestType chestType)
        {
            var result = new ChestRewardResult { chestType = chestType };

            switch (chestType)
            {
                case ChestType.Wood:
                    result.goldReward = _random.Next(50, 150);
                    result.gemReward = _random.Next(1, 5);
                    if (_random.NextDouble() < 0.15) result.boosterRewards["hammer"] = 1;
                    break;

                case ChestType.Silver:
                    result.goldReward = _random.Next(200, 500);
                    result.gemReward = _random.Next(10, 25);
                    result.boosterRewards["hammer"] = 1;
                    if (_random.NextDouble() < 0.30) result.boosterRewards["bomb"] = 1;
                    break;

                case ChestType.Mythic:
                    result.goldReward = _random.Next(1000, 2500);
                    result.gemReward = _random.Next(50, 150);
                    result.boosterRewards["hammer"] = 2;
                    result.boosterRewards["bomb"] = 2;
                    result.boosterRewards["lightning"] = 1;

                    // 25% chance for Mythic Jackpot Visual Celebration
                    if (_random.NextDouble() < 0.25)
                    {
                        result.isJackpot = true;
                        result.goldReward *= 2;
                        result.gemReward *= 2;
                        OnJackpotVisualTriggered?.Invoke();
                    }
                    break;
            }

            Debug.Log($"[ChestManager] Opened {chestType} chest! Gold: +{result.goldReward}, Gems: +{result.gemReward}, Jackpot: {result.isJackpot}");
            OnChestOpened?.Invoke(result);
            return result;
        }
    }
}

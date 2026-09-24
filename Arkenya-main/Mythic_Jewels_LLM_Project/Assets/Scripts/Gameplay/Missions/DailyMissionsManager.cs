using System;
using System.Collections.Generic;
using MythicJewels.Economy;
using MythicJewels.Persistence;
using UnityEngine;

namespace MythicJewels.Gameplay
{
    [Serializable]
    public class MissionProgress
    {
        public string missionId;
        public string titleKey;
        public int currentProgress;
        public int targetProgress;
        public int rewardGold;
        public int rewardGems;
        public bool isClaimed;

        public bool IsCompleted => currentProgress >= targetProgress;
    }

    public class DailyMissionsManager
    {
        private readonly SaveManager _saveManager;
        private readonly EconomyManager _economyManager;

        public List<MissionProgress> DailyMissions { get; private set; }

        public event Action<MissionProgress> OnMissionUpdated;
        public event Action<MissionProgress> OnMissionRewardClaimed;

        public DailyMissionsManager(SaveManager saveManager, EconomyManager economyManager)
        {
            _saveManager = saveManager;
            _economyManager = economyManager;
            InitializeDailyMissions();
        }

        private void InitializeDailyMissions()
        {
            DailyMissions = new List<MissionProgress>
            {
                new MissionProgress { missionId = "mission_levels", titleKey = "Complete 3 Levels", targetProgress = 3, rewardGold = 250, rewardGems = 10 },
                new MissionProgress { missionId = "mission_specials", titleKey = "Create 5 Special Gems", targetProgress = 5, rewardGold = 300, rewardGems = 15 },
                new MissionProgress { missionId = "mission_boss", titleKey = "Defeat 1 Boss", targetProgress = 1, rewardGold = 500, rewardGems = 25 }
            };
        }

        public void ReportEvent(string eventType, int count = 1)
        {
            foreach (var mission in DailyMissions)
            {
                if (mission.isClaimed) continue;

                if ((eventType == "level_complete" && mission.missionId == "mission_levels") ||
                    (eventType == "special_created" && mission.missionId == "mission_specials") ||
                    (eventType == "boss_defeated" && mission.missionId == "mission_boss"))
                {
                    mission.currentProgress = Math.Min(mission.targetProgress, mission.currentProgress + count);
                    OnMissionUpdated?.Invoke(mission);
                    Debug.Log($"[DailyMissionsManager] Mission progress: {mission.missionId} ({mission.currentProgress}/{mission.targetProgress})");
                }
            }
        }

        public bool ClaimReward(string missionId)
        {
            var mission = DailyMissions.Find(m => m.missionId == missionId);
            if (mission == null || !mission.IsCompleted || mission.isClaimed) return false;

            mission.isClaimed = true;
            if (mission.rewardGold > 0) _economyManager.AddGold(mission.rewardGold);
            if (mission.rewardGems > 0) _economyManager.AddGems(mission.rewardGems);

            OnMissionRewardClaimed?.Invoke(mission);
            Debug.Log($"[DailyMissionsManager] Claimed reward for {missionId}!");
            return true;
        }

        public void ShowRewardedAd(Action<bool> onComplete)
        {
            Debug.Log("[DailyMissionsManager] Simulating Rewarded Ad viewing...");
            // Grant 1 Energy or 50 Gold upon completion
            _economyManager.AddGold(50);
            onComplete?.Invoke(true);
        }
    }
}

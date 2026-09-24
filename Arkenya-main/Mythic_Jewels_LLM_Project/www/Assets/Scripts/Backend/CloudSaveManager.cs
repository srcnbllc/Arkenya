using System;
using MythicJewels.Persistence;
using UnityEngine;

namespace MythicJewels.Backend
{
    public class CloudSaveManager
    {
        private readonly SaveManager _saveManager;

        public event Action OnCloudSaveSynced;

        public CloudSaveManager(SaveManager saveManager)
        {
            _saveManager = saveManager;
        }

        public void SyncWithCloud()
        {
            Debug.Log("[CloudSaveManager] Simulating Google Play Games / Apple Game Center Cloud Save Sync...");
            _saveManager?.Save();
            OnCloudSaveSynced?.Invoke();
        }
    }

    public class RemoteConfigManager
    {
        public bool IsEventActive { get; private set; } = true;
        public float GlobalGoldMultiplier { get; private set; } = 1.0f;

        public event Action OnRemoteConfigFetched;

        public void FetchRemoteConfig()
        {
            Debug.Log("[RemoteConfigManager] Fetched remote configuration from server.");
            GlobalGoldMultiplier = 1.25f; // e.g. Weekend 25% Gold Boost event
            OnRemoteConfigFetched?.Invoke();
        }
    }
}

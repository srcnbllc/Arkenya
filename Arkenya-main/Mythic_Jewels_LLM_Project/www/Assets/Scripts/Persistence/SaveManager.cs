using System;
using System.IO;
using UnityEngine;

namespace MythicJewels.Persistence
{
    public class SaveManager
    {
        private const string SAVE_FILE_NAME = "arkenya_save.json";
        private readonly string _saveFilePath;

        public SaveData CurrentData { get; private set; }

        public SaveManager()
        {
            _saveFilePath = Path.Combine(Application.persistentDataPath, SAVE_FILE_NAME);
            Load();
        }

        public void Save()
        {
            try
            {
                string json = JsonUtility.ToJson(CurrentData, true);
                File.WriteAllText(_saveFilePath, json);
                Debug.Log($"[SaveManager] Data saved successfully to {_saveFilePath}");
            }
            catch (Exception ex)
            {
                Debug.LogError($"[SaveManager] Failed to save data: {ex.Message}");
            }
        }

        public void Load()
        {
            try
            {
                if (File.Exists(_saveFilePath))
                {
                    string json = File.ReadAllText(_saveFilePath);
                    CurrentData = JsonUtility.FromJson<SaveData>(json);
                    if (CurrentData == null)
                    {
                        CurrentData = new SaveData();
                    }
                    Debug.Log($"[SaveManager] Data loaded successfully from {_saveFilePath}");
                }
                else
                {
                    CurrentData = new SaveData();
                    Save();
                    Debug.Log("[SaveManager] No save file found. Initialized new SaveData.");
                }
            }
            catch (Exception ex)
            {
                Debug.LogError($"[SaveManager] Load failed, fallback to new data: {ex.Message}");
                CurrentData = new SaveData();
            }
        }

        public void ResetProgress()
        {
            CurrentData = new SaveData();
            Save();
        }
    }
}

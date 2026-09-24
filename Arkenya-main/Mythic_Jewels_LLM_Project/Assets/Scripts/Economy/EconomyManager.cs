using System;
using MythicJewels.Persistence;
using UnityEngine;

namespace MythicJewels.Economy
{
    public class EconomyManager
    {
        private readonly SaveManager _saveManager;

        public event Action<int> OnGoldChanged;
        public event Action<int> OnGemsChanged;
        public event Action<int, int> OnEnergyChanged; // (current, max)

        public EconomyManager(SaveManager saveManager)
        {
            _saveManager = saveManager;
        }

        public int Gold => _saveManager?.CurrentData?.currencies?.gold ?? 500;
        public int Gems => _saveManager?.CurrentData?.currencies?.gems ?? 50;
        public int Energy => _saveManager?.CurrentData?.currencies?.energy ?? 5;
        public int MaxEnergy => _saveManager?.CurrentData?.currencies?.maxEnergy ?? 5;

        public void AddGold(int amount)
        {
            if (amount <= 0) return;

            _saveManager.CurrentData.currencies.gold += amount;
            _saveManager.Save();
            OnGoldChanged?.Invoke(Gold);
            Debug.Log($"[EconomyManager] Added {amount} Gold. Total: {Gold}");
        }

        public bool SpendGold(int amount)
        {
            if (amount <= 0 || Gold < amount) return false;

            _saveManager.CurrentData.currencies.gold -= amount;
            _saveManager.Save();
            OnGoldChanged?.Invoke(Gold);
            Debug.Log($"[EconomyManager] Spent {amount} Gold. Remaining: {Gold}");
            return true;
        }

        public void AddGems(int amount)
        {
            if (amount <= 0) return;

            _saveManager.CurrentData.currencies.gems += amount;
            _saveManager.Save();
            OnGemsChanged?.Invoke(Gems);
            Debug.Log($"[EconomyManager] Added {amount} Gems. Total: {Gems}");
        }

        public bool SpendGems(int amount)
        {
            if (amount <= 0 || Gems < amount) return false;

            _saveManager.CurrentData.currencies.gems -= amount;
            _saveManager.Save();
            OnGemsChanged?.Invoke(Gems);
            Debug.Log($"[EconomyManager] Spent {amount} Gems. Remaining: {Gems}");
            return true;
        }

        public bool ConsumeEnergy(int amount = 1)
        {
            if (Energy < amount) return false;

            _saveManager.CurrentData.currencies.energy -= amount;
            _saveManager.Save();
            OnEnergyChanged?.Invoke(Energy, MaxEnergy);
            Debug.Log($"[EconomyManager] Consumed {amount} Energy. Remaining: {Energy}/{MaxEnergy}");
            return true;
        }

        public void RefillEnergyFull()
        {
            _saveManager.CurrentData.currencies.energy = MaxEnergy;
            _saveManager.Save();
            OnEnergyChanged?.Invoke(Energy, MaxEnergy);
        }
    }
}

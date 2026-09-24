using System;
using MythicJewels.Economy;
using MythicJewels.Persistence;
using UnityEngine;

namespace MythicJewels.Gameplay
{
    public class EnergyTimerSystem
    {
        private const int MAX_ENERGY = 5;
        private const int REFILL_INTERVAL_MINUTES = 30;

        private readonly SaveManager _saveManager;
        private readonly EconomyManager _economyManager;

        public TimeSpan TimeUntilNextEnergy { get; private set; }

        public event Action<int, int> OnEnergyUpdated; // (current, max)
        public event Action<string> OnTimerTickFormatted; // "14:22"

        public EnergyTimerSystem(SaveManager saveManager, EconomyManager economyManager)
        {
            _saveManager = saveManager;
            _economyManager = economyManager;
            UpdateEnergyRegeneration();
        }

        public void UpdateEnergyRegeneration()
        {
            if (_saveManager?.CurrentData?.currencies == null) return;

            var curr = _saveManager.CurrentData.currencies;
            if (curr.energy >= MAX_ENERGY)
            {
                TimeUntilNextEnergy = TimeSpan.Zero;
                OnTimerTickFormatted?.Invoke("FULL");
                return;
            }

            DateTime lastRefill = new DateTime(curr.lastEnergyRefillTimeTicks, DateTimeKind.Utc);
            TimeSpan timePassed = DateTime.UtcNow - lastRefill;

            int energyToAdd = (int)(timePassed.TotalMinutes / REFILL_INTERVAL_MINUTES);
            if (energyToAdd > 0)
            {
                curr.energy = Math.Min(MAX_ENERGY, curr.energy + energyToAdd);
                curr.lastEnergyRefillTimeTicks = DateTime.UtcNow.Ticks;
                _saveManager.Save();
                OnEnergyUpdated?.Invoke(curr.energy, MAX_ENERGY);
            }

            if (curr.energy < MAX_ENERGY)
            {
                double remainingSeconds = (REFILL_INTERVAL_MINUTES * 60) - (timePassed.TotalSeconds % (REFILL_INTERVAL_MINUTES * 60));
                TimeUntilNextEnergy = TimeSpan.FromSeconds(remainingSeconds);
                string formatted = $"{TimeUntilNextEnergy.Minutes:D2}:{TimeUntilNextEnergy.Seconds:D2}";
                OnTimerTickFormatted?.Invoke(formatted);
            }
            else
            {
                OnTimerTickFormatted?.Invoke("FULL");
            }
        }
    }
}

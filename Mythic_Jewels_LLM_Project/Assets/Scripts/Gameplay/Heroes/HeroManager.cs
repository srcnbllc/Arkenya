using System;
using MythicJewels.Persistence;
using UnityEngine;

namespace MythicJewels.Gameplay
{
    [Serializable]
    public class HeroData
    {
        public string heroId;
        public string displayNameKey;
        public string descriptionKey;
        public int level = 1;
        public int maxSkillGauge = 100;
        public int currentSkillGauge = 0;
        public string abilityName;

        public bool IsSkillReady => currentSkillGauge >= maxSkillGauge;
    }

    public class HeroManager
    {
        private readonly SaveManager _saveManager;
        public HeroData ActiveHero { get; private set; }

        public event Action<int, int> OnSkillGaugeChanged; // (current, max)
        public event Action<string> OnAbilityCast; // (abilityName)

        public HeroManager(SaveManager saveManager)
        {
            _saveManager = saveManager;
            SelectHero(saveManager?.CurrentData?.selectedHeroId ?? "hero_asterion");
        }

        public void SelectHero(string heroId)
        {
            ActiveHero = new HeroData
            {
                heroId = heroId,
                level = 1,
                maxSkillGauge = 100,
                currentSkillGauge = 0
            };

            switch (heroId)
            {
                case "hero_asterion":
                    ActiveHero.displayNameKey = "hero_asterion_name";
                    ActiveHero.descriptionKey = "hero_asterion_desc";
                    ActiveHero.abilityName = "Starfall";
                    break;
                case "hero_nyra":
                    ActiveHero.displayNameKey = "hero_nyra_name";
                    ActiveHero.descriptionKey = "hero_nyra_desc";
                    ActiveHero.abilityName = "Prism Rush";
                    break;
                case "hero_thalor":
                    ActiveHero.displayNameKey = "hero_thalor_name";
                    ActiveHero.descriptionKey = "hero_thalor_desc";
                    ActiveHero.abilityName = "Tide Shield";
                    break;
                default:
                    ActiveHero.displayNameKey = "hero_asterion_name";
                    ActiveHero.abilityName = "Starfall";
                    break;
            }

            if (_saveManager != null)
            {
                _saveManager.CurrentData.selectedHeroId = heroId;
                _saveManager.Save();
            }

            Debug.Log($"[HeroManager] Hero selected: {ActiveHero.displayNameKey} ({ActiveHero.abilityName})");
        }

        public void ChargeSkillGauge(int amount)
        {
            if (ActiveHero == null) return;

            ActiveHero.currentSkillGauge = Math.Min(ActiveHero.maxSkillGauge, ActiveHero.currentSkillGauge + amount);
            OnSkillGaugeChanged?.Invoke(ActiveHero.currentSkillGauge, ActiveHero.maxSkillGauge);
        }

        public bool TryCastAbility()
        {
            if (ActiveHero == null || !ActiveHero.IsSkillReady) return false;

            ActiveHero.currentSkillGauge = 0;
            OnSkillGaugeChanged?.Invoke(0, ActiveHero.maxSkillGauge);
            OnAbilityCast?.Invoke(ActiveHero.abilityName);

            Debug.Log($"[HeroManager] Ability CAST: {ActiveHero.abilityName}!");
            return true;
        }
    }
}

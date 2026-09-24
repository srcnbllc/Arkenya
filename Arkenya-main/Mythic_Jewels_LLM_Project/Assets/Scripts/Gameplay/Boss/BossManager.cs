using System;
using UnityEngine;

namespace MythicJewels.Gameplay
{
    [Serializable]
    public class BossData
    {
        public string bossId;
        public string displayName;
        public int maxHp = 10000;
        public int currentHp = 10000;
        public int turnsToAttack = 3;
        public int attackCountdown = 3;
        public int attackDamageMoves = 2; // reduces player remaining moves on attack
    }

    public class BossManager
    {
        public BossData CurrentBoss { get; private set; }

        public event Action<int, int> OnBossHpChanged; // (currentHp, maxHp)
        public event Action<int> OnBossAttackTelegraph; // (turnsRemaining)
        public event Action OnBossAttacked;
        public event Action OnBossDefeated;

        public void SpawnBoss(string bossId, int levelId)
        {
            CurrentBoss = new BossData
            {
                bossId = bossId,
                displayName = GetBossDisplayName(bossId),
                maxHp = 5000 + (levelId * 1500),
                currentHp = 5000 + (levelId * 1500),
                turnsToAttack = 3,
                attackCountdown = 3,
                attackDamageMoves = 2
            };

            Debug.Log($"[BossManager] Boss spawned: {CurrentBoss.displayName} (HP: {CurrentBoss.maxHp})");
            OnBossHpChanged?.Invoke(CurrentBoss.currentHp, CurrentBoss.maxHp);
            OnBossAttackTelegraph?.Invoke(CurrentBoss.attackCountdown);
        }

        public void ApplyDamageToBoss(int damage)
        {
            if (CurrentBoss == null || CurrentBoss.currentHp <= 0) return;

            CurrentBoss.currentHp = Math.Max(0, CurrentBoss.currentHp - damage);
            OnBossHpChanged?.Invoke(CurrentBoss.currentHp, CurrentBoss.maxHp);

            Debug.Log($"[BossManager] Boss took {damage} damage! Remaining HP: {CurrentBoss.currentHp}/{CurrentBoss.maxHp}");

            if (CurrentBoss.currentHp <= 0)
            {
                OnBossDefeated?.Invoke();
                Debug.Log($"[BossManager] BOSS DEFEATED: {CurrentBoss.displayName}!");
            }
        }

        public bool ProcessTurnCountdown()
        {
            if (CurrentBoss == null || CurrentBoss.currentHp <= 0) return false;

            CurrentBoss.attackCountdown--;
            OnBossAttackTelegraph?.Invoke(CurrentBoss.attackCountdown);

            if (CurrentBoss.attackCountdown <= 0)
            {
                CurrentBoss.attackCountdown = CurrentBoss.turnsToAttack;
                OnBossAttacked?.Invoke();
                Debug.Log($"[BossManager] BOSS ATTACKED! Player loses {CurrentBoss.attackDamageMoves} moves.");
                return true;
            }

            return false;
        }

        private string GetBossDisplayName(string bossId)
        {
            switch (bossId)
            {
                case "boss_stone_colossus": return "Stone Colossus";
                case "boss_ember_wyrm": return "Ember Wyrm";
                case "boss_sea_leviathan": return "Sea Leviathan";
                case "boss_shadow_titan": return "Shadow Titan";
                case "boss_sky_tyrant": return "Sky Tyrant";
                default: return "Ancient Titan";
            }
        }
    }
}

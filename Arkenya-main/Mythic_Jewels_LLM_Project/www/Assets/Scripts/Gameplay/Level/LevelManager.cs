using System;
using MythicJewels.Persistence;
using UnityEngine;

namespace MythicJewels.Gameplay
{
    public class LevelManager
    {
        private readonly SaveManager _saveManager;

        public LevelData CurrentLevel { get; private set; }
        public int CurrentScore { get; private set; }
        public int MovesRemaining { get; private set; }
        public bool IsGameActive { get; private set; }

        public event Action<int> OnScoreUpdated;
        public event Action<int> OnMovesUpdated;
        public event Action<int> OnLevelVictory; // (starsEarned)
        public event Action OnLevelDefeat;

        public LevelManager(SaveManager saveManager)
        {
            _saveManager = saveManager;
        }

        public void StartLevel(int levelId)
        {
            CurrentLevel = LevelData.GenerateLevelConfig(levelId);
            CurrentScore = 0;
            MovesRemaining = CurrentLevel.maxMoves;
            IsGameActive = true;

            Debug.Log($"[LevelManager] Level {levelId} started. Max moves: {MovesRemaining}, Target: {CurrentLevel.targetScore}");
        }

        public void AddScore(int score)
        {
            if (!IsGameActive) return;

            CurrentScore += score;
            OnScoreUpdated?.Invoke(CurrentScore);

            CheckVictoryCondition();
        }

        public void UseMove()
        {
            if (!IsGameActive) return;

            MovesRemaining--;
            OnMovesUpdated?.Invoke(MovesRemaining);

            if (MovesRemaining <= 0)
            {
                CheckEndState();
            }
        }

        private void CheckVictoryCondition()
        {
            if (CurrentScore >= CurrentLevel.targetScore && !CurrentLevel.isBossLevel)
            {
                CompleteLevelWithVictory();
            }
        }

        public void CheckEndState()
        {
            if (!IsGameActive) return;

            if (CurrentScore >= CurrentLevel.targetScore)
            {
                CompleteLevelWithVictory();
            }
            else if (MovesRemaining <= 0)
            {
                IsGameActive = false;
                OnLevelDefeat?.Invoke();
                Debug.Log($"[LevelManager] Defeat on level {CurrentLevel.levelId}. Score: {CurrentScore}/{CurrentLevel.targetScore}");
            }
        }

        public void CompleteLevelWithVictory()
        {
            if (!IsGameActive) return;
            IsGameActive = false;

            int stars = CalculateStars();
            Debug.Log($"[LevelManager] VICTORY on level {CurrentLevel.levelId}! Stars: {stars}, Score: {CurrentScore}");

            // Update Save Data Persistence
            if (_saveManager != null)
            {
                var progress = _saveManager.CurrentData.levelProgress;
                if (!progress.ContainsKey(CurrentLevel.levelId))
                {
                    progress[CurrentLevel.levelId] = new LevelProgressData { levelId = CurrentLevel.levelId };
                }

                var currentDataData = progress[CurrentLevel.levelId];
                currentDataData.isCompleted = true;
                currentDataData.starsEarned = Math.Max(currentDataData.starsEarned, stars);
                currentDataData.highScore = Math.Max(currentDataData.highScore, CurrentScore);

                // Unlock next level (up to 50)
                int nextLevel = CurrentLevel.levelId + 1;
                if (nextLevel <= 50)
                {
                    if (!progress.ContainsKey(nextLevel))
                    {
                        progress[nextLevel] = new LevelProgressData { levelId = nextLevel };
                    }
                    progress[nextLevel].isUnlocked = true;
                }

                _saveManager.Save();
            }

            OnLevelVictory?.Invoke(stars);
        }

        private int CalculateStars()
        {
            if (CurrentScore >= CurrentLevel.star3Score) return 3;
            if (CurrentScore >= CurrentLevel.star2Score) return 2;
            if (CurrentScore >= CurrentLevel.star1Score) return 1;
            return 1;
        }
    }
}

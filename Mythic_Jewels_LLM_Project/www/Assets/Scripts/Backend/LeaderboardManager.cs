using System;
using System.Collections.Generic;
using UnityEngine;

namespace MythicJewels.Backend
{
    public enum LeagueTier
    {
        Bronze,
        Silver,
        Gold,
        Olympus
    }

    [Serializable]
    public class LeaderboardEntry
    {
        public int rank;
        public string playerName;
        public int score;
        public int levelReached;
        public LeagueTier league;
    }

    public class LeaderboardManager
    {
        public List<LeaderboardEntry> TopRankings { get; private set; }

        public event Action<List<LeaderboardEntry>> OnLeaderboardUpdated;

        public LeaderboardManager()
        {
            InitializeSampleLeaderboard();
        }

        private void InitializeSampleLeaderboard()
        {
            TopRankings = new List<LeaderboardEntry>
            {
                new LeaderboardEntry { rank = 1, playerName = "Zeus_Master", score = 245000, levelReached = 50, league = LeagueTier.Olympus },
                new LeaderboardEntry { rank = 2, playerName = "Athena_Warrior", score = 198000, levelReached = 48, league = LeagueTier.Olympus },
                new LeaderboardEntry { rank = 3, playerName = "Poseidon_Rider", score = 175400, levelReached = 42, league = LeagueTier.Gold },
                new LeaderboardEntry { rank = 4, playerName = "Ares_Conqueror", score = 152100, levelReached = 39, league = LeagueTier.Gold },
                new LeaderboardEntry { rank = 5, playerName = "Player_Arkenya", score = 98500, levelReached = 25, league = LeagueTier.Silver }
            };
        }

        public void SubmitPlayerScore(string playerName, int score, int level)
        {
            var existing = TopRankings.Find(e => e.playerName == playerName);
            if (existing != null)
            {
                if (score > existing.score)
                {
                    existing.score = score;
                    existing.levelReached = Math.Max(existing.levelReached, level);
                }
            }
            else
            {
                TopRankings.Add(new LeaderboardEntry
                {
                    rank = TopRankings.Count + 1,
                    playerName = playerName,
                    score = score,
                    levelReached = level,
                    league = LeagueTier.Bronze
                });
            }

            // Sort descending by score
            TopRankings.Sort((a, b) => b.score.CompareTo(a.score));

            // Re-assign ranks
            for (int i = 0; i < TopRankings.Count; i++)
            {
                TopRankings[i].rank = i + 1;
            }

            Debug.Log($"[LeaderboardManager] Submitted score {score} for {playerName}. Current Rank: {GetPlayerRank(playerName)}");
            OnLeaderboardUpdated?.Invoke(TopRankings);
        }

        public int GetPlayerRank(string playerName)
        {
            var entry = TopRankings.Find(e => e.playerName == playerName);
            return entry?.rank ?? -1;
        }
    }
}

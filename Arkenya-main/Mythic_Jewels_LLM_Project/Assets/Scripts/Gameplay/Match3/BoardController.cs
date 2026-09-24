using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace MythicJewels.Gameplay
{
    public class BoardController : MonoBehaviour
    {
        public int width = 8;
        public int height = 8;

        public BoardModel Model { get; private set; }

        public event Action<int, int> OnScoreEarned; // (score, comboMultiplier)
        public event Action<GemColor, int> OnGemMatched; // (color, count)
        public event Action OnMoveUsed;
        public event Action OnBoardSettled;
        public event Action<string> OnVFXTriggered; // (vfxType)

        private bool _isProcessing = false;

        private void Start()
        {
            InitializeBoard();
        }

        public void InitializeBoard()
        {
            Model = new BoardModel(width, height);
            Model.GenerateInitialBoard();
            Debug.Log("[BoardController] Board initialized 8x8 successfully.");
        }

        public bool TryPlayerSwap(int x1, int y1, int x2, int y2)
        {
            if (_isProcessing) return false;

            bool swapped = Model.SwapTiles(x1, y1, x2, y2);
            if (!swapped) return false;

            var matches = MatchDetector.FindMatches(Model.Grid, width, height);
            if (matches.Count == 0)
            {
                // Revert swap if no match produced
                Model.SwapTiles(x1, y1, x2, y2);
                return false;
            }

            OnMoveUsed?.Invoke();
            StartCoroutine(ProcessMatchSequenceRoutine(matches));
            return true;
        }

        private IEnumerator ProcessMatchSequenceRoutine(List<MatchResult> initialMatches)
        {
            _isProcessing = true;
            int comboMultiplier = 1;

            List<MatchResult> currentMatches = initialMatches;

            while (currentMatches != null && currentMatches.Count > 0)
            {
                // 1. Process matches & destroy tiles
                foreach (var match in currentMatches)
                {
                    int tileCount = match.matchedTiles.Count;
                    int basePoints = tileCount * 100 * comboMultiplier;
                    OnScoreEarned?.Invoke(basePoints, comboMultiplier);

                    if (match.matchedTiles.Count > 0)
                    {
                        OnGemMatched?.Invoke(match.matchedTiles[0].color, tileCount);
                    }

                    // Trigger VFX depending on combo length
                    if (comboMultiplier >= 3)
                    {
                        OnVFXTriggered?.Invoke("JackpotBurst");
                    }
                    else if (match.createdSpecial != SpecialType.None)
                    {
                        OnVFXTriggered?.Invoke("SpecialCreated");
                    }

                    // Clear tiles from grid model
                    foreach (var tile in match.matchedTiles)
                    {
                        Model.Grid[tile.x, tile.y] = null;
                    }

                    // Spawn special tile if created
                    if (match.createdSpecial != SpecialType.None &&
                        match.specialSpawnX >= 0 && match.specialSpawnY >= 0)
                    {
                        Model.Grid[match.specialSpawnX, match.specialSpawnY] = 
                            new TileData(match.specialSpawnX, match.specialSpawnY, match.specialColor, match.createdSpecial);
                    }
                }

                yield return new WaitForSeconds(0.25f);

                // 2. Cascade down & refill
                Model.ApplyCascadeAndRefill();
                yield return new WaitForSeconds(0.25f);

                // 3. Check for chain reaction matches
                comboMultiplier++;
                currentMatches = MatchDetector.FindMatches(Model.Grid, width, height);
            }

            _isProcessing = false;
            OnBoardSettled?.Invoke();
        }
    }
}

using System;
using MythicJewels.Gameplay;

namespace MythicJewels.Tests
{
    public static class MatchDetectorTests
    {
        public static bool RunAllTests(out string report)
        {
            int passed = 0;
            int total = 4;
            var details = new System.Text.StringBuilder();

            // Test 1: Horizontal 3-Match
            try
            {
                var grid = new TileData[8, 8];
                grid[0, 0] = new TileData(0, 0, GemColor.Red);
                grid[1, 0] = new TileData(1, 0, GemColor.Red);
                grid[2, 0] = new TileData(2, 0, GemColor.Red);

                var matches = MatchDetector.FindMatches(grid, 8, 8);
                if (matches.Count >= 1 && matches[0].matchedTiles.Count == 3)
                {
                    passed++;
                    details.AppendLine("✔ Test 1 Passed: Horizontal 3-Match detected.");
                }
                else
                {
                    details.AppendLine("✘ Test 1 Failed: Horizontal 3-Match not detected correctly.");
                }
            }
            catch (Exception ex)
            {
                details.AppendLine($"✘ Test 1 Exception: {ex.Message}");
            }

            // Test 2: Vertical 3-Match
            try
            {
                var grid = new TileData[8, 8];
                grid[3, 1] = new TileData(3, 1, GemColor.Blue);
                grid[3, 2] = new TileData(3, 2, GemColor.Blue);
                grid[3, 3] = new TileData(3, 3, GemColor.Blue);

                var matches = MatchDetector.FindMatches(grid, 8, 8);
                if (matches.Count >= 1 && matches[0].matchedTiles.Count == 3)
                {
                    passed++;
                    details.AppendLine("✔ Test 2 Passed: Vertical 3-Match detected.");
                }
                else
                {
                    details.AppendLine("✘ Test 2 Failed: Vertical 3-Match not detected correctly.");
                }
            }
            catch (Exception ex)
            {
                details.AppendLine($"✘ Test 2 Exception: {ex.Message}");
            }

            // Test 3: 4-Match Line Bomb Creation
            try
            {
                var grid = new TileData[8, 8];
                grid[0, 5] = new TileData(0, 5, GemColor.Green);
                grid[1, 5] = new TileData(1, 5, GemColor.Green);
                grid[2, 5] = new TileData(2, 5, GemColor.Green);
                grid[3, 5] = new TileData(3, 5, GemColor.Green);

                var matches = MatchDetector.FindMatches(grid, 8, 8);
                if (matches.Count >= 1 && matches[0].createdSpecial == SpecialType.HorizontalLine)
                {
                    passed++;
                    details.AppendLine("✔ Test 3 Passed: 4-Match created HorizontalLine Special.");
                }
                else
                {
                    details.AppendLine("✘ Test 3 Failed: 4-Match did not produce HorizontalLine.");
                }
            }
            catch (Exception ex)
            {
                details.AppendLine($"✘ Test 3 Exception: {ex.Message}");
            }

            // Test 4: BoardModel Swap Logic
            try
            {
                var board = new BoardModel(8, 8);
                board.GenerateInitialBoard();
                var originalTile = board.Grid[0, 0];
                var adjacentTile = board.Grid[1, 0];

                bool swapSuccess = board.SwapTiles(0, 0, 1, 0);
                if (swapSuccess && board.Grid[0, 0] == adjacentTile && board.Grid[1, 0] == originalTile)
                {
                    passed++;
                    details.AppendLine("✔ Test 4 Passed: Tile swap swapped coordinates successfully.");
                }
                else
                {
                    details.AppendLine("✘ Test 4 Failed: Tile swap did not update grid matrix.");
                }
            }
            catch (Exception ex)
            {
                details.AppendLine($"✘ Test 4 Exception: {ex.Message}");
            }

            report = $"[MatchDetectorTests] Passed: {passed}/{total}\n" + details.ToString();
            return passed == total;
        }
    }
}

using System.Collections.Generic;

namespace MythicJewels.Gameplay
{
    public class MatchResult
    {
        public List<TileData> matchedTiles = new List<TileData>();
        public SpecialType createdSpecial = SpecialType.None;
        public int specialSpawnX = -1;
        public int specialSpawnY = -1;
        public GemColor specialColor;
    }

    public static class MatchDetector
    {
        public static List<MatchResult> FindMatches(TileData[,] grid, int width, int height)
        {
            var results = new List<MatchResult>();
            var matchedGrid = new bool[width, height];

            // 1. Horizontal Matches
            for (int y = 0; y < height; y++)
            {
                int matchLength = 1;
                for (int x = 0; x < width; x++)
                {
                    bool isMatchEnd = false;
                    if (x == width - 1)
                    {
                        isMatchEnd = true;
                    }
                    else
                    {
                        if (grid[x, y] != null && grid[x + 1, y] != null &&
                            grid[x, y].color == grid[x + 1, y].color)
                        {
                            matchLength++;
                        }
                        else
                        {
                            isMatchEnd = true;
                        }
                    }

                    if (isMatchEnd)
                    {
                        if (matchLength >= 3)
                        {
                            var matchResult = new MatchResult();
                            for (int i = 0; i < matchLength; i++)
                            {
                                int matchX = x - i + (x == width - 1 && grid[x, y] != null && grid[x - 1, y] != null && grid[x, y].color == grid[x - 1, y].color ? 1 : 0);
                                if (matchX >= 0 && matchX < width && grid[matchX, y] != null)
                                {
                                    matchResult.matchedTiles.Add(grid[matchX, y]);
                                    matchedGrid[matchX, y] = true;
                                }
                            }

                            // Special tile logic
                            if (matchLength == 4)
                            {
                                matchResult.createdSpecial = SpecialType.HorizontalLine;
                                matchResult.specialSpawnX = x - matchLength / 2;
                                matchResult.specialSpawnY = y;
                                matchResult.specialColor = grid[x, y].color;
                            }
                            else if (matchLength >= 5)
                            {
                                matchResult.createdSpecial = SpecialType.RainbowBomb;
                                matchResult.specialSpawnX = x - matchLength / 2;
                                matchResult.specialSpawnY = y;
                                matchResult.specialColor = grid[x, y].color;
                            }

                            results.Add(matchResult);
                        }
                        matchLength = 1;
                    }
                }
            }

            // 2. Vertical Matches
            for (int x = 0; x < width; x++)
            {
                int matchLength = 1;
                for (int y = 0; y < height; y++)
                {
                    bool isMatchEnd = false;
                    if (y == height - 1)
                    {
                        isMatchEnd = true;
                    }
                    else
                    {
                        if (grid[x, y] != null && grid[x, y + 1] != null &&
                            grid[x, y].color == grid[x, y + 1].color)
                        {
                            matchLength++;
                        }
                        else
                        {
                            isMatchEnd = true;
                        }
                    }

                    if (isMatchEnd)
                    {
                        if (matchLength >= 3)
                        {
                            var matchResult = new MatchResult();
                            for (int i = 0; i < matchLength; i++)
                            {
                                int matchY = y - i + (y == height - 1 && grid[x, y] != null && grid[x, y - 1] != null && grid[x, y].color == grid[x, y - 1].color ? 1 : 0);
                                if (matchY >= 0 && matchY < height && grid[x, matchY] != null)
                                {
                                    matchResult.matchedTiles.Add(grid[x, matchY]);
                                    matchedGrid[x, matchY] = true;
                                }
                            }

                            if (matchLength == 4)
                            {
                                matchResult.createdSpecial = SpecialType.VerticalLine;
                                matchResult.specialSpawnX = x;
                                matchResult.specialSpawnY = y - matchLength / 2;
                                matchResult.specialColor = grid[x, y].color;
                            }
                            else if (matchLength >= 5)
                            {
                                matchResult.createdSpecial = SpecialType.RainbowBomb;
                                matchResult.specialSpawnX = x;
                                matchResult.specialSpawnY = y - matchLength / 2;
                                matchResult.specialColor = grid[x, y].color;
                            }

                            results.Add(matchResult);
                        }
                        matchLength = 1;
                    }
                }
            }

            return results;
        }
    }
}

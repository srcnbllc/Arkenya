using System;
using System.Collections.Generic;
using UnityEngine;

namespace MythicJewels.Gameplay
{
    public class BoardModel
    {
        public int Width { get; }
        public int Height { get; }

        public TileData[,] Grid { get; private set; }

        private readonly System.Random _random = new System.Random();

        public BoardModel(int width = 8, int height = 8)
        {
            Width = width;
            Height = height;
            Grid = new TileData[width, height];
        }

        public void GenerateInitialBoard()
        {
            for (int x = 0; x < Width; x++)
            {
                for (int y = 0; y < Height; y++)
                {
                    GemColor color;
                    // Ensure initial board has NO match-3 on startup
                    do
                    {
                        color = (GemColor)_random.Next(0, 5); // 5 base colors
                    }
                    while (CausesInitialMatch(x, y, color));

                    Grid[x, y] = new TileData(x, y, color);
                }
            }
        }

        private bool CausesInitialMatch(int x, int y, GemColor color)
        {
            if (x >= 2 && Grid[x - 1, y] != null && Grid[x - 2, y] != null &&
                Grid[x - 1, y].color == color && Grid[x - 2, y].color == color)
            {
                return true;
            }

            if (y >= 2 && Grid[x, y - 1] != null && Grid[x, y - 2] != null &&
                Grid[x, y - 1].color == color && Grid[x, y - 2].color == color)
            {
                return true;
            }

            return false;
        }

        public bool SwapTiles(int x1, int y1, int x2, int y2)
        {
            if (x1 < 0 || x1 >= Width || y1 < 0 || y1 >= Height ||
                x2 < 0 || x2 >= Width || y2 < 0 || y2 >= Height)
            {
                return false;
            }

            // Check adjacency (horizontal or vertical adjacent only)
            if (Math.Abs(x1 - x2) + Math.Abs(y1 - y2) != 1)
            {
                return false;
            }

            var temp = Grid[x1, y1];
            Grid[x1, y1] = Grid[x2, y2];
            Grid[x2, y2] = temp;

            if (Grid[x1, y1] != null)
            {
                Grid[x1, y1].x = x1;
                Grid[x1, y1].y = y1;
            }

            if (Grid[x2, y2] != null)
            {
                Grid[x2, y2].x = x2;
                Grid[x2, y2].y = y2;
            }

            return true;
        }

        public List<TileData> ApplyCascadeAndRefill()
        {
            var newTiles = new List<TileData>();

            // 1. Shift existing tiles down
            for (int x = 0; x < Width; x++)
            {
                for (int y = 0; y < Height; y++)
                {
                    if (Grid[x, y] == null)
                    {
                        // Look above for a tile to drop down
                        for (int aboveY = y + 1; aboveY < Height; aboveY++)
                        {
                            if (Grid[x, aboveY] != null)
                            {
                                Grid[x, y] = Grid[x, aboveY];
                                Grid[x, y].x = x;
                                Grid[x, y].y = y;
                                Grid[x, aboveY] = null;
                                break;
                            }
                        }
                    }
                }
            }

            // 2. Refill empty top spots with new tiles
            for (int x = 0; x < Width; x++)
            {
                for (int y = 0; y < Height; y++)
                {
                    if (Grid[x, y] == null)
                    {
                        var color = (GemColor)_random.Next(0, 5);
                        var newTile = new TileData(x, y, color);
                        Grid[x, y] = newTile;
                        newTiles.Add(newTile);
                    }
                }
            }

            return newTiles;
        }
    }
}

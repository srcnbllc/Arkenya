namespace MythicJewels.Gameplay
{
    public enum GemColor
    {
        Red,        // Ruby / Fire
        Blue,       // Sapphire / Water
        Green,      // Emerald / Earth
        Yellow,     // Topaz / Sun
        Purple,     // Amethyst / Shadow
        White       // Diamond / Light
    }

    public enum SpecialType
    {
        None,
        HorizontalLine, // Clears entire row
        VerticalLine,   // Clears entire column
        AreaBomb,       // Clears 3x3 surrounding tiles
        RainbowBomb     // Clears all tiles of matched color
    }

    public class TileData
    {
        public int x;
        public int y;
        public GemColor color;
        public SpecialType specialType;
        public bool isMatched;
        public bool isLocked; // Blocker / Frozen

        public TileData(int x, int y, GemColor color, SpecialType specialType = SpecialType.None)
        {
            this.x = x;
            this.y = y;
            this.color = color;
            this.specialType = specialType;
            this.isMatched = false;
            this.isLocked = false;
        }

        public bool IsSpecial => specialType != SpecialType.None;
    }
}

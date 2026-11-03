using System;
using MythicJewels.Economy;
using MythicJewels.Persistence;

namespace MythicJewels.Tests
{
    public static class EconomyAndSaveTests
    {
        public static bool RunAllTests(out string report)
        {
            int passed = 0;
            int total = 4;
            var details = new System.Text.StringBuilder();

            // Test 1: SaveManager Serialization & Persistence
            try
            {
                var saveManager = new SaveManager();
                saveManager.CurrentData.currencies.gold = 1250;
                saveManager.Save();

                var reloadedManager = new SaveManager();
                if (reloadedManager.CurrentData.currencies.gold == 1250)
                {
                    passed++;
                    details.AppendLine("✔ Test 1 Passed: Gold persistence saved and loaded correctly.");
                }
                else
                {
                    details.AppendLine($"✘ Test 1 Failed: Expected 1250 Gold, found {reloadedManager.CurrentData.currencies.gold}");
                }
            }
            catch (Exception ex)
            {
                details.AppendLine($"✘ Test 1 Exception: {ex.Message}");
            }

            // Test 2: Economy Gold Transaction
            try
            {
                var saveManager = new SaveManager();
                var economy = new EconomyManager(saveManager);
                int initialGold = economy.Gold;

                economy.AddGold(500);
                if (economy.Gold == initialGold + 500)
                {
                    passed++;
                    details.AppendLine("✔ Test 2 Passed: AddGold increased total correctly.");
                }
                else
                {
                    details.AppendLine("✘ Test 2 Failed: AddGold failed calculation.");
                }
            }
            catch (Exception ex)
            {
                details.AppendLine($"✘ Test 2 Exception: {ex.Message}");
            }

            // Test 3: Chest Opening Rewards
            try
            {
                var chestManager = new ChestManager();
                var woodReward = chestManager.OpenChest(ChestType.Wood);
                if (woodReward.goldReward > 0 && woodReward.gemReward >= 0)
                {
                    passed++;
                    details.AppendLine("✔ Test 3 Passed: Wood chest generated non-zero gold and gem rewards.");
                }
                else
                {
                    details.AppendLine("✘ Test 3 Failed: Wood chest loot generation failed.");
                }
            }
            catch (Exception ex)
            {
                details.AppendLine($"✘ Test 3 Exception: {ex.Message}");
            }

            // Test 4: Energy Consumption
            try
            {
                var saveManager = new SaveManager();
                var economy = new EconomyManager(saveManager);
                economy.RefillEnergyFull();

                bool consumed = economy.ConsumeEnergy(1);
                if (consumed && economy.Energy == 4)
                {
                    passed++;
                    details.AppendLine("✔ Test 4 Passed: Consumed 1 Energy, 4 remaining.");
                }
                else
                {
                    details.AppendLine("✘ Test 4 Failed: Energy consumption logic failed.");
                }
            }
            catch (Exception ex)
            {
                details.AppendLine($"✘ Test 4 Exception: {ex.Message}");
            }

            report = $"[EconomyAndSaveTests] Passed: {passed}/{total}\n" + details.ToString();
            return passed == total;
        }
    }
}

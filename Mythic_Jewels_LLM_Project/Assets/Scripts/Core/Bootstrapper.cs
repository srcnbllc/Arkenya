using MythicJewels.Economy;
using MythicJewels.Gameplay;
using MythicJewels.Persistence;
using UnityEngine;

namespace MythicJewels.Core
{
    public class Bootstrapper : MonoBehaviour
    {
        [SerializeField] private bool dontDestroyOnLoad = true;

        private void Awake()
        {
            if (dontDestroyOnLoad)
            {
                DontDestroyOnLoad(gameObject);
            }

            InitializeServices();
        }

        private void InitializeServices()
        {
            Debug.Log("[Bootstrapper] Initializing Arkenya Core Game Engine...");

            // 1. Persistence
            var saveManager = new SaveManager();
            ServiceLocator.Register(saveManager);

            // 2. Localization
            var locManager = new LocalizationManager();
            locManager.SetLanguage(saveManager.CurrentData.settings.language);
            ServiceLocator.Register(locManager);

            // 3. Economy Manager
            var economyManager = new EconomyManager(saveManager);
            ServiceLocator.Register(economyManager);

            // 4. Hero Manager
            var heroManager = new HeroManager(saveManager);
            ServiceLocator.Register(heroManager);

            // 5. Boss Manager
            var bossManager = new BossManager();
            ServiceLocator.Register(bossManager);

            // 6. Level Manager
            var levelManager = new LevelManager(saveManager);
            ServiceLocator.Register(levelManager);

            Debug.Log("[Bootstrapper] All Core Services successfully registered.");
        }
    }
}

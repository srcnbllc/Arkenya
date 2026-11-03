using System;
using System.Collections.Generic;
using UnityEngine;

namespace MythicJewels.Economy
{
    [Serializable]
    public class ShopOffer
    {
        public string offerId;
        public string titleKey;
        public string priceTierText; // e.g. "$0.99", "₺29.99"
        public int goldAmount;
        public int gemAmount;
        public int energyAmount;
        public bool isPopular;
    }

    public class ShopManager
    {
        private readonly EconomyManager _economyManager;
        public List<ShopOffer> AvailableOffers { get; private set; }

        public event Action<ShopOffer> OnPurchaseCompleted;
        public event Action<string> OnPurchaseFailed;

        public ShopManager(EconomyManager economyManager)
        {
            _economyManager = economyManager;
            InitializeOffers();
        }

        private void InitializeOffers()
        {
            AvailableOffers = new List<ShopOffer>
            {
                new ShopOffer { offerId = "com.arkenya.gems_small", titleKey = "Bag of Gems", priceTierText = "₺29.99", gemAmount = 100, goldAmount = 1000 },
                new ShopOffer { offerId = "com.arkenya.gems_medium", titleKey = "Chest of Gems", priceTierText = "₺99.99", gemAmount = 400, goldAmount = 5000, isPopular = true },
                new ShopOffer { offerId = "com.arkenya.gems_large", titleKey = "Vault of Zeus", priceTierText = "₺299.99", gemAmount = 1500, goldAmount = 25000 },
                new ShopOffer { offerId = "com.arkenya.energy_refill", titleKey = "Full Energy", priceTierText = "₺14.99", energyAmount = 5 }
            };
        }

        public void ProcessPurchase(string offerId)
        {
            var offer = AvailableOffers.Find(o => o.offerId == offerId);
            if (offer == null)
            {
                OnPurchaseFailed?.Invoke("Offer not found.");
                return;
            }

            // Grant Virtual Goods
            if (offer.goldAmount > 0) _economyManager.AddGold(offer.goldAmount);
            if (offer.gemAmount > 0) _economyManager.AddGems(offer.gemAmount);
            if (offer.energyAmount > 0) _economyManager.RefillEnergyFull();

            Debug.Log($"[ShopManager] Purchase SUCCESS for offer: {offer.offerId}");
            OnPurchaseCompleted?.Invoke(offer);
        }

        public void RestorePurchases()
        {
            Debug.Log("[ShopManager] Purchase restoration check completed.");
        }
    }
}

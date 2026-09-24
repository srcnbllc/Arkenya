using System;
using MythicJewels.Core;
using UnityEngine;

namespace MythicJewels.UI
{
    public enum ScreenState
    {
        MainMenu,
        WorldMap,
        Gameplay,
        HeroSelection,
        Shop,
        VictoryPopup,
        DefeatPopup
    }

    public class UIManager : MonoBehaviour
    {
        public ScreenState CurrentState { get; private set; } = ScreenState.MainMenu;

        public event Action<ScreenState> OnScreenStateChanged;

        public void SwitchScreen(ScreenState newState)
        {
            CurrentState = newState;
            Debug.Log($"[UIManager] Screen switched to: {newState}");
            OnScreenStateChanged?.Invoke(newState);
        }

        public void ShowVictoryScreen(int starsEarned, int score)
        {
            Debug.Log($"[UIManager] Showing VICTORY popup. Stars: {starsEarned}, Score: {score}");
            SwitchScreen(ScreenState.VictoryPopup);
        }

        public void ShowDefeatScreen()
        {
            Debug.Log("[UIManager] Showing DEFEAT popup.");
            SwitchScreen(ScreenState.DefeatPopup);
        }
    }
}

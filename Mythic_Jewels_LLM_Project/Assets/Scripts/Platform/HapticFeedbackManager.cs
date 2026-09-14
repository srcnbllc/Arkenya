using UnityEngine;

namespace MythicJewels.Platform
{
    public static class HapticFeedbackManager
    {
        public static void TriggerLightImpact()
        {
            #if UNITY_ANDROID && !UNITY_EDITOR
            Handheld.Vibrate();
            #elif UNITY_IOS && !UNITY_EDITOR
            // iOS Light Impact Haptic Call
            #else
            Debug.Log("[HapticFeedbackManager] Light Impact Haptic Triggered.");
            #endif
        }

        public static void TriggerHeavyImpact()
        {
            #if UNITY_ANDROID && !UNITY_EDITOR
            Handheld.Vibrate();
            #elif UNITY_IOS && !UNITY_EDITOR
            // iOS Heavy Impact Haptic Call
            #else
            Debug.Log("[HapticFeedbackManager] HEAVY Impact Haptic Triggered!");
            #endif
        }
    }
}

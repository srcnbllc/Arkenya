using UnityEngine;

namespace MythicJewels.UI
{
    public class VFXManager : MonoBehaviour
    {
        public static VFXManager Instance { get; private set; }

        private void Awake()
        {
            if (Instance == null)
            {
                Instance = this;
                DontDestroyOnLoad(gameObject);
            }
            else
            {
                Destroy(gameObject);
            }
        }

        public void PlayMatchSparkle(Vector3 position, Color gemColor)
        {
            Debug.Log($"[VFXManager] Particle Sparkle at {position} for color {gemColor}");
        }

        public void PlayZeusLightningStrike(Vector3 targetPosition)
        {
            Debug.Log($"[VFXManager] ZEUS LIGHTNING STRIKE at {targetPosition}!");
        }

        public void TriggerJackpotCelebration()
        {
            Debug.Log("[VFXManager] === JACKPOT CELEBRATION! Gold coin shower & particle fireworks! ===");
        }

        public void TriggerCameraShake(float duration = 0.3f, float magnitude = 0.5f)
        {
            Debug.Log($"[VFXManager] Camera Shake triggered (Duration: {duration}s, Magnitude: {magnitude})");
        }
    }
}

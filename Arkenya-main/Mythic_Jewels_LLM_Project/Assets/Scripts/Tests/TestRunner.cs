using System;
using UnityEngine;

namespace MythicJewels.Tests
{
    public class TestRunner : MonoBehaviour
    {
        [SerializeField] private bool runOnStart = true;

        private void Start()
        {
            if (runOnStart)
            {
                RunAllTestSuites();
            }
        }

        public static void RunAllTestSuites()
        {
            Debug.Log("=================================================");
            Debug.Log("  MYTHIC JEWELS (ARKENYA) — AUTOMATED QA SUITE   ");
            Debug.Log("=================================================");

            bool matchPassed = MatchDetectorTests.RunAllTests(out string matchReport);
            Debug.Log(matchReport);

            bool econPassed = EconomyAndSaveTests.RunAllTests(out string econReport);
            Debug.Log(econReport);

            if (matchPassed && econPassed)
            {
                Debug.Log("🎉 ALL TEST SUITES PASSED (100%)! PROD READY.");
            }
            else
            {
                Debug.LogError("⚠️ SOME TESTS FAILED. PLEASE CHECK REPORTS.");
            }
        }
    }
}

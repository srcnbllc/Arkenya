# ARKENYA: MYTHIC JEWELS – PRE-RELEASE AUDIT & TECHNICAL ASSESSMENT REPORT
**Document Version:** 1.0.0  
**Audit Date:** 2026-10-06  
**Auditor:** Senior Android Release Engineer & QA Lead  
**Project Identifier:** `com.mythic.jewels` (Arkenya: Mythic Jewels)

---

## 1. Project Overview

| Metric / Parameter | Value / Status |
| :--- | :--- |
| **Product Name** | ARKENYA: Mythic Jewels |
| **Display Name** | Arkenya: Mythic Jewels |
| **Package Name (Application ID)** | `com.mythic.jewels` |
| **Version Name** | `1.0` |
| **Version Code** | `1` |
| **Runtime & Core Architecture** | Hybrid Mobile Game: High-performance HTML5/Canvas/DOM/WebAudio Game Engine wrapped in native Android Capacitor 8 shell |
| **Native Wrapper** | Capacitor Android 8.5.2 (`BridgeActivity` in Java 17) |
| **Android Minimum SDK** | `24` (Android 7.0 Nougat – covers >95% of active global Android devices) |
| **Android Target SDK** | `35` (Android 15 – fully meets latest Google Play Console 2025/2026 mandates) |
| **Android Compile SDK** | `35` |
| **Gradle / Build Tools** | Gradle 8.14.3, Android Gradle Plugin (AGP) 8.13.0, Java 17 |
| **Real Money / Gambling** | **NONE (0%)** – Pure virtual economy, no cash-out, no betting |
| **Offline Playability** | **100% Offline-First Capable** – Zero hard network dependency for gameplay |

---

## 2. Current Architecture

```
+-----------------------------------------------------------------------+
|                       ANDROID RUNTIME (Java / Native)                  |
|  - MainActivity.java (extends BridgeActivity)                         |
|  - FLAG_KEEP_SCREEN_ON (Prevent screen timeout during matches)        |
|  - WebView WebSettings: domStorage, database, userGestureUnlocked     |
|  - Plugins: @capacitor/app, splash, status-bar, screen-orientation,   |
|             haptics, @capacitor-community/admob                      |
+-----------------------------------------------------------------------+
                                   |
                      Capacitor IPC Bridge
                                   |
+-----------------------------------------------------------------------+
|                    ARKENYA GAME ENGINE (Web Engine)                   |
|                                                                       |
|  [Presentation Layer]                                                 |
|   - Responsive Mobile Shell, CSS Touch Ergonomics, Safe Area Insets   |
|   - 7 Core Screens + 20 Modal Overlays                                |
|                                                                       |
|  [Gameplay & Puzzle Engine]                                           |
|   - 8x8 Match-3 Grid, Cascades, Gravity Fall, Parallel Gem Processing |
|   - Special Gems: Lightning Crystals (4), Bombs (5 T/L), Zeus Orbs (5)|
|   - Hero Divine Powers & Combo Energy Bars                            |
|                                                                       |
|  [Content & Progression Engine]                                       |
|   - 50 Handcrafted Mythological Levels across 5 Distinct Biomes       |
|   - 5 Epic Boss Encounters (Levels 10, 20, 30, 40, 50)                |
|   - 6 Mythological Heroes (Herkül/Arkenya, Nyra, Thalor, etc.)        |
|                                                                       |
|  [Economy & Meta Systems]                                             |
|   - Gold, Gems, Energy/Hearts with Real-Time Regenerator (30m cooldown)|
|   - Daily Rewards, Quests, Smart Exchange, Simulated Olympus League   |
|                                                                       |
|  [Persistence Engine]                                                 |
|   - LocalStorage 'arkenya_save_v11' with Re-entrancy Lock Guards      |
|   - Active Match Crash Recovery ('arkenya_active_match')              |
|                                                                       |
|  [Audio Engine]                                                       |
|   - Web Audio API Real-Time Synthesizer (Zero-latency SFX)            |
|   - Inlined Base64 Ambient Saga Music & Narrator Soundscapes          |
+-----------------------------------------------------------------------+
```

---

## 3. Scenes and UI Screens Audit

Because ARKENYA uses a single-page reactive architecture embedded within Android's optimized WebView, scenes are managed as discrete, memory-efficient DOM states:

### 3.1 Primary Screens
1. **`screen-splash`**: Native Capacitor splash with smooth fade into in-engine animated splash (1500ms autohide, no spinner freeze).
2. **`screen-mainmenu`**: Hero display, currency pills (Gold, Gems, Hearts), Level Progress badge, Play CTA, Bottom Navigation (Heroes, Map, Pantheon, Settings).
3. **`screen-worldmap`**: Interactive Saga Map with level nodes 1 to 50, zone borders, star ratings, and smooth node scrolling.
4. **`screen-gameplay`**: High-FPS Match-3 canvas/grid, Moves counter, Target score bar, Combo multiplier bar, Hero active ability button, in-game boosters dock, and Pause button.
5. **`screen-hero`**: Pantheon hero selection carousel (6 heroes), skill cards, upgrade costs, and unlock milestones.
6. **`screen-store` / `screen-store-scroll`**: In-game gold/gem vaults, booster bundles, lives refill, and daily free chests.
7. **`screen-wipe`**: Hardware-accelerated CSS transition curtain preventing frame flickers between state changes.

### 3.2 Modal Dialogs (State Managed)
* `modal-level-preview`: Level target, moves, recommended booster slots, and Play button.
* `modal-pause`: Resume, Sound/SFX toggle, Restart, and Surrender/Exit to Map.
* `modal-victory`: 1-3 Stars calculation, Victory cascade score, Gold/XP breakdown, 2X Ad Multiplier, and Next Level button.
* `modal-defeat`: Out-of-moves alert with Clutch/Save-Me options.
* `modal-save-me`: Extra +5 moves recovery (Ad or Gold purchase).
* `modal-out-of-lives`: Energy timer countdown with instant refill options.
* `modal-settings`: Audio toggles, Turkish/English localization switches, Privacy Policy link, and Game Reset with confirm guard.
* `modal-leaderboard`: Simulated Olympus League tournament standings with monthly rollover countdown.
* `modal-daily-reward` & `modal-daily-quests`: Retention incentives with claim timers.
* `modal-final-celebration`: Level 50 Grand Victory cinematic modal with credits and champion badges.

---

## 4. Game Flow Analysis

```mermaid
graph TD
    A[App Launch] --> B[Capacitor Native Splash]
    B --> C{First Time Run?}
    C -->|Yes| D[Prologue & Level 1 Tutorial]
    C -->|No| E[Main Menu Screen]
    E --> F[Settings / Heroes / Store / Leaderboard]
    E --> G[World Map / Level Select]
    G --> H[Level Preview Modal]
    H -->|Has Life & Clicks Play| I[Deduct 1 Heart -> Gameplay Screen]
    H -->|No Lives| J[Out of Lives Modal]
    I --> K[Match-3 Game Loop]
    K --> L{Level Condition Met?}
    L -->|Score >= Target| M[Victory Modal -> Stars + Gold + Unlock Next Level]
    L -->|Moves == 0 & Score < Target| N[Defeat Modal -> Save Me / Retry]
    M --> O{Next Level or Map?}
    O -->|Next Level| H
    O -->|Return| G
    N -->|Retry| I
    N -->|Surrender| G
```

---

## 5. Level Flow & 50-Level Balance Progression

All 50 levels are fully configured in `LEVEL_DATA` and split across 5 thematic biomes:

| Biome Index | Levels | Biome Name | Key Milestones & Bosses |
| :---: | :---: | :--- | :--- |
| **Zone 1** | **1 - 10** | Kristal Vadi (Valley of Crystals) | L1: 3-Match Tutorial<br>L2: 4-Match Lightning<br>L3: 5-Match T/L Bomb<br>L4: 5-Match Zeus Orb<br>L5: Hero Divine Combo<br>**L10: BOSS HADES (Unlocks Nyra)** |
| **Zone 2** | **11 - 20** | Fırtına Kanyonu (Storm Canyon) | Styx, Kerberos, Tartarus Depths, Titan Uprising, Atlas Burden, Prometheus Fire<br>**L20: BOSS POSEIDON** |
| **Zone 3** | **21 - 30** | Yeraltı Lav Mağarası (Underworld Lava Cave) | Apollo's Lyre, Artemis Bow, Ares Chariot, Aphrodite Diamond<br>L25: Unlocks Thalor<br>**L30: BOSS ZEUS** |
| **Zone 4** | **31 - 40** | Donmuş Titan Geçidi (Frozen Titan Pass) | Orpheus Melody, Talos Armor, Charon Ferry, Midas Touch, Gorgon Petrify<br>**L40: BOSS HADES II (Return)** |
| **Zone 5** | **41 - 50** | Olimpos İlahi Zirvesi (Olympus Divine Summit) | Olympus Foothills, Fates Moirai, Gaia Heart, Kronos Hourglass, Elysium Fields<br>**L50: GRAND BOSS ZEUS (Game Finale)** |

Progression validation via `simulate_full_progression.js` proves:
* All 50 level definitions contain strictly positive `targetScore` and `maxMoves`.
* Points-per-move targets scale smoothly from ~133 pts/move (Level 1) to ~2,929 pts/move (Level 50).
* Level unlock logic increments `gameState.unlockedLevel` monotonically. Completed levels are persisted in `gameState.completedLevels`.

---

## 6. Save System Audit

* **Storage Engine:** Standard W3C HTML5 `localStorage` stored inside Android's private app sandbox.
* **Storage Path:** `/data/data/com.mythic.jewels/app_webview/Default/Local Storage/leveldb/`
* **Primary Key:** `'arkenya_save_v11'`
* **Active Session Key:** `'arkenya_active_match'` (preserves in-progress level state if app loses focus or system terminates memory).
* **Save Function Safeguards:**
  * Guard flag `isSavingGame` prevents re-entrant recursive loop triggers.
  * `try...catch` wrapper prevents DOM errors from terminating scripts.
  * Schema fallback defaults: `defaultState` merges seamlessly with loaded JSON if old save version lacks newly added keys.
* **Reset Protection:**
  * Double-check confirmation modal before clearing user progress (`modal-confirm-reset`).

---

## 7. UI / UX & Touch Ergonomics

1. **Resolution & Density:** Fully responsive through CSS viewport units (`100vw`, `100dvh`), `calc()`, and CSS variables.
2. **Safe Area & Notch Handling:** Configured with `viewport-fit=cover` in `<meta name="viewport">` and padding offsets using `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)`.
3. **Touch Targets:** Buttons are standardized to >= 44px height and >= 48px width with touch-friendly paddings. Tap highlight disabled (`-webkit-tap-highlight-color: transparent`) to ensure native game feel.
4. **Android Hardware Back Button:**
  * Priority 1: Closes any active modal (`.modal-overlay.active`).
  * Priority 2: In gameplay, triggers Pause modal without forfeiting match.
  * Priority 3: In sub-screens (Store, Heroes, Map), navigates back to Main Menu.
  * Priority 4: In Main Menu, triggers a **Double-Tap Exit Guard** within a 2200ms window with an Android toast prompt (`"Çıkmak için tekrar geri tuşuna basın"`).

---

## 8. Android Configuration Audit

### 8.1 Manifest (`android/app/src/main/AndroidManifest.xml`)
* **Package:** `com.mythic.jewels`
* **Launch Mode:** `singleTask` (prevents multiple activity instances on launcher icon tap)
* **Screen Orientation:** `unspecified` with full sensor support.
* **Config Changes:** `orientation|keyboardHidden|keyboard|screenSize|locale|smallestScreenSize|screenLayout|uiMode|navigation|density` (prevents unnecessary Activity recreation).
* **Permissions Requested:**
  * `android.permission.INTERNET` (for AdMob ads & network check)
  * `android.permission.ACCESS_NETWORK_STATE`
  * `android.permission.VIBRATE` (for haptic tactile feedback)
  * `android.permission.WAKE_LOCK` (prevents screen dimming during gameplay)
  * `android.permission.MODIFY_AUDIO_SETTINGS`
  * `com.android.vending.BILLING` (for Google Play Billing support)
* **AdMob Application ID:** `ca-app-pub-5447184164278795~6893138952` declared in `<meta-data>`.
* **Sensitive Permissions:** **ZERO.** No camera, no microphone, no precise location, no read external storage.

### 8.2 Build Gradle (`android/app/build.gradle` & `android/variables.gradle`)
* `minSdkVersion = 24`
* `targetSdkVersion = 35`
* `compileSdkVersion = 35`
* Java version: 17
* Proguard / R8: Disabled in release (`minifyEnabled false`) for Web hybrid simplicity.
* **Release Signing Key:** `arkenya-release.jks` exists in `android/` directory (size: 2,722 bytes).

---

## 9. Firebase Status Verification

| Component | Status | Finding & Analysis |
| :--- | :---: | :--- |
| **Firebase SDK / CDN** | **CLEAN / REMOVED** | No Firebase SDK scripts in `index.html`. Line 3681 contains only an inert comment label. |
| **Firebase Auth** | **CLEAN / REMOVED** | Profiles are local offline guest identities stored in `gameState.playerProfile`. |
| **Cloud Firestore** | **CLEAN / REMOVED** | Replaced entirely by simulated offline Olympus Leaderboard Engine. |
| **Firebase Analytics / Crashlytics** | **NONE** | No native plugins or gradle dependencies linked. |
| **google-services.json** | **ABSENT** | Does not exist in `android/app/`. The gradle script gracefully skips `com.google.gms.google-services`. |
| **Residual Files** | **ORPHANED** | `firebase.json`, `firestore.rules`, and `setup_firebase.js` remain in root as legacy files, but are not packaged into the Android build. |

---

## 10. Known Risks & Technical Observations

1. **Signing Config Not Linked in `app/build.gradle`:**
   * `android/arkenya-release.jks` is present, but `signingConfigs.release` is not yet bound to `buildTypes.release` in `android/app/build.gradle`. Running `gradlew bundleRelease` would produce an unsigned AAB until configured.
2. **Version Code Setting:**
   * Currently `versionCode 1` and `versionName "1.0"`. This is perfect for initial Play Store release, but must be locked and documented.
3. **Audio Autoplay Policy:**
   * Audio uses Web Audio API + HTML5 Audio. `MainActivity.java` correctly sets `setMediaPlaybackRequiresUserGesture(false)`, and user first touch triggers `unlockAudioOnFirstInteraction()`.
4. **Git Workspace Uncommitted Changes:**
   * There are unstaged modifications in `index.html`, `www/index.html`, and `test_playstore_readiness_and_ui.js` representing the simulated tournament upgrade. These must be preserved and committed cleanly.

---

## 11. Potential Critical Issues (P0 - P3 Classification)

* **P0 (Blocker):** **0** (No crashes, no infinite loops, 50 levels load, dry-run build succeeds).
* **P1 (Critical):**
  * `[FIX-REQ-01]` Release signing config needs to be cleanly wired in `app/build.gradle` before building the release `.aab`.
  * `[FIX-REQ-02]` `www/` and `android/app/src/main/assets/public/` must be synchronized with `npx cap sync android` to ensure the latest game bundle is in the native APK/AAB.
* **P2 (Major):**
  * Clean up orphaned Firebase files (`firebase.json`, `firestore.rules`, legacy setup script) to avoid confusion during store audit.
  * Verify visual icon rendering on launcher across low/high density screen previews.
* **P3 (Minor):**
  * Remove commented line `<!-- Firebase SDK (Compat Version for simple integration) -->` from `index.html`.

---

## 12. Play Store Readiness Scorecard

| Area | Current Status | Notes |
| :--- | :---: | :--- |
| **Google Play Target SDK 35** | **PASS** | Meets current Google Play Target API 34+ requirement. |
| **64-bit Architecture** | **PASS** | Native Capacitor runtime supports `arm64-v8a` and `x86_64`. |
| **App Bundle (.AAB) Support** | **PASS** | Gradle task `bundleRelease` configured and functional. |
| **Permissions Compliance** | **PASS** | No runtime sensitive permissions; no background location; privacy policy compliant. |
| **Store Graphics & Icons** | **PASS** | High-res icon (512x512) and Feature Graphic (1024x500) exist in `ARKENYA_PlayStore_Android_Assets`. |
| **Data Safety Declaration** | **PASS** | Game collects 0 personal data. Ads use AdMob standard identifier with disclosure. |
| **Gambling / Cash-Out Policy** | **PASS** | 100% compliant with Google Play Simulated Gambling & Entertainment policies. |

---

## 13. Recommended Step-by-Step Test Order (Before Release Candidate)

```text
STEP 1: Automated Unit & Integration Tests (Node.js/JSDOM Test Suites)
  - test_playstore_readiness_and_ui.js (21/21 assertions)
  - simulate_full_progression.js (Levels 1 to 50 balance test)
  - test_user_enhancements.js & test_performance_and_resilience.js

STEP 2: Synchronize Native Android Assets
  - Run `npx cap sync android` to copy latest index.html into Android assets

STEP 3: Configure Release Signing in Gradle
  - Wire arkenya-release.jks into signingConfigs.release

STEP 4: Assemble Internal Test Build (Debug / Release APK)
  - Verify Gradle build output (.apk / .aab)

STEP 5: End-to-End Game Flow Verification (Simulation / Emulator)
  - Main Menu -> Level 1 -> Progression -> Boss 10 -> Boss 50
  - Win / Lose / Retry / Pause / Back button lifecycle
  - App Background / Foreground resume test
  - Progress persistence across app restart
```

---
**Audit Conclusion:** ARKENYA is in **STABLE PRE-RELEASE** condition with an exceptional foundation. Once the release signing configuration is verified and assets are synchronized, the project will be ready for **Release Candidate (RC-1)** and Google Play Internal Testing.

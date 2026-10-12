# ARKENYA: MYTHIC JEWELS – RELEASE CHANGELOG

## [SYNC-001] Native Android Web Assets Synchronization
- **Problem:** Son JavaScript, CSS ve HTML güncellemeleri (simüle lig, offline menajerlik, AdGuard ve UI geliştirmeleri) `www/` dizininden Android projesinin `assets/public/` dizinine otomatik aktarılmamıştı.
- **Root Cause:** Capacitor derleme döngüsünde `npx cap sync android` komutunun çalıştırılmaması.
- **Changed Files:**
  - `android/app/src/main/assets/public/index.html`
  - `android/app/src/main/assets/capacitor.config.json`
- **Change:** `npx cap sync android` çalıştırılarak web varlıkları ve plugin köprüleri native Android projesiyle %100 eşitlendi.
- **Risk:** Minimum. Web varlıkları zaten Node.js/JSDOM testlerinde %100 doğrulanmıştı.
- **Test:** `npx cap sync android` ve `gradlew assembleDebug --dry-run`
- **Result:** SUCCESS (Sync tamamlandı, Gradle task graph başarıyla çalıştı).

---

## [SIGN-001] Gradle Release Signing Configuration Setup
- **Problem:** `app/build.gradle` dosyasında `signingConfigs.release` bloğu tanımlanmadığı için `bundleRelease` komutu imzasız (unsigned) AAB üretiyordu.
- **Root Cause:** Release signing ayarları derleme profiline bağlanmamıştı.
- **Changed Files:**
  - `android/app/build.gradle`
- **Change:** `signingConfigs.release` dinamik olarak tanımlandı; `RELEASE_STORE_PASSWORD` parametresi verildiğinde `arkenya-release.jks` üzerinden AAB otomatik olarak imzalanacak şekilde yapılandırıldı.
- **Risk:** Düşük. Şifre verilmediğinde de derlemeyi bozmaz, opsiyonel imzalı/imzasız derlemeye izin verir.
- **Test:** `.\gradlew.bat bundleRelease`
- **Result:** SUCCESS (AAB derlemesi 2 dakika 5 saniyede hatasız tamamlandı).

---

## [CLEAN-001] Removal of Residual Firebase Comment in HTML
- **Problem:** `index.html` satır 3681'de eski entegrasyondan kalan boş `<!-- Firebase SDK (Compat Version for simple integration) -->` etiketi bulunuyordu.
- **Root Cause:** Firebase daha önce koddan kaldırılmış ancak bu yorum satırı unutulmuştu.
- **Changed Files:**
  - `Arkenya-main/Mythic_Jewels_LLM_Project/index.html`
  - `Arkenya-main/Mythic_Jewels_LLM_Project/www/index.html`
- **Change:** Yorum satırı temizlendi.
- **Risk:** Sıfır (0).
- **Test:** `grep_search` & `node tests/test_playstore_readiness_and_ui.js`
- **Result:** PASS (21/21 assertions passed).

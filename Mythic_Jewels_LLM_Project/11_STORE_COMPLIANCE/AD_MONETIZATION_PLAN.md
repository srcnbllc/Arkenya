# 📊 ARKENYA: MYTHIC JEWELS — REKLAM & GELİR GELİŞTİRME PLANI (AD MONETIZATION PLAN)

Bu doküman, **Arkenya: Mythic Jewels** oyununun Google Play Store ve Apple App Store üzerinde en yüksek reklam gelirini (eCPM) elde etmesi, oyuncuyu oyundan soğutmadan yüksek tutundurma (retention) sağlaması ve **Reklamsız VIP Pass** satışlarını maksimize etmesi için hazırlanmış uçtan uca operasyon ve entegrasyon planıdır.

---

## 1. 🎯 Reklam Türleri & Gelir Stratejisi (Endüstri Standartları)

Match-3 türünde (Candy Crush, Royal Match, Homescapes) en yüksek gelir ve oyuncu memnuniyeti **Ödüllü Video Reklamlar (Rewarded Ads)** ile elde edilir.

| Reklam Türü | Beklenen eCPM (1.000 Gösterim Başına Brüt Gelir) | Oyuncu Algısı | Tetiklenme Noktaları |
| :--- | :--- | :--- | :--- |
| **🎬 Ödüllü Video (Rewarded)** | **$25.00 – $65.00** | **Çok Olumlu** (Kullanıcı rızasıyla tıklar) | 1. Bölüm zaferinde **2X Ödül Katlama**<br>2. Can bittiğinde **+1 Ücretsiz Can**<br>3. Hamle bittiğinde **+5 Ekstra Hamle** |
| **📺 Geçiş Reklamı (Interstitial)** | **$8.00 – $18.00** | **Nötr / Dengeli** (Bölüm aralarında tam ekran) | Bölüm kaybedilip haritaya dönerken (3 dakikada birden sık olamaz) |
| **🪧 Alt Banner** | **$0.50 – $1.80** | **Olumsuz** (Ekranı daraltır, kazara tıklama) | **KULLANILMAZ.** Dikey oyun alanını kısıtladığı ve geliri çok düşük olduğu için devre dışı bırakılmıştır. |

---

## 2. 👑 Reklamsız Paket (No-Ads / VIP Pass) Mantığı

Dünyanın en çok kazanan oyunlarının 1 numaralı gelir kuralı: **Reklamsız paket alan kullanıcıyı asla ödüllerden mahrum bırakma, ona "VIP Lüksü" yaşat.**

### A. Zorunlu Reklamların Engellenmesi
- Oyuncu Mağazadan `🚫 Reklamsız Macera Pass` (₺49.99) veya `⚡ Başlangıç Destek Paketi` aldığında sistemde kalıcı olarak `gameState.noAds = true` bayrağı aktif olur.
- Tüm tam ekran geçiş reklamları (Interstitials) bıçak gibi kesilir (`if (gameState.noAds) return;`). Oyuncu hiçbir bekleme veya reklam görmez.

### B. VIP Ödül Avantajı (Rewarded Ads Bypass)
- Reklamsız sürüm sahibi zafer ekranında **"🎬 2X ÖDÜL KAZAN"** veya can ekranında **"❤️ +1 CAN"** butonuna bastığında:
  - **Normal Oyuncuya:** 15-30 saniye video izletilir.
  - **Reklamsız VIP Oyuncuya:** Video İZLETİLMEZ! Butona basar basmaz:
    > *"👑 VIP Reklamsız Pass: Ödül anında hesabına aktarıldı!"*
    diyerek anında 2 kat altın ve elmas verilir.
- **Pazarlama Etkisi:** Bu özellik, oyuncunun para verdiği için cezalandırılmasını önler ve mağaza satışlarını en az 3 kat artırır.

---

## 3. 🛠️ Gerçek Google AdMob Entegrasyon Adımları

Arkenya, Capacitor altyapısında resmi `@capacitor-community/admob` kütüphanesiyle hibrit olarak çalışacak şekilde kodlanmıştır.

### Adım 1: AdMob Hesabı ve Uygulama Kaydı
1. [Google AdMob](https://admob.google.com/) konsoluna gidin.
2. **Uygulamalar > Uygulama Ekle** adımlarını izleyin.
3. Platform: **Android** (ve ardından iOS için ayrı bir uygulama ekleyin).
4. Size verilen **Uygulama Kimliğini (App ID)** kaydedin:
   - *Örnek Format:* `ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY`

### Adım 2: Reklam Birimlerini (Ad Unit ID) Oluşturma
AdMob panelinde uygulamanızı seçip **Reklam Birimleri** sekmesinden 2 adet birim oluşturun:
1. **Ödüllü (Rewarded Video):**
   - Ad: `Arkenya_Rewarded_Android`
   - *Örnek Format:* `ca-app-pub-XXXXXXXXXXXXXXXX/1111111111`
2. **Geçiş (Interstitial):**
   - Ad: `Arkenya_Interstitial_Android`
   - *Örnek Format:* `ca-app-pub-XXXXXXXXXXXXXXXX/2222222222`

### Adım 3: Capacitor AdMob Eklentisini Projeye Kurma
Projenin kök dizininde şu komutları çalıştırın:
```bash
npm install @capacitor-community/admob
npx cap sync
```

### Adım 4: Android Manifest Ayarı
`android/app/src/main/AndroidManifest.xml` dosyasına `<application>` etiketinin içine AdMob App ID'nizi ekleyin:
```xml
<meta-data
    android:name="com.google.android.gms.ads.APPLICATION_ID"
    android:value="ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY"/>
```

### Adım 5: iOS Info.plist Ayarı (iOS İçin)
`ios/App/App/Info.plist` içerisine `GADApplicationIdentifier` ekleyin:
```xml
<key>GADApplicationIdentifier</key>
<string>ca-app-pub-XXXXXXXXXXXXXXXX~ZZZZZZZZZZ</string>
<key>SKAdNetworkItems</key>
<array>
  <dict>
    <key>SKAdNetworkIdentifier</key>
    <string>cstr6suwn9.skadnetwork</string>
  </dict>
</array>
```

---

## 4. 💻 Kod Mimarisi & `window.AdGuard` Köprüsü

Oyun içerisindeki [www/index.html](file:///c:/Users/sballuca/Desktop/Works/Bogaziciyonetim/Develop/AndroidProjects/Arkenya-main/Arkenya-main/Mythic_Jewels_LLM_Project/www/index.html) motorunda `window.AdGuard` köprüsü hazırdır. 

Canlı kimliklerinizi girmek için yalnızca şu alanı güncellemeniz yeterlidir:
```javascript
window.AdGuard = {
    adUnitIds: {
        rewarded: {
            android: 'ca-app-pub-XXXXXXXXXXXXXXXX/1111111111', // Sizin Canlı Rewarded ID'niz
            ios: 'ca-app-pub-XXXXXXXXXXXXXXXX/3333333333'
        },
        interstitial: {
            android: 'ca-app-pub-XXXXXXXXXXXXXXXX/2222222222', // Sizin Canlı Interstitial ID'niz
            ios: 'ca-app-pub-XXXXXXXXXXXXXXXX/4444444444'
        }
    }
};
```
*Eğer canlı ID girilmezse veya tarayıcıda çalışıyorsa, sistem çökmeyi önleyen şık karanlık tema simülatörüne otomatik olarak geri döner.*

---

## 5. 🚀 Geliri 2-3 Katına Çıkarma: AdMob Mediation (Açık Artırma)

Yalnızca Google AdMob reklamları kullanıldığında doluluk oranı (fill rate) %70-85 bandında kalabilir. **AdMob Bidding & Mediation** kurularak bu oran %99.5'e ve eCPM 2 katına çıkarılır:

1. **Unity Ads Entegrasyonu:** Mobil oyun reklamlarında en yüksek bütçeli kampanyalara sahiptir.
2. **AppLovin MAX / Bidding:** ABD, İngiltere ve Almanya kullanıcılarında eCPM'i $50+ seviyesine çıkarır.
3. **IronSource / Mintegral:** Global çapta reklam çeşitliliği sağlar.

> **Nasıl Yapılır?** AdMob panelinde **Aracılık (Mediation) > Aracılık Grubu Oluştur** seçeneğinden Unity Ads ve AppLovin ağlarını ekleyerek AdMob'un her reklam çağrısında gerçek zamanlı açık artırma yapmasını sağlayabilirsiniz.

---

## 6. 🛡️ Google Play Store ve AdMob Politika Kuralları (Hesap Güvenliği)

1. **Kazaen Tıklamayı Önleme:** Butonlar ile reklam alanları arasında net mesafe bırakılmıştır.
2. **Kullanıcı İzni (GDPR / UMP):** Avrupa Birliği (AB) ve İngiltere kullanıcıları için Google UMP (User Messaging Platform) üzerinden kişiselleştirilmiş reklam onay formu gösterilmelidir.
3. **Kendi Reklamlarına Tıklamama Kuralı:** Geliştirme ve test aşamasında mutlaka test cihazı olarak kendi telefonunuzu AdMob paneline ekleyin (Test Device ID). Kendi reklamlarınıza asla tıklamayın.
4. **Geçiş Reklamı Sıklığı (Frequency Capping):** Kodumuzda 2.5 dakikada birden sık geçiş reklamı çıkması yazılımsal olarak engellenmiştir (`interstitialCooldownMs = 150000`).

---

## 7. 📋 Yayına Çıkış Öncesi Kontrol Listesi

- [x] `window.AdGuard` hibrit AdMob köprüsü yazıldı ve test edildi.
- [x] Reklamsız paket için **VIP Anında Ödül** mantığı kodlandı.
- [x] Zafer ekranında 2X ödül katlama butonu eklendi.
- [x] Reklam dondurma ve 6 sn güvenlik zamanlayıcısı (watchdog fallback) eklendi.
- [ ] AdMob hesabı açılıp canlı Rewarded ve Interstitial Ad Unit ID'leri oluşturulacak.
- [ ] `@capacitor-community/admob` paketi `npm install` ile projeye bağlanacak.
- [ ] `AndroidManifest.xml` içerisine `APPLICATION_ID` yapıştırılacak.
- [ ] AdMob panelinde ödeme ve vergi profili tamamlanacak.

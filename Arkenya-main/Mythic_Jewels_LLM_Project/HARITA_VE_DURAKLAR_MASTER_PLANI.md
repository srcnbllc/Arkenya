# 🗺️ ARKENYA HARİTA & DURAKLAR MENÜSÜ MASTER ÇÖZÜM PLANI
**Son Güncelleme:** 30 Ekim 2026  
**Durum:** Ekran Görüntüsü (3 Kırmızı Kutu) Kök Neden Analizi Tamamlandı & Kalıcı Çözüm Uygulandı  
**Teknik Rol:** Arkenya Hibrit Oyun Projesi Baş Öğretmen ve Mentoru  

---

## 📍 1. MİMARİ VE DOSYA KONUMU

- 📍 **DOSYA:** `c:\Users\sballuca\Desktop\Works\Bogaziciyonetim\Develop\AndroidProjects\Arkenya-main\Arkenya-main\Mythic_Jewels_LLM_Project\www\index.html`
- 📁 **ÜST KLASÖR:** `www/` (Kaynak Kod Ana Merkezi)
- 🔗 **BAĞLANTI ZİNCİRİ:**
  - `www/index.html` (Tek Gerçek Kaynak - Single Source of Truth)
  - `sync_distribution_targets.js` (7 Dağıtım Hedefi Eşitleme Betiği)
  - `android/app/src/main/assets/public/index.html` (Android APK/Capacitor WebView Hedefi)
  - `ios/App/App/public/index.html` (iOS WebKit Hedefi)
  - `test_worldmap_and_stages.js` (Otomatik Doğrulama Testi)
- 🎯 **GÖREVİ:** Harita ekranı (`#screen-worldmap`), üst bölge geçiş konsolu (`#map-zone-quick-nav`), durak düğümleri (`.map-node`), etaplar sekmesi (`#map-list-view`) ve bölüm önizleme kartı (`#modal-level-preview`).

---

## 🚨 2. EKRAN GÖRÜNTÜSÜNDEKİ 3 KIRMIZI KUTU VE 9 KRİTİK SORUNUN KÖK NEDEN ANALİZİ (RCA)

### 🔴 Kırmızı Kutu 1: Üstteki Tematik Bölge Butonlarının Kesik Olması, Başlığın Kaybolması ve Kaydırma (Scroll) Kilitlenmesi
- **Kök Neden:**
  1. `#screen-worldmap.active` bir `display: flex; flex-direction: column;` kapsayıcısıdır. İçindeki `.map-top-bar`, `.map-zone-header-wrap` ve `.map-scroll-area` öğelerinde `flex-shrink: 0` tanımlı olmadığı ve `overflow: hidden` bulunduğu için Flexbox bu öğeleri dikeyde ezmektedir (`min-height: 0`).
  2. `updateZoneQuickNav()` ve `scroll` dinleyicisi içinde çağrılan `pill.scrollIntoView({ behavior: 'smooth' })`, `overflow: hidden` olan `.map-zone-header-wrap` kutusunu dikey kaydırarak üstteki bölge başlığını (`.map-zone-quick-nav-bar`) görünmez hale getirmekte ve kullanıcının harita üzerindeki dikey kaydırma (scroll) hareketini yarıda kesmektedir.
  3. `.zone-pills-row` yatayda `overflow-x: auto` kullandığı için 5. buton (`⚡ 5. Zirve`) ekrana sığmayıp sağdan kesik görünmektedir.
- **Kalıcı Çözüm:**
  - `.map-top-bar`, `.map-zone-header-wrap` ve `.map-scroll-area` öğelerine `flex-shrink: 0 !important;` eklendi.
  - `.zone-pills-row` yapısı `display: grid; grid-template-columns: repeat(5, 1fr);` yapılarak 5 bölge butonunun tamamı ekrana eşit, kesintisiz ve tek satırda tam sığacak şekilde hizalandı.
  - Kaydırmayı bozan `pill.scrollIntoView()` çağrıları kaldırıldı ve bölge geçişlerine `isProgrammaticMapScroll` koruması eklendi.

---

### 🔴 Kırmızı Kutu 2: Aktif Durak ("👇 AKTİF") İmlecinin 6. Durağın Üzerine Binmesi ve İkon/İsim Uyumu
- **Kök Neden:**
  1. Duraklar arası dikey mesafe `68px` (`y = 80 + i * 68`), aktif durağın (`scale(1.18)` + halo) boyutu ise `~76px` olduğu için 7. durağın üstündeki `.active-node-pointer` (`top: -19px`) doğrudan 6. durağın yeşil dairesinin içine girmektedir.
  2. Yan başlık rozetlerinde (`.map-node-title-badge`) dar `max-width` ve tek satır `ellipsis` nedeniyle `4. Medusa'nın Gözya...`, `5. Pegasus'un Kanatl...` gibi isimler yarım kalmaktadır.
  3. `LEVEL_ICONS` içindeki bazı genel emojiler (`📦`, `🌍`, `🎶`, `🎻`, `🍏`, `🧶`) Yunan mitolojisi atmosferiyle tam örtüşmemektedir.
- **Kalıcı Çözüm:**
  - Duraklar arası dikey adım `68px`'den `86px`'e çıkarıldı ve her bölge arasına `110px` kapı boşluğu eklendi: `y = 130 + ((i - 1) * 86) + ((zone - 1) * 110)`.
  - Aktif durağa `z-index: 30 !important;` verildi; `.active-node-pointer` üstteki durakla asla çakışmayacak şekilde konumlandırıldı.
  - `.map-node-title-badge` genişliği ve 2 satır desteği açılarak mitolojik durak isimlerinin kesilmeden okunması sağlandı.
  - `LEVEL_ICONS` dizisindeki 50 durağın tamamı Yunan mitolojisi sembolleriyle (`🏛️, 👁️, 🐂, 🐍, 🪽, 🪶, 🦁, 🐉, 🐗, 💀, 🌊, 🐕, ⛓️, 🗿, 🏛️, 🔥, 🏺, 🧜‍♀️, 🐙, 🔱` vb.) birebir uyumlu hale getirildi.

---

### 🔴 Kırmızı Kutu 3: Alttaki Bölge Pankartının ("BÖLGE 2 • THALOR") Durakların Üstüne Binmesi ve Kapanmayan Kart Sanılması
- **Kök Neden:**
  - `openWorldMap()` içinde 10. durak (`y = 760px`) ile 11. durak (`y = 828px`) arasında sadece `68px` mesafe varken, `68px` yüksekliğindeki `.zone-trail-banner` `top: 770px` ve `z-index: 15` ile doğrudan 10. ve 11. durakların **tam üstüne** yerleştirilmiştir.
  - Oyuncu 7. bölümdeyken bu pankart ekranın en altına denk geldiği için kapanmayan bir alt bilgi kartı gibi görünmekte ve altındaki duraklara tıklanmasını engellemektedir.
- **Kalıcı Çözüm:**
  - Her bölge geçişinde (`i = 11, 21, 31, 41`) `110px` ekstra dikey koridor açıldı (10. durak ile 11. durak arası `196px` merkezden merkeze mesafe).
  - `.zone-trail-banner` pankartları bu boş koridorun tam ortasına (`y - 98px`), `z-index: 5` (durakların altında) ve kompakt bir **"BÖLGE GEÇİŞ KAPISI"** tasarımıyla yerleştirildi. Hiçbir durakla çakışmaz ve durak tıklamalarını asla engellemez.

---

### ⚡ Performans, Donma (Freeze) ve Etaplar & Geçmiş Sekmesi Çözümü
- **Kök Neden:**
  - 3800px-5200px yüksekliğindeki SVG yol çizgisi (`.animated-map-trail`) üzerinde aynı anda `filter: drop-shadow(...)` ve `stroke-dashoffset` sonsuz animasyonunun çalışması mobil WebView GPU'sunu kilitlemektedir.
  - `openWorldMap()` her açılışta görünmeyen `📜 ETAPLAR & GEÇMİŞ` sekmesindeki 50 kartı da (`renderWoodenStageCards(true)`) senkron olarak yeniden üretmektedir.
- **Kalıcı Çözüm:**
  - SVG üzerindeki ağır `filter: drop-shadow` kaldırıldı; GPU dostu hafif çizgi stili uygulandı.
  - `renderWoodenStageCards()` yalnızca kullanıcı `📜 ETAPLAR & GEÇMİŞ` sekmesine geçtiğinde çalışacak şekilde **Lazy Render** mimarisine alındı.
  - Duraklara tıklandığında açılan `#modal-level-preview` penceresinde önceki bölümlerin rekor/yıldız/oynama bilgileri, `🔄 TEKRAR OYNA` ve `⏭️ SONRAKİ BÖLÜME GEÇ` butonları kusursuz çalışacak şekilde doğrulandı.

---

## 6. ANDROID WEBVIEW 60FPS PERFORMANS VE MOBİL UYUMLULUK MİMARİSİ
- **Sorun 1 (`5050px` SVG Katmanında 60Hz `stroke-dashoffset` Rasterizasyonu):**
  - `.animated-map-trail` üzerindeki `animation: mapTrailEnergyFlow 1.6s linear infinite` animasyonu, Android WebView (Skia) motorunu her karede `5050px` yüksekliğindeki dev SVG katmanını baştan çizmeye zorluyordu.
  - **Çözüm:** `mapTrailEnergyFlow` sonsuz animasyonu kaldırılarak altın kesikli enerji yolu statik GPU katmanına dönüştürüldü (`0%` boşta CPU/GPU tüketimi).
- **Sorun 2 (`box-shadow` ve `filter: drop-shadow` GPU Offscreen FBO Darboğazı):**
  - 5 Boss durağındaki `bossNodeGlow` (`box-shadow` animasyonu) ve 100+ `.map-node-icon` / `.map-node-lock` üzerindeki `filter: drop-shadow(...)` ile `filter: grayscale(1)` kuralları Android WebView'da 140'tan fazla offscreen FBO dokusu oluşturuyordu.
  - **Çözüm:** `bossNodeGlow` animasyonu ve `filter` kuralları kaldırılarak donanım dostu `text-shadow` ve `opacity` kurallarına geçildi; `.zone-trail-banner` içindeki 5 adet 1MB'lık tam ekran JPG arkaplan tekrarı yerine hafif CSS mitolojik gradyanlar tanımlandı.
- **Sorun 3 (Her Harita Açılışında 50 Durak + 200 Event Listener Yıkıp Yeniden Kurma):**
  - `openWorldMap()` her çağrıldığında `container.innerHTML = ''` ile tüm DOM'u silip 50 durağı, 50 rozeti, 5 bölge pankartını ve 200 ayrı `touchstart`/`touchmove`/`touchend`/`onclick` dinleyicisini senkron olarak yeniden oluşturuyordu.
  - **Çözüm:** `__worldMapStateSignature` ile **DOM Önbellekleme (0ms Anında Açılış)**, ilk kurulumda **`DocumentFragment` toplu ekleme** ve `#map-nodes-container` üzerinde **tekil Event Delegation (`__hasDelegatedMapTap`)** mimarisi kuruldu.
- **Sorun 4 (Android Dokunmatik Kaydırma Çakışması - `scroll-behavior: smooth`):**
  - `#screen-worldmap` ve `.screen` üzerindeki `scroll-behavior: smooth` ile `.screen.active` üzerindeki `transform: translateY(0)`, Android'in doğal parmak ivmesi (`native momentum fling`) ve `position: sticky` üst barları ile çakışıyordu.
  - **Çözüm:** `scroll-behavior: auto !important`, `overscroll-behavior-y: contain`, `transform: none` ve `requestAnimationFrame` (`__mapScrollRafPending`) kilitli kaydırma dinleyicisi devreye alındı.


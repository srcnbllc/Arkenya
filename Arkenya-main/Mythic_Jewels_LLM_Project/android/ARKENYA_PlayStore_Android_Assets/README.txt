================================================================================
ARKENYA: MYTHIC JEWELS - GOOGLE PLAY STORE & ANDROID VISUAL ASSETS
================================================================================

Bu klasör, Google Play Store mağaza kaydı ve Android uygulaması için 
tüm standart boyutlarda, profesyonel olarak optimize edilmiş görsel paketidir.

Tüm ikonlarda "ARKENYA" altın kabartmalı logosu ve mavi parlayan elmas amblemi
özel olarak boyutlandırılarak güvenli alanın (safe-zone) içine yerleştirilmiştir.
Google Play ve Android'in yuvarlak (circle), squircle veya kare maskelerinde
"ARKENYA" yazısı ASLA KESİLMEZ, harflerin tümü kusursuz ve net bir biçimde görünür.

--------------------------------------------------------------------------------
1. GOOGLE PLAY STORE MAĞAZA GÖRSELLERİ (Play Console Yüklemeleri)
--------------------------------------------------------------------------------

[A] 01_Arkenya_GooglePlay_Icon_512x512.png
    - Boyut: 512 × 512 piksel (32-bit PNG, max 1MB)
    - Kullanım: Google Play Console -> "Uygulama İkonu" (App Icon)
    - Özellik: Arkenya logosu %64 oranında boyutlandırılmış, Google Play 
      squircle maskesinde tam sığacak ve taşmayacak şekilde ortalanmıştır.

[B] 05_Arkenya_GooglePlay_FeatureGraphic_1024x500.jpg
    - Boyut: 1024 × 500 piksel (JPEG)
    - Kullanım: Google Play Console -> "Öne Çıkan Görsel" (Feature Graphic)
    - Özellik: Gökyüzünde altın ışıklı Arkenya logosu ve tapınak manzarasıyla
      mağazanın en üstünde sergilenen resmi tanıtım başlık afişidir.
    - Not: '05_Arkenya_GooglePlay_FeatureGraphic_1024x500_clean.jpg' yazısız yedektir.

[C] Tanıtım ve Ekran Görüntüleri (Screenshots / Promotional):
    - 06_Arkenya_Promotional_Portrait_1080x1920.png (Dikey Telefon / Tablet)
    - 07_Arkenya_Promotional_Portrait_1242x2208.png (Dikey Yüksek Çözünürlük)
    - 08_Arkenya_Promotional_Landscape_1920x1080.png (Yatay Tablet / Chromebook)
    - 09_Arkenya_Promotional_Landscape_2560x1440.png (Yatay 2K Ultra HD)
    - Kullanım: Google Play Console -> "Telefon / Tablet Ekran Görüntüleri"

--------------------------------------------------------------------------------
2. ANDROID UYGULAMA İÇİ LAUNCHER & ADAPTIVE İKONLARI
--------------------------------------------------------------------------------
Bu ikonlar doğrudan Android projenizin 'android/app/src/main/res/' dizinine 
uygulanmış ve yapılandırılmıştır:

[A] Adaptive Icon (Android 8.0 Oreo ve üzeri - API 26+)
    - 03_Arkenya_AdaptiveIcon_Foreground_432x432.png (Ön Katman - Foreground)
      -> 108dp x 108dp sisteminde 72dp dairesel safe-zone'a göre Arkenya logosu
         içeri çekilmiş ve ortalanmıştır. Samsung, Pixel, Xiaomi, Oppo vb.
         tüm cihazlarda yazı ve elmas tam sığar.
    - 04_Arkenya_AdaptiveIcon_Background_432x432.png (Arka Katman - #09182D)
      -> 'values/ic_launcher_background.xml' rengiyle (%100 uyumlu mitik lacivert)

    Proje Dosyaları:
    - mipmap-mdpi/ic_launcher_foreground.png    (108 × 108)
    - mipmap-hdpi/ic_launcher_foreground.png    (162 × 162)
    - mipmap-xhdpi/ic_launcher_foreground.png   (216 × 216)
    - mipmap-xxhdpi/ic_launcher_foreground.png  (324 × 324)
    - mipmap-xxxhdpi/ic_launcher_foreground.png (432 × 432)

[B] Legacy Raster İkonları (Eski Android sürümleri ve standart başlatıcılar)
    - 02_Arkenya_Launcher_mdpi_48x48.png       -> mipmap-mdpi (48 × 48)
    - 02_Arkenya_Launcher_hdpi_72x72.png       -> mipmap-hdpi (72 × 72)
    - 02_Arkenya_Launcher_xhdpi_96x96.png     -> mipmap-xhdpi (96 × 96)
    - 02_Arkenya_Launcher_xxhdpi_144x144.png   -> mipmap-xxhdpi (144 × 144)
    - 02_Arkenya_Launcher_xxxhdpi_192x192.png -> mipmap-xxxhdpi (192 × 192)

    Hem kare/yumuşak köşeli ('ic_launcher.png') hem de dairesel ('ic_launcher_round.png')
    tüm çözünürlüklerde üretilmiş ve projeye yerleştirilmiştir.

================================================================================
TÜM GÖRSELLER HAZIRLANMIŞ VE PROJEYE EKSİKSİZ ENTEGRE EDİLMİŞTİR!
================================================================================

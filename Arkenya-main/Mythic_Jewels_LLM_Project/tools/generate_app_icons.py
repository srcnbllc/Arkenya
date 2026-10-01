import os
import shutil
from PIL import Image, ImageDraw, ImageFilter

def build_all_assets():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    assets_dir = os.path.join(base_dir, 'android', 'ARKENYA_PlayStore_Android_Assets')
    res_dir = os.path.join(base_dir, 'android', 'app', 'src', 'main', 'res')
    
    # 1. Load source images
    art_512_path = os.path.join(assets_dir, '01_Arkenya_GooglePlay_Icon_512x512.png')
    art_fg_path = os.path.join(assets_dir, '03_Arkenya_AdaptiveIcon_Foreground_432x432.png')
    badge_path = os.path.join(base_dir, 'scratch', 'badge_tight.png')
    feature_path = os.path.join(assets_dir, '05_Arkenya_GooglePlay_FeatureGraphic_1024x500.jpg')
    
    if not os.path.exists(art_512_path) or not os.path.exists(badge_path):
        raise FileNotFoundError("Required source artwork or badge not found.")
        
    art_512 = Image.open(art_512_path).convert('RGBA')
    fg_432 = Image.open(art_fg_path).convert('RGBA')
    badge = Image.open(badge_path).convert('RGBA')
    bw, bh = badge.size
    
    print("[1/6] Generating Google Play 512x512 Master Icon...")
    # Scale badge to 330px width (64% of 512) so it fits with large margins inside Google Play 20% squircle
    w_512 = 330
    scale_512 = float(w_512) / bw
    h_512 = int(bh * scale_512)
    badge_512 = badge.resize((w_512, h_512), Image.Resampling.LANCZOS)
    
    pos_x_512 = (512 - w_512) // 2
    pos_y_512 = 388  # Centered over belt/chest, bottom diamond at y ~ 490 (well above 512)
    
    icon_512 = art_512.copy()
    shadow_512 = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
    b_shadow = Image.new('RGBA', badge_512.size, (0, 0, 0, 240))
    shadow_512.paste(b_shadow, (pos_x_512, pos_y_512 + 6), mask=badge_512)
    shadow_512 = shadow_512.filter(ImageFilter.GaussianBlur(radius=8))
    
    glow_512 = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
    gold_glow = Image.new('RGBA', badge_512.size, (255, 215, 60, 60))
    glow_512.paste(gold_glow, (pos_x_512, pos_y_512), mask=badge_512)
    glow_512 = glow_512.filter(ImageFilter.GaussianBlur(radius=10))
    
    icon_512.paste(shadow_512, (0, 0), mask=shadow_512)
    icon_512.paste(glow_512, (0, 0), mask=glow_512)
    icon_512.paste(badge_512, (pos_x_512, pos_y_512), mask=badge_512)
    
    # Save Google Play Icon in assets folder and Android project
    play_icon_path = os.path.join(assets_dir, '01_Arkenya_GooglePlay_Icon_512x512.png')
    icon_512.convert('RGB').save(play_icon_path, 'PNG')
    
    web_icon_path = os.path.join(base_dir, 'android', 'app', 'src', 'main', 'ic_launcher-web.png')
    icon_512.convert('RGB').save(web_icon_path, 'PNG')
    
    root_icon_path = os.path.join(base_dir, 'google_play_store_icon_512x512.png')
    icon_512.convert('RGB').save(root_icon_path, 'PNG')
    print(" -> 512x512 icons updated successfully.")
    
    # 2. Base rounded and round icons for legacy launchers
    print("[2/6] Generating Legacy Launcher Icons (Square & Round)...")
    # For standalone launcher icon, use subtle rounded corners
    mask_rounded_512 = Image.new('L', (512, 512), 0)
    d_rnd = ImageDraw.Draw(mask_rounded_512)
    d_rnd.rounded_rectangle([(0, 0), (511, 511)], radius=90, fill=255)
    icon_rounded_512 = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
    icon_rounded_512.paste(icon_512, (0, 0), mask=mask_rounded_512)
    
    # For circular icon (ic_launcher_round)
    mask_circle_512 = Image.new('L', (512, 512), 0)
    d_circ = ImageDraw.Draw(mask_circle_512)
    d_circ.ellipse([(0, 0), (511, 511)], fill=255)
    icon_circle_512 = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
    icon_circle_512.paste(icon_512, (0, 0), mask=mask_circle_512)
    
    launcher_densities = {
        'mipmap-mdpi': 48,
        'mipmap-hdpi': 72,
        'mipmap-xhdpi': 96,
        'mipmap-xxhdpi': 144,
        'mipmap-xxxhdpi': 192
    }
    
    for folder, size in launcher_densities.items():
        # A. In ARKENYA_PlayStore_Android_Assets
        name_map = {
            48: '02_Arkenya_Launcher_mdpi_48x48.png',
            72: '02_Arkenya_Launcher_hdpi_72x72.png',
            96: '02_Arkenya_Launcher_xhdpi_96x96.png',
            144: '02_Arkenya_Launcher_xxhdpi_144x144.png',
            192: '02_Arkenya_Launcher_xxxhdpi_192x192.png'
        }
        res_asset = icon_rounded_512.resize((size, size), Image.Resampling.LANCZOS)
        res_asset.save(os.path.join(assets_dir, name_map[size]), 'PNG')
        
        # B. In Android project res/mipmap-*/
        target_dir = os.path.join(res_dir, folder)
        os.makedirs(target_dir, exist_ok=True)
        
        res_legacy = icon_rounded_512.resize((size, size), Image.Resampling.LANCZOS)
        res_legacy.save(os.path.join(target_dir, 'ic_launcher.png'), 'PNG')
        
        res_round = icon_circle_512.resize((size, size), Image.Resampling.LANCZOS)
        res_round.save(os.path.join(target_dir, 'ic_launcher_round.png'), 'PNG')
        print(f" -> {folder}: ic_launcher.png & ic_launcher_round.png ({size}x{size}) saved.")
        
    print("[3/6] Generating Adaptive Icon Foreground & Background...")
    # 3. Adaptive Icon Foreground:
    # Canvas: 432x432 (xxxhdpi), safe circle diameter = 288px (centered at 216, 216, radius 144px).
    # Badge: width = 185px (42.8% of 432), placed at y = 285.
    w_432 = 185
    scale_432 = float(w_432) / bw
    h_432 = int(bh * scale_432)
    badge_432 = badge.resize((w_432, h_432), Image.Resampling.LANCZOS)
    
    pos_x_432 = (432 - w_432) // 2
    pos_y_432 = 285
    
    fg_master = fg_432.copy()
    shadow_432 = Image.new('RGBA', (432, 432), (0, 0, 0, 0))
    b_shadow_432 = Image.new('RGBA', badge_432.size, (0, 0, 0, 240))
    shadow_432.paste(b_shadow_432, (pos_x_432, pos_y_432 + 4), mask=badge_432)
    shadow_432 = shadow_432.filter(ImageFilter.GaussianBlur(radius=6))
    
    glow_432 = Image.new('RGBA', (432, 432), (0, 0, 0, 0))
    gold_glow_432 = Image.new('RGBA', badge_432.size, (255, 215, 60, 60))
    glow_432.paste(gold_glow_432, (pos_x_432, pos_y_432), mask=badge_432)
    glow_432 = glow_432.filter(ImageFilter.GaussianBlur(radius=8))
    
    fg_master.paste(shadow_432, (0, 0), mask=shadow_432)
    fg_master.paste(glow_432, (0, 0), mask=glow_432)
    fg_master.paste(badge_432, (pos_x_432, pos_y_432), mask=badge_432)
    
    # Save 03_Arkenya_AdaptiveIcon_Foreground_432x432.png in assets folder
    fg_master.save(os.path.join(assets_dir, '03_Arkenya_AdaptiveIcon_Foreground_432x432.png'), 'PNG')
    
    # Also save 04_Arkenya_AdaptiveIcon_Background_432x432.png
    bg_color = (9, 24, 45) # #09182D
    bg_master = Image.new('RGB', (432, 432), bg_color)
    bg_master.save(os.path.join(assets_dir, '04_Arkenya_AdaptiveIcon_Background_432x432.png'), 'PNG')
    
    # Generate adaptive foreground for each density in res/mipmap-*/
    adaptive_densities = {
        'mipmap-mdpi': 108,
        'mipmap-hdpi': 162,
        'mipmap-xhdpi': 216,
        'mipmap-xxhdpi': 324,
        'mipmap-xxxhdpi': 432
    }
    for folder, fg_size in adaptive_densities.items():
        target_dir = os.path.join(res_dir, folder)
        fg_scaled = fg_master.resize((fg_size, fg_size), Image.Resampling.LANCZOS)
        fg_scaled.save(os.path.join(target_dir, 'ic_launcher_foreground.png'), 'PNG')
        print(f" -> {folder}: ic_launcher_foreground.png ({fg_size}x{fg_size}) saved.")
        
    # Update res/values/ic_launcher_background.xml
    val_dir = os.path.join(res_dir, 'values')
    os.makedirs(val_dir, exist_ok=True)
    xml_path = os.path.join(val_dir, 'ic_launcher_background.xml')
    with open(xml_path, 'w', encoding='utf-8') as f:
        f.write('<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">#09182D</color>\n</resources>\n')
    print(" -> ic_launcher_background.xml set to #09182D.")
    
    print("[4/6] Generating Google Play Feature Graphic (1024x500)...")
    if os.path.exists(feature_path):
        clean_backup = os.path.join(assets_dir, '05_Arkenya_GooglePlay_FeatureGraphic_1024x500_clean.jpg')
        if not os.path.exists(clean_backup):
            shutil.copy(feature_path, clean_backup)
            
        fg_raw = Image.open(clean_backup).convert('RGBA')
        # Scale badge for feature graphic (490px wide)
        w_fg = 490
        scale_fg = float(w_fg) / bw
        h_fg = int(bh * scale_fg)
        badge_fg = badge.resize((w_fg, h_fg), Image.Resampling.LANCZOS)
        
        pos_x_fg = (1024 - w_fg) // 2
        pos_y_fg = 30  # Centered in the top sky area above warrior crest
        
        shadow_fg = Image.new('RGBA', (1024, 500), (0, 0, 0, 0))
        b_sh_fg = Image.new('RGBA', badge_fg.size, (0, 0, 0, 240))
        shadow_fg.paste(b_sh_fg, (pos_x_fg, pos_y_fg + 8), mask=badge_fg)
        shadow_fg = shadow_fg.filter(ImageFilter.GaussianBlur(radius=14))
        
        glow_fg = Image.new('RGBA', (1024, 500), (0, 0, 0, 0))
        g_glow_fg = Image.new('RGBA', badge_fg.size, (255, 215, 60, 80))
        glow_fg.paste(g_glow_fg, (pos_x_fg, pos_y_fg), mask=badge_fg)
        glow_fg = glow_fg.filter(ImageFilter.GaussianBlur(radius=18))
        
        feature_img = fg_raw.copy()
        feature_img.paste(shadow_fg, (0, 0), mask=shadow_fg)
        feature_img.paste(glow_fg, (0, 0), mask=glow_fg)
        feature_img.paste(badge_fg, (pos_x_fg, pos_y_fg), mask=badge_fg)
        feature_img.convert('RGB').save(feature_path, 'JPEG', quality=95)
        print(" -> Feature graphic 1024x500 updated with epic Arkenya logo.")
        
    print("[5/6] Generating Web, PWA & iOS Assets...")
    # Web & PWA
    web_icons_dir = os.path.join(base_dir, 'www', 'assets', 'icons')
    os.makedirs(web_icons_dir, exist_ok=True)
    icon_rounded_512.resize((192, 192), Image.Resampling.LANCZOS).save(os.path.join(web_icons_dir, 'icon-192.png'), 'PNG')
    icon_rounded_512.resize((512, 512), Image.Resampling.LANCZOS).save(os.path.join(web_icons_dir, 'icon-512.png'), 'PNG')
    icon_rounded_512.resize((64, 64), Image.Resampling.LANCZOS).save(os.path.join(base_dir, 'www', 'favicon.png'), 'PNG')
    
    # iOS
    ios_icon_dir = os.path.join(base_dir, 'ios', 'App', 'App', 'Assets.xcassets', 'AppIcon.appiconset')
    if os.path.exists(ios_icon_dir):
        ios_1024 = Image.new('RGB', (1024, 1024), (9, 24, 45))
        scaled_ios = icon_rounded_512.resize((1024, 1024), Image.Resampling.LANCZOS)
        ios_1024.paste(scaled_ios, (0, 0), mask=scaled_ios)
        ios_1024.save(os.path.join(ios_icon_dir, 'AppIcon-512@2x.png'), 'PNG')
        print(" -> iOS 1024x1024 AppIcon updated.")
        
    print("[6/6] Writing comprehensive README.txt...")
    readme_content = """================================================================================
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
"""
    readme_path = os.path.join(assets_dir, 'README.txt')
    with open(readme_path, 'w', encoding='utf-8') as f:
        f.write(readme_content)
    print(" -> README.txt updated successfully.")

if __name__ == '__main__':
    build_all_assets()
    print("\n>>> ALL ASSETS BUILT & DEPLOYED SUCCESSFULLY! <<<")

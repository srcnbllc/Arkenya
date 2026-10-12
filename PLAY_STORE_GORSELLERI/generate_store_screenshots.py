import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

src = r"c:\Users\sballuca\Desktop\Works\Bogaziciyonetim\Develop\AndroidProjects\Arkenya-main\Arkenya-main\Mythic_Jewels_LLM_Project\Assets\Art"
dst = r"c:\Users\sballuca\Desktop\Works\Bogaziciyonetim\Develop\AndroidProjects\Arkenya-main\PLAY_STORE_GORSELLERI"

os.makedirs(dst, exist_ok=True)

# Try to find a nice font on Windows
font_title = None
font_sub = None
for f_path in ["C:/Windows/Fonts/segoeuib.ttf", "C:/Windows/Fonts/arialbd.ttf"]:
    if os.path.exists(f_path):
        try:
            font_title = ImageFont.truetype(f_path, 48)
            font_sub = ImageFont.truetype(f_path.replace("bd.ttf", ".ttf").replace("b.ttf", ".ttf"), 30)
            break
        except Exception:
            pass

if font_title is None:
    font_title = ImageFont.load_default()
    font_sub = ImageFont.load_default()

screens = [
    ("arkenya_gameplay_ui_1788972701583.png", "03_Telefon_Ekran_1_Oynanis.png", "EFSANEVİ 3'LÜ EŞLEŞTİRME", "Mitolojik kombolar ve tanrısal güçler"),
    ("arkenya_world_map_1788972722664.png", "04_Telefon_Ekran_2_Harita.png", "DESTANSI BÖLÜM HARİTASI", "Antik diyarlarda yüzlerce seviyeyi keşfet"),
    ("arkenya_hero_select_1788972747872.png", "05_Telefon_Ekran_3_Kahramanlar.png", "GÜÇLÜ KAHRAMANLAR", "İlahi yetenekleri geliştir ve tahtayı fethet"),
    ("arkenya_main_menu_1788972680863.png", "06_Telefon_Ekran_4_AnaMenu.png", "ARKENYA DÜNYASI", "Zekanı konuştur, efsaneye katıl")
]

for img_name, out_name, title, subtitle in screens:
    img_path = os.path.join(src, img_name)
    im = Image.open(img_path).convert("RGB")
    
    # 1080x1920 portrait canvas (Google Play phone standard)
    canvas = Image.new("RGB", (1080, 1920), (12, 20, 36))
    
    # Background: blurred scaled version of the game scene
    bg = im.resize((1080, 1920), Image.Resampling.LANCZOS)
    bg = bg.filter(ImageFilter.GaussianBlur(radius=25))
    canvas.paste(bg, (0, 0))
    
    # Dark gradient overlay for contrast
    overlay = Image.new("RGBA", (1080, 1920), (0, 0, 0, 120))
    canvas.paste(overlay, (0, 0), overlay)
    
    # Resize game screen to fit width with margins
    game_w = 980
    game_h = int(im.height * (game_w / im.width))
    im_resized = im.resize((game_w, game_h), Image.Resampling.LANCZOS)
    
    pos_x = (1080 - game_w) // 2
    pos_y = 520
    
    # Border & frame
    draw = ImageDraw.Draw(canvas)
    draw.rectangle([pos_x-4, pos_y-4, pos_x+game_w+4, pos_y+game_h+4], outline=(220, 180, 60), width=4)
    canvas.paste(im_resized, (pos_x, pos_y))
    
    # Typography
    draw.text((540, 200), title, font=font_title, fill=(255, 225, 90), anchor="mm", stroke_width=2, stroke_fill=(15, 15, 25))
    draw.text((540, 280), subtitle, font=font_sub, fill=(240, 245, 255), anchor="mm", stroke_width=1, stroke_fill=(10, 10, 20))
    
    out_path = os.path.join(dst, out_name)
    canvas.save(out_path, "PNG", optimize=True)
    print(f"Generated: {out_name} ({os.path.getsize(out_path)} bytes)")

# Also create clean 1:1 original resolutions directly in case user or tablet needs them
for img_name, out_name, _, _ in screens:
    clean_name = "Kare_" + out_name
    im = Image.open(os.path.join(src, img_name)).convert("RGB")
    im.save(os.path.join(dst, clean_name), "PNG", optimize=True)
    print(f"Generated clean: {clean_name}")

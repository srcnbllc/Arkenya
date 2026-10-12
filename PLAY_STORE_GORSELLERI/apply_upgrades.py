import re

target_file = r"c:\Users\sballuca\Desktop\Works\Bogaziciyonetim\Develop\AndroidProjects\Arkenya-main\Arkenya-main\Mythic_Jewels_LLM_Project\www\index.html"

with open(target_file, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. UPDATE LEVEL_DATA
old_level_data = re.search(r'const LEVEL_DATA = \{[\s\S]*?\n        \};', content)
if not old_level_data:
    print("ERROR: Could not find LEVEL_DATA")
    exit(1)

new_level_data = """const LEVEL_DATA = {
            1: { title: "Herkül'ün Uyanışı", desc: "Olimpos'a ilk adım! 3 aynı taşı yan yana getirerek eşleştir.", targetScore: 8500, maxMoves: 16, tip: "👉 3 aynı taşı yan yana kaydırarak eşleştir!" },
            2: { title: "Kiklop Mağarası", desc: "4 taşı birleştirerek güçlü YILDIRIM KRİSTALİ oluştur!", targetScore: 11000, maxMoves: 17, tip: "⚡ 4 taşı eşleştir! Satırı yok eden Yıldırım Kristali kazan!" },
            3: { title: "Minotor'un Labirenti", desc: "T veya L şeklinde 5 taşı eşleştirerek BOMBA yarat!", targetScore: 13500, maxMoves: 18, tip: "💥 T veya L şeklinde 5 taş eşleştirerek 3x3 Bomba patlat!" },
            4: { title: "Medusa'nın Gözyaşları", desc: "5 taşı düz birleştirerek tahtayı temizleyen ZEUS KÜRESİ'ni çağır!", targetScore: 16500, maxMoves: 18, tip: "🌈 5 taşı düz birleştir! Tek bir rengi yok eden Zeus Küresi çağır!" },
            5: { title: "Pegasus'un Kanatları", desc: "Tüm güçleri birleştir! Kahraman yeteneğini ve güçlendiricileri kullan.", targetScore: 20000, maxMoves: 20, tip: "🛡️ Kombo barını doldurarak Kahraman Yeteneğini serbest bırak!" },
            6: { title: "İkarus'un Düşüşü", desc: "Güneşe çok yaklaşmadan hedefine ulaşmaya çalış, hamlelerini dikkatli seç.", targetScore: 23500, maxMoves: 20 },
            7: { title: "Nemea Aslanı", desc: "Yenilmez postu aşmak için büyük kombolar yaparak aslanı dize getir.", targetScore: 27000, maxMoves: 20 },
            8: { title: "Lerna Ejderhası", desc: "Kesilen her başın yerine iki tane çıkmadan seri eşleştirmeler yap.", targetScore: 30500, maxMoves: 20 },
            9: { title: "Erymanthos Yaban Domuzu", desc: "Öfkeli canavarı yormak için tahtadaki toprak elementlerini temizle.", targetScore: 34000, maxMoves: 20 },
            10: { title: "Hades'in Kapıları (BOSS)", desc: "Yeraltı dünyasının lordunu geçmek için en büyük Zeus patlamalarını tetikle!", targetScore: 42000, maxMoves: 22 },
            11: { title: "Styx Nehri", desc: "Kayıp ruhları karşıya geçirmek için nehrin akışını kontrol eden kristalleri bul.", targetScore: 37000, maxMoves: 20 },
            12: { title: "Kerberos'un Üç Başı", desc: "Cehennem tazısını sakinleştirmek için üçlü kombolarla et parçaları topla.", targetScore: 40000, maxMoves: 20 },
            13: { title: "Tartarus'un Derinlikleri", desc: "Karanlık hapishaneden kaçmak için zincirli taşların kilidini kır.", targetScore: 43000, maxMoves: 21 },
            14: { title: "Titanların Ayaklanması", desc: "Kadim devlerin öfkesini dindirmek için element dengesini sağla.", targetScore: 46000, maxMoves: 21 },
            15: { title: "Atlas'ın Yükü", desc: "Dünyanın ağırlığını hafifletmek için tahtanın altındaki kaya taşlarını yok et.", targetScore: 49000, maxMoves: 21 },
            16: { title: "Prometheus'un Ateşi", desc: "İnsanlığa ateşi ulaştırmak için buzlu taşları erit.", targetScore: 52000, maxMoves: 21 },
            17: { title: "Pandora'nın Kutusu", desc: "Kutudan çıkan kötülükleri geri hapsetmek için hızlı ve keskin oyna.", targetScore: 55000, maxMoves: 21 },
            18: { title: "Sirenlerin Şarkısı", desc: "Büyülü sese aldanmamak için mavi safirleri toplayıp zihnini koru.", targetScore: 58000, maxMoves: 21 },
            19: { title: "Scylla ve Charybdis", desc: "İki canavar arasından gemini sağ salim geçirmek için orta sütunu temizle.", targetScore: 61000, maxMoves: 22 },
            20: { title: "Poseidon'un Öfkesi (BOSS)", desc: "Denizler tanrısının fırtınalarını dindirmek için üçlü eşleştirmelerle okyanusu sakinleştir!", targetScore: 68000, maxMoves: 23 },
            21: { title: "Apollon'un Liri", desc: "Altın telleri titreterek melodiyi tamamla ve güneşin doğmasını sağla.", targetScore: 64000, maxMoves: 22 },
            22: { title: "Artemis'in Yayı", desc: "Ormanın derinliklerinde gümüş okları toplayarak avını yakala.", targetScore: 67000, maxMoves: 22 },
            23: { title: "Ares'in Savaş Arabası", desc: "Savaş alanında kaos yaratmak için kırmızı yakutlarla zincirleme patlamalar yap.", targetScore: 70000, maxMoves: 22 },
            24: { title: "Afrodit'in Güzelliği", desc: "Aşk tanrıçasını etkilemek için en parlak pembe elmasları bir araya getir.", targetScore: 73000, maxMoves: 22 },
            25: { title: "Hermes'in Kanatlı Sandaletleri", desc: "Haberci tanrıya yetişmek için en az hamleyle en yüksek puanı topla.", targetScore: 76000, maxMoves: 22 },
            26: { title: "Hephaistos'un Örsü", desc: "Ateş ve metali döverek yeni efsanevi silahlar yaratmak için taşları erit.", targetScore: 79000, maxMoves: 23 },
            27: { title: "Demeter'in Bereketi", desc: "Kurak toprakları yeşertmek için zümrütleri toplayıp doğayı canlandır.", targetScore: 82000, maxMoves: 23 },
            28: { title: "Dionysos'un Şöleni", desc: "Kutlamalara katılmak için mor ametistleri toplayıp neşeyi artır.", targetScore: 85000, maxMoves: 23 },
            29: { title: "Athena'nın Zekası", desc: "Baykuşun bilgeliğiyle karmaşık bulmacaları stratejik hamlelerle çöz.", targetScore: 88000, maxMoves: 23 },
            30: { title: "Zeus'un Yıldırımları (BOSS)", desc: "Tanrıların kralına karşı gücünü kanıtla, gök gürültüsü kombolarıyla tahtayı sars!", targetScore: 98000, maxMoves: 24 },
            31: { title: "Orpheus'un Hüznü", desc: "Eurydice'yi geri getirmek için karanlık taşları müzik kombolarıyla aydınlat.", targetScore: 92000, maxMoves: 23 },
            32: { title: "Argonautların Seferi", desc: "Altın Post'u bulmak için zorlu denizlerde mücevher haritasını tamamla.", targetScore: 95000, maxMoves: 23 },
            33: { title: "Talos'un Bronz Zırhı", desc: "Devasa metal bekçinin zayıf noktasını bulmak için köşe taşlarını patlat.", targetScore: 98000, maxMoves: 23 },
            34: { title: "Kharon'un Kayığı", desc: "Ölüler nehrini geçmek için altın sikkeleri topla ve kayıkçıya öde.", targetScore: 101000, maxMoves: 23 },
            35: { title: "Midas'ın Dokunuşu", desc: "Her şeyi altına çeviren lanetten kurtulmak için altın taşları normale döndür.", targetScore: 104000, maxMoves: 24 },
            36: { title: "Gorgon'un Bakışı", desc: "Taşlaşmış hücreleri kırmak için etraflarındaki mücevherleri arka arkaya patlat.", targetScore: 107000, maxMoves: 24 },
            37: { title: "Eris'in Altın Elması", desc: "Kaosu önlemek için uyumsuz taşları hızla tahtadan temizle.", targetScore: 110000, maxMoves: 24 },
            38: { title: "Hesperidlerin Bahçesi", desc: "Ölümsüzlük elmalarını koruyan ejderhayı atlatarak meyveleri topla.", targetScore: 113000, maxMoves: 24 },
            39: { title: "Nemesis'in Terazisi", desc: "İlahi adaleti sağlamak için tahtanın sağ ve sol tarafındaki renkleri dengele.", targetScore: 116000, maxMoves: 24 },
            40: { title: "Hades'in Dönüşü (BOSS)", desc: "Yeraltı tanrısı daha güçlü döndü! Tüm özel yeteneklerini kullanarak onu mağlup et!", targetScore: 126000, maxMoves: 25 },
            41: { title: "Olimpos'un Etekleri", desc: "Zirveye yaklaşırken son engelleri aşmak için en uzun eşleştirme zincirlerini kur.", targetScore: 120000, maxMoves: 24 },
            42: { title: "Kader Tanrıçaları (Moiralar)", desc: "Kader ipliklerini doğru örmek için renk sıralamasına dikkat ederek ilerle.", targetScore: 123000, maxMoves: 24 },
            43: { title: "Uranüs'ün Yıldızları", desc: "Gökyüzünün ilk tanrısına ulaşmak için astral kristalleri topla.", targetScore: 126000, maxMoves: 24 },
            44: { title: "Gaia'nın Kalbi", desc: "Toprak ananın enerjisini hissetmek için yeşil taşlarla büyük patlamalar yarat.", targetScore: 129000, maxMoves: 24 },
            45: { title: "Kronos'un Zamanı", desc: "Zaman daralıyor! Kum saatleri dolmadan hedef puana ulaşmalısın.", targetScore: 132000, maxMoves: 24 },
            46: { title: "Eros'un Okları", desc: "Farklı renkteki taşları birbiriyle eşleştirerek sevgi bağları kur.", targetScore: 135000, maxMoves: 24 },
            47: { title: "Hyperion'un Işığı", desc: "Karanlık bölümleri aydınlatmak için güneş taşlarını patlat.", targetScore: 138000, maxMoves: 25 },
            48: { title: "Nyx'in Gecesi", desc: "Gecenin karanlığında sadece parlayan mücevherleri bularak yolunu çiz.", targetScore: 141000, maxMoves: 25 },
            49: { title: "Elysium Çayırları", desc: "Kahramanların cennetinde huzuru bulmak için son bulmacaları kolayca çöz.", targetScore: 144000, maxMoves: 25 },
            50: { title: "Olimpos'un Zirvesi (GRAND BOSS)", desc: "Tüm tanrıların gücünü test et! Evrenin en güçlü kahramanı olmak için tahtayı paramparça et!", targetScore: 155000, maxMoves: 26 },
        };"""

content = content.replace(old_level_data.group(0), new_level_data)
print("1. LEVEL_DATA updated successfully.")

# 2. UPDATE SCORING FORMULA
# Replace baseEarned = finalPopArray.length * 60; const earned = baseEarned * comboMultiplier;
scoring_old = """                // Scoring with Multiplier & Feedback
                const baseEarned = finalPopArray.length * 60;
                const earned = baseEarned * comboMultiplier;
                gameScore += earned;"""

scoring_new = """                // Scoring with Balanced Multiplier & Anti-Inflation Feedback
                const baseEarned = finalPopArray.length * 45;
                const dampedMultiplier = comboMultiplier <= 1 ? 1 : Math.min(2.4, 1 + (comboMultiplier - 1) * 0.35);
                const earned = Math.round(baseEarned * dampedMultiplier);
                gameScore += earned;"""

if scoring_old in content:
    content = content.replace(scoring_old, scoring_new)
    print("2. Match scoring formula balanced successfully.")
else:
    print("WARNING: scoring_old block not found verbatim, checking regex...")
    content = re.sub(
        r'const baseEarned = finalPopArray\.length \* \d+;\s*const earned = baseEarned \* comboMultiplier;\s*gameScore \+= earned;',
        """const baseEarned = finalPopArray.length * 45;
                const dampedMultiplier = comboMultiplier <= 1 ? 1 : Math.min(2.4, 1 + (comboMultiplier - 1) * 0.35);
                const earned = Math.round(baseEarned * dampedMultiplier);
                gameScore += earned;""",
        content
    )
    print("2. Match scoring formula replaced via regex.")

# Dual special combo score dampening:
content = re.sub(r'const earned = destroyedCount \* 120;', 'const earned = destroyedCount * 75;', content)

# 3. UPDATE MAP TOP BAR: Add Back to Main Menu Button
old_map_bar = """                <!-- Map Top Navigation Tabs -->
                <div class="map-top-bar">
                    <button class="map-tab-btn active" id="btn-tab-visual" onclick="setMapTab('visual')">🗺️ ORMAN PARKURU</button>
                    <button class="map-tab-btn" id="btn-tab-list" onclick="setMapTab('list')">📜 ETAP LİSTESİ</button>
                </div>"""

new_map_bar = """                <!-- Map Top Navigation Bar with Back Button + Dual Tabs -->
                <div class="map-top-bar" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; gap: 8px;">
                    <button class="btn-action-sub" style="width: auto; min-width: 90px; height: 38px; padding: 0 10px; font-size: 12px; font-weight: 800; border-radius: 10px; display: flex; align-items: center; justify-content: center; gap: 4px; border: 1.5px solid var(--gold-primary); background: rgba(15,22,38,0.92);" onclick="showScreen('screen-mainmenu')">
                        🏠 MENÜ
                    </button>
                    <div style="display: flex; gap: 6px; flex: 1; justify-content: flex-end;">
                        <button class="map-tab-btn active" id="btn-tab-visual" onclick="setMapTab('visual')">🗺️ PARKUR</button>
                        <button class="map-tab-btn" id="btn-tab-list" onclick="setMapTab('list')">📜 ETAPLAR</button>
                    </div>
                </div>"""

if old_map_bar in content:
    content = content.replace(old_map_bar, new_map_bar)
    print("3. Map top bar back button added successfully.")
else:
    print("WARNING: old_map_bar not matched verbatim.")

# 4. UPDATE BOTTOM NAV CSS & PADDING FOR SAFE AREA
old_bottom_nav_css = """.bottom-nav {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 72px;
            background: linear-gradient(180deg, rgba(15, 22, 38, 0.98) 0%, rgba(4, 6, 10, 1) 100%);
            border-top: 2.5px solid var(--gold-primary);
            box-shadow: 0 -4px 25px rgba(245, 197, 66, 0.35), inset 0 1px 2px rgba(255,255,255,0.2);
            display: flex;
            justify-content: space-around;
            align-items: center;
            padding-bottom: 8px;
            z-index: 500;
            box-sizing: border-box;
            pointer-events: auto;
        }"""

new_bottom_nav_css = """.bottom-nav {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            min-height: 74px;
            height: calc(72px + env(safe-area-inset-bottom, 22px));
            background: linear-gradient(180deg, rgba(15, 22, 38, 0.98) 0%, rgba(4, 6, 10, 1) 100%);
            border-top: 2.5px solid var(--gold-primary);
            box-shadow: 0 -4px 25px rgba(245, 197, 66, 0.35), inset 0 1px 2px rgba(255,255,255,0.2);
            display: flex;
            justify-content: space-around;
            align-items: flex-start;
            padding-top: 8px;
            padding-bottom: max(18px, env(safe-area-inset-bottom, 22px));
            z-index: 500;
            box-sizing: border-box;
            pointer-events: auto;
        }"""

if old_bottom_nav_css in content:
    content = content.replace(old_bottom_nav_css, new_bottom_nav_css)
    print("4. Bottom nav safe area CSS updated successfully.")
else:
    print("WARNING: old_bottom_nav_css not matched verbatim.")

# Increase padding-bottom on stage-list-area so cards are never covered
content = re.sub(
    r'\.stage-list-area\s*\{\s*padding:\s*15px\s*14px\s*100px;',
    '.stage-list-area {\n            padding: 15px 14px calc(115px + env(safe-area-inset-bottom, 24px));',
    content
)

# 5. ENHANCE handleNativeBackAction() FOR GAMEPLAY & ALL SCREENS
old_back_action = """        function handleNativeBackAction() {
            const activeModal = document.querySelector('.modal-overlay.active');
            if (activeModal) {
                closeModal(activeModal.id);
                return;
            }
            if (currentActiveScreen === 'screen-gameplay') {
                if (!isLevelEnding) {
                    openModal('modal-pause');
                }
                return;
            }
            if (currentActiveScreen !== 'screen-mainmenu') {
                navigateBack();
                return;
            }

            // On Main Menu: Prompt double-tap to exit application
            const now = Date.now();
            if (now - lastNativeBackPressTime < 2200) {
                if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.App && window.Capacitor.Plugins.App.exitApp) {
                    window.Capacitor.Plugins.App.exitApp();
                }
            } else {
                lastNativeBackPressTime = now;
                showToast("🚪 Çıkmak için tekrar geri tuşuna basın", "info");
            }
        }"""

new_back_action = """        function handleNativeBackAction() {
            // 1. If any modal is active, close the topmost modal safely
            const activeModals = Array.from(document.querySelectorAll('.modal-overlay.active'));
            if (activeModals.length > 0) {
                const topModal = activeModals[activeModals.length - 1];
                closeModal(topModal.id);
                return;
            }

            // 2. In active gameplay: smoothly open the Pause modal (never glitch or crash screen)
            if (currentActiveScreen === 'screen-gameplay') {
                if (!isLevelEnding) {
                    const pauseModal = document.getElementById('modal-pause');
                    if (pauseModal && !pauseModal.classList.contains('active')) {
                        openModal('modal-pause');
                    } else if (pauseModal && pauseModal.classList.contains('active')) {
                        closeModal('modal-pause');
                    }
                }
                return;
            }

            // 3. In Secondary Screens (World Map, Hero, Store): smoothly return to Main Menu
            if (currentActiveScreen !== 'screen-mainmenu') {
                showScreen('screen-mainmenu');
                return;
            }

            // 4. On Main Menu: Prompt double-tap to cleanly exit application
            const now = Date.now();
            if (now - lastNativeBackPressTime < 2200) {
                if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.App && window.Capacitor.Plugins.App.exitApp) {
                    window.Capacitor.Plugins.App.exitApp();
                }
            } else {
                lastNativeBackPressTime = now;
                showToast("🚪 Oyundan çıkmak için tekrar geri tuşuna basın", "info");
            }
        }"""

if old_back_action in content:
    content = content.replace(old_back_action, new_back_action)
    print("5. handleNativeBackAction() perfected successfully.")
else:
    print("WARNING: old_back_action not matched verbatim.")

with open(target_file, 'w', encoding='utf-8') as f:
    f.write(content)

print(">>> SUCCESS: www/index.html fully updated!")

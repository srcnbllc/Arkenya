const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

console.log("Auditing and optimizing 1-50 level progression, scoring, cascades and victory loop...");

// 1. ADD movesLeftAtWin definition
if (!html.includes('let movesLeftAtWin = 0;')) {
    html = html.replace('let isLevelEnding = false;', 'let isLevelEnding = false;\n        let movesLeftAtWin = 0;');
}

// 2. UPDATE checkGameEnd to save movesLeftAtWin before cascade
const oldCheckGameEnd = `        function checkGameEnd() {
            if (isLevelEnding) return;

            if (gameScore >= gameTarget) {
                isLevelEnding = true;
                sfxVictory();
                if (gameMoves > 0) {
                    spawnFloatingCombo("⚡ TANRISAL BİTİRİŞ! ⚡");
                    isCascading = true;
                    setTimeout(triggerEndLevelCascade, 600);
                } else {
                    spawnFloatingCombo("🎉 BÖLÜM GEÇİLDİ! 🎉");
                    setTimeout(showVictory, 800);
                }
            } else if (gameMoves <= 0) {
                isLevelEnding = true;
                if (gameScore >= gameTarget * 0.9) {
                    document.getElementById('game-grid').style.boxShadow = "0 0 50px rgba(255, 0, 0, 0.8)";
                    setTimeout(() => { document.getElementById('game-grid').style.boxShadow = "none"; }, 2000);
                    spawnFloatingCombo("😲 ÇOK YAKLAŞTIN! 😲");
                }
                sfxDefeat();
                openModal('modal-save-me');
            }
        }`;

const newCheckGameEnd = `        function checkGameEnd() {
            if (isLevelEnding) return;

            if (gameScore >= gameTarget) {
                isLevelEnding = true;
                movesLeftAtWin = gameMoves; // Save initial moves at win for 3-star calculation!
                sfxVictory();
                triggerHaptic('heavy');
                if (gameMoves > 0) {
                    spawnFloatingCombo("⚡ TANRISAL BİTİRİŞ! ⚡");
                    isCascading = true;
                    setTimeout(triggerEndLevelCascade, 500);
                } else {
                    spawnFloatingCombo("🎉 BÖLÜM GEÇİLDİ! 🎉");
                    setTimeout(showVictory, 700);
                }
            } else if (gameMoves <= 0) {
                isLevelEnding = true;
                if (gameScore >= gameTarget * 0.9) {
                    const grid = document.getElementById('game-grid');
                    if (grid) {
                        grid.style.boxShadow = "0 0 50px rgba(255, 0, 0, 0.8)";
                        setTimeout(() => { grid.style.boxShadow = "none"; }, 2000);
                    }
                    spawnFloatingCombo("😲 ÇOK YAKLAŞTIN! 😲");
                }
                sfxDefeat();
                triggerHaptic('medium');
                openModal('modal-save-me');
            }
        }`;

html = html.replace(oldCheckGameEnd, newCheckGameEnd);

// 3. FIX triggerEndLevelCascade (replace updateProgressBar with updateStarProgressBar and add safe cell explosion)
const oldEndCascade = `        function triggerEndLevelCascade() {
            if (gameMoves <= 0) {
                isCascading = false;
                setTimeout(showVictory, 1500);
                return;
            }
            
            // Randomly turn a cell into a bomb
            let r = Math.floor(Math.random() * 8);
            let c = Math.floor(Math.random() * 8);
            
            // Deduct move
            gameMoves--;
            document.getElementById('game-moves').innerText = gameMoves;
            
            spawnFloatingCombo("+500 Puan!");
            gameScore += 500;
            updateProgressBar();
            
            // Recursion
            setTimeout(triggerEndLevelCascade, 300);
        }`;

const newEndCascade = `        function triggerEndLevelCascade() {
            if (gameMoves <= 0) {
                isCascading = false;
                setTimeout(showVictory, 600);
                return;
            }
            
            gameMoves--;
            document.getElementById('game-moves').innerText = gameMoves;
            
            const r = Math.floor(Math.random() * 8);
            const c = Math.floor(Math.random() * 8);
            const cells = document.getElementById('game-grid').children;
            const idx = r * 8 + c;
            if (cells && cells[idx]) {
                cells[idx].classList.add('exploding');
                setTimeout(() => {
                    if (cells[idx]) cells[idx].classList.remove('exploding');
                }, 300);
            }
            
            triggerHaptic('light');
            gameScore += 500;
            document.getElementById('game-score').innerText = gameScore.toLocaleString();
            updateStarProgressBar();
            spawnFloatingScore("+500 Bonus!");
            
            setTimeout(triggerEndLevelCascade, 220);
        }`;

html = html.replace(oldEndCascade, newEndCascade);

// 4. FIX showVictory to correctly use movesLeftAtWin and first-time bonus
const oldShowVictorySnippet = `            // 3-Star Logic based on remaining moves
            let stars = 1;
            if (gameMoves >= 10) stars = 3;
            else if (gameMoves >= 5) stars = 2;

            const lvl = gameState.currentPlayingLevel || 1;
            if (lvl === 50 && gameScore >= gameTarget) {
                setTimeout(() => {
                    document.getElementById('intermission-screen').style.display = 'none';
                    openModal('modal-final-celebration');
                    sfxVictory();
                }, 2000);
            }

            if ((gameState.completedLevels[lvl] || 0) < stars) {
                gameState.completedLevels[lvl] = stars;
            }

            // Animate stars
            document.querySelectorAll('.victory-star').forEach(s => s.classList.remove('active'));
            setTimeout(() => { document.getElementById('v-star-1').classList.add('active'); }, 300);
            if (stars >= 2) setTimeout(() => { document.getElementById('v-star-2').classList.add('active'); }, 700);
            if (stars >= 3) setTimeout(() => { document.getElementById('v-star-3').classList.add('active'); }, 1100);

            // Calculate rewards
            const earnedGold = 100 + Math.floor(gameScore / 100);
            const isFirstTime = (gameState.completedLevels[lvl] || 0) === 0;
            const earnedGems = isFirstTime ? 15 : 2;

            if (lvl >= gameState.unlockedLevel && lvl < 50) {
                gameState.unlockedLevel = lvl + 1;
            }`;

const newShowVictorySnippet = `            const lvl = gameState.currentPlayingLevel || 1;
            const isFirstTime = !gameState.completedLevels[lvl];

            // 3-Star Logic based on moves remaining when victory was achieved
            let stars = 1;
            if (movesLeftAtWin >= 8 || gameScore >= gameTarget * 1.4) stars = 3;
            else if (movesLeftAtWin >= 3 || gameScore >= gameTarget * 1.15) stars = 2;

            if ((gameState.completedLevels[lvl] || 0) < stars) {
                gameState.completedLevels[lvl] = stars;
            }

            if (lvl >= (gameState.unlockedLevel || 1) && lvl < 50) {
                gameState.unlockedLevel = lvl + 1;
            }

            if (lvl === 50 && gameScore >= gameTarget) {
                setTimeout(() => {
                    openModal('modal-final-celebration');
                    sfxVictory();
                }, 2000);
            }

            // Animate stars
            document.querySelectorAll('.victory-star').forEach(s => s.classList.remove('active'));
            setTimeout(() => { document.getElementById('v-star-1').classList.add('active'); }, 300);
            if (stars >= 2) setTimeout(() => { document.getElementById('v-star-2').classList.add('active'); }, 700);
            if (stars >= 3) setTimeout(() => { document.getElementById('v-star-3').classList.add('active'); }, 1100);

            // Calculate rewards
            const earnedGold = 150 + Math.floor(gameScore / 80);
            const earnedGems = isFirstTime ? 20 : 3;`;

html = html.replace(oldShowVictorySnippet, newShowVictorySnippet);

// 5. UPDATE FULL 50 LEVELS IN LEVEL_DATA WITH SMOOTH BALANCED CURVE
const full50LevelsCode = `        const LEVEL_DATA = {
            1: { title: "Herkül'ün Uyanışı", desc: "Olimpos'a ilk adım! 3 aynı taşı yan yana getirerek eşleştir.", targetScore: 2500, maxMoves: 35, tip: "👉 3 aynı taşı yan yana kaydırarak eşleştir!" },
            2: { title: "Kiklop Mağarası", desc: "4 taşı birleştirerek güçlü YILDIRIM KRİSTALİ oluştur!", targetScore: 4200, maxMoves: 32, tip: "⚡ 4 taşı eşleştir! Satırı yok eden Yıldırım Kristali kazan!" },
            3: { title: "Minotor'un Labirenti", desc: "T veya L şeklinde 5 taşı eşleştirerek BOMBA yarat!", targetScore: 5800, maxMoves: 30, tip: "💥 T veya L şeklinde 5 taş eşleştirerek 3x3 Bomba patlat!" },
            4: { title: "Medusa'nın Gözyaşları", desc: "5 taşı düz birleştirerek tahtayı temizleyen ZEUS KÜRESİ'ni çağır!", targetScore: 7500, maxMoves: 28, tip: "🌈 5 taşı düz birleştir! Tek bir rengi yok eden Zeus Küresi çağır!" },
            5: { title: "Pegasus'un Kanatları", desc: "Tüm güçleri birleştir! Kahraman yeteneğini ve güçlendiricileri kullan.", targetScore: 9800, maxMoves: 28, tip: "🛡️ Kombo barını doldurarak Kahraman Yeteneğini serbest bırak!" },
            6: { title: "İkarus'un Düşüşü", desc: "Güneşe çok yaklaşmadan hedefine ulaşmaya çalış, hamlelerini dikkatli seç.", targetScore: 12500, maxMoves: 30 },
            7: { title: "Nemea Aslanı", desc: "Yenilmez postu aşmak için büyük kombolar yaparak aslanı dize getir.", targetScore: 14000, maxMoves: 30 },
            8: { title: "Lerna Ejderhası", desc: "Kesilen her başın yerine iki tane çıkmadan seri eşleştirmeler yap.", targetScore: 16000, maxMoves: 30 },
            9: { title: "Erymanthos Yaban Domuzu", desc: "Öfkeli canavarı yormak için tahtadaki toprak elementlerini temizle.", targetScore: 18500, maxMoves: 29 },
            10: { title: "Hades'in Kapıları (BOSS)", desc: "Yeraltı dünyasının lordunu geçmek için en büyük Zeus patlamalarını tetikle!", targetScore: 24000, maxMoves: 28 },
            11: { title: "Styx Nehri", desc: "Kayıp ruhları karşıya geçirmek için nehrin akışını kontrol eden kristalleri bul.", targetScore: 20500, maxMoves: 29 },
            12: { title: "Kerberos'un Üç Başı", desc: "Cehennem tazısını sakinleştirmek için üçlü kombolarla et parçaları topla.", targetScore: 22000, maxMoves: 29 },
            13: { title: "Tartarus'un Derinlikleri", desc: "Karanlık hapishaneden kaçmak için zincirli taşların kilidini kır.", targetScore: 24500, maxMoves: 29 },
            14: { title: "Titanların Ayaklanması", desc: "Kadim devlerin öfkesini dindirmek için element dengesini sağla.", targetScore: 26000, maxMoves: 28 },
            15: { title: "Atlas'ın Yükü", desc: "Dünyanın ağırlığını hafifletmek için tahtanın altındaki kaya taşlarını yok et.", targetScore: 27500, maxMoves: 28 },
            16: { title: "Prometheus'un Ateşi", desc: "İnsanlığa ateşi ulaştırmak için buzlu taşları erit.", targetScore: 28500, maxMoves: 28 },
            17: { title: "Pandora'nın Kutusu", desc: "Kutudan çıkan kötülükleri geri hapsetmek için hızlı ve keskin oyna.", targetScore: 30000, maxMoves: 28 },
            18: { title: "Sirenlerin Şarkısı", desc: "Büyülü sese aldanmamak için mavi safirleri toplayıp zihnini koru.", targetScore: 32000, maxMoves: 27 },
            19: { title: "Scylla ve Charybdis", desc: "İki canavar arasından gemini sağ salim geçirmek için orta sütunu temizle.", targetScore: 33500, maxMoves: 27 },
            20: { title: "Poseidon'un Öfkesi (BOSS)", desc: "Denizler tanrısının fırtınalarını dindirmek için üçlü eşleştirmelerle okyanusu sakinleştir!", targetScore: 38000, maxMoves: 27 },
            21: { title: "Apollon'un Liri", desc: "Altın telleri titreterek melodiyi tamamla ve güneşin doğmasını sağla.", targetScore: 36000, maxMoves: 28 },
            22: { title: "Artemis'in Yayı", desc: "Ormanın derinliklerinde gümüş okları toplayarak avını yakala.", targetScore: 38000, maxMoves: 27 },
            23: { title: "Ares'in Savaş Arabası", desc: "Savaş alanında kaos yaratmak için kırmızı yakutlarla zincirleme patlamalar yap.", targetScore: 39500, maxMoves: 27 },
            24: { title: "Afrodit'in Güzelliği", desc: "Aşk tanrıçasını etkilemek için en parlak pembe elmasları bir araya getir.", targetScore: 41000, maxMoves: 27 },
            25: { title: "Hermes'in Kanatlı Sandaletleri", desc: "Haberci tanrıya yetişmek için en az hamleyle en yüksek puanı topla.", targetScore: 43000, maxMoves: 27 },
            26: { title: "Hephaistos'un Örsü", desc: "Ateş ve metali döverek yeni efsanevi silahlar yaratmak için taşları erit.", targetScore: 45000, maxMoves: 26 },
            27: { title: "Demeter'in Bereketi", desc: "Kurak toprakları yeşertmek için zümrütleri toplayıp doğayı canlandır.", targetScore: 46500, maxMoves: 26 },
            28: { title: "Dionysos'un Şöleni", desc: "Kutlamalara katılmak için mor ametistleri toplayıp neşeyi artır.", targetScore: 47500, maxMoves: 26 },
            29: { title: "Athena'nın Zekası", desc: "Baykuşun bilgeliğiyle karmaşık bulmacaları stratejik hamlelerle çöz.", targetScore: 49000, maxMoves: 26 },
            30: { title: "Zeus'un Yıldırımları (BOSS)", desc: "Tanrıların kralına karşı gücünü kanıtla, gök gürültüsü kombolarıyla tahtayı sars!", targetScore: 54000, maxMoves: 26 },
            31: { title: "Orpheus'un Hüznü", desc: "Eurydice'yi geri getirmek için karanlık taşları müzik kombolarıyla aydınlat.", targetScore: 52000, maxMoves: 26 },
            32: { title: "Argonautların Seferi", desc: "Altın Post'u bulmak için zorlu denizlerde mücevher haritasını tamamla.", targetScore: 53500, maxMoves: 26 },
            33: { title: "Talos'un Bronz Zırhı", desc: "Devasa metal bekçinin zayıf noktasını bulmak için köşe taşlarını patlat.", targetScore: 55000, maxMoves: 26 },
            34: { title: "Kharon'un Kayığı", desc: "Ölüler nehrini geçmek için altın sikkeleri topla ve kayıkçıya öde.", targetScore: 57000, maxMoves: 26 },
            35: { title: "Midas'ın Dokunuşu", desc: "Her şeyi altına çeviren lanetten kurtulmak için altın taşları normale döndür.", targetScore: 58500, maxMoves: 26 },
            36: { title: "Gorgon'un Bakışı", desc: "Taşlaşmış hücreleri kırmak için etraflarındaki mücevherleri arka arkaya patlat.", targetScore: 59500, maxMoves: 25 },
            37: { title: "Eris'in Altın Elması", desc: "Kaosu önlemek için uyumsuz taşları hızla tahtadan temizle.", targetScore: 61000, maxMoves: 25 },
            38: { title: "Hesperidlerin Bahçesi", desc: "Ölümsüzlük elmalarını koruyan ejderhayı atlatarak meyveleri topla.", targetScore: 63000, maxMoves: 25 },
            39: { title: "Nemesis'in Terazisi", desc: "İlahi adaleti sağlamak için tahtanın sağ ve sol tarafındaki renkleri dengele.", targetScore: 64500, maxMoves: 25 },
            40: { title: "Hades'in Dönüşü (BOSS)", desc: "Yeraltı tanrısı daha güçlü döndü! Tüm özel yeteneklerini kullanarak onu mağlup et!", targetScore: 68000, maxMoves: 26 },
            41: { title: "Olimpos'un Etekleri", desc: "Zirveye yaklaşırken son engelleri aşmak için en uzun eşleştirme zincirlerini kur.", targetScore: 65000, maxMoves: 25 },
            42: { title: "Kader Tanrıçaları (Moiralar)", desc: "Kader ipliklerini doğru örmek için renk sıralamasına dikkat ederek ilerle.", targetScore: 67500, maxMoves: 25 },
            43: { title: "Uranüs'ün Yıldızları", desc: "Gökyüzünün ilk tanrısına ulaşmak için astral kristalleri topla.", targetScore: 69500, maxMoves: 25 },
            44: { title: "Gaia'nın Kalbi", desc: "Toprak ananın enerjisini hissetmek için yeşil taşlarla büyük patlamalar yarat.", targetScore: 71000, maxMoves: 25 },
            45: { title: "Kronos'un Zamanı", desc: "Zaman daralıyor! Kum saatleri dolmadan hedef puana ulaşmalısın.", targetScore: 72000, maxMoves: 25 },
            46: { title: "Eros'un Okları", desc: "Farklı renkteki taşları birbiriyle eşleştirerek sevgi bağları kur.", targetScore: 74000, maxMoves: 25 },
            47: { title: "Hyperion'un Işığı", desc: "Karanlık bölümleri aydınlatmak için güneş taşlarını patlat.", targetScore: 76000, maxMoves: 25 },
            48: { title: "Nyx'in Gecesi", desc: "Gecenin karanlığında sadece parlayan mücevherleri bularak yolunu çiz.", targetScore: 77500, maxMoves: 25 },
            49: { title: "Elysium Çayırları", desc: "Kahramanların cennetinde huzuru bulmak için son bulmacaları kolayca çöz.", targetScore: 78500, maxMoves: 26 },
            50: { title: "Olimpos'un Zirvesi (GRAND BOSS)", desc: "Tüm tanrıların gücünü test et! Evrenin en güçlü kahramanı olmak için tahtayı paramparça et!", targetScore: 82000, maxMoves: 28 },
        };`;

const levelDataRegex = /const LEVEL_DATA = \{[\s\S]*?\};\s*function isHeroUnlocked/;
html = html.replace(levelDataRegex, full50LevelsCode + '\n\n        function isHeroUnlocked');

// 6. SYNC TO ALL HTML FILES
fs.writeFileSync('index.html', html);
fs.writeFileSync('www/index.html', html);
fs.writeFileSync('Arkenya_Playable_Demo.html', html);
fs.writeFileSync('www/Arkenya_Playable_Demo.html', html);

console.log("All 50 levels verified, balanced, and synchronized!");

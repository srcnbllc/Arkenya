const fs = require('fs');

console.log('=== PATCHING SIMULATED MANAGER LEADERBOARD (REMOVING FIREBASE) ===');

let html = fs.readFileSync('www/index.html', 'utf8');

// 1. Update status pill text in modal-leaderboard HTML
const oldStatusHtml = `                        <div id="lb-sync-status" style="display: flex; align-items: center; gap: 6px; color: #4ade80; font-weight: 600;">
                            <span style="width: 8px; height: 8px; border-radius: 50%; background: #4ade80; display: inline-block; box-shadow: 0 0 8px #4ade80;"></span>
                            <span>🟢 Firebase Canlı Sıralama</span>
                        </div>`;

const newStatusHtml = `                        <div id="lb-sync-status" style="display: flex; align-items: center; gap: 6px; color: #4ade80; font-weight: 600;">
                            <span style="width: 8px; height: 8px; border-radius: 50%; background: #4ade80; display: inline-block; box-shadow: 0 0 8px #4ade80;"></span>
                            <span>🏆 Menajerlik Sezon Ligi (20 Yarışmacı)</span>
                        </div>`;

if (html.includes(oldStatusHtml)) {
    html = html.replace(oldStatusHtml, newStatusHtml);
    console.log('PASS: Replaced lb-sync-status in HTML');
} else {
    console.log('NOTE: oldStatusHtml not exact match, searching regex...');
    html = html.replace(/<div id="lb-sync-status"[\s\S]*?<\/div>/, newStatusHtml);
    console.log('PASS: Replaced lb-sync-status via regex');
}

// 2. Identify the JS block for Firebase & Leaderboard
const jsTargetStart = '        // AAA LUXURY FIREBASE FIRESTORE SYNC & LEADERBOARD ENGINE';
const jsTargetEnd = '        // SPECIAL GEM STATE (Parallel Grid for Candy Crush Mechanics)';

const startIndex = html.indexOf(jsTargetStart);
const endIndex = html.indexOf(jsTargetEnd);

if (startIndex === -1 || endIndex === -1) {
    console.error('ERROR: Could not locate JS target boundaries:', { startIndex, endIndex });
    process.exit(1);
}

const newLeaderboardEngineJS = `        // =========================================================================
        // AAA LUXURY SIMULATED OLYMPUS MANAGER LEAGUE & LEADERBOARD ENGINE
        // 100% Offline-First, Zero Backend Dependency, Real Player Score Integration
        // =========================================================================
        let currentLeaderboardTab = 'haftalik';
        let currentSelectedAvatar = 'arkenya';

        // Profil Modalı Açma
        function openProfileModal(forceSetup = false) {
            const modal = document.getElementById('modal-profile-setup');
            if (!modal) return;

            const nameInput = document.getElementById('profile-input-username');
            const titleEl = document.getElementById('profile-modal-title');
            const btnSubmit = document.getElementById('profile-btn-submit');
            const closeBtn = document.getElementById('profile-modal-close');

            const profile = (gameState && gameState.playerProfile) ? gameState.playerProfile : { username: 'OlimposSavaşçısı', avatarHero: 'arkenya' };
            currentSelectedAvatar = profile.avatarHero || 'arkenya';

            if (nameInput) nameInput.value = profile.username || 'OlimposSavaşçısı';

            if (forceSetup) {
                if (titleEl) titleEl.innerText = "KAHRAMANINI SEÇ & PROFİL OLUŞTUR";
                if (btnSubmit) btnSubmit.innerText = "⚡ LİGE KATIL VE BAŞLA";
                if (closeBtn) closeBtn.style.display = 'none';
            } else {
                if (titleEl) titleEl.innerText = "KAHRAMAN PROFİLİN";
                if (btnSubmit) btnSubmit.innerText = "💾 GÜNCELLE VE KAYDET";
                if (closeBtn) closeBtn.style.display = 'block';
            }

            renderProfileHeroGrid();
            modal.classList.add('active');
        }

        function renderProfileHeroGrid() {
            const grid = document.getElementById('profile-hero-grid');
            if (!grid) return;

            const heroList = [
                { key: 'arkenya', name: 'Arkenya', title: 'Işığın Muhafızı', img: 'Assets/Art/hero_arkenya.jpg' },
                { key: 'asterion', name: 'Asterion', title: 'Boğa Savaşçısı', img: 'Assets/Art/hero_asterion_1789032622044.png' },
                { key: 'nyra', name: 'Nyra', title: 'Fırtına Avcısı', img: 'Assets/Art/hero_nyra_1789032644250.png' },
                { key: 'thalor', name: 'Thalor', title: 'Derinliklerin Devi', img: 'Assets/Art/hero_thalor_1789032663594.png' },
                { key: 'athena', name: 'Athena', title: 'Bilgelik Tanrıçası', img: 'Assets/Art/hero_athena_1789032003209.png' },
                { key: 'zeus', name: 'Zeus', title: 'Göklerin Efendisi', img: 'Assets/Art/hero_zeus_1789031982831.png' }
            ];

            grid.innerHTML = heroList.map(h => {
                const isSelected = h.key === currentSelectedAvatar;
                return \`
                    <div class="profile-hero-card \${isSelected ? 'selected' : ''}" onclick="selectProfileAvatar('\${h.key}')" 
                        style="position: relative; background: rgba(15, 23, 42, 0.85); border: 2px solid \${isSelected ? 'var(--gold-primary)' : 'rgba(255,255,255,0.12)'}; border-radius: 12px; padding: 8px 4px; text-align: center; cursor: pointer; transition: all 0.2s ease; \${isSelected ? 'box-shadow: 0 0 16px rgba(245, 197, 66, 0.4); transform: scale(1.03);' : ''}">
                        \${isSelected ? '<div style="position: absolute; top: -6px; right: -6px; width: 20px; height: 20px; background: var(--gold-primary); color: #000; border-radius: 50%; font-size: 11px; font-weight: 900; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.5);">✓</div>' : ''}
                        <div style="width: 52px; height: 52px; margin: 0 auto 6px auto; border-radius: 50%; background: url('\${h.img}') center/cover no-repeat; border: 1.5px solid \${isSelected ? 'var(--gold-light)' : 'rgba(255,255,255,0.2)'};"></div>
                        <div style="font-size: 12px; font-weight: 800; color: \${isSelected ? 'var(--gold-light)' : '#fff'}; line-height: 1.2;">\${h.name}</div>
                        <div style="font-size: 9px; color: \${isSelected ? 'var(--accent-blue)' : '#94a3b8'}; margin-top: 2px;">\${h.title}</div>
                    </div>
                \`;
            }).join('');
        }

        function selectProfileAvatar(heroKey) {
            currentSelectedAvatar = heroKey;
            renderProfileHeroGrid();
            triggerHaptic('light');
        }

        function submitProfileSetup() {
            const input = document.getElementById('profile-input-username');
            let name = input ? input.value.trim() : '';
            if (!name) name = 'OlimposSavaşçısı';
            if (name.length > 16) name = name.substring(0, 16);

            if (!gameState.completedTutorials) gameState.completedTutorials = {};
            if (!gameState.playerProfile) {
                gameState.playerProfile = {
                    userId: 'arkenya_user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
                    createdAt: Date.now()
                };
            }

            gameState.playerProfile.username = name;
            gameState.playerProfile.avatarHero = currentSelectedAvatar;
            gameState.playerProfile.heroName = currentSelectedAvatar.toUpperCase();
            gameState.playerProfile.hasCompletedProfile = true;
            gameState.selectedHero = currentSelectedAvatar;

            saveGame();
            updateHUD();
            closeModal('modal-profile-setup');
            showToast(\`Hoş Geldin, \${name}! Profilin Olimpos'a kaydedildi.\`, 'success');

            syncScoreToLeaderboard();
        }

        // Yerel Skor & Menajerlik Ligi Senkronizasyonu (100% Çevrimdışı & Anlık)
        function syncScoreToLeaderboard(forcedScore = null) {
            if (!gameState) return;
            const scoreAllTime = forcedScore !== null ? forcedScore : (gameState.totalScore || 0);
            gameState.weeklyScore = Math.max(gameState.weeklyScore || 0, scoreAllTime);
            gameState.monthlyScore = Math.max(gameState.monthlyScore || 0, scoreAllTime);
            gameState.totalScore = Math.max(gameState.totalScore || 0, scoreAllTime);
            
            try {
                localStorage.setItem('arkenya_player_score_weekly', String(gameState.weeklyScore));
                localStorage.setItem('arkenya_player_score_monthly', String(gameState.monthlyScore));
                localStorage.setItem('arkenya_player_score_alltime', String(gameState.totalScore));
            } catch(e) {}
        }

        // ==========================================
        // REALISTIC 5-TIER OLYMPUS LEAGUE SYSTEM
        // Balanced score ranges aligned with level progression
        // ==========================================
        const OLYMPUS_LEAGUES = [
            { id: 'bronze', name: 'Bronz Ligi', icon: '🥉', minLevel: 1, maxLevel: 10, color: '#cd7f32', rewardGems: 30, rewardGold: 1000, desc: 'Acemi Panteonu (Seviye 1-10)', baseScore: 3500 },
            { id: 'silver', name: 'Gümüş Ligi', icon: '🥈', minLevel: 11, maxLevel: 20, color: '#c0c0c0', rewardGems: 60, rewardGold: 2500, desc: 'Maceracı Panteonu (Seviye 11-20)', baseScore: 18000 },
            { id: 'gold', name: 'Altın Ligi', icon: '🥇', minLevel: 21, maxLevel: 35, color: '#ffd700', rewardGems: 120, rewardGold: 6000, desc: 'Muhafız Panteonu (Seviye 21-35)', baseScore: 45000 },
            { id: 'diamond', name: 'Elmas Ligi', icon: '💎', minLevel: 36, maxLevel: 45, color: '#00d2ff', rewardGems: 250, rewardGold: 12000, desc: 'Yarı-Tanrılar (Seviye 36-45)', baseScore: 90000 },
            { id: 'olympus', name: 'Olimpos Efsaneleri', icon: '👑', minLevel: 46, maxLevel: 50, color: '#ffe885', rewardGems: 500, rewardGold: 25000, desc: 'Zirve Şampiyonları (Seviye 46-50)', baseScore: 160000 }
        ];

        function getCurrentPlayerLeague(lvl) {
            lvl = lvl || gameState.unlockedLevel || 1;
            for (let i = OLYMPUS_LEAGUES.length - 1; i >= 0; i--) {
                if (lvl >= OLYMPUS_LEAGUES[i].minLevel) {
                    return OLYMPUS_LEAGUES[i];
                }
            }
            return OLYMPUS_LEAGUES[0];
        }

        // 19 Simüle Mitolojik Rakip Havuzu (Kullanıcı ile Birlikte Tam 20 Kişilik Menajerlik Ligi)
        const OLYMPUS_RIVALS_POOL = [
            { name: "Alkeus", hero: "zeus", trait: "🔥 Formda" },
            { name: "Kassandra", hero: "athena", trait: "⭐ Taktikçi" },
            { name: "Leonidas", hero: "asterion", trait: "⚔️ Agresif" },
            { name: "Helena", hero: "nyra", trait: "⚡ Çevik" },
            { name: "Thales", hero: "thalor", trait: "🛡️ Savunmacı" },
            { name: "Damon", hero: "arkenya", trait: "✨ Muhafız" },
            { name: "Orion", hero: "zeus", trait: "🎯 Keskin" },
            { name: "Hermia", hero: "athena", trait: "📖 Bilge" },
            { name: "Aethel", hero: "nyra", trait: "🌪️ Fırtına" },
            { name: "Perseus", hero: "asterion", trait: "🗡️ Avcı" },
            { name: "Achilles", hero: "zeus", trait: "👑 Şampiyon" },
            { name: "Atalanta", hero: "nyra", trait: "🏹 Rüzgar" },
            { name: "Hector", hero: "thalor", trait: "🏰 Kale" },
            { name: "Icarus", hero: "arkenya", trait: "☀️ Cesur" },
            { name: "Midas", hero: "athena", trait: "💰 Zengin" },
            { name: "Callisto", hero: "nyra", trait: "🌙 Gizemli" },
            { name: "Castor", hero: "asterion", trait: "🐎 Hızlı" },
            { name: "Pollux", hero: "zeus", trait: "⚡ Güçlü" },
            { name: "Evander", hero: "thalor", trait: "⛰️ Dev" }
        ];

        // Menajerlik Oyunlarındaki Gibi Canlı Simüle Rakipler Üretir & Önbelleğe Alır
        function getSimulatedLeagueParticipants(league, isRefresh = false) {
            const cacheKey = 'arkenya_sim_league_v2_' + league.id;
            let rivals = [];

            if (!isRefresh) {
                try {
                    const raw = localStorage.getItem(cacheKey);
                    if (raw) rivals = JSON.parse(raw);
                } catch(e) {}
            }

            // Önbellek yoksa veya yenileniyorsa üret
            if (!rivals || rivals.length < 19) {
                const base = league.baseScore;
                rivals = OLYMPUS_RIVALS_POOL.map((p, idx) => {
                    // 1. sıradan 19. sıraya gerçekçi menajerlik puan dağılımı
                    const multiplier = 1.35 - (idx * 0.055) + ((idx % 3 === 0 ? 0.04 : -0.03));
                    const score = Math.max(600, Math.floor(base * multiplier));
                    const levelSpan = league.maxLevel - league.minLevel;
                    const levelOffset = Math.min(league.maxLevel, league.minLevel + Math.floor((19 - idx) * (levelSpan / 19)));
                    return {
                        userId: 'sim_pantheon_' + league.id + '_' + idx,
                        username: p.name,
                        avatarHero: p.hero,
                        trait: p.trait,
                        scoreWeekly: score,
                        scoreMonthly: Math.floor(score * 3.4),
                        scoreAllTime: Math.floor(score * 8.0),
                        level: Math.max(league.minLevel, levelOffset)
                    };
                });

                try {
                    localStorage.setItem(cacheKey, JSON.stringify(rivals));
                } catch(e) {}
            } else if (isRefresh) {
                // Yenileme butonuna basıldığında rakiplerin küçük puan değişimleri (canlı lig simülasyonu)
                rivals.forEach(r => {
                    const delta = Math.floor(Math.random() * 90) + 15;
                    r.scoreWeekly += delta;
                    r.scoreMonthly += delta * 2;
                    r.scoreAllTime += delta * 3;
                });
                try {
                    localStorage.setItem(cacheKey, JSON.stringify(rivals));
                } catch(e) {}
            }

            return rivals;
        }

        function switchLeaderboardTab(tab) {
            currentLeaderboardTab = tab;
            loadLeaderboard(tab, false);
            triggerHaptic('light');
        }

        function refreshLeaderboard() {
            const btn = document.getElementById('btn-refresh-lb');
            if (btn) {
                btn.style.transform = 'rotate(360deg)';
                btn.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
                setTimeout(() => { btn.style.transform = 'none'; btn.style.transition = 'none'; }, 550);
            }
            triggerHaptic('medium');
            loadLeaderboard(currentLeaderboardTab, true);
            showToast("🏆 Lig maçları simüle edildi ve sıralamalar güncellendi!", "info");
        }

        // Menajerlik Tarzı Çevrimdışı Olimpos Ligi Motoru
        function loadLeaderboard(type = 'haftalik', isRefresh = false) {
            currentLeaderboardTab = type;
            const listEl = document.getElementById('leaderboard-list');
            const playerCardEl = document.getElementById('lb-player-card');
            const syncStatusEl = document.getElementById('lb-sync-status');
            const timerEl = document.getElementById('lb-timer');
            const leagueBadgeEl = document.getElementById('lb-league-badge');
            const rewardValEl = document.getElementById('lb-season-reward-val');
            if (!listEl) return;

            // Oyuncunun ait olduğu güncel lig kademesi
            const playerLvl = gameState.unlockedLevel || 1;
            const currentLeague = getCurrentPlayerLeague(playerLvl);
            if (leagueBadgeEl) {
                leagueBadgeEl.innerHTML = \`\${currentLeague.icon} \${currentLeague.name.toUpperCase()} • \${currentLeague.desc}\`;
                leagueBadgeEl.style.color = currentLeague.color;
            }
            if (rewardValEl) {
                rewardValEl.innerHTML = \` \${currentLeague.rewardGems} 💎 + \${currentLeague.rewardGold.toLocaleString()} 💰\`;
            }

            // Sekme buton stilleri
            ['haftalik', 'aylik', 'genel'].forEach(t => {
                const btn = document.getElementById(\`tab-\${t}\`);
                if (btn) {
                    if (t === type) {
                        btn.style.background = 'linear-gradient(135deg, var(--gold-primary), #d49b13)';
                        btn.style.color = '#000';
                        btn.style.borderColor = 'var(--gold-light)';
                        btn.style.boxShadow = '0 2px 10px rgba(245, 197, 66, 0.35)';
                    } else {
                        btn.style.background = 'rgba(255,255,255,0.06)';
                        btn.style.color = '#aaa';
                        btn.style.borderColor = 'rgba(255,255,255,0.1)';
                        btn.style.boxShadow = 'none';
                    }
                }
            });

            if (timerEl) {
                if (type === 'haftalik') timerEl.innerText = 'Sıfırlanma: Pazartesi 00:00';
                else if (type === 'aylik') timerEl.innerText = 'Sıfırlanma: 30 Günlük Sezon';
                else timerEl.innerText = 'Tüm Zamanların Efsaneleri';
            }

            if (syncStatusEl) {
                syncStatusEl.innerHTML = \`<span style="width: 7px; height: 7px; border-radius: 50%; background: #4ade80; display: inline-block; box-shadow: 0 0 6px #4ade80;"></span> <span style="color: #4ade80;">🏆 Menajerlik Sezon Ligi (20 Yarışmacı)</span>\`;
            }

            // 19 Simüle rakibi al
            let records = getSimulatedLeagueParticipants(currentLeague, isRefresh);

            // Kullanıcının gerçek profil ve puan bilgileri
            const myProfile = gameState.playerProfile || {
                userId: 'me',
                username: 'OlimposSavaşçısı',
                avatarHero: gameState.selectedHero || 'arkenya'
            };

            const myScore = type === 'haftalik' 
                ? (gameState.weeklyScore || gameState.totalScore || 0) 
                : (type === 'aylik' 
                    ? (gameState.monthlyScore || gameState.totalScore || 0) 
                    : (gameState.totalScore || 0));

            // Kullanıcının gerçek kaydını ekle (Tam 20 yarışmacı)
            records = records.filter(r => !r.isMe && r.userId !== myProfile.userId);
            records.push({
                userId: myProfile.userId || 'me',
                username: myProfile.username || 'Sen',
                avatarHero: myProfile.avatarHero || gameState.selectedHero || 'arkenya',
                trait: '👑 Lider Adayı',
                scoreWeekly: gameState.weeklyScore || myScore,
                scoreMonthly: gameState.monthlyScore || (myScore * 3),
                scoreAllTime: gameState.totalScore || myScore,
                level: gameState.unlockedLevel || 1,
                isMe: true
            });

            // Puana göre büyükten küçüğe kesin sıralama
            records.sort((a, b) => {
                const sA = type === 'haftalik' ? a.scoreWeekly : (type === 'aylik' ? a.scoreMonthly : a.scoreAllTime);
                const sB = type === 'haftalik' ? b.scoreWeekly : (type === 'aylik' ? b.scoreMonthly : b.scoreAllTime);
                return sB - sA;
            });

            const myRank = records.findIndex(r => r.isMe) + 1;

            const heroAvatars = {
                arkenya: 'Assets/Art/hero_arkenya.jpg',
                asterion: 'Assets/Art/hero_asterion_1789032622044.png',
                nyra: 'Assets/Art/hero_nyra_1789032644250.png',
                thalor: 'Assets/Art/hero_thalor_1789032663594.png',
                athena: 'Assets/Art/hero_athena_1789032003209.png',
                zeus: 'Assets/Art/hero_zeus_1789031982831.png'
            };

            // 20 Kişilik lig tablosunu oluştur
            let html = '';
            records.forEach((entry, idx) => {
                const rank = idx + 1;
                const score = type === 'haftalik' ? entry.scoreWeekly : (type === 'aylik' ? entry.scoreMonthly : entry.scoreAllTime);
                const isMe = entry.isMe;
                const avatarSrc = heroAvatars[entry.avatarHero] || 'Assets/Art/hero_arkenya.jpg';

                let medal = rank;
                let rankBadgeStyle = 'color: #94a3b8; font-weight: 700; font-size: 13px;';
                let rowBg = isMe 
                    ? 'background: linear-gradient(90deg, rgba(245, 197, 66, 0.25) 0%, rgba(0, 210, 255, 0.15) 100%); border: 1.5px solid var(--gold-primary); box-shadow: 0 0 12px rgba(245, 197, 66, 0.25);' 
                    : 'background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05);';

                let zoneTag = '';
                if (rank <= 3) {
                    zoneTag = '<span style="font-size: 8px; background: rgba(74, 222, 128, 0.18); color: #4ade80; border: 1px solid rgba(74, 222, 128, 0.4); border-radius: 4px; padding: 1px 4px; margin-left: 4px; font-weight: 800;">TERFİ 🟢</span>';
                } else if (rank >= 16) {
                    zoneTag = '<span style="font-size: 8px; background: rgba(248, 113, 113, 0.18); color: #f87171; border: 1px solid rgba(248, 113, 113, 0.4); border-radius: 4px; padding: 1px 4px; margin-left: 4px; font-weight: 800;">DÜŞME 🔴</span>';
                }

                if (rank === 1) {
                    medal = '🥇';
                    rankBadgeStyle = 'font-size: 16px;';
                    if (!isMe) rowBg = 'background: linear-gradient(90deg, rgba(245, 197, 66, 0.15) 0%, rgba(20, 28, 45, 0.6) 100%); border: 1px solid rgba(245, 197, 66, 0.4);';
                } else if (rank === 2) {
                    medal = '🥈';
                    rankBadgeStyle = 'font-size: 16px;';
                    if (!isMe) rowBg = 'background: linear-gradient(90deg, rgba(160, 216, 239, 0.12) 0%, rgba(20, 28, 45, 0.6) 100%); border: 1px solid rgba(0, 210, 255, 0.35);';
                } else if (rank === 3) {
                    medal = '🥉';
                    rankBadgeStyle = 'font-size: 16px;';
                    if (!isMe) rowBg = 'background: linear-gradient(90deg, rgba(205, 127, 50, 0.12) 0%, rgba(20, 28, 45, 0.6) 100%); border: 1px solid rgba(205, 127, 50, 0.35);';
                }

                html += \`
                    <div style="display: flex; align-items: center; justify-content: space-between; padding: 7px 8px; margin-bottom: 5px; border-radius: 10px; \${rowBg}">
                        <div style="display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0;">
                            <div style="width: 24px; text-align: center; \${rankBadgeStyle}">\${medal}</div>
                            <div style="width: 32px; height: 32px; border-radius: 50%; background: url('\${avatarSrc}') center/cover no-repeat; border: 1.5px solid \${isMe ? 'var(--gold-primary)' : 'rgba(255,255,255,0.2)'}; flex-shrink: 0;"></div>
                            <div style="text-align: left; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                                <div style="font-size: 12.5px; font-weight: 800; color: \${isMe ? 'var(--gold-light)' : '#fff'}; display: flex; align-items: center; gap: 4px;">
                                    \${entry.username} \${isMe ? '<span style="font-size: 8.5px; background: var(--gold-primary); color: #000; padding: 1px 4px; border-radius: 4px; font-weight: 900;">SEN</span>' : ''} \${zoneTag}
                                </div>
                                <div style="font-size: 9.5px; color: #94a3b8;">Bölüm \${entry.level} • <span style="color: var(--accent-blue);">\${entry.trait || entry.avatarHero}</span></div>
                            </div>
                        </div>
                        <div style="font-size: 12.5px; font-weight: 800; color: var(--gold-light); text-align: right; margin-left: 8px;">
                            \${(score || 0).toLocaleString()} <span style="font-size: 10px; color: var(--gold-primary);">⚡</span>
                        </div>
                    </div>
                \`;
            });

            listEl.innerHTML = html;

            // Alt Sabit Kullanıcı Kartı
            if (playerCardEl) {
                const myAvatarSrc = heroAvatars[myProfile.avatarHero] || 'Assets/Art/hero_arkenya.jpg';
                let nextGapText = '';
                let myZoneStatus = '<span style="color: #cbd5e1;">⚪ Güvenli Bölgedesin</span>';
                if (myRank <= 3) {
                    myZoneStatus = '<span style="color: #4ade80; font-weight: 800;">🟢 Terfi Bölgesindesin! (+1 Üst Lig)</span>';
                } else if (myRank >= 16) {
                    myZoneStatus = '<span style="color: #f87171; font-weight: 800;">🔴 Düşme Hattı! (Seviye Geçip Puan Topla)</span>';
                }

                if (myRank > 1 && records[myRank - 2]) {
                    const aheadScore = type === 'haftalik' ? records[myRank - 2].scoreWeekly : (type === 'aylik' ? records[myRank - 2].scoreMonthly : records[myRank - 2].scoreAllTime);
                    const diff = aheadScore - myScore;
                    if (diff > 0) {
                        nextGapText = \`<div style="font-size: 9.5px; color: #38bdf8;">\${myRank - 1}. Sıraya: <b>+\${diff.toLocaleString()}</b> Puan</div>\`;
                    }
                } else if (myRank === 1) {
                    nextGapText = \`<div style="font-size: 9.5px; color: var(--gold-light); font-weight: bold;">👑 Olimpos Panteonu Zirvesindesin!</div>\`;
                }

                playerCardEl.innerHTML = \`
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <div style="font-size: 13px; font-weight: 900; color: var(--gold-light); min-width: 22px;">#\${myRank}</div>
                        <div style="width: 34px; height: 34px; border-radius: 50%; background: url('\${myAvatarSrc}') center/cover no-repeat; border: 1.5px solid var(--gold-light); box-shadow: 0 0 8px rgba(245,197,66,0.3);"></div>
                        <div style="text-align: left;">
                            <div style="font-size: 12.5px; font-weight: 800; color: #fff;">\${myProfile.username || 'Sen'} <span style="font-size: 8.5px; color: var(--gold-primary);">(Senin Kartın)</span></div>
                            <div style="font-size: 9.5px;">\${myZoneStatus}</div>
                            \${nextGapText}
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 13px; font-weight: 900; color: var(--gold-light);">\${myScore.toLocaleString()} <span style="font-size: 10px;">⚡</span></div>
                        <div style="font-size: 9px; color: #aaa;">Bölüm \${gameState.unlockedLevel || 1} • \${currentLeague.name}</div>
                    </div>
                \`;
            }
        }
`;

html = html.substring(0, startIndex) + newLeaderboardEngineJS + '\n' + html.substring(endIndex);

fs.writeFileSync('www/index.html', html, 'utf8');
console.log('PASS: www/index.html successfully updated with Simulated Manager Leaderboard!');

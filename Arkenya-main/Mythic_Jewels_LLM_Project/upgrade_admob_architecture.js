const fs = require('fs');

console.log('=== UPGRADING ADMOB MONETIZATION ARCHITECTURE ===');

const filePath = 'www/index.html';
let content = fs.readFileSync(filePath, 'utf8');

// Find existing window.AdGuard definition
const startMarker = '        window.AdGuard = {';
const endMarker = '        function watchAdForExtraMoves() {';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
    console.error('ERROR: Could not locate window.AdGuard block!');
    process.exit(1);
}

const newAdGuardBlock = `        // ==========================================
        // AD GUARD & ADMOB NATIVE MONETIZATION SUITE
        // Hybrid-ready: Real AdMob (@capacitor-community/admob) + Safe Simulator Fallback
        // VIP / No-Ads Pass: Interstitials blocked, Rewarded Ads converted to Instant VIP Rewards
        // ==========================================
        window.AdGuard = {
            isAdActive: false,
            lastInterstitialTime: 0,
            interstitialCooldownMs: 150000, // 2.5 minutes frequency cap
            admobInitialized: false,

            // AdMob Production & Test Unit IDs
            adUnitIds: {
                rewarded: {
                    android: 'ca-app-pub-3940256099942544/5224354917', // Google Official Test Rewarded
                    ios: 'ca-app-pub-3940256099942544/1712485313'
                },
                interstitial: {
                    android: 'ca-app-pub-3940256099942544/1033173712', // Google Official Test Interstitial
                    ios: 'ca-app-pub-3940256099942544/4411468910'
                }
            },

            initAdMob: async function() {
                if (this.admobInitialized) return;
                if (typeof window !== 'undefined' && window.Capacitor && window.Capacitor.isPluginAvailable && window.Capacitor.isPluginAvailable('AdMob')) {
                    try {
                        const { AdMob } = window.Capacitor.Plugins;
                        await AdMob.initialize({
                            requestTrackingAuthorization: true,
                            initializeForTesting: false
                        });
                        this.admobInitialized = true;
                        console.log('[AdGuard] Native AdMob plugin initialized successfully.');
                    } catch(e) {
                        console.warn('[AdGuard] AdMob init fallback:', e);
                    }
                }
            },

            prepareForAd: function(adType = 'rewarded') {
                this.isAdActive = true;
                saveActiveMatchSession();
                if (typeof stopStoryVoice === 'function') stopStoryVoice();
                if (sharedAudioContext && sharedAudioContext.state === 'running') {
                    try { sharedAudioContext.suspend(); } catch(e) {}
                }
                isSwapping = true;
            },

            onAdClosed: function(rewardEarned = false, callback = null) {
                this.isAdActive = false;
                isSwapping = false;
                if (sharedAudioContext && sharedAudioContext.state === 'suspended') {
                    try { sharedAudioContext.resume().catch(() => {}); } catch(e) {}
                }
                if (rewardEarned && typeof callback === 'function') {
                    callback();
                }
            },

            // INTERSTITIAL ADS (Geçiş Reklamları - Bölüm Aralarında)
            showInterstitialAd: async function(placement = 'map_return', onClosed = null) {
                // KURAL 1: Reklamsız paket (No-Ads / VIP Pass) sahiplerine ASLA geçiş reklamı gösterilmez!
                if (gameState && gameState.noAds) {
                    if (typeof onClosed === 'function') onClosed();
                    return;
                }

                // KURAL 2: İlk 3 seviyede oyuncuyu oyuna bağlamak için geçiş reklamı gösterilmez
                const curLvl = (gameState && gameState.unlockedLevel) ? gameState.unlockedLevel : 1;
                if (curLvl <= 3) {
                    if (typeof onClosed === 'function') onClosed();
                    return;
                }

                // KURAL 3: Frequency Capping - 2.5 dakikadan sık geçiş reklamı çıkmaz
                const now = Date.now();
                if (now - this.lastInterstitialTime < this.interstitialCooldownMs) {
                    if (typeof onClosed === 'function') onClosed();
                    return;
                }

                this.lastInterstitialTime = now;
                this.prepareForAd('interstitial');

                // Gerçek AdMob eklentisi yüklüyse
                if (this.admobInitialized && window.Capacitor.Plugins.AdMob) {
                    try {
                        const { AdMob } = window.Capacitor.Plugins;
                        const isAndroid = window.Capacitor.getPlatform() === 'android';
                        const adId = isAndroid ? this.adUnitIds.interstitial.android : this.adUnitIds.interstitial.ios;
                        await AdMob.prepareInterstitial({ adId });
                        await AdMob.showInterstitial();
                        this.onAdClosed(true, onClosed);
                        return;
                    } catch(adMobErr) {
                        console.warn('[AdGuard] Native Interstitial failed, fallback to simulator:', adMobErr);
                    }
                }

                // Web / Simulator Fallback
                this.renderSimulatedAdOverlay("Bölüm Arası Sponsorlu Reklam", 2, false, () => {
                    this.onAdClosed(true, onClosed);
                });
            },

            // REWARDED ADS (Ödüllü Reklamlar - 2X Ödül, Can, Hamle)
            showRewardedAd: async function(rewardTitle, onReward) {
                // KURAL 1: Reklamsız VIP Pass sahipleri video izlemeden ANINDA ödülü alır!
                if (gameState && gameState.noAds) {
                    showToast("👑 VIP Reklamsız Pass: Ödül anında verildi!", "success");
                    if (typeof onReward === 'function') onReward();
                    return;
                }

                this.prepareForAd('rewarded');

                // Gerçek AdMob eklentisi yüklüyse
                if (this.admobInitialized && window.Capacitor.Plugins.AdMob) {
                    try {
                        const { AdMob } = window.Capacitor.Plugins;
                        const isAndroid = window.Capacitor.getPlatform() === 'android';
                        const adId = isAndroid ? this.adUnitIds.rewarded.android : this.adUnitIds.rewarded.ios;
                        await AdMob.prepareRewardVideoAd({ adId });
                        const rewardItem = await AdMob.showRewardVideoAd();
                        if (rewardItem) {
                            this.onAdClosed(true, onReward);
                            return;
                        }
                    } catch(adMobErr) {
                        console.warn('[AdGuard] Native Rewarded failed, fallback to simulator:', adMobErr);
                    }
                }

                // Web / Simulator Fallback
                this.renderSimulatedAdOverlay(rewardTitle, 3, true, () => {
                    this.onAdClosed(true, onReward);
                });
            },

            renderSimulatedAdOverlay: function(title, durationSec = 3, isRewarded = true, onFinish = null) {
                const adOverlay = document.createElement('div');
                adOverlay.id = 'admob-simulated-overlay';
                adOverlay.style.cssText = 'position:fixed;inset:0;z-index:999999;background:rgba(0,0,0,0.95);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;text-align:center;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);';
                adOverlay.innerHTML = '<div style="background:linear-gradient(135deg, #1a2234 0%, #0d1322 100%);border:2px solid var(--gold-primary);border-radius:20px;padding:24px;max-width:360px;width:90%;box-shadow:0 10px 40px rgba(0,0,0,0.85);text-align:center;">' +
                    '<div style="font-size:38px;margin-bottom:8px;">📺</div>' +
                    '<div style="font-size:16px;font-weight:800;color:var(--gold-light);margin-bottom:6px;">' + title + '</div>' +
                    '<div style="font-size:12px;color:#94a3b8;margin-bottom:16px;">Sponsorlu reklam oynatılıyor...</div>' +
                    '<div style="background:rgba(0,0,0,0.45);border-radius:10px;padding:12px;margin-bottom:16px;border:1px solid rgba(255,255,255,0.1);">' +
                        '<div id="ad-countdown" style="font-size:22px;font-weight:900;color:#22c55e;">⏳ ' + durationSec + ' sn...</div>' +
                    '</div>' +
                    '<button id="btn-ad-close" class="btn-action" style="display:none;background:linear-gradient(180deg,#22c55e,#15803d);color:#fff;font-weight:800;height:44px;font-size:14px;box-shadow:0 4px 15px rgba(34,197,94,0.4);">' + (isRewarded ? '🎁 ÖDÜLÜ AL VE DEVAM ET' : 'KAPAT VE DEVAM ET ➔') + '</button>' +
                    '<button id="btn-ad-fallback-skip" style="display:none;margin-top:10px;background:transparent;border:none;color:#64748b;font-size:11px;cursor:pointer;text-decoration:underline;">✕ Reklamı Atla</button>' +
                '</div>';
                document.body.appendChild(adOverlay);

                let countdown = durationSec;
                let isFinished = false;
                const interval = setInterval(() => {
                    countdown--;
                    const countEl = document.getElementById('ad-countdown');
                    if (countEl && !isFinished) countEl.innerText = '⏳ ' + countdown + ' sn...';
                    if (countdown <= 0) {
                        clearInterval(interval);
                        isFinished = true;
                        if (countEl) countEl.innerText = "✅ Reklam Tamamlandı!";
                        const btn = document.getElementById('btn-ad-close');
                        if (btn) {
                            btn.style.display = 'block';
                            btn.onclick = () => {
                                if (adOverlay && adOverlay.parentNode) adOverlay.remove();
                                if (typeof onFinish === 'function') onFinish();
                            };
                        }
                    }
                }, 1000);

                // Watchdog: After 6 seconds, allow emergency skip if stuck
                setTimeout(() => {
                    const fallbackSkip = document.getElementById('btn-ad-fallback-skip');
                    if (fallbackSkip) {
                        fallbackSkip.style.display = 'inline-block';
                        fallbackSkip.onclick = () => {
                            clearInterval(interval);
                            if (adOverlay && adOverlay.parentNode) adOverlay.remove();
                            window.AdGuard.onAdClosed(false, null);
                        };
                    }
                }, 6000);
            }
        };

`;

content = content.substring(0, startIndex) + newAdGuardBlock + content.substring(endIndex);

// Also add AdMob initialization call to initCapacitorMobileApp
if (!content.includes('window.AdGuard.initAdMob()')) {
    content = content.replace('initCapacitorMobileApp() {', 'initCapacitorMobileApp() {\n                if (window.AdGuard && typeof window.AdGuard.initAdMob === "function") window.AdGuard.initAdMob();');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ SUCCESS: Upgraded window.AdGuard to full AdMob Hybrid Architecture!');

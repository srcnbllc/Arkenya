const fs = require('fs');
const path = require('path');

const targetPath = path.resolve(__dirname, 'www/index.html');
let html = fs.readFileSync(targetPath, 'utf8');

console.log('--- Applying Monetization & Weekly Competitive League Multiplier ---');

// 1. Safe AdMob testing device
const oldAdMob = `                        const { AdMob } = window.Capacitor.Plugins;
                        await AdMob.initialize({
                            requestTrackingAuthorization: true,
                            initializeForTesting: false
                        });`;

const newAdMob = `                        const { AdMob } = window.Capacitor.Plugins;
                        await AdMob.initialize({
                            requestTrackingAuthorization: true,
                            testingDevices: ['EMULATOR'],
                            initializeForTesting: false
                        });`;

if (html.includes(oldAdMob)) {
    html = html.replace(oldAdMob, newAdMob);
    console.log('✓ 1. AdMob safe testing device configuration applied.');
} else {
    console.log('! 1. AdMob block already modified or not found.');
}

// 2. Victory Modal League Multiplier Row
const oldVictoryBoxEnd = `                            <div style="background: rgba(255,255,255,0.04); border-radius: 7px; padding: 4px 2px;">
                                <div style="color: #64748b; font-weight: 700;">Başarı Oranı</div>
                                <div style="font-weight: 800; color: #38bdf8;" id="victory-accuracy">%130</div>
                            </div>
                        </div>
                    </div>`;

const newVictoryBoxEnd = `                            <div style="background: rgba(255,255,255,0.04); border-radius: 7px; padding: 4px 2px;">
                                <div style="color: #64748b; font-weight: 700;">Başarı Oranı</div>
                                <div style="font-weight: 800; color: #38bdf8;" id="victory-accuracy">%130</div>
                            </div>
                        </div>

                        <!-- Weekly League Multiplier Row -->
                        <div id="victory-league-bonus-row" style="margin-top: 6px; padding: 5px 8px; background: linear-gradient(90deg, rgba(245,197,66,0.18), rgba(0,210,255,0.15)); border: 1px solid rgba(245,197,66,0.4); border-radius: 8px; display: flex; justify-content: space-between; align-items: center; font-size: 10px;">
                            <span style="color: #fce7f3; font-weight: 700; display: flex; align-items: center; gap: 4px;">
                                🏆 Olimpos Ligi Bonusu:
                            </span>
                            <span style="font-weight: 800; color: #ffd700; text-shadow: 0 0 8px rgba(245,197,66,0.6);">
                                +<span id="victory-league-bonus-val">0</span> Puan <span style="font-size: 8.5px; color: #a5f3fc; font-weight: 600;">(<span id="victory-league-moves-val">0</span> Hamle × 150)</span>
                            </span>
                        </div>
                    </div>`;

if (html.includes(oldVictoryBoxEnd)) {
    html = html.replace(oldVictoryBoxEnd, newVictoryBoxEnd);
    console.log('✓ 2. Victory Modal League Multiplier Row injected.');
} else {
    console.log('! 2. Victory modal target not matched.');
}

// 3. Leaderboard Modal Prize Pool Card
const oldLbRewardBox = `                    <!-- League Season Reward Banner -->
                    <div id="lb-season-reward-box" style="background: rgba(245, 197, 66, 0.08); border: 1px solid rgba(245, 197, 66, 0.25); border-radius: 10px; padding: 6px 10px; margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between;">
                        <div style="font-size: 10.5px; color: #cbd5e1;">
                            <span style="font-weight: 800; color: var(--gold-light);">🎁 Sezon Ödülü (1-3. Sıra):</span>
                            <span id="lb-season-reward-val" style="color: #38bdf8; font-weight: 700;"> 50 💎 + 1.000 💰</span>
                        </div>
                        <div id="lb-season-name" style="font-size: 9.5px; color: var(--gold-light); font-weight: 700;">Aylık Sezon</div>
                    </div>`;

const newLbRewardBox = `                    <!-- League Season Reward Banner & Haftalık Ödül Havuzu Showcase -->
                    <div id="lb-season-reward-box" style="background: radial-gradient(circle at top, rgba(245, 197, 66, 0.16) 0%, rgba(15, 23, 42, 0.85) 100%); border: 1.5px solid rgba(245, 197, 66, 0.4); border-radius: 12px; padding: 8px 10px; margin-bottom: 8px;">
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                            <div style="font-size: 11px; font-weight: 800; color: #ffd700; display: flex; align-items: center; gap: 4px;">
                                <span>🎁 HAFTALIK TURNUVA ÖDÜL HAVUZU</span>
                            </div>
                            <div id="lb-season-name" style="font-size: 9.5px; color: #38bdf8; font-weight: 700; background: rgba(56, 189, 248, 0.15); padding: 2px 6px; border-radius: 6px;">Aylık Sezon</div>
                        </div>

                        <!-- 3-Tier Official Prize Pool Display -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 5px; text-align: center; font-size: 9px; margin-bottom: 6px;">
                            <div style="background: rgba(255, 215, 0, 0.12); border: 1px solid rgba(255, 215, 0, 0.4); border-radius: 7px; padding: 5px 2px;">
                                <div style="color: #ffd700; font-weight: 900;">🥇 1. SIRA</div>
                                <div style="color: #fff; font-weight: 800; font-size: 8.5px;">250 TL Play Kodu</div>
                                <div style="color: #38bdf8; font-weight: 700; font-size: 8px;">+250 💎 Elmas</div>
                            </div>
                            <div style="background: rgba(192, 192, 192, 0.12); border: 1px solid rgba(192, 192, 192, 0.4); border-radius: 7px; padding: 5px 2px;">
                                <div style="color: #e2e8f0; font-weight: 900;">🥈 2-5. SIRA</div>
                                <div style="color: #fff; font-weight: 800; font-size: 8.5px;">100 TL Play Kodu</div>
                                <div style="color: #38bdf8; font-weight: 700; font-size: 8px;">+100 💎 Elmas</div>
                            </div>
                            <div style="background: rgba(205, 127, 50, 0.12); border: 1px solid rgba(205, 127, 50, 0.4); border-radius: 7px; padding: 5px 2px;">
                                <div style="color: #fbd38d; font-weight: 900;">🥉 6-20. SIRA</div>
                                <div style="color: #38bdf8; font-weight: 800; font-size: 8.5px;">50 💎 Elmas</div>
                                <div style="color: #ffd700; font-weight: 700; font-size: 8px;">+2.500 💰 Altın</div>
                            </div>
                        </div>

                        <!-- Active Season / Tab Current Reward Value Row -->
                        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 5px; font-size: 10px;">
                            <span style="font-weight: 800; color: var(--gold-light);">🎁 Lig Derece Ödülü:</span>
                            <span id="lb-season-reward-val" style="color: #38bdf8; font-weight: 700;"> 50 💎 + 1.000 💰</span>
                        </div>

                        <!-- Policy Disclaimer Footnote -->
                        <div style="font-size: 7.5px; color: #94a3b8; margin-top: 4px; line-height: 1.25; text-align: left; opacity: 0.85;">
                            *Ödüller reklam gelir havuzundan finanse edilir. Gerçek para nakit çekimi (cash-out) veya kumar unsuru içermez; Google Play Hediye Kodu ve oyun içi varlık olarak verilir.
                        </div>
                    </div>`;

if (html.includes(oldLbRewardBox)) {
    html = html.replace(oldLbRewardBox, newLbRewardBox);
    console.log('✓ 3. Leaderboard Modal Prize Pool Card updated.');
} else {
    console.log('! 3. Leaderboard reward box target not matched.');
}

// 4. showVictory score calculation & UI injection
const oldVictoryScore = `            gameState.totalScore += gameScore;
            gameState.weeklyScore = (gameState.weeklyScore || 0) + gameScore;
            gameState.monthlyScore = (gameState.monthlyScore || 0) + gameScore;
            syncScoreToLeaderboard();`;

const newVictoryScore = `            // Weekly Olimpos League Competitive Multiplier (movesLeftAtWin * 150 bonus)
            const leagueMoveMultiplier = 150;
            const leagueBonus = Math.max(0, (movesLeftAtWin || 0)) * leagueMoveMultiplier;

            gameState.totalScore += gameScore;
            gameState.weeklyScore = (gameState.weeklyScore || 0) + gameScore + leagueBonus;
            gameState.monthlyScore = (gameState.monthlyScore || 0) + gameScore;
            syncScoreToLeaderboard();`;

if (html.includes(oldVictoryScore)) {
    html = html.replace(oldVictoryScore, newVictoryScore);
    console.log('✓ 4A. showVictory league bonus calculation applied.');
} else {
    console.log('! 4A. showVictory score sync block not matched.');
}

const oldAccuracyBlock = `            const accuracyEl = document.getElementById('victory-accuracy');
            if (accuracyEl) {
                const ratio = Math.min(100, Math.round((gameScore / gameTarget) * 100));
                accuracyEl.innerText = stars >= 3 ? '%100 (Kusursuz)' : (stars === 2 ? '%100 (Harika)' : '%100 (Başarılı)');
            }`;

const newAccuracyBlock = `            const accuracyEl = document.getElementById('victory-accuracy');
            if (accuracyEl) {
                const ratio = Math.min(100, Math.round((gameScore / gameTarget) * 100));
                accuracyEl.innerText = stars >= 3 ? '%100 (Kusursuz)' : (stars === 2 ? '%100 (Harika)' : '%100 (Başarılı)');
            }

            // Update Olimpos League bonus display
            const leagueBonusValEl = document.getElementById('victory-league-bonus-val');
            const leagueMovesValEl = document.getElementById('victory-league-moves-val');
            if (leagueBonusValEl) leagueBonusValEl.innerText = leagueBonus.toLocaleString();
            if (leagueMovesValEl) leagueMovesValEl.innerText = (movesLeftAtWin || 0);`;

if (html.includes(oldAccuracyBlock)) {
    html = html.replace(oldAccuracyBlock, newAccuracyBlock);
    console.log('✓ 4B. showVictory league UI update applied.');
} else {
    console.log('! 4B. showVictory accuracy block not matched.');
}

fs.writeFileSync(targetPath, html, 'utf8');
console.log('--- Finished updating www/index.html ---');

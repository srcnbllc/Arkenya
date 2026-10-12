const fs = require('fs');

const path = 'www/index.html';
const content = fs.readFileSync(path, 'utf8');
const isCrlf = content.includes('\r\n');
const lines = content.split(/\r?\n/);

// 1. Initial HTML markup for gameplay-hero-ability-dock: set initial display to none
const dockMarkupIdx = lines.findIndex(l => l.includes('id="gameplay-hero-ability-dock"'));
if (dockMarkupIdx !== -1) {
    lines[dockMarkupIdx] = '                    <div id="gameplay-hero-ability-dock" style="display: none; flex-direction: column; align-items: center; justify-content: center; gap: 3px; z-index: 10;">';
    console.log("Updated gameplay-hero-ability-dock initial style to display: none");
}

// 2. In startGameplayCore(): control abilityDock.style.display
const sgStart = lines.findIndex(l => l.includes('const heroKey = (gameState.selectedHero && HEROES[gameState.selectedHero])'));
if (sgStart !== -1) {
    const sgEnd = lines.findIndex((l, i) => i > sgStart && l.includes('updateGameplayPowerups();'));
    if (sgEnd !== -1) {
        const replacementSg = [
            '            const heroKey = (gameState.selectedHero && HEROES[gameState.selectedHero]) ? gameState.selectedHero : \'asterion\';',
            '            const hero = HEROES[heroKey];',
            '            const btnUseAbility = document.getElementById(\'btn-use-ability\');',
            '            const gameGaugeTxt = document.getElementById(\'game-gauge-txt\');',
            '            const abilityDock = document.getElementById(\'gameplay-hero-ability-dock\');',
            '            if (abilityDock) {',
            '                abilityDock.style.display = (lvl < 5) ? \'none\' : \'flex\';',
            '            }',
            '',
            '            if (hero) {',
            '                const avatarEl = document.getElementById(\'game-hero-avatar-mini\');',
            '                const abilityEl = document.getElementById(\'game-ability-name\');',
            '                if (avatarEl) avatarEl.style.backgroundImage = `url(\'${hero.bg}\')`;',
            '                if (abilityEl) abilityEl.innerText = hero.ability;',
            '            }',
            '',
            '            if (lvl < 5) {',
            '                if (btnUseAbility) {',
            '                    btnUseAbility.disabled = true;',
            '                    btnUseAbility.innerText = "🔒 5. BÖLÜMDE AÇILIR";',
            '                }',
            '                if (gameGaugeTxt) {',
            '                    gameGaugeTxt.innerText = "Kilitli (Bölüm 5)";',
            '                }',
            '            } else {',
            '                if (btnUseAbility) {',
            '                    btnUseAbility.disabled = (gameGauge < 100);',
            '                    btnUseAbility.innerText = "YETENEK KULLAN";',
            '                }',
            '                if (gameGaugeTxt) {',
            '                    gameGaugeTxt.innerText = `${Math.floor(gameGauge)}% (Kombo)`;',
            '                }',
            '            }'
        ];
        lines.splice(sgStart, sgEnd - sgStart, ...replacementSg);
        console.log("Updated startGameplayCore() ability dock visibility");
    }
}

// 3. In setupLevel1InteractiveTutorial for Level 5: make sure abilityDock is displayed
const lvl5Idx = lines.findIndex(l => l.includes('// 5. BÖLÜM: KAHRAMAN İLAHİ GÜCÜ & MEZUNİYET'));
if (lvl5Idx !== -1) {
    const dockInsert = '                const abilityDock = document.getElementById(\'gameplay-hero-ability-dock\'); if (abilityDock) abilityDock.style.display = \'flex\';';
    if (!lines[lvl5Idx + 1].includes('gameplay-hero-ability-dock')) {
        lines.splice(lvl5Idx + 1, 0, dockInsert);
        console.log("Ensured abilityDock display: flex on Level 5 setup");
    }
}

// 4. In processMatchesWithExplosion: tiered audiovisual juice & gauge charging from lvl 5
const procStart = lines.findIndex(l => l.includes('const chargePerBlock = 100 / (15 + (lvl * 3.0));'));
if (procStart !== -1) {
    const procEnd = lines.findIndex((l, i) => i > procStart && l.includes('updateGameplayPowerups();'));
    if (procEnd !== -1) {
        const replacementProc = [
            '                const chargePerBlock = 100 / (15 + (lvl * 3.0));',
            '                if (lvl >= 5) {',
            '                    gameGauge = Math.min(100, gameGauge + (finalPopArray.length * chargePerBlock * (1 + (comboMultiplier * 0.2))));',
            '                }',
            '',
            '                if (gameState && gameState.stats) {',
            '                    gameState.stats.totalGemsBroken += finalPopArray.length;',
            '                }',
            '',
            '                // Efekt seviyelendirmesi: İlk 2 seviye sakin öğrenme, 3+ seviyelerde heyecan verici kombolar',
            '                if (lvl >= 3) {',
            '                    triggerHaptic(comboMultiplier >= 3 ? \'heavy\' : \'light\');',
            '                }',
            '',
            '                if (newSpecials.some(s => s.special === \'color_bomb\')) {',
            '                    spawnFloatingCombo("🌈 ZEUS KÜRESİ! 🌈");',
            '                    if (lvl >= 4) {',
            '                        triggerScreenShake();',
            '                        playEpicCallout(\'combo_4\');',
            '                    }',
            '                } else if (newSpecials.some(s => s.special === \'bomb\')) {',
            '                    spawnFloatingCombo("💥 MİTOLOJİK BOMBA! 💥");',
            '                    if (lvl >= 3) {',
            '                        triggerScreenShake();',
            '                    }',
            '                } else if (newSpecials.some(s => s.special && s.special.startsWith(\'line\'))) {',
            '                    spawnFloatingScore("⚡ YILDIRIM KRİSTALİ! ⚡");',
            '                } else if (comboMultiplier === 2) {',
            '                    spawnFloatingScore(`🔥 KOMBO x2! +${earned} Puan`);',
            '                } else if (comboMultiplier === 3) {',
            '                    spawnFloatingCombo(`🔥 EFSANEVİ KOMBO x3!\\n+${earned} Puan`);',
            '                    if (lvl >= 3) {',
            '                        triggerScreenShake();',
            '                        playEpicCallout(\'combo_3\');',
            '                    }',
            '                } else if (comboMultiplier >= 4) {',
            '                    spawnFloatingCombo(`✨ TANRISAL KOMBO x${comboMultiplier}!\\n+${earned} Puan`);',
            '                    if (lvl >= 3) {',
            '                        triggerScreenShake();',
            '                        playEpicCallout(\'combo_4\');',
            '                    }',
            '                }',
            '',
            '                const scoreEl = document.getElementById(\'game-score\');',
            '                if (scoreEl) scoreEl.innerText = gameScore.toLocaleString();',
            '                updateStarProgressBar();',
            '                ',
            '                try {',
            '                    const abilityDock = document.getElementById(\'gameplay-hero-ability-dock\');',
            '                    if (abilityDock) {',
            '                        abilityDock.style.display = (lvl < 5) ? \'none\' : \'flex\';',
            '                    }',
            '                    const btnAbility = document.getElementById(\'btn-use-ability\');',
            '                    const gaugeTxt = document.getElementById(\'game-gauge-txt\');',
            '                    if (lvl < 5) {',
            '                        if (btnAbility) {',
            '                            btnAbility.disabled = true;',
            '                            btnAbility.innerText = "🔒 5. BÖLÜMDE AÇILIR";',
            '                        }',
            '                        if (gaugeTxt) gaugeTxt.innerText = "Kilitli (Bölüm 5)";',
            '                    } else {',
            '                        if (btnAbility) {',
            '                            btnAbility.disabled = gameGauge < 100;',
            '                            btnAbility.innerText = "YETENEK KULLAN";',
            '                        }',
            '                        if (gaugeTxt) gaugeTxt.innerText = `${Math.floor(gameGauge)}% (Kombo)`;',
            '                    }'
        ];
        lines.splice(procStart, procEnd - procStart, ...replacementProc);
        console.log("Updated processMatchesWithExplosion tiered effects and gauge logic");
    }
}

// 5. Update MILESTONE_REWARDS[5] text
const m5Idx = lines.findIndex(l => l.includes('5:  { title: "Çırak Olimpos Sandığı"'));
if (m5Idx !== -1) {
    lines[m5Idx] = '            5:  { title: "Çıraklık Mezuniyeti & Kahraman Gücü", gold: 300, gems: 15, booster: "athena", desc: "+300 Altın, +15 Elmas, 1x Athena Kalkanı ve Kalıcı Kahraman İlahi Gücü Açıldı!" },';
    console.log("Updated MILESTONE_REWARDS[5] text");
}

const newline = isCrlf ? '\r\n' : '\n';
fs.writeFileSync(path, lines.join(newline), 'utf8');
console.log("All tiered progression upgrades successfully applied to www/index.html!");

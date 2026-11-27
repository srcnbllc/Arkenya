const fs = require('fs');

const path = 'www/index.html';
const content = fs.readFileSync(path, 'utf8');
const isCrlf = content.includes('\r\n');
const lines = content.split(/\r?\n/);

// 1. Replace checkAndAwardComboJokerDrop & checkAndAwardComboDiamondDrop
const startFuncIdx = lines.findIndex(l => l.includes('function checkAndAwardComboJokerDrop'));
const endFuncIdx = lines.findIndex(l => l.includes('function animateJokerCardDropToDock'));

if (startFuncIdx === -1 || endFuncIdx === -1) {
    console.error("Function boundary not found!");
    process.exit(1);
}

const replacementFuncLines = [
    '        function checkAndAwardComboJokerDrop(comboMultiplier) {',
    '            // EKONOMİ DENGESİ: Jokerler oyun esnasında rastgele bedava verilmez.',
    '            // Oyuncunun eşya değeri ve mağaza/sandık hedefleri korunur.',
    '            return;',
    '        }',
    '',
    '        // ========================================== ',
    '        // SÜRPRİZ KUTSAL ELMAS SİSTEMİ (COMBO DIAMOND DROP)',
    '        // ========================================== ',
    '        var levelDiamondsDropped = 0;',
    '',
    '        function checkAndAwardComboDiamondDrop(comboMultiplier) {',
    '            // EKONOMİ DENGESİ: Kutsal Elmaslar hamle içi kombolarda anında verilmez.',
    '            // Bölüm zaferi, tapınak sandıkları ve mağaza ile kazanılır.',
    '            return;',
    '        }',
    ''
];

lines.splice(startFuncIdx, endFuncIdx - startFuncIdx, ...replacementFuncLines);

// 2. Replace the immediate gold & drops in processMatchesWithExplosion
const startComboIdx = lines.findIndex(l => l.includes('} else if (comboMultiplier === 2) {'));
const endComboIdx = lines.findIndex(l => l.includes('const scoreEl = document.getElementById(\'game-score\');'));

if (startComboIdx === -1 || endComboIdx === -1) {
    console.error("Combo boundary not found!");
    process.exit(1);
}

const replacementComboLines = [
    '                } else if (comboMultiplier === 2) {',
    '                    spawnFloatingScore(`🔥 KOMBO x2! +${earned} Puan`);',
    '                } else if (comboMultiplier === 3) {',
    '                    spawnFloatingCombo(`🔥 EFSANEVİ KOMBO x3!\\n+${earned} Puan`);',
    '                    triggerScreenShake();',
    '                    playEpicCallout(\'combo_3\');',
    '                } else if (comboMultiplier >= 4) {',
    '                    spawnFloatingCombo(`✨ TANRISAL KOMBO x${comboMultiplier}!\\n+${earned} Puan`);',
    '                    triggerScreenShake();',
    '                    playEpicCallout(\'combo_4\');',
    '                }',
    ''
];

lines.splice(startComboIdx, endComboIdx - startComboIdx, ...replacementComboLines);

const newline = isCrlf ? '\r\n' : '\n';
fs.writeFileSync(path, lines.join(newline), 'utf8');
console.log("Successfully updated www/index.html with rebalanced combo economy!");

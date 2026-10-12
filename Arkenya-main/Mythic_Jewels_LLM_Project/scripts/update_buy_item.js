const fs = require('fs');

let c = fs.readFileSync('www/index.html', 'utf8');

c = c.replace(/energy:\s*"Nektar İksiri \(5 Can\)"/, 'energy: "Nektar İksiri (5 Can)",\n                bundle_trio: "Tanrılar Üçlüsü Paketi"');

const targetRegex = /showToast\("Can tamamen dolduruldu! ⚡", "success"\);\s*\}\s*else\s*\{/s;

const replacementText = `showToast("Can tamamen dolduruldu! ⚡", "success");
            } else if (itemId === 'bundle_trio') {
                if (!gameState.inventory) gameState.inventory = { zeus: 0, athena: 0, hermes: 0, ares: 0, energy: 0 };
                gameState.inventory.zeus = (gameState.inventory.zeus || 0) + 1;
                gameState.inventory.hermes = (gameState.inventory.hermes || 0) + 1;
                gameState.inventory.athena = (gameState.inventory.athena || 0) + 1;
                showToast("Tanrılar Üçlüsü Paketi hesabına eklendi! ⚡🌪️🛡️", "success");
            } else {`;

if (targetRegex.test(c)) {
    c = c.replace(targetRegex, replacementText);
    console.log("Successfully replaced targetRegex in buyItem!");
} else {
    console.log("targetRegex not found in buyItem!");
}

fs.writeFileSync('www/index.html', c, 'utf8');
console.log("Done updating buyItem!");

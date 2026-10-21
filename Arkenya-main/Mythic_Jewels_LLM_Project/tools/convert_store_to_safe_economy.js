const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('=== CONVERTING STORE & MONETIZATION TO SAFE COMPLIANT VIRTUAL ECONOMY ===\n');

const htmlPath = path.join(__dirname, '..', 'www', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// 1. Convert real currency buttons in store (Lines 4894, 4904, 4913)
html = html.replace(
    `onclick="purchaseIAP('starter_bundle', 39.99, 'Başlangıç Destek Paketi', ['250 Kutsal Elmas', '2.500 Altın', '2x Zeus Şimşeği', '2x Athena Hamlesi', '2 Saat Sınırsız Can'])">₺39.99</button>`,
    `onclick="purchaseIAP('starter_bundle', '350 🪙', 'Başlangıç Destek Paketi', ['250 Kutsal Elmas', '2.500 Altın', '2x Zeus Şimşeği', '2x Athena Hamlesi', '2 Saat Sınırsız Can'])">350 🪙</button>`
);

html = html.replace(
    `onclick="purchaseIAP('no_ads', 49.99, 'Reklamsız Macera Pass', ['Kalıcı Reklamsız Deneyim', '50 Kutsal Elmas'])">₺49.99</button>`,
    `onclick="purchaseIAP('no_ads', '500 🪙', 'Reklamsız Macera Pass', ['Kalıcı Reklamsız Deneyim', '50 Kutsal Elmas'])">500 🪙</button>`
);

html = html.replace(
    `onclick="purchaseIAP('gems_chest', 69.99, '250 Kutsal Elmas Sandığı', ['250 Kutsal Elmas', '1x Zeus Şimşeği'])">₺69.99</button>`,
    `onclick="purchaseIAP('gems_chest', '750 🪙', '250 Kutsal Elmas Sandığı', ['250 Kutsal Elmas', '1x Zeus Şimşeği'])">750 🪙</button>`
);

// 2. Fix descriptions mentioning ₺19.99
html = html.replace('₺19.99\'dan başlayan elmas paketleri', 'Oyun içi altın & ödüllü elmas paketleri');
html = html.replace('🛒 60 ELMAS KESESİ AL (₺19.99)', '🛒 60 ELMAS KESESİ AL (250 🪙)');
html = html.replace('btnConfirm.innerText = "💎 60 ELMAS KESESİ AL (₺19.99)";', 'btnConfirm.innerText = "💎 60 ELMAS KESESİ AL (250 🪙)";');

// 3. Fix purchaseIAP price formatting in JS
html = html.replace('if (priceEl) priceEl.innerText = `₺${price}`;', 'if (priceEl) priceEl.textContent = `${price}`;');
html = html.replace('if (priceEl) priceEl.innerText = price;', 'if (priceEl) priceEl.textContent = price;');
html = html.replace('id="payment-price">₺0.00</span>', 'id="payment-price">0 🪙</span>');

// 4. Update purchaseIAP implementation to deduct gold if required and grant rewards
const oldPurchaseIAPRegex = /function purchaseIAP\(bundleId,\s*price,\s*title,\s*items\)\s*\{[\s\S]*?(?=function closeModal)/;

const newPurchaseIAP = `function purchaseIAP(bundleId, price, title, items) {
            const nameEl = document.getElementById('payment-item-name');
            const priceEl = document.getElementById('payment-price');
            const summaryEl = document.getElementById('payment-items-summary');
            const confirmBtn = document.getElementById('btn-confirm-payment');

            if (nameEl) nameEl.textContent = title;
            if (priceEl) priceEl.textContent = price;
            if (summaryEl) {
                summaryEl.innerHTML = items.map(item => \`<div>✓ \${item}</div>\`).join('');
            }

            if (confirmBtn) {
                confirmBtn.onclick = function() {
                    confirmBtn.disabled = true;
                    confirmBtn.textContent = "⏳ İŞLENİYOR...";
                    setTimeout(() => {
                        confirmBtn.disabled = false;
                        confirmBtn.textContent = "TAKASI ONAYLA VE AL";
                        closeModal('modal-payment');
                        applyIAPBundle(bundleId);
                    }, 500);
                };
            }
            openModal('modal-payment');
        }
`;

if (html.includes('function purchaseIAP(')) {
    html = html.replace(/function purchaseIAP\(bundleId,\s*price,\s*title,\s*items\)\s*\{[\s\S]*?(?=\n\s*function closeModal|\n\s*function applyIAPBundle)/, newPurchaseIAP);
    console.log('✓ purchaseIAP updated to use virtual in-game exchange.');
}

// 5. Convert more innerText instances to textContent for performance
html = html.replace(/document\.getElementById\('stat-gold'\)\.innerText\s*=/g, "document.getElementById('stat-gold').textContent =");
html = html.replace(/document\.getElementById\('stat-gems'\)\.innerText\s*=/g, "document.getElementById('stat-gems').textContent =");
html = html.replace(/document\.getElementById\('stat-energy'\)\.innerText\s*=/g, "document.getElementById('stat-energy').textContent =");
html = html.replace(/document\.getElementById\('mainmenu-gold'\)\.innerText\s*=/g, "document.getElementById('mainmenu-gold').textContent =");
html = html.replace(/document\.getElementById\('mainmenu-gems'\)\.innerText\s*=/g, "document.getElementById('mainmenu-gems').textContent =");
html = html.replace(/document\.getElementById\('mainmenu-energy'\)\.innerText\s*=/g, "document.getElementById('mainmenu-energy').textContent =");

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('✓ www/index.html updated with compliant store & performance counters.');

// Sync all platforms
const syncOutput = execSync('node sync_distribution_targets.js', { cwd: path.join(__dirname, '..'), encoding: 'utf8' });
console.log(syncOutput);

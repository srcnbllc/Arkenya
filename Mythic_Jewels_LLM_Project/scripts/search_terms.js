const fs = require('fs');
const html = fs.readFileSync('www/index.html', 'utf8');
const lines = html.split('\n');

console.log('--- RESET / SIFIRLA OCCURRENCES ---');
lines.forEach((l, idx) => {
    if (/reset|sıfırla/i.test(l)) {
        if (l.trim().length < 140) {
            console.log(`L${idx+1}: ${l.trim()}`);
        }
    }
});

console.log('\n--- PANTEON / HAZİNE OCCURRENCES ---');
lines.forEach((l, idx) => {
    if (/pantheon|panteon|modal-treasure|modal-hazine/i.test(l)) {
        if (l.trim().length < 140) {
            console.log(`L${idx+1}: ${l.trim()}`);
        }
    }
});

console.log('\n--- OYUNA BAŞLA / START BTN OCCURRENCES ---');
lines.forEach((l, idx) => {
    if (/oyuna başla|btn-main-play|btn-start|hero-play/i.test(l)) {
        if (l.trim().length < 140) {
            console.log(`L${idx+1}: ${l.trim()}`);
        }
    }
});

console.log('\n--- KRİSTAL LİG / GÖREVLER / HAZİNELER OCCURRENCES ---');
lines.forEach((l, idx) => {
    if (/kristal lig|league-btn|btn-daily|daily-btn|hazineler/i.test(l)) {
        if (l.trim().length < 140) {
            console.log(`L${idx+1}: ${l.trim()}`);
        }
    }
});

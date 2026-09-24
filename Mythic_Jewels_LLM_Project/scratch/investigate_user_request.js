const fs = require('fs');
const html = fs.readFileSync('www/index.html', 'utf8');

console.log('=== 1. TUNCEL KURTIZ MENTIONS ===');
const lines = html.split('\n');
lines.forEach((l, i) => {
    if (/tuncel|kurtiz/i.test(l)) {
        console.log(`Line ${i + 1}: ${l.trim().substring(0, 140)}`);
    }
});

console.log('\n=== 2. OYUNU SIFIRLA BUTTON & FUNCTIONS ===');
lines.forEach((l, i) => {
    if (/sıfırla|resetGame|resetAllData/i.test(l)) {
        console.log(`Line ${i + 1}: ${l.trim().substring(0, 140)}`);
    }
});

console.log('\n=== 3. GLOBAL-BOTTOM-NAV & NAVIGATION ===');
lines.forEach((l, i) => {
    if (/global-bottom-nav/i.test(l)) {
        console.log(`Line ${i + 1}: ${l.trim().substring(0, 140)}`);
    }
});

console.log('\n=== 4. GAUGE & LEVEL 1 SCORE CALCULATION ===');
lines.forEach((l, i) => {
    if (/gameGauge\s*(\+=|=)/i.test(l)) {
        console.log(`Line ${i + 1}: ${l.trim().substring(0, 140)}`);
    }
});

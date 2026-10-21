const fs = require('fs');
const html = fs.readFileSync('www/index.html', 'utf8');
const lines = html.split('\n');

lines.forEach((l, idx) => {
    if (l.includes('Kader') || l.includes('ANLATIMI') || l.includes('EFSANENİN DOĞUŞU') || l.includes('KADİM EFSANE')) {
        console.log(`Line ${idx+1}: ${l.trim().substring(0, 120)}`);
    }
});

const fs = require('fs');
const { JSDOM } = require('jsdom');

const htmlContent = fs.readFileSync('www/index.html', 'utf8');
const dom = new JSDOM(htmlContent);
const { document } = dom.window;

console.log("=== AUDITING ALL BUTTONS FOR UI/UX, POSITIONING & THEME CONSISTENCY ===");

const buttons = Array.from(document.querySelectorAll('button, .btn-action, .modal-close'));

console.log(`Total interactive buttons/elements found: ${buttons.length}`);

const keywords = ['başla', 'oyna', 'devam', 'geri', 'vazgeç', 'iptal', 'kapat', '✕'];

const filtered = buttons.filter(b => {
    const txt = (b.textContent || '').toLowerCase();
    const id = (b.id || '').toLowerCase();
    return keywords.some(k => txt.includes(k) || id.includes(k));
});

console.log(`\nAction & Navigation Buttons found: ${filtered.length}\n`);

filtered.forEach((b, idx) => {
    const text = b.textContent.trim().replace(/\s+/g, ' ');
    const parentModal = b.closest('.modal-overlay') ? b.closest('.modal-overlay').id : 'Screen: ' + (b.closest('.screen') ? b.closest('.screen').id : 'Global');
    const style = b.getAttribute('style') || 'class default';
    const className = b.className || 'no class';
    const onclick = b.getAttribute('onclick') || b.id;

    console.log(`[#${idx+1}] Location: ${parentModal}`);
    console.log(`     Text: "${text}"`);
    console.log(`     Class: ${className}`);
    console.log(`     Style: ${style}`);
    console.log(`     Action: ${onclick}`);
    console.log('---------------------------------------------------------');
});

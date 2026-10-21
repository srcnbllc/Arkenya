const fs = require('fs');

const html = fs.readFileSync('www/index.html', 'utf8');
const styleBlock = html.substring(html.indexOf('<style>'), html.indexOf('</style>'));

const selectorsToCheck = [
  '.grid-container',
  '.cell',
  '.hero-ability-card',
  '.ability-btn-use',
  '.mainmenu-currency-pill',
  '.mainmenu-play-cta',
  '.mainmenu-nav-card'
];

selectorsToCheck.forEach(sel => {
    console.log(`\n=== SELECTOR: ${sel} ===`);
    const re = new RegExp(sel.replace('.', '\\.') + '\\s*\\{([^}]+)\\}', 'g');
    let m;
    let count = 0;
    while ((m = re.exec(styleBlock)) !== null) {
        count++;
        console.log(`Match ${count}:`, m[0].substring(0, 100).replace(/\s+/g, ' '));
    }
});

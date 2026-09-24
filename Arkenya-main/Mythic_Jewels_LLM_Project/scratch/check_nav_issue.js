const fs = require('fs');
const html = fs.readFileSync('www/index.html', 'utf8');

const navIdx = html.indexOf('id="global-bottom-nav"');
console.log('=== global-bottom-nav location ===');
console.log(html.substring(navIdx - 150, navIdx + 200));

const cssStart = html.indexOf('.bottom-nav {');
if (cssStart !== -1) {
    console.log('=== .bottom-nav CSS ===');
    console.log(html.substring(cssStart, cssStart + 600));
}

// Check where showScreen controls globalBottomNav
const ssIdx = html.indexOf('function showScreen(');
console.log('=== showScreen nav toggles ===');
console.log(html.substring(ssIdx, ssIdx + 1200));

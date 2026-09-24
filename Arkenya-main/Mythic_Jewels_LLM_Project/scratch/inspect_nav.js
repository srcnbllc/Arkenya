const fs = require('fs');
const html = fs.readFileSync('www/index.html', 'utf8');

const navStart = html.indexOf('id="global-bottom-nav"');
console.log('=== GLOBAL BOTTOM NAV HTML ===');
console.log(html.substring(navStart - 50, navStart + 1200));

const navUpdateStart = html.indexOf('function updateBottomNav(');
if (navUpdateStart !== -1) {
    console.log('=== UPDATE BOTTOM NAV JS ===');
    console.log(html.substring(navUpdateStart, navUpdateStart + 800));
}

const showScreenStart = html.indexOf('function showScreen(');
if (showScreenStart !== -1) {
    console.log('=== SHOW SCREEN JS ===');
    console.log(html.substring(showScreenStart, showScreenStart + 800));
}

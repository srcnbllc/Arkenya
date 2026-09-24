const fs = require('fs');

const html = fs.readFileSync('www/index.html', 'utf8');

const themeDataIdx = html.indexOf('const THEME_SAGA_DATA');
if (themeDataIdx !== -1) {
    console.log(html.substring(themeDataIdx, themeDataIdx + 2000));
}

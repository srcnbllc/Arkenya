const fs = require('fs');
const { JSDOM } = require('jsdom');
const html = fs.readFileSync('www/index.html', 'utf8');

const dom = new JSDOM(html, { url: 'http://localhost', runScripts: 'dangerously' });
const win = dom.window;
const doc = win.document;

const screens = ['screen-mainmenu', 'screen-worldmap', 'screen-hero', 'screen-store', 'screen-gameplay', 'screen-splash'];

screens.forEach(s => {
    win.showScreen(s);
    const nav = doc.getElementById('global-bottom-nav');
    console.log(`Screen: ${s} -> nav display: ${nav.style.display}`);
});

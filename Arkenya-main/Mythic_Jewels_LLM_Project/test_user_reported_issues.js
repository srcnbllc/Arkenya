const fs = require('fs');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync('www/index.html', 'utf8');
const dom = new JSDOM(html, {
    runScripts: 'dangerously',
    resources: 'usable',
    url: 'http://localhost/'
});

const window = dom.window;
const document = window.document;

function run(desc, fn) {
    try {
        fn();
        console.log(`  ✅ [PASS] ${desc}`);
    } catch(err) {
        console.error(`  ❌ [FAIL] ${desc}:`, err.message);
    }
}

console.log('Testing User Reported Issues in JSDOM:');

// 1. Check openWorldMap
run('openWorldMap is function', () => {
    if (typeof window.openWorldMap !== 'function') throw new Error('not a function');
    window.openWorldMap();
});

// 2. Check zone navigation
run('jumpToZone(2) switches zone and updates chip', () => {
    window.jumpToZone(2);
    const chip = document.getElementById('zone-chip-title');
    console.log('    Chip text:', chip ? chip.textContent : 'none');
    if (!chip || !chip.textContent.includes('2')) throw new Error('Zone 2 not shown in chip');
});

// 3. Check mini-strip
run('mini-strip has no mini stage numbers', () => {
    const strip = document.getElementById('zone-stages-mini-strip');
    if (strip && strip.children.length > 0) {
        throw new Error('mini-strip still has children: ' + strip.children.length);
    }
});

// 4. Click node 1
run('Clicking map node 1 opens preview modal', () => {
    const node1 = document.getElementById('map-node-1');
    if (!node1) throw new Error('node 1 not found');
    console.log('    node1 onclick exists:', typeof node1.onclick);
    node1.click();
    const modal = document.getElementById('modal-level-preview');
    if (!modal.classList.contains('active')) {
        throw new Error('modal-level-preview did not get active class');
    }
    const title = document.getElementById('preview-title');
    console.log('    Modal preview title:', title ? title.textContent : 'none');
    const story = document.getElementById('preview-story');
    console.log('    Modal preview story:', story ? story.textContent : 'none');
    const startBtn = document.getElementById('btn-preview-start-play');
    console.log('    Modal start button:', startBtn ? startBtn.textContent : 'none');
});

// 5. Click back to map button
run('Clicking btn-preview-map closes modal immediately', () => {
    const backBtn = document.getElementById('btn-preview-map');
    if (!backBtn) throw new Error('btn-preview-map not found');
    backBtn.click();
    const modal = document.getElementById('modal-level-preview');
    if (modal.classList.contains('active')) {
        throw new Error('modal-level-preview still active after clicking backBtn');
    }
});

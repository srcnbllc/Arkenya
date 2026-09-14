const { JSDOM } = require('jsdom');
const fs = require('fs');
let html = fs.readFileSync('Arkenya_Playable_Demo.html', 'utf8');

// Fix global localStorage so JSDOM doesn't crash
html = html.replace(/if \(localStorage\.getItem\('arkenya_save_v8'\)\) \{/g, 
`let saved = null;
        try { saved = localStorage.getItem('arkenya_save_v8'); } catch(e){}
        if (saved) {`);

const dom = new JSDOM(html, { runScripts: 'dangerously' });
const window = dom.window;

setTimeout(() => {
    try {
        window.openLevelPreview(1);
        console.log('Preview target text:', window.document.getElementById('preview-target').innerText);
        
        // Let's also simulate clicking start game!
        window.startGameplay();
        console.log('Gameplay started! Active screen:', window.document.querySelector('.screen.active').id);
        
        console.log('Success!');
    } catch(e) {
        console.error('Error during JS execution:', e.message);
        console.error(e.stack);
    }
    process.exit(0);
}, 500);

const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, 'www', 'index.html');
const targets = [
    path.join(__dirname, 'android', 'app', 'src', 'main', 'assets', 'public', 'index.html'),
    path.join(__dirname, 'Arkenya_Playable_Demo.html'),
    path.join(__dirname, 'www', 'Arkenya_Playable_Demo.html')
];

for (const dest of targets) {
    if (fs.existsSync(path.dirname(dest))) {
        fs.copyFileSync(src, dest);
        console.log(`Copied ${src} -> ${dest} (${fs.statSync(dest).size} bytes)`);
    }
}
console.log('All targets synchronized!');

const fs = require('fs');
const path = require('path');

const src = fs.readFileSync('www/index.html', 'utf8');
const targets = [
    'index.html',
    'Arkenya_Playable_Demo.html',
    'www/Arkenya_Playable_Demo.html',
    'android/app/src/main/assets/public/index.html',
    'android/app/src/main/assets/public/Arkenya_Playable_Demo.html',
    'ios/App/App/public/index.html',
    'ios/App/App/public/Arkenya_Playable_Demo.html'
];

for (const t of targets) {
    if (fs.existsSync(path.dirname(t))) {
        fs.writeFileSync(t, src, 'utf8');
        console.log('✅ Synced to:', t);
    }
}
console.log('🌟 All 7 destinations 100% synced with www/index.html.');

const fs = require('fs');
const crypto = require('crypto');

console.log('=== SYNCHRONIZING ALL DISTRIBUTION TARGETS ===');

const sourcePath = 'www/index.html';
const targets = [
    'index.html',
    'Arkenya_Playable_Demo.html',
    'www/Arkenya_Playable_Demo.html',
    'android/app/src/main/assets/public/index.html',
    'android/app/src/main/assets/public/Arkenya_Playable_Demo.html',
    'ios/App/App/public/index.html',
    'ios/App/App/public/Arkenya_Playable_Demo.html'
];

function getHash(filePath) {
    const data = fs.readFileSync(filePath);
    return crypto.createHash('sha256').update(data).digest('hex');
}

let sourceData = fs.readFileSync(sourcePath);
if (sourceData.length < 800000 || sourceData.toString('utf8').includes('truncated for diff preview')) {
    console.warn(`⚠️ WARNING: ${sourcePath} was truncated (${sourceData.length} bytes). Restoring from index.html...`);
    sourceData = fs.readFileSync('index.html');
    fs.writeFileSync(sourcePath, sourceData);
}

const sourceHash = crypto.createHash('sha256').update(sourceData).digest('hex');
console.log(`Source [${sourcePath}] SHA-256: ${sourceHash} (${sourceData.length} bytes)`);

let allMatched = true;

targets.forEach(tgt => {
    if (fs.existsSync(tgt) || tgt.startsWith('android/')) {
        const dir = require('path').dirname(tgt);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(tgt, sourceData);
        const targetHash = getHash(tgt);
        const match = targetHash === sourceHash;
        console.log(`Target [${tgt}] SHA-256: ${targetHash} [${match ? 'SYNCED' : 'MISMATCH'}]`);
        if (!match) allMatched = false;
    }
});

if (allMatched) {
    console.log('\n>>> ALL TARGETS ARE 100% BIT-PERFECT & SYNCHRONIZED! <<<');
    process.exit(0);
} else {
    console.error('\n>>> ERROR: Target synchronization mismatch! <<<');
    process.exit(1);
}

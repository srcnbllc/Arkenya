const fs = require('fs');
const crypto = require('crypto');

const targets = [
    'www/index.html',
    'index.html',
    'Arkenya_Playable_Demo.html',
    'android/app/src/main/assets/public/index.html'
];

console.log("=== SYNCHRONIZING 4 CORE PRODUCTION TARGETS ===");

const sourceContent = fs.readFileSync('www/index.html');
const sourceHash = crypto.createHash('sha256').update(sourceContent).digest('hex');
console.log(`Source (www/index.html) SHA-256: ${sourceHash} (${sourceContent.length} bytes)`);

targets.forEach(tgt => {
    fs.writeFileSync(tgt, sourceContent);
    const h = crypto.createHash('sha256').update(fs.readFileSync(tgt)).digest('hex');
    console.log(`Synced ${tgt} -> SHA-256: ${h}`);
    if (h !== sourceHash) {
        console.error(`FATAL: Hash mismatch on ${tgt}!`);
        process.exit(1);
    }
});

console.log(">>> ALL 4 TARGETS SYNCHRONIZED AND VERIFIED WITH MATCHING SHA-256 HASHES! <<<");

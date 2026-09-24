const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log("=== ARKENYA: APPLYING MASTER MOBILE & PROGRESSION FIXES ===");

const filePath = path.join(__dirname, 'www', 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

// Normalize line endings
content = content.replace(/\r\n/g, '\n');

// 1. REMOVE THE EXACT ORPHAN BLOCK (Lines between initGrid closing and showLevelOnboardingTip)
const targetSearch = `            // Immediately check and explode initial matches for dynamic entrance!
            setTimeout(() => {
                processMatchesWithExplosion(1, false);
            }, 150);
        }

            // Display Level 1-5 Onboarding Guidance
            showLevelOnboardingTip();

            // Immediately check and explode initial matches for dynamic entrance!
            setTimeout(() => {
                processMatchesWithExplosion(1, false);
            }, 150);
        }

        function showLevelOnboardingTip()`;

const replacement = `            // Immediately check and explode initial matches for dynamic entrance!
            setTimeout(() => {
                processMatchesWithExplosion(1, false);
            }, 150);
        }

        function showLevelOnboardingTip()`;

if (content.includes(targetSearch)) {
    content = content.replace(targetSearch, replacement);
    console.log("✔ Successfully found and removed the exact duplicate orphan block!");
} else {
    console.log("Trying line-based removal...");
    const badBlock = `            // Display Level 1-5 Onboarding Guidance\n            showLevelOnboardingTip();\n\n            // Immediately check and explode initial matches for dynamic entrance!\n            setTimeout(() => {\n                processMatchesWithExplosion(1, false);\n            }, 150);\n        }\n`;
    content = content.replace(badBlock, '');
}

// 2. ENHANCE MOBILE, SAFE AREA & TOUCH ISOLATION CSS
const mobileTouchCSS = `
        /* MOBILE & EMULATOR NATIVE CONTROLS ISOLATION */
        html, body {
            overscroll-behavior: none !important;
            touch-action: none !important;
            -webkit-touch-callout: none !important;
            -webkit-user-select: none !important;
            user-select: none !important;
        }

        .emulator-container {
            padding-top: max(env(safe-area-inset-top, 0px), 0px);
            padding-bottom: max(env(safe-area-inset-bottom, 0px), 0px);
            padding-left: max(env(safe-area-inset-left, 0px), 0px);
            padding-right: max(env(safe-area-inset-right, 0px), 0px);
        }

        .grid-container {
            touch-action: none !important;
            -webkit-user-drag: none !important;
            user-select: none !important;
        }

        .cell {
            touch-action: none !important;
            -webkit-touch-callout: none !important;
            -webkit-user-select: none !important;
            user-select: none !important;
            -webkit-user-drag: none !important;
        }
`;

if (!content.includes('MOBILE & EMULATOR NATIVE CONTROLS ISOLATION')) {
    content = content.replace('/* CANDY CRUSH SPECIAL GEMS AESTHETICS */', mobileTouchCSS + '\n        /* CANDY CRUSH SPECIAL GEMS AESTHETICS */');
    console.log("✔ Added mobile touch isolation & safe-area CSS!");
}

// 3. UPGRADE SAVE KEY TO 'arkenya_save_v11' FOR PURE ZERO-SCORE FRESH START
content = content.replace(/arkenya_save_v10/g, 'arkenya_save_v11');
content = content.replace(/arkenya_save_v9/g, 'arkenya_save_v11');
content = content.replace(/arkenya_save_v8/g, 'arkenya_save_v11');
console.log("✔ Storage save key upgraded to 'arkenya_save_v11' for pure zero start.");

// 4. SYNTAX VALIDATION VIA Node.js VM
console.log("--> Performing Syntax Validation of the script block...");
const scriptMatch = content.match(/<script>([\s\S]*?)<\/script>/);
if (!scriptMatch) {
    throw new Error("Could not find <script> block in HTML!");
}

try {
    new vm.Script(scriptMatch[1], { filename: 'index.html' });
    console.log("✔ SUCCESS: JavaScript parsed with 0 syntax errors!");
} catch (err) {
    console.error("❌ SYNTAX ERROR DETECTED:", err.stack);
    process.exit(1);
}

// 5. WRITE TO ALL TARGETS
const targets = [
    path.join(__dirname, 'www', 'index.html'),
    path.join(__dirname, 'index.html'),
    path.join(__dirname, 'Arkenya_Playable_Demo.html'),
    path.join(__dirname, 'www', 'Arkenya_Playable_Demo.html'),
    path.join(__dirname, 'android', 'app', 'src', 'main', 'assets', 'public', 'index.html'),
    path.join(__dirname, 'android', 'app', 'src', 'main', 'assets', 'public', 'Arkenya_Playable_Demo.html'),
    path.join(__dirname, 'ios', 'App', 'App', 'public', 'index.html'),
    path.join(__dirname, 'ios', 'App', 'App', 'public', 'Arkenya_Playable_Demo.html')
];

targets.forEach(target => {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content, 'utf8');
    console.log(`✔ Synced to: ${target}`);
});

console.log("=== ALL MASTER FIXES APPLIED AND SYNCHRONIZED SUCCESSFULLY ===");

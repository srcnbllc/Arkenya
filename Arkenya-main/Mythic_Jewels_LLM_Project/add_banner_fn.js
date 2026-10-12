const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'www', 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

const bannerFn = `
        function showOnboardingBanner(htmlText, durationMs = 0) {
            const oldBanner = document.getElementById('onboarding-tip-banner');
            if (oldBanner) oldBanner.remove();

            const banner = document.createElement('div');
            banner.id = 'onboarding-tip-banner';
            banner.className = 'onboarding-tutorial-banner';
            banner.innerHTML = \`
                <div style="font-size: 12.5px; font-weight: 700; color: #ffe885; line-height: 1.4; text-shadow: 0 2px 4px rgba(0,0,0,0.8);">\${htmlText}</div>
            \`;
            const gameplayScreen = document.getElementById('screen-gameplay');
            if (gameplayScreen) gameplayScreen.appendChild(banner);

            if (durationMs > 0) {
                setTimeout(() => {
                    if (banner && banner.parentNode) {
                        banner.style.transition = 'opacity 0.6s, transform 0.6s';
                        banner.style.opacity = '0';
                        banner.style.transform = 'translate(-50%, -30px)';
                        setTimeout(() => banner.remove(), 600);
                    }
                }, durationMs);
            }
        }
`;

const needle = 'function setupLevel1InteractiveTutorial() {\n            setupLevelTutorial(1);\n        }';
const needleCRLF = 'function setupLevel1InteractiveTutorial() {\r\n            setupLevelTutorial(1);\r\n        }';

if (content.includes(needleCRLF)) {
    content = content.replace(needleCRLF, needleCRLF + '\n' + bannerFn);
    console.log('✅ Added showOnboardingBanner after needleCRLF');
} else if (content.includes(needle)) {
    content = content.replace(needle, needle + '\n' + bannerFn);
    console.log('✅ Added showOnboardingBanner after needle');
} else {
    console.log('❌ Needle not found');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done!');

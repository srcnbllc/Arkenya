const fs = require('fs');

console.log("=== APPLYING CLEAN MAIN MENU OPENING FIX ===");

let html = fs.readFileSync('www/index.html', 'utf8');

// 1. Initial <body> tag should have class="mainmenu-view"
html = html.replace('<body>', '<body class="mainmenu-view">');

// 2. Initial global-hud should have style="display: none;"
html = html.replace('<div class="top-hud" id="global-hud" style="display: flex;">', '<div class="top-hud" id="global-hud" style="display: none;">');

// 3. Initial global-bottom-nav should have style="display: none;"
html = html.replace('<div class="bottom-nav" id="global-bottom-nav">', '<div class="bottom-nav" id="global-bottom-nav" style="display: none;">');

// 4. Update showScreen function so globalHud and globalBottomNav are 'none' on screen-mainmenu, screen-gameplay, screen-splash
const oldShowScreenHudLogic = `const globalHud = document.getElementById('global-hud');
            if (globalHud) {
                globalHud.style.display = (screenId === 'screen-gameplay' || screenId === 'screen-splash') ? 'none' : 'flex';
            }

            const globalBottomNav = document.getElementById('global-bottom-nav');
            if (globalBottomNav) {
                globalBottomNav.style.display = (screenId === 'screen-gameplay' || screenId === 'screen-splash') ? 'none' : 'flex';
            }`;

const newShowScreenHudLogic = `const globalHud = document.getElementById('global-hud');
            if (globalHud) {
                globalHud.style.display = (screenId === 'screen-mainmenu' || screenId === 'screen-gameplay' || screenId === 'screen-splash') ? 'none' : 'flex';
            }

            const globalBottomNav = document.getElementById('global-bottom-nav');
            if (globalBottomNav) {
                globalBottomNav.style.display = (screenId === 'screen-mainmenu' || screenId === 'screen-gameplay' || screenId === 'screen-splash') ? 'none' : 'flex';
            }`;

if (html.includes(oldShowScreenHudLogic)) {
    html = html.replace(oldShowScreenHudLogic, newShowScreenHudLogic);
    console.log("  [SUCCESS] Updated showScreen to hide globalHud & globalBottomNav on screen-mainmenu!");
} else {
    console.warn("  [WARN] exact oldShowScreenHudLogic not found, replacing via regex...");
    html = html.replace(
        /globalHud\.style\.display\s*=\s*\([^)]*\)\s*\?\s*['"]none['"]\s*:\s*['"]flex['"]/g,
        "globalHud.style.display = (screenId === 'screen-mainmenu' || screenId === 'screen-gameplay' || screenId === 'screen-splash') ? 'none' : 'flex'"
    );
    html = html.replace(
        /globalBottomNav\.style\.display\s*=\s*\([^)]*\)\s*\?\s*['"]none['"]\s*:\s*['"]flex['"]/g,
        "globalBottomNav.style.display = (screenId === 'screen-mainmenu' || screenId === 'screen-gameplay' || screenId === 'screen-splash') ? 'none' : 'flex'"
    );
}

// 5. Add strict CSS rules to prevent any HUD or bottom-nav from ever overlapping screen-mainmenu
const strictMainmenuCss = `
        /* STRICT ISOLATION: Ana menüde asla dış HUD veya global alt nav görünemez */
        body.mainmenu-view #global-hud,
        body.mainmenu-view #global-bottom-nav,
        .mainmenu-view #global-hud,
        .mainmenu-view #global-bottom-nav,
        #screen-mainmenu.active ~ #global-hud,
        #screen-mainmenu.active ~ #global-bottom-nav {
            display: none !important;
            opacity: 0 !important;
            pointer-events: none !important;
            visibility: hidden !important;
        }

        /* Diğer ekranlarda (Harita, Kahramanlar, Mağaza) global alt nav tabanda sabit durur */
        .bottom-nav {
            position: fixed !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            z-index: 500 !important;
        }
`;

const styleClosingTag = '</style>';
const lastStyleIdx = html.lastIndexOf(styleClosingTag);
if (lastStyleIdx !== -1) {
    html = html.substring(0, lastStyleIdx) + '\n' + strictMainmenuCss + '\n' + html.substring(lastStyleIdx);
    console.log("  [SUCCESS] Injected strictMainmenuCss into index.html!");
}

// 6. On DOMContentLoaded / script startup, call updateMainMenuUI()
const startupCall = `
        // Initial setup for Main Menu
        document.addEventListener('DOMContentLoaded', function() {
            if (typeof updateMainMenuUI === 'function') updateMainMenuUI();
            if (typeof updateHUD === 'function') updateHUD();
        });
`;

const endScriptIdx = html.lastIndexOf('</script>');
html = html.substring(0, endScriptIdx) + '\n' + startupCall + '\n' + html.substring(endScriptIdx);

fs.writeFileSync('www/index.html', html, 'utf8');
console.log("  [SUCCESS] www/index.html updated successfully!");

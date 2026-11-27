const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'www', 'index.html');
let html = fs.readFileSync(filePath, 'utf8');

console.log('1. Fixing ZONE_DATA levels ranges...');
const zoneDataRegex = /var ZONE_DATA = \{[\s\S]*?\n\s*\};/;
const updatedZoneData = `var ZONE_DATA = {
            1: { id: 1, name: "Kristal Vadi", title: "KRİSTAL VADİ", icon: '<svg class="mythic-inline-svg" viewBox="0 0 24 24"><path d="M3 10L12 4L21 10H3Z" fill="currentColor" fill-opacity="0.25"/><path d="M6 10V18M12 10V18M18 10V18M3 18H21"/></svg>', levels: "1-10", themeColor: "#4ade80", bgUrl: "Assets/Art/main_menu_clean_bg.jpg", desc: "Olimpos'un eteklerindeki kutsal tapınak ve kristal vadiler." },
            2: { id: 2, name: "Fırtına Koyu", title: "FIRTINA KOYU", icon: '<svg class="mythic-inline-svg" viewBox="0 0 24 24"><path d="M12 3V21M6 6V10C6 12.5 8.5 14 12 14C15.5 14 18 12.5 18 10V6"/></svg>', levels: "11-20", themeColor: "#38bdf8", bgUrl: "Assets/Art/zone2_poseidon_bg.jpg", desc: "Azgın dalgalar, Styx nehri ve denizler tanrısı Poseidon'un fırtınaları." },
            3: { id: 3, name: "Yeraltı Dünyası", title: "YERALTI DÜNYASI", icon: '<svg class="mythic-inline-svg" viewBox="0 0 24 24"><path d="M12 2C15.5 6 18 9.5 17 14C16 17.5 14 20 12 20C10 20 8 17.5 7 14C6 9.5 8.5 6 12 2Z" fill="currentColor" fill-opacity="0.28"/></svg>', levels: "21-30", themeColor: "#f87171", bgUrl: "Assets/Art/zone3_hades_bg.jpg", desc: "Tartarus alevleri, Hades'in gölgeleri ve kızgın lav ırmakları." },
            4: { id: 4, name: "Titan Kalesi", title: "TİTAN KALESİ", icon: '<svg class="mythic-inline-svg" viewBox="0 0 24 24"><path d="M12 2L4 5V11C4 16.5 7.5 20.5 12 22C16.5 20.5 20 16.5 20 11V5L12 2Z" fill="currentColor" fill-opacity="0.22"/></svg>', levels: "31-40", themeColor: "#a5f3fc", bgUrl: "Assets/Art/zone2_athena_1789468777787.jpg", desc: "Kadim Titanların buzdan ve taştan sarsılmaz hisarları." },
            5: { id: 5, name: "Olimpos Zirvesi", title: "OLİMPOS ZİRVESİ", icon: '<svg class="mythic-inline-svg" viewBox="0 0 24 24"><path d="M13 2L6 13H12L10 22L19 10H13L13 2Z" fill="currentColor" fill-opacity="0.3"/></svg>', levels: "41-50", themeColor: "#f5c542", bgUrl: "Assets/Art/zone4_olympus_bg.jpg", desc: "Zeus'un şimşekleriyle aydınlanan altın taht ve panteon zirvesi." }
        };`;

if (zoneDataRegex.test(html)) {
    html = html.replace(zoneDataRegex, updatedZoneData);
    console.log('  [+] ZONE_DATA updated with levels 1-10 to 41-50.');
} else {
    console.warn('  [-] ZONE_DATA regex did not match.');
}

console.log('2. Removing duplicate getMapNodeY, scrollWorldMapBy and stale functions...');
// Remove the duplicate first getMapNodeY around line 10721
const dupGetMapNodeY = /\/\/ Compact 10-Stage Corridor Math: All 10 stages of each zone span 486px \(fits cleanly in mobile viewport!\)\s*function getMapNodeY\(levelNum\) \{[\s\S]*?^\s*\}/m;
if (dupGetMapNodeY.test(html)) {
    html = html.replace(dupGetMapNodeY, '');
    console.log('  [+] Removed duplicate 1st getMapNodeY.');
}

// Remove the duplicate first scrollWorldMapBy around line 10741
const dupScroll = /function scrollWorldMapBy\(deltaY\) \{[\s\S]*?^\s*\}/m;
if (dupScroll.test(html)) {
    html = html.replace(dupScroll, '');
    console.log('  [+] Removed duplicate 1st scrollWorldMapBy.');
}

// Remove stale jumpToZone and focusLevelOnMap around line 10861
const staleJumpAndFocus = /function jumpToZone\(zoneNum\) \{[\s\S]*?renderSingleScreenHelenMap\(zoneNum\);\s*\}\s*function focusLevelOnMap\(levelNum, openPreviewModal = false\) \{[\s\S]*?openLevelPreview\(levelNum\);\s*\}\s*\}/m;
if (staleJumpAndFocus.test(html)) {
    html = html.replace(staleJumpAndFocus, '');
    console.log('  [+] Removed stale jumpToZone & focusLevelOnMap.');
}

console.log('3. Updating closeModal debounce shield...');
// Fix closeModal so modal-level-preview is NOT bypassed by the 450ms debounce guard
const oldCloseModal = /if \(!force && modalId !== 'modal-level-preview' && \(Date\.now\(\) - \(window\.lastModalOpenTime \|\| lastModalOpenTime \|\| 0\) < 450\)\) \{/;
if (oldCloseModal.test(html)) {
    html = html.replace(oldCloseModal, "if (!force && (Date.now() - (window.lastModalOpenTime || lastModalOpenTime || 0) < 450)) {");
    console.log('  [+] closeModal debounce shield restored for modal-level-preview.');
} else {
    console.warn('  [-] oldCloseModal pattern not matched (may already be updated).');
}

console.log('4. Bulletproofing stop tap & click routing in openWorldMap...');
// We replace the node & badge binding inside openWorldMap
const oldNodeBinding = /node\.setAttribute\('onclick', `openLevelPreview\(\$\{i\}\)`\);[\s\S]*?node\.onclick = function\(e\) \{[\s\S]*?openLevelPreview\(i\);[\s\S]*?\};/;
const newNodeBinding = `// Bulletproof Instant Touch & Click Handler (0ms Delay on Android WebView & Mobile)
                    const handleStopTap = function(e) {
                        if (e) {
                            if (e.stopPropagation) e.stopPropagation();
                        }
                        const sm = document.getElementById('screen-worldmap');
                        if (sm && sm.__hasRecentlyDragged) {
                            sm.__hasRecentlyDragged = false;
                            return;
                        }
                        openLevelPreview(i);
                    };

                    node.setAttribute('data-level', String(i));
                    node.setAttribute('onclick', 'openLevelPreview(' + i + ')');
                    node.onclick = handleStopTap;
                    node.addEventListener('touchend', handleStopTap, { passive: true });

                    badge.setAttribute('data-level', String(i));
                    badge.setAttribute('onclick', 'openLevelPreview(' + i + ')');
                    badge.onclick = handleStopTap;
                    badge.addEventListener('touchend', handleStopTap, { passive: true });`;

if (oldNodeBinding.test(html)) {
    html = html.replace(oldNodeBinding, newNodeBinding);
    console.log('  [+] Stop node and badge direct click + touchend handlers bound.');
} else {
    console.warn('  [-] oldNodeBinding pattern not matched.');
}

console.log('5. Ensuring Zone Banner text and button never clip...');
const oldBannerHTML = /<div class="zone-trail-jump-btn" title="Tema Bilgisini Aç">📜 Tema Bilgisi<\/div>/g;
html = html.replace(oldBannerHTML, '<div class="zone-trail-jump-btn" title="Tema Bilgisini Aç">📜 Bilgi</div>');

console.log('6. Adding CSS safety rules for zone banner and jump button...');
const cssHook = '#screen-worldmap .zone-trail-banner {';
const newBannerCSS = `#screen-worldmap .zone-trail-banner {
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            overflow: visible !important;`;
if (html.includes(cssHook)) {
    html = html.replace(cssHook, newBannerCSS);
    console.log('  [+] Added banner flex & overflow safety CSS.');
}

fs.writeFileSync(filePath, html, 'utf8');
console.log('Successfully updated www/index.html');

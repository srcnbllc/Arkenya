const fs = require('fs');
let html = fs.readFileSync('Arkenya_Playable_Demo.html', 'utf8');

// 1. Fix worldmap background: remove image and use a nice dark gradient
html = html.replace(/#screen-worldmap\s*\{[\s\S]*?background-image: url\('Assets\/Art\/arkenya_world_map_1788972722664\.png'\);[\s\S]*?\}/, 
`#screen-worldmap {
            background: radial-gradient(circle at top, #0d1326, #050810);
        }`);

// 2. Rewrite swipe logic in initGrid()
// Replace the old pointer events block with a much better touch/mouse drag handler.
const oldPointerEvents = `                    cell.onpointerdown = (e) => {
                        touchStartX = e.clientX;
                        touchStartY = e.clientY;
                        touchStartCell = { r, c, cell };
                    };

                    cell.onpointerup = (e) => {
                        if (!touchStartCell) return;
                        const dx = e.clientX - touchStartX;
                        const dy = e.clientY - touchStartY;
                        const dist = Math.sqrt(dx * dx + dy * dy);

                        if (dist > 18) {
                            let tr = r, tc = c;
                            if (Math.abs(dx) > Math.abs(dy)) {
                                tc += (dx > 0 ? 1 : -1);
                            } else {
                                tr += (dy > 0 ? 1 : -1);
                            }
                            if (tr >= 0 && tr < 8 && tc >= 0 && tc < 8) {
                                executeSwap(r, c, tr, tc);
                            }
                            touchStartCell = null;
                        }
                    };`;

const newSwipeEvents = `
                    // Better Swipe & Drag Mechanics
                    cell.addEventListener('mousedown', handleSwipeStart);
                    cell.addEventListener('touchstart', handleSwipeStart, {passive: false});
                    cell.addEventListener('mouseup', handleSwipeEnd);
                    cell.addEventListener('touchend', handleSwipeEnd);
`;

html = html.replace(oldPointerEvents, newSwipeEvents);

// Also need to inject the handleSwipeStart and handleSwipeEnd functions somewhere globally.
const globalSwipeLogic = `
        let swipeStartX = 0, swipeStartY = 0, swipeStartCell = null;
        
        function handleSwipeStart(e) {
            e.preventDefault(); // Prevent default dragging
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            swipeStartX = clientX;
            swipeStartY = clientY;
            swipeStartCell = { 
                r: parseInt(this.dataset.r), 
                c: parseInt(this.dataset.c), 
                el: this 
            };
            onCellClick(swipeStartCell.r, swipeStartCell.c, swipeStartCell.el); // Also trigger click logic
        }

        function handleSwipeEnd(e) {
            if (!swipeStartCell) return;
            const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
            const clientY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
            const dx = clientX - swipeStartX;
            const dy = clientY - swipeStartY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist > 25) { // Swipe threshold
                let tr = swipeStartCell.r, tc = swipeStartCell.c;
                if (Math.abs(dx) > Math.abs(dy)) {
                    tc += (dx > 0 ? 1 : -1); // Left/Right
                } else {
                    tr += (dy > 0 ? 1 : -1); // Up/Down
                }
                
                if (tr >= 0 && tr < 8 && tc >= 0 && tc < 8) {
                    executeSwap(swipeStartCell.r, swipeStartCell.c, tr, tc);
                }
            }
            swipeStartCell = null;
        }
`;

// Inject global swipe logic before initGrid
if (!html.includes('function handleSwipeStart')) {
    html = html.replace(/function initGrid\(\) \{/, globalSwipeLogic + '\n        function initGrid() {');
}

fs.writeFileSync('Arkenya_Playable_Demo.html', html);
fs.writeFileSync('index.html', html); // Sync to index.html immediately

console.log("Map background cleaned and Swipe logic rewritten.");

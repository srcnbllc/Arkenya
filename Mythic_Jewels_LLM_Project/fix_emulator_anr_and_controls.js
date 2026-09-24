const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

console.log("Fixing Emulator ANR, touch drag responsiveness, zero-point fresh start, and onboarding flow...");

// ---------------------------------------------------------------------------
// 1. REMOVE BLOCKING FIREBASE SCRIPTS TO ELIMINATE ANR (APP NOT RESPONDING)
// ---------------------------------------------------------------------------
html = html.replace(/<script src="https:\/\/www\.gstatic\.com\/firebasejs\/10\.4\.0\/firebase-app-compat\.js"><\/script>\s*/g, '');
html = html.replace(/<script src="https:\/\/www\.gstatic\.com\/firebasejs\/10\.4\.0\/firebase-firestore-compat\.js"><\/script>\s*/g, '');

// Make Firebase init completely safe and non-blocking
const oldFirebaseInit = `        // FIREBASE CONFIGURATION (Lütfen Kendi Bilgilerinizle Değiştirin)
        const firebaseConfig = {
            apiKey: "YOUR_API_KEY",
            authDomain: "arkenya-c7c61.firebaseapp.com",
            projectId: "arkenya-c7c61",
            storageBucket: "arkenya-c7c61.firebasestorage.app",
            messagingSenderId: "YOUR_SENDER_ID",
            appId: "YOUR_APP_ID"
        };
        
        let db;
        try {
            if (typeof firebase !== 'undefined') {
                firebase.initializeApp(firebaseConfig);
                db = firebase.firestore();
                console.log("Firebase Initialized!");
            }
        } catch(e) {
            console.error("Firebase Init Error:", e);
        }`;

const newFirebaseInit = `        // LOCAL / CLOUD HYBRID LEADERBOARD (Non-blocking, zero-lag)
        let db = null;
        try {
            if (typeof firebase !== 'undefined' && firebase.initializeApp) {
                const firebaseConfig = {
                    apiKey: "YOUR_API_KEY",
                    authDomain: "arkenya-c7c61.firebaseapp.com",
                    projectId: "arkenya-c7c61"
                };
                firebase.initializeApp(firebaseConfig);
                db = firebase.firestore();
            }
        } catch(e) {}`;

html = html.replace(oldFirebaseInit, newFirebaseInit);

// ---------------------------------------------------------------------------
// 2. ZERO-POINT FRESH START DEFAULT STATE & RESET OPTION
// ---------------------------------------------------------------------------
const oldDefaultState = `        let defaultState = {
            gold: 1000,
            gems: 50,
            energy: 5,
            maxEnergy: 5,
            lastEnergyUpdate: Date.now(),
            playerLevel: 1,
            totalScore: 0,
            selectedHero: 'asterion',
            viewedHero: 'asterion',
            unlockedLevel: 1,
            completedLevels: {},
            currentPlayingLevel: 1,
            inventory: { zeus: 2, athena: 2, poseidon: 1 },
            stats: { totalGemsBroken: 0, powersUsed: 0, itemsBought: 0 },
            lastLoginDate: null,
            loginStreak: 0
        };`;

const newDefaultState = `        let defaultState = {
            gold: 0,              // Starts at pure 0
            gems: 0,              // Starts at pure 0
            energy: 5,
            maxEnergy: 5,
            lastEnergyUpdate: Date.now(),
            playerLevel: 1,
            totalScore: 0,        // Starts at pure 0
            selectedHero: 'asterion',
            viewedHero: 'asterion',
            unlockedLevel: 1,     // Starts at level 1
            completedLevels: {},
            currentPlayingLevel: 1,
            inventory: { zeus: 1, athena: 1, poseidon: 0 },
            stats: { totalGemsBroken: 0, powersUsed: 0, itemsBought: 0 },
            lastLoginDate: null,
            loginStreak: 0,
            hasSeenPrologue: false
        };

        function resetGameProgress() {
            if (confirm("Tüm oyun puanlarını ve ilerlemeyi sıfırlayıp 1. Bölümden sıfır puanla başlamak istiyor musunuz?")) {
                localStorage.removeItem('arkenya_save_v8');
                gameState = Object.assign({}, defaultState);
                gameState.completedLevels = {};
                gameState.unlockedLevel = 1;
                gameState.currentPlayingLevel = 1;
                gameState.totalScore = 0;
                gameState.gold = 0;
                gameState.gems = 0;
                gameState.hasSeenPrologue = false;
                saveGame();
                updateHUD();
                showToast("Oyun sıfırlandı! Yeni maceraya hoş geldin.", "info");
                showScreen('screen-mainmenu');
                checkFirstTimeOnboarding();
            }
        }`;

html = html.replace(oldDefaultState, newDefaultState);

// ---------------------------------------------------------------------------
// 3. BUTTERY-SMOOTH CANDY CRUSH INSTANT SWIPE & TOUCH DRAG CONTROLS
// ---------------------------------------------------------------------------
const oldSwipeHandling = `        function handleSwipeStart(e) {
            if (e.type === 'touchstart') {
                e.preventDefault();
            }
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            swipeStartX = clientX;
            swipeStartY = clientY;
            swipeStartCell = { 
                r: parseInt(this.dataset.r), 
                c: parseInt(this.dataset.c), 
                el: this 
            };
        }

        function handleSwipeEnd(e) {
            if (!swipeStartCell) return;
            const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
            const clientY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
            const dx = clientX - swipeStartX;
            const dy = clientY - swipeStartY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist > 25) { // Swipe threshold executed
                let tr = swipeStartCell.r, tc = swipeStartCell.c;
                if (Math.abs(dx) > Math.abs(dy)) {
                    tc += (dx > 0 ? 1 : -1); // Left/Right
                } else {
                    tr += (dy > 0 ? 1 : -1); // Up/Down
                }
                
                if (tr >= 0 && tr < 8 && tc >= 0 && tc < 8) {
                    executeSwap(swipeStartCell.r, swipeStartCell.c, tr, tc);
                }
            } else { // Single Tap / Click
                onCellClick(swipeStartCell.r, swipeStartCell.c, swipeStartCell.el);
            }
            swipeStartCell = null;
        }`;

const newSwipeHandling = `        // HIGH-PERFORMANCE TOUCH & SWIPE ENGINE (CANDY CRUSH STYLE)
        let isPointerDragging = false;

        function handleSwipeStart(e) {
            if (isSwapping || isCascading || isLevelEnding || gameMoves <= 0) return;
            if (e.cancelable) e.preventDefault();

            const clientX = (e.touches && e.touches[0]) ? e.touches[0].clientX : e.clientX;
            const clientY = (e.touches && e.touches[0]) ? e.touches[0].clientY : e.clientY;
            swipeStartX = clientX;
            swipeStartY = clientY;
            isPointerDragging = true;

            const r = parseInt(this.dataset.r);
            const c = parseInt(this.dataset.c);
            swipeStartCell = { r, c, el: this };

            // Visual feedback on touch
            this.classList.add('selected');
        }

        function handleTouchMove(e) {
            if (!isPointerDragging || !swipeStartCell || isSwapping || isCascading || isLevelEnding) return;
            if (e.cancelable) e.preventDefault();

            const clientX = (e.touches && e.touches[0]) ? e.touches[0].clientX : e.clientX;
            const clientY = (e.touches && e.touches[0]) ? e.touches[0].clientY : e.clientY;
            const dx = clientX - swipeStartX;
            const dy = clientY - swipeStartY;
            const absX = Math.abs(dx);
            const absY = Math.abs(dy);

            // Instant responsive threshold: 14px glide triggers swap immediately!
            if (absX >= 14 || absY >= 14) {
                isPointerDragging = false;
                let tr = swipeStartCell.r;
                let tc = swipeStartCell.c;

                if (absX > absY) {
                    tc += (dx > 0 ? 1 : -1); // Horizontal swipe
                } else {
                    tr += (dy > 0 ? 1 : -1); // Vertical swipe
                }

                const fromR = swipeStartCell.r;
                const fromC = swipeStartCell.c;
                clearSelectedCell();
                swipeStartCell = null;

                if (tr >= 0 && tr < 8 && tc >= 0 && tc < 8) {
                    executeSwap(fromR, fromC, tr, tc);
                }
            }
        }

        function handleSwipeEnd(e) {
            if (!swipeStartCell) return;
            isPointerDragging = false;

            const clientX = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientX : e.clientX;
            const clientY = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientY : e.clientY;
            const dx = clientX - swipeStartX;
            const dy = clientY - swipeStartY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 10) {
                // Stationary tap -> Tap-to-select & Tap-adjacent-to-swap
                onCellClick(swipeStartCell.r, swipeStartCell.c, swipeStartCell.el);
            } else {
                clearSelectedCell();
            }
            swipeStartCell = null;
        }

        function handleSwipeCancel() {
            isPointerDragging = false;
            clearSelectedCell();
            swipeStartCell = null;
        }`;

html = html.replace(oldSwipeHandling, newSwipeHandling);

// Update initGrid cell listener bindings to include touchmove, pointermove, and pointercancel
const oldInitGridCellEvents = `                    // Touch & Mouse Drag Handlers
                    cell.addEventListener('mousedown', handleSwipeStart);
                    cell.addEventListener('touchstart', handleSwipeStart, {passive: false});
                    cell.addEventListener('mouseup', handleSwipeEnd);
                    cell.addEventListener('touchend', handleSwipeEnd);`;

const newInitGridCellEvents = `                    // Touch & Mouse Drag Handlers with touchmove glide
                    cell.addEventListener('mousedown', handleSwipeStart);
                    cell.addEventListener('touchstart', handleSwipeStart, {passive: false});
                    cell.addEventListener('mousemove', handleTouchMove);
                    cell.addEventListener('touchmove', handleTouchMove, {passive: false});
                    cell.addEventListener('mouseup', handleSwipeEnd);
                    cell.addEventListener('touchend', handleSwipeEnd);
                    cell.addEventListener('touchcancel', handleSwipeCancel);`;

html = html.replace(oldInitGridCellEvents, newInitGridCellEvents);

// Also attach touchmove and touchend to window for guaranteed glide tracking
const windowTouchHook = `
        // Global touchmove & touchend backup so drag never drops outside cells
        window.addEventListener('touchmove', handleTouchMove, {passive: false});
        window.addEventListener('touchend', handleSwipeEnd);
        window.addEventListener('touchcancel', handleSwipeCancel);
        window.addEventListener('mousemove', handleTouchMove);
        window.addEventListener('mouseup', handleSwipeEnd);
`;

if (!html.includes("window.addEventListener('touchmove', handleTouchMove")) {
    html = html.replace("function initGrid() {", windowTouchHook + "\n        function initGrid() {");
}

// ---------------------------------------------------------------------------
// 4. RICH CINEMATIC PROLOGUE & ONBOARDING BEFORE LEVEL 1
// ---------------------------------------------------------------------------
const prologueModalHTML = `
            <!-- MODAL: PROLOGUE ONBOARDING (BÖLÜM 1 ÖNCESİ HİKAYE VE REHBER) -->
            <div class="modal-overlay" id="modal-prologue">
                <div class="modal-card" style="padding: 24px 20px; max-width: 380px; width: 92%; border: 2px solid var(--gold-primary); box-shadow: 0 0 40px rgba(245, 197, 66, 0.4);">
                    <div style="font-size: 52px; margin-bottom: 6px;">⚡</div>
                    <div style="font-size: 20px; font-weight: 900; color: var(--gold-light); text-transform: uppercase; letter-spacing: 1px;">ARKENYA: EFSANENİN BAŞLANGICI</div>
                    <div style="font-size: 11px; color: var(--accent-blue); margin-top: 2px; font-weight: bold;">OLİMPOS'UN KUTSAL MÜCEVHERLERİ</div>
                    
                    <div style="font-size: 13px; color: #ddd; line-height: 1.5; margin: 16px 0; text-align: left; background: rgba(0,0,0,0.5); padding: 12px; border-radius: 10px; border-left: 3px solid var(--gold-primary);">
                        Karanlık güçler kadim Olimpos'un kutsal kristallerini çaldı. Kahraman <b>ASTERION</b> olarak görevin; taşları eşleştirip ilahi güçleri uyandırmak ve zirveye ulaşmak!
                    </div>

                    <div style="display: flex; flex-direction: column; gap: 8px; text-align: left; font-size: 12px; margin-bottom: 18px;">
                        <div style="display: flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.05); padding: 8px 12px; border-radius: 8px;">
                            <span style="font-size: 22px;">👉</span>
                            <div><b>3 Aynı Taşı Kaydır:</b> Taşları parmağınla kaydırarak eşleştir ve patlat.</div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.05); padding: 8px 12px; border-radius: 8px;">
                            <span style="font-size: 22px;">⚡</span>
                            <div><b>4'lü ve 5'li Kombolar:</b> Yıldırım Kristali ve Mitolojik Bomba yarat!</div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.05); padding: 8px 12px; border-radius: 8px;">
                            <span style="font-size: 22px;">🏆</span>
                            <div><b>50 Mitolojik Bölüm:</b> Herkül'den Zeus'a tüm tanrıları dize getir!</div>
                        </div>
                    </div>

                    <button class="btn-action btn-action-green" style="height: 52px; font-size: 16px; font-weight: 800; box-shadow: 0 4px 18px rgba(46, 204, 113, 0.4);" onclick="startFirstTimeAdventure()">⚔️ 1. BÖLÜME BAŞLA (HERKÜL) ➔</button>
                </div>
            </div>
`;

if (!html.includes('id="modal-prologue"')) {
    html = html.replace('<!-- MODAL: ONBOARDING TUTORIAL -->', prologueModalHTML + '\n            <!-- MODAL: ONBOARDING TUTORIAL -->');
}

// Add startFirstTimeAdventure and checkFirstTimeOnboarding logic
const onboardingScripts = `
        function checkFirstTimeOnboarding() {
            if (!gameState.hasSeenPrologue) {
                setTimeout(() => {
                    openModal('modal-prologue');
                }, 600);
            }
        }

        function startFirstTimeAdventure() {
            closeModal('modal-prologue');
            gameState.hasSeenPrologue = true;
            gameState.currentPlayingLevel = 1;
            gameState.unlockedLevel = 1;
            gameState.totalScore = 0;
            saveGame();
            startGameplay();
        }
`;

html = html.replace('function skipSplashAndGoToMenu() {', onboardingScripts + '\n        function skipSplashAndGoToMenu() {');

// Trigger checkFirstTimeOnboarding after splash ends
html = html.replace("showScreen('screen-mainmenu');", "showScreen('screen-mainmenu');\n            checkFirstTimeOnboarding();");

// Add Reset Button to Main Menu and Pause Menu for instant clean restarts
const resetBtnHTML = `<button class="btn-action" style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.2); color: #aaa; font-size: 12px; height: 38px; margin-top: 10px;" onclick="resetGameProgress()">🔄 OYUNU SIFIRLA (YENİ BAŞLANGIÇ)</button>`;
if (!html.includes("onclick=\"resetGameProgress()\"")) {
    html = html.replace('<button class="btn-action" onclick="openWorldMap()">🗺️ DÜNYA HARİTASI</button>', '<button class="btn-action" onclick="openWorldMap()">🗺️ DÜNYA HARİTASI</button>\n                ' + resetBtnHTML);
}

// ---------------------------------------------------------------------------
// 5. WRITE UPGRADED CODE TO ALL TARGET FILES
// ---------------------------------------------------------------------------
fs.writeFileSync('index.html', html);
fs.writeFileSync('www/index.html', html);
fs.writeFileSync('Arkenya_Playable_Demo.html', html);
fs.writeFileSync('www/Arkenya_Playable_Demo.html', html);

console.log("SUCCESS: All ANR fixes, glide swipe touch engine, zero-start state, and prologue onboarding applied!");

const fs = require('fs');
let html = fs.readFileSync('Arkenya_Playable_Demo.html', 'utf8');

// 1. Add Firebase CDN to <head>
const firebaseCDN = `
    <!-- Firebase SDK (Compat Version for simple integration) -->
    <script src="https://www.gstatic.com/firebasejs/10.4.0/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore-compat.js"></script>
`;
if (!html.includes('firebase-app-compat.js')) {
    html = html.replace('</head>', `${firebaseCDN}\n</head>`);
}

// 2. Replace static Leaderboard HTML with dynamic container
const oldLeaderboardHTML = `<div style="width: 100%; font-size: 12px; text-align: left;">
                        <div style="display: flex; justify-content: space-between; padding: 6px; border-bottom: 1px solid #333; font-weight: 700;">
                            <span>Sıra</span> <span>Oyuncu</span> <span>Skor</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 6px; border-bottom: 1px solid #222;">
                            <span>🥇 1</span> <span>Zeus_Master</span> <span style="color: var(--gold-light);">245,000</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 6px; border-bottom: 1px solid #222;">
                            <span>🥈 2</span> <span>Athena_Warrior</span> <span style="color: var(--gold-light);">198,000</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 6px; border-bottom: 1px solid #222;">
                            <span>🥉 3</span> <span>Poseidon_Rider</span> <span style="color: var(--gold-light);">175,400</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 6px; background: rgba(245, 197, 66, 0.15); border-radius: 6px; font-weight: 700;">
                            <span>4</span> <span>ASTERION (Siz)</span> <span style="color: var(--gold-light);" id="lb-player-score">1,000</span>
                        </div>
                    </div>`;
                    
html = html.replace(oldLeaderboardHTML, `<div id="leaderboard-list" style="width: 100%; font-size: 12px; text-align: left;">\n                        <!-- Firebase Data Will Load Here -->\n                    </div>`);


// 3. Inject Firebase JS logic
const firebaseLogic = `
        // FIREBASE CONFIGURATION (Lütfen Kendi Bilgilerinizle Değiştirin)
        const firebaseConfig = {
            apiKey: "YOUR_API_KEY",
            authDomain: "arkenya-c7c61.firebaseapp.com",
            projectId: "arkenya-c7c61",
            storageBucket: "arkenya-c7c61.appspot.com",
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
        }

        async function fetchLeaderboard() {
            const listEl = document.getElementById('leaderboard-list');
            if(!listEl) return;
            
            listEl.innerHTML = '<div style="padding: 10px; text-align:center;">Sunucuya Bağlanıyor...</div>';
            
            try {
                if(!db || firebaseConfig.apiKey === "YOUR_API_KEY") throw new Error("Firebase ayarları eksik.");
                const snapshot = await db.collection('leaderboard').orderBy('score', 'desc').limit(15).get();
                
                let html = \`
                    <div style="display: flex; justify-content: space-between; padding: 6px; border-bottom: 1px solid #333; font-weight: 700;">
                        <span>Sıra</span> <span>Oyuncu</span> <span>Skor</span>
                    </div>
                \`;
                
                let rank = 1;
                snapshot.forEach(doc => {
                    const data = doc.data();
                    let medal = rank === 1 ? '🥇 ' : (rank === 2 ? '🥈 ' : (rank === 3 ? '🥉 ' : ''));
                    let isMe = (gameState && data.playerName === gameState.selectedHero.toUpperCase()) ? 'background: rgba(245, 197, 66, 0.15); border-radius: 6px; font-weight: 700;' : 'border-bottom: 1px solid #222;';
                    html += \`
                        <div style="display: flex; justify-content: space-between; padding: 6px; \${isMe}">
                            <span>\${medal}\${rank}</span> <span>\${data.playerName}</span> <span style="color: var(--gold-light);">\${data.score.toLocaleString()}</span>
                        </div>
                    \`;
                    rank++;
                });
                
                if (snapshot.empty) {
                    html += '<div style="padding: 10px; text-align:center; color:#aaa;">Henüz skor kaydedilmedi.</div>';
                }
                
                listEl.innerHTML = html;
            } catch (e) {
                console.error("Fetch Leaderboard Error:", e);
                listEl.innerHTML = '<div style="padding: 10px; text-align:center; color: var(--accent-red);">Bağlantı Hatası veya Eksik API Anahtarı. (firebaseConfig düzenlenmeli)</div>';
            }
        }

        async function submitScoreToFirebase(score) {
            if(!db || score <= 0 || firebaseConfig.apiKey === "YOUR_API_KEY") return;
            try {
                const playerName = (gameState && gameState.selectedHero) ? gameState.selectedHero.toUpperCase() : "OYUNCU"; 
                const playerRef = db.collection('leaderboard').doc(playerName);
                
                const doc = await playerRef.get();
                if (!doc.exists || doc.data().score < score) {
                    await playerRef.set({
                        playerName: playerName,
                        score: score,
                        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                    console.log("High score saved to Firebase!");
                }
            } catch (e) {
                console.error("Score submit error:", e);
            }
        }
`;

if (!html.includes('const firebaseConfig = {')) {
    html = html.replace('// APP STATE & PERSISTENCE', firebaseLogic + '\n\n        // APP STATE & PERSISTENCE');
}

// 4. Hook fetchLeaderboard() when modal opens
html = html.replace(/document\.getElementById\('modal-leaderboard'\)\.classList\.add\('active'\);/g, 
`document.getElementById('modal-leaderboard').classList.add('active');
            fetchLeaderboard();`);

// 5. Hook submitScoreToFirebase() in showVictory()
html = html.replace(/gameState\.totalScore \+= gameScore;/g, 
`gameState.totalScore += gameScore;
            submitScoreToFirebase(gameState.totalScore);`);

fs.writeFileSync('Arkenya_Playable_Demo.html', html);
fs.writeFileSync('index.html', html);
console.log("Firebase integration applied successfully!");

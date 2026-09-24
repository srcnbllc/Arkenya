const fs = require('fs');

async function testLeaderboardIntegration() {
    console.log('=== TEST: PROFILE & FIREBASE LEADERBOARD INTEGRATION ===');

    const FIREBASE_CONFIG = {
        apiKey: "AIzaSyB273pm4N4rWvqApSkg3wUUHGJtPgwBJcQ",
        projectId: "arkenya-c7c61"
    };
    const FIRESTORE_BASE = `https://firestore.googleapis.com/v1/projects/${FIREBASE_CONFIG.projectId}/databases/(default)/documents`;

    // 1. Profile Data Mock
    const testUserId = 'user_test_' + Date.now();
    const testProfile = {
        userId: testUserId,
        username: 'TestKahramanı',
        avatarHero: 'zeus',
        scoreWeekly: 145000,
        scoreMonthly: 520000,
        scoreAllTime: 1100000,
        level: 18,
        updatedAt: new Date().toISOString()
    };

    console.log('1. Testing Firestore Write for Profile:', testProfile.username, 'Hero:', testProfile.avatarHero);

    const postUrl = `${FIRESTORE_BASE}/leaderboard?documentId=${testProfile.userId}&key=${FIREBASE_CONFIG.apiKey}`;
    const payload = {
        fields: {
            username: { stringValue: testProfile.username },
            avatarHero: { stringValue: testProfile.avatarHero },
            scoreWeekly: { integerValue: String(testProfile.scoreWeekly) },
            scoreMonthly: { integerValue: String(testProfile.scoreMonthly) },
            scoreAllTime: { integerValue: String(testProfile.scoreAllTime) },
            level: { integerValue: String(testProfile.level) },
            updatedAt: { timestampValue: testProfile.updatedAt }
        }
    };

    const postRes = await fetch(postUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    const postData = await postRes.json();

    if (postData.name) {
        console.log('PASS: Profile Document Created in Firestore:', postData.name);
    } else {
        console.error('FAIL: Document creation error:', postData);
        process.exit(1);
    }

    // 2. Testing Query for Weekly, Monthly, and All-Time Tabs
    const tabs = [
        { name: 'haftalik', field: 'scoreWeekly' },
        { name: 'aylik', field: 'scoreMonthly' },
        { name: 'genel', field: 'scoreAllTime' }
    ];

    for (const tab of tabs) {
        console.log(`2. Testing Query for Tab: [${tab.name}] (ordering by ${tab.field})`);
        const qUrl = `${FIRESTORE_BASE}:runQuery?key=${FIREBASE_CONFIG.apiKey}`;
        const qPayload = {
            structuredQuery: {
                from: [{ collectionId: 'leaderboard' }],
                orderBy: [{ field: { fieldPath: tab.field }, direction: 'DESCENDING' }],
                limit: 10
            }
        };

        const qRes = await fetch(qUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(qPayload)
        });
        const qData = await qRes.json();

        if (Array.isArray(qData)) {
            const validDocs = qData.filter(d => d.document && d.document.fields);
            console.log(`PASS: Tab [${tab.name}] returned ${validDocs.length} leaderboard records!`);
            validDocs.slice(0, 3).forEach((d, idx) => {
                const f = d.document.fields;
                console.log(`   Rank #${idx + 1}: ${f.username?.stringValue} (Hero: ${f.avatarHero?.stringValue}) - Score: ${f[tab.field]?.integerValue}`);
            });
        } else {
            console.error(`FAIL: Tab [${tab.name}] query error:`, qData);
            process.exit(1);
        }
    }

    // 3. Testing PATCH (Update Score)
    console.log('3. Testing Score Update (PATCH)');
    const patchUrl = `${FIRESTORE_BASE}/leaderboard/${testUserId}?updateMask.fieldPaths=scoreWeekly&updateMask.fieldPaths=scoreAllTime&key=${FIREBASE_CONFIG.apiKey}`;
    const patchPayload = {
        fields: {
            scoreWeekly: { integerValue: '185000' },
            scoreAllTime: { integerValue: '1250000' }
        }
    };
    const patchRes = await fetch(patchUrl, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patchPayload)
    });
    const patchData = await patchRes.json();
    if (patchData.name) {
        console.log('PASS: Score Updated via PATCH! New Weekly Score:', patchData.fields?.scoreWeekly?.integerValue);
    } else {
        console.error('FAIL: Score update error:', patchData);
        process.exit(1);
    }

    console.log('=== ALL PROFILE & LEADERBOARD INTEGRATION TESTS PASSED! ===');
}

testLeaderboardIntegration().catch(err => {
    console.error('Test threw unexpected error:', err);
    process.exit(1);
});

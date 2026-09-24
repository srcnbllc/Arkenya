const fs = require('fs');
const html = fs.readFileSync('www/index.html', 'utf8');

function findSnippetAround(query, linesBefore = 5, linesAfter = 15) {
    const lines = html.split('\n');
    lines.forEach((l, idx) => {
        if (l.toLowerCase().includes(query.toLowerCase())) {
            console.log(`\n--- Match for "${query}" at line ${idx + 1} ---`);
            const start = Math.max(0, idx - linesBefore);
            const end = Math.min(lines.length - 1, idx + linesAfter);
            for (let i = start; i <= end; i++) {
                console.log(`${i + 1}: ${lines[i]}`);
            }
        }
    });
}

console.log('=== POINTER HANDLING SNIPPETS ===');
findSnippetAround("pointerdown", 2, 20);

console.log('=== CAPACITOR APP LISTENERS ===');
findSnippetAround("App.addListener", 2, 10);

console.log('=== REKLAM / ADS SNIPPETS ===');
findSnippetAround("reklam", 2, 10);

console.log('=== PAUSE MODAL SNIPPETS ===');
findSnippetAround("restartFromPause", 2, 15);

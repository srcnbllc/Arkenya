const fs = require('fs');
const html = fs.readFileSync('www/index.html', 'utf8');

const lines = html.split('\n');
lines.forEach((l, i) => {
    if (l.includes('class="screen') || l.includes("class='screen")) {
        console.log((i+1) + ': ' + l.trim());
    }
});

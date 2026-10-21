const fs = require('fs');
const html = fs.readFileSync('www/index.html', 'utf8');
const lines = html.split('\n');

for (let i = 5320; i <= 5335; i++) {
    console.log(`L${i}: ${JSON.stringify(lines[i-1])}`);
}

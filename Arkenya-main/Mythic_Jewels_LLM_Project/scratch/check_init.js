const fs = require('fs');
const html = fs.readFileSync('www/index.html', 'utf8');

const lastScript = html.lastIndexOf('</script>');
console.log('=== END OF SCRIPT ===');
console.log(html.substring(lastScript - 1500, lastScript));

const fs = require('fs');

const content = fs.readFileSync('www/index.html', 'utf8');
const lines = content.split('\n');

const dupes = [
  'next-lvl-num-btn',
  'modal-payment',
  'payment-item-name',
  'payment-items-summary',
  'payment-price',
  'btn-confirm-payment'
];

dupes.forEach(id => {
  console.log(`\n=== ID: ${id} ===`);
  lines.forEach((line, idx) => {
    if (line.includes(`id="${id}"`) || line.includes(`id='${id}'`)) {
      console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
  });
});

const fs = require('fs');

const files = [
    'www/index.html',
    'index.html',
    'Arkenya_Playable_Demo.html',
    'android/app/src/main/assets/public/index.html'
];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    content = content.replace(
        /if \(icon\) icon\.innerText = '⏹';\s*if \(text\) text\.innerText = 'ANLATIMI DURDUR';/,
        "if (icon) { icon.innerText = '⏹'; icon.textContent = '⏹'; }\n                    if (text) { text.innerText = 'ANLATIMI DURDUR'; text.textContent = 'ANLATIMI DURDUR'; }"
    );

    content = content.replace(
        /if \(icon\) icon\.innerText = '▶';\s*if \(text\) text\.innerText = 'MİSTİK ANLATICIYI DİNLE';/,
        "if (icon) { icon.innerText = '▶'; icon.textContent = '▶'; }\n                    if (text) { text.innerText = 'MİSTİK ANLATICIYI DİNLE'; text.textContent = 'MİSTİK ANLATICIYI DİNLE'; }"
    );

    content = content.replace(
        /if \(proIcon\) proIcon\.innerText = '⏹';\s*if \(proText\) proText\.innerText = 'ANLATIMI DURDUR';/,
        "if (proIcon) { proIcon.innerText = '⏹'; proIcon.textContent = '⏹'; }\n                    if (proText) { proText.innerText = 'ANLATIMI DURDUR'; proText.textContent = 'ANLATIMI DURDUR'; }"
    );

    content = content.replace(
        /if \(proIcon\) proIcon\.innerText = '▶';\s*if \(proText\) proText\.innerText = 'EFSANEYİ DİNLE \(Tuncel Kurtiz\)';/,
        "if (proIcon) { proIcon.innerText = '▶'; proIcon.textContent = '▶'; }\n                    if (proText) { proText.innerText = 'EFSANEYİ DİNLE (Tuncel Kurtiz)'; proText.textContent = 'EFSANEYİ DİNLE (Tuncel Kurtiz)'; }"
    );

    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
});

const fs = require('fs');
const lines = fs.readFileSync('www/index.html', 'utf8').split('\n');

function findLines(pattern) {
    const res = [];
    lines.forEach((l, i) => {
        if (pattern.test(l)) res.push({ line: i + 1, content: l.trim() });
    });
    return res;
}

console.log('modal-victory:', findLines(/id=["']modal-victory["']/));
console.log('modal-final-celebration:', findLines(/id=["']modal-final-celebration["']/));
console.log('showVictory:', findLines(/function showVictory\(/));
console.log('triggerEndLevelCascade:', findLines(/function triggerEndLevelCascade\(/));
console.log('goToNextLevelFromIntermission:', findLines(/function goToNextLevelFromIntermission\(/));
console.log('playNextLevelDirectly:', findLines(/function playNextLevelDirectly\(/));
console.log('nextLevelAndUnlock:', findLines(/function nextLevelAndUnlock\(/));
console.log('getZoneForLevel:', findLines(/function getZoneForLevel\(/));
console.log('updateDynamicZoneBackground:', findLines(/function updateDynamicZoneBackground\(/));

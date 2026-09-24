const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log("=== FIXING DECLARATION ORDER: HOISTING BIOME_LORE ABOVE HEROES AND UPDATEHUD ===");

const filePath = path.join(__dirname, 'www', 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

// Find BIOME_LORE
const loreRegex = /const BIOME_LORE = (\{[\s\S]*?\n\s*\});/;
const match = content.match(loreRegex);
if (!match) {
    throw new Error("Could not find BIOME_LORE in index.html");
}

const loreBlock = `var BIOME_LORE = ${match[1]};`;

// Remove from current position
content = content.replace(loreRegex, '// (BIOME_LORE moved to top of script)');

// Insert right before const HEROES
content = content.replace('const HEROES = {', loreBlock + '\n\n        const HEROES = {');
console.log("✔ Successfully placed BIOME_LORE before const HEROES and updateHUD()");

// Validate syntax
const scriptMatch = content.match(/<script>([\s\S]*?)<\/script>/);
if (!scriptMatch) throw new Error("No script block found!");
new vm.Script(scriptMatch[1], { filename: 'index.html' });
console.log("✔ Syntax validated successfully with 0 errors!");

// Sync to all targets
const targets = [
    path.join(__dirname, 'www', 'index.html'),
    path.join(__dirname, 'index.html'),
    path.join(__dirname, 'Arkenya_Playable_Demo.html'),
    path.join(__dirname, 'www', 'Arkenya_Playable_Demo.html'),
    path.join(__dirname, 'android', 'app', 'src', 'main', 'assets', 'public', 'index.html'),
    path.join(__dirname, 'android', 'app', 'src', 'main', 'assets', 'public', 'Arkenya_Playable_Demo.html'),
    path.join(__dirname, 'ios', 'App', 'App', 'public', 'index.html'),
    path.join(__dirname, 'ios', 'App', 'App', 'public', 'Arkenya_Playable_Demo.html')
];

targets.forEach(target => {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content, 'utf8');
    console.log(`✔ Synced to: ${target}`);
});

console.log("=== ORDER FIXED AND SYNCHRONIZED SUCCESSFULLY ===");

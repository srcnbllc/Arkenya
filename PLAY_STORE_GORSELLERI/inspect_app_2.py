import re

with open(r'c:\Users\sballuca\Desktop\Works\Bogaziciyonetim\Develop\AndroidProjects\Arkenya-main\Arkenya-main\Mythic_Jewels_LLM_Project\index.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

print('=== 1. SCREENS ===')
screens = re.findall(r'<div class="screen"[^>]*id="([^"]+)"', html)
print('Screens found:', screens)

print('\n=== 2. SCREEN-GAMEPLAY TOP HUD ===')
gp_match = re.search(r'(<div class="screen"[^>]*id="screen-gameplay"[\s\S]*?)(<div id="game-grid")', html)
if gp_match:
    print(gp_match.group(1)[:1200])

print('\n=== 3. SAGA MAP & STAGE LIST / ORMAN PARKURU ===')
for term in ['orman', 'parkur', 'etap', 'world-map', 'stage', 'forest', 'wooden']:
    matches = [m.start() for m in re.finditer(term, html, re.IGNORECASE)]
    print(f'Term "{term}": {len(matches)} matches')

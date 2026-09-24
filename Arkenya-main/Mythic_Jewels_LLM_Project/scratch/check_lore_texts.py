import re

with open('www/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Find getThemeSagaForLevel or theme lore definitions
match = re.search(r'function getThemeSagaForLevel[\s\S]*?return\s+sagaMap[\s\S]*?\}', content)
if match:
    print("Found getThemeSagaForLevel:")
    print(match.group(0)[:1500])
else:
    # search for sagaMap
    m2 = re.search(r'(const|let|var)\s+sagaMap[\s\S]*?\};', content)
    if m2:
        print("Found sagaMap:")
        print(m2.group(0)[:1500])
    else:
        print("Not found directly, searching theme lore:")
        m3 = re.findall(r'storyText:\s*["\'].*?["\']', content)
        for s in m3[:10]:
            print(s)

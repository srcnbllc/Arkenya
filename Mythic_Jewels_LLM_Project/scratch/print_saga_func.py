with open('www/index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'getThemeSagaForLevel' in line:
        start = max(0, i - 10)
        end = min(len(lines), i + 90)
        for j in range(start, end):
            print(f"{j+1}: {lines[j]}", end='')
        break

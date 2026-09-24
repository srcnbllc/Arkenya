import sys

with open('www/index.html', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('THEME_SAGA_DATA')
if idx != -1:
    print(text[idx:idx+3500])
else:
    print("THEME_SAGA_DATA not found")

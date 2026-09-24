import os
import re

html_path = 'www/index.html'
with open(html_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update Preview Button text to "DESTANSI HİKAYEYİ DİNLE"
content = content.replace(
    '<span id="preview-story-text">HİKAYEYİ DİNLE</span>',
    '<span id="preview-story-text">DESTANSI HİKAYEYİ DİNLE</span>'
)

# 2. Update JS function resets in stopPreviewStoryAudio and openLevelPreview
content = re.sub(
    r"if \(btnText\) \{ btnText\.textContent = 'HİKAYEYİ DİNLE'; btnText\.innerText = 'HİKAYEYİ DİNLE'; \}",
    "if (btnText) { btnText.textContent = 'DESTANSI HİKAYEYİ DİNLE'; btnText.innerText = 'DESTANSI HİKAYEYİ DİNLE'; }",
    content
)

# 3. Update Settings modal label
content = content.replace(
    '<span style="font-size: 13px; font-weight: 700; color: #cbd5e1;">🎙️ Mistik Anlatıcı</span>',
    '<span style="font-size: 13px; font-weight: 700; color: #cbd5e1;">🎙️ Destansı Hikaye</span>'
)

# 4. Update title/labels where "Mistik Anlatıcı" might be used
content = content.replace('title="Mistik Anlatıcı"', 'title="Destansı Hikaye"')
content = content.replace('Mistik Anlatıcıyı Dinle', 'Destansı Hikayeyi Dinle')

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated www/index.html successfully!")

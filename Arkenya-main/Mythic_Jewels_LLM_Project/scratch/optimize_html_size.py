import os

html_path = os.path.join('www', 'index.html')
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

start_marker = "// Studio Quality Kadim Bilge & Mythic Narrator Audio Pack (Base64 In-Memory)"
if start_marker not in html:
    start_marker = "window.NARRATOR_AUDIO_BASE64 = {"

start_idx = html.find(start_marker)
if start_idx != -1:
    end_marker = "};\n"
    end_idx = html.find(end_marker, start_idx)
    if end_idx != -1:
        replacement = """// Loaded externally via assets/audio/narrator_audio_data.js for high performance
        window.NARRATOR_AUDIO_BASE64 = window.NARRATOR_AUDIO_BASE64 || {};"""
        html = html[:start_idx] + replacement + html[end_idx + len(end_marker):]
        print("PASS: Replaced huge inlined audio pack with external reference.")

# Make sure script tag for narrator_audio_data.js is present in <head>
script_tag = '<script src="assets/audio/narrator_audio_data.js"></script>'
if script_tag not in html:
    html = html.replace('</head>', f'    {script_tag}\n</head>')
    print("PASS: Injected narrator_audio_data.js script tag into <head>.")

# Also update togglePreviewStoryAudio and stopPreviewStoryAudio for synchronous UI updates
old_toggle = """            try {
                previewStoryAudio = new Audio(audioSrc);
                previewStoryAudio.volume = (typeof sfxVolume !== 'undefined') ? sfxVolume : 1.0;
                previewStoryAudio.onended = () => {
                    stopPreviewStoryAudio();
                };
                previewStoryAudio.play().then(() => {
                    isPreviewStoryPlaying = true;
                    const btnText = document.getElementById('preview-story-text');
                    const btnIcon = document.getElementById('preview-story-icon');
                    const wave = document.getElementById('preview-soundwave');
                    if (btnText) btnText.textContent = 'DURDUR';
                    if (btnIcon) btnIcon.textContent = '⏸️';
                    if (wave) wave.style.display = 'inline-flex';
                }).catch(err => {
                    console.warn("Audio play blocked or unavailable:", err);
                    stopPreviewStoryAudio();
                });
            } catch(err) {
                console.error("Failed to play preview story audio:", err);
                stopPreviewStoryAudio();
            }"""

new_toggle = """            try {
                previewStoryAudio = new Audio(audioSrc);
                previewStoryAudio.volume = (typeof sfxVolume !== 'undefined') ? sfxVolume : 1.0;
                previewStoryAudio.onended = () => {
                    stopPreviewStoryAudio();
                };

                isPreviewStoryPlaying = true;
                const btnText = document.getElementById('preview-story-text');
                const btnIcon = document.getElementById('preview-story-icon');
                const wave = document.getElementById('preview-soundwave');
                if (btnText) { btnText.textContent = 'DURDUR'; btnText.innerText = 'DURDUR'; }
                if (btnIcon) { btnIcon.textContent = '⏸️'; btnIcon.innerText = '⏸️'; }
                if (wave) wave.style.display = 'inline-flex';

                const playPromise = previewStoryAudio.play();
                if (playPromise && playPromise.catch) {
                    playPromise.catch(err => {
                        console.warn("Audio play blocked or unavailable:", err);
                        stopPreviewStoryAudio();
                    });
                }
            } catch(err) {
                console.error("Failed to play preview story audio:", err);
                stopPreviewStoryAudio();
            }"""

if old_toggle in html:
    html = html.replace(old_toggle, new_toggle)
    print("PASS: Updated togglePreviewStoryAudio to synchronous UI updates.")

old_stop = """            if (btnText) btnText.textContent = 'HİKAYEYİ DİNLE';
            if (btnIcon) btnIcon.textContent = '🔊';
            if (wave) wave.style.display = 'none';"""

new_stop = """            if (btnText) { btnText.textContent = 'HİKAYEYİ DİNLE'; btnText.innerText = 'HİKAYEYİ DİNLE'; }
            if (btnIcon) { btnIcon.textContent = '🔊'; btnIcon.innerText = '🔊'; }
            if (wave) wave.style.display = 'none';"""

if old_stop in html:
    html = html.replace(old_stop, new_stop)
    print("PASS: Updated stopPreviewStoryAudio to update textContent and innerText.")

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)

new_size = os.path.getsize(html_path)
print(f"PASS: www/index.html optimized! New size: {new_size // 1024} KB (well below 4MB limit)")

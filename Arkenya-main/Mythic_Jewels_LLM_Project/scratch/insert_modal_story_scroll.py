import os

story_modal_html = """            <!-- MODAL: MITOLOJİK HİKAYE VE SESLİ ANLATIM PARŞÖMENİ -->
            <div class="modal-overlay" id="modal-story-scroll">
                <div class="modal-card story-scroll-card">
                    <div class="modal-close" onclick="confirmStoryAndStart()">✕</div>

                    <!-- Header -->
                    <div class="story-scroll-header">
                        <div class="story-scroll-icon" id="story-scroll-icon">📜</div>
                        <div>
                            <div class="story-badge" id="story-scroll-badge">BÖLGE 1 • KRİSTAL VADİ</div>
                            <div class="story-scroll-title" id="story-scroll-title">IŞIĞIN ŞAFAĞI</div>
                        </div>
                    </div>

                    <!-- Scrollable Content Body -->
                    <div class="story-scroll-body">
                        <!-- Mythic Audio Player Bar -->
                        <div class="mythic-audio-bar">
                            <button class="mythic-play-btn" id="btn-narrator-toggle" onclick="toggleStoryVoice()">
                                <span id="narrator-play-icon">▶</span>
                                <span id="narrator-play-text">MİSTİK ANLATICIYI DİNLE</span>
                            </button>
                            <div class="mythic-soundwave" id="narrator-soundwave">
                                <span></span><span></span><span></span><span></span><span></span>
                            </div>
                        </div>

                        <!-- Parchment Story Text -->
                        <div class="story-parchment" id="story-scroll-text">
                            Karanlık güçler Olimpos'un kutsal kristallerini çaldığında gökler karardı...
                        </div>

                        <!-- Compact Roles Strip -->
                        <div class="story-compact-info">
                            <div class="story-info-chip">
                                <span style="color: var(--gold-light); font-weight: 800; font-size: 9.5px;">🛡️ SAVUNUCU</span>
                                <span id="story-scroll-hero" style="color: #fff; font-weight: 700;">Arkenya</span>
                            </div>
                            <div class="story-info-chip">
                                <span style="color: var(--accent-red); font-weight: 800; font-size: 9.5px;">⚔️ DÜŞMAN</span>
                                <span id="story-scroll-villain" style="color: #fff; font-weight: 700;">Hades</span>
                            </div>
                        </div>

                        <!-- Mechanic Pill -->
                        <div class="biome-mechanic-pill">
                            <b id="story-mechanic-title">⚡ Özel Mekanik:</b> <span id="story-mechanic-desc">Saf Eşleştirme</span>
                        </div>
                    </div>

                    <!-- Fixed Footer Action -->
                    <div class="story-scroll-footer">
                        <button class="btn-action btn-action-gold" style="width: 100%; height: 48px; font-size: 15px; font-weight: 900; box-shadow: 0 4px 18px rgba(245, 197, 66, 0.4);" onclick="confirmStoryAndStart()">⚔️ SAVAŞA BAŞLA ➔</button>
                    </div>
                </div>
            </div>
"""

html_path = os.path.join('www', 'index.html')
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

target = '<!-- MODAL: LEVEL PREVIEW & THEME SAGA POPUP -->'
if target in html and 'id="modal-story-scroll"' not in html:
    html = html.replace(target, story_modal_html + "\n            " + target)
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(html)
    print("PASS: Injected modal-story-scroll into www/index.html successfully!")
else:
    print("Already present or target not found")

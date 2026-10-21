const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const htmlPath = path.join(__dirname, '..', 'www', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

const targetStr = `                    <!-- Action Buttons -->
                    <button class="btn-action btn-action-gold" style="height: 48px; font-size: 14.5px; width: 100%; margin-bottom: 8px;" onclick="startGameplay()">⚡ OYUNA BAŞLA (⚡ 1 Can)</button>
                    <button class="btn-action-amber" id="btn-preview-map" style="height: 40px; font-size: 13px; font-weight: 800; border-radius: 12px; width: 100%; display: flex; align-items: center; justify-content: center; background: linear-gradient(180deg, rgba(245,197,66,0.18) 0%, rgba(212,154,29,0.3) 100%); border: 1.5px solid var(--gold-primary); color: var(--gold-light); box-shadow: 0 2px 10px rgba(245,197,66,0.15); letter-spacing: 0.5px;" onclick="closeModal('modal-level-preview')">🗺️ HARİTAYA DÖN</button>`;

const replacementStr = `                    <!-- Player Progress & Replay Record Box -->
                    <div id="preview-record-box" style="display: none; background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.35); border-radius: 12px; padding: 8px 12px; margin-bottom: 12px; text-align: left;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-size: 11px; font-weight: 800; color: #4ade80;">👑 SENİN EN YÜKSEK SKORUN:</span>
                            <span id="preview-record-score" style="font-size: 13px; font-weight: 900; color: #fff;">0</span>
                        </div>
                        <div id="preview-record-stars" style="font-size: 12px; margin-top: 2px;">⭐⭐⭐</div>
                        <div style="font-size: 9.5px; color: #cbd5e1; margin-top: 4px; line-height: 1.3;">
                            💡 <b>Strateji İpucu:</b> Bu bölümü daha az hamleyle bitirirsen kalan her hamlen +500 Ekstra Skor üretir ve toplam skorunu artırır!
                        </div>
                    </div>

                    <!-- Locked Warning Banner (Gelecek Kilitli Seviyeler İçin) -->
                    <div id="preview-locked-banner" style="display: none; background: rgba(239, 68, 68, 0.15); border: 1.5px dashed #ef4444; border-radius: 12px; padding: 12px; margin-bottom: 12px; text-align: center;">
                        <div style="font-size: 26px; margin-bottom: 2px;">🔒</div>
                        <div style="font-size: 13px; font-weight: 900; color: #fca5a5; letter-spacing: 0.5px;">BU DURAK HENÜZ KİLİTLİ!</div>
                        <div id="preview-locked-desc" style="font-size: 11px; color: #cbd5e1; margin-top: 4px;">
                            Bu mitolojik aşamaya geçmek için önce önceki bölümleri zaferle tamamlamalısın.
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <button id="btn-preview-start-play" class="btn-action btn-action-gold" style="height: 48px; font-size: 14.5px; width: 100%; margin-bottom: 8px;" onclick="startGameplay()">⚡ OYUNA BAŞLA (⚡ 1 Can)</button>
                    <button class="btn-action-amber" id="btn-preview-map" style="height: 40px; font-size: 13px; font-weight: 800; border-radius: 12px; width: 100%; display: flex; align-items: center; justify-content: center; background: linear-gradient(180deg, rgba(245,197,66,0.18) 0%, rgba(212,154,29,0.3) 100%); border: 1.5px solid var(--gold-primary); color: var(--gold-light); box-shadow: 0 2px 10px rgba(245,197,66,0.15); letter-spacing: 0.5px;" onclick="closeModal('modal-level-preview')">🗺️ HARİTAYA DÖN</button>`;

if (html.includes(targetStr)) {
    html = html.replace(targetStr, replacementStr);
    fs.writeFileSync(htmlPath, html, 'utf8');
    console.log('✓ Successfully patched modal-level-preview in www/index.html');
    execSync('node sync_distribution_targets.js', { cwd: path.join(__dirname, '..'), stdio: 'inherit' });
} else {
    console.log('! Target string not found');
}

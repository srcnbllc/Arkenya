---
name: arkenya-asset-protection
description: Arkenya Unity projesine özel AI agent skill'i.
---

# ARKENYA-ASSET-PROTECTION

## Görev
Arkenya'nın karakter, kahraman, kıyafet/aksesuar, tile, VFX, animation, material, prefab, scene, UI, audio ve ScriptableObject assetlerini korur. Mevcut asset/prefab aranır; gereksiz yeni sistem veya asset oluşturulmaz; referans kırılmaz.

## Arkenya çalışma kuralları
- Gerçek proje durumunu kontrol etmeden varsayım yapma.
- Görev kapsamı dışındaki dosyalara dokunma.
- Çalışan sistemi gereksiz yere yeniden yazma.
- UNKNOWN bilgi üzerinden kod üretme.
- Kritik hata varsa ilerleme; STOP et.
- Tamamlandı demeden gerçek test/validation sonucu göster.

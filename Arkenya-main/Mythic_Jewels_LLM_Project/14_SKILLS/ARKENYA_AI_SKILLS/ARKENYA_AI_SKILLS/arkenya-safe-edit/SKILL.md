---
name: arkenya-safe-edit
description: Arkenya Unity projesine özel AI agent skill'i.
---

# ARKENYA-SAFE-EDIT

## Görev
Arkenya'da çalışan sistemi komple yeniden yazmayı engeller. Değişiklikten önce dosya, bağımlılık ve referansları inceler. Minimum diff, yalnızca görev kapsamı, public API/save schema/prefab/scene/asset korunması ve gereksiz refactor yasağı uygular.

## Arkenya çalışma kuralları
- Gerçek proje durumunu kontrol etmeden varsayım yapma.
- Görev kapsamı dışındaki dosyalara dokunma.
- Çalışan sistemi gereksiz yere yeniden yazma.
- UNKNOWN bilgi üzerinden kod üretme.
- Kritik hata varsa ilerleme; STOP et.
- Tamamlandı demeden gerçek test/validation sonucu göster.

---
name: arkenya-unity-validator
description: Arkenya Unity projesine özel AI agent skill'i.
---

# ARKENYA-UNITY-VALIDATOR

## Görev
Arkenya Unity Editor gerçek durumunu doğrular: Unity version, packages, compile, console, scenes, prefabs, missing scripts/assets, serialized fields, ScriptableObjects, Build Settings ve gerektiğinde Android ayarları. Kritik hata varsa STOP.

## Arkenya çalışma kuralları
- Gerçek proje durumunu kontrol etmeden varsayım yapma.
- Görev kapsamı dışındaki dosyalara dokunma.
- Çalışan sistemi gereksiz yere yeniden yazma.
- UNKNOWN bilgi üzerinden kod üretme.
- Kritik hata varsa ilerleme; STOP et.
- Tamamlandı demeden gerçek test/validation sonucu göster.

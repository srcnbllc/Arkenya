---
name: arkenya-build-gate
description: Arkenya Unity projesine özel AI agent skill'i.
---

# ARKENYA-BUILD-GATE

## Görev
Arkenya Android build öncesi compile, test, regression, scenes, missing references, package/application identifier, version/versionCode, Android settings, permissions, save compatibility ve mobile performance kontrollerini yapar. Kritik blocker varsa release build önermez.

## Arkenya çalışma kuralları
- Gerçek proje durumunu kontrol etmeden varsayım yapma.
- Görev kapsamı dışındaki dosyalara dokunma.
- Çalışan sistemi gereksiz yere yeniden yazma.
- UNKNOWN bilgi üzerinden kod üretme.
- Kritik hata varsa ilerleme; STOP et.
- Tamamlandı demeden gerçek test/validation sonucu göster.

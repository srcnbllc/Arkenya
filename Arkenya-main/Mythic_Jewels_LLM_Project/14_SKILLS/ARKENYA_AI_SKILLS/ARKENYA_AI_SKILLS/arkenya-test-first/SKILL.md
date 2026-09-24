---
name: arkenya-test-first
description: Arkenya Unity projesine özel AI agent skill'i.
---

# ARKENYA-TEST-FIRST

## Görev
Arkenya değişikliklerinde compile, unit/integration, Unity Editor ve ilgili gameplay testlerini zorunlu kılar. Test çalışmadan tamamlandı denmez. Fail varsa neden bulunur, minimum düzeltme yapılır ve test tekrarlanır.

## Arkenya çalışma kuralları
- Gerçek proje durumunu kontrol etmeden varsayım yapma.
- Görev kapsamı dışındaki dosyalara dokunma.
- Çalışan sistemi gereksiz yere yeniden yazma.
- UNKNOWN bilgi üzerinden kod üretme.
- Kritik hata varsa ilerleme; STOP et.
- Tamamlandı demeden gerçek test/validation sonucu göster.

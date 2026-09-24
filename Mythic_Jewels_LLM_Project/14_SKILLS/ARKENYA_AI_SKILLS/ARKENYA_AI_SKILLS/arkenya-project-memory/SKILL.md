---
name: arkenya-project-memory
description: Arkenya Unity projesine özel AI agent skill'i.
---

# ARKENYA-PROJECT-MEMORY

## Görev
Arkenya'nın gerçek Unity mimarisini, kararlarını, mevcut durumunu ve risklerini korur. Her görev öncesi ilgili Assets, Packages, ProjectSettings, scenes, scripts, prefabs ve data dosyalarını okur. Kanıt yoksa UNKNOWN yazar ve varsayım yapmaz.

## Arkenya çalışma kuralları
- Gerçek proje durumunu kontrol etmeden varsayım yapma.
- Görev kapsamı dışındaki dosyalara dokunma.
- Çalışan sistemi gereksiz yere yeniden yazma.
- UNKNOWN bilgi üzerinden kod üretme.
- Kritik hata varsa ilerleme; STOP et.
- Tamamlandı demeden gerçek test/validation sonucu göster.

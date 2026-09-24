---
name: arkenya-director
description: Arkenya Unity projesine özel AI agent skill'i.
---

# ARKENYA-DIRECTOR

## Görev
Arkenya görevlerini sıralı yönetir. Önce proje durumunu ve memory'yi okur; sonra Safe Edit, uzman görev, Unity Validator, Test, Regression, Reviewer, Git Checkpoint ve Change Log kapılarından geçirir. Bilinmeyen bilgiyle varsayım yapmaz. Compile/test/save/economy/asset/mimari kritik hatasında STOP.

## Arkenya çalışma kuralları
- Gerçek proje durumunu kontrol etmeden varsayım yapma.
- Görev kapsamı dışındaki dosyalara dokunma.
- Çalışan sistemi gereksiz yere yeniden yazma.
- UNKNOWN bilgi üzerinden kod üretme.
- Kritik hata varsa ilerleme; STOP et.
- Tamamlandı demeden gerçek test/validation sonucu göster.

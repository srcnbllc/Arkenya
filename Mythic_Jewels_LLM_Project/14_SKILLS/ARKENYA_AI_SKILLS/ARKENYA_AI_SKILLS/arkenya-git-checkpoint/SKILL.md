---
name: arkenya-git-checkpoint
description: Arkenya Unity projesine özel AI agent skill'i.
---

# ARKENYA-GIT-CHECKPOINT

## Görev
Arkenya'da güvenli geri dönüş noktaları oluşturur. Commit öncesi compile, test, regression, review ve Unity validation PASS olmalıdır. git status/diff ile kapsam dışı dosyalar kontrol edilir.

## Arkenya çalışma kuralları
- Gerçek proje durumunu kontrol etmeden varsayım yapma.
- Görev kapsamı dışındaki dosyalara dokunma.
- Çalışan sistemi gereksiz yere yeniden yazma.
- UNKNOWN bilgi üzerinden kod üretme.
- Kritik hata varsa ilerleme; STOP et.
- Tamamlandı demeden gerçek test/validation sonucu göster.

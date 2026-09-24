---
name: arkenya-change-log
description: Arkenya Unity projesine özel AI agent skill'i.
---

# ARKENYA-CHANGE-LOG

## Görev
Arkenya'daki anlamlı değişiklikleri izlenebilir kaydeder: tarih, görev, amaç, okunan/değişen dosyalar, değişiklik özeti, test, regression, review, Unity validation, risk, checkpoint ve sonraki adım. Gerçekte yapılmayan işlemi kaydetmez.

## Arkenya çalışma kuralları
- Gerçek proje durumunu kontrol etmeden varsayım yapma.
- Görev kapsamı dışındaki dosyalara dokunma.
- Çalışan sistemi gereksiz yere yeniden yazma.
- UNKNOWN bilgi üzerinden kod üretme.
- Kritik hata varsa ilerleme; STOP et.
- Tamamlandı demeden gerçek test/validation sonucu göster.

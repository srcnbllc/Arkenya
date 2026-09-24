# BUILD ORDER

## Faz 0 — Repository & kararlar
Çıktı: Unity repository, Git, klasör standardı, CI, coding rules.

## Faz 1 — Core shell
Çıktı: boot, loading, main menu, scene management, localization, save/load.

## Faz 2 — Match-3 çekirdeği
Çıktı: board generation, swap, match detection, cascade, refill, moves, score.

## Faz 3 — Special pieces
Çıktı: 4-match, 5-match, L/T, combo interactions, VFX hooks.

## Faz 4 — Level objectives
Çıktı: target system, win/lose state, level configuration.

## Faz 5 — Map & progression
Çıktı: world map, level nodes, stars, unlock gates.

## Faz 6 — Heroes
Çıktı: hero profiles, XP, levels, abilities, selection.

## Faz 7 — Bosses
Çıktı: boss HP, attacks, telegraphing, defeat flow.

## Faz 8 — Rewards
Çıktı: gold, gems, energy, XP, chests, boosters, daily rewards.

## Faz 9 — Economy
Çıktı: balances, sinks/sources, shop, pricing config, anti-exploit validation.

## Faz 10 — Animation & VFX
Çıktı: board feedback, hero animations, boss animations, reward reveals.

## Faz 11 — UX/UI polish
Çıktı: responsive UI, accessibility, tutorial, feedback, localization.

## Faz 12 — Monetization
Çıktı: rewarded ads + IAP for virtual goods only, purchase restore, entitlement validation.

## Faz 13 — Live content
Çıktı: daily missions, events framework, remote config-safe content.

## Faz 14 — QA
Çıktı: automated tests, device matrix, performance, save corruption, economy tests.

## Faz 15 — Store readiness
Çıktı: privacy, age rating, screenshots, metadata, compliance checklist.

## Faz 16 — Release
Çıktı: Android internal test, iOS TestFlight, staged production release.

## Kural
Her faz için `EXIT_CRITERIA.md` doldurulmadan bir sonraki faz başlatılamaz.

# LLM DEVELOPMENT PROTOCOL

## Amaç
LLM coding agents'ın projeyi kontrollü şekilde geliştirmesi.

## Context loading
Agent her görevde:
1. Chief Prompt
2. Build Order
3. İlgili system spec
4. Mevcut kod
5. İlgili tests
6. Son changelog

okur.

## Agent modes
ARCHITECT → DESIGNER → CODER → TESTER → REVIEWER → DOCS

Aynı agent rolü içinde bile test sonucu görülmeden “done” denmez.

## Handoff format
TASK_ID
CURRENT_PHASE
OBJECTIVE
FILES_READ
FILES_CHANGED
TESTS_RUN
TEST_RESULTS
KNOWN_ISSUES
NEXT_TASK

## Regression rule
Bir yeni özellik mevcut testleri bozarsa önce regression düzeltilir.

## Asset agent
Prompt → concept → variation → approval → import → optimization → in-game validation.

## Content agent
Level spec üretir; gameplay agent uygulamadan önce schema validation yapar.

## Review agent
- compile errors
- null references
- save migration
- economy exploit
- localization
- performance
- platform API
- policy risk

kontrol eder.

## Stop conditions
- Compile failure
- Critical test failure
- Save corruption
- Economy duplication
- Missing required asset
- Store policy risk
- Unresolved architectural conflict

Bu durumda agent durur ve `DECISION_NEEDED.md` günceller.

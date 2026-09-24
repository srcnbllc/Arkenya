# QA PROTOCOL

## Unit tests
- Match detection
- Swap validity
- Cascade
- Score
- Reward calculation
- Chest probability
- Currency transaction
- Save migration
- Hero ability

## Integration
- Complete level
- Fail level
- Retry
- Reward
- Upgrade
- Unlock
- Boss
- IAP entitlement
- Restore purchase

## Device tests
Android low/mid/high tier.
iPhone low/mid/high tier.

## Performance
Target 60 FPS where practical on supported devices; graceful degradation on lower devices.
Memory and battery profiling before release.

## Economy tests
- Currency cannot become NaN/negative unexpectedly.
- Duplicate reward prevention.
- Purchase replay prevention.
- Chest result deterministic under seeded test.

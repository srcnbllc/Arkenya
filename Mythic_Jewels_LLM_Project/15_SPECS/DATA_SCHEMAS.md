# DATA SCHEMAS

## LevelData
levelId, worldId, chapterId, difficulty, seed, moves, objectives[], blockers[], rewardTableId, starThresholds[]

## HeroData
heroId, displayNameKey, descriptionKey, rarity, baseStats, abilityId, unlockRule, upgradeCurve

## BossData
bossId, displayNameKey, maxHp, attackPatternId, phases[], rewardTableId

## RewardTable
rewardTableId, entries[], weights, guaranteedItems[]

## Mission
missionId, type, target, rewardTableId, resetPeriod

## ShopOffer
offerId, virtualItems[], price, currencyType, availabilityRule

All schemas must be versioned when breaking changes occur.

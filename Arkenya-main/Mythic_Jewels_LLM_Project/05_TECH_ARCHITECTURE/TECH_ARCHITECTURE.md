# TECH ARCHITECTURE

## Recommended stack
- Unity LTS
- C#
- Git
- Unity Test Framework
- Addressables
- Localization package
- Input System
- Analytics abstraction
- IAP abstraction
- Optional backend for cloud save/remote config

## Layers
1. Presentation
2. Gameplay
3. Domain
4. Economy
5. Persistence
6. Infrastructure
7. Configuration
8. Analytics

## Core assemblies
MythicJewels.Core
MythicJewels.Gameplay
MythicJewels.UI
MythicJewels.Economy
MythicJewels.Content
MythicJewels.Persistence
MythicJewels.Platform
MythicJewels.Tests

## Data-driven design
LevelData, HeroData, BossData, RewardTable, BoosterData, ShopOfferData, MissionData ScriptableObjects or equivalent serialized configuration.

## Save
Versioned schema:
profileVersion
playerXP
currencies
energy
heroes
levels
inventory
missions
settings

Migration functions required for schema changes.

## Security
Client-side economy is not trusted if backend exists. Purchase entitlements must be verified. Never store secrets in client.

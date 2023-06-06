import { CombatTarget } from './CombatTarget';
import { IAttackProperties } from './IAttackProperties';

export interface DamageObserver {
  attackResult(
    hero: CombatTarget,
    target: CombatTarget,
    properties: IAttackProperties
  ): void;
  characterDied(hero: CombatTarget, killer: CombatTarget): void;
}

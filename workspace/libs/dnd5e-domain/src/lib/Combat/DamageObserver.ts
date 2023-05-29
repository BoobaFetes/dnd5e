import { WeaponRange } from '../dto';
import { CombatTarget } from './CombatTarget';

export interface DamageObserver {
  attackResult(
    hero: CombatTarget,
    target: CombatTarget,
    success: boolean,
    attackType: WeaponRange | 'SPELL',
    damage: number,
    isCriticalHit: boolean,
    isCriticalMiss: boolean
  ): void;
  characterDied(hero: CombatTarget, killer: CombatTarget): void;
}

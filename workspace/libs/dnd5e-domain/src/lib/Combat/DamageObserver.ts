import { WeaponRange } from '../dto';
import { CombatTarget } from './CombatTarget';

export interface DamageObserver {
  attackResult(
    success: boolean,
    attackType: WeaponRange | 'SPELL',
    damage: number,
    isCriticalHit: boolean,
    isCriticalMiss: boolean
  ): void;
  characterDied(target: CombatTarget): void;
}

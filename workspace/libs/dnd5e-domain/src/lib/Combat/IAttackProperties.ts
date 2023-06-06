import { WeaponRange } from '../dto';

export interface IAttackProperties {
  attackRoll: number;
  weapons: string[];
  useFinesse: boolean;
  attackResult: boolean;
  attackType: WeaponRange | 'SPELL';
  attackModifiers: number;
  useTwoHands: boolean;
  damage: number;
  isCriticalHit: boolean;
  isCriticalMiss: boolean;
}

export function makeAttackProperties(
  obj?: Partial<IAttackProperties>
): IAttackProperties {
  return {
    attackType: WeaponRange.Melee,
    attackResult: false,
    attackRoll: 0,
    attackModifiers: 0,
    useTwoHands: false,
    damage: 0,
    isCriticalHit: false,
    isCriticalMiss: false,
    weapons: [],
    useFinesse: false,
    ...obj,
  };
}

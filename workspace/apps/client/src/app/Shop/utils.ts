import {
  Armor,
  ICharacter,
  Weapon,
  WeaponRange,
} from '@boobafetes/dnd5e-domain';
import { useMemo } from 'react';

export function useUtils(hero: ICharacter) {
  const is = useMemo(
    () => ({
      ranged: (weapon: Weapon) => weapon.weapon_range === WeaponRange.Ranged,
      melee: (weapon: Weapon) => weapon.weapon_range === WeaponRange.Melee,
      ownedWeapon: (weapon: Weapon) =>
        weapon.properties.some((p) => p.index !== 'two-handed'),
      twoHand: (weapon: Weapon) =>
        weapon.properties.some((p) => p.index === 'two-handed'),
      oneHandAndTwoHand: (weapon: Weapon) =>
        weapon.properties.some((p) => p.index === 'versatile'),
    }),
    []
  );
  const has = useMemo(
    () => ({
      melee: hero.equipement.melees.some((w) => is.melee(w)),
      ranged: hero.equipement.melees.some((w) => is.ranged(w)),
      twoHand: hero.equipement.melees.some((w) =>
        w.properties.some((p) => p.index === 'two-handed')
      ),
      oneHandCount: hero.equipement.melees.filter(
        (w) => !w.properties.some((p) => p.index === 'two-handed')
      ).length,
      shield: hero.equipement.armors.some((a) => a.index === 'shield'),
      armor: hero.equipement.armors.some((a) => a.index !== 'shield'),
      thatArmor: (armor: Armor) =>
        hero.equipement.armors.some((a) => a.index === armor.index),
      thatWeapon: (weapon: Weapon) =>
        hero.equipement.ranged?.index === weapon.index ||
        hero.equipement.melees.some((w) => w.index === weapon.index),
    }),
    [hero.equipement, is]
  );
  return { is, has };
}

import { ICharacter } from './Character';
import { Armor, Weapon, WeaponRange } from './dto';

export type EquipementIsUtils = {
  ranged(weapon: Weapon): boolean;
  melee(weapon: Weapon): boolean;
  ownedWeapon(weapon: Weapon): boolean;
  twoHand(weapon: Weapon): boolean;
  oneHandAndTwoHand(weapon: Weapon): boolean;
};
export type EquipementHasUtils = {
  melee: boolean;
  ranged: boolean;
  twoHand: boolean;
  twoHandRanged: boolean;
  oneHandUsedHasTwoHands: boolean;
  oneHandCount: number;
  shield: boolean;
  armor: boolean;
  thatArmor(armor: Armor): boolean;
  thatWeapon(weapon: Weapon): boolean;
};

export type EquipementUtilsType = {
  is: EquipementIsUtils;
  has(hero: ICharacter): EquipementHasUtils;
};
export const EquipementUtils: EquipementUtilsType = {
  is: {
    ranged(weapon: Weapon) {
      return weapon.weapon_range === WeaponRange.Ranged;
    },
    melee(weapon: Weapon) {
      return weapon.weapon_range === WeaponRange.Melee;
    },
    ownedWeapon(weapon: Weapon) {
      return weapon.properties.some((p) => p.index !== 'two-handed');
    },
    twoHand(weapon: Weapon) {
      return weapon.properties.some((p) => p.index === 'two-handed');
    },
    oneHandAndTwoHand(weapon: Weapon) {
      return weapon.properties.some((p) => p.index === 'versatile');
    },
  },
  has(hero: ICharacter): EquipementHasUtils {
    const shield = hero.equipement.armors.some((a) => a.index === 'shield');
    return {
      melee: hero.equipement.melees.some((w) => this.is.melee(w)),
      ranged: hero.equipement.melees.some((w) => this.is.ranged(w)),
      twoHand: hero.equipement.melees.some((w) =>
        w.properties.some((p) => p.index === 'two-handed')
      ),
      twoHandRanged:
        hero.equipement.ranged?.properties.some(
          (p) => p.index === 'two-handed'
        ) ?? false,
      oneHandUsedHasTwoHands:
        !shield &&
        hero.equipement.melees?.[0] &&
        this.is.oneHandAndTwoHand(hero.equipement.melees[0]),
      oneHandCount: hero.equipement.melees.filter(
        (w) => !w.properties.some((p) => p.index === 'two-handed')
      ).length,
      shield,
      armor: hero.equipement.armors.some((a) => a.index !== 'shield'),
      thatArmor(armor: Armor) {
        return hero.equipement.armors.some((a) => a.index === armor.index);
      },
      thatWeapon(weapon: Weapon) {
        return (
          hero.equipement.ranged?.index === weapon.index ||
          hero.equipement.melees.some((w) => w.index === weapon.index)
        );
      },
    };
  },
};

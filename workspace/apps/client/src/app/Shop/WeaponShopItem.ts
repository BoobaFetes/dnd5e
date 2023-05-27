import { ICharacter, Weapon, WeaponRange } from '@boobafetes/dnd5e-domain';
import lodash from 'lodash';

export class WeaponShopItem {
  public hero: ICharacter;

  constructor(hero) {
    this.hero = lodash.cloneDeep(hero);
  }

  public sell(equipement?: Weapon): boolean {
    if (!equipement) {
      return false;
    }

    let returns = false;
    let weaponIndex: number;
    switch (equipement.weapon_range) {
      case WeaponRange.Ranged:
        this.hero.gold += this.hero.equipement.ranged?.cost.quantity;
        this.hero.equipement.ranged = undefined;
        break;
      default:
        weaponIndex = this.hero.equipement.melees.findIndex(
          (a) => a.index === equipement.index
        );

        if (weaponIndex < 0) {
          break;
        }

        this.hero.gold +=
          this.hero.equipement.melees[weaponIndex].cost.quantity;
        this.hero.equipement.melees.splice(weaponIndex, 1);

        returns = true;
        break;
    }

    return returns;
  }

  public buy(equipement: Weapon): boolean {
    let weapon: Weapon;
    switch (equipement.weapon_range) {
      case WeaponRange.Ranged:
        if (
          this.hero.equipement.ranged &&
          this.hero.equipement.ranged?.index === equipement.index
        ) {
          weapon = this.hero.equipement.ranged;
        }
        break;
      default:
        weapon = this.hero.equipement.melees.find(
          (a) => a.index === equipement.index
        );
        break;
    }

    const gold =
      this.hero.gold - equipement.cost.quantity + (weapon?.cost.quantity ?? 0);
    if (gold < 0) {
      return false;
    }

    this.sell(weapon);
    this.hero.gold -= equipement.cost.quantity;
    switch (equipement.weapon_range) {
      case WeaponRange.Ranged:
        this.hero.equipement.ranged = equipement;
        break;
      default:
        this.hero.equipement.melees.push(equipement);
        break;
    }

    return true;
  }
}

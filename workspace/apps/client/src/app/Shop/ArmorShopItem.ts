import { Armor, ICharacter } from '@boobafetes/dnd5e-domain';
import lodash from 'lodash';

export class ArmorShopItem {
  public hero: ICharacter;

  constructor(hero) {
    this.hero = lodash.cloneDeep(hero);
  }

  public sell(equipement?: Armor): boolean {
    if (!equipement) {
      return false;
    }

    const armorIndex = this.hero.equipement.armors.findIndex(
      (a) => a.index === equipement.index
    );

    if (armorIndex < 0) {
      return false;
    }

    this.hero.gold += this.hero.equipement.armors[armorIndex].cost.quantity;
    this.hero.equipement.armors.splice(armorIndex, 1);

    return true;
  }

  public buy(equipement: Armor): boolean {
    let armor: Armor;
    if (equipement.index === 'shield') {
      armor = this.hero.equipement.armors.find(
        (a) => a.index === equipement.index
      );
    } else {
      armor = this.hero.equipement.armors.filter(
        (a) => a.index !== 'shield'
      )[0];
    }

    const gold =
      this.hero.gold - equipement.cost.quantity + (armor?.cost.quantity ?? 0);
    if (gold < 0) {
      return false;
    }

    this.sell(armor);
    this.hero.gold -= equipement.cost.quantity;
    this.hero.equipement.armors.push(equipement);
    return true;
  }
}

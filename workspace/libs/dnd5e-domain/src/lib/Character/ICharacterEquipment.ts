import { Armor, Weapon } from '../dto';

export interface ICharacterEquipment {
  armors: Armor[];
  melees: Weapon[];
  ranged?: Weapon;
}

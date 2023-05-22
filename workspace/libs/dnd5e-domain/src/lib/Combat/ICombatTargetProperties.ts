import { ICharacterAbilities, ICharacterEquipment } from '../Character';
import { Class } from '../dto';

export interface ICombatTargetProperties {
  isPlayer: boolean;
  name: string;
  hitPoints: number;
  equipement: ICharacterEquipment;
  armorClass: number;
  classObj: Pick<Class, 'index' | 'name' | 'spellcasting'>;
  abilities: ICharacterAbilities;
}

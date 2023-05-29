import { ICharacter } from '../Character';

export interface ICombatTargetProperties {
  isPlayer: boolean;
  character: ICharacter;
  armorClass: number;
}

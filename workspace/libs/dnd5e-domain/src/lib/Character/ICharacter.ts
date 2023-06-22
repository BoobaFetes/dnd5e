import { Class } from '../dto';
import { ICharacterAbilities } from './ICharacterAbilities';
import { ICharacterEquipment } from './ICharacterEquipment';

export interface ICharacter {
  selected: boolean;
  index: string;
  image: string;
  name: string;
  health: number;
  xp: number;
  gold: number;
  class: Class;
  abilities: ICharacterAbilities;
  equipement: ICharacterEquipment;
}

export function makeCharacter(obj?: Partial<ICharacter>): ICharacter {
  return {
    selected: false,
    index: '',
    image: '',
    name: '',
    xp: 0,
    gold: 0,
    health: 0,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    class: { index: '', name: '' } as any,
    equipement: {
      armors: [],
      melees: [],
      ranged: undefined,
    },
    ...obj,
    abilities: {
      str: { index: 'str', name: 'Strength', value: 0, modifier: -1 },
      dex: { index: 'dex', name: 'Dexterity', value: 0, modifier: -1 },
      con: { index: 'con', name: 'Constitution', value: 0, modifier: -1 },
      wis: { index: 'wis', name: 'Wisdom', value: 0, modifier: -1 },
      int: { index: 'int', name: 'Intelligence', value: 0, modifier: -1 },
      cha: { index: 'cha', name: 'Charisma', value: 0, modifier: -1 },
      ...obj?.abilities,
    },
  };
}

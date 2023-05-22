import { Class, Race } from '../dto';
import { ICharacterAbilities } from './ICharacterAbilities';
import { ICharacterEquipment } from './ICharacterEquipment';

export interface ICharacter {
  selected: boolean;
  index: string;
  image: string;
  name: string;
  xp: number;
  gold: number;
  race: Pick<Race, 'index' | 'name'>;
  class: Pick<Class, 'index' | 'name'>;
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
    race: { index: '', name: '' },
    class: { index: '', name: '' },
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

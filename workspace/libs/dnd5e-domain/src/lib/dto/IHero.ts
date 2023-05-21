export interface IHero {
  id: string;
  img: string;
  name: string;
  race: string;
  class: string;
  selected: boolean;
  abilities: {
    wis: number;
    str: number;
    dex: number;
    con: number;
    int: number;
    cha: number;
  };
}

export function makeHero(obj?: Partial<IHero>): IHero {
  return {
    id: '',
    img: '',
    race: '',
    class: '',
    name: '',
    selected: false,
    ...obj,
    abilities: {
      cha: 8,
      con: 8,
      dex: 8,
      int: 8,
      str: 8,
      wis: 8,
      ...obj?.abilities,
    },
  };
}

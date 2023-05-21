import { v4 as uuidv4 } from 'uuid';

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

export class HeroRepository {
  private key = 'my-heroes';
  private window: Window;
  private storage: Storage;
  public onChange?: (heroes: IHero[]) => void;

  constructor(_window: Window = window) {
    this.window = _window;
    this.storage = _window.localStorage;
    this.list = JSON.parse(this.storage.getItem(this.key) || '[]');
    this.onChange?.(this.list);
    // utile ? this.window.addEventListener('storage', this.subscribeToStoreEvent);
  }

  // utile ? public destroy() {
  // utile ?   this.window.removeEventListener('storage', this.subscribeToStoreEvent);
  // utile ? }

  // utile ? private subscribeToStoreEvent() {
  // utile ?
  // utile ? }

  private list: IHero[];

  private save(heroes: IHero[]) {
    this.storage.setItem(this.key, JSON.stringify(heroes));
    this.list = heroes;
    this.onChange?.(this.list);
  }

  public all() {
    return this.list;
  }

  public get(id: string): IHero | undefined {
    return this.list.find((h) => h.id === id);
  }

  public add(hero: Partial<IHero>): boolean {
    if (this.get(hero.id)) {
      return false;
    }

    this.save([...this.list, makeHero({ ...hero, id: uuidv4() })]);
    return true;
  }

  public update(hero: IHero): boolean {
    const index = this.list.findIndex((h) => h.id === hero.id);
    if (index < 0) {
      return false;
    }

    this.save(this.list.map((old, lindex) => (lindex === index ? hero : old)));
    return true;
  }

  public remove(id: string): boolean {
    const index = this.list.findIndex((h) => h.id === id);
    if (index < 0) {
      return false;
    }

    this.save(this.list.filter((old, lindex) => lindex !== index));
    return true;
  }

  public select(id: string) {
    const list = this.list.map((h) => ({ ...h, selected: h.id === id }));
    this.save(list);
  }

  public selected() {
    return this.list.find((h) => h.selected);
  }

  public reset() {
    this.save([]);
  }
}

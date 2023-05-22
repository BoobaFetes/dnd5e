import { ICharacter, makeCharacter } from '@boobafetes/dnd5e-domain';
import { v4 as uuidv4 } from 'uuid';

type Observer = (
  heroes: ReadonlyArray<ICharacter>,
  repository?: HeroRepository
) => void;

export class HeroRepository {
  private key = 'my-heroes';
  private storage: Storage;
  private observers: Observer[] = [];

  constructor(stage: Storage) {
    this.storage = stage;
    this.list = JSON.parse(this.storage.getItem(this.key) || '[]');
  }

  public subscribe(observer: Observer) {
    this.observers.push(observer);

    const unsubscriber = () => {
      const index = this.observers.findIndex((obs) => obs === observer);
      if (index >= 0) {
        this.observers.splice(index, 1);
      }
    };

    return unsubscriber;
  }

  private list: ICharacter[];

  private save(heroes: ICharacter[]) {
    this.storage.setItem(this.key, JSON.stringify(heroes));
    this.list = heroes;
    this.observers.forEach((obs) => obs(this.list, this));
  }

  public all() {
    return this.list;
  }

  public get(index: string): ICharacter | undefined {
    return this.list.find((h) => h.index === index);
  }

  public add(hero: Partial<ICharacter>): boolean {
    if (this.get(hero.index)) {
      return false;
    }

    this.save([...this.list, makeCharacter({ ...hero, index: uuidv4() })]);
    return true;
  }

  public update(hero: ICharacter): boolean {
    const index = this.list.findIndex((h) => h.index === hero.index);
    if (index < 0) {
      return false;
    }

    this.save(this.list.map((old, lindex) => (lindex === index ? hero : old)));
    return true;
  }

  public remove(index: string): boolean {
    const _index = this.list.findIndex((h) => h.index === index);
    if (_index < 0) {
      return false;
    }

    this.save(this.list.filter((old, lindex) => lindex !== _index));
    return true;
  }

  public select(index: string) {
    const list = this.list.map((h) => ({ ...h, selected: h.index === index }));
    this.save(list);
  }

  public reset() {
    this.save([]);
  }
}

import { IHero, makeHero } from '@boobafetes/dnd5e-domain';
import { v4 as uuidv4 } from 'uuid';

type Observer = (
  heroes: ReadonlyArray<IHero>,
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

  private list: IHero[];

  private save(heroes: IHero[]) {
    this.storage.setItem(this.key, JSON.stringify(heroes));
    this.list = heroes;
    this.observers.forEach((obs) => obs(this.list, this));
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

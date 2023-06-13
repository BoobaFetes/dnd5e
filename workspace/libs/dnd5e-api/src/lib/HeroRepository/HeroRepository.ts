import { ICharacter, makeCharacter } from '@boobafetes/dnd5e-domain';
import { v4 as uuidv4 } from 'uuid';
import { HeroRepositoryClass } from '.';

type Observer = (
  heroes: ReadonlyArray<ICharacter>,
  repository?: HeroRepositoryClass
) => void;

export class HeroRepository {
  private key = 'my-heroes';
  private storage: Storage;
  private observers: Observer[] = [];

  constructor(stage: Storage = window.localStorage) {
    this.storage = stage;
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

  private get list(): ICharacter[] {
    const _list: ICharacter[] = JSON.parse(
      this.storage.getItem(this.key) || '[]'
    );
    return _list;
  }

  private save(heroes: ICharacter[]) {
    this.storage.setItem(this.key, JSON.stringify(heroes));
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

    this.save(
      this.list.map((old, lindex) =>
        lindex === index ? { ...old, ...hero } : old
      )
    );
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

  public reset() {
    this.save([]);
  }
}

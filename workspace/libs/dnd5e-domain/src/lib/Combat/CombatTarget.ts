import { cloneDeep } from 'lodash';
import {
  ICharacter,
  ICharacterAbilities,
  ICharacterAbility,
} from '../Character';
import { Dice } from '../Dice';
import { Damage, Maybe, WeaponRange } from '../dto';
import { DamageObserver } from './DamageObserver';
import { IAttackProperties, makeAttackProperties } from './IAttackProperties';
import { ICombatTargetProperties } from './ICombatTargetProperties';

export class CombatTarget implements ICombatTargetProperties {
  attackObservers: DamageObserver[];
  allies: CombatTarget[];
  // implements ICombatTargetProperties
  isPlayer: boolean;
  character: ICharacter;
  armorClass: number;

  constructor({
    isPlayer,
    character,
  }: Omit<ICombatTargetProperties, 'armorClass'>) {
    this.isPlayer = isPlayer;
    this.character = character;
    this.armorClass = this.character.equipement.armors.reduce(
      (result, armor) => {
        result += armor.armor_class.base;
        if (
          armor.armor_class.dex_bonus &&
          this.character.abilities.dex.modifier > 0
        ) {
          result += this.character.abilities.dex.modifier;
        }
        return result;
      },
      0
    );
    this.allies = [];
    this.attackObservers = [];
  }

  static convertFromCharacter(character: ICharacter): CombatTarget {
    // Convertit un objet de type IHero en instance de Character
    return new CombatTarget({
      isPlayer: true,
      character: cloneDeep(character),
    });
  }

  // static convertFromMonster(monster: IMonster): CombatTarget {
  //   // Convertit un objet de type IMonster en instance de Character
  //   const character = undefined as any; // new CombatTarget(/* initialisez les propriétés communes */);
  //   // Copiez les propriétés spécifiques du monstre dans l'instance de Character
  //   // Utilisez les valeurs de monster pour initialiser les propriétés de character
  //   return character;
  // }

  public attack(
    target: CombatTarget,
    attackType: WeaponRange | 'SPELL'
  ): boolean {
    const attackRoll = this.rollAttack();
    const properties: IAttackProperties = makeAttackProperties({
      attackType,
      attackRoll,
      isCriticalHit: attackRoll === 20,
      isCriticalMiss: attackRoll === 1,
    });
    const modifiers = this.getAttackModifiers(properties);
    properties.attackResult =
      attackRoll === 1 ? false : attackRoll + modifiers >= target.armorClass;

    if (properties.attackResult) {
      const damage = this.calculateDamage(properties);
      target.takeDamage(damage);

      // Notify observers
      this.notifyAttackObservers(target, properties);

      console.log(`${this.character.name} a réussi son attaque !`);
    } else {
      // Notify observers
      this.notifyAttackObservers(target, properties);

      console.log(`${this.character.name} a raté son attaque.`);
    }

    if (target.character.health <= 0) {
      console.log(`${target.character.name} est mort !`);

      // Notify observers
      target.notifyDeathObservers(this);
    }
    return properties.attackResult;
  }

  public takeDamage(damage: number): void {
    this.character.health -= damage;
  }

  public attachAttackObserver(observer: DamageObserver): () => void {
    this.attackObservers.push(observer);
    return () => this.detachAttackObserver(observer);
  }

  public detachAttackObserver(observer: DamageObserver): void {
    const index = this.attackObservers.indexOf(observer);
    if (index !== -1) {
      this.attackObservers.splice(index, 1);
    }
  }

  public detachAllAttackObservers(): void {
    this.attackObservers = [];
  }

  private notifyAttackObservers(
    target: CombatTarget,
    properties: IAttackProperties
  ): void {
    for (const observer of this.attackObservers) {
      observer.attackResult(this, target, properties);
    }
  }

  private notifyDeathObservers(killer: CombatTarget): void {
    for (const observer of this.attackObservers) {
      observer.characterDied(this, killer);
    }
  }

  private rollAttack(): number {
    // Simulate rolling a d20
    return this.rollDice(20);
  }

  private rollDice(count: number) {
    return Math.floor(Math.random() * count) + 1;
  }

  private getAttackModifiers(properties: IAttackProperties): number {
    // Apply appropriate attack modifiers based on the equipment type
    let modifiers = 0;
    if (properties.attackType === WeaponRange.Melee) {
      const { dex, str } = this.character.abilities;
      const hasFinesse = () =>
        this.character.equipement.melees[0]?.properties.findIndex(
          (i) => i.index === 'finesse'
        ) >= 0;

      properties.useFinesse = dex.value >= str.value && hasFinesse();
      if (properties.useFinesse) {
        modifiers += this.dexterityModifier();
      } else {
        modifiers += this.strengthModifier();
      }
      // Apply any other melee attack modifiers
    } else if (properties.attackType === WeaponRange.Ranged) {
      modifiers += this.dexterityModifier();
      // Apply any other ranged attack modifiers
    } else if (properties.attackType === 'SPELL') {
      modifiers += this.spellcastingModifier();
      // Apply any other spell attack modifiers
    }
    properties.attackModifiers = modifiers;
    return modifiers;
  }

  private strengthModifier(): number {
    // Retourne le modificateur de caractéristique (Force) du personnage
    // Calcul du modificateur en fonction de la valeur de Force du personnage et son modificateur de maitrise en fonction de son niveau
    // ajoute le modificateur de maitrise

    return this.character.abilities.str.value;
  }

  private dexterityModifier(): number {
    // Retourne le modificateur de caractéristique (Dextérité) du personnage
    // Calcul du modificateur en fonction de la valeur de Dextérité du personnage et son modificateur de maitrise en fonction de son niveau
    return this.character.abilities.dex.value;
  }

  private spellcastingModifier(): number {
    // Retourne le modificateur de caractéristique (Dextérité) du personnage
    // Calcul du modificateur en fonction de la valeur de Dextérité du personnage et son modificateur de maitrise en fonction de son niveau

    const abilityIndex = this.character.class.spellcasting?.spellcasting_ability
      .index as keyof ICharacterAbilities | undefined;
    if (!abilityIndex) {
      return 0;
    }

    const ability: ICharacterAbility = this.character.abilities[abilityIndex];
    return ability.modifier;
  }

  private calculateDamage(properties: IAttackProperties): number {
    // Calculate the damage based on the equipment type and other factors
    const calculate = (weaponDamage: Maybe<Damage> | undefined) => {
      if (!weaponDamage) {
        // ARO : la seule modification de ma part
        // (mise à part réordonnancement et import de code depuisles prompts !)
        return new Dice('1d3').roll();
      }
      const [diceCount, diceFacesCount] = weaponDamage.damage_dice
        .split('d')
        .map((i) => Number(i));

      let result = 0;
      for (let i = 0; i < diceCount; i++) {
        result += this.rollDice(diceFacesCount);
      }

      return result;
    };

    let damage = 0;
    const { melees, ranged } = this.character.equipement;

    if (properties.attackType === WeaponRange.Melee) {
      // Calculate melee damage
      // calculer les dégats des armes de mêlée sans oublier que certaine arme peuvent être prise à 1 et 2 mains
      const doubleHandWeapon = melees.find((w) => !!w.two_handed_damage);
      if (doubleHandWeapon) {
        properties.useTwoHands = true;
        damage = calculate(doubleHandWeapon.two_handed_damage);
      } else {
        melees.forEach((weapon) => {
          damage += calculate(weapon.damage);
        });
      }
    } else if (properties.attackType === WeaponRange.Ranged) {
      // Calculate ranged damage

      damage = calculate(ranged?.damage);
    } else if (properties.attackType === 'SPELL') {
      // Calculate spell damage
      throw "comment on calcul les sorts ? on dirait qu'il y a un type Spell.SpellDamage assez spécifique...";
    }

    properties.damage = damage;
    return damage;
  }

  isAlly(target: CombatTarget): boolean {
    return this.allies.includes(target);
  }
}

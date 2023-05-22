import {
  ICharacter,
  ICharacterAbilities,
  ICharacterAbility,
} from '../Character';
import { ICharacterEquipment } from '../Character/ICharacterEquipment';
import { Class, Damage, Maybe, Spell, WeaponRange } from '../dto';
import { DamageObserver } from './DamageObserver';
import { ICombatTargetProperties } from './ICombatTargetProperties';

export class CombatTarget implements ICombatTargetProperties {
  attackObservers: DamageObserver[];
  allies: CombatTarget[];
  // implements ICombatTargetProperties
  isPlayer: boolean;
  name: string;
  hitPoints: number;
  armorClass: number;
  equipement: ICharacterEquipment;
  classObj: Pick<Class, 'index' | 'name' | 'spellcasting'>;
  abilities: ICharacterAbilities;

  constructor({
    isPlayer,
    name,
    hitPoints,
    equipement,
    abilities,
    classObj,
  }: ICombatTargetProperties) {
    this.isPlayer = isPlayer;
    this.name = name;
    this.hitPoints = hitPoints;
    this.equipement = equipement;
    this.armorClass = this.equipement.armors.reduce((result, armor) => {
      result += armor.armor_class.base;
      if (armor.armor_class.dex_bonus && this.abilities.dex.modifier > 0) {
        result += this.abilities.dex.modifier;
      }
      return result;
    }, 0);

    this.abilities = abilities;
    this.classObj = classObj;
    this.allies = [];
    this.attackObservers = [];
  }

  static convertFromHero(hero: ICharacter): CombatTarget {
    // Convertit un objet de type IHero en instance de Character
    const character =
      new CombatTarget(/* initialisez les propriétés communes */);
    // Copiez les propriétés spécifiques du héros dans l'instance de Character
    // Utilisez les valeurs de hero pour initialiser les propriétés de character
    return character;
  }

  static convertFromMonster(monster: IMonster): CombatTarget {
    // Convertit un objet de type IMonster en instance de Character
    const character =
      new CombatTarget(/* initialisez les propriétés communes */);
    // Copiez les propriétés spécifiques du monstre dans l'instance de Character
    // Utilisez les valeurs de monster pour initialiser les propriétés de character
    return character;
  }

  public attack(
    target: CombatTarget,
    attackType: WeaponRange | 'SPELL'
  ): boolean {
    const attackRoll = this.rollAttack();
    const modifiers = this.getAttackModifiers(attackType);
    const attackResult =
      attackRoll === 1 ? false : attackRoll + modifiers >= target.armorClass;

    if (attackResult) {
      const damage = this.calculateDamage(attackType);
      const isCriticalHit = attackRoll === 20;
      target.takeDamage(damage);

      // Notify observers
      this.notifyAttackObservers(
        true,
        attackType,
        damage,
        isCriticalHit,
        false
      );

      console.log(`${this.name} a réussi son attaque !`);
    } else {
      const isCriticalMiss = attackRoll === 1;

      // Notify observers
      this.notifyAttackObservers(false, attackType, 0, false, isCriticalMiss);

      console.log(`${this.name} a raté son attaque.`);
    }

    return attackResult;
  }

  public takeDamage(damage: number): void {
    this.hitPoints -= damage;
    if (this.hitPoints <= 0) {
      console.log(`${this.name} est mort !`);

      // Notify observers
      this.notifyDeathObservers();
    }
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

  private notifyAttackObservers(
    success: boolean,
    attackType: WeaponRange | 'SPELL',
    damage: number,
    isCriticalHit: boolean,
    isCriticalMiss: boolean
  ): void {
    for (const observer of this.attackObservers) {
      observer.attackResult(
        success,
        attackType,
        damage,
        isCriticalHit,
        isCriticalMiss
      );
    }
  }

  private notifyDeathObservers(): void {
    for (const observer of this.attackObservers) {
      observer.characterDied(this);
    }
  }

  private rollAttack(): number {
    // Simulate rolling a d20
    return this.rollDice(20);
  }

  private rollDice(count: number) {
    return Math.floor(Math.random() * count) + 1;
  }

  private getAttackModifiers(attackType: WeaponRange | 'SPELL'): number {
    // Apply appropriate attack modifiers based on the equipment type
    let modifiers = 0;
    if (attackType === WeaponRange.Melee) {
      modifiers += this.strengthModifier();
      // Apply any other melee attack modifiers
    } else if (attackType === WeaponRange.Ranged) {
      modifiers += this.dexterityModifier();
      // Apply any other ranged attack modifiers
    } else if (attackType === 'SPELL') {
      modifiers += this.spellcastingModifier();
      // Apply any other spell attack modifiers
    }
    return modifiers;
  }

  private strengthModifier(): number {
    // Retourne le modificateur de caractéristique (Force) du personnage
    // Calcul du modificateur en fonction de la valeur de Force du personnage et son modificateur de maitrise en fonction de son niveau
    // ajoute le modificateur de maitrise

    return this.abilities.str.value;
  }

  private dexterityModifier(): number {
    // Retourne le modificateur de caractéristique (Dextérité) du personnage
    // Calcul du modificateur en fonction de la valeur de Dextérité du personnage et son modificateur de maitrise en fonction de son niveau
    return this.abilities.dex.value;
  }

  private spellcastingModifier(): number {
    // Retourne le modificateur de caractéristique (Dextérité) du personnage
    // Calcul du modificateur en fonction de la valeur de Dextérité du personnage et son modificateur de maitrise en fonction de son niveau

    const abilityIndex = this.classObj.spellcasting?.spellcasting_ability
      .index as keyof ICharacterAbilities | undefined;
    if (!abilityIndex) {
      return 0;
    }

    const ability: ICharacterAbility = this.abilities[abilityIndex];
    return ability.modifier;
  }

  private calculateDamage(
    attackType: WeaponRange | 'SPELL',
    spell: Spell
  ): number {
    // Calculate the damage based on the equipment type and other factors
    const calculate = (weaponDamage: Maybe<Damage> | undefined) => {
      if (!weaponDamage) {
        return 0;
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
    const { melees, ranged } = this.equipement;

    if (attackType === WeaponRange.Melee) {
      // Calculate melee damage
      // calculer les dégats des armes de mêlée sans oublier que certaine arme peuvent être prise à 1 et 2 mains
      if (melees.length == 1 && melees[0].two_handed_damage) {
        damage = calculate(melees[0].two_handed_damage);
      } else {
        damage = melees.reduce((mem, weapon) => {
          mem += calculate(weapon.damage);
          return mem;
        }, damage);
      }
    } else if (attackType === WeaponRange.Ranged) {
      // Calculate ranged damage

      damage = calculate(ranged?.damage);
    } else if (attackType === 'SPELL') {
      // Calculate spell damage
      throw "comment on calcul les sorts ? on dirait qu'il y a un type Spell.SpellDamage assez spécifique...";
    }
    return damage;
  }

  isAlly(target: CombatTarget): boolean {
    return this.allies.includes(target);
  }
}

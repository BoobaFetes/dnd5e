import { HeroRepository } from '@boobafetes/dnd5e-api';
import {
  Class,
  Dice,
  ICharacter,
  ICharacterAbilities,
  ICharacterAbility,
  Race,
  makeCharacter,
} from '@boobafetes/dnd5e-domain';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HERO_NAMES } from '../variables';
import { getGoldDiceByClassIndex } from './getGoldDiceByClassIndex';
import { getHeroHealthBase } from './getHeroHealthBase';
import {
  getModifier,
  randomizeAbilityScrores,
} from './randomizeAbilityScrores';
import { useHeroImage } from './useHeroImage';

const defaultHeroRepository = new HeroRepository();

type HeroAbility = ICharacter['abilities'];
export type HeroAbilityKeys = keyof HeroAbility | string;

interface IUseNewHeroOptions {
  races: Race[];
  classes: Class[];
  loading: boolean;
  heroRepository?: HeroRepository;
}
export function useNewHero({
  races,
  classes,
  loading,
  heroRepository = defaultHeroRepository,
}: IUseNewHeroOptions) {
  const navigate = useNavigate();
  const { nextImage, currentImage, previousImage } = useHeroImage();
  const [hero, setHero] = useState<ICharacter>(
    makeCharacter({ image: currentImage.src })
  );
  const [remainingAbilityPoints, setRemainingAbilityPoints] = useState(0);

  // define actions
  const setName = useCallback((name: string) => {
    setHero((current) => {
      return { ...current, name };
    });
  }, []);

  const setRandomName = useCallback(() => {
    const index = Math.floor(Math.random() * HERO_NAMES.length);
    setHero((current) => {
      return { ...current, name: HERO_NAMES[index] };
    });
  }, []);

  const abilityMinus = useCallback(
    (characteristic: HeroAbilityKeys) => {
      const ability: ICharacterAbility = {
        ...hero.abilities[characteristic],
      };
      const modifier = ability.modifier;
      ability.value--;
      ability.modifier = getModifier(ability);
      const pointCost = Math.abs(modifier > 0 ? modifier : 1);

      if (ability.value < 8) {
        return;
      }

      setRemainingAbilityPoints(remainingAbilityPoints + pointCost);
      setHero((current) => {
        const abilities: ICharacterAbilities = {
          ...current.abilities,
          [characteristic]: ability,
        };
        return {
          ...current,
          abilities,
          health: getHeroHealthBase(hero.class.index, abilities.con),
        };
      });
    },
    [hero.abilities, hero.class.index, remainingAbilityPoints]
  );
  const abilityPlus = useCallback(
    (characteristic: HeroAbilityKeys) => {
      const ability: ICharacterAbility = {
        ...hero.abilities[characteristic],
      };
      ability.value++;
      ability.modifier = getModifier(ability);
      const pointCost = Math.abs(ability.modifier > 0 ? ability.modifier : 1);

      const nextRemainingAbilityScore = remainingAbilityPoints - pointCost;
      if (nextRemainingAbilityScore < 0 || ability.value > 15) {
        return;
      }

      setRemainingAbilityPoints(remainingAbilityPoints - pointCost);
      setHero((current) => {
        const abilities: ICharacterAbilities = {
          ...current.abilities,
          [characteristic]: ability,
        };
        return {
          ...current,
          abilities,
          health: getHeroHealthBase(hero.class.index, abilities.con),
        };
      });
    },
    [hero.abilities, hero.class.index, remainingAbilityPoints]
  );
  const abilitiesRandomize = useCallback(() => {
    setHero((current) => {
      const abilities: ICharacterAbilities = randomizeAbilityScrores();
      setRemainingAbilityPoints(0);
      return {
        ...current,
        abilities,
        health: getHeroHealthBase(current.class.index, abilities.con),
      };
    });
  }, []);

  const setImage = useCallback((image: string) => {
    setHero((current) => {
      return { ...current, image };
    });
  }, []);

  const setRace = useCallback(
    (index: string) => {
      const race =
        races.find((race) => race.index === index) || makeCharacter().race;

      setHero((current) => {
        return { ...current, race };
      });
    },
    [races]
  );

  const setClass = useCallback(
    (index: string) => {
      const classe =
        classes.find((classe) => classe.index === index) ||
        makeCharacter().class;

      setHero((current) => {
        return {
          ...current,
          class: classe,
          gold: !classe.index
            ? 0
            : new Dice(getGoldDiceByClassIndex(classe.index)).roll() * 10,
        };
      });
    },
    [classes]
  );

  // init
  useEffect(() => {
    if (!loading) {
      const classIndex = Math.floor(Math.random() * classes.length);
      const raceIndex = Math.floor(Math.random() * races.length);

      setRandomName();
      setRace(races[raceIndex].index);
      setClass(classes[classIndex].index);
      abilitiesRandomize();
    }
  }, [
    loading,
    classes,
    races,
    setClass,
    setRace,
    setRandomName,
    abilitiesRandomize,
  ]);

  const validate = useCallback(() => {
    const { race, class: classe, image, name } = hero;
    return (
      race?.index &&
      classe?.index &&
      image &&
      name &&
      remainingAbilityPoints === 0
    );
  }, [hero, remainingAbilityPoints]);

  return {
    hero,
    setName,
    setRandomName,
    setImage,
    setRace,
    setClass,
    abilities: {
      minus: abilityMinus,
      plus: abilityPlus,
      randomize: abilitiesRandomize,
      remainingPoints: remainingAbilityPoints,
    },
    previousImage() {
      setImage(previousImage().src);
    },
    nextImage() {
      setImage(nextImage().src);
    },
    validate,
    save() {
      if (validate() && heroRepository.add(hero)) {
        navigate(`/hero`);
      }
    },
  };
}

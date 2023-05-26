import { ICharacter, ICharacterAbility } from '@boobafetes/dnd5e-domain';
import { useCallback, useState } from 'react';
import {
  getModifier,
  randomizeAbilityScrores,
} from './randomizeAbilityScrores';

type HeroAbility = ICharacter['abilities'];
export type HeroAbilityKeys = keyof HeroAbility | string;

export const useHeroAbilityCreator = (
  hero: ICharacter,
  setHero: (value: ICharacter) => void
) => {
  const [remainingAbilityScore, setRemainingAbilityScore] = useState(0);

  const actionAbilityScore = useCallback(
    (characteristic: HeroAbilityKeys) => {
      return {
        minus() {
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

          setHero({
            ...hero,
            abilities: {
              ...hero.abilities,
              [characteristic]: ability,
            },
          });
          setRemainingAbilityScore(remainingAbilityScore + pointCost);
        },
        plus() {
          const ability: ICharacterAbility = {
            ...hero.abilities[characteristic],
          };
          ability.value++;
          ability.modifier = getModifier(ability);
          const pointCost = Math.abs(
            ability.modifier > 0 ? ability.modifier : 1
          );

          const nextRemainingAbilityScore = remainingAbilityScore - pointCost;
          if (nextRemainingAbilityScore < 0 || ability.value > 15) {
            return;
          }

          setHero({
            ...hero,
            abilities: { ...hero.abilities, [characteristic]: ability },
          });
          setRemainingAbilityScore(nextRemainingAbilityScore);
        },
      };
    },
    [hero, remainingAbilityScore, setHero]
  );

  return {
    randomizeAbilityScore() {
      setHero({ ...hero, abilities: randomizeAbilityScrores() });
      setRemainingAbilityScore(0);
    },
    remainingAbilityScore,
    actionAbilityScore,
  };
};

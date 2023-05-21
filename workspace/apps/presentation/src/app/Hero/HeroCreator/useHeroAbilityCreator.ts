import { useCallback, useState } from 'react';
import { IHero, makeHero } from '../IHero';
import { ABILTITY_SCORE_INIT } from '../variables';

type HeroAbility = IHero['abilities'];
export type HeroAbilityKeys = keyof HeroAbility | string;

export const useHeroAbilityCreator = (
  hero: IHero,
  setHero: (value: IHero) => void,
  maxAbilityPoints = ABILTITY_SCORE_INIT
) => {
  const [remainingAbilityScore, setRemainingAbilityScore] =
    useState(maxAbilityPoints);

  const actionAbilityScore = useCallback(
    (characteristic: HeroAbilityKeys) => {
      return {
        minus() {
          if (hero.abilities[characteristic] <= 8) {
            return;
          }

          setHero({
            ...hero,
            abilities: {
              ...hero.abilities,
              [characteristic]: hero.abilities[characteristic] - 1,
            },
          });
          setRemainingAbilityScore(remainingAbilityScore + 1);
        },
        plus() {
          if (remainingAbilityScore <= 0) {
            return;
          }

          setHero({
            ...hero,
            abilities: {
              ...hero.abilities,
              [characteristic]: hero.abilities[characteristic] + 1,
            },
          });
          setRemainingAbilityScore(remainingAbilityScore - 1);
        },
      };
    },
    [hero, remainingAbilityScore, setHero]
  );

  return {
    randomizeAbilityScore() {
      setHero({ ...hero, abilities: randomize(maxAbilityPoints) });
      setRemainingAbilityScore(0);
    },
    remainingAbilityScore,
    actionAbilityScore,
  };
};

const randomize = (maxAbilityPoints: number) => {
  let remainingPoints = maxAbilityPoints; // Nombre total de points à répartir

  const abilityScore = makeHero().abilities;
  const characteristics = Object.keys(abilityScore);

  // Répartition aléatoire des points
  while (remainingPoints > 0) {
    const randomIndex = Math.floor(Math.random() * characteristics.length);
    const randomCharacteristic = characteristics[randomIndex];

    abilityScore[randomCharacteristic]++;
    remainingPoints--;
  }

  return abilityScore;
};

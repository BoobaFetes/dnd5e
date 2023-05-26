import { ICharacterAbility, makeCharacter } from '@boobafetes/dnd5e-domain';
import { ABILTITY_SCORE_INIT } from '../variables';

export function randomizeAbilityScrores() {
  let remainingPoints = ABILTITY_SCORE_INIT; // Nombre total de points à répartir

  const abilityScore = makeCharacter().abilities;
  const characteristics = Object.keys(abilityScore);

  const abilities = Object.keys(abilityScore);
  abilities.forEach((key) => {
    const ability: ICharacterAbility = abilityScore[key];
    while (ability.value < 8) {
      ability.value++;
      remainingPoints--;
    }
  });

  // Répartition aléatoire des points
  while (remainingPoints > 0) {
    const randomIndex = Math.floor(Math.random() * characteristics.length);
    const randomCharacteristic = characteristics[randomIndex];

    const ability: ICharacterAbility = {
      ...abilityScore[randomCharacteristic],
    };
    if (ability.value >= 15) {
      characteristics.splice(randomIndex, 1);
      continue;
    }
    ability.value++;
    ability.modifier = getModifier(ability);

    const pointCost = ability.modifier > 0 ? ability.modifier : 1;
    if (remainingPoints - pointCost < 0) {
      continue;
    }

    remainingPoints = remainingPoints - pointCost;
    abilityScore[randomCharacteristic] = ability;
  }

  return abilityScore;
}

export function getModifier({ value }: ICharacterAbility) {
  const base = value - 10;
  const coef = base >= 0 ? 1 : -1;
  const modifier = Math.abs(base / 2);
  const result = coef > 0 ? Math.floor(modifier) : Math.round(modifier);
  return coef * result;
}

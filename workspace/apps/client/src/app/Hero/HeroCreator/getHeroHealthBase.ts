import { ICharacterAbility } from '@boobafetes/dnd5e-domain';

export const healtDiceByClassIndex: Record<string, number> = {
  barbarian: 12,
  bard: 8,
  cleric: 8,
  druid: 8,
  warlock: 6,
  fighter: 10,
  wizard: 6,
  monk: 8,
  paladin: 10,
  ranger: 10,
  sorcerer: 6,
  rogue: 8,
};

export function getHeroHealthBase(
  classIndex: string,
  conValue: ICharacterAbility,
  level = 1
) {
  return classIndex
    ? 0
    : (healtDiceByClassIndex[classIndex] + conValue.modifier) * level;
}

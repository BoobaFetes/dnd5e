export function getGoldDiceByClassIndex(classIndex: string) {
  let goldDice: string;
  switch (classIndex) {
    case 'barbarian':
      goldDice = '2d4';
      break;
    case 'bard':
      goldDice = '5d4';
      break;
    case 'cleric':
      goldDice = '5d4';
      break;
    case 'druid':
      goldDice = '2d4';
      break;
    case 'fighter':
      goldDice = '5d4';
      break;
    case 'monk':
      goldDice = '5d4';
      break;
    case 'paladin':
      goldDice = '5d4';
      break;
    case 'ranger':
      goldDice = '5d4';
      break;
    case 'rogue':
      goldDice = '4d4';
      break;
    case 'sorcerer':
      goldDice = '4d4';
      break;
    case 'warlock':
      goldDice = '3d4';
      break;
    case 'wizard':
      goldDice = '4d4';
      break;
    default:
      goldDice = 'd0';
  }
  return goldDice;
}

import { EquipementUtils, ICharacter } from '@boobafetes/dnd5e-domain';
import { useMemo } from 'react';

export function useEquipementUtils(hero: ICharacter) {
  const is = useMemo(() => EquipementUtils.is, []);
  const has = useMemo(() => EquipementUtils.has(hero), [hero]);
  return { is, has };
}

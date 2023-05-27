import { QueryHookOptions, useQuery } from '@apollo/client';
import { WeaponsResult, queryWeapons } from './query';

export const useQueryWeapons = (options?: QueryHookOptions<WeaponsResult>) =>
  useQuery<WeaponsResult>(queryWeapons, options);

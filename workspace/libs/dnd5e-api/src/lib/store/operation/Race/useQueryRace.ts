import { QueryHookOptions, useQuery } from '@apollo/client';
import { QueryRaceArgs } from '@boobafetes/dnd5e-domain';
import { RaceResult, queryRace } from './query/queryRace';

export const useQueryRace = (
  options?: QueryHookOptions<RaceResult, QueryRaceArgs>
) => useQuery<RaceResult, QueryRaceArgs>(queryRace, options);

import { QueryHookOptions, useQuery } from '@apollo/client';
import { QueryRacesArgs } from '@boobafetes/dnd5e-domain';
import { RacesResult, queryRaces } from './query/queryRaces';

export const useQueryRaces = (
  options?: QueryHookOptions<RacesResult, QueryRacesArgs>
) => useQuery<RacesResult, QueryRacesArgs>(queryRaces, options);

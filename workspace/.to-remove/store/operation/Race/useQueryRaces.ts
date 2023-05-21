import { QueryHookOptions, useQuery } from '@apollo/client';
import { dto } from '../..';
import { RacesResult, queryRaces } from './query/queryRaces';

export const useQueryRaces = (
  options?: QueryHookOptions<RacesResult, dto.QueryRacesArgs>
) => useQuery<RacesResult, dto.QueryRacesArgs>(queryRaces, options);

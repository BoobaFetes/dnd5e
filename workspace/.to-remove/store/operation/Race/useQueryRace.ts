import { QueryHookOptions, useQuery } from '@apollo/client';
import { dto } from '../..';
import { RaceResult, queryRace } from './query/queryRace';

export const useQueryRace = (
  options?: QueryHookOptions<RaceResult, dto.QueryRaceArgs>
) => useQuery<RaceResult, dto.QueryRaceArgs>(queryRace, options);

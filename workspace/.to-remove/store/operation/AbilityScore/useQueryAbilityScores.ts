import { QueryHookOptions, useQuery } from '@apollo/client';
import { dto } from '../..';
import {
  AbilityScoresResult,
  queryAbilityScores,
} from './query/queryAbilityScores';

export const useQueryAbilityScores = (
  options?: QueryHookOptions<AbilityScoresResult, dto.QueryAbilityScoresArgs>
) =>
  useQuery<AbilityScoresResult, dto.QueryAbilityScoresArgs>(
    queryAbilityScores,
    options
  );

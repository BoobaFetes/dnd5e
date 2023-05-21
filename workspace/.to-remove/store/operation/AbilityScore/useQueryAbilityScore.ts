import { QueryHookOptions, useQuery } from '@apollo/client';
import { dto } from '../..';
import {
  AbilityScoreResult,
  queryAbilityScore,
} from './query/queryAbilityScore';

export const useQueryAbilityScore = (
  options?: QueryHookOptions<AbilityScoreResult, dto.QueryAbilityScoreArgs>
) =>
  useQuery<AbilityScoreResult, dto.QueryAbilityScoreArgs>(
    queryAbilityScore,
    options
  );

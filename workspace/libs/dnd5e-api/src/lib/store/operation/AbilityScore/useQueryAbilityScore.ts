import { QueryHookOptions, useQuery } from '@apollo/client';
import { QueryAbilityScoreArgs } from '@boobafetes/dnd5e-domain';
import {
  AbilityScoreResult,
  queryAbilityScore,
} from './query/queryAbilityScore';

export const useQueryAbilityScore = (
  options?: QueryHookOptions<AbilityScoreResult, QueryAbilityScoreArgs>
) =>
  useQuery<AbilityScoreResult, QueryAbilityScoreArgs>(
    queryAbilityScore,
    options
  );

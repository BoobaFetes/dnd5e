import { QueryHookOptions, useQuery } from '@apollo/client';
import { QueryAbilityScoresArgs } from '@boobafetes/dnd5e-domain';
import {
  AbilityScoresResult,
  queryAbilityScores,
} from './query/queryAbilityScores';

export const useQueryAbilityScores = (
  options?: QueryHookOptions<AbilityScoresResult, QueryAbilityScoresArgs>
) =>
  useQuery<AbilityScoresResult, QueryAbilityScoresArgs>(
    queryAbilityScores,
    options
  );

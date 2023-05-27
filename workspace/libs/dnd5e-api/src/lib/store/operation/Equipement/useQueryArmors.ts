import { QueryHookOptions, useQuery } from '@apollo/client';
import { ArmorsResult, queryArmors } from './query/queryArmors';

export const useQueryArmors = (options?: QueryHookOptions<ArmorsResult>) =>
  useQuery<ArmorsResult>(queryArmors, options);

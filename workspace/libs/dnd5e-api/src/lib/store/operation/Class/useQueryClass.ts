import { QueryHookOptions, useQuery } from '@apollo/client';
import { QueryClassArgs } from '@boobafetes/dnd5e-domain';
import { ClassResult, queryClass } from './query/queryClass';

export const useQueryClass = (
  options?: QueryHookOptions<ClassResult, QueryClassArgs>
) => useQuery<ClassResult, QueryClassArgs>(queryClass, options);

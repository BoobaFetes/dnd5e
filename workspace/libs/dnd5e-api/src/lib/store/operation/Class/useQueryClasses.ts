import { QueryHookOptions, useQuery } from '@apollo/client';
import { QueryClassesArgs } from '@boobafetes/dnd5e-domain';
import { ClassesResult, queryClasses } from './query/queryClasses';

export const useQueryClasses = (
  options?: QueryHookOptions<ClassesResult, QueryClassesArgs>
) => useQuery<ClassesResult, QueryClassesArgs>(queryClasses, options);

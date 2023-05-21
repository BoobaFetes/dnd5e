import { QueryHookOptions, useQuery } from '@apollo/client';
import { dto } from '../..';
import { ClassesResult, queryClasses } from './query/queryClasses';

export const useQueryClasses = (
  options?: QueryHookOptions<ClassesResult, dto.QueryClassesArgs>
) => useQuery<ClassesResult, dto.QueryClassesArgs>(queryClasses, options);

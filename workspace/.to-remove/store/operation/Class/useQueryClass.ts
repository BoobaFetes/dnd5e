import { QueryHookOptions, useQuery } from '@apollo/client';
import { dto } from '../..';
import { ClassResult, queryClass } from './query/queryClass';

export const useQueryClass = (
  options?: QueryHookOptions<ClassResult, dto.QueryClassArgs>
) => useQuery<ClassResult, dto.QueryClassArgs>(queryClass, options);

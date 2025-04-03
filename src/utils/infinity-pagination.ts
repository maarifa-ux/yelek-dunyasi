import { IPaginationOptions } from './types/pagination-options';
import { InfinityPaginationResultType } from './types/infinity-pagination-result.type';

export const infinityPagination = <T>(
  items: T[],
  options: IPaginationOptions,
): InfinityPaginationResultType<T> => {
  return {
    items,
    hasNextPage: items.length === options.limit,
  };
};

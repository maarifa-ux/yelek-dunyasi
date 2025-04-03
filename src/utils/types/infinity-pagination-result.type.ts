export type InfinityPaginationResultType<T> = Readonly<{
  items: T[];
  hasNextPage: boolean;
}>;

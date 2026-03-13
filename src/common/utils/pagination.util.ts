export interface PaginatedResult<T> {
  perpage: number;
  data: T[];
  next: number | null;
  count: number;
}

export function formatPaginatedResponse<T>(
  data: T[],
  count: number,
  limit: number,
  offset: number,
): PaginatedResult<T> {
  const nextOffset = offset + limit;
  const next = nextOffset < count ? nextOffset : null;

  return {
    perpage: limit,
    data,
    next,
    count,
  };
}

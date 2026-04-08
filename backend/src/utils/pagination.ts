export interface PaginationResult {
  page: number;
  limit: number;
  offset: number;
}

export function getPagination(
  pageRaw?: unknown,
  limitRaw?: unknown
): PaginationResult {
  const page = Math.max(Number(pageRaw) || 1, 1);
  const limit = Math.min(Math.max(Number(limitRaw) || 10, 1), 100);
  const offset = (page - 1) * limit;

  return { page, limit, offset };
}
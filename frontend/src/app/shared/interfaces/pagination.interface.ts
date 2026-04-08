export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedData<T> {
  items: T[];
  pagination: PaginationMeta;
}

export interface ApiPaginatedResponse<T> {
  ok: boolean;
  data: PaginatedData<T>;
}

export interface ApiItemResponse<T> {
  ok: boolean;
  message?: string;
  data: T;
}
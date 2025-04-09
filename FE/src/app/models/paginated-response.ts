export interface PaginatedResponse<T> {
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    data: T;
  }  
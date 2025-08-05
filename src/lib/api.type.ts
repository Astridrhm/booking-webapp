export type FilterQuery = {
  page?: number;
  limit?: number;
  orderDir?: string;
  orderBy?: string;
  filter?: Record<string, unknown>;
}

export interface ResponseApi<T = unknown> {
  statusCode: string;
  status: string;
  message: string;
  data: T;
}

export interface Pagination<T = unknown> {
  page: number,
  perPage: number,
  totalPage: number,
  totalData: number,
  list: T
}

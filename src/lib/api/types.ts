export interface ErrorResponse {
  statusCode: number;
  message: string;
}

export type ApiResponse<T> = ErrorResponse | T;

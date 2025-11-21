// Centralized type exports
export * from './auth';
export * from './exercise';
export * from './navigation';

// Common/Utility types
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
  offset?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string | ApiError;
}

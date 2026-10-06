import { HttpErrorResponse } from '@angular/common/http';
import { ApiError } from '../models';

/**
 * Turns whatever HttpClient threw into our ApiError shape,
 * so components only ever deal with { status, code, message, field? }.
 */
export function toApiError(err: unknown): ApiError {
  if (err instanceof HttpErrorResponse) {
    const body = err.error as Partial<ApiError> | null;
    if (body && typeof body === 'object' && typeof body.code === 'string' && typeof body.message === 'string') {
      return { status: err.status, code: body.code, message: body.message, ...(body.field ? { field: body.field } : {}) };
    }
    if (err.status === 0) {
      return { status: 0, code: 'NETWORK_ERROR', message: 'Could not reach the server. Check your connection and try again.' };
    }
    return { status: err.status, code: 'UNKNOWN', message: 'Something went wrong. Please try again.' };
  }
  return { status: 500, code: 'UNKNOWN', message: 'Something went wrong. Please try again.' };
}

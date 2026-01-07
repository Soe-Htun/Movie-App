import { HttpErrorResponse } from '@angular/common/http';

export function mapHttpError(error: HttpErrorResponse): string {
  if (error.status === 0) {
    return 'Network error. Check your connection and try again.';
  }

  if (error.status === 401) {
    return 'Unauthorized. Check your TMDB API key configuration.';
  }

  if (error.status === 404) {
    return 'The requested resource was not found.';
  }

  if (error.status === 429) {
    return 'Rate limit reached. Please wait and retry.';
  }

  return 'Something went wrong. Please retry.';
}

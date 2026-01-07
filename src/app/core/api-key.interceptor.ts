import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { APP_CONFIG } from './app-config';

export const apiKeyInterceptor: HttpInterceptorFn = (req, next) => {
  const config = inject(APP_CONFIG);

  if (config.useMock || !req.url.startsWith(config.apiBase)) {
    return next(req);
  }

  const params = req.params.set('api_key', config.apiKey);
  return next(req.clone({ params }));
};

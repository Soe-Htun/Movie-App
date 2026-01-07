import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { apiKeyInterceptor } from './core/api-key.interceptor';
import { errorInterceptor } from './core/error.interceptor';
import { provideAppConfig } from './core/app-config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideAppConfig(),
    provideHttpClient(withInterceptors([apiKeyInterceptor, errorInterceptor])),
    provideRouter(routes)
  ]
};

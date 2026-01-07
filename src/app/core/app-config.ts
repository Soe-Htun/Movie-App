import { InjectionToken, Provider } from '@angular/core';
import { environment } from '../../environments/environment';

export interface AppConfig {
  apiBase: string;
  imageBase: string;
  apiKey: string;
  useMock: boolean;
  cacheTtlMs: number;
}

export const APP_CONFIG = new InjectionToken<AppConfig>('app.config');

export function provideAppConfig(): Provider {
  const useMock = environment.useMock || !environment.tmdbApiKey;

  return {
    provide: APP_CONFIG,
    useValue: {
      apiBase: environment.apiBase,
      imageBase: environment.imageBase,
      apiKey: environment.tmdbApiKey,
      useMock,
      cacheTtlMs: environment.cacheTtlMs
    }
  };
}

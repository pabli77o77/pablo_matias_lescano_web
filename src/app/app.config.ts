import { ApplicationConfig, provideZoneChangeDetection, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { AnalyticsService } from '@core/services/analytics.service';

// Factory para forzar la instanciación del servicio al inicio
export function initializeAnalytics(analytics: AnalyticsService) {
  return () => {}; // El constructor del servicio ya maneja la lógica
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    // Analytics & GTM Configuration
    { provide: 'googleTagManagerId', useValue: 'GTM-TFNBRMFK' },
    // Analytics Service Eager Loading
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAnalytics,
      deps: [AnalyticsService],
      multi: true
    }
  ]
};
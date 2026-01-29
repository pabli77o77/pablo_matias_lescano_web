import { Injectable, Inject, PLATFORM_ID, signal, computed } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { environment } from '@env/environment';

// Tipado estricto para window.gtag
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export type EventCategory = 'engagement' | 'interaction' | 'conversion' | 'navigation';

export interface AnalyticsEvent {
  action: string;
  category: EventCategory;
  label?: string;
  value?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private isBrowser: boolean;
  
  // Signal para estado de inicialización (útil para debug o mostrar UI condicional)
  private _isInitialized = signal<boolean>(false);
  public readonly isInitialized = this._isInitialized.asReadonly();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document,
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.init();
  }

  /**
   * Inicialización controlada del script de GA4
   */
  private init() {
    if (!this.isBrowser) return;
    
    // Evitar tracking en entornos sin ID configurado (Dev/Test)
    if (!environment.googleAnalyticsId || environment.googleAnalyticsId === 'G-MEASUREMENT-ID') {
      console.warn('Analytics: No Tracking ID configured (Dev Mode).');
      return;
    }

    this.injectScript();
    this.trackPageViews();
    this._isInitialized.set(true);
  }

  private injectScript() {
    const script = this.document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${environment.googleAnalyticsId}`;
    this.document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function() { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', environment.googleAnalyticsId, {
      send_page_view: false // Control manual vía Router
    });
  }

  private trackPageViews() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      if (this._isInitialized()) {
        window.gtag('event', 'page_view', {
          page_path: event.urlAfterRedirects
        });
      }
    });
  }

  // --- API Pública de Negocio (Domain Events) ---

  /**
   * Wrapper genérico privado para asegurar consistencia
   */
  private logEvent(event: AnalyticsEvent) {
    if (!this.isBrowser || !this._isInitialized()) {
      if (!environment.production) {
        console.log('[Analytics Dev]', event);
      }
      return;
    }

    window.gtag('event', event.action, {
      event_category: event.category,
      event_label: event.label,
      value: event.value
    });
  }

  /**
   * Hito: Descarga de CV
   */
  trackCvDownload(fileName: string, language: 'es' | 'en') {
    this.logEvent({
      action: 'track_cv_download',
      category: 'conversion',
      label: `${fileName} (${language})`
    });
  }

  /**
   * Hito: Interacción con el Stack Tecnológico
   */
  trackTechInteraction(techName: string, category: string) {
    this.logEvent({
      action: 'track_tech_interaction',
      category: 'interaction',
      label: `${category} > ${techName}`
    });
  }

  /**
   * Hito: Clics en enlaces externos (Redes/Contacto)
   */
  trackExternalLink(platform: 'linkedin' | 'github' | 'email') {
    this.logEvent({
      action: 'track_external_link',
      category: 'engagement',
      label: platform
    });
  }

  /**
   * Hito: Cambio de Modo de Vista (Reactivo al Store)
   */
  trackViewChange(mode: 'frontend' | 'data') {
    this.logEvent({
      action: 'view_mode_toggle',
      category: 'interaction',
      label: mode
    });
  }
}

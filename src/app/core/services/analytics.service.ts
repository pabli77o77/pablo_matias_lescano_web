import { Injectable, Inject, PLATFORM_ID, signal, isDevMode } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { GoogleTagManagerService } from 'angular-google-tag-manager';

export type EventCategory = 'engagement' | 'interaction' | 'conversion' | 'navigation';

export interface AnalyticsEvent {
  event: string;
  category?: EventCategory;
  label?: string;
  value?: number;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private isBrowser: boolean;
  
  // Signal para estado de inicialización
  private _isInitialized = signal<boolean>(false);
  public readonly isInitialized = this._isInitialized.asReadonly();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private gtmService: GoogleTagManagerService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.init();
  }

  private init() {
    if (!this.isBrowser) return;

    this.trackPageViews();
    this._isInitialized.set(true);
  }

  private trackPageViews() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.pushEvent({
        event: 'page_view',
        page_path: event.urlAfterRedirects
      });
    });
  }

  // --- Core Implementation ---

  private pushEvent(data: AnalyticsEvent) {
    if (!this.isBrowser) return;

    // 1. Resiliencia: Verificar si el entorno de window y dataLayer es accesible
    // Los AdBlockers estrictos pueden impedir incluso la creación del objeto dataLayer
    const dataLayerExists = (window as any).dataLayer;

    if (!dataLayerExists && isDevMode()) {
      console.warn('GTM Warning: dataLayer no detectado. Posible bloqueo de cliente.');
    }

    try {
      // Intentar el push
      this.gtmService.pushTag(data).catch(err => {
        // 2. Silenciar errores asíncronos (Promise Rejection por fallo de red/bloqueo)
        this.handleGwmError(err);
      });
    } catch (err) {
      // 2. Silenciar errores síncronos
      this.handleGwmError(err);
    }
  }

  private handleGwmError(err: any) {
    // 3. Feedback: Solo en desarrollo para no ensuciar la consola del usuario
    if (isDevMode()) {
      console.warn('GTM bloqueado por el cliente - La analítica está desactivada', err);
    }
  }

  /**
   * Método genérico para trackear eventos personalizados con carga útil.
   * Proporciona la flexibilidad necesaria para instrumentación específica.
   */
  trackEvent(eventName: string, payload: Record<string, any> = {}) {
    this.pushEvent({
      event: eventName,
      ...payload
    });
  }

  // --- Business Events (Domain Driven) ---

  /**
   * Hito: Descarga de CV
   */
  trackCvDownload(fileName: string, language: 'es' | 'en') {
    this.pushEvent({
      event: 'file_download',
      category: 'conversion',
      label: `${fileName} (${language})`,
      file_name: fileName
    });
  }

  /**
   * Hito: Interacción con el Stack Tecnológico
   */
  trackTechInteraction(techName: string, category: string) {
    this.pushEvent({
      event: 'tech_interaction',
      category: 'interaction',
      label: `${category} > ${techName}`,
      tech_stack: techName
    });
  }

  /**
   * Hito: Clics en enlaces externos (Redes/Contacto)
   * Usado para LinkedIn, GitHub, Email y ahora WhatsApp
   */
  trackExternalLink(platform: string) {
    this.pushEvent({
      event: 'external_link_click',
      category: 'engagement',
      label: platform,
      destination: platform
    });
  }

  /**
   * Hito: Conversión de Formulario de Contacto (AWS)
   */
  trackContactFormSuccess() {
    this.pushEvent({
      event: 'contact_form_success',
      category: 'conversion',
      label: 'aws_serverless_form'
    });
  }

  /**
   * Hito: Interacción Social (Botones específicos)
   */
  trackSocialInteraction(network: 'whatsapp' | 'linkedin') {
    this.pushEvent({
      event: 'click_social_interaction',
      category: 'interaction',
      label: network,
      network: network
    });
  }

  /**
   * Hito: Interacción con Badges de Confianza (Footer)
   */
  trackFooterInteraction(techName: string) {
    this.pushEvent({
      event: 'view_tech_badge',
      tech_category: techName,
      action: 'open_details_modal'
    });
  }

  /**
   * Hito: Cambio de Modo de Vista (Reactivo al Store)
   */
  trackViewChange(mode: 'frontend' | 'data') {
    this.pushEvent({
      event: 'view_mode_toggle',
      category: 'interaction',
      label: mode
    });
  }
}

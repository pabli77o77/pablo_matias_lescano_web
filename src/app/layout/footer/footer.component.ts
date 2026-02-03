import { Component, computed, inject, signal } from '@angular/core';
import { ProfileStore } from '@core/store/profile.store';
import { AnalyticsService } from '@core/services/analytics.service';
import { ArchitectureModalComponent } from '@shared/components/architecture-modal/architecture-modal.component';
import { FooterDetail } from './footer.model';

type ModalType = 'aws' | 'security' | 'mozilla' | 'analytics';

const FOOTER_DATA_I18N: Record<'es' | 'en', Record<ModalType, FooterDetail>> = {
  es: {
    aws: {
      title: 'Infraestructura Cloud',
      subtitle: 'Proveedor: AWS (Amazon Web Services)',
      icon: '☁️',
      description: 'Arquitectura Serverless para escalabilidad infinita y costo de mantenimiento cero. Optimizada para alta disponibilidad y entrega de contenido global.',
      features: [
        { label: 'Estrategia Hosting', value: 'S3 Static Website' },
        { label: 'CDN / Edge', value: 'Distribución CloudFront' },
        { label: 'Cómputo', value: 'Lambda Edge (Serverless)' }
      ]
    },
    security: {
      title: 'Hardening de Seguridad',
      subtitle: 'Certificación Grado A+',
      icon: '🛡️',
      description: 'Estrategia de defensa en profundidad implementando políticas estrictas de navegador y hardening de cabeceras para mitigar XSS, Clickjacking y ataques de degradación de protocolo.',
      features: [
        { label: 'SecurityHeaders.com', value: 'Grado A' },
        { label: 'Protección XSS', value: 'CSP Estricto' },
        { label: 'Seguridad Transporte', value: 'HSTS Preload' }
      ]
    },
    mozilla: {
      title: 'Rendimiento y Estándares',
      subtitle: 'Auditado por Mozilla Observatory',
      icon: '🚀',
      description: 'Optimización de Single Page Application (SPA) enfocada en Core Web Vitals, reducción de payload y técnicas modernas de división de bundles.',
      features: [
        { label: 'Puntaje Observatory', value: 'B+ (Top 5%)' },
        { label: 'Estrategia SPA', value: 'Angular Signals + Lazy Loading' },
        { label: 'Rendimiento Lighthouse', value: '100 / 100' }
      ]
    },
    analytics: {
      title: 'Enterprise Analytics Architecture',
      subtitle: 'Caso de Éxito: SunExpress (Newshore/Flyr)',
      icon: '📊',
      description: 'Implementación de soluciones de tracking de alta precisión. Diseño de DataLayers agnósticos para flujos de reserva complejos y orquestación de funnels de conversión avanzados.',
      features: [
        { label: 'Estrategia', value: 'Custom DataLayer Design' },
        { label: 'Tracking', value: 'GA4 + GTM Governance' },
        { label: 'Impacto', value: 'Data-Driven CRO' }
      ]
    }
  },
  en: {
    aws: {
      title: 'Cloud Infrastructure',
      subtitle: 'Provider: AWS (Amazon Web Services)',
      icon: '☁️',
      description: 'Serverless architecture leverage for infinite scalability and zero-maintenance cost. Optimized for high-availability and global content delivery.',
      features: [
        { label: 'Hosting Strategy', value: 'S3 Static Website' },
        { label: 'CDN / Edge', value: 'CloudFront Distribution' },
        { label: 'Compute', value: 'Lambda Edge (Serverless)' }
      ]
    },
    security: {
      title: 'Security Hardening',
      subtitle: 'Grade A+ Certified',
      icon: '🛡️',
      description: 'Defense-in-depth strategy implementing strict browser policies and header hardening to mitigate XSS, Clickjacking, and Protocol Downgrade attacks.',
      features: [
        { label: 'SecurityHeaders.com', value: 'Grade A' },
        { label: 'XSS Protection', value: 'Strict CSP' },
        { label: 'Transport Security', value: 'HSTS Preload' }
      ]
    },
    mozilla: {
      title: 'Performance & Standards',
      subtitle: 'Mozilla Observatory Audited',
      icon: '🚀',
      description: 'Single Page Application (SPA) optimization focused on Core Web Vitals, payload reduction, and modern bundle splitting techniques.',
      features: [
        { label: 'Observatory Score', value: 'B+ (Top 5%)' },
        { label: 'SPA Strategy', value: 'Angular Signals + Lazy Loading' },
        { label: 'Lighthouse Perf.', value: '100 / 100' }
      ]
    },
    analytics: {
      title: 'Enterprise Analytics Architecture',
      subtitle: 'Success Case: SunExpress (Newshore/Flyr)',
      icon: '📊',
      description: 'Implementation of high-precision tracking solutions. Design of agnostic DataLayers for complex booking flows and orchestration of advanced conversion funnels.',
      features: [
        { label: 'Strategy', value: 'Custom DataLayer Design' },
        { label: 'Tracking', value: 'GA4 + GTM Governance' },
        { label: 'Impact', value: 'Data-Driven CRO' }
      ]
    }
  }
};

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [ArchitectureModalComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  store = inject(ProfileStore);
  private analytics = inject(AnalyticsService);
  currentYear = new Date().getFullYear();
  
  // State Signal: Tracks WHICH modal type is open (or null)
  activeModalType = signal<ModalType | null>(null);

  // Computed: Derives the correct content based on open modal + current language
  activeDetail = computed(() => {
    const type = this.activeModalType();
    const lang = this.store.language(); // 'es' | 'en'
    
    if (!type) return null;
    
    return FOOTER_DATA_I18N[lang][type];
  });

  openModal(type: string) {
    // Validamos que sea un tipo conocido
    if (['aws', 'security', 'mozilla', 'analytics'].includes(type)) {
      this.activeModalType.set(type as ModalType);
      
      // Telemetría: Registrar interés en la tecnología específica
      this.analytics.trackFooterInteraction(type);
    }
  }

  closeModal() {
    this.activeModalType.set(null);
  }

  trackLinkedIn() {
    this.analytics.trackSocialInteraction('linkedin');
  }
}


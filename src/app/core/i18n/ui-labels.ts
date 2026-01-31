export const UI_LABELS = {
  es: {
    totalExperience: 'Experiencia Total',
    years: 'años',
    techStack: 'Stack Tecnológico & Expertise',
    experienceHighlights: 'Experiencia Destacada',
    downloadCV: 'Descargar CV',
    switchToData: 'Ver Código y Arquitectura',
    switchToFrontend: 'Ver Diseño Visual',
    architectureView: 'Arquitectura de Software y Código Fuente',
    jsonDesc: 'Exploración técnica de la aplicación: Modelos de dominio, gestión de estado reactivo y datos estructurados.',
    current: 'Actual',
    at: 'en',
    kpiExp: 'Años de Exp.',
    kpiOptimization: 'Optimización Data',
    kpiSources: 'Fuentes AWS',
    securityInfra: 'Infra & Seguridad',
    spaOptimized: '(SPA Opt.)',
    architectureModal: {
      title: 'Reporte de Arquitectura Cloud & Hardening',
      subtitle: 'Estatus: Producción / Certificación de Seguridad Nivel A+',
      close: 'Cerrar Reporte',
      sections: [
        {
          title: '1. Networking & Edge (AWS Amplify/CloudFront)',
          icon: '☁️',
          content: 'Implementación de aceleración global mediante la red de borde de Amazon CloudFront. Resolución de dominio raíz (Apex Domain) configurada con registros Tipo A balanceados hacia IPs de AWS, eliminando la latencia de redirecciones CNAME tradicionales.'
        },
        {
          title: '2. Security Hardening (Defense in Depth)',
          icon: '🛡️',
          content: 'Estrategia de seguridad en profundidad. HSTS forzado con precarga para mitigar SSL Stripping. CSP (Content Security Policy) estricta para prevención de XSS. Directivas X-Frame-Options: DENY anti-clickjacking y registros CAA en DNS para restringir la emisión de certificados a Amazon Trust Services.'
        },
        {
          title: '3. FinOps & Observabilidad',
          icon: '💰',
          content: 'Arquitectura optimizada para Free Tier Resilience. Monitoreo activo con AWS Budgets (Alarmas al 85% y 100% de pronóstico). Decisión arquitectónica de sustituir WAF (costoso) por Hardening de Headers nivel A, balanceando seguridad perimetral y eficiencia de costos.'
        }
      ]
    }
  },
  en: {
    totalExperience: 'Total Experience',
    years: 'years',
    techStack: 'Tech Stack & Expertise',
    experienceHighlights: 'Experience Highlights',
    downloadCV: 'Download CV',
    switchToData: 'View Source Code & Architecture',
    switchToFrontend: 'View Visual Design',
    architectureView: 'Software Architecture & Source Code',
    jsonDesc: 'Technical deep-dive: Domain models, reactive state management, and structured professional data.',
    current: 'Current',
    at: 'at',
    kpiExp: 'Years of Exp.',
    kpiOptimization: 'Data Optimization',
    kpiSources: 'AWS Sources',
    securityInfra: 'Infra & Security',
    spaOptimized: '(SPA Opt.)',
    architectureModal: {
      title: 'Cloud Architecture & Hardening Report',
      subtitle: 'Status: Production / Security Grade A+',
      close: 'Close Report',
      sections: [
        {
          title: '1. Networking & Edge (AWS Amplify/CloudFront)',
          icon: '☁️',
          content: 'Global acceleration via Amazon CloudFront edge network. Apex Domain resolution implemented with load-balanced Type A records pointing to AWS IPs, eliminating latency from traditional CNAME redirects.'
        },
        {
          title: '2. Security Hardening (Defense in Depth)',
          icon: '🛡️',
          content: 'Defense in Depth strategy. HSTS forced with preload to mitigate SSL Stripping. Strict CSP (Content Security Policy) for XSS prevention. X-Frame-Options: DENY directives against clickjacking and DNS CAA records to restrict certificate issuance to Amazon Trust Services only.'
        },
        {
          title: '3. FinOps & Observability',
          icon: '💰',
          content: 'Architecture optimized for Free Tier Resilience. Active monitoring with AWS Budgets (85% warning / 100% forecast alarms). Architectural decision to replace costly WAF with Grade A Header Hardening, balancing perimeter security with cost efficiency.'
        }
      ]
    }
  }
};

export type UiLabels = typeof UI_LABELS.en;
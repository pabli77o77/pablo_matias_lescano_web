**Proyecto:** Web Pablo Matías Lescano
**Rol Auditor:** Lead Software Auditor
**Fecha:** 28 de Enero, 2026
**Estado General:** Producion-Ready / Alta Fidelidad Técnica

---

## 1. Arquitectura de Software
Se ha implementado una arquitectura basada en **Domain-Driven Design (DDD)** simplificado para Angular, garantizando la separación de la lógica de negocio de la infraestructura y la presentación.

### Estructura de Directorios (Tree)
```text
src/app/
├── core/                 # Infraestructura y Estado Global (Singleton Services)
│   ├── constants/        # Snippets de código y configuraciones estáticas
│   ├── i18n/             # Internacionalización (UI_LABELS ES/EN)
│   ├── icons/            # Sistema de iconografía SVG inline
│   ├── services/         # AnalyticsService (GA4), ProfileService (HTTP)
│   └── store/            # ProfileStore (State Management con Angular Signals)
├── domain/               # Lógica de Negocio Pura (Agnóstica del Framework)
│   ├── mappers/          # Transformación de DTOs a ViewModels (ProfileMapper)
│   └── models/           # Definición de Interfaces y Contratos de Datos
├── features/             # Módulos de Usuario (Smart & Dumb Components)
│   └── profile/          # Contenedor principal del perfil
│       └── components/   # Presentational: DataView, TechStack, Timeline
└── shared/               # Recursos comunes (Pipes, Directivas, UI Components)
```

---

## 2. Estado del Data Layer
Los datos profesionales han sido extraídos a archivos JSON localizados, permitiendo una actualización ágil del contenido sin modificar el código fuente. Se han unificado los hitos estratégicos de las experiencias clave.

### Fragmento: `public/data/cv-data-es.json` (Hitos de Impacto)
```json
{
  "experience": [
    {
      "company": "Stack Overflight",
      "metrics": [
        "Liderazgo técnico de un squad distribuido de 4 desarrolladores, estableciendo estándares de ingeniería (Code Reviews, GitFlow) que aceleraron la velocidad de entrega del equipo de Data.",
        "Arquitectura de Datos Cloud (AWS): Diseño e implementación de una solución Serverless (Lambda, EventBridge, S3) bajo patrón Medallion, orquestando la ingesta de +95 fuentes de datos críticas.",
        "Ingeniería de Performance: Optimización masiva del 95% en tiempos de respuesta para reportes analíticos sobre volúmenes de +6.8M de registros."
      ]
    },
    {
      "company": "Newshore (FLYR)",
      "metrics": [
        "Escalabilidad de Misión Crítica: Implementación de patrones asíncronos CQRS con MediatR para gestionar flujos de reserva de alta concurrencia en motores de aerolíneas globales.",
        "Modernización Estratégica: Liderazgo en el desacople de sistemas legacy hacia una arquitectura Angular SPA modular."
      ]
    }
  ]
}
```

---

## 3. Lógica de Mappers (Domain Layer)
La clase `ProfileMapper` centraliza la lógica de transformación. Destaca el algoritmo de cálculo de antigüedad que prioriza el ADN de ingeniería sobre cálculos manuales propensos a errores.

```typescript
export class ProfileMapper {
  static mapToViewModel(raw: UserProfile): UserProfileViewModel {
    return {
      ...raw,
      experience: raw.experience.map(exp => this.mapExperience(exp)),
      totalExperienceYears: this.calculateTotalYears(raw)
    };
  }

  private static calculateTotalYears(profile: UserProfile): number {
    // Prioridad 1: Fecha de inicio de carrera explícita (Seniority Real)
    if (profile.personal_info.career_start) {
      const start = new Date(profile.personal_info.career_start).getTime();
      const diff = Date.now() - start;
      return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    }
    // Prioridad 2: Cálculo basado en la experiencia más antigua listada
    if (!profile.experience.length) return 0;
    const dates = profile.experience.map(e => new Date(e.period.start).getTime());
    return Math.floor((Date.now() - Math.min(...dates)) / (1000 * 60 * 60 * 24 * 365.25));
  }
}
```

---

## 4. Configuración de Angular 18
El proyecto utiliza las últimas capacidades del framework para maximizar la performance y mantenibilidad.

- **Versión:** Angular 18.2.x.
- **Standalone Components:** 100%. Eliminación total de `NgModules` para un bundle más ligero.
- **Angular Signals:** Gestión de estado reactiva y granular en el `ProfileStore`. Implementación de `signal`, `computed` y `effect`.
- **Control Flow Syntax:** Uso de `@if`, `@for` y `@switch` en lugar de directivas estructurales antiguas.
- **Detección de Cambios:** Optimizada mediante la gestión de estado con Signals, minimizando el impacto de `Zone.js`.

---

## 5. Implementación de Analíticas (GA4)
Se ha integrado un servicio de analíticas (`AnalyticsService`) desacoplado y diseñado para escalabilidad, con eventos de negocio específicos.

-   **SSR Safe:** Uso estricto de `isPlatformBrowser`.
-   **Zero Any:** Definición de interfaces estrictas para `AnalyticsEvent`.
-   **Business Events:**
    -   `track_cv_download`: Conversión crítica (PDF ES/EN).
    -   `track_tech_interaction`: Interés en stacks específicos.
    -   `track_external_link`: Redirección a LinkedIn/GitHub/Email.
    -   `view_mode_toggle`: Preferencia de usuario (Frontend vs Data).
-   **Reactive Integration:** Uso de `Angular Effects` en `ProfileComponent` para disparar eventos de navegación y cambio de vista automáticamente al mutar el estado.

---

## 6. Checklist de Pendientes (Status TODO.md)

| Tarea | Estado | Veredicto |
| :--- | :--- | :--- |
| Configuración de Jest & Entorno de Tests | ✅ **OK** | 38 tests pasando exitosamente. |
| Implementación de ProfileStore con Signals | ✅ **OK** | Estado centralizado y persistente. |
| Refactor Visual Premium (Bento Grid) | ✅ **OK** | Estética High-Tech con Electric Blue. |
| Sistema de Internacionalización (ES/EN) | ✅ **OK** | Dinámico y aplicado a toda la UI. |
| "Architect Notes" en Vista de Código | ✅ **OK** | Contexto técnico estratégico inyectado. |
| Optimización Mobile & UX | ✅ **OK** | Jerarquía re-ordenada y layout adaptable. |
| Implementación Analytics (GA4) | ✅ **OK** | Servicio finalizado con eventos de negocio. |
| Limpieza de Assets & PDF Correcto | ✅ **OK** | CV en español actualizado a versión FE. |

**Notas Finales del Auditor:**
El código fuente en sí mismo actúa como una prueba técnica de seniority. La implementación de la vista dual (UI/Data) y las notas de arquitectura demuestran una capacidad de comunicación técnica excepcional para un Tech Lead. **Proyecto aprobado para despliegue.**

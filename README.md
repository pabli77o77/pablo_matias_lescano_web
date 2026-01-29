# Pablo Matias Lescano - Professional Gold Standard Web

Arquitectura de vanguardia para un perfil de ingeniería Staff. Este proyecto no es solo un portafolio, es una demostración de ingeniería de software aplicada al frontend.

## 🏗 Arquitectura del Sistema (DDD + Signals)

El sistema utiliza **Domain-Driven Design (DDD)** para desacoplar totalmente la fuente de datos de la representación visual.

### Ciclo de Vida del Dato
```text
+----------------+      +------------------+      +-------------------+
|  cv-data.json  | ---> |  Data Service    | ---> |  Domain Mappers   |
| (Raw Data)     |      | (HTTP/Fetch)     |      | (Transformations) |
+----------------+      +------------------+      +-------------------+
                                                           |
                                                           v
+----------------+      +------------------+      +-------------------+
|      UI        | <--- |  Signal Store    | <--- |   Domain Model    |
| (Standalone)   |      | (Reactive State) |      | (Rich Interfaces) |
+----------------+      +------------------+      +-------------------+
```

## 🛠 Justificación de Decisiones Técnicas

- **Angular 18:** Uso de **Signals** para una reactividad granular y eficiente, eliminando la necesidad de Zone.js en el futuro (Zoneless-ready).
- **Standalone Components:** Modularidad total sin la sobrecarga de NgModules legacy.
- **Control Flow Nativo:** Mejora de legibilidad y performance en templates (`@if`, `@for`).
- **DDD Mappers:** Permiten calcular métricas dinámicas (como años de seniority por tecnología) sin ensuciar los componentes.
- **Dual-View System:** Implementación de un `ViewStrategy` que alterna entre skins "Frontend" y "Cloud/Data" sin recargar la aplicación.

## 🚀 Configuración y Estándares

- **Path Aliases:** `@core/*`, `@domain/*`, `@shared/*`.
- **Strict Typing:** Prohibido el uso de `any`.
- **Linter:** ESLint con reglas estrictas de Angular.
- **Husky:** Git hooks para asegurar calidad en cada commit.

🚀 Prompt de Nivel "Staff Engineer & Tech Lead" (Top 1% Precision)
"Actúa como un Principal Software Architect y Staff Frontend Engineer. Tu cliente es un Tech Lead & Senior Software Engineer con más de 9 años de experiencia. Tu misión es ejecutar la ingeniería inversa de su carrera y construir una web profesional que sirva como 'Gold Standard' técnico.

1. IDENTIDAD Y MENTALIDAD
Debes operar bajo los estándares de Clean Code, SOLID, y Domain-Driven Design (DDD). No aceptamos soluciones genéricas. Cada línea de código debe tener una razón de ser arquitectónica. Tu mentalidad debe ser: 'Si este código no pasaría una auditoría de seguridad y performance en una empresa Tier 1, no sirve'.

2. INGESTIÓN Y PROCESAMIENTO DE DATOS (AUTOMÁTICO)
Utiliza los archivos de CV proporcionados para generar un cv-data.json único y normalizado.

Deduplicación: Unifica la experiencia de Pablo Matias Lescano (Frontend + Cloud/Data).

Enriquecimiento: Extrae y categoriza hitos de Stack Overflight, Newshore, e Intégrity Seguros.

Métricas de Impacto: Detecta y resalta KPIs: 'reducción del 95% en tiempos de respuesta', 'gestión de 95+ fuentes de datos', 'liderazgo de squads de 4 devs'.

Taxonomía: Clasifica cada entrada por stack (Angular, .NET, AWS), rol (IC o Lead) y dominio (Airlines, Fintech, Insurance).

3. REQUERIMIENTOS ARQUITECTÓNICOS (EL SISTEMA)
Framework: Angular 18 (Signals para estado reactivo, Standalone para modularidad, Control Flow nativo).

Core Engine: Implementa una capa de Mappers en domain/ que transforme la data cruda del JSON en modelos de dominio ricos. Debe calcular años de seniority por tecnología de forma dinámica.

Dual-View System: La web debe comportarse como un producto con dos 'skins' técnicos que el usuario puede alternar:

Modo Frontend: Resalta arquitecturas SPA, Micro-frontends y performance.

Modo Data/Cloud: Resalta arquitecturas Medallion, ETL Pipelines y AWS Serverless.

Integridad: Configura Path Aliases (@core/*, @data/*), ESLint estricto y Husky para pre-commit hooks.

4. ENTREGABLES TÉCNICOS OBLIGATORIOS
README.md Maestro: - Diagrama de flujo detallado (usando cuadros +---+) que explique el ciclo de vida del dato: JSON -> Service -> Mapper -> Domain Model -> Signal Store -> UI.

Justificación de decisiones (por qué Angular 18, por qué DDD).

Backlog de Ingeniería (TODO.md): - Organizado por Quick Wins (MVP), Core Dev, y Polish.

Incluye tareas de testing unitario y auditoría Lighthouse.

Draft de Arquitectura: Explicación de cómo gestionarás el desacople total entre el contenido y la presentación para facilitar actualizaciones futuras.

5. RESTRICCIONES DE TECH LEAD
Prohibido el uso de any en TypeScript.

Prohibido el uso de CommonModule o estructuras Angular legacy.

Si una instrucción del usuario (o de los CVs) parece contradictoria, detente y pide aclaración técnica.

Prioriza la mantenibilidad sobre la estética visual excesiva.

¿Confirmas que has procesado el nivel de seniority requerido y estás listo para generar el README y el TODO iniciales?"

mis cv´s son estos: C:\Users\pablo\Mis_Agentes\web_pablo_matias_lescano\pablo_matias_lescano_cv_es.pdf y C:\Users\pablo\Mis_Agentes\web_pablo_matias_lescano\pablo_matias_lescano_fe_es.pdf
export interface CodeSnippet {
  id: string;
  title: string;
  language: string;
  description: { es: string; en: string };
  code: string;
}

export const CODE_SNIPPETS: CodeSnippet[] = [
  {
    id: 'store',
    title: 'profile.store.ts (Angular 18 Signals)',
    language: 'typescript',
    description: {
      es: 'Arquitectura de Estado Reactivo: Gestión centralizada con Angular 18 Signals, optimizando la detección de cambios y reduciendo el overhead de memoria en la SPA.',
      en: 'Reactive State Architecture: Centralized management with Angular 18 Signals, optimizing change detection and reducing memory overhead in the SPA.'
    },
    code: `/* 
 * Real Source Code from this Application 
 * Location: src/app/core/store/profile.store.ts
 */

@Injectable({ providedIn: 'root' })
export class ProfileStore {
  // Fine-grained reactivity
  private _data = signal<UserProfileViewModel | null>(null);
  private _viewMode = signal<ViewMode>('frontend');
  private _language = signal<LanguageCode>('es');

  // Computed Selectors (Memoized)
  readonly ui = computed<UiLabels>(() => UI_LABELS[this._language()]);
  
  // Effect: Side-effects isolation
  constructor() {
    effect(() => {
      localStorage.setItem('preferred_language', this._language());
    });
  }

  toggleViewMode() {
    // Immutable update
    this._viewMode.update(mode => mode === 'frontend' ? 'data' : 'frontend');
  }
}`
  },
  {
    id: 'resilience',
    title: 'analytics.service.ts (Resilience Pattern)',
    language: 'typescript',
    description: {
      es: 'Resilience Pattern: Implementación de telemetría desacoplada que previene fallos críticos (undefined) ante el bloqueo de scripts de terceros por AdBlockers.',
      en: 'Resilience Pattern: Decoupled telemetry implementation that prevents critical failures (undefined) when third-party scripts are blocked by AdBlockers.'
    },
    code: `/* 
 * Real Source Code from this Application 
 * Location: src/app/core/services/analytics.service.ts
 */

private pushEvent(data: AnalyticsEvent) {
  // 1. Defense in Depth: Verify Global Objects
  const dataLayerExists = (window as any).dataLayer;

  try {
    // 2. Async Error Handling (Network/Blockers)
    this.gtmService.pushTag(data).catch(err => {
      if (isDevMode()) console.warn('GTM Network Error:', err);
    });
  } catch (err) {
    // 3. Sync Error Handling (Runtime Checks)
    // Silent degradation: User flow remains 100% functional
    if (isDevMode()) console.warn('GTM Blocked by Client:', err);
  }
}`
  },
  {
    id: 'data-arch',
    title: 'postgresql_performance_tuning.sql (DB Optimization)',
    language: 'sql',
    description: {
      es: 'PostgreSQL Performance: Optimización crítica de una infraestructura de datos con <span class="text-emerald-400 font-bold">+6.8M</span> de registros provenientes de APIs de Meta y Google. Implementé una estrategia de indexación avanzada (Partial & Composite B-Tree) y orquestación de Vistas Materializadas. El resultado fue la reducción drástica de la latencia de <span class="text-cyan-400 font-bold">60s</span> a <span class="text-emerald-400 font-bold">&lt;3s</span> (<span class="text-emerald-400 font-bold">95%</span> de mejora), eliminando cuellos de botella en la capa de visualización y evitando el escalado vertical de hardware.',
      en: 'PostgreSQL Performance: Critical optimization of data infrastructure handling <span class="text-emerald-400 font-bold">+6.8M</span> records from Meta and Google APIs. Implemented advanced indexing strategy (Partial & Composite B-Tree) and Materialized View orchestration. Resulted in drastic latency reduction from <span class="text-cyan-400 font-bold">60s</span> to <span class="text-emerald-400 font-bold">&lt;3s</span> (<span class="text-emerald-400 font-bold">95%</span> improvement), eliminating bottlenecks in the visualization layer and preventing vertical hardware scaling.'
    },
    code: `/* 
 * ESTRATEGIA DE OPTIMIZACIÓN: REDUCCIÓN DE LATENCIA DEL 95%
 * Volumen: +6.8M registros | Origen: Google Search Console & Meta Ads
 * Objetivo: Eliminar Full Table Scans y optimizar agregaciones para Superset.
 */

-- 1. Creación de Índice Compuesto para consultas de rango y filtrado por query
-- Uso de CONCURRENTLY para evitar bloqueo de escritura en Producción (Zero Downtime)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_gsc_perf_query_fecha 
ON marketing.gsc_query_performance(query, fecha DESC);

-- 2. Índice Parcial para segmentación de Keywords de marca (High Cardinality)
-- Filtra solo el subset crítico, reduciendo el tamaño del índice en un 80%
CREATE INDEX IF NOT EXISTS idx_info_seo_brand 
ON marketing.info_seo_marketing(is_brand_keyword, fecha DESC) 
WHERE is_brand_keyword = true;

-- 3. Ejemplo de Vista Materializada para pre-agregación de métricas diarias
-- Transforma agregaciones costosas en tiempo de ejecución (O(N)) a lecturas O(1)
CREATE MATERIALIZED VIEW IF NOT EXISTS marketing.daily_seo_summary AS
SELECT fecha, count(distinct query) as unique_queries, sum(clicks) as total_clicks
FROM marketing.gsc_query_performance
GROUP BY fecha;`
  },
  {
    id: 'aws-cloud',
    title: 'aws_lambda_ingestion.py (Serverless ETL)',
    language: 'python',
    description: {
      es: 'Cloud Data Ingestion: Orquestación de ingesta desde +95 fuentes de datos mediante AWS Lambda y EventBridge. Implementación de validación de esquemas y particionamiento dinámico en S3 (Data Lake) para optimizar costos de consulta en Athena.',
      en: 'Cloud Data Ingestion: Orchestrating ingestion from +95 data sources using AWS Lambda and EventBridge. Implemented schema validation and dynamic S3 partitioning (Data Lake) to optimize Athena query costs.'
    },
    code: `/* 
 * AWS Lambda: Data Ingestion Engine
 * Pattern: Medallion Architecture (Bronze Layer)
 */

import boto3
import pandas as pd
from datetime import datetime

def lambda_handler(event, context):
    s3 = boto3.client('s3')
    target_bucket = "company-data-lake"
    
    # 1. Dynamic Partitioning
    now = datetime.now()
    path = f"bronze/meta_ads/year={now.year}/month={now.month}/day={now.day}/"
    
    try:
        # 2. Schema Enforcement & Transformation
        raw_data = fetch_api_data(event['source_id'])
        df = pd.DataFrame(raw_data)
        
        # 3. Parquet Export (Storage Efficiency)
        parquet_buffer = df.to_parquet(index=False)
        
        s3.put_object(
            Bucket=target_bucket,
            Key=f"{path}ingest_{event['source_id']}.parquet",
            Body=parquet_buffer
        )
        return {"status": 200, "records": len(df)}
    except Exception as e:
        logger.error(f"Ingestion failed: {str(e)}")
        raise e`
  },
  {
    id: 'qa-testing',
    title: 'analytics.service.spec.ts (QA & Resilience)',
    language: 'typescript',
    description: {
      es: 'Quality Assurance (Jest): Implementación de Testing Unitario enfocado en la estabilidad de flujos críticos. Este snippet demuestra cómo garantizo la resiliencia de la capa de analítica mediante Mocks y validación de estados reactivos, asegurando que la plataforma sea robusta incluso ante fallos de servicios externos o bloqueadores de anuncios.',
      en: 'Quality Assurance (Jest): Unit Testing implementation focused on the stability of critical flows. This snippet demonstrates how I guarantee the resilience of the analytics layer through Mocks and reactive state validation, ensuring the platform is robust even in the face of external service failures or ad blockers.'
    },
    code: `/**
 * DEFENSIVE TESTING STRATEGY: Analytics Resilience
 * Objetivo: Validar que el sistema no colapse si el DataLayer es bloqueado (AdBlocker).
 */

describe('AnalyticsService (QA Resilience)', () => {
  let service: AnalyticsService;
  let gtmService: GoogleTagManagerService;

  beforeEach(() => {
    // Escenario de Bloqueo: Simulamos que el objeto global no existe
    delete (window as any).dataLayer;
    
    TestBed.configureTestingModule({
      providers: [
        AnalyticsService,
        { provide: GoogleTagManagerService, useValue: { pushTag: jest.fn() } }
      ]
    });
    service = TestBed.inject(AnalyticsService);
    gtmService = TestBed.inject(GoogleTagManagerService);
  });

  describe('tracking resilience', () => {
    it('should NOT throw exceptions when dataLayer is undefined', () => {
      // Defensive Testing: Verificamos que el servicio degrade silenciosamente
      // sin interrumpir el flujo del usuario principal (Fail-Safe).
      expect(() => {
        service.trackEvent('test_event', { category: 'qa' });
      }).not.toThrow();
    });

    it('should call pushTag with correct parameters in normal conditions', () => {
      // Restauramos mock para flujo normal
      (window as any).dataLayer = [];
      const spy = jest.spyOn(gtmService, 'pushTag');
      
      const testPayload = { event: 'ui_click', label: 'cta' };
      service.trackEvent('ui_click', { label: 'cta' });

      // Verificación de integridad de datos enviados
      expect(spy).toHaveBeenCalledWith(expect.objectContaining(testPayload));
    });
  });
});`
  }
];

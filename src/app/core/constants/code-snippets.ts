export interface CodeSnippet {
  id: string;
  title: string;
  language: string;
  description: string;
  code: string;
}

export const CODE_SNIPPETS: CodeSnippet[] = [
  {
    id: 'store',
    title: 'profile.store.ts (Reactive State Management)',
    language: 'typescript',
    description: 'Implementación real del Store de esta aplicación usando Angular Signals. Maneja estado de carga, errores, persistencia de idioma y lógica de vista dual.',
    code: `/* 
 * Real Source Code from this Application 
 * Location: src/app/core/store/profile.store.ts
 */

@Injectable({ providedIn: 'root' })
export class ProfileStore {
  private profileService = inject(ProfileService);
  private state = signal<ProfileState>(initialState);

  // Computed Selectors (Memoized)
  readonly data = computed(() => this.state().data);
  readonly isLoading = computed(() => this.state().isLoading);
  readonly viewMode = computed(() => this.state().viewMode);
  readonly ui = computed<UiLabels>(() => UI_LABELS[this.state().language]);

  constructor() {
    this.loadProfile();
  }

  setLanguage(lang: Language) {
    if (this.state().language === lang) return;
    try {
      localStorage.setItem('preferred_language', lang);
    } catch { }
    this.state.update(s => ({ ...s, language: lang }));
    this.loadProfile();
  }
}`
  },
  {
    id: 'medallion',
    title: 'medallion-pipeline.py (Cloud & Data)',
    language: 'python',
    description: 'Pipeline de datos en AWS Lambda para procesar ingesta raw a capas refinadas.',
    code: `def process_bronze_to_silver(event, context):
    """
    Transición Bronze -> Silver: De-duplicación y validación de esquema.
    Arquitectura idempotente para re-proceso seguro.
    """
    try:
        s3_bucket = event['Records'][0]['s3']['bucket']['name']
        s3_key = event['Records'][0]['s3']['object']['key']
        
        # Lectura eficiente con Pandas (Chunking para bajo consumo de RAM)
        df_raw = read_s3_csv(s3_bucket, s3_key)
        
        # Lógica de Negocio: Limpieza y Estandarización
        df_clean = df_raw.drop_duplicates(subset=['transaction_id'])
        df_clean['processed_at'] = datetime.utcnow()
        
        # Escritura en capa Silver (Parquet/Snappy para optimizar consultas en Athena)
        write_to_silver(df_clean, partition_cols=['date'])
        
        return { 'status': 200, 'rows_processed': len(df_clean) }
        
    except Exception as e:
        log_error(f"Pipeline Failed: {str(e)}")
        raise e  # Trigger Dead Letter Queue (DLQ)`
  },
  {
    id: 'rxjs',
    title: 'analytics.service.ts (RxJS Streams)',
    language: 'typescript',
    description: 'Uso estratégico de RxJS para el manejo de flujos de eventos asíncronos (Router). Mientras Signals gestiona el estado de la UI, RxJS sigue siendo el rey para filtrar y suscribirse a eventos del sistema.',
    code: `/* 
 * Real Source Code from this Application 
 * Location: src/app/core/services/analytics.service.ts
 */

private trackPageViews() {
  // RxJS Pipeable Operators para filtrar el flujo de navegación
  this.router.events.pipe(
    filter(event => event instanceof NavigationEnd)
  ).subscribe((event: any) => {
    
    // Integración con Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'page_view', {
        page_path: event.urlAfterRedirects
      });
    }
  });
}`
  },
  {
    id: 'mapper',
    title: 'profile.mapper.ts (Domain Logic)',
    language: 'typescript',
    description: 'Lógica pura de transformación de datos. Calcula la antigüedad total basándose en el inicio de carrera y formatea duraciones (ej. "3 años, 2 meses") sin ensuciar la vista.',
    code: `/* 
 * Real Source Code from this Application 
 * Location: src/app/domain/mappers/profile.mapper.ts
 */

export class ProfileMapper {
  static mapToViewModel(raw: UserProfile): UserProfileViewModel {
    return {
      ...raw,
      experience: raw.experience.map(exp => this.mapExperience(exp)),
      totalExperienceYears: this.calculateTotalYears(raw)
    };
  }

  private static calculateTotalYears(profile: UserProfile): number {
    // Prioridad: Fecha de inicio de carrera explícita
    if (profile.personal_info.career_start) {
      const start = new Date(profile.personal_info.career_start).getTime();
      const diff = Date.now() - start;
      return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    }
    return 0; // Fallback
  }
}`
  }
];

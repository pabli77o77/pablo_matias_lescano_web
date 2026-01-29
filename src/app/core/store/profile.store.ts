import { Injectable, computed, inject, signal } from '@angular/core';
import { ProfileService } from '@core/services/profile.service';
import { UserProfileViewModel, ProfileMapper } from '@domain/mappers/profile.mapper';
import { UI_LABELS, UiLabels } from '@core/i18n/ui-labels';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

export type LanguageCode = 'es' | 'en';
export type ViewMode = 'frontend' | 'data';

@Injectable({
  providedIn: 'root'
})
export class ProfileStore {
  private profileService = inject(ProfileService);

  // State Signals
  private _data = signal<UserProfileViewModel | null>(null);
  private _isLoading = signal<boolean>(false);
  private _error = signal<string | null>(null);
  private _language = signal<LanguageCode>('es');
  private _viewMode = signal<ViewMode>('frontend');

  // Read-only Signals
  readonly data = this._data.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly language = this._language.asReadonly();
  readonly viewMode = this._viewMode.asReadonly();

  // Computed Selectors
  readonly personalInfo = computed(() => this._data()?.personal_info);
  readonly skills = computed(() => this._data()?.skills);
  readonly ui = computed<UiLabels>(() => UI_LABELS[this._language()]);

  constructor() {
    this.initFromLocalStorage();
    this.loadProfile();
  }

  loadProfile() {
    this._isLoading.set(true);
    this._error.set(null);

    this.profileService.getProfile(this._language())
      .pipe(
        finalize(() => this._isLoading.set(false)),
        catchError(err => {
          console.error('Error loading profile', err);
          this._error.set('No se pudo cargar el perfil profesional.');
          return of(null);
        })
      )
      .subscribe({
        next: (profile) => {
          if (profile) {
            this._data.set(ProfileMapper.mapToViewModel(profile));
          }
        }
      });
  }

  setLanguage(lang: LanguageCode) {
    if (this._language() === lang) return;

    this._language.set(lang);
    this.saveToLocalStorage('preferred_language', lang);
    this.loadProfile();
  }

  toggleViewMode() {
    const newMode = this._viewMode() === 'frontend' ? 'data' : 'frontend';
    this._viewMode.set(newMode);
    this.saveToLocalStorage('preferred_view_mode', newMode);
  }

  private initFromLocalStorage() {
    try {
      const savedLang = localStorage.getItem('preferred_language') as LanguageCode;
      if (savedLang && (savedLang === 'es' || savedLang === 'en')) {
        this._language.set(savedLang);
      }

      const savedViewMode = localStorage.getItem('preferred_view_mode') as ViewMode;
      if (savedViewMode && (savedViewMode === 'frontend' || savedViewMode === 'data')) {
        this._viewMode.set(savedViewMode);
      }
    } catch (e) {
      // Ignorar errores de localStorage (ej: acceso denegado)
    }
  }

  private saveToLocalStorage(key: string, value: string) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn('Could not save language preference'); // Mensaje específico del test 'should handle localStorage errors gracefully'
    }
  }
}

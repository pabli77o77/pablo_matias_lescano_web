import { Component, Input, computed, signal, inject, isDevMode } from '@angular/core';
import { JsonPipe, UpperCasePipe, NgClass } from '@angular/common';
import { CODE_SNIPPETS } from '@core/constants/code-snippets';
import { ProfileStore } from '@core/store/profile.store';
import { AnalyticsService } from '@core/services/analytics.service';

@Component({
  selector: 'app-data-view',
  standalone: true,
  imports: [JsonPipe, UpperCasePipe, NgClass],
  templateUrl: './data-view.component.html',
  styleUrl: './data-view.component.scss'
})
export class DataViewComponent {
  private store = inject(ProfileStore);
  private analytics = inject(AnalyticsService);
  @Input({ required: true }) data: any;

  snippets = CODE_SNIPPETS;

  // Snippets categorizados para la UI
  frontendSnippets = computed(() => this.snippets.filter(s => s.category === 'frontend'));
  dataSnippets = computed(() => this.snippets.filter(s => s.category === 'cloud-data'));
  
  // Controla qué sección está expandida. Por defecto todo cerrado.
  expandedSection = signal<string>('');
  
  // Controla el estado del botón de copiar (feedback visual)
  copyState = signal<'idle' | 'copied'>('idle');

  formattedData = computed(() => {
    return JSON.stringify(this.data, null, 2);
  });

  // Selector de idioma reactivo
  currentLang = this.store.language;

  // Labels de categorías
  categoryLabels = computed(() => {
    return this.currentLang() === 'es' ? {
      frontend: 'Frontend & App Architecture',
      data: 'Cloud & Data Engineering'
    } : {
      frontend: 'Frontend & App Architecture',
      data: 'Cloud & Data Engineering'
    };
  });

  jsonProfileDescription = computed(() => {
    return this.currentLang() === 'es' 
      ? 'Data Schema: Estructura de dominio extensible que sirve como fuente de verdad única para la renderización dinámica de toda la plataforma.'
      : 'Data Schema: Extensible domain structure serving as the single source of truth for the dynamic rendering of the entire platform.';
  });

  // Textos de UI Localizados
  ui = computed(() => {
    const lang = this.currentLang();
    return lang === 'es' ? {
      copy: 'Copiar Concepto',
      copied: 'Copiado',
      noteLabel: 'Nota de Arquitecto'
    } : {
      copy: 'Copy Concept',
      copied: 'Copied',
      noteLabel: 'Architect Note'
    };
  });

  toggleSection(id: string) {
    if (this.expandedSection() === id) {
      this.expandedSection.set('');
    } else {
      this.expandedSection.set(id);
      this.trackSnippetView(id);
    }
  }

  private trackSnippetView(id: string) {
    // Localizar el snippet para extraer metadatos
    const snippet = this.snippets.find(s => s.id === id);
    
    // El ID 'json-profile' es un caso especial fuera del array de snippets
    if (id === 'json-profile') {
      this.analytics.trackEvent('view_code_snippet', {
        snippet_name: 'pablo_lescano_profile.json',
        snippet_category: 'General',
        snippet_language: 'json'
      });
      return;
    }

    if (snippet) {
      this.analytics.trackEvent('view_code_snippet', {
        snippet_name: snippet.title,
        snippet_category: snippet.category === 'frontend' ? 'Frontend' : 'Cloud & Data',
        snippet_language: snippet.language
      });

      if (isDevMode()) {
        console.log(`📊 Telemetría: Snippet [${snippet.title}] trackeado con éxito`);
      }
    }
  }

  getTagClass(tag: string): string {
    switch (tag) {
      case 'APP': return 'badge-app';
      case 'DATA':
      case 'DB':
      case 'CLOUD': return 'badge-data';
      case 'TEST': return 'badge-test';
      case 'CONFIG': return 'badge-config';
      default: return '';
    }
  }

  // Método helper para obtener la descripción traducida
  getDescription(snippet: any): string {
    return snippet.description[this.currentLang()] || snippet.description.en;
  }

  copyConcept(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      this.copyState.set('copied');
      setTimeout(() => this.copyState.set('idle'), 2000);
    });
  }
}

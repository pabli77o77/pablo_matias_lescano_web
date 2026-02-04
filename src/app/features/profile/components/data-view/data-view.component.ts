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

  // Estado de Tabs: 'all' | 'frontend' | 'data'
  activeTab = signal<'all' | 'frontend' | 'data'>('all');

  // Filtrado de Snippets para la UI
  filteredSnippets = computed(() => {
    const filter = this.activeTab();
    if (filter === 'all') return this.snippets;
    
    return this.snippets.filter(s => {
      if (filter === 'frontend') {
        return ['store', 'resilience', 'qa-testing'].includes(s.id);
      }
      if (filter === 'data') {
        return ['data-arch', 'aws-cloud'].includes(s.id);
      }
      return true;
    });
  });

  // Estado de expansión de los acordeones
  expandedSection = signal<string>('');
  
  // Feedback visual de copiado
  copyState = signal<'idle' | 'copied'>('idle');

  formattedData = computed(() => {
    return JSON.stringify(this.data, null, 2);
  });

  currentLang = this.store.language;

  // Descripciones localizadas
  jsonProfileDescription = computed(() => {
    return this.currentLang() === 'es' 
      ? 'Data Schema: Estructura de dominio extensible que sirve como fuente de verdad única para la renderización dinámica de toda la plataforma.'
      : 'Data Schema: Extensible domain structure serving as the single source of truth for the dynamic rendering of the entire platform.';
  });

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

  // Acciones
  setTab(tab: 'all' | 'frontend' | 'data') {
    this.activeTab.set(tab);
    this.expandedSection.set(''); // Cerramos cualquier snippet abierto al cambiar de pestaña
  }

  toggleSection(id: string) {
    if (this.expandedSection() === id) {
      this.expandedSection.set('');
    } else {
      this.expandedSection.set(id);
      this.trackSnippetView(id);
    }
  }

  private trackSnippetView(id: string) {
    const snippet = this.snippets.find(s => s.id === id);
    
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

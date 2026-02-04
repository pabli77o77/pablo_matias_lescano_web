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

  // ... (previous computed signals)

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

  // ... (rest of the class)

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
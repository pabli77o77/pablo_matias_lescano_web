import { Component, inject, effect, computed } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ProfileStore } from '@core/store/profile.store';
import { AnalyticsService } from '@core/services/analytics.service';
import { JsonPipe } from '@angular/common';
import { ExperienceTimelineComponent } from './components/experience-timeline/experience-timeline.component';
import { TechStackComponent } from './components/tech-stack/tech-stack.component';
import { DataViewComponent } from './components/data-view/data-view.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [JsonPipe, ExperienceTimelineComponent, TechStackComponent, DataViewComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  readonly store = inject(ProfileStore);
  private titleService = inject(Title);
  private analytics = inject(AnalyticsService);

  // Nombre limpio para el archivo descargado
  cvFileName = computed(() => {
    return this.store.language() === 'en' 
      ? 'CV_Pablo_Lescano_Tech_Lead_EN.pdf' 
      : 'CV_Pablo_Lescano_Tech_Lead_ES.pdf';
  });

  // URL del CV dinámica basada en el idioma actual
  cvUrl = computed(() => {
    const lang = this.store.language();
    return lang === 'en' 
      ? '/assets/docs/cv_pablo_lescano_en.pdf'
      : '/assets/docs/cv_pablo_lescano.pdf';
  });

  constructor() {
    // Effect 1: SEO Title Management
    effect(() => {
      const user = this.store.data();
      if (user) {
        this.titleService.setTitle(`${user.personal_info.name} | ${user.personal_info.title}`);
      } else {
        this.titleService.setTitle('Pablo Lescano - Portfolio');
      }
    });

    // Effect 2: Reactive Analytics for View Mode
    effect(() => {
      const mode = this.store.viewMode();
      // Se dispara automáticamente al cambiar la señal en el Store
      this.analytics.trackViewChange(mode);
    });
  }

  onDownloadClick() {
    // Instrumentación de analítica con la versión optimizada solicitada
    this.analytics.trackEvent('cv_download', { 
      version: '9_years_exp_data_optimized' 
    });
  }

  // Método auxiliar para el template si se quisiera trackear clicks sociales explícitos
  trackSocial(network: 'linkedin' | 'github' | 'email') {
    this.analytics.trackExternalLink(network);
  }
}

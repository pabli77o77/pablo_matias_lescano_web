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
      ? 'Pablo_Lescano_CV_English.pdf' 
      : 'Pablo_Lescano_CV_Espanol.pdf';
  });

  // URL del CV dinámica basada en el idioma actual + Cache Busting
  cvUrl = computed(() => {
    const lang = this.store.language();
    const timestamp = new Date().getTime(); // Cache busting simple
    return lang === 'en' 
      ? `docs/cv_pablo_lescano_en.pdf?t=${timestamp}`
      : `docs/cv_pablo_lescano.pdf?t=${timestamp}`;
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

  downloadCV() {
    const lang = this.store.language();
    const fileName = this.cvFileName();
    
    // Tracking específico de conversión
    this.analytics.trackCvDownload(fileName, lang);
  }

  // Método auxiliar para el template si se quisiera trackear clicks sociales explícitos
  trackSocial(network: 'linkedin' | 'github' | 'email') {
    this.analytics.trackExternalLink(network);
  }
}

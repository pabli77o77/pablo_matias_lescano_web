import { Component, inject, effect, computed } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ProfileStore } from '@core/store/profile.store';
import { AnalyticsService } from '@core/services/analytics.service';
import { ProfileService } from '@core/services/profile.service'; // Importar Service
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
  private profileService = inject(ProfileService); // Inyectar Service

  // Nombre limpio para el archivo descargado
  cvFileName = computed(() => {
    return this.store.language() === 'en' 
      ? 'Pablo_Lescano_CV_English.pdf' 
      : 'Pablo_Lescano_CV_Espanol.pdf';
  });

  // URL del CV dinámica basada en el idioma actual
  // IMPORTANTE: Ruta relativa a la raíz 'public' servida por Angular
  cvUrl = computed(() => {
    const lang = this.store.language();
    return lang === 'en' 
      ? 'docs/cv_pablo_lescano_en.pdf' // Sin barra inicial para HttpClient
      : 'docs/cv_pablo_lescano.pdf';
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
    const url = this.cvUrl();
    
    // Tracking
    this.analytics.trackCvDownload(fileName, lang);

    // Descarga Programática Robusta
    this.profileService.downloadFile(url).subscribe({
      next: (blob) => {
        // Crear un objeto URL para el blob
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(blob);
        a.href = objectUrl;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(objectUrl);
      },
      error: (err) => {
        console.error('Error crítico descargando CV:', err);
        alert('Lo siento, hubo un problema técnico descargando el PDF. Por favor intenta más tarde.');
      }
    });
  }

  // Método auxiliar para el template si se quisiera trackear clicks sociales explícitos
  trackSocial(network: 'linkedin' | 'github' | 'email') {
    this.analytics.trackExternalLink(network);
  }
}

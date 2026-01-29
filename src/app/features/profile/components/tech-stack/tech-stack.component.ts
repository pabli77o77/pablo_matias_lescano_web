import { Component, Input, inject } from '@angular/core';
import { Skills } from '@domain/models/profile.model';
import { KeyValuePipe, TitleCasePipe } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TECH_ICONS } from '@core/icons/tech-icons';

@Component({
  selector: 'app-tech-stack',
  standalone: true,
  imports: [KeyValuePipe, TitleCasePipe],
  templateUrl: './tech-stack.component.html',
  styleUrl: './tech-stack.component.scss'
})
export class TechStackComponent {
  @Input({ required: true }) skills!: Skills;
  private sanitizer = inject(DomSanitizer);

  getIcon(techName: string): SafeHtml {
    const key = techName.toLowerCase();
    let svgString = TECH_ICONS['code']; // Default

    // PRIORIDAD 1: Frontend (Para evitar que CSS3 matchee con S3)
    if (key.includes('html') || key.includes('css')) {
      svgString = TECH_ICONS['html'];
    } else if (key.includes('angular') || key.includes('rxjs') || key.includes('signals')) {
      svgString = TECH_ICONS['angular'];
    } else if (key.includes('typescript')) {
      svgString = TECH_ICONS['typescript'];
    } else if (key.includes('sass')) {
      svgString = TECH_ICONS['sass'];
    }
    // PRIORIDAD 2: Cloud & Data
    else if (key.includes('aws') || key.includes('lambda') || key === 's3' || key.includes('step functions') || key.includes('eventbridge')) {
      svgString = TECH_ICONS['aws'];
    } 
    else if (key.includes('python') || key.includes('pandas')) {
      svgString = TECH_ICONS['python'];
    } else if (key.includes('sql') || key.includes('rds') || key.includes('data')) {
      svgString = key.includes('postgre') ? TECH_ICONS['postgres'] : TECH_ICONS['database'];
    }
    // PRIORIDAD 3: Backend
    else if (key.includes('.net') || key.includes('c#') || key.includes('entity') || key.includes('api')) {
      svgString = TECH_ICONS['dotnet'];
    } else if (key.includes('backend') || key.includes('micro')) {
      svgString = TECH_ICONS['server'];
    } 
    // PRIORIDAD 4: DevOps & Tools
    else if (key.includes('docker')) {
      svgString = TECH_ICONS['docker'];
    } else if (key.includes('gitflow') || key === 'git') {
       svgString = TECH_ICONS['git'];
    } else if (key.includes('github')) {
       svgString = TECH_ICONS['github'];
    } else if (key.includes('azure')) {
       svgString = TECH_ICONS['azure'];
    } else if (key.includes('ci/cd') || key.includes('linux')) {
       svgString = TECH_ICONS['settings'];
    }
    else if (key.includes('cloud')) {
       svgString = TECH_ICONS['cloud'];
    }

    return this.sanitizer.bypassSecurityTrustHtml(svgString);
  }

  getCategoryClass(key: string): string {
    const map: Record<string, string> = {
      'cloud_data': 'bento-large',      // Cloud & Data (Grande)
      'backend': 'bento-medium',        // Backend (Mediana)
      'frontend': 'bento-medium',       // Frontend (Mediana)
      'architecture': 'bento-wide',     // Architecture (Ancha/Completa)
      'devops': 'bento-small'           // DevOps (Normal)
    };
    return map[key] || 'bento-small';
  }

  formatCategory(key: string): string {
    const map: Record<string, string> = {
      'cloud_data': 'Cloud & Data',
      'backend': 'Backend Engineering',
      'frontend': 'Modern Frontend',
      'architecture': 'Architecture Patterns',
      'devops': 'DevOps & CI/CD'
    };
    return map[key] || key;
  }
}
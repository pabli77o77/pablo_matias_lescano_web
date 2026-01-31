import { Component, inject, signal } from '@angular/core';
import { ProfileStore } from '@core/store/profile.store';
import { ArchitectureModalComponent } from '@shared/components/architecture-modal/architecture-modal.component';
import { FooterDetail } from './footer.model';

type ModalType = 'aws' | 'security' | 'mozilla';

const FOOTER_DATA: Record<ModalType, FooterDetail> = {
  aws: {
    title: 'Cloud Infrastructure',
    subtitle: 'Provider: AWS (Amazon Web Services)',
    icon: '☁️',
    description: 'Serverless architecture leverage for infinite scalability and zero-maintenance cost. Optimized for high-availability and global content delivery.',
    features: [
      { label: 'Hosting Strategy', value: 'S3 Static Website' },
      { label: 'CDN / Edge', value: 'CloudFront Distribution' },
      { label: 'Compute', value: 'Lambda Edge (Serverless)' }
    ]
  },
  security: {
    title: 'Security Hardening',
    subtitle: 'Grade A+ Certified',
    icon: '🛡️',
    description: 'Defense-in-depth strategy implementing strict browser policies and header hardening to mitigate XSS, Clickjacking, and Protocol Downgrade attacks.',
    features: [
      { label: 'SecurityHeaders.com', value: 'Grade A' },
      { label: 'XSS Protection', value: 'Strict CSP' },
      { label: 'Transport Security', value: 'HSTS Preload' }
    ]
  },
  mozilla: {
    title: 'Performance & Standards',
    subtitle: 'Mozilla Observatory Audited',
    icon: '🚀',
    description: 'Single Page Application (SPA) optimization focused on Core Web Vitals, payload reduction, and modern bundle splitting techniques.',
    features: [
      { label: 'Observatory Score', value: 'B+ (Top 5%)' },
      { label: 'SPA Strategy', value: 'Angular Signals + Lazy Loading' },
      { label: 'Lighthouse Perf.', value: '100 / 100' }
    ]
  }
};

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [ArchitectureModalComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  store = inject(ProfileStore);
  currentYear = new Date().getFullYear();
  
  // State Signal: Holds the data object or null if closed
  activeDetail = signal<FooterDetail | null>(null);

  openModal(type: string) {
    const key = type as ModalType;
    if (FOOTER_DATA[key]) {
      this.activeDetail.set(FOOTER_DATA[key]);
    }
  }

  closeModal() {
    this.activeDetail.set(null);
  }
}


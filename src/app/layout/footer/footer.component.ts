import { Component, inject, signal } from '@angular/core';
import { ProfileStore } from '@core/store/profile.store';
import { ArchitectureModalComponent } from '@shared/components/architecture-modal/architecture-modal.component';

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
  isModalOpen = signal(false);

  openModal() {
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }
}


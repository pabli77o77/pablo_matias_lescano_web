import { Component, EventEmitter, Output, inject } from '@angular/core';
import { ProfileStore } from '@core/store/profile.store';

@Component({
  selector: 'app-architecture-modal',
  standalone: true,
  templateUrl: './architecture-modal.component.html',
  styleUrl: './architecture-modal.component.scss'
})
export class ArchitectureModalComponent {
  store = inject(ProfileStore);
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}

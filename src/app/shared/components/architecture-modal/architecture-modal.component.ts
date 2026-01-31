import { Component, EventEmitter, Output, input } from '@angular/core';
import { FooterDetail } from '@layout/footer/footer.model';

@Component({
  selector: 'app-architecture-modal',
  standalone: true,
  templateUrl: './architecture-modal.component.html',
  styleUrl: './architecture-modal.component.scss'
})
export class ArchitectureModalComponent {
  content = input.required<FooterDetail>();
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}

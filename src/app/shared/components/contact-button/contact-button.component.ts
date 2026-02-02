import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactService } from '@core/services/contact.service';

@Component({
  selector: 'app-contact-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-button.component.html',
  styleUrl: './contact-button.component.scss'
})
export class ContactButtonComponent {
  private contactService = inject(ContactService);
  
  // UI State Signals
  isOpen = signal(false);
  isHovered = signal(false);
  submitStatus = signal<'idle' | 'success' | 'error'>('idle');

  // Form Data Signals (Pattern: Zero Friction)
  name = signal('');
  email = signal('');
  message = signal('');
  
  // Service State
  isLoading = this.contactService.isLoading;
  
  // Real-time Validation
  isFormValid = computed(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return (
      this.name().trim().length > 2 &&
      emailRegex.test(this.email()) &&
      this.message().trim().length > 10
    );
  });

  // Modal UI Computed
  modalClasses = computed(() => {
    const base = 'fixed bottom-24 right-6 w-80 md:w-96 rounded-2xl border border-slate-700/50 bg-slate-900/95 backdrop-blur-xl shadow-2xl shadow-black/50 transition-all duration-300 origin-bottom-right z-[60] overflow-hidden';
    return this.isOpen() 
      ? `${base} opacity-100 scale-100 translate-y-0 visible` 
      : `${base} opacity-0 scale-95 translate-y-4 invisible`;
  });

  toggleModal() {
    this.isOpen.update(v => !v);
    if (!this.isOpen()) {
        this.resetFormState();
    }
  }

  closeModal(event?: Event) {
    if (event) event.stopPropagation();
    this.isOpen.set(false);
    setTimeout(() => this.resetFormState(), 300);
  }

  resetFormState() {
    this.submitStatus.set('idle');
    // Opcional: Limpiar campos al cerrar, o mantenerlos como borrador (User Friendly)
    if (this.submitStatus() === 'success') {
      this.name.set('');
      this.email.set('');
      this.message.set('');
    }
  }

  sendContact() {
    if (!this.isFormValid() || this.isLoading()) return;

    const formData = {
      name: this.name(),
      email: this.email(),
      message: this.message()
    };

    this.contactService.sendEmail(formData).subscribe({
      next: () => {
        this.submitStatus.set('success');
        this.name.set('');
        this.email.set('');
        this.message.set('');
        setTimeout(() => this.closeModal(), 2500);
      },
      error: (err) => {
        console.error('[ContactAPI Error]:', {
            status: err.status,
            message: err.message,
            timestamp: new Date().toISOString()
        });
        this.submitStatus.set('error');
      }
    });
  }

  openSocial(url: string) {
    window.open(url, '_blank');
  }

  // Helper para templates (evita el cast manual $any($event.target).value repetitivo en HTML)
  updateSignal(sig: any, event: Event) {
    const value = (event.target as HTMLInputElement).value;
    sig.set(value);
  }
}

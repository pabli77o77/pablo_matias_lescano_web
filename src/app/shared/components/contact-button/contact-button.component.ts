import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactService } from '@core/services/contact.service';

@Component({
  selector: 'app-contact-button',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact-button.component.html',
  styleUrl: './contact-button.component.scss'
})
export class ContactButtonComponent {
  private fb = inject(FormBuilder);
  private contactService = inject(ContactService);
  
  // State Signals
  isOpen = signal(false);
  isHovered = signal(false);
  
  // Exponemos el estado de carga del servicio para la UI
  isLoading = this.contactService.isLoading;
  
  // Feedback visual simple
  submitStatus = signal<'idle' | 'success' | 'error'>('idle');
  
  // Computed States
  modalClasses = computed(() => {
    const base = 'fixed bottom-24 right-6 w-80 md:w-96 rounded-2xl border border-slate-700/50 bg-slate-900/95 backdrop-blur-xl shadow-2xl shadow-black/50 transition-all duration-300 origin-bottom-right z-[60] overflow-hidden';
    return this.isOpen() 
      ? `${base} opacity-100 scale-100 translate-y-0 visible` 
      : `${base} opacity-0 scale-95 translate-y-4 invisible`;
  });

  // Contact Form
  contactForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(10)]]
  });

  toggleModal() {
    this.isOpen.update(v => !v);
    if (!this.isOpen()) {
        this.submitStatus.set('idle'); // Resetear estado al cerrar
    }
  }

  closeModal(event?: Event) {
    if (event) event.stopPropagation();
    this.isOpen.set(false);
    setTimeout(() => this.submitStatus.set('idle'), 300); // Resetear estado después de animación
  }

  onSubmit() {
    if (this.contactForm.valid && !this.isLoading()) {
      const formData = {
        name: this.contactForm.value.name!,
        email: this.contactForm.value.email!,
        message: this.contactForm.value.message!
      };

      this.contactService.sendEmail(formData).subscribe({
        next: () => {
          this.submitStatus.set('success');
          this.contactForm.reset();
          setTimeout(() => this.closeModal(), 2500);
        },
        error: (err) => {
          // SRE Mindset: Loguear detalles para debugging en CloudWatch/Consola
          console.error('[ContactAPI Error]:', {
            status: err.status,
            message: err.message,
            timestamp: new Date().toISOString()
          });
          this.submitStatus.set('error');
        }
      });
    }
  }

  openSocial(url: string) {
    window.open(url, '_blank');
  }
}

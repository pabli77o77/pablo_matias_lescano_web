import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactService } from '@core/services/contact.service';
import { ProfileStore } from '@core/store/profile.store';

const SOCIAL_LINKS = {
  LINKEDIN: 'https://www.linkedin.com/in/pablo-matias-lescano/',
  WHATSAPP: 'https://wa.me/5491160003204?text=Hola%20Pablo,%20vi%20tu%20portfolio%20y%20me%20gustaría%20consultarte%20por%20un%20proyecto.'
} as const;

const I18N_TEXT = {
  es: {
    title: 'Conectemos',
    subtitle: 'Disponible para nuevos desafíos',
    orMessage: 'O envía un mensaje',
    placeholderName: 'Nombre',
    placeholderEmail: 'email@ejemplo.com',
    placeholderMessage: '¿Cómo puedo ayudarte?',
    sendButton: 'Enviar Mensaje',
    sending: 'Enviando...',
    successTitle: '¡Recibido!',
    successDescription: 'Tu mensaje ha cruzado la infraestructura serverless con éxito. Revisaré los detalles y te escribiré pronto.',
    backToSite: 'Volver al sitio',
    error: 'Error de conexión. Por favor intenta más tarde.',
    linkedin: 'LinkedIn',
    linkedinAria: 'Ver perfil de LinkedIn de Pablo Lescano',
    whatsapp: 'WhatsApp',
    whatsappAria: 'Contactar a Pablo Lescano por WhatsApp'
  },
  en: {
    title: 'Let\'s Connect',
    subtitle: 'Available for new challenges',
    orMessage: 'Or send a message',
    placeholderName: 'Name',
    placeholderEmail: 'email@example.com',
    placeholderMessage: 'How can I help you?',
    sendButton: 'Send Message',
    sending: 'Sending...',
    successTitle: 'Received!',
    successDescription: 'Your message has successfully crossed the serverless infrastructure. I\'ll review the details and get back to you soon.',
    backToSite: 'Back to site',
    error: 'Connection error. Please try again later.',
    linkedin: 'LinkedIn',
    linkedinAria: 'View Pablo Lescano\'s LinkedIn Profile',
    whatsapp: 'WhatsApp',
    whatsappAria: 'Contact Pablo Lescano via WhatsApp'
  }
};

@Component({
  selector: 'app-contact-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-button.component.html',
  styleUrl: './contact-button.component.scss'
})
export class ContactButtonComponent {
  private contactService = inject(ContactService);
  private store = inject(ProfileStore);
  
  // Expose links to template
  readonly links = SOCIAL_LINKS;
  
  // UI State Signals
  isOpen = signal(false);
  isHovered = signal(false);
  submitStatus = signal<'idle' | 'success' | 'error'>('idle');

  // Computed Success State
  isSubmitted = computed(() => this.submitStatus() === 'success');

  // I18n Computed Signal
  uiText = computed(() => {
    const lang = this.store.language();
    return I18N_TEXT[lang] || I18N_TEXT.en;
  });

  // Form Data Signals
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
    // Solo reseteamos si no estamos en medio de un envío exitoso que el usuario está viendo
    if (this.submitStatus() === 'success' && !this.isOpen()) {
      this.submitStatus.set('idle');
      this.name.set('');
      this.email.set('');
      this.message.set('');
    } else if (this.submitStatus() === 'error') {
      this.submitStatus.set('idle');
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

  navigateTo(url: string) {
    // Security: noopener noreferrer prevents tabnabbing and referencing
    window.open(url, '_blank', 'noopener noreferrer');
  }

  updateSignal(sig: any, event: Event) {
    const value = (event.target as HTMLInputElement).value;
    sig.set(value);
  }
}

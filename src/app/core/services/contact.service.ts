import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { finalize } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private http = inject(HttpClient);
  // Endpoint de API Gateway -> Lambda
  private apiUrl = 'https://qkigx2afx1.execute-api.us-east-1.amazonaws.com/default/angular-contact-form-handler';

  // Signal para estado de carga global/local
  isLoading = signal(false);

  sendEmail(formData: { name: string; email: string; message: string }) {
    this.isLoading.set(true);
    // Enviamos payload plano, Lambda debe estar configurada para manejar CORS y Body Mapping si es necesario
    return this.http.post(this.apiUrl, formData).pipe(
      finalize(() => this.isLoading.set(false))
    );
  }
}

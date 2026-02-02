import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProfile } from '@domain/models/profile.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private http = inject(HttpClient);

  getProfile(lang: 'es' | 'en' = 'es'): Observable<UserProfile> {
    return this.http.get<UserProfile>(`data/cv-data-${lang}.json`);
  }

  /**
   * Descarga un archivo binario (PDF) dado su URL.
   * Útil para validar que el archivo existe y no es una redirección al index.html
   */
  downloadFile(url: string): Observable<Blob> {
    return this.http.get(url, { responseType: 'blob' });
  }
}

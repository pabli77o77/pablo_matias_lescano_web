import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProfile } from '@domain/models/profile.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private http = inject(HttpClient);

  getProfile(lang: 'es' | 'en'): Observable<UserProfile> {
    return this.http.get<UserProfile>(`data/cv-data-${lang}.json`);
  }
}

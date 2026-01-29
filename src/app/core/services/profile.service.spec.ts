import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProfileService } from './profile.service';
import { UserProfile } from '@domain/models/profile.model';

describe('ProfileService', () => {
  let service: ProfileService;
  let httpMock: HttpTestingController;

  const mockProfile: UserProfile = {
    personal_info: {
      name: 'Test User',
      title: 'Senior Developer',
      location: 'Buenos Aires',
      email: 'test@test.com',
      phone: '+54 123456',
      linkedin: 'linkedin.com/in/test',
      career_start: '2020-01'
    },
    summary: 'Test summary',
    experience: [
      {
        company: 'Test Company',
        period: { start: '2023-01', end: '' },
        role: 'Developer',
        domain: 'Web',
        stack: ['Angular', 'TypeScript'],
        is_lead: false,
        metrics: ['Metric 1'],
        description: 'Test description'
      }
    ],
    skills: {
      cloud_data: ['AWS'],
      backend: ['.NET'],
      frontend: ['Angular'],
      architecture: ['DDD'],
      devops: ['Docker']
    },
    education: 'Test education',
    languages: [
      { language: 'English', level: 'Professional' }
    ]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProfileService]
    });

    service = TestBed.inject(ProfileService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getProfile', () => {
    it('should fetch Spanish profile by default', (done) => {
      service.getProfile().subscribe({
        next: (profile) => {
          expect(profile).toEqual(mockProfile);
          done();
        }
      });

      const req = httpMock.expectOne('data/cv-data-es.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockProfile);
    });

    it('should fetch English profile when lang is "en"', (done) => {
      service.getProfile('en').subscribe({
        next: (profile) => {
          expect(profile).toEqual(mockProfile);
          done();
        }
      });

      const req = httpMock.expectOne('data/cv-data-en.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockProfile);
    });

    it('should fetch Spanish profile when lang is "es"', (done) => {
      service.getProfile('es').subscribe({
        next: (profile) => {
          expect(profile).toEqual(mockProfile);
          done();
        }
      });

      const req = httpMock.expectOne('data/cv-data-es.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockProfile);
    });

    it('should handle HTTP errors', (done) => {
      const errorMessage = 'Network error';

      service.getProfile().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
          expect(error.statusText).toBe('Not Found');
          done();
        }
      });

      const req = httpMock.expectOne('data/cv-data-es.json');
      req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
    });

    it('should return observable that completes', (done) => {
      service.getProfile().subscribe({
        complete: () => {
          expect(true).toBe(true);
          done();
        }
      });

      const req = httpMock.expectOne('data/cv-data-es.json');
      req.flush(mockProfile);
    });
  });
});

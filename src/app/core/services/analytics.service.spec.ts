import { TestBed } from '@angular/core/testing';
import { Router, NavigationEnd } from '@angular/router';
import { AnalyticsService } from './analytics.service';
import { Subject, of } from 'rxjs';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { PLATFORM_ID } from '@angular/core';

// Mock del Router
class MockRouter {
  private eventsSubject = new Subject<any>();
  public events = this.eventsSubject.asObservable();

  triggerNavigationEnd(url: string): void {
    this.eventsSubject.next(new NavigationEnd(1, url, url));
  }
}

// Mock de GTM Service
class MockGtmService {
  pushTag = jest.fn().mockReturnValue(Promise.resolve());
}

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let router: MockRouter;
  let gtmService: MockGtmService;

  beforeEach(() => {
    // Setup global state
    (window as any).dataLayer = [];

    router = new MockRouter();
    gtmService = new MockGtmService();

    TestBed.configureTestingModule({
      providers: [
        AnalyticsService,
        { provide: Router, useValue: router },
        { provide: GoogleTagManagerService, useValue: gtmService },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });

    service = TestBed.inject(AnalyticsService);
  });

  afterEach(() => {
    delete (window as any).dataLayer;
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('trackEvent', () => {
    it('should push event to GTM service', () => {
      const eventName = 'test_event';
      const payload = { key: 'value' };

      service.trackEvent(eventName, payload);

      expect(gtmService.pushTag).toHaveBeenCalledWith({
        event: eventName,
        ...payload
      });
    });

    it('should push event even without payload', () => {
      service.trackEvent('simple_event');

      expect(gtmService.pushTag).toHaveBeenCalledWith({
        event: 'simple_event'
      });
    });
  });

  describe('Business Events', () => {
    it('should track CV download', () => {
      service.trackCvDownload('cv.pdf', 'es');

      expect(gtmService.pushTag).toHaveBeenCalledWith(expect.objectContaining({
        event: 'file_download',
        file_name: 'cv.pdf'
      }));
    });

    it('should track external link clicks', () => {
      service.trackExternalLink('linkedin');

      expect(gtmService.pushTag).toHaveBeenCalledWith(expect.objectContaining({
        event: 'external_link_click',
        label: 'linkedin'
      }));
    });
  });

  describe('Page view tracking', () => {
    it('should track page views on router navigation', () => {
      router.triggerNavigationEnd('/home');

      expect(gtmService.pushTag).toHaveBeenCalledWith({
        event: 'page_view',
        page_path: '/home'
      });
    });
  });
});
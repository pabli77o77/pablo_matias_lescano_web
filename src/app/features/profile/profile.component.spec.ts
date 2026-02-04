import { render, screen } from '@testing-library/angular';
import { ProfileComponent } from './profile.component';
import { ProfileStore } from '@core/store/profile.store';
import { signal } from '@angular/core';
import { UI_LABELS } from '@core/i18n/ui-labels';

describe('ProfileComponent', () => {
  // Creamos un Mock del Store
  const mockStore = {
    isLoading: signal(false),
    error: signal(null),
    data: signal({
      personal_info: { name: 'Pablo Matias Lescano', title: 'Senior Engineer' },
      summary: 'Experienced Lead',
      totalExperienceYears: 11,
      experience: []
    }),
    viewMode: signal('frontend'),
    language: signal('es'),
    ui: signal(UI_LABELS.es)
  };

  it('should render the user name and title', async () => {
    await render(ProfileComponent, {
      componentProviders: [
        { provide: ProfileStore, useValue: mockStore }
      ]
    });

    expect(screen.getByText('Pablo Matias Lescano')).toBeTruthy();
    expect(screen.getByText(/Software Architect/i)).toBeTruthy();
    expect(screen.getByText(/Tech Lead/i)).toBeTruthy();
  });

  it('should show loading state', async () => {
    // Cambiamos el mock para que esté cargando
    const loadingStore = { ...mockStore, isLoading: signal(true), data: signal(null) };
    
    await render(ProfileComponent, {
      componentProviders: [
        { provide: ProfileStore, useValue: loadingStore }
      ]
    });

    expect(document.querySelector('.skeleton-header')).toBeTruthy();
  });
});

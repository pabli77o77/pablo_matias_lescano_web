import { ProfileMapper } from './profile.mapper';
import { UserProfile } from '@domain/models/profile.model';

describe('ProfileMapper', () => {
  const mockRawProfile: UserProfile = {
    personal_info: {
      name: 'Test User',
      title: 'Senior Dev',
      location: 'BA',
      email: 'test@test.com',
      phone: '123',
      linkedin: 'link',
      career_start: '2020-01'
    },
    summary: 'Summary',
    experience: [
      {
        company: 'Company A',
        period: { start: '2024-01', end: '' },
        role: 'Dev',
        domain: 'Web',
        stack: ['Angular'],
        is_lead: false,
        metrics: [],
        description: 'Desc'
      }
    ],
    skills: {
      cloud_data: [], backend: [], frontend: [], architecture: [], devops: []
    },
    education: '',
    languages: []
  };

  it('should calculate total years correctly from career_start', () => {
    // Si hoy es 2026 y empezó en 2020, deberían ser 6 años
    const result = ProfileMapper.mapToViewModel(mockRawProfile);
    expect(result.totalExperienceYears).toBeGreaterThanOrEqual(6);
  });

  it('should format duration label correctly', () => {
    const result = ProfileMapper.mapToViewModel(mockRawProfile);
    expect(result.experience[0].durationLabel).toContain('año');
    expect(result.experience[0].isCurrent).toBe(true);
  });
});

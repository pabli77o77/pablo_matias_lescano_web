import { UserProfile, Experience } from '@domain/models/profile.model';

export interface ExperienceViewModel extends Experience {
  durationLabel: string; // "2 años, 5 meses"
  isCurrent: boolean;
}

export interface UserProfileViewModel extends Omit<UserProfile, 'experience'> {
  experience: ExperienceViewModel[];
  totalExperienceYears: number;
}

export class ProfileMapper {
  static mapToViewModel(raw: UserProfile): UserProfileViewModel {
    const totalExperienceYears = this.calculateTotalYears(raw);
    const enrichedExperience = raw.experience.map(exp => this.mapExperience(exp));
    
    // Inyección dinámica de años en el resumen (Clean Code / i18n support)
    const summary = raw.summary.replace('{{years}}', totalExperienceYears.toString());

    return {
      ...raw,
      summary, // Resumen procesado
      experience: enrichedExperience,
      totalExperienceYears
    };
  }

  private static mapExperience(exp: Experience): ExperienceViewModel {
    const start = new Date(exp.period.start);
    const end = exp.period.end ? new Date(exp.period.end) : new Date();
    const isCurrent = !exp.period.end;

    return {
      ...exp,
      isCurrent,
      durationLabel: this.formatDuration(start, end)
    };
  }

  private static calculateTotalYears(profile: UserProfile): number {
    // 1. Si hay fecha de inicio de carrera explícita, la usamos (Prioridad 1)
    if (profile.personal_info.career_start) {
      const start = new Date(profile.personal_info.career_start).getTime();
      const diff = Date.now() - start;
      return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    }

    // 2. Fallback: Calculamos basado en la experiencia más antigua listada
    if (!profile.experience.length) return 0;
    
    const dates = profile.experience.map(e => new Date(e.period.start).getTime());
    const minDate = Math.min(...dates);
    const diff = Date.now() - minDate;
    
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  }

  private static formatDuration(start: Date, end: Date): string {
    let months = (end.getFullYear() - start.getFullYear()) * 12;
    months -= start.getMonth();
    months += end.getMonth();
    
    // Ajuste por si el día de fin es menor al de inicio (opcional, simplificado aquí)
    if (months <= 0) return '0 meses';

    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    const parts = [];
    if (years > 0) parts.push(`${years} año${years > 1 ? 's' : ''}`);
    if (remainingMonths > 0) parts.push(`${remainingMonths} mes${remainingMonths > 1 ? 'es' : ''}`);

    return parts.join(', ');
  }
}
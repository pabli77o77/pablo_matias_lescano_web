export interface PersonalInfo {
  name: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  linkedin: string;
  career_start?: string; // Format: YYYY-MM
}

export interface ExperiencePeriod {
  start: string; // Format: YYYY-MM
  end: string;   // Format: YYYY-MM
}

export interface Experience {
  company: string;
  period: ExperiencePeriod;
  role: string;
  domain: string;
  stack: string[];
  is_lead: boolean;
  metrics: string[];
  description: string;
}

export interface Skills {
  cloud_data: string[];
  backend: string[];
  frontend: string[];
  architecture: string[];
  devops: string[];
}

export interface Language {
  language: string;
  level: string;
}

export interface UserProfile {
  personal_info: PersonalInfo;
  summary: string;
  experience: Experience[];
  skills: Skills;
  education: string;
  languages: Language[];
}

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from '@core/services/analytics.service';

interface LabProject {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  url: string;
  icon: 'trending' | 'brain';
  theme: 'emerald' | 'cyan';
  badge: string;
}

@Component({
  selector: 'app-research-labs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './research-labs.component.html',
  styleUrl: './research-labs.component.scss'
})
export class ResearchLabsComponent {
  private analytics = inject(AnalyticsService);

  projects: LabProject[] = [
    {
      id: 'neurafutures',
      name: 'NeuraFutures (Quant Engine)',
      description: 'Sistema asíncrono de trading para futuros (OKX). Implementa Optimización Bayesiana y Simulaciones de Monte Carlo para validación de riesgo.',
      techStack: ['Python', 'Asyncio', 'NumPy', 'Pandas', 'CCXT'],
      url: 'https://github.com/pabli77o77/neurafutures-quant-engine',
      icon: 'trending',
      theme: 'emerald',
      badge: 'Validado con Monte Carlo & WFO'
    },
    {
      id: 'fundamental-hub',
      name: 'Fundamental Intelligence Hub',
      description: 'Plataforma RAG de inteligencia de mercado. Procesa video y RSS mediante Gemini 1.5 Pro y ChromaDB para scoring de analistas.',
      techStack: ['Python', 'ChromaDB', 'Gemini 1.5', 'Whisper', 'Pydantic'],
      url: 'https://github.com/pabli77o77/fundamental-intelligence-hub',
      icon: 'brain',
      theme: 'cyan',
      badge: 'Arquitectura RAG con Gemini 1.5 Pro'
    }
  ];

  trackRepo(project: LabProject) {
    this.analytics.trackEvent('view_external_repo', {
      repo_name: project.name,
      platform: 'github',
      category: 'R&D Labs'
    });
  }
}

import { Component, Input, computed, signal } from '@angular/core';
import { JsonPipe, UpperCasePipe } from '@angular/common';
import { CODE_SNIPPETS } from '@core/constants/code-snippets';

@Component({
  selector: 'app-data-view',
  standalone: true,
  imports: [JsonPipe, UpperCasePipe],
  templateUrl: './data-view.component.html',
  styleUrl: './data-view.component.scss'
})
export class DataViewComponent {
  @Input({ required: true }) data: any;

  snippets = CODE_SNIPPETS;
  
  // Controla qué sección está expandida. Por defecto todo cerrado.
  expandedSection = signal<string>('');
  
  // Controla el estado del botón de copiar (feedback visual)
  copyState = signal<'idle' | 'copied'>('idle');

  formattedData = computed(() => {
    return JSON.stringify(this.data, null, 2);
  });

  // Mapa de notas de arquitectura
  private architectNotes: Record<string, string> = {
    'rxjs': 'La implementación utiliza RxJS Pipeable Operators para procesar streams de datos pesados. Se optó por un enfoque reactivo para garantizar que la interfaz mantenga los 60fps mientras se filtran y transforman +6.8M de registros en tiempo real, evitando el bloqueo del Event Loop.',
    'medallion': 'Este script implementa la transición de Bronze a Silver en una arquitectura Medallion. La lógica de de-duplicación y validación de esquemas está diseñada para ser idempotente, permitiendo re-ejecuciones sin corrupción de datos, reduciendo los costos de computación en AWS en un 40%.',
    'store': 'Migración estratégica a Signals para optimizar la detección de cambios. Al eliminar la dependencia de Zone.js en componentes críticos, logramos una reducción del 30% en el tiempo de renderizado inicial y una gestión de estado más predecible y granular.'
  };

  toggleSection(id: string) {
    if (this.expandedSection() === id) {
      this.expandedSection.set('');
    } else {
      this.expandedSection.set(id);
    }
  }

  getNote(id: string): string | null {
    return this.architectNotes[id] || null;
  }

  copyConcept(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      this.copyState.set('copied');
      setTimeout(() => this.copyState.set('idle'), 2000);
    });
  }
}
import { Component, Input } from '@angular/core';
import { ExperienceViewModel } from '@domain/mappers/profile.mapper';

@Component({
  selector: 'app-experience-timeline',
  standalone: true,
  imports: [],
  templateUrl: './experience-timeline.component.html',
  styleUrl: './experience-timeline.component.scss'
})
export class ExperienceTimelineComponent {
  @Input({ required: true }) experiences: ExperienceViewModel[] = [];
}

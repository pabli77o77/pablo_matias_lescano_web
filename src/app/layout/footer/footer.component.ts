import { Component, inject } from '@angular/core';
import { ProfileStore } from '@core/store/profile.store';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  store = inject(ProfileStore);
  currentYear = new Date().getFullYear();
}

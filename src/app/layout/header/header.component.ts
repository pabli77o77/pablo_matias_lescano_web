import { Component, Input, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ProfileStore } from '@core/store/profile.store';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input() title: string = '';
  readonly store = inject(ProfileStore);

  toggleMode() {
    this.store.toggleViewMode();
    // El tracking de analytics ahora es reactivo en ProfileComponent mediante effects
  }
}
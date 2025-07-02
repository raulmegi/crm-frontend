import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import ConstRoutes from '../../../shared/constants/const-routes';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  menuOpen = false;
  dropdownOpen = false; // Estado para el dropdown

  constructor(private router: Router) {}

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }
  closeMenu(): void {
    this.menuOpen = false;
  }

  // ▼ Dropdown
  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }
  closeDropdown(): void {
    this.dropdownOpen = false;
  }

  // ▼ Acción de logout
  logout(): void {
    // Aquí llamas a tu servicio de autenticación o redirect:
    // this.authService.logout();
    this.router.navigate(['/login']);
    this.closeDropdown();
  }

  gestionUsuarios(): void {
    this.router.navigate([ConstRoutes.PATH_APPUSER]);
    this.closeDropdown();
  }

  crearTareaDesdeHeader(): void {
    this.router.navigate([ConstRoutes.PATH_TASKS], {
      queryParams: { popup: 'CREAR' },
    });
    this.closeDropdown();
  }
}

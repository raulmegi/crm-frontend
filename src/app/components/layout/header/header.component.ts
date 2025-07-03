import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OnInit } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { AppUser } from '../../../model/appUser.model';
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
export class HeaderComponent implements OnInit {
  menuOpen = false;
  dropdownOpen = false; 
  isCheckingLogin = true;
  currentUser: AppUser | null = null;

  constructor(private router: Router, private authService: AuthService) {}
  
  async ngOnInit() {
    try {
      this.currentUser = await this.authService.getLoggedUser();
    } catch (error) {
    console.warn('No logged-in user');
    this.currentUser = null;
  } finally {
    this.isCheckingLogin = false;
  }
  }

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
    this.authService.logout();
    this.router.navigate(['/home']).then(() => {
        window.location.reload();
    });
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

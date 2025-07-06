import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OnInit } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { AppUser } from '../../../model/appUser.model';
import { Router } from '@angular/router';
import ConstRoutes from '../../../shared/constants/const-routes';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule, MatMenuModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnChanges {
  menuOpen = false;
  dropdownOpen = false;
  @Input() currentUser: AppUser | null = null;
  @Input() isCheckingLogin: boolean = true;
  constructor(private router: Router, private authService: AuthService) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['currentUser']) {
    }
    if (changes['isCheckingLogin']) {
    }
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }
  closeMenu(): void {
    this.menuOpen = false;
  }


  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }
  closeDropdown(): void {
    this.dropdownOpen = false;
  }


  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']).then(() => {
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

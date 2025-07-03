import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { AppUser } from '../../../model/appUser.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  menuOpen = false;
  currentUser: AppUser | null = null;
  isCheckingLogin = true; 

  
  constructor(private authService: AuthService) {}

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
}



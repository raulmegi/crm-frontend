import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { HeaderComponent } from './components/layout/header/header.component';
import { FooterComponent } from './components/layout/footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { AppUser } from './model/appUser.model';
import { FabComponent } from './components/floating-action-button/fab.component';
import { TaskPopupComponent } from './components/task-popup/task-popup.component';
import { MatIconModule } from '@angular/material/icon';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RouterOutlet, CommonModule, TaskPopupComponent, MatIconModule, FabComponent],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  showHeader = false;
  currentUser: AppUser | null = null;
  isCheckingLogin = true;
  modoPopup: 'CLOSED' | 'CREAR' = 'CLOSED';
  isAuthPage = false;

  constructor(private router: Router, private authService: AuthService) { 
    this.router.events.subscribe(() => {
    this.isAuthPage = this.router.url.includes('/login') || this.router.url.includes('/registro');
  });
  }

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const url = (event as NavigationEnd).urlAfterRedirects;
      console.log('Current URL:', url);

      this.showHeader = !['/login', '/registro'].includes(url);

      if (this.showHeader) {
        this.loadUser();
      } else {
        this.currentUser = null;
        this.isCheckingLogin = false;
      }
    });
  
  }

  private async loadUser() {
    this.isCheckingLogin = true;
    try {
      this.currentUser = await this.authService.getLoggedUser();
    } catch {
      this.currentUser = null;
    } finally {
      this.isCheckingLogin = false;
    }
  }

  get showFab(): boolean {
    const excludedRoutes = ['/login', '/registro'];
    return !excludedRoutes.includes(this.router.url);
  }

  openCrearPopup() {
    this.modoPopup = 'CREAR';
  }

  closePopup() {
    this.modoPopup = 'CLOSED';
  }
}

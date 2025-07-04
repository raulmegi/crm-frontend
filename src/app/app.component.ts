import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { HeaderComponent } from './components/layout/header/header.component';
import { FooterComponent } from './components/layout/footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { AppUser } from './model/appUser.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ HeaderComponent, FooterComponent, RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  showHeader = false;
  currentUser: AppUser | null = null;
  isCheckingLogin = true;

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const url = (event as NavigationEnd).urlAfterRedirects;
      this.showHeader = !['/login', '/registro'].includes(url);

      // Only fetch user if we show the header (i.e., user must be logged in)
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
}

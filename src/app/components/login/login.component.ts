import { Component, NgModule } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { isOkResponse, loadResponseData, loadResponseError } from '../../../services/utils.service';
import { Router } from '@angular/router';
import { AppUser } from '../../model/appUser.model';
import { FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  credentials = {
    email: '',
    password: ''
  };

  errorMessage: string | null = null;
  mainClass = 'auth-background';

  constructor(private authService: AuthService, private router: Router) {}

  async onSubmit() {
    this.errorMessage = null;

    const [error, response] = await this.authService.login(this.credentials);

    if (error) {
      this.errorMessage = loadResponseError(error);
      console.error('Error en el login:', this.errorMessage);
      return;
    }

    if (isOkResponse(response)) {
      const user: AppUser = loadResponseData(response);
      this.router.navigate(['/home']).then(() => {
        window.location.reload();
      });
    } else {
      this.errorMessage = loadResponseError(response);
    }
  }
}



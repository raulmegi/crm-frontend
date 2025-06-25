import { Component, NgModule } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { isOkResponse, loadResponseData, loadResponseError } from '../../../services/utils.service';
import { Router } from '@angular/router';
import { AppUser } from '../../model/appUser.model';
import { FormsModule} from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  credentials = {
    email: '',
    password: ''
  };
  constructor(private authService: AuthService, private router: Router) {}
  
  async onSubmit() {
    const [error, response] = await this.authService.login(this.credentials);

    if (error) {
      const errorMessage = loadResponseError(error);
      console.error('Error en el login:', errorMessage);
       alert(errorMessage);
      return;
    }
  
    if (isOkResponse(response)) {
      const user: AppUser = loadResponseData(response);
      console.log('Login correcto', user);
      alert('Login correcto');
    // TODO: Store user / token if needed
      this.router.navigate(['/home']);
    } else {
      const errorMessage = loadResponseError(response);
      alert(errorMessage);
    }
  }
}


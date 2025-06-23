import { Component } from '@angular/core';
//import { NgForm } from '@angular/forms';
import { CommonModule, NgFor } from '@angular/common';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { AppUser } from '../../model/appUser.model';
import to from '../../../services/utils.service';
import { Router } from '@angular/router';
import { isOkResponse, loadResponseData, loadResponseError } from '../../../services/utils.service';



@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule,],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  user: AppUser = {
    id: 0,
    name: '',
    email: '',
    password: '',
    role: null,
  };
  passwordsDoNotMatch(): boolean {
     return !!this.confirmPassword && this.user.password !== this.confirmPassword;
  }

  confirmPassword: string = '';

  get passwordMatch(): boolean {
  return this.user.password === this.confirmPassword;
}

  constructor(private authService: AuthService, private router: Router) {}

  async onSubmit() {
    if (!this.passwordMatch) {
    return;
    }
    
  this.user.role = null;
  const { id, ...payload } = this.user;

  console.log('Payload being sent:', payload); 

  const [error, response] = await this.authService.createAppUser(payload);

  if (error) {
    console.error('FULL ERROR', error);
    const backendMesasge = loadResponseError(error);
    alert (backendMesasge);
    return;
  }
  if (!isOkResponse(response)) {
    const backendMessage = loadResponseError(response);
    console.error('BACKEND ERROR', response);
    alert(backendMessage);
    return;
  }
  const newUser = loadResponseData(response);
  console.log('Usuario creado con éxito:', newUser);
  alert('Usuario registrado con éxito');
  this.router.navigate(['/login']);
  this.router.navigate(['/login']);
  }
  
}

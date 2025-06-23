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

  confirmPassword: string = '';
  passwordMatch: boolean = true;

  constructor(private authService: AuthService, private router: Router) {}

  async onSubmit() {
    if (this.user.password !== this.confirmPassword) {
      this.passwordMatch = false;
      return; 
    }
    
  this.passwordMatch = true;
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

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { RoleService } from '../../../services/role.service';
import { AppUser } from '../../model/appUser.model';
import { Role } from '../../model/role.model';
import to, { isOkResponse, loadResponseData, loadResponseError } from '../../../services/utils.service';


@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  user: AppUser = {
    id: 0,
    name: '',
    email: '',
    password: '',
    role: { id: 0, name: '' } // default dummy role; will be replaced on form submit
  };

  confirmPassword: string = '';
  roles: Role[] = [];
  selectedRoleId: number | null = null;

  constructor(
    private authService: AuthService,
    private roleService: RoleService,
    private router: Router
  ) {}

  async ngOnInit() {
    const [err, roles] = await to(this.roleService.getAllRoles().toPromise());
    if (!err) {
      this.roles = loadResponseData(roles);
    }
  }

  get passwordMatch(): boolean {
    return this.user.password === this.confirmPassword;
  }

  passwordsDoNotMatch(): boolean {
    return !!this.confirmPassword && !this.passwordMatch;
  }

  async onSubmit() {
    if (!this.passwordMatch) return;

    const selectedRole = this.roles.find(r => r.id === this.selectedRoleId);
    if (!selectedRole) {
      alert('Por favor selecciona un rol válido.');
      return;
    }

    this.user.role = selectedRole;
    const { id, ...payload } = this.user;

    console.log('Payload being sent:', payload);
    const [error, response] = await this.authService.registerAppUser(payload);

    if (error) {
      console.error('FULL ERROR', error);
      alert(loadResponseError(error));
      return;
    }

    if (!isOkResponse(response)) {
      console.error('BACKEND ERROR', response);
      alert(loadResponseError(response));
      return;
    }

    const newUser = loadResponseData(response);
    console.log('Usuario creado con éxito:', newUser);
    alert('Usuario registrado con éxito');
    this.router.navigate(['/login']);
  }
}

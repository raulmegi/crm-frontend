import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppUserManagerService } from '../../../services/app-user-manager.service';
import { AppUser } from '../../model/appUser.model';
import { isOkResponse, loadResponseData, loadResponseError } from '../../../services/utils.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { Role } from '../../model/role.model';
import { RoleService } from '../../../services/role.service';
import to from '../../../services/utils.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-app-user-manager-popup',
  templateUrl: './app-user-manager-popup.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class AppUserManagerPopupComponent implements OnInit {
  @Input() appUserId!: number;
  @Output() cerrarPopUpOk = new EventEmitter<void>();
  @Output() cerrarPopUpCancel = new EventEmitter<void>();

  userForm: FormGroup;
  confirmPassword: string = '';
  error: string | null = null;
  roles: Role[] = [];

  constructor(
    private fb: FormBuilder,
    private appUserManagerService: AppUserManagerService,
    private authService: AuthService,
    private roleService: RoleService
  ) 
  {
   this.userForm = this.fb.group({
  name: ['', Validators.required],
  email: ['', [Validators.required, Validators.email]],
  password: ['', Validators.required],
  confirmPassword: [''],
  role: this.fb.group({
    id: [1, Validators.required],
    }),
  });
}

  async ngOnInit() {
const roleResult = await to(firstValueFrom(this.roleService.getAllRoles()));
  if (Array.isArray(roleResult)) {
    this.error = loadResponseError(roleResult[0]);
  } else {
    this.roles = loadResponseData(roleResult);
  }

  if (typeof this.appUserId === 'number' && this.appUserId !== 0) {
    const userResult = await to(this.appUserManagerService.getAppUserById(this.appUserId));
    if (Array.isArray(userResult)) {
      this.error = loadResponseError(userResult[0]);
      return;
    }

    const user = loadResponseData(userResult);
    this.userForm.patchValue({
      name: user.name,
      email: user.email,
      password: '',
      confirmPassword: '',
      role: {
        id: user.role?.id ?? 1,
            }
    }); 
  }
}

  get passwordMatch(): boolean {
    const { password, confirmPassword } = this.userForm.value;
    return password === confirmPassword;
  }

  async guardar() {
    if (!this.userForm.valid || !this.passwordMatch) {
      this.error = 'Verifica los datos. Las contraseñas deben coincidir.';
      return;
    }

    const formValue = this.userForm.value;
    const appUser: AppUser = {
      id: this.appUserId !== 0 ? this.appUserId : 0,
      name: formValue.name,
      email: formValue.email,
      password: formValue.password,
      role: {
        id: formValue.role.id,
  }
};
    console.log('Creando usuario con appUserId:', this.appUserId);

    const action = this.appUserId === 0
      ? this.appUserManagerService.createAppUser({ appUser })
      : this.appUserManagerService.updateAppUser(this.appUserId, appUser);

    const [error, response] = await action;

    if (error || !isOkResponse(response)) {
          console.log('Ocurrió un error:', error, response); 
      console.error('Error al guardar el usuario:', error || response);
      this.error = loadResponseError(error || response);
      return;
    }
    console.log('¡Éxito! Mostrando alerta y cerrando popup'); 
    alert(this.appUserId === 0 ? 'Usuario creado con éxito' : 'Usuario actualizado con éxito');
    this.cerrarPopUpOk.emit();
  }

  cancelar() {
    this.cerrarPopUpCancel.emit();
  }
}

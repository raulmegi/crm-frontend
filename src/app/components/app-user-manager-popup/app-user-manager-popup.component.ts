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
  styleUrls: ['./app-user-manager-popup.component.css']
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
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: [''],
      role: this.fb.group({
        id: [1, Validators.required],
      }),
    });
  }
  
  async ngOnInit() {

    this.error = '';
    try {
      // 1) Fetch the raw array
      const list: Role[] = await firstValueFrom(
        this.roleService.getAllRoles()
      );
      console.log('Fetched roles array directly:', list);
      this.roles = list;
    } catch (err) {
      console.error('Error fetching roles:', err);
      this.error = 'Error cargando roles.';
    }

    if (typeof this.appUserId === 'number' && this.appUserId !== 0) {
      try {
        const userResult = await to(this.appUserManagerService.getAppUserById(this.appUserId));
        if (Array.isArray(userResult)) {
          this.error = loadResponseError(userResult[0]);
          return;
        } const user = loadResponseData(userResult);
        this.userForm.patchValue({
          name: user.name,
          email: user.email,
          password: '',
          confirmPassword: '',
          role: {
            id: user.role?.id ?? 1,
          }
        });
        this.error = '';
      } catch (e) {
        this.error = 'Error cargando usuario.';
        return;
      }
    }
  }

  /* passwordsDoNotMatch(): boolean {
     return !!this.confirmPassword && !this.passwordMatch;
   } */

  get passwordMatch(): boolean {
    const { password, confirmPassword } = this.userForm.value;
    return password === confirmPassword;
  }

  async guardar() {
    this.error = '';

    if (!this.userForm.valid) {
      this.error = 'Verifica los datos.';
      return;
    }

    if (!this.passwordMatch) {
      this.error = 'Las contraseñas deben coincidir.';
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
    if (error) {
      console.log('RAW BACKEND ERROR:', error);
    }

    if (error && error.status === 400 && error.error?.exception?.codigoDeError === 207) {
      this.error = 'El email ya está en uso.';
      return;
    }
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

  async getAppUserById(id: number): Promise<AppUser | null> {
    if (!id || typeof id !== 'number') {
      this.error = 'ID de usuario no válido.';
      return null;
    }
    const result = await to(this.appUserManagerService.getAppUserById(id));
    if (Array.isArray(result)) {
      this.error = loadResponseError(result[0]);
      return null;
    }
    return loadResponseData(result);
  }




}



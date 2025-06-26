import { Component } from '@angular/core';
import { AppUserManagerService } from '../../../services/app-user-manager.service';
import to, { isOkResponse, loadResponseData, loadResponseError } from '../../../services/utils.service';
// import { Router } from '@angular/router';
import { AppUser } from '../../model/appUser.model';
import { FormsModule} from '@angular/forms';
import { NgIf, NgForOf } from '@angular/common';
import { AppUserManagerPopupComponent } from '../app-user-manager-popup/app-user-manager-popup.component';
import ConstRoutes from '../../shared/constants/const-routes';
import { Role } from '../../model/role.model';
import { RoleService } from '../../../services/role.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-app-user-manager',
  standalone: true,
  imports: [FormsModule, NgIf, AppUserManagerPopupComponent],
  templateUrl: './app-user-manager.component.html',
  styleUrl: './app-user-manager.component.css'
})
export class AppUserManagerComponent {
  user: AppUser = {
      id: 0,
      name: '',
      email: '',
      password: '',
      role: { id: 0, name: '' },
    };
    roles: Role[] = [];
    users: AppUser[] = [];
    error = '';
    appUserSelected?: AppUser;
    modePopup: 'CLOSED' | 'CREAR' | 'ACTUALIZAR' = 'CLOSED';


  constructor(private appUserManagerService: AppUserManagerService,  private roleService: RoleService
) {}

  async ngOnInit() {
  await this.getAppUsers();

const [err, rolesResponse] = await to(firstValueFrom(this.roleService.getAllRoles()));
  if (!err) {
    this.roles = loadResponseData(rolesResponse);
  }
}
  
   async getAppUsers(): Promise<void> {
  this.error = '';
  const response = await this.appUserManagerService.getAllAppUsers();
  if (isOkResponse(response)) {
    this.users = loadResponseData(response);
  } else {
    this.error = loadResponseError(response);
  }
  }
 async getAppUserById(id: number): Promise<void> {
  this.error = '';
  if (typeof id !== 'number' || id <= 0) {
    this.error = 'ID de usuario no válido.';
    return;
  }
   const response = await this.appUserManagerService.getAllAppUsers();
  if (isOkResponse(response)) {
    this.users = loadResponseData(response);
  } else {
    this.error = loadResponseError(response);
  }
  }
 async getAppUserByEmail(email: string): Promise<void> {
  this.error = '';
  if (typeof email !== 'string' || email.trim() === '') {
    this.error = 'Email de usuario no válido.';
    return;
  }
   const response = await this.appUserManagerService.getAppUserByEmail(email);
  if (isOkResponse(response)) {
    this.appUserSelected = loadResponseData(response);
  } else {
    this.error = loadResponseError(response);
  }
}
  async getAppUserByName(name: string): Promise<void> {
  this.error = '';
  if (typeof name !== 'string' || name.trim() === '') {
    this.error = 'Nombre de usuario no válido.';
    return;
  }
  const response = await this.appUserManagerService.getAppUserByName(name);
  if (isOkResponse(response)) {
    this.appUserSelected = loadResponseData(response);
  } else {
    this.error = loadResponseError(response);
  }
}
async deleteAppUserById(user: AppUser): Promise<void> {
  const id = user.id;
  if (typeof id !== 'number') {
    this.error = 'El usuario no tiene un ID válido.';
    return;
  }
  const confirmado = confirm(`¿Seguro que quieres eliminar al usuario "${user.name}"?`);
  if (!confirmado) return;

  const [error, response] = await this.appUserManagerService.deleteAppUserById(id);

  if (error) {
    console.error('Error al eliminar usuario:', error);
    this.error = loadResponseError(error);
    return;
  }

  if (isOkResponse(response)) {
    const fueEliminado = loadResponseData(response);
    if (fueEliminado === true) {
      alert('Usuario eliminado correctamente');
      await this.getAppUsers();
    } else {
      alert('No se pudo eliminar el usuario.');
    }
  } else {
    this.error = loadResponseError(response);
  }
}

  async createAppUser() {
    this.modePopup = 'CREAR';
  }
   async updateAppUser() {
    this.modePopup = 'ACTUALIZAR';
    }
  
    onClosePopupOk() {
      this.modePopup = 'CLOSED';
      this.getAppUsers();
    }
      onClosePopupCancel() {
      this.modePopup = 'CLOSED';
      }

}

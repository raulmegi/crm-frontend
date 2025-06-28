import { Component } from '@angular/core';
import { AppUserManagerService } from '../../../services/app-user-manager.service';
import to, { isOkResponse, loadResponseData, loadResponseError } from '../../../services/utils.service';
import { AppUser } from '../../model/appUser.model';
import { FormsModule} from '@angular/forms';
import { NgIf, NgForOf } from '@angular/common';
import { AppUserManagerPopupComponent } from '../app-user-manager-popup/app-user-manager-popup.component';
import { Role } from '../../model/role.model';
import { RoleService } from '../../../services/role.service';
import { firstValueFrom } from 'rxjs';
import ConstUrls from '../../shared/constants/const-urls';
import { headers } from '../../../services/utils.service';
import { HttpClient } from '@angular/common/http';
import { response } from 'express';
import ConstRoutes from '../../shared/constants/const-routes';

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
    appUserSelected: AppUser | null = null;
    modePopup: 'CLOSED' | 'CREAR' | 'ACTUALIZAR' = 'CLOSED';


  constructor(private appUserManagerService: AppUserManagerService,  private roleService: RoleService
) {}

  async ngOnInit() {
  await this.getAppUsers();

  // 1) Convert the Observable<Role[]> into a Promise<Role[]>
  const [ err, rolesList ] = await to(
    firstValueFrom(
      this.roleService.getAllRoles()   // <-- your method returns Observable<Role[]>
    )
  );

  // 2) Check for errors
  if (err) {
    this.error = loadResponseError(err);
    return;
  }

  // 3) Assign the plain array of roles
  this.roles = rolesList as Role[];
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
   const response = await this.appUserManagerService.getAppUserById(id);
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
async deleteAppUserById(user: AppUser | undefined  | null): Promise<void> {
  console.log('User received for deletion:', user); 
  const id = user?.id;
  if (!user || typeof id !== 'number' || id === 0) {
    this.error = 'El usuario no tiene un ID válido.';
    console.error('Invalid user or ID:', user);
    return;
  }

  const confirmado = confirm(`¿Seguro que quieres eliminar al usuario "${user.name}"?`);
  if (!confirmado) return;

  const [error, response] = await this.appUserManagerService.deleteAppUserById(user.id);

  if (error) {
    console.error('Error al eliminar usuario:', error);
    this.error = loadResponseError(error);
    return;
  }

  if (isOkResponse(response)) {
    const wasDeleted = loadResponseData(response);
    if (wasDeleted === true) {
      alert('Usuario eliminado correctamente');
      this.appUserSelected = null; 
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
   async updateAppUser(){ //(user: AppUser | undefined  | null): Promise<void>{
   // this.appUserSelected = user;
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
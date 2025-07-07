import { Component, OnInit } from '@angular/core';
import { AppUserManagerService } from '../../../services/app-user-manager.service';
import to, { isOkResponse, loadResponseData, loadResponseError,toTuple } from '../../../services/utils.service';
import { AppUser } from '../../model/appUser.model';
import { FormsModule } from '@angular/forms';
import { NgIf, NgForOf } from '@angular/common';
import { AppUserManagerPopupComponent } from '../app-user-manager-popup/app-user-manager-popup.component';
import { Role } from '../../model/role.model';
import { RoleService } from '../../../services/role.service';
import { Subject, firstValueFrom, debounceTime, takeUntil } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';




@Component({
  selector: 'app-app-user-manager',
  standalone: true,
  imports: [FormsModule, NgIf, NgForOf, MatFormFieldModule, AppUserManagerPopupComponent,
    MatInputModule, MatSelectModule, MatOptionModule, MatButtonModule, MatIconModule, MatDialogModule],
  templateUrl: './app-user-manager.component.html',
  styleUrls: ['./app-user-manager.component.css']
})
export class AppUserManagerComponent implements OnInit {
  user: AppUser = {
    id: 0,
    name: '',
    email: '',
    password: '',
    role: { id: 0, name: '' },
  };

  roles: Role[] = [];
  users: AppUser[] = [];
  filteredUsers: AppUser[] = [];
  error = '';
  appUserSelected: AppUser | null = null;
  modePopup: 'CLOSED' | 'CREAR' | 'ACTUALIZAR' = 'CLOSED';


  searchValue = '';
  searchType: 'id' | 'email' | 'name' = 'name';
  isLoading = false;
  sortColumn: keyof AppUser | '' = '';
  sortDirection: 'asc' | 'desc' = 'asc';


  constructor(
    private appUserManagerService: AppUserManagerService,
    private roleService: RoleService,
    private dialog: MatDialog
  ) { }

  async ngOnInit() {
    
    await this.getAppUsers();


    const [err, rolesList] = await toTuple(firstValueFrom(this.roleService.getAllRoles()));
    if (err) {
      this.error = 'Error cargando roles';
      return;
    }
    this.roles = rolesList ?? [];
  }



  async fetchFilteredUsers() {
    this.isLoading = true;
    const q = this.searchValue.trim().toLowerCase();


    if (!q) {
      this.filteredUsers = [];
      this.isLoading = false;
      return;
    }


    this.filteredUsers = this.users.filter(user => {
      const field = (user[this.searchType] ?? '').toString().toLowerCase();
      return field.includes(q);
    });

    this.isLoading = false;
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

async deleteAppUserById(user: AppUser | undefined | null): Promise<void> {
  const id = user?.id;
  if (!user || typeof id !== 'number' || id === 0) {
    this.error = 'El usuario no tiene un ID válido.';
    return;
  }

  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    data: {
      message: `¿Seguro que quieres eliminar al usuario <strong>"${user.name}"</strong>?`
    },
    width: '350px',
  });

  const confirmed = await dialogRef.afterClosed().toPromise();
  if (!confirmed) return;

  const [error, response] = await this.appUserManagerService.deleteAppUserById(id);

  if (error) {
    this.error = loadResponseError(error);
    return;
  }

  if (isOkResponse(response)) {
    const wasDeleted = loadResponseData(response);
    if (wasDeleted) {
      alert('Usuario eliminado correctamente');
      await this.getAppUsers();
      this.filteredUsers = [];
    } else {
      this.error = 'Error al borrar el usuario, puede que existan tareas asociadas.';
    }
  } else {
    const backendError =
      response?.body?.exception?.mensajeDeError ||
      response?.body?.exception?.message ||
      response?.body?.exception?.errorMessage ||
      response?.body?.mensajeDeError ||
      'Error al borrar el usuario, puede que existan tareas asociadas.';

    this.error = backendError;
  }
}

createAppUser() {
  this.modePopup = 'CREAR';
}

  updateAppUser() {
    this.modePopup = 'ACTUALIZAR';
  }

  onClosePopupOk() {
    this.modePopup = 'CLOSED';
    this.getAppUsers();
  }

  onClosePopupCancel() {
    this.modePopup = 'CLOSED';
  }

  get displayedUsers(): AppUser[] {
    return this.searchValue.trim() ? this.filteredUsers : this.users;
  }

  trackByUserId(index: number, user: AppUser): number {
    return user.id;
  }

  onSort(column: keyof AppUser) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    const sortFn = (a: AppUser, b: AppUser) => {
      const aVal = (a[column] ?? '').toString().toLowerCase();
      const bVal = (b[column] ?? '').toString().toLowerCase();
      return this.sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    };

    const dataToSort = this.searchValue.trim() ? this.filteredUsers : this.users;
    const sorted = [...dataToSort].sort(sortFn);

    if (this.searchValue.trim()) {
      this.filteredUsers = sorted;
    } else {
      this.users = sorted;
    }
  }

  clearSearch() {
    this.searchValue = '';
    this.filteredUsers = [];
  }
}



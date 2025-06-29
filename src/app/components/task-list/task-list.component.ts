import { Component, OnInit } from '@angular/core';
import { Task, TaskStatus } from '../../model/task.model';
import { TaskService } from '../../../services/task.service';
import { BrandService } from '../../../services/brand.service';
import {
  isOkResponse,
  loadResponseData,
  loadResponseError
} from '../../../services/utils.service';
import { TaskPopupComponent } from '../task-popup/task-popup.component';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { AppUser } from '../../model/appUser.model';
import { AppUserManagerService } from '../../../services/app-user-manager.service';
import { ModelMap } from '../../model/modelMap.model';
import { HttpResponse } from '@angular/common/http';
import { Customer } from '../../model/customer.model';
import { Brand } from '../../model/brand.model';
import { CustomerService } from '../../../services/customer.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
  standalone: true,
  imports: [FormsModule, NgForOf, NgIf, TaskPopupComponent]
})
export class TaskListComponent implements OnInit {
  // ✅ Propiedades necesarias
  private allTasks: Task[] = [];
  tasks: Task[] = [];
  users: AppUser[] = [];
  customers: Customer[] = [];
  brands: Brand[] = [];
  selectedUserId: number | null = null;
  tareaSeleccionada: Task | null = null;
  selectedCustomerId: number | null = null;
  brandSeleccionadaId: number | null = null;
  error = '';
  modoPopup: 'CLOSED' | 'CREAR' | 'EDITAR' = 'CLOSED';
  estados: TaskStatus[] = ['PENDIENTE','EN_CURSO','COMPLETADA'];
  estadoFiltro: TaskStatus | '' = '';

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private userService: AppUserManagerService,
    private brandService: BrandService,
    private customerService: CustomerService
  ) {}

  async ngOnInit(): Promise<void> {
  await this.cargarTareas();
  await this.loadUsers();
  await this.loadCustomers();
}

 private async cargarTareas(): Promise<void> {
    this.error = '';
    const response = await this.taskService.getTasks();
    if (isOkResponse(response)) {
      this.allTasks = loadResponseData(response);
      this.applyFilters();
    } else {
      this.error = loadResponseError(response);
    }
  }

  private async loadUsers() {
    try {
    const result = await this.userService.getAllAppUsers();
    if (Array.isArray(result)) {
      console.error('Error cargando usuarios', result[0]);
    } else if (isOkResponse(result)) {
      this.users = loadResponseData(result) as AppUser[];
    } else {
      console.error('Error cargando usuarios', loadResponseError(result));
    }
  } catch (e) {
    console.error('Error inesperado cargando usuarios', e);
  }
  }

  private async loadCustomers() {
    try {
      const list = await this.customerService.getCustomers().toPromise();
      this.customers = list || [];
    } catch (err) {
      console.error('Error cargando clientes', err);
    }
  }

  applyFilters(): void {
    this.tasks = this.allTasks.filter(task => {
      return (
        // filtro por usuario, si hay uno seleccionado
        (!this.selectedUserId || task.user?.id === this.selectedUserId)
        // filtro por cliente
        && (!this.selectedCustomerId || task.customer?.id === this.selectedCustomerId)
        // filtro por estado
        && (!this.estadoFiltro || task.status === this.estadoFiltro)
      );
    });
  }

  filtrarPorUser() {
    this.applyFilters();
  }
  filtrarPorCustomer() {
    this.applyFilters();
  }
  filtrarPorEstado() {
    this.applyFilters();
  }

//   async filtrarPorUser() {
//     if (!this.selectedUserId) {
//       return this.cargarTareas();
//     }
//     this.error = '';
//     const result = await this.taskService.getTasksByUser(this.selectedUserId);
//     if (Array.isArray(result)) {
//       this.error = result[0]?.message || 'Error filtrando tareas';
//       return;
//     }
//     const resp = result as HttpResponse<ModelMap<Task[]>>;
//     if (isOkResponse(resp)) {
//       this.tasks = resp.body!.data ?? [];
//     } else {
//       this.error = loadResponseError(resp);
//     }
//   }

//   async filtrarPorCustomer() {
//     if (!this.selectedCustomerId) {
//       return this.cargarTareas();
//     }
//     this.error = '';
//     const result = await this.taskService.getTasksByCustomer(this.selectedCustomerId);
//     if (Array.isArray(result)) {
//       this.error = result[0]?.message || 'Error filtrando tareas';
//       return;
//     }
//     const resp = result as HttpResponse<ModelMap<Task[]>>;
//     if (isOkResponse(resp)) {
//       this.tasks = resp.body!.data ?? [];
//     } else {
//       this.error = loadResponseError(resp);
//     }
//   }

// async filtrarPorEstado(): Promise<void> {
//   this.error = '';
//   if (!this.estadoFiltro) {
//     return this.cargarTareas();
//   }

//   const result = await this.taskService.getTasksByStatus(this.estadoFiltro);
//   if (Array.isArray(result)) {
//     const err = result[0];
//     this.error = err?.message || 'Error al filtrar tareas.';
//     return;
//   }

//   if (isOkResponse(result)) {
//     this.tasks = loadResponseData(result);
//   } else {
//     this.error = loadResponseError(result);
//   }
// }

  crearTarea() {
    this.tareaSeleccionada = null;
    this.modoPopup = 'CREAR';
  }

  editarTarea(task: Task) {
    this.tareaSeleccionada = task;
    this.modoPopup = 'EDITAR';
  }

  async eliminarTarea(task: Task): Promise<void> {
  const id = task.id;
  if (typeof id !== 'number') {
    this.error = 'La tarea no tiene ID válido.';
    return;
  }

  if (confirm(`¿Seguro que quieres eliminar la tarea "${task.title}"?`)) {
    const response = await this.taskService.deleteTask(id);
    if (isOkResponse(response)) {
      const fueEliminada = loadResponseData(response);
      if (fueEliminada === true) {
        alert('Tarea eliminada correctamente');
      }
      await this.cargarTareas();
    } else {
      this.error = loadResponseError(response);
    }
  }
}


  // ✅ Métodos para el popup
  async onPopupGuardado() {
    await this.cargarTareas();
    this.modoPopup = 'CLOSED';
  }

  onPopupCancelado() {
    this.modoPopup = 'CLOSED';
  }

  logout() {
    this.authService.logout();
  }
}

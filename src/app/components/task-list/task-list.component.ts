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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { TaskDetailsComponent } from '../task-details/task-details.component';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
  standalone: true,
  imports: [FormsModule, NgForOf, NgIf, TaskPopupComponent, MatDatepickerModule, MatFormFieldModule, MatInputModule, MatNativeDateModule, MatInputModule,
    MatSelectModule,
    MatNativeDateModule, MatDialogModule]
})
export class TaskListComponent implements OnInit {
  showActionsModal = false;
  actionTask: Task | null = null;
  private allTasks: Task[] = [];
  tasks: Task[] = [];
  users: AppUser[] = [];
  customers: Customer[] = [];
  brands: Brand[] = [];
  selectedUserId: number | null = null;
  tareaSeleccionada: Task | null = null;
  selectedCustomerId: number | null = null;
  brandSeleccionadaId: number | null = null;
  filtroEndDate: string = '';
  fechaFiltro: Date | null = null;
  error = '';
  modoPopup: 'CLOSED' | 'CREAR' | 'EDITAR' = 'CLOSED';
  estados: TaskStatus[] = ['PENDIENTE', 'EN_CURSO', 'COMPLETADA'];
  estadoFiltro: TaskStatus | '' = '';

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private userService: AppUserManagerService,
    private brandService: BrandService,
    private customerService: CustomerService,
    private dialog: MatDialog
  ) { }

  async ngOnInit(): Promise<void> {
    await this.cargarTareas();
    await this.loadUsers();
    await this.loadCustomers();
    await this.loadBrands();
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
      } else if (isOkResponse(result)) {
        this.users = loadResponseData(result) as AppUser[];
      } else {
      }
    } catch (e) {
    }
  }

  private async loadCustomers() {
    try {
      const list = await this.customerService.getCustomers().toPromise();
      this.customers = list || [];
    } catch (err) {
    }
  }

  private async loadBrands() {
    this.error = '';
    const response = await this.brandService.getAllBrands();
    if (isOkResponse(response)) {
      this.brands = loadResponseData(response);
    } else {
      this.brands = [];
      this.brandSeleccionadaId = null;
      this.error = loadResponseError(response);
    }
  }

  applyFilters(): void {
    this.tasks = this.allTasks.filter(task => {
      return (
        (!this.selectedUserId || task.user?.id === this.selectedUserId)
        && (!this.selectedCustomerId || task.customer?.id === this.selectedCustomerId)
        && (!this.estadoFiltro || task.status === this.estadoFiltro)
        && (!this.filtroEndDate || task.endDate! >= this.filtroEndDate)
        && (!this.fechaFiltro || (task.endDate ?? '') >= this.fechaFiltro.toISOString().slice(0, 10))
        && (!this.brandSeleccionadaId || task.brand?.id === this.brandSeleccionadaId)
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
  filtrarPorEndDate() {
    this.applyFilters();
  }
  filtrarPorFechaFin() {
    this.applyFilters();
  }
  filtrarPorBrand() {
    this.applyFilters();
  }

  openActionsModal(task: Task) {
    this.actionTask = task;
    this.showActionsModal = true;
  }
  closeActionsModal() {
    this.showActionsModal = false;
    this.actionTask = null;
  }

  trackById(index: number, item: Task) {
    return item.id;
  }

  crearTarea() {
    this.tareaSeleccionada = null;
    this.modoPopup = 'CREAR';
  }

  editarTarea(task: Task) {
    this.closeActionsModal();
    this.tareaSeleccionada = task;
    this.modoPopup = 'EDITAR';
  }

  async eliminarTarea(task: Task): Promise<void> {
    const id = task.id;
    if (typeof id !== 'number') {
      this.error = 'La tarea no tiene ID válido.';
      return;
    }
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: `¿Seguro que quieres eliminar la tarea <strong>"${task.title}"</strong>?`
      },
      width: '350px',
    });

    dialogRef.afterClosed().subscribe(async (confirmed) => {
      if (confirmed) {
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
    });
  }

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
  viewTask(task: Task) {
    const dialogRef = this.dialog.open(TaskDetailsComponent, {
      data: task,
      width: '400px',
    });

    dialogRef.componentInstance.edit.subscribe((taskToEdit: Task) => {
      this.modoPopup = 'EDITAR';
      this.tareaSeleccionada = taskToEdit;
    });
  }

}

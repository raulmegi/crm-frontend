import { Component, OnInit } from '@angular/core';
import { Task } from '../../model/task.model';
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

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
  standalone: true,
  imports: [NgForOf, NgIf, TaskPopupComponent]
})
export class TaskListComponent implements OnInit {
  // ✅ Propiedades necesarias
  
  tasks: Task[] = [];
  error = '';
  tareaSeleccionada: Task | null = null;
  modoPopup: 'CLOSED' | 'CREAR' | 'EDITAR' = 'CLOSED';

  constructor(private taskService: TaskService, private authService: AuthService) {}

  async ngOnInit(): Promise<void> {
  await this.cargarTareas();
}

async cargarTareas(): Promise<void> {
  this.error = '';
  const response = await this.taskService.getTasks();
  if (isOkResponse(response)) {
    this.tasks = loadResponseData(response);
  } else {
    this.error = loadResponseError(response);
  }
}


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

import { Component, OnInit } from '@angular/core';
import { CommonModule, NgForOf } from '@angular/common';
import { Task } from '../../model/task.model';
import { TaskService } from '../../../services/task.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { TaskPopupComponent } from '../task-popup/task-popup.component';


@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule, NgForOf, FormsModule, TaskPopupComponent],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  tareaSeleccionada: Task | null = null;
  modoPopup: 'CLOSED' | 'CREAR' | 'EDITAR' = 'CLOSED';

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.cargarTareas();
  }

  cargarTareas(): void {
    this.taskService.getTasks().subscribe({
      next: (data) => this.tasks = data,
      error: (err) => console.error('Error al obtener las tareas:', err)
    });
  }

  crearTarea(): void {
    this.tareaSeleccionada = null;
    this.modoPopup = 'CREAR';
  }

  editarTarea(task: Task): void {
    this.tareaSeleccionada = task;
    this.modoPopup = 'EDITAR';
  }

  async onPopupGuardado() {
    this.modoPopup = 'CLOSED';
    this.cargarTareas();
  }

  onPopupCancelado() {
    this.modoPopup = 'CLOSED';
  }

  eliminarTarea(task: Task): void {
    if (confirm(`¿Seguro que deseas borrar la tarea "${task.title}"?`)) {
      this.taskService.deleteTask(task.id!).subscribe(() => this.cargarTareas());
    }
  }
}




import { Component, OnInit } from '@angular/core';
import { CommonModule, NgForOf } from '@angular/common';
import { Task } from '../../model/task.model';
import { TaskService } from '../../../services/task.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule,HttpClientModule,NgForOf],
  templateUrl: './task-list.component.html',
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];

  constructor(private taskService: TaskService) {}

ngOnInit(): void {
   console.log('ngOnInit ejecutado');
  this.taskService.getTasks().subscribe({
    next: (data) => {
      console.log('Tareas recibidas:', data);
      this.tasks = data; // ya viene con userId y customerId en el modelo simplificado
    },
    error: (err) => {
      console.error('Error al obtener las tareas:', err);
    }
  });
}
}



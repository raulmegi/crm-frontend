import { Component, OnInit } from '@angular/core';
import { CommonModule, NgForOf } from '@angular/common';
import { Task } from '../../model/task.model';
import { TaskService } from '../../../services/task.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule,HttpClientModule,NgForOf,FormsModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  nuevaTask: Task = {
  title: '',
  description: '',
  status: 'PENDIENTE',
  user: { id: 1 },        // puedes poner valores por defecto si quieres
  customer: { id: 1 }, // Asignar un customerId por defecto
};

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
crearTarea(): void {
  this.taskService.createTask(this.nuevaTask).subscribe({
    next: (tareaCreada) => {
      this.tasks.push(tareaCreada);
      // Limpiar formulario
      this.nuevaTask = {
        title: '',
        description: '',
        status: 'PENDIENTE',
        user: { id: 1 },
        customer: { id: 1 },
      };
    },
    error: (err) => {
      console.error('Error al crear la tarea:', err);
    }
  });
}
}

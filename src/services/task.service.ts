import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task, TaskStatus } from '../app/model/task.model';



@Injectable({
  providedIn: 'root',
})
export class TaskService {
  
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8081/tasks';

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl + '/listarTareas');
  }

  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl+ '/crearTarea', task );
  }

deleteTask(id: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl + '/eliminarTarea'}/${id}`);
}

  updateTask(task: Task): Observable<Task> {
  return this.http.put<Task>(this.apiUrl + '/actualizarTarea', task);
}
}
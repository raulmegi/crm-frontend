import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Task {
  id?: number;
  title: string;
  description?: string;
  initialDate?: string;
  endDate?: string;
  status: 'PENDIENTE' | 'EN_CURSO' | 'COMPLETADA';
}



@Injectable({
  providedIn: 'root',
})
export class TaskService {
  
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8081/tasks/listarTareas';

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
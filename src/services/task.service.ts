import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task, TaskStatus } from '../app/model/task.model';
import ConstUrls from '../app/shared/constants/const-urls';
import to, { headers } from './utils.service';



@Injectable({
    providedIn: 'root',
})
export class TaskService {

    constructor(private http: HttpClient) { }
    private TASK_URL = ConstUrls.API_URL + '/tasks';

    async getTasks() {
        return await to(
            this.http
                .get<Task[]>(this.TASK_URL + '/listarTareas', {
                    headers: headers,
                    withCredentials: true,
                    observe: "response"
                })
                .toPromise()
        )
    }

    async createTask(task: Task) {
        return await to(
            this.http
                .post<Task>(this.TASK_URL + '/crearTarea', task, {
                    headers: headers,
                    observe: "response",
                })
                .toPromise()
        )
    }

    async deleteTask(id: number) {
        return await to(
            this.http
                .delete<boolean>(this.TASK_URL + '/eliminarTarea/' + id, {
                    headers: headers,
                    observe: "response"
                })
                .toPromise()
        )
    }

    async updateTask(task: Task) {
        return await to(
            this.http
                .put<Task>(this.TASK_URL + '/actualizarTarea', task, {
                    headers: headers,
                    observe: "response",
                })
                .toPromise()
        )
    }

    async getTaskById(id: number) {
        return await to(
            this.http
                .get<Task>(this.TASK_URL + '/encontrarPorId/' + id, {
                    headers: headers,
                    observe: "response"
                })
                .toPromise()
        )
    }

    async getTasksByStatus(status: string) {
        return await to(
            this.http
                .get<any[]>(`${this.TASK_URL}/estado/${status}`, {
                    headers,
                    observe: 'response'
                })
                .toPromise()
        );
    }

    async getTasksByUser(userId: number) {
        return await to(
            this.http
                .get<Task[]>(`${this.TASK_URL}/usuario/${userId}`, {
                    headers,
                    observe: 'response'
                })
                .toPromise()
        );
    }

    async getTasksByCustomer(customerId: number) {
        return await to(
            this.http
                .get<any[]>(`${this.TASK_URL}/cliente/${customerId}`, {
                    headers,
                    observe: 'response'
                })
                .toPromise()
        );
    }
}
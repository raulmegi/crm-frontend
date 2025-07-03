// src/app/components/layout/home-page/home-page.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { TaskService } from '../../../../services/task.service';
import { isOkResponse, loadResponseData, loadResponseError } from '../../../../services/utils.service';
import { Task } from '../../../model/task.model';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { TaskPopupComponent } from '../../task-popup/task-popup.component';

// Angular Material
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatCardModule }        from '@angular/material/card';
import { NgChartsModule }       from 'ng2-charts';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NgForOf,
    NgIf,

    DashboardComponent,
    TaskPopupComponent,
    NgChartsModule,

    // Material
    MatCardModule,
    MatPaginatorModule,
  ],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent implements OnInit {
  inProgressTasks: Task[] = [];
  error = '';

  // Popup
  selectedTask: Task | null = null;
  modoPopup: 'CREAR' | 'EDITAR' | 'CLOSED' = 'CLOSED';

  // Contadores
  counts = { pendiente: 0, enCurso: 0, completada: 0, vencidas: 0 };
  today = new Date();

  // Paginación
  pageSize = 5;
  pageIndex = 0;
  pageSizeOptions = [5];  // sólo 5 por página

  constructor(private taskService: TaskService) {}

  async ngOnInit(): Promise<void> {
    await this.loadCounts();
    await this.loadInProgressTasks();
  }

  private async loadCounts() {
    const resp = await this.taskService.getTasks();
    if (!isOkResponse(resp)) return;
    const tasks = loadResponseData(resp) as Task[];

    this.counts.pendiente  = tasks.filter(t => t.status === 'PENDIENTE').length;
    this.counts.enCurso    = tasks.filter(t => t.status === 'EN_CURSO').length;
    this.counts.completada = tasks.filter(t => t.status === 'COMPLETADA').length;
    this.counts.vencidas   = tasks
      .filter(t => t.endDate && new Date(t.endDate) < this.today && t.status !== 'COMPLETADA')
      .length;
  }

  private async loadInProgressTasks() {
    this.error = '';
    const resp = await this.taskService.getTasks();
    if (!isOkResponse(resp)) {
      this.error = loadResponseError(resp);
      return;
    }
    const all = loadResponseData(resp) as Task[];
    this.inProgressTasks = all.filter(t => t.status === 'EN_CURSO');
  }

  // Sólo los items de la página actual
  get pagedTasks(): Task[] {
    const start = this.pageIndex * this.pageSize;
    return this.inProgressTasks.slice(start, start + this.pageSize);
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize  = event.pageSize;
  }

  editarEnHome(task: Task) {
    this.selectedTask = task;
    this.modoPopup    = 'EDITAR';
  }

  async onPopupGuardado() {
    this.modoPopup    = 'CLOSED';
    this.selectedTask = null;
    await this.loadInProgressTasks();
  }

  onPopupCancelado() {
    this.modoPopup    = 'CLOSED';
    this.selectedTask = null;
  }
    trackById(index: number, item: Task) {
    return item.id;
  }
}

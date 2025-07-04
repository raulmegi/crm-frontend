import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { TaskService } from '../../../../services/task.service';
import { isOkResponse, loadResponseData, loadResponseError } from '../../../../services/utils.service';
import { Task } from '../../../model/task.model';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-task-calendar',
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './task-calendar.component.html',
  styleUrls: ['./task-calendar.component.css']
})
export class TaskCalendarComponent implements OnInit, OnDestroy {
  @Output() taskClick = new EventEmitter<Task>();
  error = '';
  private routerSub?: Subscription;
  calendarOptions?: CalendarOptions;

  constructor(private taskService: TaskService, private router: Router) {}

  async ngOnInit() {
    await this.loadTasksFromService();
    this.routerSub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.loadTasksFromService();
      });
  }

  ngOnDestroy() {
    this.routerSub?.unsubscribe();
  }

   async loadTasksFromService() {
    try {
      const response = await this.taskService.getTasks();

      if (!isOkResponse(response)) {
        this.error = loadResponseError(response);
        console.error('Error response:', this.error);
        return;
      }

      const tasks = loadResponseData(response) as Task[];

      // Filtrar solo las tareas con fecha
      const events = tasks
        .filter(t => !!t.endDate)
        .map(t => ({
          id: String(t.id),
          title: t.title,
          start: t.endDate,
          color: this.getStatusColor(t.status),
          extendedProps: { task: t }
        }));

      // IMPORTANTE: crea SIEMPRE un nuevo objeto para calendarOptions
      this.calendarOptions = {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        events,
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: ''
        },
        eventClick: this.onEventClick.bind(this)
      };
    } catch (err) {
      console.error('Error cargando tareas para calendario:', err);
      this.error = 'No se pudo cargar el calendario';
    }
  }

  private getStatusColor(status: string): string {
    switch (status) {
      case 'PENDIENTE': return '#ffc107';    // amarillo
      case 'EN_CURSO': return '#007bff';     // azul
      case 'COMPLETADA': return '#28a745';   // verde
      default: return '#6c757d';             // gris neutro
    }
  }

  private onEventClick(info: any) {
    const task = info.event.extendedProps.task as Task;
    this.taskClick.emit(task);
  }
}
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Task, TaskStatus } from '../../model/task.model';
import { TaskService } from '../../../services/task.service';
import { isOkResponse, loadResponseError } from '../../../services/utils.service';
import to from '../../../services/utils.service';
import { Customer } from '../../model/customer.model';
import { CustomerService } from '../../../services/customer.service';

@Component({
  selector: 'app-task-popup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-popup.component.html',
  styleUrls: ['./task-popup.component.css']
})
export class TaskPopupComponent implements OnInit {
  @Input() task: Task | null = null;
  @Input() modo: 'CREAR' | 'EDITAR' = 'CREAR';
  @Output() guardado = new EventEmitter<void>();
  @Output() cancelado = new EventEmitter<void>();

  form!: FormGroup;
  error = '';
  estados: TaskStatus[] = ['PENDIENTE', 'EN_CURSO', 'COMPLETADA'];
  customers: Customer[] = [];

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private customerService: CustomerService
  ) {}

  async ngOnInit(): Promise<void> {

    this.form = this.fb.group({
      title: [this.task?.title || '', Validators.required],
      description: [this.task?.description || ''],
      initialDate: [this.task?.initialDate || ''],
      endDate: [this.task?.endDate || ''],
      status: [this.task?.status || 'PENDIENTE', Validators.required],
      userId: [this.task?.user?.id || 1, Validators.required],
      customerId: [this.task?.customer?.id || null, Validators.required]
    });

    try {
      const list = await this.customerService.getCustomers().toPromise();
      this.customers = list || [];
    } catch (err) {
      console.error('Error cargando clientes', err);
    }

    if (this.modo === 'EDITAR' && this.task?.customer?.id) {
      this.form.patchValue({ customerId: this.task.customer.id });
    }
  }

  onCancel(): void {
    this.cancelado.emit();
  }

  async onSubmit(): Promise<void> {
    this.error = '';
    if (this.form.invalid) {
      this.error = 'Por favor, completa los campos obligatorios.';
      return;
    }

    const { title, description, initialDate, endDate, status, userId, customerId } = this.form.value;

    const nuevaTarea: Task = {
      ...this.task,
      title,
      description,
      initialDate,
      endDate,
      status,
      user: { id: userId },
      customer: {
        id: customerId,
        name: ''
      }
    };

    try {
      // 2) Llamada directa al servicio (ya devuelve el HttpResponse o arroja)
      let response: any;
      if (this.modo === 'CREAR') {
        response = await this.taskService.createTask(nuevaTarea);
      } else {
        response = await this.taskService.updateTask(nuevaTarea);
      }

      // 3) Si devuelve un array, es un error capturado por `to` internamente
      if (Array.isArray(response)) {
        const err = response[0];
        this.error = err?.message || 'Error guardando la tarea.';
        return;
      }

      // 4) Validamos la respuesta
      if (!isOkResponse(response)) {
        this.error = loadResponseError(response);
        return;
      }

      // 5) Emitimos el evento y el TaskListComponent se encargará de recargar y cerrar
      this.guardado.emit();

    } catch (e: any) {
      this.error = e?.message || 'Error inesperado.';
    }
  }
  
}

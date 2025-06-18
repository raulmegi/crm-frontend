import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Task, TaskStatus } from '../../model/task.model';
import { TaskService } from '../../../services/task.service';
import {
  isOkResponse,
  loadResponseData,
  loadResponseError
} from '../../../services/utils.service';
import to from '../../../services/utils.service';

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

  constructor(private fb: FormBuilder, private taskService: TaskService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      title: [this.task?.title || '', Validators.required],
      description: [this.task?.description || ''],
      initialDate: [this.task?.initialDate || ''],
      endDate: [this.task?.endDate || ''],
      status: [this.task?.status || 'PENDIENTE', Validators.required],
      userId: [this.task?.user?.id || 1, Validators.required],
      customerId: [this.task?.customer?.id || 1, Validators.required],
    });
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

    const formValue = this.form.value;

    const nuevaTarea: Task = {
      ...this.task,
      title: formValue.title,
      description: formValue.description,
      initialDate: formValue.initialDate,
      endDate: formValue.endDate,
      status: formValue.status,
      user: { id: formValue.userId },
      customer: { id: formValue.customerId },
    };

    const request = this.modo === 'CREAR'
      ? this.taskService.createTask(nuevaTarea)
      : this.taskService.updateTask(nuevaTarea);

    const [err, response] = await to(request);

    if (err || !response || !isOkResponse(response)) {
      this.error = loadResponseError(response);
      return;
    }
    this.guardado.emit();
  }
}

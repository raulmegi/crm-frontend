import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Task, TaskStatus } from '../../model/task.model';
import { TaskService } from '../../../services/task.service';
import { isOkResponse, loadResponseError } from '../../../services/utils.service';
import to from '../../../services/utils.service';
import { Customer } from '../../model/customer.model';
import { CustomerService } from '../../../services/customer.service';
import { Brand } from '../../model/brand.model';
import { BrandService } from '../../../services/brand.service';
import { HttpResponse } from '@angular/common/http';
import { ModelMap } from '../../model/modelMap.model';

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
  brands: Brand[] = [];

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private customerService: CustomerService,
    private brandService: BrandService
  ) {}

  async ngOnInit(): Promise<void> {

    this.form = this.fb.group({
      title: [this.task?.title || '', Validators.required],
      description: [this.task?.description || ''],
      initialDate: [this.task?.initialDate || ''],
      endDate: [this.task?.endDate || ''],
      status: [this.task?.status || 'PENDIENTE', Validators.required],
      userId: [this.task?.user?.id || 1, Validators.required],
      customerId: [this.task?.customer?.id || null, Validators.required],
      brandId: [this.task?.brand?.id || null, Validators.required]
    });

    try {
      const list = await this.customerService.getCustomers().toPromise();
      this.customers = list || [];
    } catch (err) {
      console.error('Error cargando clientes', err);
    }
try {
    // 1. Llamas al servicio y guardas el resultado
    const result = await this.brandService.getAllBrands();

    let err: any;
    let httpResp: HttpResponse<ModelMap<Brand[]>>;

    if (Array.isArray(result)) {
      // Viene [error, response]
      [err, httpResp] = result;
    } else {
      // Viene solo el HttpResponse
      err = null;
      httpResp = result as HttpResponse<ModelMap<Brand[]>>;
    }

    // 2. Comprueba y extrae el array real de marcas
    if (err) {
      console.error('Error cargando marcas:', err);
    } else {
      const payload = httpResp.body!;
      if (payload.type === 'OK' && Array.isArray(payload.data)) {
        this.brands = payload.data;
      } else {
        console.warn('Respuesta inesperada al cargar marcas:', payload);
        this.brands = [];
      }
    }
  } catch (e) {
    console.error('Error inesperado cargando marcas', e);
  }



    if (this.modo === 'EDITAR' && this.task?.customer?.id && this.task?.brand?.id) {
      this.form.patchValue({ customerId: this.task.customer.id });
      this.form.patchValue({ brandId: this.task.brand.id });
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

    const { title, description, initialDate, endDate, status, userId, customerId, brandId } = this.form.value;

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
      },
      brand: {
        id: brandId,
        name: ''
      }
    };

    try {

      let response: any;
      if (this.modo === 'CREAR') {
        response = await this.taskService.createTask(nuevaTarea);
      } else {
        response = await this.taskService.updateTask(nuevaTarea);
      }


      if (Array.isArray(response)) {
        const err = response[0];
        this.error = err?.message || 'Error guardando la tarea.';
        return;
      }


      if (!isOkResponse(response)) {
        this.error = loadResponseError(response);
        return;
      }

      this.guardado.emit();

    } catch (e: any) {
      this.error = e?.message || 'Error inesperado.';
    }
  }
  
}

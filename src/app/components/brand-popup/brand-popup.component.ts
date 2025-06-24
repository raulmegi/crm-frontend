import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Brand } from '../../model/brand.model';
import { BrandService } from '../../../services/brand.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-brand-popup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './brand-popup.component.html',
  styleUrls: ['./brand-popup.component.css']
})
export class BrandPopupComponent implements OnInit {
  @Input() brand?: Brand;
  @Output() cerrarPopUpOk = new EventEmitter<void>();
  @Output() cerrarPopUpCancel = new EventEmitter<void>();

  brandForm: FormGroup;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private brandService: BrandService
  ) {
    this.brandForm = this.fb.group({
      name: [''],
      taskId: [0]
    });
  }

  ngOnInit(): void {
    if (this.brand) {
      this.brandForm.patchValue({
        name: this.brand.name,
        taskId: this.brand.task?.id ?? 0
      });
    }
  }

  getForm(): Brand {
    const formData = this.brandForm.value;
    const brand: any = {
      name: formData.name,
      task: { id: formData.taskId }
    };
    if (this.brand?.id) {
      brand.id = this.brand.id;
    }
    return brand;
  }

  async guardar() {
    try {
      const brand = this.getForm();
      const accion = this.brand?.id
        ? this.brandService.updateBrand(brand)
        : this.brandService.createBrand(brand);

      await accion;
      this.cerrarPopUpOk.emit();
    } catch (error) {
      console.error('Error guardando marca', error);
      this.error = this.brand?.id
        ? 'Error al actualizar la marca.'
        : 'Error al crear la marca.';
    }
  }

  cancelar(): void {
    this.cerrarPopUpCancel.emit();
  }
}
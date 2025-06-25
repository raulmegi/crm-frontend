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
  @Input() brandId!: number;
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

  async ngOnInit() {
    if (this.brandId && this.brandId !== 0) {
      const brand = await this.brandService.getBrandById(this.brandId);
      if (brand) {
      this.brandForm.patchValue({
        name: brand.name,
        taskId: brand.task?.id ?? 0
      });
    }
  }
  }
  getForm(): Brand {
    const formData = this.brandForm.value;
    const brand: any = {
      name: formData.name,
      task: { id: formData.taskId }
    };
    if (this.brandId !== 0) {
      brand.id = this.brandId;
    }
    return brand;
  }

  async guardar() {
    try {
      const brand = this.getForm();
      const accion = this.brandId === 0
        ? this.brandService.createBrand(brand)
        : this.brandService.updateBrand(brand);

      await accion;
      this.cerrarPopUpOk.emit();
    } catch (error) {
      console.error('Error guardando marca', error);
      this.error = this.brandId === 0
        ? 'Error al actualizar la marca.'
        : 'Error al crear la marca.';
    }
  }

  cancelar(): void {
    this.cerrarPopUpCancel.emit();
  }
}
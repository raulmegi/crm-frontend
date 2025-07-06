import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Brand } from '../../model/brand.model';
import { BrandService } from '../../../services/brand.service';

@Component({
  selector: 'app-brand-popup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './brand-popup.component.html',
  styleUrls: ['./brand-popup.component.css']
})
export class BrandPopupComponent implements OnInit {
  @Input() brandId!: number;
  @Input() brands: Brand[] = [];
  @Output() cerrarPopUpOk = new EventEmitter<void>();
  @Output() cerrarPopUpCancel = new EventEmitter<void>();

  brandForm: FormGroup;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private brandService: BrandService
  ) {
    this.brandForm = this.fb.group({
      name: ['', Validators.required],
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
      name: formData.name.trim(),
      task: { id: formData.taskId }
    };
    if (this.brandId !== 0) {
      brand.id = this.brandId;
    }
    return brand;
  }

  nameAlreadyExists(name: string): boolean {
    return this.brands.some(
      b => b.name.trim().toLowerCase() === name.trim().toLowerCase() && b.id !== this.brandId
    );
  }

  async guardar() {
    this.error = null;
    const name = this.brandForm.get('name')?.value.trim();

    if (!name) {
      this.error = 'El nombre es obligatorio.';
      return;
    }

    if (this.nameAlreadyExists(name)) {
      this.error = 'Ya existe una marca con este nombre.';
      return;
    }

    try {
      const brand = this.getForm();
      const accion = this.brandId === 0
        ? this.brandService.createBrand(brand)
        : this.brandService.updateBrand(brand);

      await accion;
      this.cerrarPopUpOk.emit();
    } catch (error) {
      this.error = this.brandId === 0
        ? 'Error al crear la marca.'
        : 'Error al actualizar la marca.';
    }
  }

  cancelar(): void {
    this.cerrarPopUpCancel.emit();
  }
}
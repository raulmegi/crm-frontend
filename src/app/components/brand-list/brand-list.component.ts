import { Component, OnInit } from '@angular/core';
import { Brand } from '../../model/brand.model';
import { BrandService } from '../../../services/brand.service';
import {
  isOkResponse,
  loadResponseData,
  loadResponseError
} from '../../../services/utils.service';
import { CommonModule, NgIf, NgForOf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-brand-list',
  standalone: true,
  templateUrl: './brand-list.component.html',
  styleUrls: ['./brand-list.component.css'],
  imports: [CommonModule, FormsModule, NgIf, NgForOf],
})
export class BrandListComponent implements OnInit {
  brands: Brand[] = [];
  error = '';
  nuevaMarca: Brand = {
    id: 0,
    name: '',
    task: null as any  // Ajusta según tu modelo
  };

  constructor(private brandService: BrandService) {}

  async ngOnInit(): Promise<void> {
    await this.cargarMarcas();
  }

  async cargarMarcas(): Promise<void> {
    this.error = '';
    const response = await this.brandService.getAllBrands();
    if (isOkResponse(response)) {
      this.brands = loadResponseData(response);
    } else {
      this.error = loadResponseError(response);
    }
  }

  async crearMarca(): Promise<void> {
    if (!this.nuevaMarca.name.trim()) {
      alert('El nombre no puede estar vacío');
      return;
    }

    const response = await this.brandService.createBrand(this.nuevaMarca);
    if (isOkResponse(response)) {
      const marcaCreada = loadResponseData(response);
      this.brands.push(marcaCreada);
      this.nuevaMarca = { id: 0, name: '', task: null as any };
    } else {
      this.error = loadResponseError(response);
    }
  }

  async eliminarMarca(id: number): Promise<void> {
    if (!confirm('¿Estás seguro de eliminar esta marca?')) return;

    const response = await this.brandService.deleteBrand(id);
    if (isOkResponse(response)) {
      const fueEliminada = loadResponseData(response);
      if (fueEliminada === true) {
        alert('Marca eliminada correctamente');
        await this.cargarMarcas();
      }
    } else {
      this.error = loadResponseError(response);
    }
  }
}
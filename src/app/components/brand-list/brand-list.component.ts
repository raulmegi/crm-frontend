import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrandService } from '../../services/brand.service';
import { Brand } from '../../models/brand.model';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-brand-list',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './brand-list.component.html',
  styleUrls: ['./brand-list.component.css']
})
export class BrandListComponent implements OnInit {
  brands: Brand[] = [];
  nuevaMarca: Brand = { name: '' };

  constructor(private brandService: BrandService) {}

  ngOnInit(): void {
    this.cargarMarcas();
  }

  cargarMarcas(): void {
    this.brandService.getAllBrands().subscribe({
      next: (data) => {
        this.brands = data;
      },
      error: (err) => {
        console.error('Error al obtener marcas:', err);
      }
    });
  }

  crearMarca(): void {
    if (!this.nuevaMarca.name.trim()) {
      alert('El nombre no puede estar vacío');
      return;
    }

    this.brandService.createBrand(this.nuevaMarca).subscribe({
      next: (marcaCreada) => {
        this.brands.push(marcaCreada);
        this.nuevaMarca = { name: '' };
      },
      error: (err) => {
        console.error('Error al crear marca:', err);
      }
    });
  }

  eliminarMarca(id: number): void {
    if (!confirm('¿Estás seguro de eliminar esta marca?')) return;

    this.brandService.deleteBrand(id).subscribe({
      next: () => {
        this.brands = this.brands.filter(b => b.id !== id);
      },
      error: (err) => {
        console.error('Error al eliminar marca:', err);
      }
    });
  }
}

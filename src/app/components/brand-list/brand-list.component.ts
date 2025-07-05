import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Brand } from '../../model/brand.model';
import { BrandService } from '../../../services/brand.service';
import {
  isOkResponse,
  loadResponseData,
  loadResponseError
} from '../../../services/utils.service';
import { CommonModule, NgIf, NgForOf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrandPopupComponent } from '../brand-popup/brand-popup.component';
import ConstRoutes from '../../shared/constants/const-routes';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-brand-list',
  standalone: true,
  templateUrl: './brand-list.component.html',
  styleUrls: ['./brand-list.component.css'],
  imports: [CommonModule, FormsModule, NgIf, NgForOf, BrandPopupComponent, MatDialogModule],
})
export class BrandListComponent implements OnInit {
  brands: Brand[] = [];
  brandSelectedId: number | null = null;
  modePopup: 'CLOSED' | 'CREAR' | 'ACTUALIZAR' = 'CLOSED';
  error = '';
  

  constructor(private brandService: BrandService, private router: Router, private dialog: MatDialog) {}

  get brandSelected(): Brand | undefined {
    return this.brands.find(b => b.id === this.brandSelectedId);
  }

  async ngOnInit() {
    await this.loadBrands();
  }

  async loadBrands() {
    this.error = '';
    const response = await this.brandService.getAllBrands();
    if (isOkResponse(response)) {
      this.brands = loadResponseData(response);
      this.brandSelectedId = this.brands.length > 0 ? this.brands[0].id : null;
    } else {
      this.brands = [];
      this.brandSelectedId = null;
      this.error = loadResponseError(response);
    }
  }

  onLogOut() {
    localStorage.clear();
    this.router.navigate(['/' + ConstRoutes.PATH_LOGIN]);
  }

  createBrandPopup() {
    this.modePopup = 'CREAR';
  }

  updateBrandPopup(id: number) {
    this.brandSelectedId = id;
    this.modePopup = 'ACTUALIZAR';
  }

  
  async deleteBrand(id: number): Promise<void> {
  this.error = '';
  if (!id) return;

  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    data: {
      message: `¿Estás seguro de eliminar la marca <strong>"${this.brandSelected?.name}"</strong>?`
    },
    width: '350px',
  });

  const confirmDelete = await dialogRef.afterClosed().toPromise();
  if (!confirmDelete) return;

  const response = await this.brandService.deleteBrand(id);
  if (isOkResponse(response)) {
    const fueEliminada = loadResponseData(response);
    if (fueEliminada === true) {
      alert('Marca eliminada correctamente');
      await this.loadBrands();
    } else {
      this.error = 'No se pudo eliminar la marca.';
    }
  } else {
    this.error = loadResponseError(response);
  }
}


  selectBrand(id: number) {
    this.brandSelectedId = id;
  }

  onClosePopupOk(): void {
    this.modePopup = 'CLOSED';
    this.loadBrands();
  }

  onClosePopupCancel(): void {
    this.modePopup = 'CLOSED';
  }
}